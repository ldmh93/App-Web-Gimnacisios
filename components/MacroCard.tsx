"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MacroCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  hint?: string;
  accent?: boolean;
  delay?: number;
}

export function MacroCard({
  label,
  value,
  unit,
  icon: Icon,
  hint,
  accent = false,
  delay = 0,
}: MacroCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "h-full transition-shadow hover:shadow-md",
          accent && "border-primary/40 bg-primary/5"
        )}
      >
        <CardContent className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              accent ? "bg-primary text-primary-foreground" : "bg-muted text-primary"
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-0.5 truncate text-2xl font-bold tabular-nums">
              {value}
              {unit && (
                <span className="ml-1 text-sm font-medium text-muted-foreground">
                  {unit}
                </span>
              )}
            </p>
            {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
