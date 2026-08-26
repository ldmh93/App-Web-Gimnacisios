"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";

/** Duraciones ofrecidas en el selector rápido de descanso. */
export const REST_PRESETS = [30, 45, 60, 90, 120, 180] as const;

/**
 * Temporizador de descanso entre series.
 *
 * Cuenta contra una marca de tiempo absoluta (`endsAtRef`) en vez de restar 1
 * por tick: así no se desfasa si el navegador ralentiza los intervalos con la
 * pestaña en segundo plano, que es justo lo que pasa entrenando con el móvil
 * en el bolsillo.
 */
export function useRestTimer() {
  const [duration, setDuration] = useLocalStorage<number>(
    STORAGE_KEYS.restSeconds,
    90
  );
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const endsAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      if (endsAtRef.current === null) return;
      const left = Math.max(
        0,
        Math.round((endsAtRef.current - Date.now()) / 1000)
      );
      setRemaining(left);
      if (left === 0) {
        setRunning(false);
        endsAtRef.current = null;
        // Vibración corta al terminar, donde el navegador lo permita.
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate?.([120, 60, 120]);
        }
      }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [running]);

  const start = useCallback(
    (seconds?: number) => {
      const total = seconds ?? duration;
      endsAtRef.current = Date.now() + total * 1000;
      setRemaining(total);
      setRunning(true);
    },
    [duration]
  );

  const skip = useCallback(() => {
    endsAtRef.current = null;
    setRemaining(0);
    setRunning(false);
  }, []);

  const toggle = useCallback(() => {
    setRunning((wasRunning) => {
      if (wasRunning) {
        // Pausar: conserva lo que queda para poder reanudar.
        endsAtRef.current = null;
        return false;
      }
      if (remaining <= 0) return false;
      endsAtRef.current = Date.now() + remaining * 1000;
      return true;
    });
  }, [remaining]);

  /** Suma o resta segundos al descanso en curso (botones +15 / −15). */
  const addTime = useCallback((seconds: number) => {
    setRemaining((prev) => {
      const next = Math.max(0, prev + seconds);
      if (endsAtRef.current !== null) {
        endsAtRef.current = Date.now() + next * 1000;
      }
      return next;
    });
  }, []);

  return {
    duration,
    setDuration,
    remaining,
    running,
    active: running || remaining > 0,
    start,
    skip,
    toggle,
    addTime,
  };
}

/** Segundos a mm:ss. */
export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
