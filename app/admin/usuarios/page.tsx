"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, Trash2, UserPlus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  deleteAccount,
  listAccounts,
  register,
  updateAccount,
  type Account,
  type Role,
} from "@/lib/auth";
import { GYM_PLANS } from "@/data/gym";
import { cn } from "@/lib/utils";

/** Estado de la membresía a partir de su fecha de vencimiento. */
function membershipState(account: Account): {
  label: string;
  className: string;
} {
  const m = account.membership;
  if (!m || !m.active) {
    return { label: "Sin membresía", className: "bg-muted text-muted-foreground" };
  }
  if (m.until) {
    const days = (new Date(m.until).getTime() - Date.now()) / 86400000;
    if (days < 0)
      return { label: "Vencida", className: "bg-destructive/15 text-destructive" };
    if (days <= 7)
      return {
        label: `Vence en ${Math.ceil(days)} d`,
        className: "bg-amber-500/15 text-amber-500",
      };
  }
  return { label: "Activa", className: "bg-emerald-500/15 text-emerald-500" };
}

export default function AdminUsuariosPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAccounts(listAccounts());
    setReady(true);
  }, []);

  if (!ready) return null;

  const filtered = accounts.filter((a) => {
    const q = query.trim().toLowerCase();
    return (
      q === "" ||
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q)
    );
  });

  const create = async () => {
    setError(null);
    const result = await register({ ...form, role: "usuario" });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setAccounts(listAccounts());
    setForm({ name: "", email: "", password: "" });
    setCreating(false);
  };

  const setRole = (id: string, role: Role) => {
    setAccounts(updateAccount(id, { role }));
  };

  const setPlan = (account: Account, plan: string) => {
    if (plan === "ninguno") {
      setAccounts(updateAccount(account.id, { membership: undefined }));
      return;
    }
    const today = new Date();
    const until = new Date(today);
    until.setMonth(until.getMonth() + (plan === "trimestral" ? 3 : 1));
    setAccounts(
      updateAccount(account.id, {
        membership: {
          plan,
          since: today.toISOString().slice(0, 10),
          until: until.toISOString().slice(0, 10),
          active: true,
        },
      })
    );
  };

  const remove = (account: Account) => {
    if (
      !window.confirm(
        `¿Eliminar la cuenta de ${account.name}? No se puede deshacer.`
      )
    )
      return;
    setAccounts(deleteAccount(account.id));
  };

  const admins = accounts.filter((a) => a.role === "admin").length;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Administración
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
            Usuarios
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {accounts.length} cuenta{accounts.length !== 1 && "s"} · {admins}{" "}
            administrador{admins !== 1 && "es"}
          </p>
        </div>
        <Button onClick={() => setCreating((v) => !v)} className="font-semibold">
          <UserPlus className="size-4" />
          Alta de socio
        </Button>
      </header>

      {creating && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="space-y-3 pt-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="n-nombre">Nombre</Label>
                  <Input
                    id="n-nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="n-correo">Correo</Label>
                  <Input
                    id="n-correo"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="n-clave">Contraseña provisional</Label>
                  <Input
                    id="n-clave"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </div>
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="flex gap-2">
                <Button onClick={create}>Crear cuenta</Button>
                <Button variant="ghost" onClick={() => setCreating(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          className="pl-9"
          aria-label="Buscar usuario"
        />
      </div>

      {/* Tarjetas en vez de tabla: en móvil una tabla ancha es inservible */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
            Sin resultados.
          </p>
        ) : (
          filtered.map((a) => {
            const state = membershipState(a);
            return (
              <Card key={a.id}>
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        {a.role === "admin" ? (
                          <ShieldCheck className="size-5" />
                        ) : (
                          <UserRound className="size-5" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{a.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {a.email}
                        </p>
                      </div>
                    </div>
                    <Badge className={cn("shrink-0", state.className)}>
                      {state.label}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Rol */}
                    <div className="flex rounded-full border border-border p-0.5">
                      {(["usuario", "admin"] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(a.id, r)}
                          aria-pressed={a.role === r}
                          className={cn(
                            "min-h-[34px] rounded-full px-3 text-xs font-medium capitalize transition-colors",
                            a.role === r
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>

                    {/* Membresía */}
                    <select
                      value={a.membership?.plan ?? "ninguno"}
                      onChange={(e) => setPlan(a, e.target.value)}
                      aria-label={`Membresía de ${a.name}`}
                      className="min-h-[36px] rounded-full border border-border bg-card px-3 text-xs font-medium"
                    >
                      <option value="ninguno">Sin membresía</option>
                      {GYM_PLANS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(a)}
                      aria-label={`Eliminar a ${a.name}`}
                      className="ml-auto"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>

                  {a.membership?.until && (
                    <p className="text-xs text-muted-foreground">
                      Vence el{" "}
                      {new Date(a.membership.until).toLocaleDateString("es", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
