"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Flag, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import type { WorkoutSession } from "@/lib/types";

interface WorkoutTrackerProps {
  session: WorkoutSession;
  onChange: (session: WorkoutSession) => void;
  onFinish: () => void;
  onDiscard: () => void;
}

export function WorkoutTracker({
  session,
  onChange,
  onFinish,
  onDiscard,
}: WorkoutTrackerProps) {
  const totalSets = session.exercises.reduce((acc, e) => acc + e.sets.length, 0);
  const doneSets = session.exercises.reduce(
    (acc, e) => acc + e.sets.filter((s) => s.done).length,
    0
  );
  const percent = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    patch: Partial<WorkoutSession["exercises"][number]["sets"][number]>
  ) => {
    const exercises = session.exercises.map((exercise, i) =>
      i === exerciseIndex
        ? {
            ...exercise,
            sets: exercise.sets.map((set, j) =>
              j === setIndex ? { ...set, ...patch } : set
            ),
          }
        : exercise
    );
    onChange({ ...session, exercises });
  };

  const updateNotes = (exerciseIndex: number, notes: string) => {
    const exercises = session.exercises.map((exercise, i) =>
      i === exerciseIndex ? { ...exercise, notes } : exercise
    );
    onChange({ ...session, exercises });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Cabecera de la sesión */}
      <Card className="border-primary/40">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardDescription>Entrenamiento en curso</CardDescription>
              <CardTitle className="mt-1 text-xl">{session.routineName}</CardTitle>
            </div>
            <Badge variant="outline" className="gap-1.5">
              <CheckCircle2 className="size-3.5 text-primary" />
              {doneSets}/{totalSets} series
            </Badge>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={percent} className="h-2.5" />
            <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-primary">
              {Math.round(percent)}%
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Ejercicios */}
      {session.exercises.map((exercise, exerciseIndex) => (
        <Card key={exercise.exerciseId}>
          <CardHeader>
            <CardTitle className="text-base">
              {exerciseIndex + 1}. {exercise.name}
            </CardTitle>
            <CardDescription>
              Objetivo: {exercise.targetSets} × {exercise.targetReps}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Cabecera de columnas */}
            <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-3 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid-cols-[6rem_1fr_1fr]">
              <span>Serie</span>
              <span>Peso (kg)</span>
              <span>Reps hechas</span>
            </div>
            {exercise.sets.map((set, setIndex) => (
              <div
                key={setIndex}
                className="grid grid-cols-[auto_1fr_1fr] items-center gap-3 sm:grid-cols-[6rem_1fr_1fr]"
              >
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <Checkbox
                    checked={set.done}
                    onCheckedChange={(v) =>
                      updateSet(exerciseIndex, setIndex, { done: v === true })
                    }
                    className="size-5"
                  />
                  <span className={set.done ? "text-primary" : undefined}>
                    {setIndex + 1}
                  </span>
                </label>
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  placeholder="0"
                  value={set.weight}
                  onChange={(e) =>
                    updateSet(exerciseIndex, setIndex, { weight: e.target.value })
                  }
                  aria-label={`Peso serie ${setIndex + 1}`}
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="0"
                  value={set.reps}
                  onChange={(e) =>
                    updateSet(exerciseIndex, setIndex, { reps: e.target.value })
                  }
                  aria-label={`Repeticiones serie ${setIndex + 1}`}
                />
              </div>
            ))}
            <Textarea
              value={exercise.notes}
              onChange={(e) => updateNotes(exerciseIndex, e.target.value)}
              placeholder="Notas (sensaciones, ajustes de peso, técnica...)"
              className="min-h-16 resize-none text-sm"
            />
          </CardContent>
        </Card>
      ))}

      {/* Acciones */}
      <div className="sticky bottom-4 flex gap-3">
        <Button
          size="lg"
          className="glow-primary-soft flex-1 font-semibold"
          onClick={onFinish}
        >
          <Flag className="size-4" />
          Finalizar entrenamiento
        </Button>
        <Button size="lg" variant="outline" onClick={onDiscard}>
          <Trash2 className="size-4" />
          Descartar
        </Button>
      </div>
    </motion.div>
  );
}
