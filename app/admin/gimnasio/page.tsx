"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  ImageUp,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { compressImage, dataUrlSizeKb } from "@/lib/brand";
import {
  loadGymInfo,
  loadPhotos,
  saveGymInfo,
  savePhotos,
  type EditableGymInfo,
  type GymPhoto,
} from "@/lib/gymContent";
import { generateId } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function AdminGimnasioPage() {
  const [info, setInfo] = useState<EditableGymInfo | null>(null);
  const [photos, setPhotos] = useState<GymPhoto[]>([]);
  const [savedInfo, setSavedInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInfo(loadGymInfo());
    setPhotos(loadPhotos());
  }, []);

  if (!info) return null;

  const setField = <K extends keyof EditableGymInfo>(
    key: K,
    value: EditableGymInfo[K]
  ) => {
    setInfo({ ...info, [key]: value });
    setSavedInfo(false);
  };

  const commitInfo = () => {
    saveGymInfo(info);
    setSavedInfo(true);
  };

  /** Cualquier cambio en fotos se persiste al momento: no hay "guardar". */
  const commitPhotos = (next: GymPhoto[]) => {
    setPhotos(next);
    savePhotos(next);
  };

  const addPhoto = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      // 1200 px basta para una galería a pantalla completa en móvil.
      const dataUrl = await compressImage(file, 1200, 0.72);
      const kb = dataUrlSizeKb(dataUrl);
      if (kb > 900) {
        setError(
          `La foto ocupa ${kb} KB comprimida. El navegador guarda unos 5 MB en total, así que usa una imagen más ligera.`
        );
        return;
      }
      commitPhotos([
        ...photos,
        {
          id: generateId("foto"),
          src: dataUrl,
          title: "",
          description: "",
          hidden: false,
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo procesar la foto.");
    }
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= photos.length) return;
    const next = [...photos];
    [next[index], next[target]] = [next[target], next[index]];
    commitPhotos(next);
  };

  const patch = (id: string, p: Partial<GymPhoto>) => {
    commitPhotos(photos.map((x) => (x.id === id ? { ...x, ...p } : x)));
  };

  const remove = (photo: GymPhoto) => {
    if (!window.confirm("¿Eliminar esta foto de la galería?")) return;
    commitPhotos(photos.filter((x) => x.id !== photo.id));
  };

  const visible = photos.filter((p) => !p.hidden).length;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Administración
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Gimnasio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Información de contacto y galería que ven los socios.
        </p>
      </header>

      {/* -------------------------------- Datos -------------------------------- */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Información
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { key: "name", label: "Nombre del gimnasio" },
                { key: "slogan", label: "Lema" },
                { key: "phone", label: "Teléfono" },
                { key: "whatsapp", label: "WhatsApp (solo dígitos)" },
                { key: "email", label: "Correo" },
                { key: "instagram", label: "Instagram" },
              ] as const
            ).map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={`g-${f.key}`}>{f.label}</Label>
                <Input
                  id={`g-${f.key}`}
                  value={info[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="g-address">Dirección</Label>
            <Input
              id="g-address"
              value={info.address}
              onChange={(e) => setField("address", e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="g-history">Historia</Label>
              <Textarea
                id="g-history"
                rows={4}
                value={info.history}
                onChange={(e) => setField("history", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="g-philosophy">Filosofía</Label>
              <Textarea
                id="g-philosophy"
                rows={4}
                value={info.philosophy}
                onChange={(e) => setField("philosophy", e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={commitInfo} className="font-semibold">
              Guardar información
            </Button>
            {savedInfo && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-500">
                <Check className="size-4" />
                Guardado
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------- Galería ------------------------------- */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground">
                Fotografías
              </h2>
              <p className="text-xs text-muted-foreground">
                {visible} visible{visible !== 1 && "s"} de {photos.length} · el
                orden de esta lista es el de la galería
              </p>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => addPhoto(e.target.files?.[0])}
            />
            <Button variant="outline" onClick={() => fileInput.current?.click()}>
              <ImageUp className="size-4" />
              Subir foto
            </Button>
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

          <ul className="space-y-3">
            {photos.map((photo, i) => (
              <li
                key={photo.id}
                className={cn(
                  "flex gap-3 rounded-2xl border border-border/60 p-3",
                  photo.hidden && "opacity-55"
                )}
              >
                <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <Input
                    value={photo.title}
                    onChange={(e) => patch(photo.id, { title: e.target.value })}
                    placeholder="Título (opcional)"
                    className="h-9"
                    aria-label={`Título de la foto ${i + 1}`}
                  />
                  <Input
                    value={photo.description}
                    onChange={(e) =>
                      patch(photo.id, { description: e.target.value })
                    }
                    placeholder="Descripción (opcional)"
                    className="h-9"
                    aria-label={`Descripción de la foto ${i + 1}`}
                  />
                  <div className="flex flex-wrap items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Subir en el orden"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => move(i, 1)}
                      disabled={i === photos.length - 1}
                      aria-label="Bajar en el orden"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => patch(photo.id, { hidden: !photo.hidden })}
                    >
                      {photo.hidden ? (
                        <>
                          <EyeOff className="size-4" />
                          Oculta
                        </>
                      ) : (
                        <>
                          <Eye className="size-4" />
                          Visible
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(photo)}
                      aria-label="Eliminar foto"
                      className="ml-auto"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Las fotos que subes se comprimen y se guardan en este dispositivo.
            Las originales del proyecto viven en <code>public/gym/</code> y
            siguen ahí aunque las ocultes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
