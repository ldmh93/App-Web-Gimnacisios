"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  kindMeta,
  loadReadIds,
  markAllRead,
  publishedNotifications,
  type AppNotification,
} from "@/lib/notifications";
import { cn } from "@/lib/utils";

/**
 * Avisos del gimnasio para el socio.
 *
 * Se muestran en la pestaña Perfil, que es el concentrador de todo lo que no
 * es entrenar. No se abre un apartado propio para no añadir otra pestaña por
 * algo que la mayoría de los días estará vacío.
 */
export function NotificationsCard() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [read, setRead] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(publishedNotifications());
    setRead(loadReadIds());
    setReady(true);
  }, []);

  if (!ready) return null;

  const unread = items.filter((n) => !read.includes(n.id));

  const markRead = () => {
    const ids = items.map((n) => n.id);
    markAllRead(ids);
    setRead(ids);
  };

  return (
    <section aria-label="Avisos del gimnasio" className="mt-6">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Bell className="size-4" />
          Avisos
          {unread.length > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {unread.length}
            </span>
          )}
        </h2>
        {unread.length > 0 && (
          <Button variant="ghost" size="sm" onClick={markRead}>
            Marcar como leídos
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
            <BellOff className="size-7 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No hay avisos del gimnasio por ahora.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.slice(0, 5).map((n, i) => {
            const meta = kindMeta(n.kind);
            const isUnread = !read.includes(n.id);
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.25) }}
              >
                <Card className={cn(isUnread && "border-primary/40")}>
                  <CardContent className="space-y-1.5 pt-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={meta.className}>{meta.label}</Badge>
                      {isUnread && (
                        <span className="size-2 rounded-full bg-primary" aria-label="Sin leer" />
                      )}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {new Date(n.createdAt).toLocaleDateString("es", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <p className="font-semibold leading-snug">{n.title}</p>
                    {n.body && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {n.body}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
