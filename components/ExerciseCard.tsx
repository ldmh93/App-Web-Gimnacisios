"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Dumbbell,
  Lightbulb,
  Plus,
  Repeat2,
  Timer,
} from "lucide-react";
import type { Exercise } from "@/lib/types";
import { muscleLabel } from "@/data/exercises";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Imagen del ejercicio por convención de nombre: public/exercises/<id>.<ext>.
 * Prueba jpg → png → webp; si ninguna existe, no renderiza nada y queda
 * visible el placeholder que está debajo.
 */
const IMAGE_EXTENSIONS = ["jpg", "png", "webp"] as const;

function ExerciseImage({ exerciseId, alt }: { exerciseId: string; alt: string }) {
  const [extIndex, setExtIndex] = useState(0);
  if (extIndex >= IMAGE_EXTENSIONS.length) return null;
  return (
    <Image
      src={`/exercises/${exerciseId}.${IMAGE_EXTENSIONS[extIndex]}`}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      onError={() => setExtIndex((i) => i + 1)}
    />
  );
}

const LEVEL_STYLES: Record<Exercise["level"], string> = {
  principiante:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-transparent",
  intermedio:
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-transparent",
  avanzado: "bg-red-500/15 text-red-600 dark:text-red-400 border-transparent",
};

function DetailList({
  icon: Icon,
  title,
  items,
  iconClassName,
}: {
  icon: typeof CheckCircle2;
  title: string;
  items: string[];
  iconClassName?: string;
}) {
  return (
    <div>
      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Icon className={cn("size-4", iconClassName)} />
        {title}
      </h4>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ExerciseCardProps {
  exercise: Exercise;
  index?: number;
  /** Si se proporcionan, la ficha muestra el botón "Agregar a mi rutina de hoy". */
  inTodayRoutine?: boolean;
  onToggleToday?: (exercise: Exercise) => void;
}

export function ExerciseCard({
  exercise,
  index = 0,
  inTodayRoutine = false,
  onToggleToday,
}: ExerciseCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
          className="group text-left"
        >
          <Card className="h-full gap-0 overflow-hidden py-0 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg">
            {/* Imagen (si existe en public/exercises/) sobre el placeholder */}
            <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-muted via-muted to-primary/15">
              <Dumbbell className="size-10 text-muted-foreground/40 transition-transform group-hover:scale-110 group-hover:text-primary/60" />
              <ExerciseImage exerciseId={exercise.id} alt={exercise.name} />
              <Badge
                className={cn(
                  "absolute left-3 top-3 z-10 capitalize",
                  LEVEL_STYLES[exercise.level]
                )}
              >
                {exercise.level}
              </Badge>
              {inTodayRoutine && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
                  title="En tu rutina de hoy"
                >
                  <Check className="size-4" strokeWidth={3} />
                </motion.span>
              )}
            </div>
            <CardContent className="space-y-3 p-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {muscleLabel(exercise.group)}
                </p>
                <h3 className="mt-1 font-semibold leading-snug">
                  {exercise.name}
                </h3>
              </div>
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {exercise.muscles.join(" · ")}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Repeat2 className="size-3.5 text-primary" />
                  {exercise.sets} × {exercise.reps}
                </span>
                <span className="flex items-center gap-1">
                  <Timer className="size-3.5 text-primary" />
                  {exercise.rest}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("capitalize", LEVEL_STYLES[exercise.level])}>
              {exercise.level}
            </Badge>
            <Badge variant="outline">{muscleLabel(exercise.group)}</Badge>
          </div>
          <DialogTitle className="text-xl">{exercise.name}</DialogTitle>
          <DialogDescription>
            Músculos: {exercise.muscles.join(", ")}
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-muted via-muted to-primary/15">
          <Dumbbell className="size-12 text-muted-foreground/40" />
          <ExerciseImage exerciseId={exercise.id} alt={exercise.name} />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Series", value: String(exercise.sets) },
            { label: "Repeticiones", value: exercise.reps },
            { label: "Descanso", value: exercise.rest },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-muted p-3">
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {onToggleToday && (
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              size="lg"
              variant={inTodayRoutine ? "outline" : "default"}
              className={cn(
                "w-full font-semibold",
                inTodayRoutine
                  ? "border-primary/50 text-primary"
                  : "glow-primary-soft"
              )}
              onClick={() => onToggleToday(exercise)}
            >
              {inTodayRoutine ? (
                <>
                  <Check className="size-5" strokeWidth={3} />
                  En tu rutina de hoy · Toca para quitar
                </>
              ) : (
                <>
                  <Plus className="size-5" strokeWidth={3} />
                  Agregar a mi rutina del día
                </>
              )}
            </Button>
          </motion.div>
        )}

        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Equipo:</span>{" "}
          {exercise.equipment}
        </p>

        <Separator />

        <div className="space-y-5">
          <DetailList
            icon={CheckCircle2}
            title="Técnica correcta"
            items={exercise.technique}
            iconClassName="text-primary"
          />
          <DetailList
            icon={AlertTriangle}
            title="Errores comunes"
            items={exercise.commonMistakes}
            iconClassName="text-amber-500"
          />
          <DetailList
            icon={Lightbulb}
            title="Consejos"
            items={exercise.tips}
            iconClassName="text-sky-500"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
