"use client";

import { motion } from "framer-motion";
import {
  Apple,
  CircleHelp,
  FlaskConical,
  Info,
  Lightbulb,
  Pill,
  Scale,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SUPPLEMENTS } from "@/data/supplements";
import type { Supplement } from "@/lib/types";

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Info;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-primary" />
        {title}
      </h4>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-sm text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function SupplementDialog({
  supplement,
  index,
}: {
  supplement: Supplement;
  index: number;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
          className="text-left"
        >
          <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg">
            <CardContent className="space-y-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Pill className="size-5" />
              </div>
              <h3 className="font-semibold">{supplement.name}</h3>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {supplement.what}
              </p>
              <Badge variant="secondary" className="font-normal">
                {supplement.dose.split(".")[0]}
              </Badge>
            </CardContent>
          </Card>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{supplement.name}</DialogTitle>
          <DialogDescription>{supplement.what}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <Section icon={Info} title="Para qué sirve">
            <p className="text-sm text-muted-foreground">{supplement.purpose}</p>
          </Section>

          <Section icon={Sparkles} title="Beneficios">
            <BulletList items={supplement.benefits} />
          </Section>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-muted p-3">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <FlaskConical className="size-3.5" /> Cómo consumirlo
              </p>
              <p className="text-sm">{supplement.howToTake}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Scale className="size-3.5" /> Cantidad recomendada
              </p>
              <p className="text-sm">{supplement.dose}</p>
            </div>
          </div>

          <Section icon={Apple} title="Alimentos relacionados">
            <div className="flex flex-wrap gap-1.5">
              {supplement.relatedFoods.map((food) => (
                <Badge key={food} variant="outline">
                  {food}
                </Badge>
              ))}
            </div>
          </Section>

          <Separator />

          <Section icon={CircleHelp} title="Mitos frecuentes">
            <BulletList items={supplement.myths} />
          </Section>

          <Section icon={Lightbulb} title="Recomendaciones">
            <BulletList items={supplement.recommendations} />
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SuplementosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Educación"
        title="Suplementos"
        description="Qué es cada suplemento, para qué sirve de verdad, cómo tomarlo y qué mitos ignorar. Información educativa, no consejo médico."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUPPLEMENTS.map((supplement, index) => (
          <SupplementDialog
            key={supplement.id}
            supplement={supplement}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
