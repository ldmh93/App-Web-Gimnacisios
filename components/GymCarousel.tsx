"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Carrusel de fotos del gimnasio.
 * Convención: coloca las fotos en public/gym/ nombradas foto-1.jpg,
 * foto-2.jpg, ... (hasta MAX_PHOTOS). El carrusel detecta automáticamente
 * cuáles existen; si no hay ninguna, muestra un aviso discreto.
 */
const MAX_PHOTOS = 12;
const AUTOPLAY_MS = 4500;

export function GymCarousel() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  // Detecta qué fotos existen probando su carga.
  useEffect(() => {
    let cancelled = false;
    const candidates = Array.from(
      { length: MAX_PHOTOS },
      (_, i) => `/gym/foto-${i + 1}.jpg`
    );
    Promise.all(
      candidates.map(
        (src) =>
          new Promise<string | null>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(null);
            img.src = src;
          })
      )
    ).then((results) => {
      if (cancelled) return;
      setPhotos(results.filter((r): r is string => r !== null));
      setChecked(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const go = useCallback(
    (delta: number) => {
      if (photos.length === 0) return;
      setDirection(delta >= 0 ? 1 : -1);
      setCurrent((c) => (c + delta + photos.length) % photos.length);
    },
    [photos.length]
  );

  // Autoplay
  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [photos.length, go, current]);

  if (!checked) return null;

  if (photos.length === 0) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/70 text-center sm:h-72">
        <Camera className="size-8 text-muted-foreground/50" />
        <p className="text-sm font-medium text-muted-foreground">
          Galería del gimnasio
        </p>
        <p className="max-w-xs text-xs text-muted-foreground/70">
          Agrega tus fotos como <code>foto-1.jpg</code>, <code>foto-2.jpg</code>…
          en la carpeta <code>public/gym/</code> y aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 shadow-xl">
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={photos[current]}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={photos[current]}
              alt={`Foto del gimnasio ${current + 1}`}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority={current === 0}
            />
          </motion.div>
        </AnimatePresence>
        {/* Degradado inferior para los controles */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-all hover:bg-primary sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Foto siguiente"
            className="absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-all hover:bg-primary sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
            {photos.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Ir a la foto ${i + 1}`}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === current
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-white/60 hover:bg-white"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
