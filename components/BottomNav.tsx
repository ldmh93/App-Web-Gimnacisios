"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Dumbbell,
  LayoutDashboard,
  LineChart,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Accesos principales de la barra inferior (solo móvil/tablet). */
const ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/ejercicios", label: "Ejercicios", icon: Dumbbell },
  { href: "/rutinas", label: "Rutinas", icon: ClipboardList },
  { href: "/nutricion", label: "Nutrición", icon: UtensilsCrossed },
  { href: "/progreso", label: "Progreso", icon: LineChart },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación inferior"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="flex w-full max-w-md items-center justify-around gap-1 rounded-full border border-border/60 bg-card/85 p-1.5 shadow-xl backdrop-blur-xl">
        {ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 rounded-full px-1 py-2 text-[10px] font-medium transition-colors",
                active
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="bottomnav-active"
                  className="glow-primary-soft absolute inset-0 -z-10 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="size-5" />
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
