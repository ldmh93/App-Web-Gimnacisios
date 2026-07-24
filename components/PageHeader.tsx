"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mb-6 flex flex-col gap-1.5"
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </span>
      )}
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
      {children}
    </motion.div>
  );
}
