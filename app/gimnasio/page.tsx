"use client";

import { motion } from "framer-motion";
import {
  Check,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GYM_INFO,
  GYM_PLANS,
  GYM_SCHEDULE,
  whatsappLink,
} from "@/data/gym";
import { cn } from "@/lib/utils";

export default function GimnasioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="El gimnasio"
        title={GYM_INFO.name}
        description={GYM_INFO.slogan}
      />

      {/* Planes de membresía */}
      <section aria-label="Planes de membresía">
        <h2 className="mb-1 text-2xl font-bold tracking-tight">
          Planes de membresía
        </h2>
        <p className="mb-6 text-muted-foreground">
          Elige el plan que mejor se adapte a ti. Precios de ejemplo.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GYM_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Card
                className={cn(
                  "relative h-full",
                  plan.featured && "border-primary shadow-lg shadow-primary/10"
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    <Star className="size-3 fill-current" />
                    Más popular
                  </span>
                )}
                <CardContent className="flex h-full flex-col p-5">
                  <p className="font-semibold">{plan.name}</p>
                  <p className="mt-2">
                    <span className="text-3xl font-extrabold">
                      ${plan.price}
                    </span>{" "}
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={cn("mt-5 w-full", plan.featured && "glow-primary-soft")}
                    variant={plan.featured ? "default" : "outline"}
                  >
                    <a
                      href={whatsappLink(
                        `Hola, me interesa el plan "${plan.name}" de ${GYM_INFO.name}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Lo quiero
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Horarios + contacto */}
      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Clock className="size-5 text-primary" />
              Horarios
            </h3>
            <ul className="mt-4 divide-y divide-border">
              {GYM_SCHEDULE.map((s) => (
                <li
                  key={s.days}
                  className="flex items-center justify-between py-2.5"
                >
                  <span className="text-muted-foreground">{s.days}</span>
                  <span className="font-semibold tabular-nums">{s.hours}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <MapPin className="size-5 text-primary" />
              Contacto y ubicación
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                {GYM_INFO.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-muted-foreground" />
                <a
                  href={`tel:+${GYM_INFO.whatsapp}`}
                  className="transition-colors hover:text-primary"
                >
                  {GYM_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <a
                  href={`mailto:${GYM_INFO.email}`}
                  className="transition-colors hover:text-primary"
                >
                  {GYM_INFO.email}
                </a>
              </li>
            </ul>
            <Button
              asChild
              className="mt-5 w-full bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <a
                href={whatsappLink(
                  `Hola ${GYM_INFO.name}, quiero más información.`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" />
                Escríbenos por WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
