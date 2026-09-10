# Estado actual de la arquitectura

Fotografía de lo que hay implementado, no de lo que se planeó. Fecha: septiembre de 2026.

## Stack

Next.js 15 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
framer-motion · Recharts · lucide-react.

**No hay servidor propio ni base de datos.** Todo el estado vive en el
`localStorage` del navegador. Esto condiciona el resto del documento y está
señalado en cada punto donde importa.

## Rutas

### Entrada

| Ruta | Pública | Qué hace |
|---|---|---|
| `/` | No | Redirige: sin sesión al acceso, con sesión al inicio |
| `/presentacion` | Sí | Cuatro pantallas explicando la app. Se ve una sola vez |
| `/login` | Sí | Acceso y alta, con dos accesos de demostración |

El flujo es: presentación de marca (3,5 s) → presentación de la app → acceso →
aplicación. La portada de marketing sigue en `app/page.tsx` pero está fuera del
flujo; se recupera añadiendo `"/"` a `PUBLIC_ROUTES` en `components/AppShell.tsx`.

### Socio

| Ruta | Qué hace |
|---|---|
| `/dashboard` | Inicio: entrenamiento de hoy, racha, semana, accesos rápidos |
| `/entrenar` | Modo entrenamiento enfocado, con temporizador de descanso |
| `/ejercicios` | Biblioteca de 630 ejercicios y mapa muscular interactivo |
| `/rutinas` | Predefinidas, constructor propio e historial |
| `/progreso` | Objetivo, macros, mediciones, gráficas y récords |
| `/perfil` | Identidad del socio, logros, avisos y accesos secundarios |
| `/ajustes` | Tema, descanso, avisos, datos y cierre de sesión |
| `/nutricion` | Nutriólogo del gimnasio, calculadora de macros y dietas |
| `/gimnasio` | Galería, historia, planes, horarios y contacto |
| `/carnet` | Credencial digital del socio |
| `/bienvenido` | Alta y edición del perfil físico |
| `/educacion`, `/suplementos` | Contenido educativo |

### Administración

`/admin` y sus ocho módulos: usuarios, rutinas, ejercicios, progreso,
nutrición, gimnasio, notificaciones y configuración.

El área de administración **no reutiliza** el header ni la barra inferior del
socio: tiene su propia navegación (lateral en escritorio, tiras en móvil), para
que no haya duda de en qué zona se está.

## Capas

```
app/            Rutas (App Router). Casi todas son "use client":
                el estado vive en el navegador.
components/     Componentes propios + components/ui (primitivos shadcn)
lib/            Lógica de dominio sin interfaz
data/           Catálogos estáticos y datos de ejemplo
hooks/          Estado reutilizable
utils/          Cálculos puros (calorías, macros)
scripts/        Utilidades de construcción (marca)
```

### Módulos de `lib/`

| Módulo | Responsabilidad |
|---|---|
| `storage.ts` | Única puerta al `localStorage`. Claves centralizadas |
| `auth.ts` | Cuentas, roles, sesión, membresías. Siembra de cuentas |
| `brand.ts` | Identidad configurable y extracción de color del logotipo |
| `stats.ts` | Racha, volumen, récords y logros, derivados del historial |
| `workout.ts` | Construcción de sesiones y estimación de duración |
| `nutritionPlan.ts` | Plan nutricional, recomendaciones y comparación |
| `gymContent.ts` | Contenido del gimnasio editable desde el panel |
| `notifications.ts` | Avisos dentro de la aplicación |
| `demoData.ts` | Siembra de datos de la demostración |
| `onboarding.ts` | Marca de presentación vista |

## Sesión y roles

`components/AppProvider.tsx` mantiene el estado global (marca y sesión) y
`components/AppShell.tsx` aplica las guardas:

- Sin sesión y ruta protegida → presentación o acceso.
- Con sesión en `/login` o `/` → inicio, o panel si es administrador.
- Ruta de `/admin` sin rol admin → inicio.

Mientras la guarda decide no se pinta el contenido protegido, para que no asome
un instante antes de redirigir.

### Límite honesto

Las cuentas viven en el navegador del dispositivo. Las contraseñas se guardan
con SHA-256 en vez de en claro, pero **sin sal ni derivación lenta**: es higiene,
no seguridad. Cualquiera con acceso al navegador puede leer o alterar los datos.

Sirve para separar experiencias y demostrar el producto. El día que haya API,
se sustituyen las funciones de `lib/auth.ts` por llamadas de red y las pantallas
no se enteran.

## Decisiones que conviene no deshacer sin leer

- **El mapa muscular resuelve por músculo principal** (`muscles[0]`), no por el
  grupo amplio. Es lo que permite tocar cuádriceps, femoral o pantorrilla por
  separado sin re-etiquetar 630 ejercicios.
- **El resaltado del mapa se recorta con una máscara** del contorno del cuerpo,
  así que un trazado aproximado nunca pinta fuera de la figura.
- **Los cálculos de macros son los mismos** en Progreso y en Nutrición
  (`utils/macros.ts`): dos implementaciones acabarían discrepando.
- **La marca son datos, no constantes.** Cambiarla a código roto obliga a tocar
  todas las pantallas otra vez.
