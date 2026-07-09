import type { Diet } from "@/lib/types";

export const DIETS: Diet[] = [
  {
    id: "definicion-hombre",
    name: "Definición hombre",
    goal: "Perder grasa",
    description:
      "Déficit moderado con proteína alta para hombres que entrenan fuerza 3-5 días por semana y quieren marcar el músculo construido.",
    calories: 2100,
    protein: 180,
    carbs: 190,
    fats: 65,
    meals: [
      {
        name: "Desayuno",
        title: "Revuelto de claras con avena",
        ingredients: [
          "4 claras + 2 huevos enteros",
          "60 g de avena",
          "1 plátano",
          "Canela y café solo",
        ],
        preparation:
          "Cocina el revuelto en sartén antiadherente. Mezcla la avena con agua o leche desnatada en el microondas 2 minutos y corónala con el plátano y canela.",
      },
      {
        name: "Comida",
        title: "Pechuga de pollo con arroz y brócoli",
        ingredients: [
          "200 g de pechuga de pollo",
          "80 g de arroz basmati (en seco)",
          "200 g de brócoli",
          "1 cucharada de aceite de oliva",
        ],
        preparation:
          "Cocina el arroz. Saltea el pollo en tiras con especias y el aceite; añade el brócoli al vapor los últimos minutos.",
      },
      {
        name: "Cena",
        title: "Salmón al horno con ensalada",
        ingredients: [
          "180 g de salmón",
          "Ensalada verde grande (lechuga, tomate, pepino)",
          "150 g de patata cocida",
          "Limón y especias",
        ],
        preparation:
          "Hornea el salmón 15 minutos a 200 °C con limón. Acompaña con la patata cocida y la ensalada aliñada con vinagre.",
      },
      {
        name: "Snacks",
        title: "Yogur proteico y frutos secos",
        ingredients: [
          "1 yogur griego 0% o skyr",
          "1 scoop de proteína whey",
          "20 g de almendras",
          "1 manzana",
        ],
        preparation:
          "Reparte entre media mañana y media tarde. El batido de whey encaja perfecto después de entrenar.",
      },
    ],
  },
  {
    id: "definicion-mujer",
    name: "Definición mujer",
    goal: "Perder grasa",
    description:
      "Plan hipocalórico saciante con proteína alta y grasas saludables, pensado para mujeres que entrenan fuerza y quieren definir sin pasar hambre.",
    calories: 1650,
    protein: 130,
    carbs: 150,
    fats: 55,
    meals: [
      {
        name: "Desayuno",
        title: "Tostadas integrales con huevo y aguacate",
        ingredients: [
          "2 rebanadas de pan integral",
          "2 huevos",
          "1/2 aguacate",
          "Tomate y orégano",
        ],
        preparation:
          "Tuesta el pan, machaca el aguacate encima y corona con los huevos a la plancha o poché.",
      },
      {
        name: "Comida",
        title: "Bowl de quinoa con pollo",
        ingredients: [
          "150 g de pechuga de pollo",
          "60 g de quinoa (en seco)",
          "Verduras salteadas variadas",
          "1 cucharadita de aceite de oliva",
        ],
        preparation:
          "Cuece la quinoa 15 minutos. Saltea el pollo en dados con las verduras y monta el bowl.",
      },
      {
        name: "Cena",
        title: "Merluza con verduras al horno",
        ingredients: [
          "180 g de merluza",
          "Calabacín, pimiento y cebolla",
          "100 g de boniato",
          "Especias al gusto",
        ],
        preparation:
          "Hornea todo junto en papillote o bandeja 20 minutos a 190 °C.",
      },
      {
        name: "Snacks",
        title: "Queso fresco batido con frutos rojos",
        ingredients: [
          "250 g de queso fresco batido 0%",
          "100 g de frutos rojos",
          "10 g de nueces",
          "Infusión o café",
        ],
        preparation:
          "Mezcla el queso batido con los frutos rojos y las nueces. Perfecto para la tarde o como postre de la cena.",
      },
    ],
  },
  {
    id: "volumen-limpio",
    name: "Volumen limpio",
    goal: "Ganar músculo",
    description:
      "Superávit controlado (+300 kcal) con alimentos densos en nutrientes para ganar músculo minimizando la acumulación de grasa.",
    calories: 3000,
    protein: 175,
    carbs: 360,
    fats: 85,
    meals: [
      {
        name: "Desayuno",
        title: "Porridge de avena con whey",
        ingredients: [
          "90 g de avena",
          "1 scoop de proteína whey",
          "1 plátano y 15 g de mantequilla de cacahuete",
          "300 ml de leche semidesnatada",
        ],
        preparation:
          "Cocina la avena con la leche, retira del fuego y mezcla la whey. Añade el plátano en rodajas y la crema de cacahuete.",
      },
      {
        name: "Comida",
        title: "Ternera magra con pasta",
        ingredients: [
          "180 g de ternera magra",
          "110 g de pasta integral (en seco)",
          "Salsa de tomate natural",
          "Queso parmesano rallado (15 g)",
        ],
        preparation:
          "Saltea la ternera picada con la salsa de tomate y mézclala con la pasta cocida. Termina con el parmesano.",
      },
      {
        name: "Cena",
        title: "Pollo con arroz y aguacate",
        ingredients: [
          "180 g de muslo de pollo deshuesado",
          "90 g de arroz (en seco)",
          "1/2 aguacate",
          "Verduras a la plancha",
        ],
        preparation:
          "Plancha el pollo especiado, sirve con el arroz, el aguacate laminado y las verduras.",
      },
      {
        name: "Snacks",
        title: "Batido calórico + tortitas de arroz",
        ingredients: [
          "1 scoop de whey con 300 ml de leche",
          "4 tortitas de arroz con miel",
          "30 g de frutos secos",
          "1 pieza de fruta",
        ],
        preparation:
          "El batido después de entrenar; el resto repartido entre media mañana y media tarde.",
      },
    ],
  },
  {
    id: "volumen-economico",
    name: "Volumen económico",
    goal: "Ganar músculo con bajo presupuesto",
    description:
      "Calorías y proteína suficientes usando los alimentos con mejor relación precio/nutrientes: huevo, arroz, legumbre, atún y pollo entero.",
    calories: 3000,
    protein: 160,
    carbs: 390,
    fats: 80,
    meals: [
      {
        name: "Desayuno",
        title: "Huevos revueltos con avena y plátano",
        ingredients: [
          "3 huevos",
          "100 g de avena",
          "1 plátano",
          "Leche entera (300 ml)",
        ],
        preparation:
          "Revuelve los huevos. Mezcla la avena con la leche (cruda o cocida) y añade el plátano.",
      },
      {
        name: "Comida",
        title: "Arroz con lentejas y muslos de pollo",
        ingredients: [
          "100 g de arroz (en seco)",
          "80 g de lentejas (en seco)",
          "2 muslos de pollo",
          "Sofrito de cebolla, ajo y zanahoria",
        ],
        preparation:
          "Cocina las lentejas con el sofrito, hornea los muslos con especias y sirve todo con el arroz. Cocina cantidad doble y guarda para el día siguiente.",
      },
      {
        name: "Cena",
        title: "Pasta con atún y tomate",
        ingredients: [
          "110 g de pasta (en seco)",
          "2 latas de atún",
          "Salsa de tomate",
          "1 huevo duro",
        ],
        preparation:
          "Cuece la pasta, mezcla con el atún escurrido y el tomate. Añade el huevo duro troceado.",
      },
      {
        name: "Snacks",
        title: "Bocadillo de atún + leche",
        ingredients: [
          "Pan (100 g) con 1 lata de atún",
          "1 vaso grande de leche entera",
          "1 pieza de fruta de temporada",
          "Cacahuetes (30 g)",
        ],
        preparation:
          "El bocadillo funciona perfecto como post-entreno económico en lugar de suplementos.",
      },
    ],
  },
  {
    id: "recomposicion",
    name: "Recomposición corporal",
    goal: "Perder grasa y ganar músculo a la vez",
    description:
      "Déficit ligero con proteína muy alta. Ideal para principiantes con grasa que sobra o personas que vuelven al gimnasio: el cuerpo usa la grasa como energía mientras construye músculo.",
    calories: 2300,
    protein: 185,
    carbs: 215,
    fats: 70,
    meals: [
      {
        name: "Desayuno",
        title: "Tortilla de claras con pan integral",
        ingredients: [
          "5 claras + 1 huevo",
          "2 rebanadas de pan integral",
          "1/2 aguacate",
          "Café o té",
        ],
        preparation:
          "Haz la tortilla a fuego medio y sírvela sobre el pan con el aguacate.",
      },
      {
        name: "Comida",
        title: "Pavo con patata y judías verdes",
        ingredients: [
          "200 g de pechuga de pavo",
          "250 g de patata",
          "200 g de judías verdes",
          "1 cucharada de aceite de oliva",
        ],
        preparation:
          "Cuece o asa la patata, plancha el pavo y saltea las judías con ajo.",
      },
      {
        name: "Cena",
        title: "Revuelto de gambas con arroz",
        ingredients: [
          "200 g de gambas",
          "70 g de arroz (en seco)",
          "2 huevos",
          "Espinacas y ajo",
        ],
        preparation:
          "Saltea las gambas con ajo y espinacas, añade el arroz cocido y liga con los huevos.",
      },
      {
        name: "Snacks",
        title: "Whey + requesón nocturno",
        ingredients: [
          "1 scoop de whey post-entreno",
          "200 g de requesón o queso batido antes de dormir",
          "1 pieza de fruta",
          "15 g de nueces",
        ],
        preparation:
          "La caseína del requesón libera aminoácidos durante la noche, útil en recomposición.",
      },
    ],
  },
  {
    id: "principiante-gym",
    name: "Principiante gimnasio",
    goal: "Crear hábitos y rendir en el entreno",
    description:
      "Plan sencillo de mantenimiento ligeramente alto en proteína. Sin pesajes complicados: raciones fáciles de repetir para construir el hábito de comer bien.",
    calories: 2400,
    protein: 150,
    carbs: 280,
    fats: 75,
    meals: [
      {
        name: "Desayuno",
        title: "Yogur con granola y fruta",
        ingredients: [
          "2 yogures griegos",
          "40 g de granola o avena",
          "1 plátano o manzana",
          "1 puñado de nueces",
        ],
        preparation:
          "Monta el bowl en 2 minutos. Si prefieres salado, cámbialo por tostadas con huevo.",
      },
      {
        name: "Comida",
        title: "Plato equilibrado 1/2 - 1/4 - 1/4",
        ingredients: [
          "1/2 plato de verdura o ensalada",
          "1/4 de plato de proteína (pollo, pescado o legumbre)",
          "1/4 de plato de arroz, pasta o patata",
          "1 cucharada de aceite de oliva",
        ],
        preparation:
          "La regla del plato: la mitad verdura, un cuarto proteína, un cuarto carbohidrato. Funciona en casa y comiendo fuera.",
      },
      {
        name: "Cena",
        title: "Tortilla francesa con ensalada y pan",
        ingredients: [
          "2-3 huevos",
          "Ensalada completa (tomate, atún, maíz)",
          "60 g de pan integral",
          "Aceite de oliva y vinagre",
        ],
        preparation:
          "Cena ligera pero con proteína suficiente. Alterna la tortilla con pescado blanco o pavo.",
      },
      {
        name: "Snacks",
        title: "Fruta + lácteo",
        ingredients: [
          "2 piezas de fruta al día",
          "1 yogur o vaso de leche",
          "Opcional: 1 scoop de whey si entrenas ese día",
          "Agua: 2-3 litros diarios",
        ],
        preparation:
          "Snacks simples que no requieren cocinar. La constancia gana a la perfección.",
      },
    ],
  },
  {
    id: "alta-proteina",
    name: "Alta proteína",
    goal: "Maximizar saciedad y masa muscular",
    description:
      "Más de 2 g de proteína por kg: ideal en definiciones exigentes o para quien le cuesta llegar a su proteína diaria. Cada comida gira alrededor de una fuente proteica.",
    calories: 2200,
    protein: 210,
    carbs: 180,
    fats: 60,
    meals: [
      {
        name: "Desayuno",
        title: "Tortitas de avena y claras",
        ingredients: [
          "6 claras + 1 huevo",
          "60 g de avena",
          "1 scoop de whey",
          "Frutos rojos para acompañar",
        ],
        preparation:
          "Bate todo, cocina como tortitas en sartén antiadherente y sirve con los frutos rojos.",
      },
      {
        name: "Comida",
        title: "Doble proteína: pollo y huevo",
        ingredients: [
          "200 g de pechuga de pollo",
          "1 huevo duro",
          "70 g de arroz (en seco)",
          "Ensalada verde",
        ],
        preparation:
          "Pollo a la plancha con especias, arroz cocido y huevo duro sobre la ensalada.",
      },
      {
        name: "Cena",
        title: "Atún rojo o bacalao con verduras",
        ingredients: [
          "200 g de atún o bacalao",
          "Verduras al wok",
          "100 g de patata o boniato",
          "Salsa de soja baja en sal",
        ],
        preparation:
          "Marca el pescado y saltea las verduras con un toque de soja.",
      },
      {
        name: "Snacks",
        title: "Trío proteico",
        ingredients: [
          "1 scoop de whey post-entreno",
          "1 lata de atún o 100 g de pavo",
          "1 yogur skyr",
          "1 pieza de fruta",
        ],
        preparation:
          "Reparte a lo largo del día para alcanzar los 210 g sin comidas gigantes.",
      },
    ],
  },
  {
    id: "mantenimiento",
    name: "Mantenimiento",
    goal: "Mantener peso y rendimiento",
    description:
      "Para fases de descanso mental o mantenimiento del físico logrado. Flexible, con hueco para comidas sociales manteniendo la base de proteína y verdura.",
    calories: 2600,
    protein: 155,
    carbs: 300,
    fats: 85,
    meals: [
      {
        name: "Desayuno",
        title: "Tostadas completas + café",
        ingredients: [
          "2-3 rebanadas de pan de masa madre",
          "2 huevos o 80 g de jamón",
          "1/2 aguacate o aceite de oliva",
          "1 pieza de fruta",
        ],
        preparation: "Desayuno clásico y flexible: alterna dulce y salado según apetezca.",
      },
      {
        name: "Comida",
        title: "Legumbre 3 veces por semana",
        ingredients: [
          "Garbanzos, lentejas o alubias (90 g en seco)",
          "Verduras del sofrito",
          "Opcional: huevo, atún o pollo",
          "Pan integral",
        ],
        preparation:
          "Los días restantes: arroz/pasta/patata con tu proteína favorita. Cocina de siempre, raciones normales.",
      },
      {
        name: "Cena",
        title: "Proteína + verdura + capricho controlado",
        ingredients: [
          "Pescado, huevo o carne magra (150-200 g)",
          "Verdura libre",
          "Carbohidrato según hambre",
          "1-2 cenas libres a la semana",
        ],
        preparation:
          "En mantenimiento la adherencia manda: el 80% de comidas ordenadas sostiene el resultado.",
      },
      {
        name: "Snacks",
        title: "A demanda",
        ingredients: [
          "Fruta, yogur, frutos secos",
          "Chocolate >85% (2 onzas)",
          "Palomitas caseras",
          "Café o infusiones",
        ],
        preparation:
          "Snacks de calidad sin obsesionarse con los números.",
      },
    ],
  },
  {
    id: "vegetariana",
    name: "Vegetariana fitness",
    goal: "Rendir y ganar músculo sin carne ni pescado",
    description:
      "Ovolactovegetariana con proteína completa a base de huevo, lácteos, legumbre, tofu y seitán. Cubre los aminoácidos esenciales combinando fuentes.",
    calories: 2400,
    protein: 140,
    carbs: 300,
    fats: 75,
    meals: [
      {
        name: "Desayuno",
        title: "Bowl de skyr con avena y semillas",
        ingredients: [
          "250 g de skyr o yogur griego",
          "60 g de avena",
          "15 g de semillas de chía y lino",
          "1 plátano",
        ],
        preparation:
          "Mezcla todo la noche anterior (overnight oats) o al momento.",
      },
      {
        name: "Comida",
        title: "Garbanzos con arroz y huevo",
        ingredients: [
          "90 g de garbanzos (en seco) o 220 g cocidos",
          "60 g de arroz (en seco)",
          "1-2 huevos",
          "Espinacas y pimentón",
        ],
        preparation:
          "Legumbre + cereal = proteína completa. Saltea los garbanzos con espinacas y sirve con arroz y huevo.",
      },
      {
        name: "Cena",
        title: "Tofu salteado con noodles",
        ingredients: [
          "200 g de tofu firme",
          "80 g de noodles integrales",
          "Verduras al wok",
          "Salsa de soja y sésamo",
        ],
        preparation:
          "Prensa el tofu, córtalo en dados y saltéalo hasta dorar. Añade verduras, noodles y salsa.",
      },
      {
        name: "Snacks",
        title: "Proteína vegetal + frutos secos",
        ingredients: [
          "1 scoop de proteína (whey o vegetal)",
          "30 g de almendras o anacardos",
          "Hummus con crudités",
          "1 pieza de fruta",
        ],
        preparation:
          "Si eres vegano estricto, sustituye lácteos y huevo por más tofu, tempeh y proteína vegetal en polvo.",
      },
    ],
  },
  {
    id: "perdida-rapida",
    name: "Pérdida rápida de grasa",
    goal: "Déficit agresivo a corto plazo",
    description:
      "Protocolo de 4-6 semanas máximo con déficit agresivo y proteína muy alta. Solo para fases cortas con un evento cercano; después vuelve a un déficit moderado o mantenimiento.",
    calories: 1500,
    protein: 165,
    carbs: 105,
    fats: 50,
    meals: [
      {
        name: "Desayuno",
        title: "Claras con espinacas y café",
        ingredients: [
          "6 claras + 1 huevo",
          "Espinacas y champiñones",
          "1 rebanada de pan integral",
          "Café solo o con leche desnatada",
        ],
        preparation:
          "Revuelto grande y saciante con volumen de verdura para empezar el día sin hambre.",
      },
      {
        name: "Comida",
        title: "Pechuga con ensalada gigante",
        ingredients: [
          "200 g de pechuga de pollo o pavo",
          "Ensalada muy abundante",
          "50 g de arroz (en seco) solo los días de entreno",
          "Vinagre y especias sin límite",
        ],
        preparation:
          "El volumen de verdura es la clave para soportar el déficit. Los días de descanso, elimina el arroz.",
      },
      {
        name: "Cena",
        title: "Pescado blanco con verduras",
        ingredients: [
          "220 g de merluza, lubina o bacalao",
          "Verduras al vapor o plancha",
          "Ensalada de tomate",
          "1 cucharadita de aceite de oliva",
        ],
        preparation:
          "Cena ligera y proteica. El pescado blanco da mucha proteína por muy pocas calorías.",
      },
      {
        name: "Snacks",
        title: "Saciantes de emergencia",
        ingredients: [
          "Gelatina sin azúcar",
          "Queso batido 0% (250 g)",
          "Pepinillos y encurtidos",
          "Café e infusiones",
        ],
        preparation:
          "Máximo 6 semanas con este plan. Duerme 7-9 horas: el déficit agresivo sin sueño destruye músculo.",
      },
    ],
  },
];

export function getDiet(id: string): Diet | undefined {
  return DIETS.find((d) => d.id === id);
}
