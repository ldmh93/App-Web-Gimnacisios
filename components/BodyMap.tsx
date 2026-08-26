"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import {
  BODY_BASE,
  BODY_CANVAS,
  MIRROR,
  REGION_SHAPES,
  type RegionShape,
} from "@/data/bodyShapes";
import {
  BODY_REGIONS,
  type BodyRegionId,
  type BodyView,
} from "@/data/muscleMap";
import { cn } from "@/lib/utils";

interface BodyMapProps {
  view: BodyView;
  onViewChange: (view: BodyView) => void;
  selected: BodyRegionId | null;
  onSelect: (id: BodyRegionId) => void;
  /** Nº de ejercicios por región, para el texto de ayuda. */
  counts?: Record<BodyRegionId, number>;
  className?: string;
}

/** Un músculo: su trazado y, si es par, su copia espejada. */
function MuscleShape({
  shape,
  className,
}: {
  shape: RegionShape;
  className: string;
}) {
  return (
    <>
      <path d={shape.d} className={className} />
      {shape.paired && (
        <path d={shape.d} transform={MIRROR} className={className} />
      )}
    </>
  );
}

export function BodyMap({
  view,
  onViewChange,
  selected,
  onSelect,
  counts,
  className,
}: BodyMapProps) {
  const regions = BODY_REGIONS.filter((r) => r.views.includes(view));

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Conmutador frente / espalda */}
      <div
        role="tablist"
        aria-label="Vista del cuerpo"
        className="relative flex items-center gap-1 rounded-full border border-border/60 bg-card/70 p-1 backdrop-blur-xl"
      >
        {(["front", "back"] as const).map((v) => {
          const active = view === v;
          return (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onViewChange(v)}
              className={cn(
                "relative min-h-[40px] rounded-full px-5 text-sm font-semibold transition-colors duration-200 active:scale-[0.96]",
                active ? "text-primary-foreground" : "text-muted-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="bodymap-view"
                  className="absolute inset-0 -z-10 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {v === "front" ? "Frente" : "Espalda"}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onViewChange(view === "front" ? "back" : "front")}
          aria-label="Girar el cuerpo"
          className="ml-1 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground active:scale-90"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>

      {/* Figura */}
      <svg
        viewBox={`0 0 ${BODY_CANVAS.width} ${BODY_CANVAS.height}`}
        className="h-auto w-full max-w-[280px] touch-manipulation select-none"
        role="group"
        aria-label={`Mapa muscular, vista ${view === "front" ? "frontal" : "posterior"}. Toca un músculo para ver sus ejercicios.`}
      >
        {/* Silueta continua: evita que las juntas entre músculos dejen ver el fondo */}
        <g className="fill-muted-foreground/20">
          {BODY_BASE[view].map((shape, i) => (
            <MuscleShape
              key={`base-${i}`}
              shape={shape}
              className="fill-muted-foreground/20"
            />
          ))}
        </g>

        {/* Músculos tocables */}
        {regions.map((region) => {
          const shape = REGION_SHAPES[view][region.id];
          if (!shape) return null;
          const active = selected === region.id;
          const count = counts?.[region.id];
          return (
            <g
              key={region.id}
              role="button"
              tabIndex={0}
              aria-label={`${region.label}${count ? `, ${count} ejercicios` : ""}`}
              aria-pressed={active}
              onClick={() => onSelect(region.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(region.id);
                }
              }}
              className={cn(
                "cursor-pointer outline-none transition-[filter] duration-200",
                "focus-visible:drop-shadow-[0_0_6px_var(--ring)]",
                active && "drop-shadow-[0_0_10px_var(--primary)]"
              )}
            >
              <MuscleShape
                shape={shape}
                className={cn(
                  "stroke-background/50 transition-colors duration-200 [stroke-width:1]",
                  active
                    ? "fill-primary"
                    : "fill-muted-foreground/45 hover:fill-primary/60"
                )}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
