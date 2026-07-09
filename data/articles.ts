import type { Article } from "@/lib/types";

export const ARTICLES: Article[] = [
  {
    id: "como-empezar",
    title: "Cómo empezar en el gimnasio",
    category: "Primeros pasos",
    readMinutes: 6,
    summary:
      "Guía práctica para tus primeras semanas: qué hacer, qué evitar y cómo convertir el gimnasio en un hábito que dure.",
    sections: [
      {
        heading: "Las primeras 4 semanas son de adaptación",
        content:
          "Tu único objetivo al empezar no es levantar mucho: es aprender los movimientos y crear el hábito de asistir. Empieza con 2-3 días por semana usando una rutina sencilla (la de Adaptación al gimnasio de FITCORE es perfecta). Las máquinas guiadas son tus aliadas al principio porque estabilizan el peso por ti mientras aprendes el patrón.",
      },
      {
        heading: "Menos es más",
        content:
          "El error número uno del principiante es hacer demasiado, demasiado pronto. Entrenar 6 días con agujetas brutales solo consigue que abandones en la semana 3. Con 3 sesiones de 45-60 minutos bien hechas progresarás durante meses. La motivación te trae al gimnasio; la rutina razonable te mantiene en él.",
      },
      {
        heading: "Pide ayuda sin vergüenza",
        content:
          "Nadie nace sabiendo usar una máquina de poleas. Pregunta a los monitores de sala: están para eso. Y recuerda: nadie te está mirando; cada persona del gimnasio está concentrada en su propio entrenamiento y todos fueron principiantes un día.",
      },
      {
        heading: "Tu checklist de inicio",
        content:
          "1) Elige una rutina de principiante y síguela 8 semanas sin cambiarla. 2) Apunta los pesos que usas (FITCORE lo hace por ti). 3) Duerme 7-9 horas. 4) Come proteína en cada comida. 5) Celebra la constancia, no la perfección: ir el 80% de los días planificados es un éxito rotundo.",
      },
    ],
  },
  {
    id: "principios-entrenamiento",
    title: "Principios básicos de entrenamiento",
    category: "Fundamentos",
    readMinutes: 7,
    summary:
      "Sobrecarga progresiva, volumen, intensidad y frecuencia: los cuatro pilares que explican el 95% de tus resultados.",
    sections: [
      {
        heading: "Sobrecarga progresiva: la regla de oro",
        content:
          "El músculo crece cuando lo obligas a hacer algo más de lo que está acostumbrado. Eso significa que, con el tiempo, debes aumentar el peso, las repeticiones o las series. Si hoy haces press banca con 40 kg x 10 y dentro de un año sigues igual, tu cuerpo no tiene ninguna razón para cambiar. Apunta tus entrenamientos y busca superar tus números poco a poco.",
      },
      {
        heading: "Volumen: la dosis de entrenamiento",
        content:
          "El volumen son las series efectivas semanales por grupo muscular. La evidencia apunta a que 10-20 series semanales por músculo es el rango óptimo para la mayoría. Menos de 8-10 series deja resultados sobre la mesa; más de 20-25 suele superar tu capacidad de recuperación.",
      },
      {
        heading: "Intensidad: entrenar cerca del fallo",
        content:
          "Las series efectivas son las que terminan cerca del fallo muscular: cuando acabas la serie deberías poder hacer solo 1-3 repeticiones más. Si terminas cada serie pudiendo hacer 6 más, el estímulo es insuficiente aunque el volumen sea alto.",
      },
      {
        heading: "Frecuencia y descanso",
        content:
          "Cada músculo rinde mejor entrenándolo 2 veces por semana que concentrando todo en un solo día. Y el crecimiento ocurre durante el descanso: entrenar un músculo dolorido y sin recuperar es restar, no sumar. Deja 48-72 horas entre sesiones del mismo grupo muscular.",
      },
    ],
  },
  {
    id: "tecnica-correcta",
    title: "Técnica correcta: tu seguro de vida",
    category: "Fundamentos",
    readMinutes: 5,
    summary:
      "Por qué la técnica importa más que el peso, cómo aprenderla y las señales de que algo estás haciendo mal.",
    sections: [
      {
        heading: "Técnica primero, peso después",
        content:
          "Una repetición con buena técnica estimula el músculo objetivo y protege tus articulaciones. Una repetición trampeada reparte la carga en tejidos que no deberían recibirla: lumbares, hombros, codos. La regla es simple: gana el derecho a subir peso demostrando técnica perfecta en el peso actual.",
      },
      {
        heading: "Cómo aprender un ejercicio nuevo",
        content:
          "1) Mira la técnica en la biblioteca de FITCORE y entiende qué músculo trabaja. 2) Hazlo sin peso o con el peso mínimo 2-3 sesiones. 3) Grábate de lado con el móvil y compara. 4) Sube la carga solo cuando el movimiento sea idéntico en la primera y en la última repetición.",
      },
      {
        heading: "Señales de alarma",
        content:
          "Dolor articular agudo (no confundir con el ardor muscular), necesidad de impulso para completar repeticiones, rango de movimiento que se acorta a mitad de serie y asimetrías notables entre lados. Si aparecen, baja el peso un 20-30% y reconstruye el patrón.",
      },
      {
        heading: "El rango completo gana",
        content:
          "Entrenar con rango de movimiento completo genera más músculo que las medias repeticiones con más peso, y además mejora tu movilidad. El estiramiento bajo carga (la parte baja de un press o una sentadilla) es de los estímulos más potentes que existen.",
      },
    ],
  },
  {
    id: "descanso-muscular",
    title: "Descanso muscular: donde ocurre el crecimiento",
    category: "Recuperación",
    readMinutes: 5,
    summary:
      "El entrenamiento es el estímulo; el descanso es cuando tu cuerpo construye. Aprende a programar la recuperación.",
    sections: [
      {
        heading: "El músculo crece fuera del gimnasio",
        content:
          "Entrenar daña las fibras musculares de forma controlada. Es en las 24-72 horas siguientes, comiendo y durmiendo, cuando el cuerpo las reconstruye más fuertes. Sin recuperación suficiente el proceso queda incompleto y el rendimiento cae sesión tras sesión.",
      },
      {
        heading: "Cuánto descanso necesita cada músculo",
        content:
          "Como norma general: 48 horas para grupos pequeños (bíceps, hombro) y 72 horas para grupos grandes (pierna, espalda). Por eso las rutinas divididas funcionan: mientras el pecho se recupera, entrenas la pierna.",
      },
      {
        heading: "Señales de que no te recuperas",
        content:
          "Pesos que bajan en lugar de subir, agujetas que duran más de 3 días, sueño alterado, pulsaciones en reposo elevadas y desmotivación constante. Son la antesala del sobreentrenamiento: baja el volumen un 30-50% durante una semana (descarga) y volverás más fuerte.",
      },
      {
        heading: "El descanso también se programa",
        content:
          "Cada 6-8 semanas de entrenamiento duro, planifica una semana de descarga: mismo entreno con la mitad de series o el 70% del peso. No es perder el tiempo: es consolidar las adaptaciones y prevenir lesiones.",
      },
    ],
  },
  {
    id: "importancia-sueno",
    title: "La importancia del sueño",
    category: "Recuperación",
    readMinutes: 6,
    summary:
      "Dormir es el potenciador de rendimiento más infravalorado: regula tus hormonas, tu apetito y tu progreso.",
    sections: [
      {
        heading: "Qué pasa mientras duermes",
        content:
          "Durante el sueño profundo se libera la mayor parte de la hormona de crecimiento del día y se ejecuta la reparación muscular. Dormir menos de 6 horas de forma crónica reduce la síntesis de proteína muscular, aumenta el cortisol y desequilibra las hormonas del hambre (más grelina, menos leptina): tienes más apetito justo cuando peor decides.",
      },
      {
        heading: "Sueño y pérdida de grasa",
        content:
          "En estudios de déficit calórico, las personas que dormían 5.5 horas perdieron hasta un 55% menos grasa (y más músculo) que las que dormían 8.5 horas con la misma dieta. Si estás en definición, el sueño no es negociable.",
      },
      {
        heading: "Higiene del sueño para deportistas",
        content:
          "Horario constante (incluso fines de semana), habitación fresca y oscura, sin pantallas 60 minutos antes, sin cafeína 8-10 horas antes de acostarte y la cena al menos 1-2 horas antes de dormir. Si entrenas de noche, baja la intensidad de la última hora o adelanta la sesión.",
      },
      {
        heading: "La siesta cuenta",
        content:
          "Si no llegas a 7-9 horas nocturnas, una siesta de 20-30 minutos mejora el rendimiento y el estado de alerta sin interferir con el sueño nocturno.",
      },
    ],
  },
  {
    id: "alimentacion-deportiva",
    title: "Alimentación deportiva: lo esencial",
    category: "Nutrición",
    readMinutes: 8,
    summary:
      "Calorías, proteína y timing: la jerarquía real de la nutrición deportiva explicada sin mitos.",
    sections: [
      {
        heading: "La jerarquía de la nutrición",
        content:
          "De más a menos importante: 1) Balance calórico (define si ganas o pierdes peso). 2) Proteína diaria total. 3) Reparto de carbohidratos y grasas. 4) Timing de las comidas. 5) Suplementos. La mayoría de la gente invierte este orden: se obsesiona con suplementos y horarios mientras descuida las calorías totales.",
      },
      {
        heading: "Proteína: cuánta y de dónde",
        content:
          "Entre 1.6 y 2.2 g por kg de peso corporal al día es el rango respaldado por la evidencia para ganar músculo o preservarlo en definición. Repártela en 3-5 comidas con 25-40 g cada una. Fuentes de calidad: huevo, pollo, pescado, lácteos, legumbres, tofu y whey.",
      },
      {
        heading: "Carbohidratos: el combustible del entreno",
        content:
          "Los carbohidratos no engordan por sí mismos: el exceso calórico engorda. Para entrenar fuerza con intensidad, los carbohidratos son tu gasolina. Concentra una buena ración en las 2-3 horas previas al entreno y en la comida posterior. Prioriza fuentes integrales: arroz, avena, patata, fruta y legumbre.",
      },
      {
        heading: "Hidratación y comida alrededor del entreno",
        content:
          "Una deshidratación del 2% ya reduce tu rendimiento. Bebe 2-3 litros diarios y llega al entreno hidratado. Antes de entrenar: carbohidrato + algo de proteína (ej. yogur con fruta). Después: proteína + carbohidrato (ej. pollo con arroz). Nada de esto requiere productos mágicos.",
      },
    ],
  },
  {
    id: "errores-principiantes",
    title: "Errores comunes de principiantes",
    category: "Primeros pasos",
    readMinutes: 6,
    summary:
      "Los 7 errores que retrasan (o arruinan) el progreso de casi todo el que empieza, y cómo evitarlos desde el día uno.",
    sections: [
      {
        heading: "1. Cambiar de rutina cada dos semanas",
        content:
          "Ninguna rutina funciona en 15 días. El cuerpo necesita 6-8 semanas de estímulo consistente para mostrar adaptaciones. Elige un programa adecuado a tu nivel y cúmplelo al menos 2 meses antes de juzgarlo. La 'confusión muscular' es marketing, no ciencia.",
      },
      {
        heading: "2. Ego lifting",
        content:
          "Cargar más peso del que controlas para impresionar acaba en técnica rota y lesiones. El músculo no sabe cuántos kilos hay en la barra: sabe cuánta tensión recibe. Una serie controlada con 60 kg estimula más que una trampeada con 80.",
      },
      {
        heading: "3. Ignorar la pierna y la espalda",
        content:
          "Entrenar solo lo que se ve en el espejo (pecho y brazo) crea descompensaciones posturales y un físico desproporcionado. Pierna y espalda son los grupos más grandes del cuerpo: entrenarlos dispara tu progreso global.",
      },
      {
        heading: "4. No apuntar los entrenamientos",
        content:
          "Sin registro no hay sobrecarga progresiva, solo sensaciones. Apunta ejercicio, peso, series y repeticiones de cada sesión (el modo entrenamiento de FITCORE lo guarda automáticamente).",
      },
      {
        heading: "5, 6 y 7: dieta, sueño y paciencia",
        content:
          "Entrenar perfecto con dieta caótica es remar contra corriente. Dormir 5 horas sabotea la recuperación. Y esperar resultados visibles en 3 semanas lleva a la frustración: los cambios notables llegan entre los 3 y 6 meses de constancia. El fitness es un juego de años, y por eso funciona.",
      },
    ],
  },
];

export function getArticle(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}
