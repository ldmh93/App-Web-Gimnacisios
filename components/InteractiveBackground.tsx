"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Fondo premium con degradado dinámico e interactivo.
 * Varias manchas de color desenfocadas que se mueven en bucle (deriva) y
 * hacen parallax siguiendo el cursor, dando sensación de profundidad.
 * Solo usa transform/opacity (aceleradas por GPU) y respeta la preferencia
 * de "reducir movimiento".
 */
export function InteractiveBackground() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 40, damping: 22, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 40, damping: 22, mass: 0.6 });

  // Parallax: cada capa se desplaza distinto según la profundidad.
  const b1x = useTransform(sx, [0, 1], [-55, 55]);
  const b1y = useTransform(sy, [0, 1], [-45, 45]);
  const b2x = useTransform(sx, [0, 1], [40, -40]);
  const b2y = useTransform(sy, [0, 1], [30, -30]);
  const b3x = useTransform(sx, [0, 1], [-25, 25]);
  const b3y = useTransform(sy, [0, 1], [25, -25]);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Mancha roja principal (arriba) */}
      <motion.div
        style={{ x: b1x, y: b1y }}
        className="absolute -top-[20%] left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={
            reduce
              ? undefined
              : { scale: [1, 1.15, 1], opacity: [0.55, 0.85, 0.55] }
          }
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="size-[560px] rounded-full bg-primary/25 blur-[150px]"
        />
      </motion.div>

      {/* Mancha naranja (derecha) */}
      <motion.div
        style={{ x: b2x, y: b2y }}
        className="absolute -right-[10%] top-[30%]"
      >
        <motion.div
          animate={
            reduce
              ? undefined
              : { scale: [1.1, 0.9, 1.1], opacity: [0.35, 0.6, 0.35] }
          }
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="size-[440px] rounded-full bg-orange-500/20 blur-[140px]"
        />
      </motion.div>

      {/* Mancha carmesí profunda (abajo-izquierda) */}
      <motion.div
        style={{ x: b3x, y: b3y }}
        className="absolute -bottom-[15%] left-[-8%]"
      >
        <motion.div
          animate={
            reduce
              ? undefined
              : { scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }
          }
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="size-[480px] rounded-full bg-red-700/20 blur-[150px]"
        />
      </motion.div>
    </div>
  );
}
