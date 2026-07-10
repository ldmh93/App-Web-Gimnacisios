# 4. Roles del Sistema y Usuarios

> Parte de la arquitectura maestra de GymOS SaaS. Índice: [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md)

## Roles del Sistema

### Super Admin

Administrador global de la plataforma. Puede:

- Ver todos los gimnasios.
- Gestionar planes.
- Administrar usuarios.
- Revisar métricas generales.

### Dueño del Gimnasio

Administrador de un gimnasio específico. Puede:

- Crear usuarios.
- Administrar clientes.
- Crear entrenadores.
- Subir ejercicios.
- Crear rutinas.
- Gestionar configuración del gimnasio.

### Entrenador

Puede:

- Crear rutinas.
- Asignar ejercicios.
- Revisar progreso de clientes.
- Gestionar planes de entrenamiento.

### Cliente

Puede:

- Crear perfil.
- Consultar rutinas.
- Ver ejercicios.
- Registrar progreso.
- Subir información personal.

## Sistema de Usuarios

Cada usuario debe tener perfil propio. Información esperada:

- Nombre.
- Foto.
- Edad.
- Peso.
- Altura.
- Objetivo físico.
- Nivel de experiencia.
- Historial de entrenamiento.
