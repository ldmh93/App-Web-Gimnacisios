import { generateId, loadFromStorage, saveToStorage, STORAGE_KEYS } from "@/lib/storage";

/**
 * Avisos que el administrador envía a los socios.
 *
 * Son notificaciones DENTRO de la aplicación, no push del sistema: enviar push
 * a un teléfono exige service worker, permisos del navegador y un servidor que
 * las despache, y aquí no hay servidor. Estas se ven al abrir la app, que es
 * lo que el producto puede sostener hoy sin prometer de más.
 */

export type NotificationKind = "aviso" | "promocion" | "horario" | "urgente";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  kind: NotificationKind;
  createdAt: string;
  /** Si es false, queda como borrador y el socio no la ve. */
  published: boolean;
}

export const NOTIFICATION_KINDS: {
  id: NotificationKind;
  label: string;
  className: string;
}[] = [
  { id: "aviso", label: "Aviso", className: "bg-sky-500/15 text-sky-500" },
  {
    id: "promocion",
    label: "Promoción",
    className: "bg-emerald-500/15 text-emerald-500",
  },
  {
    id: "horario",
    label: "Horario",
    className: "bg-amber-500/15 text-amber-500",
  },
  {
    id: "urgente",
    label: "Urgente",
    className: "bg-destructive/15 text-destructive",
  },
];

export function kindMeta(kind: NotificationKind) {
  return NOTIFICATION_KINDS.find((k) => k.id === kind) ?? NOTIFICATION_KINDS[0];
}

export function loadNotifications(): AppNotification[] {
  return loadFromStorage<AppNotification[]>(STORAGE_KEYS.notifications, []);
}

export function saveNotifications(items: AppNotification[]): void {
  saveToStorage(STORAGE_KEYS.notifications, items);
}

export function createNotification(input: {
  title: string;
  body: string;
  kind: NotificationKind;
  published: boolean;
}): AppNotification {
  return {
    id: generateId("aviso"),
    title: input.title.trim(),
    body: input.body.trim(),
    kind: input.kind,
    createdAt: new Date().toISOString(),
    published: input.published,
  };
}

/** Publicadas, de la más reciente a la más antigua. */
export function publishedNotifications(): AppNotification[] {
  return loadNotifications()
    .filter((n) => n.published)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ----------------------------- Marcas de leído ---------------------------- */

export function loadReadIds(): string[] {
  return loadFromStorage<string[]>(STORAGE_KEYS.readNotifications, []);
}

export function markAllRead(ids: string[]): void {
  saveToStorage(STORAGE_KEYS.readNotifications, ids);
}

export function unreadCount(): number {
  const read = new Set(loadReadIds());
  return publishedNotifications().filter((n) => !read.has(n.id)).length;
}
