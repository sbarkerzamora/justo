import type { CountryCode } from "@/lib/settlement/types"

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
  exampleQuestions: string[]
}

export const countries: Record<CountryCode, CountryInfo> = {
  ni: {
    code: "ni",
    name: "Nicaragua",
    flag: "ni",
    timezones: ["America/Managua"],
    currencyCode: "NIO",
    currencyLabel: "córdobas (NIO)",
    locale: "es-NI",
    hreflang: "es-NI",
    title: "Cálculo de Liquidación Laboral en Nicaragua 2026 | Justo",
    description:
      "Calcula tu indemnización, aguinaldo proporcional, vacaciones y descuentos (INSS e IR) según el Código del Trabajo de Nicaragua. Gratis y sin registro.",
    ogTitle: "Justo · Asistente laboral para Nicaragua",
    ogDescription:
      "Calcula liquidaciones laborales en Nicaragua con transparencia y trazabilidad según la Ley No. 185.",
    exampleQuestions: [
      "¿Cuánto me pagan de indemnización si renuncio con 5 años?",
      "¿Cómo se calcula el aguinaldo proporcional?",
      "¿Qué descuentos tiene mi liquidación (INSS e IR)?",
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
    exampleQuestions: [
      "¿Cuánto me corresponde de indemnización (cesantía)?",
      "¿Cómo se calcula el aguinaldo por años trabajados?",
      "¿Qué son ISSS y AFP y cuánto descuentan?",
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
    exampleQuestions: [
      "¿Cuánto me corresponde de indemnización?",
      "¿Cómo se calcula el Bono 14?",
      "¿Qué es el IGSS y cuánto descuenta?",
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
    exampleQuestions: [
      "¿Cuánto me pagan de auxilio de cesantía?",
      "¿Cómo se calcula el decimotercer mes?",
      "¿Qué es el IHSS y cuánto descuenta?",
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
    title: "Cálculo de Liquidación Laboral en Costa Rica 2026 | Justo",
    description:
      "Calcula tu cesantía, preaviso, aguinaldo proporcional, vacaciones y descuentos (CCSS) según el Código de Trabajo de Costa Rica. Gratis y sin registro.",
    ogTitle: "Justo · Asistente laboral para Costa Rica",
    ogDescription:
      "Calcula liquidaciones laborales en Costa Rica con transparencia y trazabilidad.",
    exampleQuestions: [
      "¿Cuánto me corresponde de cesantía y preaviso?",
      "¿Cómo se calcula el aguinaldo proporcional?",
      "¿Qué es la CCSS y cuánto descuenta?",
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
    exampleQuestions: [
      "¿Cuánto me pagan de prima de antigüedad?",
      "¿Cómo se calcula el decimotercer mes?",
      "¿Qué es la CSS y cuánto descuenta?",
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
    exampleQuestions: [
      "¿Cuánto me corresponde de indemnización constitucional?",
      "¿Cómo se calcula el aguinaldo proporcional?",
      "¿Qué es el IMSS y cuánto descuenta?",
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
    title: "Cálculo de Liquidación Laboral en Colombia 2026 | Justo",
    description:
      "Calcula tus cesantías, intereses a las cesantías, prima de servicios, vacaciones y descuentos (EPS y pensión) según el CST. Gratis y sin registro.",
    ogTitle: "Justo · Asistente laboral para Colombia",
    ogDescription:
      "Calcula liquidaciones laborales en Colombia con transparencia y trazabilidad según el Código Sustantivo del Trabajo.",
    exampleQuestions: [
      "¿Cuánto me corresponde de cesantías e intereses?",
      "¿Cómo se calcula la prima de servicios?",
      "¿Qué son EPS y pensión y cuánto descuentan?",
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
    title: "Cálculo de Liquidación Laboral en Perú 2026 | Justo",
    description:
      "Calcula tu CTS, indemnización por años de servicio, gratificaciones, vacaciones y descuentos (ONP o AFP) según la Ley General del Trabajo. Gratis y sin registro.",
    ogTitle: "Justo · Asistente laboral para Perú",
    ogDescription:
      "Calcula liquidaciones laborales en Perú con transparencia y trazabilidad.",
    exampleQuestions: [
      "¿Cuánto me pagan de CTS?",
      "¿Cómo se calcula la indemnización por años?",
      "¿Qué es la ONP y cuánto descuenta?",
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
    exampleQuestions: [
      "¿Cuánto me corresponde de indemnización por antigüedad?",
      "¿Cómo se calcula el SAC (aguinaldo)?",
      "¿Qué descuentos tiene mi liquidación (jubilación, PAMI, obra social)?",
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
    exampleQuestions: [
      "¿Cuánto me pagan de indemnización por años de servicio?",
      "¿Cómo funciona el aviso sustitutivo?",
      "¿Qué descuentan AFP, salud y AFC?",
    ],
  },
}

export const countryList = Object.values(countries)

export const validCountryCodes = Object.keys(countries) as CountryCode[]

export const defaultCountry: CountryCode = "ni"

export function isValidCountry(code: string): code is CountryCode {
  return code in countries
}

export function getCountryInfo(code: string): CountryInfo | undefined {
  return countries[code as CountryCode]
}
