"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LIBRARY_EXERCISES, MUSCLE_GROUPS, muscleLabel } from "@/data/exercises";
import { BODY_REGIONS, regionCounts } from "@/data/muscleMap";
import { cn } from "@/lib/utils";

const PAGE = 30;

/**
 * Catálogo de ejercicios en modo administración: recuento por grupo y búsqueda
 * en formato lista compacta. La ficha visual del socio vive en /ejercicios y no
 * se duplica aquí — hay un enlace directo.
 */
export default function AdminEjerciciosPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>("todos");
  const [limit, setLimit] = useState(PAGE);

  const counts = useMemo(() => regionCounts(), []);

  const byGroup = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of LIBRARY_EXERCISES) {
      map.set(e.group, (map.get(e.group) ?? 0) + 1);
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LIBRARY_EXERCISES.filter((e) => {
      if (group !== "todos" && e.group !== group) return false;
      return (
        q === "" ||
        e.name.toLowerCase().includes(q) ||
        e.equipment.toLowerCase().includes(q)
      );
    });
  }, [query, group]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Administración
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
            Ejercicios
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {LIBRARY_EXERCISES.length} en la biblioteca ·{" "}
            {BODY_REGIONS.length} zonas del mapa muscular
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/ejercicios">
            <ExternalLink className="size-4" />
            Ver como socio
          </Link>
        </Button>
      </header>

      {/* Cobertura por zona del mapa */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            Cobertura por músculo
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BODY_REGIONS.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-border/60 px-3 py-2"
              >
                <p className="text-lg font-extrabold tabular-nums">
                  {counts[r.id]}
                </p>
                <p className="text-xs text-muted-foreground">{r.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Buscador */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE);
            }}
            placeholder="Buscar ejercicio o equipo..."
            className="pl-9"
            aria-label="Buscar ejercicio"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[{ id: "todos", label: "Todos" }, ...MUSCLE_GROUPS].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setGroup(g.id);
                setLimit(PAGE);
              }}
              aria-pressed={group === g.id}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors active:scale-95",
                group === g.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {g.label}
              {g.id !== "todos" && (
                <span className="ml-1.5 text-[11px] opacity-60">
                  {byGroup.get(g.id) ?? 0}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {filtered.slice(0, limit).map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{e.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {muscleLabel(e.group)} · {e.equipment}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 capitalize">
                  {e.level}
                </Badge>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Sin resultados.
            </p>
          )}
        </CardContent>
      </Card>

      {limit < filtered.length && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setLimit((l) => l + PAGE)}>
            Mostrar más ({filtered.length - limit} restantes)
          </Button>
        </div>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        La biblioteca se genera desde un dataset y vive en el código
        (<code>data/exercisesDb.ts</code>), por eso no se edita desde el panel:
        una edición aquí se perdería al regenerarla. Añadir ejercicios propios
        del gimnasio requiere base de datos.
      </p>
    </div>
  );
}
