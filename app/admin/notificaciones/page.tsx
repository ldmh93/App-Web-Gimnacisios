"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Info, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  createNotification,
  kindMeta,
  loadNotifications,
  NOTIFICATION_KINDS,
  saveNotifications,
  type AppNotification,
  type NotificationKind,
} from "@/lib/notifications";
import { cn } from "@/lib/utils";

export default function AdminNotificacionesPage() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [kind, setKind] = useState<NotificationKind>("aviso");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadNotifications());
    setReady(true);
  }, []);

  if (!ready) return null;

  const commit = (next: AppNotification[]) => {
    setItems(next);
    saveNotifications(next);
  };

  const send = (published: boolean) => {
    if (!title.trim()) return;
    commit([createNotification({ title, body, kind, published }), ...items]);
    setTitle("");
    setBody("");
    setKind("aviso");
  };

  const togglePublished = (id: string) => {
    commit(
      items.map((n) => (n.id === id ? { ...n, published: !n.published } : n))
    );
  };

  const remove = (id: string) => {
    if (!window.confirm("¿Eliminar este aviso?")) return;
    commit(items.filter((n) => n.id !== id));
  };

  const published = items.filter((n) => n.published).length;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Administración
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
          Notificaciones
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {published} publicado{published !== 1 && "s"} de {items.length}
        </p>
      </header>

      {/* Redacción */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-1.5">
            <Label htmlFor="av-titulo">Título</Label>
            <Input
              id="av-titulo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cerramos el lunes por mantenimiento"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="av-cuerpo">Mensaje</Label>
            <Textarea
              id="av-cuerpo"
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Explica brevemente el aviso..."
            />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="flex flex-wrap gap-2">
              {NOTIFICATION_KINDS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKind(k.id)}
                  aria-pressed={kind === k.id}
                  className={cn(
                    "min-h-[38px] rounded-full border px-4 text-sm font-medium transition-colors active:scale-95",
                    kind === k.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => send(true)}
              disabled={!title.trim()}
              className="font-semibold"
            >
              <Send className="size-4" />
              Publicar ahora
            </Button>
            <Button
              variant="outline"
              onClick={() => send(false)}
              disabled={!title.trim()}
            >
              Guardar como borrador
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Listado */}
      <section className="space-y-3">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
            Todavía no has creado ningún aviso.
          </p>
        ) : (
          items.map((n) => {
            const meta = kindMeta(n.kind);
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={cn(!n.published && "opacity-70")}>
                  <CardContent className="space-y-2 pt-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={meta.className}>{meta.label}</Badge>
                      {!n.published && (
                        <Badge variant="outline">Borrador</Badge>
                      )}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {new Date(n.createdAt).toLocaleDateString("es", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="font-semibold">{n.title}</p>
                    {n.body && (
                      <p className="text-sm text-muted-foreground">{n.body}</p>
                    )}
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublished(n.id)}
                      >
                        {n.published ? "Despublicar" : "Publicar"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(n.id)}
                        aria-label="Eliminar aviso"
                        className="ml-auto"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </section>

      <Card className="border-sky-500/30 bg-sky-500/5">
        <CardContent className="flex gap-3 pt-6">
          <Info className="mt-0.5 size-4 shrink-0 text-sky-500" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Son avisos <strong>dentro</strong> de la aplicación: el socio los ve
            al abrirla, con un indicador en su perfil. Las notificaciones push
            al teléfono necesitan un servidor que las despache y permisos del
            navegador; no las prometo aquí porque hoy no hay servidor.
          </p>
        </CardContent>
      </Card>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Bell className="size-3.5" />
        Los avisos publicados aparecen en la pestaña Perfil del socio.
      </p>
    </div>
  );
}
