import type { Supplement } from "@/lib/types";

export const SUPPLEMENTS: Supplement[] = [
  {
    id: "whey",
    name: "Proteína Whey",
    what: "Proteína del suero de la leche, de rápida absorción y con todos los aminoácidos esenciales.",
    purpose:
      "Ayuda a alcanzar el requerimiento diario de proteína cuando no llegas solo con comida.",
    benefits: [
      "Alto valor biológico y rica en leucina, el aminoácido clave para construir músculo.",
      "Cómoda y rápida: un batido equivale a la proteína de una pechuga.",
      "Versátil: batidos, tortitas, avena o yogur.",
    ],
    howToTake:
      "Mezclada con agua o leche, en cualquier momento del día. El clásico post-entreno es cómodo, pero lo importante es el total de proteína diario.",
    dose: "20-40 g por toma (1 scoop). 1-2 tomas al día según tu dieta.",
    relatedFoods: ["Pollo", "Huevos", "Pescado", "Lácteos", "Legumbres"],
    myths: [
      "«Daña los riñones»: falso en personas sanas; la evidencia no muestra daño renal.",
      "«Sin batido justo al acabar pierdes el entreno»: la ventana anabólica dura horas, no minutos.",
      "«Es solo para culturistas»: es simplemente comida en polvo.",
    ],
    recommendations: [
      "Prioriza siempre la proteína de alimentos; la whey es un complemento.",
      "Si tienes intolerancia a la lactosa, elige aislado (isolate).",
      "Busca marcas con certificados de pureza.",
    ],
  },
  {
    id: "creatina",
    name: "Creatina monohidrato",
    what: "Compuesto natural que recicla la energía rápida (ATP) del músculo. El suplemento con más evidencia científica del mundo deportivo.",
    purpose:
      "Aumenta la fuerza, la potencia y las repeticiones que puedes hacer, y con ello la ganancia muscular a largo plazo.",
    benefits: [
      "Más fuerza y rendimiento en series cortas e intensas.",
      "Mayor volumen celular y ganancia de masa magra.",
      "Beneficios cognitivos emergentes (memoria, fatiga mental).",
    ],
    howToTake:
      "Todos los días, con o sin entrenamiento, a cualquier hora. No necesita fase de carga ni descansos.",
    dose: "3-5 g diarios de creatina monohidrato (sello Creapure recomendado).",
    relatedFoods: ["Carne roja", "Pescado (arenque, salmón)", "Pollo"],
    myths: [
      "«Retiene líquidos malos»: el agua se almacena dentro del músculo, no bajo la piel.",
      "«Provoca calvicie»: la evidencia actual no lo respalda.",
      "«Hay que descansar de ella»: no es necesario, es segura de forma continua.",
    ],
    recommendations: [
      "La monohidrato es la forma más estudiada y barata: no pagues más por otras.",
      "Tómala con una comida para mejorar la absorción.",
      "Bebe suficiente agua a diario.",
    ],
  },
  {
    id: "complejo-b",
    name: "Complejo B",
    what: "Grupo de 8 vitaminas hidrosolubles (B1-B12) esenciales para el metabolismo energético y el sistema nervioso.",
    purpose:
      "Convierte los alimentos en energía utilizable y participa en la formación de glóbulos rojos y la función neuronal.",
    benefits: [
      "Apoya el metabolismo de carbohidratos, grasas y proteínas.",
      "Contribuye a reducir el cansancio y la fatiga.",
      "La B12 es clave en dietas vegetarianas y veganas.",
    ],
    howToTake: "Con el desayuno, con un vaso de agua.",
    dose: "1 cápsula diaria según etiqueta; B12: 25-100 µg/día (o 2000 µg semanales si eres vegano).",
    relatedFoods: ["Carne", "Huevos", "Lácteos", "Legumbres", "Cereales integrales"],
    myths: [
      "«Da energía instantánea»: no es un estimulante; solo corrige déficits.",
      "«Más dosis, más energía»: el exceso se elimina por la orina.",
      "«Todo el mundo la necesita»: con dieta variada y omnívora suele bastar.",
    ],
    recommendations: [
      "Imprescindible suplementar B12 si sigues dieta vegana.",
      "La orina amarilla intensa tras tomarlo es normal (riboflavina).",
      "Ante fatiga persistente, análisis de sangre antes que suplementos.",
    ],
  },
  {
    id: "omega-3",
    name: "Omega 3 (EPA y DHA)",
    what: "Ácidos grasos esenciales presentes en el pescado azul, con potente acción antiinflamatoria.",
    purpose:
      "Salud cardiovascular, cerebral y articular; puede ayudar en la recuperación muscular.",
    benefits: [
      "Reduce triglicéridos y apoya la salud del corazón.",
      "Acción antiinflamatoria útil para articulaciones.",
      "DHA fundamental para la función cerebral.",
    ],
    howToTake: "Con una comida principal que contenga grasa para mejorar su absorción.",
    dose: "1-3 g diarios de EPA+DHA combinados (revisa la etiqueta: importa el contenido de EPA/DHA, no el aceite total).",
    relatedFoods: ["Salmón", "Sardinas", "Caballa", "Nueces", "Semillas de lino y chía"],
    myths: [
      "«Cualquier omega vale»: el omega 3 vegetal (ALA) apenas se convierte en EPA/DHA.",
      "«Cuanto más, mejor»: dosis muy altas pueden afectar la coagulación.",
      "«Sustituye al pescado»: comer pescado azul 2-3 veces/semana sigue siendo lo ideal.",
    ],
    recommendations: [
      "Si comes pescado azul 2-3 veces por semana quizá no lo necesites.",
      "Guárdalo en lugar fresco: se oxida con facilidad.",
      "Busca certificados IFOS o similar de pureza.",
    ],
  },
  {
    id: "cafeina",
    name: "Cafeína",
    what: "Estimulante natural del sistema nervioso central, el potenciador del rendimiento más usado del mundo.",
    purpose:
      "Aumenta el estado de alerta, reduce la percepción del esfuerzo y mejora el rendimiento físico y mental.",
    benefits: [
      "Mejora fuerza, resistencia y potencia de forma comprobada.",
      "Reduce la sensación de fatiga durante el entrenamiento.",
      "Aumenta el foco y la motivación.",
    ],
    howToTake:
      "30-60 minutos antes de entrenar, en café, cápsulas o pre-entreno. Evítala 8-10 horas antes de dormir.",
    dose: "3-6 mg por kg de peso corporal (200-400 mg para la mayoría). Empieza por el rango bajo.",
    relatedFoods: ["Café", "Té verde y negro", "Cacao", "Yerba mate"],
    myths: [
      "«Deshidrata»: el efecto diurético es mínimo en consumidores habituales.",
      "«Es peligrosa para el corazón»: en dosis moderadas es segura en personas sanas.",
      "«Funciona igual siempre»: se genera tolerancia; ciclarla ayuda.",
    ],
    recommendations: [
      "Nunca la uses para compensar mal sueño de forma crónica.",
      "Si entrenas por la tarde-noche, valora entrenar sin ella.",
      "Descansa de la cafeína 1-2 semanas cada 2-3 meses para resensibilizar.",
    ],
  },
  {
    id: "electrolitos",
    name: "Electrolitos",
    what: "Minerales (sodio, potasio, magnesio, cloruro) que regulan la hidratación, los impulsos nerviosos y la contracción muscular.",
    purpose:
      "Reponer lo perdido por el sudor en entrenamientos largos, intensos o con mucho calor.",
    benefits: [
      "Previenen calambres y fatiga prematura.",
      "Mantienen el rendimiento en sesiones de +60-90 minutos.",
      "Mejoran la rehidratación frente al agua sola.",
    ],
    howToTake:
      "Disueltos en agua durante o después de sesiones largas, días de calor o sudoración abundante.",
    dose: "Según etiqueta; el sodio es el más importante: 300-600 mg por hora de ejercicio intenso.",
    relatedFoods: ["Plátano (potasio)", "Frutos secos (magnesio)", "Sal marina", "Agua de coco"],
    myths: [
      "«Necesitas bebida deportiva en cada entreno»: para sesiones normales de gym basta agua y comida.",
      "«El azúcar de las bebidas deportivas es imprescindible»: solo útil en esfuerzos largos.",
      "«Más sodio siempre es malo»: los deportistas que sudan mucho necesitan más que la población general.",
    ],
    recommendations: [
      "Para el gym típico de 60 minutos: agua y una dieta normal son suficientes.",
      "Úsalos en verano, cardio largo o si sudas de forma abundante.",
      "La orina amarillo claro es buen indicador de hidratación.",
    ],
  },
  {
    id: "magnesio",
    name: "Magnesio",
    what: "Mineral esencial que participa en más de 300 reacciones del cuerpo, incluida la función muscular y nerviosa.",
    purpose:
      "Cubrir un déficit muy común, apoyar el descanso, la función muscular y la recuperación.",
    benefits: [
      "Contribuye a la relajación muscular y puede reducir calambres.",
      "Apoya la calidad del sueño y el sistema nervioso.",
      "Participa en la síntesis de proteína y la producción de energía.",
    ],
    howToTake:
      "Preferiblemente por la noche, con la cena o antes de dormir.",
    dose: "200-400 mg de magnesio elemental. Formas citrato o bisglicinato se absorben mejor que el óxido.",
    relatedFoods: ["Espinacas", "Almendras", "Aguacate", "Chocolate negro", "Legumbres"],
    myths: [
      "«Cualquier forma de magnesio sirve»: el óxido se absorbe muy mal.",
      "«Es un somnífero»: ayuda al descanso, pero no sustituye la higiene del sueño.",
      "«Todos necesitamos suplementarlo»: primero revisa tu dieta.",
    ],
    recommendations: [
      "Deportistas y personas con mucho estrés suelen tener requerimientos mayores.",
      "Si produce molestias digestivas, reduce la dosis o cambia de forma química.",
      "Combina bien con rutinas de descanso nocturno.",
    ],
  },
  {
    id: "multivitaminico",
    name: "Multivitamínico",
    what: "Combinación de vitaminas y minerales en dosis cercanas a la cantidad diaria recomendada.",
    purpose:
      "Actuar como seguro nutricional cuando la dieta es incompleta, en definiciones agresivas o etapas de mucho estrés.",
    benefits: [
      "Cubre posibles microdeficiencias en dietas hipocalóricas.",
      "Práctico en viajes o épocas de comidas desordenadas.",
      "Apoya el sistema inmune en bloques de entrenamiento duros.",
    ],
    howToTake: "1 dosis diaria con el desayuno o la comida principal.",
    dose: "Según etiqueta del producto; evita megadosis (>>100% CDR de forma crónica).",
    relatedFoods: ["Frutas variadas", "Verduras de colores", "Frutos secos", "Pescado", "Huevos"],
    myths: [
      "«Sustituye a comer bien»: ningún multivitamínico replica una dieta variada.",
      "«Más vitaminas = más salud»: las liposolubles (A, D, E, K) se acumulan y pueden ser tóxicas.",
      "«Todos son iguales»: las formas químicas y dosis varían muchísimo.",
    ],
    recommendations: [
      "Prioriza siempre la comida real; úsalo como refuerzo puntual.",
      "En dietas de definición prolongadas tiene más sentido.",
      "La vitamina D merece analítica y suplementación específica si vives con poco sol.",
    ],
  },
  {
    id: "pre-entreno",
    name: "Pre-entreno",
    what: "Mezcla de ingredientes (cafeína, citrulina, beta-alanina...) diseñada para maximizar el rendimiento de la sesión.",
    purpose:
      "Dar un extra de energía, foco y congestión en entrenamientos exigentes.",
    benefits: [
      "Más energía y motivación en días difíciles.",
      "La citrulina mejora el flujo sanguíneo y la congestión.",
      "La beta-alanina retrasa la fatiga en series largas.",
    ],
    howToTake:
      "20-30 minutos antes de entrenar, disuelto en agua. Empieza con media dosis para evaluar tolerancia.",
    dose: "Según etiqueta. Referencias con evidencia: cafeína 200-300 mg, citrulina malato 6-8 g, beta-alanina 3-5 g/día.",
    relatedFoods: ["Café", "Remolacha (nitratos)", "Sandía (citrulina)"],
    myths: [
      "«Sin pre-entreno no rindes»: tu descanso y comida importan mucho más.",
      "«El cosquilleo significa que funciona»: la parestesia de la beta-alanina es inofensiva y no indica eficacia.",
      "«Cuanto más fuerte, mejor»: dosis excesivas de estimulantes empeoran el rendimiento y el sueño.",
    ],
    recommendations: [
      "Resérvalo para las sesiones más duras, no para cada entreno.",
      "Revisa la cafeína total del día si también tomas café.",
      "Un café solo + creatina diaria cubre el 90% del efecto por menos dinero.",
    ],
  },
];

export function getSupplement(id: string): Supplement | undefined {
  return SUPPLEMENTS.find((s) => s.id === id);
}
