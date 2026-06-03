import type { SeoData } from "@/components/country-seo-content"

export type { SeoData }

export const seoByCountry: Record<string, SeoData> = {
  ni: {
    primaryKeyword: "calculadora de liquidacion laboral Nicaragua",
    h1: "Calculadora de liquidacion laboral en Nicaragua",
    intro:
      "Calcula una liquidacion laboral estimada en Nicaragua con desglose de indemnizacion, aguinaldo proporcional, vacaciones, INSS e IR cuando aplique. Justo usa reglas deterministicas y muestra las formulas para que puedas revisar cada monto antes de generar el PDF.",
    benefits: [
      "indemnizacion por antiguedad",
      "aguinaldo proporcional",
      "vacaciones pendientes",
      "deducciones de INSS e IR",
    ],
    formulaSummary:
      "El calculo parte del salario mensual, las fechas de inicio y salida, los dias trabajados y las vacaciones pendientes. Cada prestacion se calcula por separado y luego se restan las deducciones legales documentadas.",
    docs: [
      { label: "Indemnizacion", href: "/docs/legal/nicaragua/indemnizacion" },
      { label: "Aguinaldo", href: "/docs/legal/nicaragua/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/nicaragua/vacaciones" },
      { label: "INSS", href: "/docs/legal/nicaragua/inss" },
    ],
    faqs: [
      {
        question: "Como calcular mi liquidacion en Nicaragua?",
        answer:
          "Ingresa salario mensual, fecha de inicio, fecha de salida y vacaciones pendientes. El sistema calcula ingresos, deducciones y total neto con explicacion de formulas.",
      },
      {
        question: "La calculadora reemplaza asesoria legal?",
        answer:
          "No. El resultado es informativo y debe revisarse con asesoria legal o contable en casos disputados, complejos o con pactos especiales.",
      },
    ],
  },
  cr: {
    primaryKeyword: "calculadora de liquidacion Costa Rica",
    h1: "Calculadora de liquidacion laboral en Costa Rica",
    intro:
      "Calcula una liquidacion laboral estimada en Costa Rica con cesantia, preaviso, aguinaldo proporcional, vacaciones y deducciones de CCSS cuando correspondan. La herramienta prioriza transparencia: muestra rubros, formulas y referencias para revisar el resultado.",
    benefits: [
      "cesantia",
      "preaviso",
      "aguinaldo proporcional",
      "vacaciones",
      "deducciones CCSS",
    ],
    formulaSummary:
      "La liquidacion se estima con salario mensual, tiempo laborado, causa de salida y vacaciones pendientes. El aguinaldo se prorratea sobre salarios del periodo y la cesantia depende de la antiguedad conforme a las reglas documentadas.",
    docs: [
      { label: "Cesantia", href: "/docs/legal/costarica/indemnizacion" },
      { label: "Aguinaldo", href: "/docs/legal/costarica/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/costarica/vacaciones" },
      { label: "CCSS", href: "/docs/legal/costarica/ccss" },
    ],
    faqs: [
      {
        question: "Como se calcula el aguinaldo en Costa Rica?",
        answer:
          "De forma general, el aguinaldo equivale a una doceava parte de los salarios devengados en el periodo correspondiente, proporcional al tiempo laborado.",
      },
      {
        question: "Que datos necesito para calcular cesantia en Costa Rica?",
        answer:
          "Necesitas salario, fecha de inicio, fecha de salida, vacaciones pendientes y el contexto de terminacion para estimar los rubros aplicables.",
      },
    ],
  },
  co: {
    primaryKeyword: "calculadora laboral Colombia",
    h1: "Calculadora laboral en Colombia",
    intro:
      "Estima prestaciones laborales en Colombia como cesantias, intereses a las cesantias, prima de servicios, vacaciones y deducciones de EPS y pension. Justo separa cada rubro para facilitar revision antes de usar el resultado.",
    benefits: [
      "cesantias",
      "intereses a las cesantias",
      "prima de servicios",
      "vacaciones",
      "EPS y pension",
    ],
    formulaSummary:
      "El calculo usa salario, dias trabajados y reglas proporcionales por prestacion. Las cesantias se calculan sobre el tiempo servido y los intereses se estiman sobre el valor de cesantias.",
    docs: [
      { label: "Cesantias", href: "/docs/legal/colombia/cesantia" },
      { label: "Prima", href: "/docs/legal/colombia/prima-servicios" },
      { label: "Vacaciones", href: "/docs/legal/colombia/vacaciones" },
      { label: "EPS y pension", href: "/docs/legal/colombia/eps-pension" },
    ],
    faqs: [
      {
        question: "La calculadora incluye cesantias e intereses?",
        answer:
          "Si. El desglose incluye cesantias e intereses cuando el pais activo es Colombia, junto con otros rubros soportados.",
      },
      {
        question: "Puedo descargar un PDF?",
        answer:
          "Si. Despues de completar el calculo guiado, Justo permite generar un PDF imprimible con resumen, ingresos, deducciones, firmas y aviso informativo.",
      },
    ],
  },
  pe: {
    primaryKeyword: "calcular liquidacion Peru",
    h1: "Calculadora de liquidacion laboral en Peru",
    intro:
      "Calcula una estimacion de liquidacion laboral en Peru con CTS, gratificaciones, vacaciones, indemnizacion cuando aplique y deducciones de ONP o AFP. El resultado se presenta con formulas y totales separados.",
    benefits: [
      "CTS",
      "gratificaciones",
      "vacaciones",
      "indemnizacion",
      "ONP o AFP",
    ],
    formulaSummary:
      "La liquidacion se estima con salario mensual, fechas laborales, tiempo servido y vacaciones pendientes. Cada beneficio se calcula por separado para obtener el total bruto, deducciones y neto.",
    docs: [
      { label: "CTS", href: "/docs/legal/peru/cts" },
      { label: "Gratificaciones", href: "/docs/legal/peru/gratificaciones" },
      { label: "Vacaciones", href: "/docs/legal/peru/vacaciones" },
      { label: "ONP y AFP", href: "/docs/legal/peru/onp-afp" },
    ],
    faqs: [
      {
        question: "Que incluye una liquidacion laboral en Peru?",
        answer:
          "Puede incluir CTS, gratificaciones truncas, vacaciones, remuneracion pendiente, indemnizacion si corresponde y deducciones previsionales.",
      },
      {
        question: "El calculo es definitivo?",
        answer:
          "No. Es una estimacion informativa basada en las reglas documentadas en el corpus legal del proyecto.",
      },
    ],
  },
  sv: {
    primaryKeyword: "calculadora de liquidacion El Salvador",
    h1: "Calculadora de liquidacion laboral en El Salvador",
    intro:
      "Calcula una liquidacion laboral estimada en El Salvador con desglose de indemnizacion (cesantia), aguinaldo proporcional, vacaciones, ISSS y AFP. Justo usa reglas deterministicas y muestra las formulas para revisar cada monto.",
    benefits: [
      "cesantia (indemnizacion)",
      "aguinaldo proporcional",
      "vacaciones pendientes",
      "ISSS y AFP",
    ],
    formulaSummary:
      "El calculo usa salario mensual, fechas de inicio y salida, tiempo laborado y vacaciones pendientes. Cada prestacion se calcula segun el Codigo de Trabajo y se restan las deducciones legales.",
    docs: [
      { label: "Indemnizacion", href: "/docs/legal/elsalvador/indemnizacion" },
      { label: "Aguinaldo", href: "/docs/legal/elsalvador/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/elsalvador/vacaciones" },
      { label: "ISSS y AFP", href: "/docs/legal/elsalvador/deducciones" },
    ],
    faqs: [
      {
        question: "Como se calcula la cesantia en El Salvador?",
        answer:
          "La cesantia o indemnizacion depende del tiempo laborado y el tipo de despido. Ingresa salario y fechas para una estimacion con desglose.",
      },
      {
        question: "La calculadora incluye descuentos de ISSS y AFP?",
        answer:
          "Si. El calculo deduce los porcentajes legales de ISSS y AFP aplicables en El Salvador.",
      },
    ],
  },
  gt: {
    primaryKeyword: "calculadora de liquidacion Guatemala",
    h1: "Calculadora de liquidacion laboral en Guatemala",
    intro:
      "Calcula una liquidacion laboral estimada en Guatemala con indemnizacion, bono 14, aguinaldo, vacaciones y deducciones de IGSS e ISR. Justo separa cada rubro para revision transparente.",
    benefits: [
      "indemnizacion",
      "bono 14",
      "aguinaldo",
      "vacaciones",
      "IGSS e ISR",
    ],
    formulaSummary:
      "La liquidacion se estima con salario mensual, fechas laborales, dias trabajados y vacaciones pendientes. Bono 14 y aguinaldo se prorratean sobre el periodo conforme al Codigo de Trabajo.",
    docs: [
      { label: "Indemnizacion", href: "/docs/legal/guatemala/indemnizacion" },
      { label: "Bono 14", href: "/docs/legal/guatemala/deducciones" },
      { label: "Aguinaldo", href: "/docs/legal/guatemala/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/guatemala/vacaciones" },
    ],
    faqs: [
      {
        question: "Como se calcula el bono 14 en Guatemala?",
        answer:
          "El bono 14 equivale a un salario mensual prorrateado segun los meses trabajados en el periodo. La calculadora lo estima automaticamente.",
      },
      {
        question: "Que datos necesito para mi liquidacion en Guatemala?",
        answer:
          "Necesitas salario mensual, fecha de inicio, fecha de salida y vacaciones pendientes para obtener el desglose completo.",
      },
    ],
  },
  hn: {
    primaryKeyword: "calculadora de liquidacion Honduras",
    h1: "Calculadora de liquidacion laboral en Honduras",
    intro:
      "Calcula una liquidacion laboral estimada en Honduras con auxilio de cesantia, decimotercer mes, vacaciones y deducciones de IHSS y RAP. Justo muestra cada rubro con su formula.",
    benefits: [
      "auxilio de cesantia",
      "decimotercer mes",
      "vacaciones",
      "IHSS y RAP",
    ],
    formulaSummary:
      "El calculo usa salario mensual, fechas laborales, tiempo de servicio y vacaciones pendientes. El auxilio de cesantia se calcula por anos trabajados y el decimotercer mes se prorratea.",
    docs: [
      { label: "Cesantia", href: "/docs/legal/honduras/indemnizacion" },
      { label: "Aguinaldo", href: "/docs/legal/honduras/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/honduras/vacaciones" },
      { label: "IHSS", href: "/docs/legal/honduras/ihss" },
    ],
    faqs: [
      {
        question: "Como funciona el auxilio de cesantia en Honduras?",
        answer:
          "El auxilio de cesantia equivale a un salario por cada ano trabajado, proporcional por fracciones. La calculadora lo estima segun el Codigo de Trabajo.",
      },
      {
        question: "La calculadora descuenta IHSS y RAP?",
        answer:
          "Si. Las deducciones legales de IHSS y RAP se aplican automaticamente segun los porcentajes documentados.",
      },
    ],
  },
  pa: {
    primaryKeyword: "calculadora de liquidacion Panama",
    h1: "Calculadora de liquidacion laboral en Panama",
    intro:
      "Calcula una liquidacion laboral estimada en Panama con prima de antiguedad, decimotercer mes, vacaciones y deducciones de CSS. Justo presenta cada partida con su formula y referencias.",
    benefits: [
      "prima de antiguedad",
      "decimotercer mes",
      "vacaciones",
      "CSS",
    ],
    formulaSummary:
      "La liquidacion se estima con salario mensual, fechas de inicio y salida, tiempo servido y vacaciones pendientes. La prima de antiguedad se calcula segun los anos laborados.",
    docs: [
      { label: "Indemnizacion", href: "/docs/legal/panama/indemnizacion" },
      { label: "Aguinaldo", href: "/docs/legal/panama/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/panama/vacaciones" },
      { label: "CSS", href: "/docs/legal/panama/css" },
    ],
    faqs: [
      {
        question: "Como se calcula la prima de antiguedad en Panama?",
        answer:
          "La prima de antiguedad equivale a una semana de salario por cada ano trabajado, hasta un maximo legal. La calculadora la estima automaticamente.",
      },
      {
        question: "Que es la CSS y como afecta mi liquidacion?",
        answer:
          "La CSS (Caja de Seguro Social) descuenta un porcentaje legal sobre el salario. La calculadora lo incluye en las deducciones.",
      },
    ],
  },
  mx: {
    primaryKeyword: "calculadora de liquidacion Mexico",
    h1: "Calculadora de liquidacion laboral en Mexico",
    intro:
      "Calcula una liquidacion laboral estimada en Mexico con indemnizacion constitucional, aguinaldo, vacaciones, prima de antiguedad y descuentos de IMSS, INFONAVIT y SAR segun la LFT.",
    benefits: [
      "indemnizacion constitucional",
      "aguinaldo proporcional",
      "vacaciones y prima vacacional",
      "prima de antiguedad",
      "IMSS, INFONAVIT y SAR",
    ],
    formulaSummary:
      "El calculo parte del salario mensual, la fecha de inicio y salida, los dias trabajados y las vacaciones pendientes. La indemnizacion se calcula segun la LFT y se restan las deducciones documentadas.",
    docs: [
      { label: "Indemnizacion", href: "/docs/legal/mexico/indemnizacion" },
      { label: "Aguinaldo", href: "/docs/legal/mexico/aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/mexico/vacaciones" },
      { label: "IMSS", href: "/docs/legal/mexico/imss" },
    ],
    faqs: [
      {
        question: "Como calcular mi liquidacion en Mexico segun la LFT?",
        answer:
          "Ingresa salario mensual, fecha de inicio, fecha de salida y vacaciones pendientes. La calculadora estima ingresos, deducciones y total neto conforme a la Ley Federal del Trabajo.",
      },
      {
        question: "La calculadora incluye descuentos de INFONAVIT y SAR?",
        answer:
          "Si. Las deducciones legales de IMSS, INFONAVIT y SAR se aplican segun los porcentajes documentados en el corpus legal.",
      },
    ],
  },
  ar: {
    primaryKeyword: "calculadora de liquidacion Argentina",
    h1: "Calculadora de liquidacion laboral en Argentina",
    intro:
      "Calcula una liquidacion laboral estimada en Argentina con indemnizacion por antiguedad, preaviso, SAC (aguinaldo), vacaciones y deducciones de jubilacion, PAMI y obra social segun la LCT.",
    benefits: [
      "indemnizacion por antiguedad",
      "preaviso",
      "SAC (aguinaldo)",
      "vacaciones proporcionales",
      "jubilacion, PAMI y obra social",
    ],
    formulaSummary:
      "La liquidacion se estima con salario mensual, fechas laborales, antiguedad y vacaciones pendientes. La indemnizacion se calcula segun la Ley de Contrato de Trabajo y se restan las deducciones legales.",
    docs: [
      { label: "Indemnizacion", href: "/docs/legal/argentina/indemnizacion" },
      { label: "Preaviso", href: "/docs/legal/argentina/preaviso" },
      { label: "SAC (Aguinaldo)", href: "/docs/legal/argentina/sac-aguinaldo" },
      { label: "Vacaciones", href: "/docs/legal/argentina/vacaciones" },
      { label: "Deducciones", href: "/docs/legal/argentina/deducciones" },
    ],
    faqs: [
      {
        question: "Como se calcula la indemnizacion por antiguedad en Argentina?",
        answer:
          "La indemnizacion equivale a un salario por cada ano trabajado o fraccion mayor a tres meses, segun el articulo 245 de la LCT.",
      },
      {
        question: "La calculadora descuenta jubilacion, PAMI y obra social?",
        answer:
          "Si. Las deducciones legales sobre el salario se aplican automaticamente segun los porcentajes documentados.",
      },
    ],
  },
  cl: {
    primaryKeyword: "calculadora de liquidacion Chile",
    h1: "Calculadora de liquidacion laboral en Chile",
    intro:
      "Calcula una liquidacion laboral estimada en Chile con indemnizacion por anos de servicio, aviso sustitutivo, vacaciones y descuentos de AFP, salud y AFC segun el Codigo del Trabajo.",
    benefits: [
      "indemnizacion por anos de servicio",
      "aviso sustitutivo",
      "vacaciones",
      "AFP, salud y AFC",
    ],
    formulaSummary:
      "El calculo usa salario mensual, fechas laborales, anos de servicio y vacaciones pendientes. La indemnizacion se calcula segun el Codigo del Trabajo y se restan las cotizaciones legales.",
    docs: [
      { label: "Indemnizacion", href: "/docs/legal/chile/indemnizacion" },
      { label: "Vacaciones", href: "/docs/legal/chile/vacaciones" },
      { label: "AFP", href: "/docs/legal/chile/afp" },
      { label: "Salud", href: "/docs/legal/chile/salud" },
    ],
    faqs: [
      {
        question: "Como se calcula la indemnizacion por anos de servicio en Chile?",
        answer:
          "Corresponde a un salario por cada ano trabajado con tope de 330 UF, mas un recargo del 20% si el empleador no tenia seguro de cesantia.",
      },
      {
        question: "Que cotizaciones descuenta la calculadora?",
        answer:
          "La calculadora aplica los descuentos de AFP (10% mas comision), salud (7% Fonasa o Isapre) y AFC (seguro de cesantia).",
      },
    ],
  },
}

