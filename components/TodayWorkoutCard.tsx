"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Dumbbell, Play } from "lucide-react";
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
import { getExercise } from "@/data/exercises";
import type { RoutineExercise, WorkoutSession } from "@/lib/types";

interface TodayWorkoutCardProps {
  /** Nombre del entrenamiento planificado para hoy. */
  name: string;
  /** Etiqueta de origen (p. ej. "armado por ti" o "sugerencia AURA GYM"). */
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
 * principal ("Entrenar" o "Continuar"). Sustituye al antiguo checklist paralelo
 * del Dashboard, que no llegaba a registrar una sesión real.
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

  return (
    <motion.section
      aria-label="Entrenamiento de hoy"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-primary/40">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <CardDescription>
                {inProgress ? "Entrenamiento en curso" : source}
              </CardDescription>
              <CardTitle className="mt-1 text-xl uppercase tracking-wide">
                {title.replace("—", "·")}
              </CardTitle>
            </div>
            <Badge variant="outline" className="shrink-0 gap-1.5">
              <Dumbbell className="size-3.5" />
              {exercises.length} ejerc.
            </Badge>
          </div>
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

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="glow-primary-soft flex-1 font-semibold"
              onClick={onTrain}
            >
              <Play className="size-5" />
              {inProgress ? "Continuar entrenamiento" : "Entrenar"}
            </Button>
            <Button asChild variant="ghost" className="sm:w-auto">
              <Link href="/rutinas#predefinidas">Ver otras rutinas</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
