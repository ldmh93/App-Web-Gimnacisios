"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import {
  buildSession,
  EMPTY_TODAY_ROUTINE,
  todayKey,
  type TodayRoutine,
} from "@/lib/workout";
import type { Exercise, RoutineExercise, WorkoutSession } from "@/lib/types";

/**
 * Estado unificado del "entrenamiento de hoy".
 *
 * Antes existían tres conceptos separados y en conflicto: el plan de la
 * biblioteca (`todayRoutine`), el checklist del Dashboard (`dashboardChecks`)
 * y la sesión real (`activeWorkout`). Este hook deja solo DOS ideas claras:
 *
 *  - `plan`    → lo que piensas entrenar hoy (se arma desde la biblioteca).
 *  - `session` → la sesión en curso con registro de series/peso.
 *
 * "Entrenar" convierte el plan en sesión. Todas las pantallas operan sobre
 * este mismo estado, así no hay dos formas distintas de hacer lo mismo.
 */
export function useTodaySession() {
  const [todayRoutine, setTodayRoutine, hydrated] =
    useLocalStorage<TodayRoutine>(
      STORAGE_KEYS.todayRoutine,
      EMPTY_TODAY_ROUTINE
    );
  const [session, setSession] = useLocalStorage<WorkoutSession | null>(
    STORAGE_KEYS.activeWorkout,
    null
  );

  // El plan caduca a medianoche: si es de otro día, se ignora.
  const plan =
    todayRoutine.date === todayKey() ? todayRoutine.exercises : [];

  const isInPlan = (exerciseId: string) =>
    plan.some((e) => e.exerciseId === exerciseId);

  /** Añade o quita un ejercicio del plan de hoy. */
  const toggleExercise = (exercise: Exercise) => {
    setTodayRoutine({
      date: todayKey(),
      exercises: isInPlan(exercise.id)
        ? plan.filter((e) => e.exerciseId !== exercise.id)
        : [
            ...plan,
            { exerciseId: exercise.id, sets: exercise.sets, reps: exercise.reps },
          ],
    });
  };

  const clearPlan = () => setTodayRoutine(EMPTY_TODAY_ROUTINE);

  /** Convierte una lista de ejercicios en una sesión registrable en curso. */
  const startSession = (name: string, exercises: RoutineExercise[]) => {
    setSession(buildSession(name, exercises));
  };

  return {
    hydrated,
    plan,
    hasPlan: plan.length > 0,
    totalSets: plan.reduce((acc, e) => acc + e.sets, 0),
    isInPlan,
    toggleExercise,
    clearPlan,
    session,
    setSession,
    startSession,
  };
}
