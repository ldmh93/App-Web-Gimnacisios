"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Dumbbell,
  Home,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Accesos principales de la barra inferior (solo móvil/tablet). */
const ITEMS = [
  { href: "/dashboard", label: "Hoy", icon: Home },
  { href: "/ejercicios", label: "Ejercicios", icon: Dumbbell },
  { href: "/rutinas", label: "Rutinas", icon: ClipboardList },
  { href: "/nutricion", label: "Nutrición", icon: UtensilsCrossed },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación inferior"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden"
    >
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.1 }}
        className="flex w-full max-w-md items-center justify-around gap-1 rounded-full border border-white/15 bg-background/55 p-1.5 shadow-lg shadow-black/10 ring-1 ring-black/5 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/45 dark:border-white/10"
      >
        {ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-1 py-2 text-[11px] font-medium transition-colors duration-200 active:scale-[0.92]",
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
              <motion.span
                animate={{ scale: active ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon className="size-[22px]" />
              </motion.span>
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
}
