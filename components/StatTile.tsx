"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  accent?: boolean;
  delay?: number;
}

/**
 * Métrica compacta y glanceable, pensada para filas de 3 en móvil.
 * Componente único para resúmenes numéricos (Home, resultados de Nutrición…),
 * evitando duplicar estilos de tarjeta de estadística por toda la app.
 */
export function StatTile({
  label,
  value,
  unit,
  icon: Icon,
  accent = false,
  delay = 0,
}: StatTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "h-full",
          accent && "border-primary/40 bg-primary/5"
        )}
      >
        <CardContent className="flex flex-col items-center gap-1 p-3 text-center sm:p-4">
          {Icon && (
            <Icon
              className={cn(
                "size-5",
                accent ? "text-primary" : "text-muted-foreground"
              )}
            />
          )}
          <p className="text-xl font-bold tabular-nums sm:text-2xl">
            {value}
            {unit && (
              <span className="ml-0.5 text-xs font-medium text-muted-foreground">
                {unit}
              </span>
            )}
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
