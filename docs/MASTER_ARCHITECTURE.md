# GymOS SaaS — Arquitectura Maestra del Proyecto

**Índice de la documentación.** La arquitectura está dividida en documentos temáticos; este archivo es el punto de entrada. Cualquier IA o desarrollador debe leer estos documentos antes de modificar código (ver [reglas para IA](./09-reglas-para-ia.md)).

| # | Documento | Contenido |
| --- | --- | --- |
| 1 | [Visión y Objetivos](./01-vision-y-objetivos.md) | Qué es GymOS SaaS y qué debe lograr la plataforma. |
| 2 | [Arquitectura y Stack](./02-arquitectura-y-stack.md) | Regla de no tocar el frontend actual; Next.js + TypeScript en el front y Supabase como backend. |
| 3 | [Multi-Tenant y Seguridad](./03-multi-tenant-y-seguridad.md) | Principio obligatorio de multi-tenancy, aislamiento por `gym_id` y políticas RLS. |
| 4 | [Roles y Usuarios](./04-roles-y-usuarios.md) | Super Admin, Dueño de Gimnasio, Entrenador y Cliente; perfil de usuario. |
| 5 | [Sistema de Ejercicios](./05-sistema-de-ejercicios.md) | Biblioteca central de ejercicios con imágenes/videos en Supabase Storage. |
| 6 | [Base de Datos](./06-base-de-datos.md) | Diseñar tablas, relaciones, índices y RLS antes de escribir migraciones. |
| 7 | [Principios y Escalabilidad](./07-principios-y-escalabilidad.md) | Clean Architecture, SOLID y preparación para miles de gimnasios. |
| 8 | [Roadmap y Futuro](./08-roadmap-y-futuro.md) | Fases 1-4 (Supabase → BD → Storage → SaaS) e IA, pagos, white label y móvil. |
| 9 | [Reglas para IA](./09-reglas-para-ia.md) | Protocolo obligatorio: analizar, documentar, proponer y esperar aprobación. |

## Reglas de oro (resumen rápido)

1. **No romper ni rediseñar el frontend existente** — integrar todo por servicios, hooks y capas de datos.
2. **Multi-tenant obligatorio** — toda tabla importante lleva `gym_id` y políticas RLS en la base de datos.
3. **Documentar antes de codificar** — el diseño de base de datos se aprueba en papel antes de cualquier migración.
4. **Pensar como producto comercial** — sin soluciones temporales.

## Próximo documento pendiente

- `DATABASE_ARCHITECTURE.md` — diseño completo de tablas de Supabase (gyms, profiles, members, trainers, exercises, workouts, subscriptions, payments) con relaciones, índices y políticas RLS.
