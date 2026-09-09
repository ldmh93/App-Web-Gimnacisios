"use client";

import { useEffect, useMemo, useState } from "react";
import { Dumbbell, Flame, Info, Layers, Scale } from "lucide-react";
import { StatTile } from "@/components/StatTile";
import { Card, CardContent } from "@/components/ui/card";
import { computeStats, personalRecords } from "@/lib/stats";
import { loadFromStorage, STORAGE_KEYS } from "@/lib/storage";
import type { ProgressEntry, WorkoutSession } from "@/lib/types";

/**
 * Seguimiento agregado.
 *
 * Reutiliza el mismo cálculo que ve el socio (lib/stats.ts) para que las
 * cifras no puedan discrepar entre las dos experiencias.
 */
export default function AdminProgresoPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSessions(
      loadFromStorage<WorkoutSession[]>(STORAGE_KEYS.workoutSessions, [])
    );
    setEntries(loadFromStorage<ProgressEntry[]>(STORAGE_KEYS.progress, []));
    setReady(true);
  }, []);

  const stats = useMemo(() => computeStats(sessions), [sessions]);
  const records = useMemo(() => personalRecords(sessions), [sessions]);

  if (!ready) return null;

  const last = entries.at(-1);
  const first = entries.at(0);
  const weightDelta =
    last && first ? Math.round((last.weight - first.weight) * 10) / 10 : null;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Administración
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Progreso</h1>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Entrenamientos"
          value={stats.total}
          icon={Dumbbell}
          accent
        />
        <StatTile
          label="Series"
          value={stats.totalSets}
          icon={Layers}
          delay={0.05}
        />
        <StatTile
          label="Racha"
          value={stats.streak}
          unit={stats.streak === 1 ? "día" : "días"}
          icon={Flame}
          delay={0.1}
        />
        <StatTile
          label="Registros de peso"
          value={entries.length}
          icon={Scale}
          delay={0.15}
        />
      </div>

      {stats.total === 0 && entries.length === 0 ? (
        <p className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
          Todavía no hay entrenamientos ni mediciones registradas en este
          dispositivo.
        </p>
      ) : (
        <>
          <Card>
            <CardContent className="space-y-3 pt-6">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Cumplimiento
              </h2>
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="text-2xl font-extrabold tabular-nums">
                    {stats.thisWeek}
                  </p>
                  <p className="text-xs text-muted-foreground">esta semana</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold tabular-nums">
                    {stats.bestStreak}
                  </p>
                  <p className="text-xs text-muted-foreground">mejor racha</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold tabular-nums">
                    {stats.weekVolume.toLocaleString("es")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    kg movidos (semana)
                  </p>
                </div>
                {weightDelta !== null && (
                  <div>
                    <p className="text-2xl font-extrabold tabular-nums">
                      {weightDelta > 0 ? "+" : ""}
                      {weightDelta}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      kg desde el inicio
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {records.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <h2 className="px-4 pt-5 text-sm font-semibold text-muted-foreground">
                  Récords personales
                </h2>
                <ul className="mt-2 divide-y divide-border">
                  {records.slice(0, 8).map((r) => (
                    <li
                      key={r.exerciseId}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <span className="truncate text-sm">{r.name}</span>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-primary">
                        {r.weight} kg × {r.reps}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Card className="border-sky-500/30 bg-sky-500/5">
        <CardContent className="flex gap-3 pt-6">
          <Info className="mt-0.5 size-4 shrink-0 text-sky-500" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Estos datos son los de <strong>este</strong> dispositivo. El
            seguimiento por socio necesita que las cuentas compartan servidor:
            los cálculos ya están hechos y centralizados, solo faltaría la
            fuente de datos remota.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
