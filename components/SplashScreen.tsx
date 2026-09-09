"use client";

import { motion } from "framer-motion";
import { useApp } from "@/components/AppProvider";
import { brandColor, brandName, splashImage } from "@/lib/brand";

/**
 * Pantalla de bienvenida.
 *
 * Quien decide cuándo desaparece es AppShell. Se mantiene una duración fija
 * de presentación aunque la aplicación ya esté lista —es la carta de
 * presentación de la marca, no un indicador de carga— con un tope de
 * seguridad por si algo se atasca.
 */
export function SplashScreen() {
  const { brand } = useApp();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0c0c10]"
      role="status"
      aria-label="Cargando la aplicación"
    >
      {/* Resplandor de marca detrás del logotipo */}
      <motion.div
        aria-hidden
        className="absolute size-64 rounded-full bg-primary/25 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src={splashImage(brand)}
        alt=""
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="relative h-32 w-auto max-w-[70vw] object-contain drop-shadow-[0_10px_40px_rgba(225,29,46,0.5)]"
      />

      <motion.p
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.35 }}
        className="relative mt-5 text-2xl font-extrabold uppercase tracking-[0.2em] text-white"
        style={{ color: brandColor(brand.nameColor) }}
      >
        {brand.name}
        {brand.nameAccent && (
          <span
            className="text-primary"
            style={{ color: brandColor(brand.accentColor) }}
          >
            {" "}
            {brand.nameAccent}
          </span>
        )}
      </motion.p>

      {/* Barra de carga: comunica progreso sin prometer un tiempo concreto */}
      <div className="relative mt-8 h-1 w-40 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full w-1/2 rounded-full bg-primary"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <span className="sr-only">Cargando {brandName(brand)}</span>
    </motion.div>
  );
}
