# Documentación

Índice de la documentación del proyecto.

## Estado actual

| Documento | Qué cubre |
|---|---|
| [11-estado-actual.md](11-estado-actual.md) | Arquitectura real hoy: rutas, capas, sesión y roles |
| [12-datos-y-almacenamiento.md](12-datos-y-almacenamiento.md) | Modelo de datos, claves de almacenamiento y migración a API |
| [13-marca-y-assets.md](13-marca-y-assets.md) | Cómo cambiar el logotipo y los colores de un gimnasio |
| [14-demo-y-credenciales.md](14-demo-y-credenciales.md) | Cuentas de prueba y qué datos trae la demostración |

## Documentos de diseño (julio, anteriores al login y al panel)

Se conservan porque la visión y los principios siguen vigentes, pero la
arquitectura que describen es anterior a la sesión, el panel de administración
y la marca configurable. Ante una discrepancia, mandan los documentos de
arriba.

- [MASTER_ARCHITECTURE.md](MASTER_ARCHITECTURE.md)
- [01-vision-y-objetivos.md](01-vision-y-objetivos.md)
- [02-arquitectura-y-stack.md](02-arquitectura-y-stack.md)
- [03-multi-tenant-y-seguridad.md](03-multi-tenant-y-seguridad.md)
- [04-roles-y-usuarios.md](04-roles-y-usuarios.md)
- [05-sistema-de-ejercicios.md](05-sistema-de-ejercicios.md)
- [06-base-de-datos.md](06-base-de-datos.md)
- [07-principios-y-escalabilidad.md](07-principios-y-escalabilidad.md)
- [08-roadmap-y-futuro.md](08-roadmap-y-futuro.md)
- [09-reglas-para-ia.md](09-reglas-para-ia.md)
- [10-auditoria-ux-movil.md](10-auditoria-ux-movil.md)

## Arrancar el proyecto

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # compilación de producción
npx next lint        # análisis estático
npx tsc --noEmit     # comprobación de tipos
```

> No ejecutes `npm run build` con `npm run dev` en marcha: ambos escriben en
> `.next` y el servidor de desarrollo se queda sirviendo errores 500 hasta que
> se borra la carpeta y se reinicia.
