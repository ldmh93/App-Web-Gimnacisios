"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ImageUp, RotateCcw, TriangleAlert } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  compressImage,
  dataUrlSizeKb,
  DEFAULT_BRAND,
  type BrandConfig,
} from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Identidad de marca.
 *
 * Es la pantalla que permite presentar la misma aplicación a distintos
 * gimnasios: se cambia el nombre y se suben sus logotipos, sin tocar código.
 */
export default function AdminConfiguracionPage() {
  const { brand, setBrand } = useApp();
  const [draft, setDraft] = useState<BrandConfig>(brand);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markInput = useRef<HTMLInputElement>(null);
  const logoInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof BrandConfig>(key: K, value: BrandConfig[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setSaved(false);
  };

  const pickImage = async (
    file: File | undefined,
    key: "mark" | "logo",
    maxSize: number
  ) => {
    if (!file) return;
    setError(null);
    try {
      const dataUrl = await compressImage(file, maxSize);
      const kb = dataUrlSizeKb(dataUrl);
      // El almacenamiento del navegador ronda los 5 MB para todo el dominio.
      if (kb > 700) {
        setError(
          `La imagen ocupa ${kb} KB incluso comprimida. Usa una más pequeña o un PNG con menos detalle.`
        );
        return;
      }
      set(key, dataUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo procesar la imagen.");
    }
  };

  const save = () => {
    if (!draft.name.trim()) {
      setError("El nombre no puede quedar vacío.");
      return;
    }
    setError(null);
    setBrand(draft);
    setSaved(true);
  };

  const restore = () => {
    setDraft(DEFAULT_BRAND);
    setBrand(DEFAULT_BRAND);
    setSaved(true);
    setError(null);
  };

  const dirty = JSON.stringify(draft) !== JSON.stringify(brand);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Configuración
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
          Identidad de marca
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cambia el nombre y los logotipos para presentar la aplicación con la
          identidad de cada gimnasio. Se aplica al instante en toda la app.
        </p>
      </header>

      {/* Vista previa: lo que verá el socio */}
      <Card className="overflow-hidden border-primary/30">
        <div className="flex flex-col items-center gap-3 bg-[#0c0c10] px-6 py-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Vista previa
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={draft.mark}
            alt=""
            className="size-20 object-contain"
            onError={() => setError("No se pudo cargar el isotipo.")}
          />
          <p className="text-2xl font-extrabold uppercase tracking-[0.15em] text-white">
            {draft.name || "NOMBRE"}
            {draft.nameAccent && (
              <span className="text-primary"> {draft.nameAccent}</span>
            )}
          </p>
          <p className="max-w-xs text-center text-xs text-white/40">
            {draft.tagline}
          </p>
        </div>
      </Card>

      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="marca-nombre">Nombre</Label>
              <Input
                id="marca-nombre"
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="FIT"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="marca-acento">Segunda palabra (en color)</Label>
              <Input
                id="marca-acento"
                value={draft.nameAccent}
                onChange={(e) => set("nameAccent", e.target.value)}
                placeholder="CORE"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="marca-lema">Lema de la portada</Label>
            <Input
              id="marca-lema"
              value={draft.tagline}
              onChange={(e) => set("tagline", e.target.value)}
            />
          </div>

          {/* Imágenes */}
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                {
                  key: "mark" as const,
                  label: "Isotipo (cuadrado)",
                  hint: "Se usa en el header, el carnet y la bienvenida.",
                  ref: markInput,
                  size: 512,
                },
                {
                  key: "logo" as const,
                  label: "Logotipo completo",
                  hint: "Se usa grande en la portada.",
                  ref: logoInput,
                  size: 900,
                },
              ]
            ).map((item) => (
              <div key={item.key} className="space-y-2">
                <Label>{item.label}</Label>
                <div className="flex items-center gap-3 rounded-2xl border border-border/60 p-3">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={draft[item.key]}
                      alt=""
                      className="size-full object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">{item.hint}</p>
                    <input
                      ref={item.ref}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        pickImage(e.target.files?.[0], item.key, item.size)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => item.ref.current?.click()}
                    >
                      <ImageUp className="size-4" />
                      Subir imagen
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={save} disabled={!dirty} className="font-semibold">
              Guardar cambios
            </Button>
            <Button variant="outline" onClick={restore}>
              <RotateCcw className="size-4" />
              Restaurar por defecto
            </Button>
            {saved && !dirty && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium text-emerald-500"
                )}
              >
                <Check className="size-4" />
                Guardado
              </motion.span>
            )}
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Las imágenes se comprimen y se guardan en este dispositivo. El
            título de la pestaña del navegador se genera en el servidor y sigue
            diciendo FIT CORE; cambiarlo por gimnasio requeriría mover los
            metadatos a una capa dinámica.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
