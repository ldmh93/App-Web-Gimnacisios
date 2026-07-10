# 2. Arquitectura General y Stack Tecnológico

> Parte de la arquitectura maestra de GymOS SaaS. Índice: [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md)

## Frontend actual

El frontend existente debe mantenerse.

**Regla principal — NO modificar:**

- Diseño actual.
- Componentes existentes.
- Navegación actual.
- Estilos actuales.
- Experiencia visual creada.

Toda nueva funcionalidad debe integrarse mediante:

- Servicios.
- Hooks.
- Nuevos componentes independientes.
- Capas de datos.
- Conexiones backend.

## Stack Tecnológico

### Frontend

Tecnología esperada:

- Next.js
- TypeScript
- React
- Componentes reutilizables

### Backend

**Supabase** será utilizado como plataforma backend. Incluye:

- PostgreSQL Database.
- Authentication.
- Storage para imágenes y archivos.
- Row Level Security (RLS).
- APIs automáticas.
- Gestión de usuarios.
