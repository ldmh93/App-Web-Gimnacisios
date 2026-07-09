"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, Play, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ExerciseCard } from "@/components/ExerciseCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EXERCISES, MUSCLE_GROUPS } from "@/data/exercises";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { saveToStorage, STORAGE_KEYS } from "@/lib/storage";
import {
  buildSession,
  EMPTY_TODAY_ROUTINE,
  todayKey,
  type TodayRoutine,
} from "@/lib/workout";
import type { Exercise, MuscleGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function EjerciciosPage() {
  const router = useRouter();
  const [group, setGroup] = useState<MuscleGroup | "todos">("todos");
  const [query, setQuery] = useState("");
  const [todayRoutine, setTodayRoutine] = useLocalStorage<TodayRoutine>(
    STORAGE_KEYS.todayRoutine,
    EMPTY_TODAY_ROUTINE
  );

  // La rutina del día caduca a medianoche: si es de otro día, se ignora.
  const todayExercises =
    todayRoutine.date === todayKey() ? todayRoutine.exercises : [];

  const isInToday = (exerciseId: string) =>
    todayExercises.some((e) => e.exerciseId === exerciseId);

  const toggleToday = (exercise: Exercise) => {
    setTodayRoutine({
      date: todayKey(),
      exercises: isInToday(exercise.id)
        ? todayExercises.filter((e) => e.exerciseId !== exercise.id)
        : [
            ...todayExercises,
            { exerciseId: exercise.id, sets: exercise.sets, reps: exercise.reps },
          ],
    });
  };

  const clearToday = () => {
    if (window.confirm("¿Vaciar tu rutina de hoy?")) {
      setTodayRoutine(EMPTY_TODAY_ROUTINE);
    }
  };

  const trainNow = () => {
    saveToStorage(
      STORAGE_KEYS.activeWorkout,
      buildSession("Mi rutina de hoy", todayExercises)
    );
    router.push("/rutinas");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISES.filter((exercise) => {
      const matchesGroup = group === "todos" || exercise.group === group;
      const matchesQuery =
        q === "" ||
        exercise.name.toLowerCase().includes(q) ||
        exercise.muscles.some((m) => m.toLowerCase().includes(q));
      return matchesGroup && matchesQuery;
    });
  }, [group, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Biblioteca"
        title="Ejercicios"
        description="Técnica correcta, errores comunes y consejos de cada ejercicio. Toca una tarjeta para ver la ficha y añadirla a tu rutina de hoy."
      />

      {/* Buscador */}
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ejercicio o músculo..."
          className="pl-9"
          aria-label="Buscar ejercicio"
        />
      </div>

      {/* Filtro por grupo muscular */}
      <div
        className="mb-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Grupos musculares"
      >
        {[{ id: "todos" as const, label: "Todos" }, ...MUSCLE_GROUPS].map(
          (item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={group === item.id}
              onClick={() => setGroup(item.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                group === item.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          )
        )}
      </div>

      {/* Resultados */}
      {filtered.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
          <p className="font-medium">Sin resultados</p>
          <p className="text-sm text-muted-foreground">
            Prueba con otro término o cambia de grupo muscular.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <Badge variant="secondary">
              {filtered.length} ejercicio{filtered.length !== 1 && "s"}
            </Badge>
          </div>
          <div className="grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                inTodayRoutine={isInToday(exercise.id)}
                onToggleToday={toggleToday}
              />
            ))}
          </div>
        </>
      )}

      {/* Barra flotante: rutina del día */}
      <AnimatePresence>
        {todayExercises.length > 0 && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-x-0 bottom-4 z-40 px-4"
          >
            <div className="glow-primary-soft mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-primary/40 bg-card/95 p-3 pl-4 shadow-xl backdrop-blur-xl">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <ClipboardList className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Mi rutina de hoy</p>
                <p className="truncate text-xs text-muted-foreground">
                  {todayExercises.length} ejercicio
                  {todayExercises.length !== 1 && "s"} ·{" "}
                  {todayExercises.reduce((acc, e) => acc + e.sets, 0)} series
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearToday}
                aria-label="Vaciar rutina de hoy"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
              <Button onClick={trainNow} className="font-semibold">
                <Play className="size-4" />
                Entrenar ahora
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
