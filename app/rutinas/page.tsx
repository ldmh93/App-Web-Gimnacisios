"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Dumbbell, History, Play, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { RoutineBuilder } from "@/components/RoutineBuilder";
import { WorkoutTracker } from "@/components/WorkoutTracker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import { buildSession } from "@/lib/workout";
import type {
  CustomRoutine,
  Level,
  RoutineExercise,
  WorkoutSession,
} from "@/lib/types";
import { getExercise } from "@/data/exercises";
import { PREDEFINED_ROUTINES } from "@/data/routines";
import { cn } from "@/lib/utils";

const LEVEL_LABELS: Record<Level, string> = {
  principiante: "Principiantes",
  intermedio: "Intermedios",
  avanzado: "Avanzados",
};

const LEVEL_BADGE: Record<Level, string> = {
  principiante: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  intermedio: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  avanzado: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export default function RutinasPage() {
  const [activeWorkout, setActiveWorkout, hydrated] =
    useLocalStorage<WorkoutSession | null>(STORAGE_KEYS.activeWorkout, null);
  const [customRoutines, setCustomRoutines] = useLocalStorage<CustomRoutine[]>(
    STORAGE_KEYS.customRoutines,
    []
  );
  const [sessions, setSessions] = useLocalStorage<WorkoutSession[]>(
    STORAGE_KEYS.workoutSessions,
    []
  );
  const [building, setBuilding] = useState(false);

  const startWorkout = (name: string, exercises: RoutineExercise[]) => {
    setActiveWorkout(buildSession(name, exercises));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishWorkout = () => {
    if (!activeWorkout) return;
    setSessions((prev) => [...prev, { ...activeWorkout, completed: true }]);
    setActiveWorkout(null);
  };

  const discardWorkout = () => {
    if (window.confirm("¿Descartar el entrenamiento en curso?")) {
      setActiveWorkout(null);
    }
  };

  const deleteRoutine = (id: string) => {
    if (window.confirm("¿Eliminar esta rutina?")) {
      setCustomRoutines((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow="Entrenamiento"
        title="Rutinas"
        description="Entrena con rutinas listas para usar, crea las tuyas y registra cada serie con peso y repeticiones."
      />

      {hydrated && activeWorkout ? (
        <WorkoutTracker
          session={activeWorkout}
          onChange={setActiveWorkout}
          onFinish={finishWorkout}
          onDiscard={discardWorkout}
        />
      ) : (
        <Tabs defaultValue="predefinidas">
          <TabsList className="mb-6 w-full sm:w-auto">
            <TabsTrigger value="predefinidas" className="flex-1 sm:flex-none">
              <CalendarDays className="size-4" />
              Predefinidas
            </TabsTrigger>
            <TabsTrigger value="mis-rutinas" className="flex-1 sm:flex-none">
              <Dumbbell className="size-4" />
              Mis rutinas
            </TabsTrigger>
            <TabsTrigger value="historial" className="flex-1 sm:flex-none">
              <History className="size-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          {/* ---------------------------- Predefinidas --------------------------- */}
          <TabsContent value="predefinidas" id="predefinidas" className="space-y-10">
            {(["principiante", "intermedio", "avanzado"] as Level[]).map(
              (level) => (
                <section key={level} aria-label={LEVEL_LABELS[level]}>
                  <h2 className="mb-4 text-lg font-bold">
                    {LEVEL_LABELS[level]}
                  </h2>
                  <div className="space-y-4">
                    {PREDEFINED_ROUTINES.filter((r) => r.level === level).map(
                      (routine, index) => (
                        <motion.div
                          key={routine.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: index * 0.05 }}
                        >
                          <Card>
                            <CardHeader>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                  className={cn(
                                    "border-transparent capitalize",
                                    LEVEL_BADGE[routine.level]
                                  )}
                                >
                                  {routine.level}
                                </Badge>
                                <Badge variant="outline">
                                  {routine.frequency ??
                                    `${routine.daysPerWeek} días/semana`}
                                </Badge>
                              </div>
                              <CardTitle className="mt-1">
                                {routine.name}
                              </CardTitle>
                              <CardDescription>
                                {routine.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Accordion type="single" collapsible>
                                {routine.days.map((day) => (
                                  <AccordionItem key={day.name} value={day.name}>
                                    <AccordionTrigger className="text-sm font-medium">
                                      {day.name}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <ul className="mb-4 space-y-2">
                                        {day.exercises.map((item) => {
                                          const exercise = getExercise(
                                            item.exerciseId
                                          );
                                          return (
                                            <li
                                              key={item.exerciseId}
                                              className="flex items-center justify-between gap-3 text-sm"
                                            >
                                              <span>
                                                {exercise?.name ??
                                                  item.exerciseId}
                                              </span>
                                              <span className="shrink-0 font-medium tabular-nums text-muted-foreground">
                                                {item.sets} × {item.reps}
                                              </span>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          startWorkout(
                                            `${routine.name} · ${day.name}`,
                                            day.exercises
                                          )
                                        }
                                      >
                                        <Play className="size-4" />
                                        Entrenar este día
                                      </Button>
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    )}
                  </div>
                </section>
              )
            )}
          </TabsContent>

          {/* ----------------------------- Mis rutinas --------------------------- */}
          <TabsContent value="mis-rutinas" className="space-y-6">
            {building ? (
              <RoutineBuilder
                onSave={(routine) => {
                  setCustomRoutines((prev) => [...prev, routine]);
                  setBuilding(false);
                }}
                onCancel={() => setBuilding(false)}
              />
            ) : (
              <Button onClick={() => setBuilding(true)}>
                <Plus className="size-4" />
                Crear rutina
              </Button>
            )}

            {customRoutines.length === 0 && !building ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
                <Dumbbell className="size-6 text-muted-foreground" />
                <p className="font-medium">Aún no tienes rutinas propias</p>
                <p className="text-sm text-muted-foreground">
                  Crea tu primera rutina personalizada con el constructor.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {customRoutines.map((routine) => (
                  <Card key={routine.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle>{routine.name}</CardTitle>
                          <CardDescription>
                            {routine.exercises.length} ejercicios ·{" "}
                            {routine.muscles.length > 0
                              ? routine.muscles.join(", ")
                              : "cuerpo completo"}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRoutine(routine.id)}
                          aria-label="Eliminar rutina"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="mb-4 space-y-2">
                        {routine.exercises.map((item) => {
                          const exercise = getExercise(item.exerciseId);
                          return (
                            <li
                              key={item.exerciseId}
                              className="flex items-center justify-between gap-3 text-sm"
                            >
                              <span>{exercise?.name ?? item.exerciseId}</span>
                              <span className="shrink-0 font-medium tabular-nums text-muted-foreground">
                                {item.sets} × {item.reps}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                      <Button
                        size="sm"
                        onClick={() =>
                          startWorkout(routine.name, routine.exercises)
                        }
                      >
                        <Play className="size-4" />
                        Empezar entrenamiento
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ------------------------------ Historial ---------------------------- */}
          <TabsContent value="historial">
            {sessions.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
                <History className="size-6 text-muted-foreground" />
                <p className="font-medium">Sin entrenamientos registrados</p>
                <p className="text-sm text-muted-foreground">
                  Al finalizar un entrenamiento aparecerá aquí con todos sus
                  datos.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...sessions].reverse().map((session) => {
                  const totalSets = session.exercises.reduce(
                    (acc, e) => acc + e.sets.length,
                    0
                  );
                  const doneSets = session.exercises.reduce(
                    (acc, e) => acc + e.sets.filter((s) => s.done).length,
                    0
                  );
                  return (
                    <Card key={session.id}>
                      <CardContent className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {session.routineName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.date).toLocaleDateString("es", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}{" "}
                            · {doneSets}/{totalSets} series completadas
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSession(session.id)}
                          aria-label="Eliminar sesión"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
