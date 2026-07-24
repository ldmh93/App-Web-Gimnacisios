/**
 * Capa de persistencia local de FITCORE.
 * Hoy: LocalStorage. Mañana: sustituir estas funciones por llamadas a la API
 * (PostgreSQL + Prisma) sin tocar los componentes que las consumen.
 */

export const STORAGE_KEYS = {
  profile: "fitcore:profile",
  nutrition: "fitcore:nutrition",
  customRoutines: "fitcore:custom-routines",
  workoutSessions: "fitcore:workout-sessions",
  activeWorkout: "fitcore:active-workout",
  progress: "fitcore:progress",
  todayRoutine: "fitcore:today-routine",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export function loadFromStorage<T>(key: StorageKey, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: StorageKey, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Almacenamiento lleno o bloqueado: la app sigue funcionando en memoria.
  }
}

export function removeFromStorage(key: StorageKey): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

/**
 * Borra todos los datos locales del usuario (perfil, rutinas, progreso…)
 * previa confirmación y recarga la página. Centralizado aquí para no
 * duplicar el diálogo en el Header y en la pestaña Perfil.
 */
export function resetLocalDataWithConfirm(): void {
  if (typeof window === "undefined") return;
  const ok = window.confirm(
    "¿Borrar todos los datos guardados (rutinas, progreso, perfil)? Esta acción no se puede deshacer."
  );
  if (!ok) return;
  Object.values(STORAGE_KEYS).forEach(removeFromStorage);
  window.location.reload();
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
