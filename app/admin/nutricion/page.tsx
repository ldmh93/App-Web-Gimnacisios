"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ImageUp, Plus, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { compressImage, dataUrlSizeKb } from "@/lib/brand";
import {
  loadNutritionist,
  saveNutritionist,
  type Nutritionist,
} from "@/lib/gymContent";

/** Editor de una lista de textos (servicios, consejos). */
function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label={`Eliminar ${label.toLowerCase()} ${i + 1}`}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...items, ""])}>
        <Plus className="size-4" />
        Añadir
      </Button>
    </div>
  );
}

export default function AdminNutricionPage() {
  const [draft, setDraft] = useState<Nutritionist | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(loadNutritionist());
  }, []);

  if (!draft) return null;

  const set = <K extends keyof Nutritionist>(key: K, value: Nutritionist[K]) => {
    setDraft({ ...draft, [key]: value });
    setSaved(false);
  };

  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      const dataUrl = await compressImage(file, 480, 0.8);
      const kb = dataUrlSizeKb(dataUrl);
      if (kb > 500) {
        setError(`La foto ocupa ${kb} KB comprimida. Usa una más ligera.`);
        return;
      }
      set("photo", dataUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo procesar la foto.");
    }
  };

  const commit = () => {
    // Se limpian entradas vacías para no publicar viñetas en blanco.
    const clean: Nutritionist = {
      ...draft,
      services: draft.services.filter((s) => s.trim()),
      tips: draft.tips.filter((t) => t.trim()),
    };
    saveNutritionist(clean);
    setDraft(clean);
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Administración
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
          Nutrición
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ficha del profesional que ven los socios en la pestaña Nutrición.
        </p>
      </header>

      <Card>
        <CardContent className="space-y-5 pt-6">
          {/* Foto */}
          <div className="flex items-center gap-4">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/15 text-2xl font-bold text-primary">
              {draft.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.photo} alt="" className="size-full object-cover" />
              ) : (
                draft.name.charAt(0) || "N"
              )}
            </div>
            <div>
              <input
                ref={photoInput}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => pickPhoto(e.target.files?.[0])}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => photoInput.current?.click()}
              >
                <ImageUp className="size-4" />
                Subir fotografía
              </Button>
              {draft.photo && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => set("photo", "")}
                >
                  Quitar
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nt-nombre">Nombre</Label>
              <Input
                id="nt-nombre"
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nt-esp">Especialidad</Label>
              <Input
                id="nt-esp"
                value={draft.specialty}
                onChange={(e) => set("specialty", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nt-tel">Teléfono</Label>
              <Input
                id="nt-tel"
                value={draft.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nt-mail">Correo</Label>
              <Input
                id="nt-mail"
                value={draft.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nt-horario">Horario de consulta</Label>
            <Input
              id="nt-horario"
              value={draft.schedule}
              onChange={(e) => set("schedule", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nt-bio">Presentación</Label>
            <Textarea
              id="nt-bio"
              rows={3}
              value={draft.bio}
              onChange={(e) => set("bio", e.target.value)}
            />
          </div>

          <ListEditor
            label="Servicios"
            items={draft.services}
            onChange={(v) => set("services", v)}
            placeholder="Plan de alimentación personalizado"
          />

          <ListEditor
            label="Recomendaciones generales"
            items={draft.tips}
            onChange={(v) => set("tips", v)}
            placeholder="Reparte la proteína durante el día"
          />

          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button onClick={commit} className="font-semibold">
              Guardar
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-500">
                <Check className="size-4" />
                Guardado
              </span>
            )}
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Las recomendaciones se publican como orientación general, nunca como
            diagnóstico: la aplicación lo indica expresamente junto a ellas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
