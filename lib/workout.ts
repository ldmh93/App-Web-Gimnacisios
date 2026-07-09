import { getExercise } from "@/data/exercises";
import { generateId } from "@/lib/storage";
import type { RoutineExercise, WorkoutSession } from "@/lib/types";

/** Fecha local en formato YYYY-MM-DD, usada para reiniciar estados diarios. */
export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Rutina que el usuario arma para hoy desde la biblioteca de ejercicios. */
export interface TodayRoutine {
  date: string;
  exercises: RoutineExercise[];
}

export const EMPTY_TODAY_ROUTINE: TodayRoutine = { date: "", exercises: [] };

/** Crea una sesión de entrenamiento registrable a partir de una lista de ejercicios. */
export function buildSession(
  routineName: string,
  exercises: RoutineExercise[]
): WorkoutSession {
  return {
    id: generateId("sesion"),
    routineName,
    date: new Date().toISOString(),
    completed: false,
    exercises: exercises.map((item) => {
      const exercise = getExercise(item.exerciseId);
      return {
        exerciseId: item.exerciseId,
        name: exercise?.name ?? item.exerciseId,
        targetSets: item.sets,
        targetReps: item.reps,
        notes: "",
        sets: Array.from({ length: item.sets }, () => ({
          done: false,
          weight: "",
          reps: "",
        })),
      };
    }),
  };
}
