"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Dumbbell, Layers, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getExercise, muscleLabel } from "@/data/exercises";
import { estimateMinutes } from "@/lib/workout";
import type { RoutineExercise, WorkoutSession } from "@/lib/types";

interface TodayWorkoutCardProps {
  /** Nombre del entrenamiento planificado para hoy. */
  name: string;
  /** Etiqueta de origen (p. ej. "armado por ti" o "sugerencia MORA'S GYM"). */
  source: string;
  /** Ejercicios planificados para hoy. */
  exercises: RoutineExercise[];
  /** Sesión en curso (si existe), para permitir continuar en vez de reiniciar. */
  session: WorkoutSession | null;
  /** Inicia o continúa el entrenamiento (la navegación la decide el contenedor). */
  onTrain: () => void;
}

/**
 * Tarjeta protagonista de la Home: el entrenamiento de hoy con UNA sola acción
 * principal ("Comenzar entrenamiento" o "Continuar"). Sustituye al antiguo
 * checklist paralelo del Dashboard, que no llegaba a registrar una sesión real.
 */
export function TodayWorkoutCard({
  name,
  source,
  exercises,
  session,
  onTrain,
}: TodayWorkoutCardProps) {
  const inProgress = Boolean(session && !session.completed);

  const doneSets = session
    ? session.exercises.reduce(
        (acc, e) => acc + e.sets.filter((s) => s.done).length,
        0
      )
    : 0;
  const totalSets = session
    ? session.exercises.reduce((acc, e) => acc + e.sets.length, 0)
    : exercises.reduce((acc, e) => acc + e.sets, 0);
  const percent = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;

  const title = inProgress && session ? session.routineName : name;
  const minutes = estimateMinutes(exercises);

  // Grupos musculares que toca la sesión, sin repetir y en orden de aparición.
  const groups = [
    ...new Set(
      exercises
        .map((item) => getExercise(item.exerciseId)?.group)
        .filter((g): g is NonNullable<typeof g> => Boolean(g))
    ),
  ].slice(0, 4);

  return (
    <motion.section
      aria-label="Entrenamiento de hoy"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glow-primary-soft border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card">
        <CardHeader>
          <CardDescription className="text-xs font-bold uppercase tracking-widest text-primary">
            {inProgress ? "Entrenamiento en curso" : "¿Listo para entrenar?"}
          </CardDescription>
          <CardTitle className="mt-1 text-2xl uppercase tracking-wide">
            {title.replace("—", "·")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{source}</p>

          {/* Datos de un vistazo: duración, nº de ejercicios y músculos */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1.5">
              <Clock className="size-3.5 text-primary" />
              {minutes} min
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Dumbbell className="size-3.5 text-primary" />
              {exercises.length} ejercicios
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Layers className="size-3.5 text-primary" />
              {totalSets} series
            </Badge>
          </div>
          {groups.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {groups.map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {muscleLabel(g)}
                </span>
              ))}
            </div>
          )}

          {inProgress && (
            <div className="mt-3 flex items-center gap-3">
              <Progress value={percent} className="h-2.5" />
              <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-primary">
                {Math.round(percent)}%
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {exercises.map((item) => {
              const exercise = getExercise(item.exerciseId);
              if (!exercise) return null;
              return (
                <li
                  key={item.exerciseId}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="min-w-0 truncate font-medium">
                    {exercise.name}
                  </span>
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                    {item.sets} × {item.reps}
                  </span>
                </li>
              );
            })}
          </ul>

          <Button
            size="lg"
            className="glow-primary-soft mt-4 h-14 w-full text-base font-bold uppercase tracking-wide"
            onClick={onTrain}
          >
            <Play className="size-5" />
            {inProgress ? "Continuar entrenamiento" : "Comenzar entrenamiento"}
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link href="/rutinas#predefinidas">Ver otras rutinas</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.section>
  );
}
