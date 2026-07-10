# 3. Arquitectura Multi-Tenant y Seguridad

> Parte de la arquitectura maestra de GymOS SaaS. Índice: [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md)

## Arquitectura Multi-Tenant

**Este es un principio obligatorio.** GymOS debe funcionar como un SaaS multi-tenant.

Esto significa:

- Una sola aplicación.
- Una sola base de código.
- Múltiples gimnasios independientes.

Ejemplo:

| Gym A | Gym B |
| --- | --- |
| Clientes | Clientes |
| Entrenadores | Entrenadores |
| Ejercicios | Ejercicios |
| Pagos | Pagos |

Ambos viven en la misma plataforma pero **nunca pueden ver información del otro**.

## Regla principal de aislamiento

Todas las tablas importantes deben tener:

```
gym_id
```

Este campo identifica a qué gimnasio pertenece cada registro.

Ejemplo — tabla `usuarios`:

```
id
gym_id
nombre
email
rol
fecha_creacion
```

Ejemplo — tabla `ejercicios`:

```
id
gym_id
nombre
descripcion
imagen
video
categoria
```

## Seguridad con Row Level Security (RLS)

Supabase debe utilizar políticas RLS estrictas.

**Regla:** un usuario solamente puede consultar o modificar información perteneciente a su gimnasio.

Nunca confiar únicamente en el frontend. **La seguridad debe existir en la base de datos.**
