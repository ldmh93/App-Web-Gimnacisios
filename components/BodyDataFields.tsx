"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Sex } from "@/lib/types";

export interface BodyDataValues {
  age: string;
  sex: Sex;
  weight: string;
  height: string;
}

interface BodyDataFieldsProps {
  values: BodyDataValues;
  onChange: (field: keyof BodyDataValues, value: string) => void;
  /** Prefijo para los `id` de los campos (evita colisiones si se repite en la misma página). */
  idPrefix?: string;
}

/**
 * Datos físicos básicos (edad, sexo, peso, altura) en una rejilla de 2×2.
 * Reutilizado por el onboarding y la calculadora de nutrición para no
 * duplicar el mismo formulario en dos sitios.
 */
export function BodyDataFields({
  values,
  onChange,
  idPrefix = "",
}: BodyDataFieldsProps) {
  const id = (field: string) => `${idPrefix}${field}`;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <Label htmlFor={id("age")}>Edad</Label>
        <Input
          id={id("age")}
          type="number"
          inputMode="numeric"
          min={14}
          max={100}
          value={values.age}
          onChange={(e) => onChange("age", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Sexo</Label>
        <Select value={values.sex} onValueChange={(v) => onChange("sex", v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hombre">Hombre</SelectItem>
            <SelectItem value="mujer">Mujer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={id("weight")}>Peso (kg)</Label>
        <Input
          id={id("weight")}
          type="number"
          inputMode="decimal"
          min={30}
          max={300}
          value={values.weight}
          onChange={(e) => onChange("weight", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={id("height")}>Altura (cm)</Label>
        <Input
          id={id("height")}
          type="number"
          inputMode="numeric"
          min={120}
          max={230}
          value={values.height}
          onChange={(e) => onChange("height", e.target.value)}
        />
      </div>
    </div>
  );
}
