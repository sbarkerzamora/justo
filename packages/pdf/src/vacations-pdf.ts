import { PDFDocument } from "pdf-lib"
import type { VacationInput, VacationResult } from "@justo/core"
import {
  loadFonts, drawSectionTitle, drawHeader, drawSignatureBoxes,
  drawFooter, drawBreakdownItem, drawStackedKeyValues,
  drawSummaryCard, money,
} from "./pdf-helpers"

export const buildVacationsPdf = async (
  input: VacationInput,
  result: VacationResult,
) => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89])
  const fontSet = await loadFonts(pdf)

  const W = 595.28
  const H = 841.89
  const left = 40
  const right = W - 40
  let y = H - 36

  y = drawHeader(page, "Vacaciones",
    `${result.currency} · ${new Date(result.generatedAt).toLocaleString()} · Corpus: ${result.legalCorpusVersion}`,
    left, y, fontSet)

  y = drawSectionTitle(page, "Datos del caso", left, y, fontSet)
  y = drawStackedKeyValues(page, [
    { label: "Salario mensual", value: money(input.monthlySalary, result.currency) },
    { label: "Periodo", value: `${input.startDate} -> ${input.endDate}` },
    { label: "Dias gozados", value: `${input.usedVacationDays} dias` },
  ], left, y, fontSet)

  y = drawSectionTitle(page, "Resultado", left, y - 2, fontSet)
  y = drawSummaryCard(page, "Monto estimado", money(result.amount, result.currency), [
    { label: "Dias acumulados", value: String(result.accruedVacationDays) },
    { label: "Dias pendientes", value: String(result.pendingVacationDays) },
    { label: "Salario diario", value: money(result.dailySalary, result.currency) },
  ], left, right, y, fontSet)

  y = drawSectionTitle(page, "Detalle", left, y, fontSet)
  y = drawBreakdownItem(page, {
    label: "Vacaciones pendientes",
    amount: money(result.amount, result.currency),
    formula: result.formula,
    legalReference: result.legalReference,
  }, left, right, y, fontSet)

  y = drawSectionTitle(page, "Firmas", left, y, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet, right)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
