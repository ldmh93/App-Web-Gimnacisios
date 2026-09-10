# Demostración y credenciales

Todos los datos de este documento son **ficticios**. Los correos usan un
dominio de ejemplo y no corresponden a personas reales.

## Cómo entrar

En la pantalla de acceso hay dos botones que entran directamente, sin escribir
nada:

| Botón | Cuenta | Contraseña |
|---|---|---|
| **Socio · Andrea Salazar** | `demo@marafitness.app` | `demo1234` |
| **Administrador del gimnasio** | `admin@marafitness.app` | `admin1234` |

Los diez socios de ejemplo comparten la contraseña `demo1234`, así que se puede
entrar como cualquiera de ellos escribiendo su correo.

> Recordatorio: las cuentas viven en el navegador. Esto **no es seguridad
> real** y no debe usarse con contraseñas de verdad.

## Qué trae el socio de demostración

Andrea Salazar tiene cargado lo suficiente para que ninguna pantalla salga
vacía:

| Dato | Contenido |
|---|---|
| Perfil | 29 años, 64,2 kg, 167 cm, objetivo recomposición, nivel intermedio |
| Mediciones | 12 semanas: peso, cintura, cadera, brazo, pecho, pierna y % de grasa |
| Historial | 40 sesiones en 12 semanas, con cargas que suben con el tiempo |
| Rutina propia | «Mi rutina de fuerza», 5 ejercicios |
| Plan de hoy | Empuje: pecho y hombro |
| Favoritos | 4 ejercicios |
| Plan nutricional | Calculado, con comparación «antes / ahora» |
| Avisos | 3 publicados por el gimnasio |

### Por qué los datos son así

- **La evolución es coherente con el objetivo.** Con recomposición el peso baja
  poco (68,4 → 64,2 kg) pero la cintura baja más y el brazo sube. Un peso
  desplomándose no encajaría con el objetivo elegido.
- **La asistencia tiene huecos.** Tres meses sin fallar un día no se lo cree
  nadie, y además dejaría sin probar cómo se ve una racha rota.
- **Las cargas progresan.** Las sesiones antiguas pesan menos, para que los
  récords personales tengan sentido.

## Los diez socios

Definidos en `data/demoMembers.ts`, con membresías en todos los estados para
poder demostrar los avisos del panel:

| Socio | Estado de la membresía |
|---|---|
| Andrea Salazar | Mensual, vence en 16 días |
| Bruno Ontiveros | Anual, vence en 128 días |
| Camila Rentería | Trimestral, **vence en 4 días** |
| Diego Palacios | Mensual, vence en 22 días |
| Elena Vidaurri | Mensual, **vencida hace 9 días** |
| Fernando Quiroz | Trimestral, vence en 72 días |
| Gabriela Mondragón | Mensual, alta reciente (9 días) |
| Héctor Zamudio | **Sin membresía** |
| Itzel Barragán | Pase del día |
| Joaquín Treviño | Anual, vence en 25 días |

Camila dispara el aviso «vence esta semana» del resumen, Elena aparece marcada
en rojo y Gabriela cuenta como alta reciente. Están puestos así a propósito:
diez socios todos iguales no probarían nada.

## Reiniciar la demostración

**Ajustes → Restaurar datos de demostración** vuelve a dejarlo todo como recién
instalado. Útil entre una presentación y la siguiente.

## Cómo se siembra

- Las **cuentas** se crean al arrancar la aplicación (`ensureSeedAccounts`).
- Los **datos de entrenamiento** solo se siembran cuando entra la cuenta demo
  (`seedDemoData`, marcada con `fitcore:demo-seeded`).

Están separados a propósito: si se sembrara al arrancar, alguien que se
registrase de verdad se encontraría el historial de Andrea en su cuenta.

## Recorrido sugerido para enseñarla

1. Abrir en pestaña nueva → presentación de marca y de la app.
2. Entrar como socio.
3. **Hoy**: entrenamiento del día, racha y semana.
4. **Ejercicios**: tocar un músculo en el cuerpo, abrir una ficha.
5. **Entrenar**: cerrar una serie y ver el descanso automático.
6. **Progreso**: objetivo, macros y gráficas de 12 semanas.
7. **Perfil**: logros y avisos del gimnasio.
8. **Ajustes**: tema, descanso y cierre de sesión.
9. Entrar como administrador → Usuarios, Gimnasio y Configuración.