export function buildDefaultSeo(info: { name: string }): SeoData {
  return {
    primaryKeyword: `calculadora laboral ${info.name}`,
    h1: `Calculadora laboral en ${info.name}`,
    intro: `Consulta derechos laborales y calcula una liquidacion estimada para ${info.name}. Justo muestra rubros, formulas y referencias legales para revisar el resultado de forma transparente.`,
    benefits: [
      "indemnizacion",
      "aguinaldo o prestacion equivalente",
      "vacaciones",
      "deducciones",
    ],
    formulaSummary:
      "El calculo usa salario mensual, fechas laborales, vacaciones pendientes y reglas documentadas por pais para estimar ingresos, deducciones y total neto.",
    docs: [{ label: `Marco legal de ${info.name}`, href: "/docs/legal" }],
    faqs: [
      {
        question: `Como usar la calculadora laboral de ${info.name}?`,
        answer:
          "Inicia el calculo guiado, completa salario, fechas y vacaciones pendientes, confirma los datos y revisa el desglose final.",
      },
      {
        question: "El resultado es asesoria legal?",
        answer:
          "No. Es informacion general y debe validarse profesionalmente en casos complejos o disputados.",
      },
    ],
  }
}

export function buildDefaultSeoEn(info: { name: string }): SeoData {
  return {
    primaryKeyword: `${info.name} labor settlement calculator`,
    h1: `${info.name} labor settlement calculator`,
    intro: `Ask labor questions and estimate a settlement for ${info.name}. Justo shows line items, formulas and legal references so you can review the result transparently.`,
    benefits: [
      "severance or equivalent benefits",
      "proportional bonuses",
      "pending vacation days",
      "legal deductions",
    ],
    formulaSummary:
      "The calculation uses monthly salary, employment dates, pending vacation days and country-specific documented rules to estimate income, deductions and net total.",
    docs: [{ label: `${info.name} legal framework`, href: "/docs/legal" }],
    faqs: [
      {
        question: `How do I use the ${info.name} labor calculator?`,
        answer:
          "Start the guided calculation, enter salary, dates and pending vacation days, confirm the information and review the final breakdown.",
      },
      {
        question: "Is the result legal advice?",
        answer:
          "No. It is general information and should be professionally reviewed for complex or disputed cases.",
      },
    ],
  }
}

export function getSeoData(country: string, locale: string, countryName: string): SeoData {
  if (locale === "en") return buildDefaultSeoEn({ name: countryName })
  return seoByCountry[country] ?? buildDefaultSeo({ name: countryName })
}
