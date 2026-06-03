import { round2 } from "../settlement"
import type { CountryCode, CurrencyCode } from "../settlement"
import type {
  ContractInput,
  ContractSection,
  ContractResult,
  JornadaType,
  ContractType,
  PaymentMethod,
  PaymentFrequency,
} from "./types"

const jornadaLabel: Record<JornadaType, string> = {
  diurna:
    "Jornada diurna (6:00 a.m. - 8:00 p.m., máximo 8 horas diarias, 48 semanales)",
  mixta:
    "Jornada mixta (incluye horas diurnas y nocturnas, máximo 7 horas diarias)",
  nocturna:
    "Jornada nocturna (8:00 p.m. - 6:00 a.m., máximo 6 horas diarias, 36 semanales)",
}

const contractTypeLabel: Record<ContractType, string> = {
  indeterminado: "Tiempo indeterminado",
  plazo_fijo: "Plazo fijo",
  obra_determinada: "Obra o servicio determinado",
}

const paymentMethodLabel: Record<PaymentMethod, string> = {
  unidad_tiempo: "Por unidad de tiempo",
  destajo: "Por destajo",
  comision: "Por comisión",
  otro: "Otra forma pactada",
}

const paymentFreqLabel: Record<PaymentFrequency, string> = {
  mensual: "Mensual",
  quincenal: "Quincenal",
  semanal: "Semanal",
}

const displayDate = (iso: string): string => {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return iso
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ]
  return `${Number(m[3])} de ${months[Number(m[2]) - 1]} de ${m[1]}`
}

export interface ContractParams {
  currency: CurrencyCode
  corpusVersion: string
  legalReference: string
  countryName: string
  lawName: string
  lawArticles: string
  workerIdLabel: string
  employerIdLabel: string
  extraSections?: ContractExtraSection[]
}

export interface ContractExtraSection {
  title: string
  buildContent: () => string
}

