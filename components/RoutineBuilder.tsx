"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LIBRARY_EXERCISES, getExercise, MUSCLE_GROUPS } from "@/data/exercises";
import { generateId } from "@/lib/storage";
import type { CustomRoutine, MuscleGroup, RoutineExercise } from "@/lib/types";

interface RoutineBuilderProps {
  onSave: (routine: CustomRoutine) => void;
  onCancel: () => void;
}

export function RoutineBuilder({ onSave, onCancel }: RoutineBuilderProps) {
  const [name, setName] = useState("");
  const [muscles, setMuscles] = useState<MuscleGroup[]>([]);
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);

  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState("4");
  const [reps, setReps] = useState("10");

  // Si hay músculos marcados, el selector muestra solo sus ejercicios.
  const availableExercises = useMemo(() => {
    const pool =
      muscles.length === 0
        ? LIBRARY_EXERCISES
        : LIBRARY_EXERCISES.filter((e) => muscles.includes(e.group));
    return pool.filter((e) => !exercises.some((x) => x.exerciseId === e.id));
  }, [muscles, exercises]);

  const toggleMuscle = (muscle: MuscleGroup, checked: boolean) => {
    setMuscles((prev) =>
      checked ? [...prev, muscle] : prev.filter((m) => m !== muscle)
    );
  };

  const addExercise = () => {
    if (!selectedExercise) return;
    const parsedSets = Math.max(1, Math.min(10, Number(sets) || 4));
    setExercises((prev) => [
      ...prev,
      { exerciseId: selectedExercise, sets: parsedSets, reps: reps || "10" },
    ]);
    setSelectedExercise("");
  };

  const removeExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((e) => e.exerciseId !== exerciseId));
  };

  const canSave = name.trim().length > 0 && exercises.length > 0;

  const save = () => {
    if (!canSave) return;
    onSave({
      id: generateId("rutina"),
      name: name.trim(),
      muscles,
      exercises,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <Card className="border-primary/40">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Nueva rutina</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Cerrar">
          <X className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="routine-name">Nombre de la rutina</Label>
          <Input
            id="routine-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Pierna completa"
            maxLength={40}
          />
        </div>

        {/* Músculos */}
        <div className="space-y-2">
          <Label>Selecciona músculos (filtra los ejercicios)</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {MUSCLE_GROUPS.map((m) => (
              <label
                key={m.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10"
              >
                <Checkbox
                  checked={muscles.includes(m.id)}
                  onCheckedChange={(v) => toggleMuscle(m.id, v === true)}
                />
                {m.label}
              </label>
            ))}
          </div>
        </div>

        {/* Añadir ejercicios */}
        <div className="space-y-2">
          <Label>Agregar ejercicios</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Elige un ejercicio" />
              </SelectTrigger>
              <SelectContent>
                {availableExercises.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                max={10}
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="w-20"
                aria-label="Series"
                placeholder="Series"
              />
              <Input
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-24"
                aria-label="Repeticiones"
                placeholder="Reps"
              />
              <Button
                type="button"
                onClick={addExercise}
                disabled={!selectedExercise}
                aria-label="Añadir ejercicio"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Series × repeticiones (ej. 4 × 10). Las repeticiones admiten rangos
            como “8-12”.
          </p>
        </div>

        {/* Lista de ejercicios añadidos */}
        {exercises.length > 0 && (
          <ul className="divide-y rounded-lg border">
            {exercises.map((item, i) => {
              const exercise = getExercise(item.exerciseId);
              return (
                <li
                  key={item.exerciseId}
                  className="flex items-center justify-between gap-3 px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {i + 1}. {exercise?.name ?? item.exerciseId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.sets} × {item.reps}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(item.exerciseId)}
                    aria-label={`Quitar ${exercise?.name}`}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex gap-3">
          <Button onClick={save} disabled={!canSave} className="flex-1">
            Guardar rutina
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
