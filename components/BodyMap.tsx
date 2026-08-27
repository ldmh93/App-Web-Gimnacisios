"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import {
  BODY_IMAGE,
  REGION_SHAPES,
  mirrorTransform,
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
  /** Nº de ejercicios por región, para las etiquetas accesibles. */
  counts?: Record<BodyRegionId, number>;
  className?: string;
}

/** Un músculo: su trazado y, si es par, la copia reflejada sobre el eje. */
function MuscleShape({
  shape,
  axis,
  className,
  ...rest
}: {
  shape: RegionShape;
  axis: number;
  className?: string;
} & React.SVGProps<SVGPathElement>) {
  return (
    <>
      <path d={shape.d} className={className} {...rest} />
      {shape.paired && (
        <path
          d={shape.d}
          transform={mirrorTransform(axis)}
          className={className}
          {...rest}
        />
      )}
    </>
  );
}

/**
 * Mapa muscular interactivo sobre una ilustración anatómica real.
 *
 * El dibujo lo pone la imagen (public/body/*.webp); este componente solo
 * superpone las zonas tocables. El resaltado se recorta con una máscara de
 * luminancia hecha del propio contorno del cuerpo, así que es imposible que
 * pinte fuera de la figura por muy aproximado que sea el trazado.
 *
 * La capa de toque va SIN recortar y encima: agranda el objetivo del dedo sin
 * que se note visualmente.
 */
export function BodyMap({
  view,
  onViewChange,
  selected,
  onSelect,
  counts,
  className,
}: BodyMapProps) {
  const [hovered, setHovered] = useState<BodyRegionId | null>(null);
  const image = BODY_IMAGE[view];
  const regions = BODY_REGIONS.filter((r) => r.views.includes(view));
  const maskId = `body-mask-${view}`;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Conmutador frente / espalda */}
      <div
        role="tablist"
        aria-label="Vista del cuerpo"
        className="relative flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-xl"
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
                active ? "text-primary-foreground" : "text-white/60"
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
          className="ml-1 flex size-9 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white active:scale-90"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>

      <svg
        viewBox={`0 0 ${image.width} ${image.height}`}
        className="h-auto w-full max-w-[300px] touch-manipulation select-none"
        role="group"
        aria-label={`Mapa muscular, vista ${
          view === "front" ? "frontal" : "posterior"
        }. Toca un músculo para ver sus ejercicios.`}
      >
        <defs>
          <mask id={maskId}>
            <image
              href={image.mask}
              width={image.width}
              height={image.height}
              preserveAspectRatio="none"
            />
          </mask>
        </defs>

        {/* Ilustración anatómica */}
        <image
          href={image.src}
          width={image.width}
          height={image.height}
          preserveAspectRatio="none"
        />

        {/* Resaltado, recortado al contorno del cuerpo */}
        <g mask={`url(#${maskId})`} pointerEvents="none">
          {regions.map((region) => {
            const shape = REGION_SHAPES[view][region.id];
            if (!shape) return null;
            const active = selected === region.id;
            const warm = hovered === region.id;
            // En reposo se deja un tinte muy tenue: sin hover en móvil, es la
            // única pista de que la figura se puede tocar.
            const opacity = active ? 0.62 : warm ? 0.4 : 0.12;
            return (
              <MuscleShape
                key={region.id}
                shape={shape}
                axis={image.axis}
                className="fill-primary transition-opacity duration-200"
                fillOpacity={opacity}
              />
            );
          })}
        </g>

        {/* Capa de toque: sin recortar, para que el dedo tenga margen */}
        <g>
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
                aria-label={`${region.label}${
                  count ? `, ${count} ejercicios` : ""
                }`}
                aria-pressed={active}
                onClick={() => onSelect(region.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(region.id);
                  }
                }}
                onMouseEnter={() => setHovered(region.id)}
                onMouseLeave={() =>
                  setHovered((h) => (h === region.id ? null : h))
                }
                onFocus={() => setHovered(region.id)}
                onBlur={() => setHovered((h) => (h === region.id ? null : h))}
                className="cursor-pointer outline-none"
              >
                <MuscleShape
                  shape={shape}
                  axis={image.axis}
                  fill="transparent"
                  className={cn(
                    "transition-[stroke] duration-200",
                    active ? "stroke-primary" : "stroke-transparent"
                  )}
                  strokeWidth={4}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
