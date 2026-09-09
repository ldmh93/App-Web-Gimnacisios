"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  currentSession,
  ensureSeedAdmin,
  getAccount,
  logout as clearSession,
  type Account,
  type Role,
} from "@/lib/auth";
import {
  DEFAULT_BRAND,
  readableForeground,
  type BrandConfig,
} from "@/lib/brand";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "@/lib/storage";

interface AppContextValue {
  /** Identidad visual activa (editable desde /admin). */
  brand: BrandConfig;
  setBrand: (brand: BrandConfig) => void;
  /** Cuenta con sesión iniciada, o null. */
  account: Account | null;
  role: Role | null;
  isAdmin: boolean;
  /** false hasta que se ha leído el almacenamiento del navegador. */
  ready: boolean;
  /** Vuelve a leer la sesión (tras iniciar sesión o registrarse). */
  refresh: () => void;
  signOut: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

/**
 * Estado global de la aplicación: identidad de marca y sesión.
 *
 * Se lee una sola vez al montar y se comparte por contexto, en lugar de que
 * cada componente golpee el almacenamiento por su cuenta. Eso evita que el
 * logotipo parpadee al cambiar de pantalla.
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrandState] = useState<BrandConfig>(DEFAULT_BRAND);
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);

  const readSession = useCallback(() => {
    const session = currentSession();
    setAccount(session ? (getAccount(session.accountId) ?? null) : null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // El administrador se siembra en el primer arranque; es idempotente.
      await ensureSeedAdmin();
      if (cancelled) return;
      setBrandState(loadFromStorage<BrandConfig>(STORAGE_KEYS.brand, DEFAULT_BRAND));
      readSession();
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [readSession]);

  const setBrand = useCallback((next: BrandConfig) => {
    setBrandState(next);
    saveToStorage(STORAGE_KEYS.brand, next);
  }, []);

  /**
   * Repinta la interfaz con el color del gimnasio.
   *
   * Basta con escribir `--brand` en el elemento raíz: globals.css deriva de esa
   * única variable el fondo, el cristal de las tarjetas, los botones, los
   * bordes y las manchas de luz del fondo. Como es un estilo en línea, manda
   * tanto sobre `:root` como sobre `.dark`, así que el color del logotipo se
   * respeta en los dos temas.
   *
   * `--primary-foreground` sí se calcula aquí, porque depende del contraste:
   * sobre un acento claro el texto blanco de los botones sería ilegible.
   */
  useEffect(() => {
    const root = document.documentElement;
    const color = brand.primaryColor;
    if (!color) {
      root.style.removeProperty("--brand");
      root.style.removeProperty("--primary-foreground");
      return;
    }
    root.style.setProperty("--brand", color);
    root.style.setProperty("--primary-foreground", readableForeground(color));
  }, [brand.primaryColor]);

  const signOut = useCallback(() => {
    clearSession();
    setAccount(null);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      brand,
      setBrand,
      account,
      role: account?.role ?? null,
      isAdmin: account?.role === "admin",
      ready,
      refresh: readSession,
      signOut,
    }),
    [brand, setBrand, account, ready, readSession, signOut]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
