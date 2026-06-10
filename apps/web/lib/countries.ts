import type { CountryCode } from "@justo/core"

export interface CountryInfo {
  code: CountryCode
  name: string
  flag: string
  timezones: string[]
  currencyCode: string
  currencyLabel: string
  locale: string
  hreflang: string
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  titleEn: string
  descriptionEn: string
  ogTitleEn: string
  ogDescriptionEn: string
  exampleQuestions: string[]
  exampleQuestionsEn?: string[]
}

const countries: Record<CountryCode, CountryInfo> = {
  ni: {
    code: "ni",
    name: "Nicaragua",
    flag: "ni",
    timezones: ["America/Managua"],
    currencyCode: "NIO",
    currencyLabel: "córdobas (NIO)",
    locale: "es-NI",
    hreflang: "es-NI",
    title: "Calculadora de Liquidación Laboral Nicaragua 2026 | Justo",
    description:
      "Calcula liquidación, indemnización, aguinaldo proporcional, vacaciones, INSS e IR en Nicaragua. Gratis, sin registro y con explicación legal.",
    ogTitle: "Justo · Asistente laboral para Nicaragua",
    ogDescription:
      "Calcula liquidaciones laborales en Nicaragua con transparencia y trazabilidad según la Ley No. 185.",
    titleEn: "Nicaragua Labor Settlement Calculator 2026 | Justo",
    descriptionEn:
      "Calculate severance, proportional Christmas bonus, vacations, INSS and income tax in Nicaragua. Free, no registration, with legal explanation.",
    ogTitleEn: "Justo · Labor assistant for Nicaragua",
    ogDescriptionEn:
      "Calculate labor settlements in Nicaragua with transparency and traceability under Law No. 185.",
    exampleQuestions: [
      "¿Cuánto me pagan de indemnización si renuncio con 5 años?",
      "¿Cómo se calcula el aguinaldo proporcional?",
      "¿Qué descuentos tiene mi liquidación (INSS e IR)?",
    ],
    exampleQuestionsEn: [
      "How much severance do I get if I resign after 5 years?",
      "How is proportional Christmas bonus calculated?",
      "Which deductions apply to my settlement (INSS and income tax)?",
    ],
  },
  sv: {
    code: "sv",
    name: "El Salvador",
    flag: "sv",
    timezones: ["America/El_Salvador"],
    currencyCode: "USD",
    currencyLabel: "dólares (USD)",
    locale: "es-SV",
    hreflang: "es-SV",
    title: "Cálculo de Liquidación Laboral en El Salvador 2026 | Justo",
    description:
      "Calcula tu cesantía, indemnización, aguinaldo proporcional y descuentos (ISSS y AFP) según el Código de Trabajo de El Salvador. Gratis y sin registro.",
    ogTitle: "Justo · Asistente laboral para El Salvador",
    ogDescription:
      "Calcula liquidaciones laborales en El Salvador con transparencia y trazabilidad.",
    titleEn: "El Salvador Labor Settlement Calculator 2026 | Justo",
    descriptionEn:
      "Calculate your severance (cesantía), proportional Christmas bonus, ISSS and AFP deductions under El Salvador's Labor Code. Free and no registration.",
    ogTitleEn: "Justo · Labor assistant for El Salvador",
    ogDescriptionEn:
      "Calculate labor settlements in El Salvador with transparency and traceability.",
    exampleQuestions: [
      "¿Cuánto me corresponde de indemnización (cesantía)?",
      "¿Cómo se calcula el aguinaldo por años trabajados?",
      "¿Qué son ISSS y AFP y cuánto descuentan?",
    ],
    exampleQuestionsEn: [
      "How much severance (cesantía) do I get?",
      "How is proportional Christmas bonus calculated?",
      "What are ISSS and AFP and how much do they deduct?",
    ],
  },
  gt: {
    code: "gt",
    name: "Guatemala",
    flag: "gt",
    timezones: ["America/Guatemala"],
    currencyCode: "GTQ",
    currencyLabel: "quetzales (GTQ)",
    locale: "es-GT",
    hreflang: "es-GT",
    title: "Cálculo de Liquidación Laboral en Guatemala 2026 | Justo",
    description:
      "Calcula tu indemnización, bono 14, aguinaldo, vacaciones y descuentos (IGSS e ISR) según el Código de Trabajo de Guatemala. Gratis y sin registro.",
    ogTitle: "Justo · Asistente laboral para Guatemala",
    ogDescription:
      "Calcula liquidaciones laborales en Guatemala con transparencia y trazabilidad según el Código de Trabajo.",
    titleEn: "Guatemala Labor Settlement Calculator 2026 | Justo",
    descriptionEn:
      "Calculate your severance, bono 14, Christmas bonus, vacations and deductions (IGSS and ISR) under Guatemala's Labor Code. Free and no registration.",
    ogTitleEn: "Justo · Labor assistant for Guatemala",
    ogDescriptionEn:
      "Calculate labor settlements in Guatemala with transparency and traceability under the Labor Code.",
    exampleQuestions: [
      "¿Cuánto me corresponde de indemnización?",
      "¿Cómo se calcula el Bono 14?",
      "¿Qué es el IGSS y cuánto descuenta?",
    ],
    exampleQuestionsEn: [
      "How much severance do I get?",
      "How is the Bono 14 calculated?",
      "What is IGSS and how much does it deduct?",
    ],
  },
  hn: {
    code: "hn",
    name: "Honduras",
    flag: "hn",
    timezones: ["America/Tegucigalpa"],
    currencyCode: "HNL",
    currencyLabel: "lempiras (HNL)",
    locale: "es-HN",
    hreflang: "es-HN",
    title: "Cálculo de Liquidación Laboral en Honduras 2026 | Justo",
    description:
      "Calcula tu auxilio de cesantía, decimotercer mes, vacaciones y descuentos (IHSS y RAP) según el Código de Trabajo de Honduras. Gratis y sin registro.",
    ogTitle: "Justo · Asistente laboral para Honduras",
    ogDescription:
      "Calcula liquidaciones laborales en Honduras con transparencia y trazabilidad.",
    titleEn: "Honduras Labor Settlement Calculator 2026 | Justo",
    descriptionEn:
      "Calculate your severance (auxilio de cesantía), thirteenth month, vacations and deductions (IHSS and RAP) under Honduras' Labor Code. Free and no registration.",
    ogTitleEn: "Justo · Labor assistant for Honduras",
    ogDescriptionEn:
      "Calculate labor settlements in Honduras with transparency and traceability.",
    exampleQuestions: [
      "¿Cuánto me pagan de auxilio de cesantía?",
      "¿Cómo se calcula el decimotercer mes?",
      "¿Qué es el IHSS y cuánto descuenta?",
    ],
    exampleQuestionsEn: [
      "How much severance (auxilio de cesantía) do I get?",
      "How is the thirteenth month calculated?",
      "What is IHSS and how much does it deduct?",
    ],
  },
  cr: {
    code: "cr",
    name: "Costa Rica",
    flag: "cr",
    timezones: ["America/Costa_Rica"],
    currencyCode: "CRC",
    currencyLabel: "colones (CRC)",
    locale: "es-CR",
    hreflang: "es-CR",
    title: "Calculadora de Liquidación Costa Rica 2026 | Justo",
    description:
      "Calcula cesantía, preaviso, aguinaldo proporcional, vacaciones y CCSS en Costa Rica. Gratis, sin registro y con explicación legal.",
    ogTitle: "Justo · Asistente laboral para Costa Rica",
    ogDescription:
      "Calcula liquidaciones laborales en Costa Rica con transparencia y trazabilidad.",
    titleEn: "Costa Rica Labor Settlement Calculator 2026 | Justo",
    descriptionEn:
      "Calculate severance, notice pay, proportional Christmas bonus, vacations and CCSS in Costa Rica. Free, no registration, with legal explanation.",
    ogTitleEn: "Justo · Labor assistant for Costa Rica",
    ogDescriptionEn:
      "Calculate labor settlements in Costa Rica with transparency and traceability.",
    exampleQuestions: [
      "¿Cuánto me corresponde de cesantía y preaviso?",
      "¿Cómo se calcula el aguinaldo proporcional?",
      "¿Qué es la CCSS y cuánto descuenta?",
    ],
    exampleQuestionsEn: [
      "How much severance and notice pay do I get?",
      "How is proportional Christmas bonus calculated?",
      "What is CCSS and how much does it deduct?",
    ],
  },
  pa: {
    code: "pa",
    name: "Panamá",
    flag: "pa",
    timezones: ["America/Panama"],
    currencyCode: "USD",
    currencyLabel: "dólares (USD)",
    locale: "es-PA",
    hreflang: "es-PA",
    title: "Cálculo de Liquidación Laboral en Panamá 2026 | Justo",
    description:
      "Calcula tu prima de antigüedad, decimotercer mes, vacaciones y descuentos (CSS) según el Código de Trabajo de Panamá. Gratis y sin registro.",
    ogTitle: "Justo · Asistente laboral para Panamá",
    ogDescription:
      "Calcula liquidaciones laborales en Panamá con transparencia y trazabilidad.",
    titleEn: "Panama Labor Settlement Calculator 2026 | Justo",
    descriptionEn:
      "Calculate your seniority premium, thirteenth month, vacations and CSS deductions under Panama's Labor Code. Free and no registration.",
    ogTitleEn: "Justo · Labor assistant for Panama",
    ogDescriptionEn:
      "Calculate labor settlements in Panama with transparency and traceability.",
    exampleQuestions: [
      "¿Cuánto me pagan de prima de antigüedad?",
      "¿Cómo se calcula el decimotercer mes?",
      "¿Qué es la CSS y cuánto descuenta?",
    ],
    exampleQuestionsEn: [
      "How much seniority premium do I get?",
      "How is the thirteenth month calculated?",
      "What is CSS and how much does it deduct?",
    ],
  },
  mx: {
    code: "mx",
    name: "México",
    flag: "mx",
    timezones: [
      "America/Mexico_City",
      "America/Matamoros",
      "America/Cancun",
      "America/Merida",
      "America/Monterrey",
      "America/Chihuahua",
      "America/Tijuana",
    ],
    currencyCode: "MXN",
    currencyLabel: "pesos mexicanos (MXN)",
    locale: "es-MX",
    hreflang: "es-MX",
    title: "Cálculo de Liquidación Laboral en México 2026 | Justo",
    description:
      "Calcula tu indemnización constitucional, aguinaldo, vacaciones, prima de antigüedad y descuentos (IMSS, INFONAVIT, SAR) según la LFT. Gratis y sin registro.",
    ogTitle: "Justo · Asistente laboral para México",
    ogDescription:
      "Calcula liquidaciones laborales en México con transparencia y trazabilidad según la Ley Federal del Trabajo.",
    titleEn: "Mexico Labor Settlement Calculator 2026 | Justo",
    descriptionEn:
      "Calculate your constitutional severance, Christmas bonus, vacations, seniority premium and deductions (IMSS, INFONAVIT, SAR) under Mexican Federal Labor Law. Free and no registration.",
    ogTitleEn: "Justo · Labor assistant for Mexico",
    ogDescriptionEn:
      "Calculate labor settlements in Mexico with transparency and traceability under the Federal Labor Law.",
    exampleQuestions: [
      "¿Cuánto me corresponde de indemnización constitucional?",
      "¿Cómo se calcula el aguinaldo proporcional?",
      "¿Qué es el IMSS y cuánto descuenta?",
    ],
    exampleQuestionsEn: [
      "How much constitutional severance do I get?",
      "How is proportional Christmas bonus calculated?",
      "What is IMSS and how much does it deduct?",
    ],
  },
  co: {
    code: "co",
    name: "Colombia",
    flag: "co",
    timezones: ["America/Bogota"],
    currencyCode: "COP",
    currencyLabel: "pesos colombianos (COP)",
    locale: "es-CO",
    hreflang: "es-CO",
    title: "Calculadora Laboral Colombia 2026 | Cesantías y Prima | Justo",
    description:
      "Calcula cesantías, intereses, prima de servicios, vacaciones, EPS y pensión en Colombia. Gratis, sin registro y con explicación legal.",
    ogTitle: "Justo · Asistente laboral para Colombia",
    ogDescription:
      "Calcula liquidaciones laborales en Colombia con transparencia y trazabilidad según el Código Sustantivo del Trabajo.",
    titleEn: "Colombia Labor Calculator 2026 | Severance and Premium | Justo",
    descriptionEn:
      "Calculate severance (cesantías), interest, service premium, vacations, EPS and pension in Colombia. Free, no registration, with legal explanation.",
    ogTitleEn: "Justo · Labor assistant for Colombia",
    ogDescriptionEn:
      "Calculate labor settlements in Colombia with transparency and traceability under the Substantive Labor Code.",
    exampleQuestions: [
      "¿Cuánto me corresponde de cesantías e intereses?",
      "¿Cómo se calcula la prima de servicios?",
      "¿Qué son EPS y pensión y cuánto descuentan?",
    ],
    exampleQuestionsEn: [
      "How much severance and interest do I get?",
      "How is the service premium calculated?",
      "What are EPS and pension and how much do they deduct?",
    ],
  },
  pe: {
    code: "pe",
    name: "Perú",
    flag: "pe",
    timezones: ["America/Lima"],
    currencyCode: "PEN",
    currencyLabel: "soles (PEN)",
    locale: "es-PE",
    hreflang: "es-PE",
    title: "Calculadora de Liquidación Perú 2026 | CTS y Gratificación | Justo",
    description:
      "Calcula liquidación, CTS, gratificaciones, vacaciones, indemnización y descuentos ONP o AFP en Perú. Gratis, sin registro y con explicación legal.",
    ogTitle: "Justo · Asistente laboral para Perú",
    ogDescription:
      "Calcula liquidaciones laborales en Perú con transparencia y trazabilidad.",
    titleEn: "Peru Labor Settlement Calculator 2026 | CTS and Bonuses | Justo",
    descriptionEn:
      "Calculate settlement, CTS, bonuses (gratificaciones), vacations, severance and ONP or AFP deductions in Peru. Free, no registration, with legal explanation.",
    ogTitleEn: "Justo · Labor assistant for Peru",
    ogDescriptionEn:
      "Calculate labor settlements in Peru with transparency and traceability.",
    exampleQuestions: [
      "¿Cuánto me pagan de CTS?",
      "¿Cómo se calcula la indemnización por años?",
      "¿Qué es la ONP y cuánto descuenta?",
    ],
    exampleQuestionsEn: [
      "How much CTS do I get?",
      "How is severance calculated by years of service?",
      "What is ONP and how much does it deduct?",
    ],
  },
  ar: {
    code: "ar",
    name: "Argentina",
    flag: "ar",
    timezones: [
      "America/Buenos_Aires",
      "America/Cordoba",
      "America/Mendoza",
      "America/Argentina/Salta",
      "America/Argentina/Jujuy",
      "America/Argentina/Ushuaia",
    ],
    currencyCode: "ARS",
    currencyLabel: "pesos argentinos (ARS)",
    locale: "es-AR",
    hreflang: "es-AR",
    title: "Cálculo de Liquidación Laboral en Argentina 2026 | Justo",
    description:
      "Calcula tu indemnización por antigüedad, preaviso, SAC (aguinaldo), vacaciones y descuentos (jubilación, PAMI, obra social) según la LCT. Gratis y sin registro.",
    ogTitle: "Justo · Asistente laboral para Argentina",
    ogDescription:
      "Calcula liquidaciones laborales en Argentina con transparencia y trazabilidad según la Ley de Contrato de Trabajo.",
    titleEn: "Argentina Labor Settlement Calculator 2026 | Justo",
    descriptionEn:
      "Calculate your seniority severance, notice pay, SAC (Christmas bonus), vacations and deductions (retirement, PAMI, health insurance) under Argentina's Labor Contract Law. Free and no registration.",
    ogTitleEn: "Justo · Labor assistant for Argentina",
    ogDescriptionEn:
      "Calculate labor settlements in Argentina with transparency and traceability under the Labor Contract Law.",
    exampleQuestions: [
      "¿Cuánto me corresponde de indemnización por antigüedad?",
      "¿Cómo se calcula el SAC (aguinaldo)?",
      "¿Qué descuentos tiene mi liquidación (jubilación, PAMI, obra social)?",
    ],
    exampleQuestionsEn: [
      "How much seniority severance do I get?",
      "How is the SAC (Christmas bonus) calculated?",
      "Which deductions apply (retirement, PAMI, health insurance)?",
    ],
  },
  cl: {
    code: "cl",
    name: "Chile",
    flag: "cl",
    timezones: ["America/Santiago", "America/Punta_Arenas"],
    currencyCode: "CLP",
    currencyLabel: "pesos chilenos (CLP)",
    locale: "es-CL",
    hreflang: "es-CL",
    title: "Cálculo de Liquidación Laboral en Chile 2026 | Justo",
    description:
      "Calcula tu indemnización por años de servicio, aviso sustitutivo, vacaciones y descuentos (AFP, salud, AFC) según el Código del Trabajo de Chile. Gratis y sin registro.",
    ogTitle: "Justo · Asistente laboral para Chile",
    ogDescription:
      "Calcula liquidaciones laborales en Chile con transparencia y trazabilidad según el Código del Trabajo.",
    titleEn: "Chile Labor Settlement Calculator 2026 | Justo",
    descriptionEn:
      "Calculate your years-of-service severance, substitute notice, vacations and deductions (AFP, health, AFC) under Chile's Labor Code. Free and no registration.",
    ogTitleEn: "Justo · Labor assistant for Chile",
    ogDescriptionEn:
      "Calculate labor settlements in Chile with transparency and traceability under the Labor Code.",
    exampleQuestions: [
      "¿Cuánto me pagan de indemnización por años de servicio?",
      "¿Cómo funciona el aviso sustitutivo?",
      "¿Qué descuentan AFP, salud y AFC?",
    ],
    exampleQuestionsEn: [
      "How much severance per year of service do I get?",
      "How does substitute notice work?",
      "What do AFP, health insurance and AFC deduct?",
    ],
  },
}

export const countryList = Object.values(countries)

export const defaultCountry: CountryCode = "ni"

export function isValidCountry(code: string): code is CountryCode {
  return code in countries
}

export function getCountryInfo(code: string): CountryInfo | undefined {
  return countries[code as CountryCode]
}
