import type { PreavisoInput, PreavisoResult } from "./types"

export function noticeDaysToAmount(dailySalary: number, days: number): number {
  return Math.round(dailySalary * days * 100) / 100
}

const noNoticeCauses = new Set([
  "despido_justificado",
  "mutuo_acuerdo",
  "fin_plazo",
  "obra_terminada",
  "jubilacion",
  "fallecimiento",
])

export function applyPreavisoInputAdjustments(
  input: PreavisoInput,
  result: PreavisoResult
): PreavisoResult {
  if (
    noNoticeCauses.has(input.terminationCause) ||
    input.contractType === "periodo_prueba"
  ) {
    return {
      ...result,
      noticeDays: 0,
      noticeAmount: 0,
      hasSubstitutePayment: false,
      calculationNote: appendNote(
        result.calculationNote,
        "No se calcula preaviso sustitutivo para esta causa o periodo de prueba."
      ),
    }
  }

  const noticeDaysGiven = input.noticeGivenInWriting
    ? (input.noticeDaysGiven ?? 0)
    : 0
  const pendingNoticeDays = Math.max(0, result.noticeDays - noticeDaysGiven)
  const dailySalary = input.monthlySalary / 30
  const noticeAmount = input.replaceNoticeWithPayment
    ? noticeDaysToAmount(dailySalary, pendingNoticeDays)
    : 0

  return {
    ...result,
    noticeDays: pendingNoticeDays,
    noticeAmount,
    hasSubstitutePayment:
      input.replaceNoticeWithPayment && pendingNoticeDays > 0,
    calculationNote: appendNote(
      result.calculationNote,
      noticeDaysGiven > 0
        ? `Se descuentan ${noticeDaysGiven} dias de preaviso otorgados por escrito.`
        : input.replaceNoticeWithPayment
          ? "El monto refleja preaviso pendiente sustituido en dinero."
          : "Se muestran dias pendientes, sin sustitucion en dinero."
    ),
  }
}

function appendNote(current: string | undefined, extra: string): string {
  return current ? `${current} ${extra}` : extra
}
