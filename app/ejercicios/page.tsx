"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ClipboardList,
  Heart,
  Play,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ExerciseCard } from "@/components/ExerciseCard";
import { BodyMap } from "@/components/BodyMap";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LIBRARY_EXERCISES } from "@/data/exercises";
import {
  BODY_REGIONS,
  bodyRegion,
  exercisesForRegion,
  regionCounts,
  type BodyRegionId,
  type BodyView,
} from "@/data/muscleMap";
import { useTodaySession } from "@/hooks/useTodaySession";
import { useFavorites } from "@/hooks/useFavorites";
import type { Level } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Cuántas tarjetas se muestran por tanda (carga progresiva). */
const PAGE_SIZE = 48;

const LEVELS: Level[] = ["principiante", "intermedio", "avanzado"];

/** Equipos más frecuentes de la biblioteca, para el filtro. */
const EQUIPMENT_OPTIONS = (() => {
  const counts = new Map<string, number>();
  for (const e of LIBRARY_EXERCISES) {
    counts.set(e.equipment, (counts.get(e.equipment) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name]) => name);
})();

export default function EjerciciosPage() {
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<BodyView>("front");
  const [region, setRegion] = useState<BodyRegionId | null>(null);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<Level | "todos">("todos");
  const [equipment, setEquipment] = useState("todos");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const counts = useMemo(() => regionCounts(), []);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  // Estado unificado del entrenamiento de hoy (compartido con Dashboard y Rutinas).
  const {
    plan: todayExercises,
    totalSets,
    isInPlan: isInToday,
    toggleExercise: toggleToday,
    clearPlan,
    startSession,
  } = useTodaySession();

  const clearToday = () => {
    if (window.confirm("¿Vaciar tu rutina de hoy?")) clearPlan();
  };

  const trainNow = () => {
    startSession("Mi rutina de hoy", todayExercises);
    router.push("/entrenar");
  };

  const activeRegion = region ? bodyRegion(region) : undefined;

  /** Selecciona un músculo y baja a los resultados. */
  const selectRegion = (id: BodyRegionId | null) => {
    setRegion(id);
    setVisibleCount(PAGE_SIZE);
    if (id) {
      const target = bodyRegion(id);
      // Si la zona no existe en la vista actual, gira el cuerpo.
      if (target && !target.views.includes(view)) setView(target.views[0]);
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      );
    }
  };

  const filtered = useMemo(() => {
    const base = region ? exercisesForRegion(region) : LIBRARY_EXERCISES;
    const q = query.trim().toLowerCase();
    return base.filter((exercise) => {
      if (level !== "todos" && exercise.level !== level) return false;
      if (equipment !== "todos" && exercise.equipment !== equipment)
        return false;
      if (onlyFavorites && !favorites.includes(exercise.id)) return false;
      if (q === "") return true;
      return (
        exercise.name.toLowerCase().includes(q) ||
        exercise.equipment.toLowerCase().includes(q) ||
        exercise.muscles.some((m) => m.toLowerCase().includes(q))
      );
    });
  }, [region, query, level, equipment, onlyFavorites, favorites]);

  const visible = filtered.slice(0, visibleCount);
  const activeFilters =
    (level !== "todos" ? 1 : 0) +
    (equipment !== "todos" ? 1 : 0) +
    (onlyFavorites ? 1 : 0);

  const resetFilters = () => {
    setLevel("todos");
    setEquipment("todos");
    setOnlyFavorites(false);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow="Biblioteca"
        title="Ejercicios"
        description="Toca un músculo en el cuerpo para ver sus ejercicios, o busca directamente por nombre y equipo."
      />

      {/* ---------------------------- Mapa muscular --------------------------- */}
      <section className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#17161c] to-[#0c0c10] p-4 shadow-xl">
          <BodyMap
            view={view}
            onViewChange={setView}
            selected={region}
            onSelect={(id) => selectRegion(id === region ? null : id)}
            counts={counts}
          />
        </div>

        {/* Panel del músculo seleccionado */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {activeRegion ? (
              <motion.div
                key={activeRegion.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="glow-primary-soft rounded-3xl border border-primary/40 bg-card/80 p-5 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Músculo seleccionado
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
                      {activeRegion.label}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {activeRegion.anatomical}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => selectRegion(null)}
                    aria-label="Quitar la selección"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <p className="mt-3 text-sm leading-relaxed">
                  {activeRegion.hint}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                    {counts[activeRegion.id]} ejercicios
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() =>
                      resultsRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                    className="font-semibold"
                  >
                    Ver ejercicios
                    <ChevronDown className="size-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="vacio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-dashed border-border/70 p-5 text-sm text-muted-foreground"
              >
                <p className="font-medium text-foreground">
                  Toca un músculo para empezar
                </p>
                <p className="mt-1">
                  Gira el cuerpo con Frente / Espalda para llegar a dorsales,
                  glúteos, femoral y pantorrillas.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Atajos por músculo (alternativa al mapa) */}
          <div className="flex flex-wrap gap-2">
            {BODY_REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => selectRegion(r.id === region ? null : r.id)}
                aria-pressed={r.id === region}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors active:scale-95",
                  r.id === region
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {r.label}
                <span className="ml-1.5 text-[11px] opacity-60">
                  {counts[r.id]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------- Buscador y filtros ------------------------- */}
      <div ref={resultsRef} className="scroll-mt-24">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Buscar ejercicio, músculo o equipo..."
              className="pl-9"
              aria-label="Buscar ejercicio"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters((v) => !v)}
              className="font-semibold"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="size-4" />
              Filtros
              {activeFilters > 0 && (
                <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary-foreground text-[11px] font-bold text-primary">
                  {activeFilters}
                </span>
              )}
            </Button>
            <Button
              variant={onlyFavorites ? "default" : "outline"}
              size="icon"
              onClick={() => {
                setOnlyFavorites((v) => !v);
                setVisibleCount(PAGE_SIZE);
              }}
              aria-pressed={onlyFavorites}
              aria-label="Ver solo favoritos"
            >
              <Heart className={cn("size-4", onlyFavorites && "fill-current")} />
            </Button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mb-4 space-y-3 rounded-2xl border border-border/60 bg-card/50 p-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Nivel
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(["todos", ...LEVELS] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => {
                          setLevel(l);
                          setVisibleCount(PAGE_SIZE);
                        }}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-sm capitalize transition-colors active:scale-95",
                          level === l
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Equipamiento
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["todos", ...EQUIPMENT_OPTIONS].map((eq) => (
                      <button
                        key={eq}
                        type="button"
                        onClick={() => {
                          setEquipment(eq);
                          setVisibleCount(PAGE_SIZE);
                        }}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-sm transition-colors active:scale-95",
                          equipment === eq
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {eq}
                      </button>
                    ))}
                  </div>
                </div>
                {activeFilters > 0 && (
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Quitar filtros
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ----------------------------- Resultados ----------------------------- */}
        {filtered.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
            <p className="font-medium">Sin resultados</p>
            <p className="text-sm text-muted-foreground">
              {onlyFavorites
                ? "Todavía no has guardado favoritos. Toca el corazón de una tarjeta."
                : "Prueba con otro término, músculo o filtro."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="secondary">
                {filtered.length} ejercicio{filtered.length !== 1 && "s"}
              </Badge>
              {activeRegion && (
                <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                  {activeRegion.label}
                </Badge>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  index={index % PAGE_SIZE}
                  inTodayRoutine={isInToday(exercise.id)}
                  onToggleToday={toggleToday}
                  isFavorite={isFavorite(exercise.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
            <div className="flex flex-col items-center gap-3 pb-24 pt-8">
              {visibleCount < filtered.length && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="font-semibold"
                >
                  Mostrar más ({filtered.length - visibleCount} restantes)
                </Button>
              )}
              <p className="text-center text-[11px] text-muted-foreground/70">
                Ilustraciones y animaciones de la biblioteca importada: © Gym
                Visual — gymvisual.com
              </p>
            </div>
          </>
        )}
      </div>

      {/* Barra flotante: rutina del día */}
      <AnimatePresence>
        {todayExercises.length > 0 && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-x-0 bottom-24 z-40 px-4 lg:bottom-4"
          >
            <div className="glow-primary-soft mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-primary/40 bg-card/95 p-3 pl-4 shadow-xl backdrop-blur-xl">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <ClipboardList className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Mi rutina de hoy</p>
                <p className="truncate text-xs text-muted-foreground">
                  {todayExercises.length} ejercicio
                  {todayExercises.length !== 1 && "s"} · {totalSets} series
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
