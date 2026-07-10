# MASTER_ARCHITECTURE.md
# GymOS SaaS - Arquitectura Maestra del Proyecto
## 1. Visión del Producto
GymOS SaaS es una plataforma tecnológica diseñada para modernizar la operación de gimnasios, permitiendo que múltiples gimnasios puedan utilizar la misma aplicación bajo un modelo SaaS (Software as a Service).
El objetivo es crear una plataforma escalable donde cada gimnasio tenga su propio espacio independiente, usuarios, clientes, entrenadores, ejercicios, rutinas, pagos y configuraciones, manteniendo todos los datos completamente aislados.
La aplicación debe estar preparada para crecer desde un solo gimnasio hasta miles de gimnasios utilizando una sola base de código.
---
# 2. Objetivo Principal
Convertir la aplicación actual en una plataforma profesional para gimnasios con:
- Registro de gimnasios.
- Creación de perfiles de usuarios.
- Gestión de clientes.
- Gestión de entrenadores.
- Biblioteca de ejercicios con imágenes y videos.
- Creación de rutinas personalizadas.
- Seguimiento del progreso físico.
- Control administrativo.
- Modelo SaaS con diferentes planes de suscripción.
---
# 3. Arquitectura General
## Frontend actual
El frontend existente debe mantenerse.
Regla principal:
NO modificar:
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
---
# 4. Stack Tecnológico
## Frontend
Tecnología esperada:
- Next.js
- TypeScript
- React
- Componentes reutilizables
## Backend
Supabase será utilizado como plataforma backend:
Incluye:
- PostgreSQL Database.
- Authentication.
- Storage para imágenes y archivos.
- Row Level Security (RLS).
- APIs automáticas.
- Gestión de usuarios.
---
# 5. Arquitectura Multi-Tenant
Este es un principio obligatorio.
GymOS debe funcionar como un SaaS multi-tenant.
Esto significa:
Una sola aplicación.
Una sola base de código.
Múltiples gimnasios independientes.
Ejemplo:
Gym A:
- Clientes.
- Entrenadores.
- Ejercicios.
- Pagos.
Gym B:
- Clientes.
- Entrenadores.
- Ejercicios.
- Pagos.
Ambos viven en la misma plataforma pero nunca pueden ver información del otro.
---
# 6. Regla principal de aislamiento
Todas las tablas importantes deben tener:

gym_id

Este campo identifica a qué gimnasio pertenece cada registro.
Ejemplo:
Tabla usuarios:

id
gym_id
nombre
email
rol
fecha_creacion

Tabla ejercicios:

id
gym_id
nombre
descripcion
imagen
video
categoria

---
# 7. Seguridad con Row Level Security (RLS)
Supabase debe utilizar políticas RLS estrictas.
Regla:
Un usuario solamente puede consultar o modificar información perteneciente a su gimnasio.
Nunca confiar únicamente en el frontend.
La seguridad debe existir en la base de datos.
---
# 8. Roles del Sistema
## Super Admin
Administrador global de la plataforma.
Puede:
- Ver todos los gimnasios.
- Gestionar planes.
- Administrar usuarios.
- Revisar métricas generales.
---
## Dueño del Gimnasio
Administrador de un gimnasio específico.
Puede:
- Crear usuarios.
- Administrar clientes.
- Crear entrenadores.
- Subir ejercicios.
- Crear rutinas.
- Gestionar configuración del gimnasio.
---
## Entrenador
Puede:
- Crear rutinas.
- Asignar ejercicios.
- Revisar progreso de clientes.
- Gestionar planes de entrenamiento.
---
## Cliente
Puede:
- Crear perfil.
- Consultar rutinas.
- Ver ejercicios.
- Registrar progreso.
- Subir información personal.
---
# 9. Sistema de Usuarios
Cada usuario debe tener:
Perfil propio.
Información esperada:
- Nombre.
- Foto.
- Edad.
- Peso.
- Altura.
- Objetivo físico.
- Nivel de experiencia.
- Historial de entrenamiento.
---
# 10. Sistema de Ejercicios
Debe existir una biblioteca central de ejercicios.
Cada ejercicio puede contener:
- Nombre.
- Descripción.
- Grupo muscular.
- Imagen.
- Video.
- Instrucciones.
- Errores comunes.
- Equipamiento necesario.
Las imágenes deben almacenarse usando:
Supabase Storage.
---
# 11. Base de Datos
Antes de crear código se debe diseñar:
- Tablas.
- Relaciones.
- Índices.
- Llaves primarias.
- Llaves foráneas.
- Políticas RLS.
Crear documentación antes de migraciones.
---
# 12. Principios de Desarrollo
Seguir:
## Clean Architecture
Separación clara entre:
- UI.
- Lógica.
- Datos.
- Servicios.
---
## SOLID
El código debe ser:
- Fácil de mantener.
- Fácil de extender.
- Fácil de modificar.
---
# 13. Escalabilidad
El sistema debe estar preparado para:
- Miles de gimnasios.
- Millones de usuarios.
- Grandes cantidades de imágenes.
- Muchas consultas simultáneas.
Evitar soluciones temporales.
Pensar siempre como producto comercial.
---
# 14. Futuras Funciones Planeadas
La arquitectura debe permitir agregar:
## Inteligencia Artificial
- Creación automática de rutinas.
- Recomendaciones.
- Análisis de progreso.
## Pagos
- Suscripciones mensuales.
- Planes premium.
- Facturación.
## White Label
Cada gimnasio podría tener:
- Su propio logo.
- Colores.
- Dominio personalizado.
## Aplicación móvil
Preparar backend para futuras apps móviles.
---
# 15. Roadmap General
## Fase 1
Conectar Supabase.
Crear:
- Usuarios.
- Autenticación.
- Perfiles.
- Roles.
---
## Fase 2
Crear base de datos:
- Gimnasios.
- Clientes.
- Entrenadores.
- Ejercicios.
- Rutinas.
---
## Fase 3
Agregar:
- Storage de imágenes.
- Videos.
- Seguimiento físico.
---
## Fase 4
Modelo SaaS:
- Planes.
- Pagos.
- Administración global.
---
# 16. Regla final para cualquier IA de desarrollo
Antes de modificar código:
1. Analizar la estructura actual.
2. Entender componentes existentes.
3. Crear documentación.
4. Proponer cambios.
5. Esperar aprobación.
Nunca romper funcionalidades existentes.
El objetivo es construir un producto comercial profesional y escalable.
---
FIN DEL DOCUMENTO
