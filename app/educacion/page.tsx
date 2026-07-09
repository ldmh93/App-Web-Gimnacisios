"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ARTICLES } from "@/data/articles";

export default function EducacionPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Aprende"
        title="Educación fitness"
        description="Los fundamentos que multiplican tus resultados, explicados sin mitos ni tecnicismos innecesarios."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {ARTICLES.map((article, index) => (
          <Dialog key={article.id}>
            <DialogTrigger asChild>
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.4) }}
                className="text-left"
              >
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg">
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        {article.readMinutes} min
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {article.summary}
                    </p>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                      <BookOpen className="size-4" />
                      Leer artículo
                    </span>
                  </CardContent>
                </Card>
              </motion.button>
            </DialogTrigger>

            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{article.category}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {article.readMinutes} min de lectura
                  </span>
                </div>
                <DialogTitle className="text-2xl leading-tight">
                  {article.title}
                </DialogTitle>
                <DialogDescription>{article.summary}</DialogDescription>
              </DialogHeader>

              <article className="space-y-6">
                {article.sections.map((section) => (
                  <section key={section.heading}>
                    <h3 className="mb-2 font-semibold">{section.heading}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {section.content}
                    </p>
                  </section>
                ))}
              </article>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