export function buildContract(
  input: ContractInput,
  params: ContractParams,
): ContractResult {
  const celebrationDateFormatted = displayDate(
    new Date().toISOString().slice(0, 10),
  )
  const startFormatted = displayDate(input.startDate)
  const endFormatted = input.endDate ? displayDate(input.endDate) : undefined

  const sections: ContractSection[] = [
    {
      title: "PRIMERA: Lugar y fecha de celebración",
      content: `El presente Contrato Individual de Trabajo se celebra en ${input.celebrationPlace}, a los ${celebrationDateFormatted}, entre las partes que se identifican en la cláusula siguiente.`,
    },
    {
      title: "SEGUNDA: Identificación de las partes",
      content: [
        `Comparecen como partes:`,
        ``,
        `**El empleador:** ${input.employerName}, identificado con ${params.employerIdLabel} No. ${input.employerId}, representado legalmente por ${input.employerRepresentative}, del domicilio de ${input.employerAddress}.`,
        ``,
        `**El trabajador:** ${input.workerName}, identificado con ${params.workerIdLabel} No. ${input.workerId}, del domicilio de ${input.workerAddress}.`,
        ``,
        `Las partes, de común acuerdo, convienen en suscribir el presente Contrato Individual de Trabajo, que se regirá por las disposiciones del ${params.lawName} (${params.legalReference}).`,
      ].join("\n"),
    },
    {
      title: "TERCERA: Objeto del contrato",
      content: [
        `El trabajador se obliga a prestar sus servicios personales bajo la dirección y dependencia del empleador, desempeñando el cargo de **${input.jobTitle}**. Las funciones principales del puesto comprenden:`,
        ``,
        `${input.jobDescription}`,
        ``,
        `El lugar de trabajo será en ${input.workLocation}, pudiendo el empleador modificar el lugar de trabajo dentro del mismo municipio sin que ello constituya desmejora de las condiciones laborales.`,
      ].join("\n"),
    },
    {
      title: "CUARTA: Jornada de trabajo",
      content: [
        `La relación laboral se regirá bajo ${jornadaLabel[input.jornada]}.`,
        ``,
        `El horario específico será definido por el empleador dentro de los límites legales establecidos en ${params.lawName}, respetando el descanso semanal y los días feriados establecidos por ley.`,
      ].join("\n"),
    },
    {
      title: "QUINTA: Duración del contrato",
      content: buildDurationContent(
        input.contractType,
        startFormatted,
        endFormatted,
        input.trialPeriodDays ?? null,
        params,
      ),
    },
    {
      title: "SEXTA: Salario y forma de pago",
      content: [
        `El salario ordinario mensual pactado es de ${input.monthlySalary.toFixed(2)} (${input.monthlySalary} unidades monetarias), pagadero en forma ${paymentFreqLabel[input.paymentFrequency]} por ${paymentMethodLabel[input.paymentMethod]}.`,
        ``,
        `El pago se realizará en moneda de curso legal, en el lugar de trabajo o mediante depósito en cuenta bancaria designada por el trabajador.`,
        ``,
        `Queda entendido que el salario incluye todas las prestaciones e incrementos establecidos por ley, y el trabajador autoriza los descuentos legales correspondientes así como los autorizados por escrito.`,
      ].join("\n"),
    },
    {
      title: "SÉPTIMA: Obligaciones de las partes",
      content: [
        `**Obligaciones del empleador:**`,
        `- Pagar el salario en la forma y plazo estipulados.`,
        `- Proporcionar condiciones de trabajo seguras e higiénicas.`,
        `- Respetar los derechos laborales establecidos en ${params.lawName}.`,
        `- Inscribir al trabajador en el sistema de seguridad social y pagar las cotizaciones correspondientes.`,
        ``,
        `**Obligaciones del trabajador:**`,
        `- Prestar el servicio con eficiencia, diligencia y buena fe.`,
        `- Cumplir con las normas de seguridad e higiene ocupacional.`,
        `- Guardar reserva de la información confidencial del empleador.`,
        `- Comunicar cualquier cambio de domicilio al empleador.`,
      ].join("\n"),
    },
  ]

  if (params.extraSections) {
    for (const extra of params.extraSections) {
      sections.push({
        title: extra.title,
        content: extra.buildContent(),
      })
    }
  }

  sections.push({
    title: "DISPOSICIONES FINALES",
    content: [
      `Las partes declaran que no existe vicio del consentimiento en la celebración del presente contrato.`,
      ``,
      `Cualquier modificación al presente contrato deberá constar por escrito y ser firmada por ambas partes.`,
      ``,
      `Para todos los efectos del presente contrato, las partes señalan como domicilio especial la ciudad de ${input.celebrationPlace}, y se someten a la jurisdicción de sus tribunales laborales competentes.`,
      ``,
      `El presente contrato se extiende en dos ejemplares del mismo tenor y valor, quedando un ejemplar en poder de cada una de las partes.`,
    ].join("\n"),
  })

  return {
    celebrationPlace: input.celebrationPlace,
    celebrationDate: celebrationDateFormatted,
    workerName: input.workerName,
    workerId: input.workerId,
    workerAddress: input.workerAddress,
    employerName: input.employerName,
    employerId: input.employerId,
    employerRepresentative: input.employerRepresentative,
    employerAddress: input.employerAddress,
    jobTitle: input.jobTitle,
    jobDescription: input.jobDescription,
    workLocation: input.workLocation,
    jornada: input.jornada,
    contractType: input.contractType,
    startDate: input.startDate,
    endDate: input.endDate,
    monthlySalary: round2(input.monthlySalary),
    paymentFrequency: input.paymentFrequency,
    paymentMethod: input.paymentMethod,
    trialPeriodDays: input.trialPeriodDays ?? null,
    countryCode: input.countryCode,
    currency: params.currency,
    sections,
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: params.corpusVersion,
  }
}

function buildDurationContent(
  contractType: ContractType,
  startFormatted: string,
  endFormatted: string | undefined,
  trialDays: number | null,
  params: ContractParams,
): string {
  const base: string[] = []

  if (contractType === "indeterminado") {
    base.push(
      `El presente contrato se celebra por **tiempo indeterminado**, dando inicio el día ${startFormatted}.`,
    )
    if (trialDays && trialDays > 0) {
      base.push(
        ``,
        `Se pacta un período de prueba de ${trialDays} días, durante el cual cualquiera de las partes podrá dar por terminado el contrato sin responsabilidad. Dicho período no excede el máximo legal establecido en ${params.lawName}.`,
      )
    }
  } else if (contractType === "plazo_fijo") {
    base.push(
      `El presente contrato se celebra por **plazo fijo**, dando inicio el ${startFormatted} y finalizando el ${endFormatted ?? "la fecha que se acuerde posteriormente"}.`,
    )
  } else {
    base.push(
      `El presente contrato se celebra para la realización de **obra o servicio determinado**, dando inicio el ${startFormatted} y finalizando al concluir la obra o servicio contratado.`,
    )
  }

  base.push(
    ``,
    `El contrato podrá prorrogarse por acuerdo mutuo de las partes, debiendo constar por escrito dicha prórroga.`,
  )

  return base.join("\n")
}
