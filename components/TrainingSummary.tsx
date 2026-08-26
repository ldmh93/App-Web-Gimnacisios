"use client";

import { motion } from "framer-motion";
import { Dumbbell, Flame, Layers, Trophy } from "lucide-react";
import { StatTile } from "@/components/StatTile";
import { Card, CardContent } from "@/components/ui/card";
import type { PersonalRecord, TrainingStats } from "@/lib/stats";

/**
 * Resumen de entrenamiento para la pantalla de Progreso: cifras acumuladas y
 * récords personales. Complementa a las gráficas de peso y medidas, que miden
 * el cuerpo pero no lo que se levanta.
 */
export function TrainingSummary({
  stats,
  records,
}: {
  stats: TrainingStats;
  records: PersonalRecord[];
}) {
  return (
    <section aria-label="Resumen de entrenamiento" className="mb-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Entrenamientos"
          value={stats.total}
          icon={Dumbbell}
          accent
          delay={0}
        />
        <StatTile
          label="Racha actual"
          value={stats.streak}
          unit={stats.streak === 1 ? "día" : "días"}
          icon={Flame}
          delay={0.05}
        />
        <StatTile
          label="Series totales"
          value={stats.totalSets}
          icon={Layers}
          delay={0.1}
        />
        <StatTile
          label="Mejor racha"
          value={stats.bestStreak}
          unit={stats.bestStreak === 1 ? "día" : "días"}
          icon={Trophy}
          delay={0.15}
        />
      </div>

      {records.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4"
        >
          <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
            Récords personales
          </h2>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {records.slice(0, 6).map((r) => (
                  <li
                    key={r.exerciseId}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.date).toLocaleDateString("es", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="shrink-0 text-right">
                      <span className="text-lg font-extrabold tabular-nums text-primary">
                        {r.weight}
                      </span>
                      <span className="ml-1 text-xs text-muted-foreground">
                        kg × {r.reps}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </section>
  );
}
