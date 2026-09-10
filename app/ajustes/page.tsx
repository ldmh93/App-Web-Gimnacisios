"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  Info,
  LogOut,
  RotateCcw,
  ShieldCheck,
  Timer,
  Trash2,
  UserRound,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { PageHeader } from "@/components/PageHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { REST_PRESETS, useRestTimer } from "@/hooks/useRestTimer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { resetDemoData, DEMO_USER } from "@/lib/demoData";
import { brandName } from "@/lib/brand";
import { resetLocalDataWithConfirm, STORAGE_KEYS } from "@/lib/storage";
import { cn } from "@/lib/utils";

/** Fila de ajuste: etiqueta a la izquierda, control a la derecha. */
function Row({
  icon: Icon,
  label,
  hint,
  children,
}: {
  icon: typeof Bell;
  label: string;
  hint?: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3.5">
      <span className="flex min-w-0 items-center gap-3">
        <Icon className="size-5 shrink-0 text-primary" />
        <span className="min-w-0">
          <span className="block font-medium">{label}</span>
          {hint && (
            <span className="block text-xs text-muted-foreground">{hint}</span>
          )}
        </span>
      </span>
      {children}
    </li>
  );
}

/**
 * Ajustes de la aplicación.
 *
 * Recoge lo que antes estaba repartido entre el menú del header y el pie de la
 * pestaña Perfil (tema y borrado de datos) y lo reúne en un solo sitio, que es
 * donde la gente lo busca. Perfil se queda con la identidad del socio.
 */
export default function AjustesPage() {
  const router = useRouter();
  const { brand, account, isAdmin, signOut } = useApp();
  const rest = useRestTimer();
  const [notifyOn, setNotifyOn] = useLocalStorage<boolean>(
    STORAGE_KEYS.notifyEnabled,
    true
  );
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);
  if (!ready) return null;

  const exit = () => {
    signOut();
    router.replace("/login");
  };

  const restoreDemo = () => {
    if (
      !window.confirm(
        "¿Restaurar los datos de demostración? Se sustituirá tu progreso actual por el del socio de ejemplo."
      )
    )
      return;
    resetDemoData();
    window.location.href = "/dashboard";
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow="Configuración"
        title="Ajustes"
        description="Apariencia, entrenamiento, avisos y datos de tu cuenta."
      />

      {/* Cuenta */}
      <motion.section
        aria-label="Cuenta"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
          Cuenta
        </h2>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              <Row
                icon={UserRound}
                label={account?.name ?? "Sin sesión"}
                hint={account?.email}
              >
                <Button asChild variant="outline" size="sm">
                  <Link href="/perfil">Ver perfil</Link>
                </Button>
              </Row>
              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-muted/60"
                  >
                    <span className="flex items-center gap-3">
                      <ShieldCheck className="size-5 text-primary" />
                      <span className="font-medium">
                        Panel de administración
                      </span>
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </motion.section>

      {/* Apariencia */}
      <section aria-label="Apariencia" className="mt-6">
        <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
          Apariencia
        </h2>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              <Row
                icon={Bell}
                label="Tema"
                hint="Claro u oscuro, a tu gusto"
              >
                <ThemeToggle />
              </Row>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Entrenamiento */}
      <section aria-label="Entrenamiento" className="mt-6">
        <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
          Entrenamiento
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Timer className="size-4 text-primary" />
              Descanso entre series
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Es el que se pone en marcha solo al cerrar cada serie.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {REST_PRESETS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => rest.setDuration(s)}
                  aria-pressed={rest.duration === s}
                  className={cn(
                    "min-h-[44px] rounded-full border px-4 text-sm font-medium tabular-nums transition-colors active:scale-95",
                    rest.duration === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s < 60 ? `${s} s` : `${s / 60} min`}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Avisos */}
      <section aria-label="Avisos" className="mt-6">
        <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
          Avisos
        </h2>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              <Row
                icon={Bell}
                label="Avisos del gimnasio"
                hint="Se muestran en tu perfil al abrir la app"
              >
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifyOn}
                  aria-label="Activar avisos del gimnasio"
                  onClick={() => setNotifyOn(!notifyOn)}
                  className={cn(
                    "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                    notifyOn ? "bg-primary" : "bg-muted"
                  )}
                >
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    className={cn(
                      "absolute top-1 size-5 rounded-full bg-white shadow",
                      notifyOn ? "left-6" : "left-1"
                    )}
                  />
                </button>
              </Row>
            </ul>
          </CardContent>
        </Card>
        <p className="mt-2 flex items-start gap-2 px-1 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          Son avisos dentro de la aplicación. Las notificaciones al teléfono
          necesitan un servidor que las envíe, y todavía no lo hay.
        </p>
      </section>

      {/* Datos */}
      <section aria-label="Datos" className="mt-6 pb-4">
        <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
          Datos
        </h2>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              <li>
                <button
                  type="button"
                  onClick={restoreDemo}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60"
                >
                  <RotateCcw className="size-5 shrink-0 text-primary" />
                  <span>
                    <span className="block font-medium">
                      Restaurar datos de demostración
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Vuelve a cargar el progreso de ejemplo de {DEMO_USER.name}
                    </span>
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={resetLocalDataWithConfirm}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="size-5 shrink-0" />
                  <span className="font-medium">Borrar mis datos</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={exit}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60"
                >
                  <LogOut className="size-5 shrink-0 text-muted-foreground" />
                  <span className="font-medium">Cerrar sesión</span>
                </button>
              </li>
            </ul>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground/70">
          {brandName(brand)} · Los datos se guardan en este dispositivo.
        </p>
      </section>
    </div>
  );
}
