import { PDFDocument } from "pdf-lib"
import type { SalaryNetInput, SalaryNetResult } from "@justo/core"
import {
  loadFonts, drawText, drawLine, drawBox, drawSectionTitle,
  drawHeader, drawKeyValue, drawSignatureBoxes, drawFooter,
  money, COLORS,
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
  y = drawKeyValue(page, "Salario bruto", money(result.grossSalary, result.currency), left, y, fontSet)
  y = drawKeyValue(page, "Frecuencia", input.frequency, left, y, fontSet)

  y = drawSectionTitle(page, "Deducciones", left, y - 2, fontSet)
  const colX = [left, left + 240, left + 340]
  drawBox(page, left, y - 16, right - left, 16, { fillColor: COLORS.tableHeaderBg })
  drawText(page, "Concepto", colX[0], y - 2, { size: 7, bold: true, fontSet })
  drawText(page, "Formula", colX[1], y - 2, { size: 7, bold: true, fontSet })
  drawText(page, "Monto", colX[2], y - 2, { size: 7, bold: true, fontSet })
  let rowY = y - 16
  for (const deduction of result.deductions) {
    drawLine(page, left, rowY - 12, right, rowY - 12, { color: COLORS.border, width: 0.2 })
    drawText(page, deduction.label, colX[0], rowY - 1, { size: 7, fontSet })
    drawText(page, deduction.formula, colX[1], rowY - 1, { size: 7, fontSet })
    drawText(page, money(deduction.amount, result.currency), colX[2], rowY - 1, { size: 7, bold: true, fontSet })
    rowY -= 12
  }
  y = rowY - 2

  y = drawSectionTitle(page, "Salario neto por periodo", left, y - 2, fontSet)
  drawBox(page, left, y - 40, right - left, 38, { borderColor: COLORS.border, borderWidth: 1, fillColor: COLORS.white })
  const netY = y - 6
  drawText(page, "Mensual", left + 12, netY - 4, { size: 7, color: COLORS.muted, fontSet })
  drawText(page, money(result.netSalaryPerPeriod.mensual, result.currency), left + 12, netY - 20, { size: 14, bold: true, fontSet })
  drawText(page, "Quincenal", left + 160, netY - 4, { size: 7, color: COLORS.muted, fontSet })
  drawText(page, money(result.netSalaryPerPeriod.quincenal, result.currency), left + 160, netY - 20, { size: 14, bold: true, fontSet })
  drawText(page, "Semanal", left + 310, netY - 4, { size: 7, color: COLORS.muted, fontSet })
  drawText(page, money(result.netSalaryPerPeriod.semanal, result.currency), left + 310, netY - 20, { size: 14, bold: true, fontSet })
  y = y - 44

  y = drawSectionTitle(page, "Referencias legales", left, y, fontSet)
  for (const deduction of result.deductions) {
    drawText(page, `- ${deduction.label}: ${deduction.legalReference}`, left, y - 2, { size: 7, color: COLORS.muted, fontSet })
    y -= 10
  }

  y = drawSectionTitle(page, "Firmas", left, y - 2, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
