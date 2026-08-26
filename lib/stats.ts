import type { WorkoutSession } from "@/lib/types";

/**
 * Estadísticas derivadas del historial de entrenamientos.
 *
 * Todo se calcula a partir de `WorkoutSession[]`, la única fuente de verdad:
 * no se guarda ningún contador aparte que pueda desincronizarse. El coste es
 * recorrer el historial, despreciable para el volumen de un usuario real.
 */

export interface TrainingStats {
  /** Entrenamientos completados en total. */
  total: number;
  /** Días consecutivos entrenando que siguen vivos hoy. */
  streak: number;
  /** Mejor racha histórica. */
  bestStreak: number;
  /** Entrenamientos de la semana en curso (lunes a domingo). */
  thisWeek: number;
  /** Series completadas en total. */
  totalSets: number;
  /** Volumen de la semana en kg (peso × repeticiones). */
  weekVolume: number;
  /** Qué días de esta semana hubo entrenamiento, de lunes (0) a domingo (6). */
  weekdays: boolean[];
  /** Fecha ISO del último entrenamiento. */
  lastDate?: string;
}

/** Fecha local YYYY-MM-DD de una sesión. */
function dayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function todayKey(): string {
  return dayKey(new Date().toISOString());
}

/** Resta días a una clave YYYY-MM-DD respetando el calendario local. */
function shiftDay(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d + days);
  return dayKey(date.toISOString());
}

/** Lunes de la semana en curso, como clave YYYY-MM-DD. */
function mondayKey(): string {
  const now = new Date();
  const weekday = (now.getDay() + 6) % 7; // 0 = lunes
  return shiftDay(todayKey(), -weekday);
}

export function computeStats(sessions: WorkoutSession[]): TrainingStats {
  const done = sessions.filter((s) => s.completed);
  const days = new Set(done.map((s) => dayKey(s.date)));

  // Racha viva: cuenta hacia atrás desde hoy. Si hoy aún no se entrena, la
  // racha de ayer sigue contando (no se pierde hasta pasar un día completo).
  let cursor = days.has(todayKey()) ? todayKey() : shiftDay(todayKey(), -1);
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor = shiftDay(cursor, -1);
  }

  // Mejor racha histórica: recorre los días ordenados buscando huecos.
  const sorted = [...days].sort();
  let bestStreak = 0;
  let run = 0;
  let previous: string | null = null;
  for (const day of sorted) {
    run = previous !== null && shiftDay(previous, 1) === day ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
    previous = day;
  }

  const monday = mondayKey();
  const weekdays = Array.from({ length: 7 }, (_, i) => days.has(shiftDay(monday, i)));

  const weekSessions = done.filter((s) => dayKey(s.date) >= monday);
  const weekVolume = weekSessions.reduce(
    (acc, s) =>
      acc +
      s.exercises.reduce(
        (sum, e) =>
          sum +
          e.sets.reduce(
            (v, set) =>
              v + (set.done ? Number(set.weight || 0) * Number(set.reps || 0) : 0),
            0
          ),
        0
      ),
    0
  );

  const totalSets = done.reduce(
    (acc, s) =>
      acc + s.exercises.reduce((n, e) => n + e.sets.filter((x) => x.done).length, 0),
    0
  );

  return {
    total: done.length,
    streak,
    bestStreak: Math.max(bestStreak, streak),
    thisWeek: weekSessions.length,
    totalSets,
    weekVolume: Math.round(weekVolume),
    weekdays,
    lastDate: done.length > 0 ? done[done.length - 1].date : undefined,
  };
}

/* ---------------------------- Récords personales --------------------------- */

export interface PersonalRecord {
  exerciseId: string;
  name: string;
  weight: number;
  reps: number;
  date: string;
}

/** Mejor peso levantado por ejercicio, con las repeticiones de esa serie. */
export function personalRecords(sessions: WorkoutSession[]): PersonalRecord[] {
  const best = new Map<string, PersonalRecord>();
  for (const session of sessions.filter((s) => s.completed)) {
    for (const exercise of session.exercises) {
      for (const set of exercise.sets) {
        if (!set.done) continue;
        const weight = Number(set.weight || 0);
        if (weight <= 0) continue;
        const previous = best.get(exercise.exerciseId);
        if (!previous || weight > previous.weight) {
          best.set(exercise.exerciseId, {
            exerciseId: exercise.exerciseId,
            name: exercise.name,
            weight,
            reps: Number(set.reps || 0),
            date: session.date,
          });
        }
      }
    }
  }
  return [...best.values()].sort((a, b) => b.weight - a.weight);
}

/* --------------------------------- Logros --------------------------------- */

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
  /** Progreso 0-1 hacia el logro, para la barra de los bloqueados. */
  progress: number;
}

export function achievements(
  stats: TrainingStats,
  records: PersonalRecord[]
): Achievement[] {
  const ratio = (value: number, target: number) =>
    Math.max(0, Math.min(1, value / target));

  return [
    {
      id: "primer-entreno",
      emoji: "🏆",
      title: "Primer entrenamiento",
      description: "Completa tu primera sesión",
      unlocked: stats.total >= 1,
      progress: ratio(stats.total, 1),
    },
    {
      id: "racha-3",
      emoji: "⚡",
      title: "3 días seguidos",
      description: "Entrena 3 días consecutivos",
      unlocked: stats.bestStreak >= 3,
      progress: ratio(stats.bestStreak, 3),
    },
    {
      id: "racha-7",
      emoji: "🔥",
      title: "7 días consecutivos",
      description: "Una semana entera sin fallar",
      unlocked: stats.bestStreak >= 7,
      progress: ratio(stats.bestStreak, 7),
    },
    {
      id: "entrenos-10",
      emoji: "💪",
      title: "10 entrenamientos",
      description: "Completa 10 sesiones",
      unlocked: stats.total >= 10,
      progress: ratio(stats.total, 10),
    },
    {
      id: "entrenos-25",
      emoji: "🥇",
      title: "25 entrenamientos",
      description: "El hábito ya es tuyo",
      unlocked: stats.total >= 25,
      progress: ratio(stats.total, 25),
    },
    {
      id: "record",
      emoji: "🏅",
      title: "Primer récord personal",
      description: "Registra el peso de una serie",
      unlocked: records.length >= 1,
      progress: ratio(records.length, 1),
    },
    {
      id: "series-100",
      emoji: "🎯",
      title: "100 series",
      description: "Acumula 100 series completadas",
      unlocked: stats.totalSets >= 100,
      progress: ratio(stats.totalSets, 100),
    },
  ];
}
