"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Building2,
  ClipboardList,
  Dumbbell,
  Info,
  TriangleAlert,
  UserPlus,
  Users,
} from "lucide-react";
import { StatTile } from "@/components/StatTile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { listAccounts, type Account } from "@/lib/auth";
import { loadPhotos } from "@/lib/gymContent";
import { loadNotifications } from "@/lib/notifications";
import { computeStats } from "@/lib/stats";
import { loadFromStorage, STORAGE_KEYS } from "@/lib/storage";
import { LIBRARY_EXERCISES } from "@/data/exercises";
import { PREDEFINED_ROUTINES } from "@/data/routines";
import type { CustomRoutine, WorkoutSession } from "@/lib/types";

/** Días que se consideran "reciente" para altas de socios. */
const RECENT_DAYS = 30;

export default function AdminResumenPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [routines, setRoutines] = useState<CustomRoutine[]>([]);
  const [photos, setPhotos] = useState(0);
  const [drafts, setDrafts] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAccounts(listAccounts());
    setSessions(
      loadFromStorage<WorkoutSession[]>(STORAGE_KEYS.workoutSessions, [])
    );
    setRoutines(
      loadFromStorage<CustomRoutine[]>(STORAGE_KEYS.customRoutines, [])
    );
    setPhotos(loadPhotos().filter((p) => !p.hidden).length);
    setDrafts(loadNotifications().filter((n) => !n.published).length);
    setReady(true);
  }, []);

  if (!ready) return null;

  const members = accounts.filter((a) => a.role === "usuario");
  const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
  const recent = members.filter(
    (a) => new Date(a.createdAt).getTime() >= cutoff
  );
  const withMembership = members.filter((a) => a.membership?.active);
  const expiring = members.filter((a) => {
    if (!a.membership?.until) return false;
    const days =
      (new Date(a.membership.until).getTime() - Date.now()) / 86400000;
    return days >= 0 && days <= 7;
  });

  const stats = computeStats(sessions);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Panel
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Resumen</h1>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Socios" value={members.length} icon={Users} accent />
        <StatTile
          label={`Nuevos (${RECENT_DAYS} d)`}
          value={recent.length}
          icon={UserPlus}
          delay={0.05}
        />
        <StatTile
          label="Membresías activas"
          value={withMembership.length}
          icon={ClipboardList}
          delay={0.1}
        />
        <StatTile
          label="Entrenamientos"
          value={stats.total}
          icon={Dumbbell}
          delay={0.15}
        />
      </div>

      {/* Alertas: solo aparecen si hay algo que atender */}
      {(expiring.length > 0 || drafts > 0 || photos === 0) && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="space-y-2 pt-6">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <TriangleAlert className="size-4 text-amber-500" />
              Requiere tu atención
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {expiring.length > 0 && (
                <li>
                  {expiring.length} membresía{expiring.length !== 1 && "s"} vence
                  {expiring.length === 1 ? "" : "n"} esta semana ·{" "}
                  <Link href="/admin/usuarios" className="text-primary underline-offset-4 hover:underline">
                    revisar
                  </Link>
                </li>
              )}
              {drafts > 0 && (
                <li>
                  {drafts} aviso{drafts !== 1 && "s"} sin publicar ·{" "}
                  <Link href="/admin/notificaciones" className="text-primary underline-offset-4 hover:underline">
                    publicar
                  </Link>
                </li>
              )}
              {photos === 0 && (
                <li>
                  No hay fotos visibles del gimnasio ·{" "}
                  <Link href="/admin/gimnasio" className="text-primary underline-offset-4 hover:underline">
                    añadir
                  </Link>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Contenido publicado */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            href: "/admin/ejercicios",
            icon: Dumbbell,
            label: "Ejercicios",
            value: LIBRARY_EXERCISES.length,
          },
          {
            href: "/admin/rutinas",
            icon: ClipboardList,
            label: "Rutinas",
            value: PREDEFINED_ROUTINES.length + routines.length,
          },
          {
            href: "/admin/gimnasio",
            icon: Building2,
            label: "Fotos visibles",
            value: photos,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 transition-colors hover:border-primary/50 active:scale-[0.98]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-extrabold tabular-nums">
                  {item.value}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {item.label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* Actividad reciente */}
      <section>
        <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
          Altas recientes
        </h2>
        <Card>
          <CardContent className="p-0">
            {members.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                Todavía no hay socios registrados.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {[...members]
                  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                  .slice(0, 6)
                  .map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{a.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {a.email}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(a.createdAt).toLocaleDateString("es", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Límite honesto del alcance actual */}
      <Card className="border-sky-500/30 bg-sky-500/5">
        <CardContent className="flex gap-3 pt-6">
          <Info className="mt-0.5 size-4 shrink-0 text-sky-500" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Sin servidor, cada dispositivo guarda sus propios datos: aquí ves
            las cuentas y la actividad registradas en <strong>este</strong>{" "}
            navegador, no las de los teléfonos de tus socios. Al conectar una
            API estas mismas pantallas mostrarán los datos reales de todo el
            gimnasio.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/notificaciones">
            <Bell className="size-4" />
            Enviar aviso
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/usuarios">
            <UserPlus className="size-4" />
            Alta de socio
          </Link>
        </Button>
      </div>
    </div>
  );
}
