"use client";

import { motion } from "framer-motion";
import { Flame, TrendingUp } from "lucide-react";
import type { TrainingStats } from "@/lib/stats";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

/**
 * Resumen de actividad de la semana: racha viva, días entrenados y volumen.
 * Pensada para leerse de un vistazo al abrir la app, sin entrar en Progreso.
 */
export function WeeklyActivity({ stats }: { stats: TrainingStats }) {
  // Índice del día de hoy con la semana empezando en lunes.
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <motion.section
      aria-label="Tu actividad esta semana"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-3xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tu semana
          </p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight">
            {stats.thisWeek} entrenamiento{stats.thisWeek !== 1 && "s"}
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold",
            stats.streak > 0
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          )}
          title={`Mejor racha: ${stats.bestStreak} días`}
        >
          <Flame className={cn("size-4", stats.streak > 0 && "fill-current")} />
          {stats.streak} {stats.streak === 1 ? "día" : "días"}
        </div>
      </div>

      {/* Días de la semana: lleno = entrenado, anillo = hoy */}
      <div className="mt-4 flex items-center justify-between gap-1.5">
        {WEEKDAY_LABELS.map((label, i) => {
          const trained = stats.weekdays[i];
          const isToday = i === todayIndex;
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                className={cn(
                  "flex h-9 w-full items-center justify-center rounded-xl text-xs font-bold transition-colors",
                  trained
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground",
                  isToday && !trained && "ring-2 ring-primary/50",
                  isToday && trained && "ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
                )}
              >
                {trained ? "✓" : label}
              </motion.span>
              <span className="text-[10px] font-medium text-muted-foreground">
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {stats.weekVolume > 0 && (
        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp className="size-3.5 text-primary" />
          {stats.weekVolume.toLocaleString("es")} kg movidos esta semana
        </p>
      )}
    </motion.section>
  );
}
