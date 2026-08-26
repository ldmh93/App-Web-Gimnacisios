"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flag,
  Minus,
  Pause,
  Play,
  Plus,
  Timer,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getExercise } from "@/data/exercises";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTodaySession } from "@/hooks/useTodaySession";
import {
  formatClock,
  REST_PRESETS,
  useRestTimer,
} from "@/hooks/useRestTimer";
import { STORAGE_KEYS } from "@/lib/storage";
import type { WorkoutSession } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Modo entrenamiento: una sola cosa en pantalla a la vez.
 *
 * A diferencia del WorkoutTracker (formulario con toda la rutina a la vez, útil
 * en escritorio), aquí se entrena mirando el móvil entre series: ejercicio
 * actual grande, serie actual, botón enorme para cerrar la serie y descanso
 * automático.
 */
export default function EntrenarPage() {
  const router = useRouter();
  const { session, setSession } = useTodaySession();
  const [, setSessions] = useLocalStorage<WorkoutSession[]>(
    STORAGE_KEYS.workoutSessions,
    []
  );

  const [exIndex, setExIndex] = useState(0);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const rest = useRestTimer();

  const exercises = session?.exercises ?? [];
  const current = exercises[exIndex];
  const catalog = current ? getExercise(current.exerciseId) : undefined;

  // Serie activa: la primera sin completar del ejercicio actual.
  const setIndex = useMemo(() => {
    if (!current) return 0;
    const idx = current.sets.findIndex((s) => !s.done);
    return idx === -1 ? current.sets.length - 1 : idx;
  }, [current]);

  const totalSets = exercises.reduce((acc, e) => acc + e.sets.length, 0);
  const doneSets = exercises.reduce(
    (acc, e) => acc + e.sets.filter((s) => s.done).length,
    0
  );
  const percent = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;
  const allDone = totalSets > 0 && doneSets === totalSets;
  const next = exercises[exIndex + 1];

  /* ------------------------------ Sin sesión ----------------------------- */
  if (!session || exercises.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Dumbbell className="size-9" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight">
          No hay entrenamiento en curso
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Arma tu rutina de hoy desde la biblioteca de ejercicios o empieza una
          rutina predefinida.
        </p>
        <div className="mt-6 flex w-full flex-col gap-3">
          <Button asChild size="lg" className="font-semibold">
            <Link href="/ejercicios">Elegir ejercicios</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/rutinas">Ver rutinas</Link>
          </Button>
        </div>
      </div>
    );
  }

  /* ------------------------------- Acciones ------------------------------ */

  const patchSet = (patch: { done?: boolean; weight?: string; reps?: string }) => {
    setSession({
      ...session,
      exercises: exercises.map((e, i) =>
        i === exIndex
          ? {
              ...e,
              sets: e.sets.map((s, j) =>
                j === setIndex ? { ...s, ...patch } : s
              ),
            }
          : e
      ),
    });
  };

  const finishSet = () => {
    patchSet({
      done: true,
      weight: weight || current.sets[setIndex].weight,
      reps: reps || current.targetReps,
    });
    setWeight("");
    setReps("");

    const wasLastSet = setIndex >= current.sets.length - 1;
    const hasNextExercise = exIndex < exercises.length - 1;

    if (wasLastSet && hasNextExercise) {
      setExIndex((i) => i + 1);
      rest.start();
    } else if (!wasLastSet) {
      rest.start();
    }
    // Última serie del último ejercicio: sin descanso, toca finalizar.
  };

  const finishWorkout = () => {
    setSessions((prev) => [...prev, { ...session, completed: true }]);
    setSession(null);
    router.push("/progreso");
  };

  const discard = () => {
    if (window.confirm("¿Salir y descartar el entrenamiento en curso?")) {
      setSession(null);
      router.push("/dashboard");
    }
  };

  const media = catalog?.gif ?? catalog?.image;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-32 pt-2 sm:px-6">
      {/* ------------------------------ Cabecera ----------------------------- */}
      <div className="sticky top-16 z-30 -mx-4 mb-5 bg-background/80 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={discard}
            aria-label="Salir del entrenamiento"
          >
            <X className="size-5" />
          </Button>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-sm font-semibold">
              {session.routineName}
            </p>
            <p className="text-xs text-muted-foreground">
              {doneSets} de {totalSets} series
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0 tabular-nums">
            {exIndex + 1}/{exercises.length}
          </Badge>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${percent}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>
      </div>

      {/* ---------------------------- Ejercicio ------------------------------ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.exerciseId}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Ejercicio {exIndex + 1} de {exercises.length}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight">
            {current.name}
          </h1>
          {catalog && (
            <p className="mt-1 text-sm text-muted-foreground">
              {catalog.muscles.slice(0, 3).join(" · ")} · {catalog.equipment}
            </p>
          )}

          <div className="relative mt-4 flex h-56 items-center justify-center overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-muted via-muted to-primary/15">
            <Dumbbell className="size-12 text-muted-foreground/30" />
            {media && (
              <Image
                src={media}
                alt={current.name}
                fill
                unoptimized
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 640px"
              />
            )}
          </div>

          {/* Series como puntos: de un vistazo se ve lo hecho y lo que falta */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                Serie {setIndex + 1} de {current.sets.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Objetivo: {current.targetReps} repeticiones
              </p>
            </div>
            <div className="flex gap-1.5">
              {current.sets.map((s, i) => (
                <span
                  key={i}
                  aria-hidden
                  className={cn(
                    "size-3 rounded-full transition-colors",
                    s.done
                      ? "bg-primary"
                      : i === setIndex
                        ? "bg-primary/40 ring-2 ring-primary"
                        : "bg-muted-foreground/25"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Registro de la serie */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Peso (kg)
              </span>
              <Input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={current.sets[setIndex].weight || "—"}
                className="h-14 text-center text-lg font-semibold"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Repeticiones
              </span>
              <Input
                type="number"
                inputMode="numeric"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder={current.targetReps}
                className="h-14 text-center text-lg font-semibold"
              />
            </label>
          </div>

          {/* Acción principal */}
          {allDone ? (
            <Button
              size="lg"
              onClick={finishWorkout}
              className="glow-primary-soft mt-5 h-16 w-full text-base font-bold uppercase tracking-wide"
            >
              <Flag className="size-5" />
              Finalizar entrenamiento
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={finishSet}
              className="glow-primary-soft mt-5 h-16 w-full text-base font-bold uppercase tracking-wide"
            >
              <Check className="size-5" strokeWidth={3} />
              Finalizar serie
            </Button>
          )}

          {/* Navegación entre ejercicios */}
          <div className="mt-3 flex items-center gap-3">
            <Button
              variant="outline"
              className="h-12 flex-1"
              disabled={exIndex === 0}
              onClick={() => setExIndex((i) => Math.max(0, i - 1))}
            >
              <ChevronLeft className="size-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              className="h-12 flex-1"
              disabled={exIndex >= exercises.length - 1}
              onClick={() =>
                setExIndex((i) => Math.min(exercises.length - 1, i + 1))
              }
            >
              Siguiente
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {next && (
            <div className="mt-5 rounded-2xl border border-border/60 bg-card/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Siguiente ejercicio
              </p>
              <p className="mt-1 font-semibold">{next.name}</p>
              <p className="text-xs text-muted-foreground">
                {next.sets.length} series × {next.targetReps}
              </p>
            </div>
          )}

          {!allDone && (
            <Button
              variant="ghost"
              onClick={finishWorkout}
              className="mt-4 w-full text-muted-foreground"
            >
              <Flag className="size-4" />
              Terminar aquí y guardar
            </Button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ------------------------------ Descanso ----------------------------- */}
      <AnimatePresence>
        {rest.active && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed inset-x-0 bottom-24 z-40 px-4 lg:bottom-6"
            role="status"
            aria-live="polite"
          >
            <div className="glow-primary-soft mx-auto max-w-md rounded-3xl border border-primary/40 bg-card/95 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary">
                  <Timer className="size-5" />
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Descanso
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={rest.skip}>
                  Saltar
                </Button>
              </div>
              <p className="mt-1 text-center text-6xl font-extrabold tabular-nums tracking-tight">
                {formatClock(rest.remaining)}
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-12"
                  onClick={() => rest.addTime(-15)}
                  aria-label="Quitar 15 segundos"
                >
                  <Minus className="size-5" />
                </Button>
                <Button
                  size="icon"
                  className="size-14"
                  onClick={rest.toggle}
                  aria-label={rest.running ? "Pausar descanso" : "Reanudar descanso"}
                >
                  {rest.running ? (
                    <Pause className="size-6" />
                  ) : (
                    <Play className="size-6" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-12"
                  onClick={() => rest.addTime(15)}
                  aria-label="Añadir 15 segundos"
                >
                  <Plus className="size-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duración de descanso configurable */}
      {!rest.active && (
        <div className="mt-8 rounded-2xl border border-border/60 bg-card/40 p-4">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Timer className="size-3.5" />
            Descanso entre series
          </p>
          <div className="flex flex-wrap gap-2">
            {REST_PRESETS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => rest.setDuration(s)}
                aria-pressed={rest.duration === s}
                className={cn(
                  "min-h-[40px] rounded-full border px-4 text-sm font-medium tabular-nums transition-colors active:scale-95",
                  rest.duration === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {s < 60 ? `${s}s` : `${s / 60} min`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
