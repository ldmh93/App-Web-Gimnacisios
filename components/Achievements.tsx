"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { Achievement } from "@/lib/stats";
import { cn } from "@/lib/utils";

/**
 * Rejilla de logros. Los bloqueados se muestran igualmente, con su barra de
 * progreso: saber cuánto falta motiva más que ocultarlos.
 */
export function Achievements({ items }: { items: Achievement[] }) {
  const unlocked = items.filter((a) => a.unlocked).length;

  return (
    <section aria-label="Logros" className="mt-6">
      <div className="mb-3 flex items-baseline justify-between px-1">
        <h2 className="text-sm font-semibold text-muted-foreground">Logros</h2>
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          {unlocked} de {items.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-4 transition-colors",
              a.unlocked
                ? "border-primary/40 bg-primary/5"
                : "border-border/60 bg-card/40"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "text-3xl leading-none",
                !a.unlocked && "opacity-30 grayscale"
              )}
            >
              {a.emoji}
            </span>
            <p
              className={cn(
                "mt-2 text-sm font-bold leading-snug",
                !a.unlocked && "text-muted-foreground"
              )}
            >
              {a.title}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
              {a.description}
            </p>

            {a.unlocked ? (
              <span className="mt-2 inline-block text-[11px] font-semibold text-primary">
                Conseguido
              </span>
            ) : (
              <div className="mt-2.5">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-primary/60"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(a.progress * 100)}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                </div>
                <Lock className="mt-1.5 size-3 text-muted-foreground/60" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
