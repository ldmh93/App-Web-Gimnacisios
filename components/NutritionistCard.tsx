"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Check,
  Info,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loadNutritionist, type Nutritionist } from "@/lib/gymContent";

/**
 * Ficha del nutriólogo del gimnasio.
 *
 * Se muestra dentro de la pestaña Nutrición, junto a la calculadora, en vez de
 * crear una ruta aparte: es la misma necesidad del socio ("qué como") y separar
 * ambas cosas obligaría a recordar en cuál de las dos estaba cada función.
 *
 * Los consejos se etiquetan como orientación general de forma explícita: no son
 * indicaciones médicas ni sustituyen una consulta.
 */
export function NutritionistCard() {
  const [pro, setPro] = useState<Nutritionist | null>(null);

  useEffect(() => {
    setPro(loadNutritionist());
  }, []);

  if (!pro || !pro.name) return null;

  const whatsapp = pro.phone.replace(/\D/g, "");

  return (
    <motion.section
      aria-label="Nutriólogo del gimnasio"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <Card className="overflow-hidden border-primary/30">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-5 sm:flex-row">
            {/* Identidad */}
            <div className="flex items-center gap-4 sm:flex-col sm:items-start">
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/15 text-2xl font-extrabold text-primary">
                {pro.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pro.photo}
                    alt={pro.name}
                    className="size-full object-cover"
                  />
                ) : (
                  pro.name.charAt(0)
                )}
              </div>
              <div className="sm:mt-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Nutrición del gimnasio
                </p>
                <p className="mt-0.5 text-lg font-extrabold leading-tight">
                  {pro.name}
                </p>
                <p className="text-sm text-muted-foreground">{pro.specialty}</p>
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              {pro.bio && (
                <p className="text-sm leading-relaxed">{pro.bio}</p>
              )}

              {pro.services.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Servicios
                  </p>
                  <ul className="space-y-1">
                    {pro.services.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-1.5 text-sm text-muted-foreground">
                {pro.schedule && (
                  <p className="flex items-center gap-2">
                    <CalendarClock className="size-4 shrink-0 text-primary" />
                    {pro.schedule}
                  </p>
                )}
                {pro.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0 text-primary" />
                    {pro.phone}
                  </p>
                )}
                {pro.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="size-4 shrink-0 text-primary" />
                    <a
                      href={`mailto:${pro.email}`}
                      className="truncate transition-colors hover:text-foreground"
                    >
                      {pro.email}
                    </a>
                  </p>
                )}
              </div>

              {whatsapp && (
                <Button asChild className="w-full font-semibold sm:w-auto">
                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                      `Hola ${pro.name}, quiero información sobre la consulta de nutrición.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-4" />
                    Pedir cita
                  </a>
                </Button>
              )}
            </div>
          </div>

          {pro.tips.length > 0 && (
            <div className="mt-5 rounded-2xl border border-border/60 bg-muted/40 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Recomendaciones generales
              </p>
              <ul className="space-y-1.5">
                {pro.tips.map((t) => (
                  <li key={t} className="text-sm leading-relaxed">
                    · {t}
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                Orientación general, no un diagnóstico. Para un plan adaptado a
                ti —o si tienes alguna condición de salud— pide consulta.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
}
