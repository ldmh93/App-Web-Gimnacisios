"use client";

import { motion } from "framer-motion";
import { Flame, UtensilsCrossed } from "lucide-react";
import type { Diet } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function MacroPill({ label, grams }: { label: string; grams: number }) {
  return (
    <div className="rounded-lg bg-muted px-3 py-2 text-center">
      <p className="text-sm font-bold tabular-nums">{grams} g</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

interface DietCardProps {
  diet: Diet;
  index?: number;
}

export function DietCard({ diet, index = 0 }: DietCardProps) {
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
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UtensilsCrossed className="size-5" />
                </div>
                <Badge variant="outline" className="shrink-0">
                  {diet.goal}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold">{diet.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {diet.description}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                <Flame className="size-4" />
                {diet.calories.toLocaleString("es")} kcal
              </div>
              <div className="grid grid-cols-3 gap-2">
                <MacroPill label="Proteína" grams={diet.protein} />
                <MacroPill label="Carbos" grams={diet.carbs} />
                <MacroPill label="Grasas" grams={diet.fats} />
              </div>
            </CardContent>
          </Card>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <Badge variant="outline" className="w-fit">
            {diet.goal}
          </Badge>
          <DialogTitle className="text-xl">{diet.name}</DialogTitle>
          <DialogDescription>{diet.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="rounded-lg bg-primary/10 p-3">
            <p className="text-lg font-bold text-primary tabular-nums">
              {diet.calories.toLocaleString("es")}
            </p>
            <p className="text-[11px] text-muted-foreground">kcal</p>
          </div>
          <MacroPill label="Proteína" grams={diet.protein} />
          <MacroPill label="Carbos" grams={diet.carbs} />
          <MacroPill label="Grasas" grams={diet.fats} />
        </div>

        <Accordion type="single" collapsible defaultValue={diet.meals[0]?.name}>
          {diet.meals.map((meal) => (
            <AccordionItem key={meal.name} value={meal.name}>
              <AccordionTrigger className="text-sm">
                <span>
                  <span className="font-semibold">{meal.name}</span>
                  <span className="ml-2 font-normal text-muted-foreground">
                    {meal.title}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ingredientes
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {meal.ingredients.map((ing) => (
                      <li key={ing} className="flex gap-2">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Preparación
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {meal.preparation}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
