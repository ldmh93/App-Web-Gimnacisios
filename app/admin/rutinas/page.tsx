"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PREDEFINED_ROUTINES } from "@/data/routines";
import { getExercise, muscleLabel } from "@/data/exercises";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "@/lib/storage";
import { estimateMinutes } from "@/lib/workout";
import type { CustomRoutine } from "@/lib/types";

/**
 * Catálogo de rutinas.
 *
 * Las predefinidas viven en data/routines.ts y son parte del producto: se
 * consultan aquí pero no se editan desde el panel, porque cambiarlas afectaría
 * a todos los gimnasios. Las rutinas propias sí se administran.
 */
export default function AdminRutinasPage() {
  const [custom, setCustom] = useState<CustomRoutine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCustom(loadFromStorage<CustomRoutine[]>(STORAGE_KEYS.customRoutines, []));
    setReady(true);
  }, []);

  if (!ready) return null;

  const removeCustom = (id: string) => {
    if (!window.confirm("¿Eliminar esta rutina?")) return;
    const next = custom.filter((r) => r.id !== id);
    setCustom(next);
    saveToStorage(STORAGE_KEYS.customRoutines, next);
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Administración
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Rutinas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {PREDEFINED_ROUTINES.length} predefinidas · {custom.length} propias
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">
          Predefinidas
        </h2>
        {PREDEFINED_ROUTINES.map((r) => (
          <Card key={r.id}>
            <CardContent className="space-y-2 pt-6">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {r.description}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 capitalize">
                  {r.level}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <Badge variant="secondary">{r.goal}</Badge>
                <Badge variant="secondary">
                  {r.frequency ?? `${r.daysPerWeek} días/semana`}
                </Badge>
                <Badge variant="secondary">{r.days.length} sesiones</Badge>
              </div>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                {r.days.map((d) => (
                  <li key={d.name} className="flex justify-between gap-3">
                    <span className="truncate">{d.name}</span>
                    <span className="shrink-0 tabular-nums">
                      {d.exercises.length} ej · {estimateMinutes(d.exercises)} min
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Rutinas propias
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/rutinas">
              <Pencil className="size-4" />
              Crear en la app
            </Link>
          </Button>
        </div>

        {custom.length === 0 ? (
          <p className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
            No hay rutinas creadas todavía. Se arman desde el constructor de la
            pestaña Rutinas.
          </p>
        ) : (
          custom.map((r) => (
            <Card key={r.id}>
              <CardContent className="space-y-2 pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.exercises.length} ejercicios ·{" "}
                      {estimateMinutes(r.exercises)} min
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCustom(r.id)}
                    aria-label={`Eliminar ${r.name}`}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.muscles.map((m) => (
                    <Badge key={m} variant="secondary" className="text-xs">
                      {muscleLabel(m)}
                    </Badge>
                  ))}
                </div>
                <ul className="space-y-0.5 text-sm text-muted-foreground">
                  {r.exercises.slice(0, 5).map((e) => (
                    <li key={e.exerciseId} className="flex justify-between gap-3">
                      <span className="truncate">
                        {getExercise(e.exerciseId)?.name ?? e.exerciseId}
                      </span>
                      <span className="shrink-0 tabular-nums">
                        {e.sets} × {e.reps}
                      </span>
                    </li>
                  ))}
                  {r.exercises.length > 5 && (
                    <li className="text-xs">
                      y {r.exercises.length - 5} más…
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          ))
        )}
      </section>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <ClipboardList className="mt-0.5 size-3.5 shrink-0" />
        Asignar una rutina a un socio concreto requiere que las cuentas
        compartan servidor; hoy cada dispositivo guarda la suya.
      </p>
    </div>
  );
}
