import { PDFDocument } from "pdf-lib"
import type { SalaryNetInput, SalaryNetResult } from "@justo/core"
import {
  loadFonts, drawText, drawSectionTitle, drawHeader,
  drawSignatureBoxes, drawFooter, drawBreakdownItem,
  drawStackedKeyValues, drawSummaryCard, money, COLORS,
} from "./pdf-helpers"

export const buildSalaryNetPdf = async (
  input: SalaryNetInput,
  result: SalaryNetResult,
) => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89])
  const fontSet = await loadFonts(pdf)

  const W = 595.28
  const H = 841.89
  const left = 40
  const right = W - 40
  let y = H - 36

  y = drawHeader(page, "Salario Neto",
    `${result.currency} · ${new Date(result.generatedAt).toLocaleString()} · Corpus: ${result.legalCorpusVersion}`,
    left, y, fontSet)

  y = drawSectionTitle(page, "Datos del caso", left, y, fontSet)
  y = drawStackedKeyValues(page, [
    { label: "Salario bruto", value: money(result.grossSalary, result.currency) },
    { label: "Frecuencia", value: input.frequency },
  ], left, y, fontSet)

  y = drawSectionTitle(page, "Deducciones", left, y - 2, fontSet)
  for (const deduction of result.deductions) {
    y = drawBreakdownItem(page, {
      label: deduction.label,
      amount: money(deduction.amount, result.currency),
      formula: deduction.formula,
      legalReference: deduction.legalReference,
    }, left, right, y, fontSet)
  }

  y = drawSectionTitle(page, "Salario neto por periodo", left, y - 2, fontSet)
  y = drawSummaryCard(page, "Neto mensual", money(result.netSalaryPerPeriod.mensual, result.currency), [
    { label: "Quincenal", value: money(result.netSalaryPerPeriod.quincenal, result.currency) },
    { label: "Semanal", value: money(result.netSalaryPerPeriod.semanal, result.currency) },
  ], left, right, y, fontSet)

  y = drawSectionTitle(page, "Referencias legales", left, y, fontSet)
  for (const deduction of result.deductions) {
    drawText(page, `- ${deduction.label}: ${deduction.legalReference}`, left, y - 2, { size: 7, color: COLORS.muted, fontSet })
    y -= 10
  }

  y = drawSectionTitle(page, "Firmas", left, y - 2, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet, right)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
