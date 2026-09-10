"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Dumbbell,
  LineChart,
  Timer,
  UtensilsCrossed,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { Button } from "@/components/ui/button";
import { brandColor, brandName, splashImage } from "@/lib/brand";
import { PRESENTATION_SEEN } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    icon: Dumbbell,
    title: "Encuentra tu ejercicio tocando el músculo",
    body: "Un cuerpo interactivo con vista frontal y posterior. Tocas el músculo y ves sus ejercicios, con técnica, errores comunes y equipo necesario.",
  },
  {
    icon: Timer,
    title: "Entrena sin perder el hilo",
    body: "Una sola cosa en pantalla: el ejercicio, la serie y el peso. Con temporizador de descanso automático entre series.",
  },
  {
    icon: LineChart,
    title: "Mira si de verdad estás avanzando",
    body: "Peso, medidas, fotos y récords personales. Con la racha y el resumen de la semana siempre a mano.",
  },
  {
    icon: UtensilsCrossed,
    title: "Come acorde a tu objetivo",
    body: "Calcula tus calorías y macros en unos pasos, y ajústalos cuando tu cuerpo cambie. Con el nutriólogo del gimnasio a un toque.",
  },
];

/**
 * Presentación de la aplicación.
 *
 * Va entre la bienvenida de marca y el acceso, y se ve UNA sola vez: quien ya
 * conoce la app no tiene que pasar cuatro pantallas cada vez que entra. Se
 * puede saltar en cualquier momento, porque obligar a leer publicidad antes de
 * dejar entrar es la forma más rápida de perder a alguien.
 */
export default function PresentacionPage() {
  const router = useRouter();
  const { brand } = useApp();
  const [index, setIndex] = useState(0);

  const finish = () => {
    window.localStorage.setItem(PRESENTATION_SEEN, "1");
    router.replace("/login");
  };

  const slide = SLIDES[index];
  const Icon = slide.icon;
  const isLast = index === SLIDES.length - 1;

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#0c0c10] px-5 py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[460px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />

      {/* Marca y salto */}
      <div className="relative flex items-center justify-between">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={splashImage(brand)}
          alt={brandName(brand)}
          className="h-9 w-auto max-w-[45vw] object-contain"
        />
        <Button
          variant="ghost"
          onClick={finish}
          className="text-white/50 hover:text-white"
        >
          Saltar
        </Button>
      </div>

      {/* Contenido */}
      <div className="relative flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.28 }}
            className="mx-auto w-full max-w-sm text-center"
          >
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-primary/15 text-primary"
            >
              <Icon className="size-9" />
            </motion.span>
            <h1
              className="mt-6 text-2xl font-extrabold leading-tight text-white"
              style={{ color: brandColor(brand.nameColor) }}
            >
              {slide.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Paginación y avance */}
      <div className="relative mx-auto w-full max-w-sm">
        <div className="mb-5 flex justify-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir a la pantalla ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-7 bg-primary" : "w-2 bg-white/20"
              )}
            />
          ))}
        </div>
        <Button
          size="lg"
          onClick={() => (isLast ? finish() : setIndex((i) => i + 1))}
          className="glow-primary-soft h-14 w-full text-base font-bold uppercase tracking-wide"
        >
          {isLast ? "Empezar" : "Siguiente"}
          <ArrowRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}
