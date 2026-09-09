"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BookmarkPlus,
  Check,
  ImageUp,
  Pipette,
  RotateCcw,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  brandColor,
  compressImage,
  addBrandPreset,
  extractAccentColor,
  loadBrandPresets,
  removeBrandPreset,
  type BrandPreset,
  readableForeground,
  splashImage,
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
  const { brand, setBrand, ready } = useApp();
  const [draft, setDraft] = useState<BrandConfig>(brand);
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [presets, setPresets] = useState<BrandPreset[]>([]);
  const markInput = useRef<HTMLInputElement>(null);
  const logoInput = useRef<HTMLInputElement>(null);
  const splashInput = useRef<HTMLInputElement>(null);

  /**
   * La marca se lee del almacenamiento DESPUÉS del primer render, así que al
   * montar `brand` todavía es la de por defecto. Sin esta sincronización el
   * formulario mostraría los valores por defecto y guardar pisaría la
   * configuración ya guardada. Se respeta lo que el administrador esté
   * editando: en cuanto toca algo, deja de sobrescribirse.
   */
  useEffect(() => {
    if (ready && !touched) setDraft(brand);
  }, [ready, brand, touched]);

  useEffect(() => setPresets(loadBrandPresets()), []);

  const set = <K extends keyof BrandConfig>(key: K, value: BrandConfig[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setTouched(true);
    setSaved(false);
  };

  const pickImage = async (
    file: File | undefined,
    key: "mark" | "logo" | "splash",
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

  /**
   * Deduce el color de acento del logotipo.
   *
   * Prueba primero con la imagen de la presentación y, si esa no da un tono
   * claro (logos monocromos), con el isotipo: son la misma marca, y basta con
   * que una de las dos tenga color.
   */
  const takeColorFromLogo = async () => {
    setPicking(true);
    setError(null);
    try {
      const found =
        (await extractAccentColor(splashImage(draft))) ??
        (await extractAccentColor(draft.mark));
      if (!found) {
        setError(
          "El logotipo es monocromo, así que no hay un color de marca que tomar. Elígelo a mano."
        );
        return;
      }
      set("primaryColor", found);
    } catch {
      setError("No se pudo analizar el logotipo.");
    } finally {
      setPicking(false);
    }
  };

  const save = () => {
    if (!draft.name.trim()) {
      setError("El nombre no puede quedar vacío.");
      return;
    }
    setError(null);
    setBrand(draft);
    setTouched(false);
    setSaved(true);
  };

  const restore = () => {
    setDraft(DEFAULT_BRAND);
    setBrand(DEFAULT_BRAND);
    setTouched(false);
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
            Vista previa de la presentación
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={splashImage(draft)}
            alt=""
            className="h-24 w-auto max-w-[70%] object-contain"
            onError={() => setError("No se pudo cargar la imagen de marca.")}
          />
          <p
            className="text-2xl font-extrabold uppercase tracking-[0.15em] text-white"
            style={{ color: brandColor(draft.nameColor) }}
          >
            {draft.name || "NOMBRE"}
            {draft.nameAccent && (
              <span
                className="text-primary"
                style={{ color: brandColor(draft.accentColor) }}
              >
                {" "}
                {draft.nameAccent}
              </span>
            )}
          </p>
          <p
            className="max-w-xs text-center text-xs text-white/40"
            style={{ color: brandColor(draft.taglineColor) }}
          >
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

          {/* Color de acento de toda la interfaz */}
          <div className="space-y-2 rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <Label>Color principal de la aplicación</Label>
            <p className="text-xs text-muted-foreground">
              Tiñe botones, enlaces, el resaltado del mapa muscular y las
              gráficas. Es lo que pone toda la app en armonía con el logotipo.
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <input
                type="color"
                value={draft.primaryColor || "#e5484d"}
                onChange={(e) => set("primaryColor", e.target.value)}
                aria-label="Color principal de la aplicación"
                className="size-11 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent"
              />
              <Input
                value={draft.primaryColor}
                onChange={(e) => set("primaryColor", e.target.value)}
                placeholder="Automático"
                aria-label="Código del color principal"
                className="h-11 w-32 font-mono text-xs"
              />
              <Button
                type="button"
                variant="outline"
                onClick={takeColorFromLogo}
                disabled={picking}
              >
                <Pipette className="size-4" />
                {picking ? "Analizando…" : "Tomar del logo"}
              </Button>
              {draft.primaryColor && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => set("primaryColor", "")}
                >
                  Automático
                </Button>
              )}
            </div>
            {/* Muestra cómo queda un botón con ese color */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold",
                  !draft.primaryColor && "bg-primary text-primary-foreground"
                )}
                style={
                  draft.primaryColor
                    ? {
                        backgroundColor: draft.primaryColor,
                        color: readableForeground(draft.primaryColor),
                      }
                    : undefined
                }
              >
                Botón principal
              </span>
              <span className="text-xs text-muted-foreground">
                El texto encima se elige por contraste automáticamente
              </span>
            </div>
          </div>

          {/* Colores de los textos de marca */}
          <div className="space-y-2">
            <Label>Color de los textos</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  { key: "nameColor" as const, label: "Nombre", fallback: "#ffffff" },
                  {
                    key: "accentColor" as const,
                    label: "Palabra destacada",
                    fallback: "#e5484d",
                  },
                  {
                    key: "taglineColor" as const,
                    label: "Lema",
                    fallback: "#e5484d",
                  },
                ]
              ).map((c) => {
                const value = draft[c.key];
                return (
                  <div
                    key={c.key}
                    className="space-y-2 rounded-2xl border border-border/60 p-3"
                  >
                    <p className="text-xs font-medium">{c.label}</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={value || c.fallback}
                        onChange={(e) => set(c.key, e.target.value)}
                        aria-label={`Color de ${c.label.toLowerCase()}`}
                        className="size-10 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent"
                      />
                      <Input
                        value={value}
                        onChange={(e) => set(c.key, e.target.value)}
                        placeholder="Automático"
                        aria-label={`Código de color de ${c.label.toLowerCase()}`}
                        className="h-10 font-mono text-xs"
                      />
                    </div>
                    {value ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => set(c.key, "")}
                        className="h-7 px-2 text-xs"
                      >
                        Usar automático
                      </Button>
                    ) : (
                      <p className="text-xs italic text-muted-foreground/70">
                        Sigue el color del tema
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Dejarlos en automático es lo más seguro: el color lo pone el tema
              y se mantiene legible tanto en claro como en oscuro. Si fijas uno,
              será el mismo en ambos temas, así que comprueba que se lea bien.
            </p>
          </div>

          {/* Imágenes: una ranura por sitio donde aparece la marca */}
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                {
                  key: "mark" as const,
                  label: "Isotipo (cuadrado)",
                  hint: "Header, carnet, perfil y panel. Conviene que sea cuadrado.",
                  ref: markInput,
                  size: 512,
                  optional: false,
                },
                {
                  key: "splash" as const,
                  label: "Presentación y acceso",
                  hint: "La pantalla de bienvenida y el login. Admite logotipo alargado.",
                  ref: splashInput,
                  size: 900,
                  optional: true,
                },
                {
                  key: "logo" as const,
                  label: "Logotipo completo",
                  hint: "Se usa grande en la portada.",
                  ref: logoInput,
                  size: 900,
                  optional: false,
                },
              ]
            ).map((item) => {
              // Si la ranura opcional está vacía, se enseña de qué hereda para
              // que no parezca que falta configurar algo.
              const value = draft[item.key];
              const shown = value || draft.mark;
              return (
                <div key={item.key} className="space-y-2">
                  <Label>{item.label}</Label>
                  <div className="flex items-center gap-3 rounded-2xl border border-border/60 p-3">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={shown}
                        alt=""
                        className="size-full object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        {item.hint}
                      </p>
                      {item.optional && !value && (
                        <p className="mt-1 text-xs italic text-muted-foreground/70">
                          Ahora usa el isotipo
                        </p>
                      )}
                      <input
                        ref={item.ref}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                          pickImage(e.target.files?.[0], item.key, item.size)
                        }
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => item.ref.current?.click()}
                        >
                          <ImageUp className="size-4" />
                          Subir imagen
                        </Button>
                        {item.optional && value && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => set(item.key, "")}
                          >
                            Quitar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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

          {/* Biblioteca de marcas: alternar entre gimnasios sin reconfigurar */}
          <div className="space-y-3 rounded-2xl border border-border/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Label>Marcas guardadas</Label>
                <p className="text-xs text-muted-foreground">
                  Guarda esta identidad para recuperarla cuando quieras.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPresets(addBrandPreset(draft))}
              >
                <BookmarkPlus className="size-4" />
                Guardar esta marca
              </Button>
            </div>

            {presets.length === 0 ? (
              <p className="text-xs italic text-muted-foreground/70">
                Todavía no has guardado ninguna.
              </p>
            ) : (
              <ul className="space-y-2">
                {presets.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl border border-border/60 p-2"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.brand.mark}
                        alt=""
                        className="size-full object-contain p-0.5"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(p.savedAt).toLocaleDateString("es", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDraft(p.brand);
                        setBrand(p.brand);
                        setTouched(false);
                        setSaved(true);
                      }}
                    >
                      Aplicar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Eliminar ${p.label}`}
                      onClick={() => setPresets(removeBrandPreset(p.id))}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

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
