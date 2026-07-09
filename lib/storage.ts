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
  dashboardChecks: "fitcore:dashboard-checks",
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

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
