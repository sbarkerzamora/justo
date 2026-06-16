import { PDFDocument } from "pdf-lib"
import type { SalaryNetInput, SalaryNetResult } from "@justo/core"
import {
  loadFonts,
  drawText,
  drawLine,
  drawBox,
  drawSectionTitle,
  drawIcon,
  drawKeyValue,
  drawSignatureBoxes,
  drawFooter,
  money,
  COLORS,
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
  const left = 48
  const right = W - 48
  let y = H - 48

  drawIcon(page, "◆", "SALARIO NETO", left, y, fontSet)
  y -= 24
  drawText(page, `${result.currency} · ${new Date(result.generatedAt).toLocaleString()}`, left, y, {
    size: 9, color: COLORS.muted, fontSet,
  })
  drawText(page, `Corpus: ${result.legalCorpusVersion}`, right, y, {
    size: 9, color: COLORS.muted, align: "right", fontSet,
  })
  y -= 10
  drawLine(page, left, y, right, y, { color: COLORS.border, width: 0.5 })

  y = drawSectionTitle(page, "Datos del caso", left, y - 8, fontSet, { compact: true })
  drawBox(page, left, y - 44, right - left, 42, { fillColor: COLORS.bg })
  y -= 4
  y = drawKeyValue(page, "Salario bruto:", money(result.grossSalary, result.currency), left, y, fontSet)
  y = drawKeyValue(page, "Frecuencia:", input.frequency, left, y, fontSet)

  y = drawSectionTitle(page, "Deducciones", left, y - 4, fontSet, { compact: true })
  const colX = [left, left + 260, left + 360]
  const headerY = y - 2
  drawBox(page, left, headerY - 18, right - left, 18, { fillColor: COLORS.tableHeaderBg })
  drawText(page, "Concepto", colX[0], headerY - 2, { size: 8, bold: true, fontSet })
  drawText(page, "Formula", colX[1], headerY - 2, { size: 8, bold: true, fontSet })
  drawText(page, "Monto", colX[2], headerY - 2, { size: 8, bold: true, fontSet })
  let rowY = headerY - 18
  for (const deduction of result.deductions) {
    drawLine(page, left, rowY - 14, right, rowY - 14, { color: COLORS.border, width: 0.2 })
    drawText(page, deduction.label, colX[0], rowY - 2, { size: 8, fontSet })
    drawText(page, deduction.formula, colX[1], rowY - 2, { size: 7, fontSet })
    drawText(page, money(deduction.amount, result.currency), colX[2], rowY - 2, { size: 8, bold: true, fontSet })
    rowY -= 14
  }
  y = rowY - 4

  y = drawSectionTitle(page, "Salario neto", left, y - 4, fontSet, { compact: true })
  drawBox(page, left, y - 56, right - left, 52, { borderColor: COLORS.border, borderWidth: 1, fillColor: COLORS.white })
  const netY = y - 8
  drawText(page, "MENSUAL", left + 16, netY - 6, { size: 9, color: COLORS.muted, fontSet })
  drawText(page, money(result.netSalaryPerPeriod.mensual, result.currency), left + 16, netY - 24, {
    size: 16, bold: true, color: [0.2, 0.4, 0.8], fontSet,
  })
  drawText(page, "QUINCENAL", left + 180, netY - 6, { size: 9, color: COLORS.muted, fontSet })
  drawText(page, money(result.netSalaryPerPeriod.quincenal, result.currency), left + 180, netY - 24, {
    size: 16, bold: true, color: [0.2, 0.4, 0.8], fontSet,
  })
  drawText(page, "SEMANAL", left + 350, netY - 6, { size: 9, color: COLORS.muted, fontSet })
  drawText(page, money(result.netSalaryPerPeriod.semanal, result.currency), left + 350, netY - 24, {
    size: 16, bold: true, color: [0.2, 0.4, 0.8], fontSet,
  })
  y = y - 60

  y = drawSectionTitle(page, "Referencias legales", left, y - 4, fontSet, { compact: true })
  for (const deduction of result.deductions) {
    drawText(page, `◆ ${deduction.label}: ${deduction.legalReference}`, left, y - 4, { size: 8, color: COLORS.muted, fontSet })
    y -= 12
  }

  y = drawSectionTitle(page, "Firmas", left, y - 4, fontSet, { compact: true })
  y = drawSignatureBoxes(page, y, left, fontSet)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
