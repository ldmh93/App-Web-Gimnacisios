import { DEMO_MEMBERS, DEMO_MEMBER_PASSWORD } from "@/data/demoMembers";
import { generateId, loadFromStorage, saveToStorage, STORAGE_KEYS } from "@/lib/storage";

/**
 * Cuentas, roles y sesión.
 *
 * AVISO HONESTO SOBRE EL ALCANCE: no hay servidor. Las cuentas viven en el
 * LocalStorage del propio dispositivo, así que esto NO es seguridad real —
 * cualquiera con acceso al navegador puede leer o alterar los datos. Sirve
 * para separar experiencias (usuario / administrador) y para demostrar el
 * producto; el día que haya API, se sustituyen las funciones de este módulo
 * por llamadas de red y las pantallas no se enteran.
 *
 * Las contraseñas se guardan hasheadas con SHA-256 en vez de en claro. Eso
 * evita el bochorno de dejarlas legibles, pero sin sal ni derivación lenta no
 * resiste un ataque serio: es higiene, no protección.
 */

export type Role = "usuario" | "admin";

export interface Membership {
  /** Id del plan en GYM_PLANS. */
  plan: string;
  /** Alta en formato ISO (YYYY-MM-DD). */
  since: string;
  /** Vencimiento en formato ISO. Vacío = sin vencimiento. */
  until: string;
  active: boolean;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
  membership?: Membership;
}

export interface AuthSession {
  accountId: string;
  role: Role;
  startedAt: string;
}

/** Credenciales sembradas en el primer arranque, para poder demostrar la app. */
export const DEMO_ADMIN = {
  email: "admin@marafitness.app",
  password: "admin1234",
} as const;

export const DEMO_MEMBER = {
  email: "demo@marafitness.app",
  password: "demo1234",
  name: "Andrea Salazar",
} as const;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** SHA-256 en hexadecimal. Ver el aviso de la cabecera sobre su alcance. */
export async function hashPassword(password: string): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    // Entornos sin WebCrypto (muy raros): mejor un marcador que un fallo.
    return `plano:${password}`;
  }
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function listAccounts(): Account[] {
  return loadFromStorage<Account[]>(STORAGE_KEYS.accounts, []);
}

export function saveAccounts(accounts: Account[]): void {
  saveToStorage(STORAGE_KEYS.accounts, accounts);
}

export function findAccount(email: string): Account | undefined {
  const target = normalizeEmail(email);
  return listAccounts().find((a) => a.email === target);
}

export function getAccount(id: string): Account | undefined {
  return listAccounts().find((a) => a.id === id);
}

/**
 * Crea las cuentas de demostración la primera vez que se abre la aplicación:
 * un administrador y un socio. Es idempotente, así que no pisa nada si ya
 * existen.
 */
export async function ensureSeedAccounts(): Promise<void> {
  const accounts = listAccounts();
  const next = [...accounts];

  if (!next.some((a) => a.role === "admin")) {
    next.push({
      id: generateId("cuenta"),
      name: "Administrador",
      email: DEMO_ADMIN.email,
      passwordHash: await hashPassword(DEMO_ADMIN.password),
      role: "admin",
      createdAt: new Date().toISOString(),
    });
  }

  // Socios de ejemplo: sin ellos el panel de administración se enseña vacío.
  const hash = await hashPassword(DEMO_MEMBER_PASSWORD);
  for (const seed of DEMO_MEMBERS) {
    if (next.some((a) => a.email === seed.email)) continue;

    const since = new Date();
    since.setDate(since.getDate() - seed.joinedDaysAgo);
    const until = new Date();
    until.setDate(until.getDate() + seed.expiresInDays);

    next.push({
      id: generateId("cuenta"),
      name: seed.name,
      email: seed.email,
      passwordHash: hash,
      role: "usuario",
      createdAt: since.toISOString(),
      membership: seed.plan
        ? {
            plan: seed.plan,
            since: since.toISOString().slice(0, 10),
            until: until.toISOString().slice(0, 10),
            active: true,
          }
        : undefined,
    });
  }

  if (next.length !== accounts.length) saveAccounts(next);
}

export type AuthResult =
  | { ok: true; account: Account }
  | { ok: false; error: string };

export async function register(input: {
  name: string;
  email: string;
  password: string;
  role?: Role;
}): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  if (!input.name.trim()) return { ok: false, error: "Escribe tu nombre." };
  if (!email.includes("@")) return { ok: false, error: "El correo no es válido." };
  if (input.password.length < 6) {
    return { ok: false, error: "La contraseña necesita al menos 6 caracteres." };
  }
  if (findAccount(email)) {
    return { ok: false, error: "Ya existe una cuenta con ese correo." };
  }

  const account: Account = {
    id: generateId("cuenta"),
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    role: input.role ?? "usuario",
    createdAt: new Date().toISOString(),
  };
  saveAccounts([...listAccounts(), account]);
  return { ok: true, account };
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  const account = findAccount(email);
  if (!account) return { ok: false, error: "No hay ninguna cuenta con ese correo." };
  const hash = await hashPassword(password);
  if (hash !== account.passwordHash) {
    return { ok: false, error: "La contraseña no es correcta." };
  }
  startSession(account);
  return { ok: true, account };
}

export function startSession(account: Account): AuthSession {
  const session: AuthSession = {
    accountId: account.id,
    role: account.role,
    startedAt: new Date().toISOString(),
  };
  saveToStorage(STORAGE_KEYS.authSession, session);
  return session;
}

export function currentSession(): AuthSession | null {
  return loadFromStorage<AuthSession | null>(STORAGE_KEYS.authSession, null);
}

export function logout(): void {
  saveToStorage<AuthSession | null>(STORAGE_KEYS.authSession, null);
}

/** Actualiza una cuenta existente y devuelve la lista completa ya guardada. */
export function updateAccount(id: string, patch: Partial<Account>): Account[] {
  const accounts = listAccounts().map((a) =>
    a.id === id ? { ...a, ...patch, id: a.id } : a
  );
  saveAccounts(accounts);
  return accounts;
}

export function deleteAccount(id: string): Account[] {
  const accounts = listAccounts().filter((a) => a.id !== id);
  saveAccounts(accounts);
  return accounts;
}
