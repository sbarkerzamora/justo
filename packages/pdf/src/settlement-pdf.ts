import { PDFDocument } from "pdf-lib"
import type { SettlementInput, SettlementResult } from "@justo/core"
import {
  loadFonts,
  drawText,
  drawLine,
  drawBox,
  drawSectionTitle,
  drawIcon,
  drawKeyValue,
  drawSignatureBoxes,
  drawTableHeader,
  drawTableRow,
  drawFooter,
  money,
  COLORS,
} from "./pdf-helpers"

export const buildSettlementPdf = async (
  input: SettlementInput,
  result: SettlementResult,
) => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89])
  const fontSet = await loadFonts(pdf)

  const W = 595.28
  const H = 841.89
  const left = 48
  const right = W - 48
  let y = H - 48

  drawIcon(page, "◆", "LIQUIDACION LABORAL", left, y, fontSet)
  y -= 24
  drawText(page, `${result.currency} · ${new Date(result.generatedAt).toLocaleString("es-NI")}`, left, y, {
    size: 9, color: COLORS.muted, fontSet,
  })
  drawText(page, `Corpus: ${result.legalCorpusVersion}`, right, y, {
    size: 9, color: COLORS.muted, align: "right", fontSet,
  })
  y -= 10
  drawLine(page, left, y, right, y, { color: COLORS.border, width: 0.5 })

  y = drawSectionTitle(page, "Datos del caso", left, y - 8, fontSet, { compact: true })
  drawBox(page, left, y - 70, right - left, 68, { fillColor: COLORS.bg })
  y -= 6
  y = drawKeyValue(page, "Trabajador:", input.employeeName, left, y, fontSet)
  y = drawKeyValue(page, "Empleador:", input.employerName, left, y, fontSet)
  y = drawKeyValue(page, "Salario mensual:", money(input.monthlySalary, result.currency), left, y, fontSet)
  y = drawKeyValue(page, "Antiguedad:", result.tenureText, left, y, fontSet)

  y = drawSectionTitle(page, "Resumen ejecutivo", left, y - 4, fontSet, { compact: true })
  drawBox(page, left, y - 52, right - left, 48, { borderColor: COLORS.border, borderWidth: 1, fillColor: COLORS.white })
  drawText(page, "NETO A RECIBIR", left + 16, y - 14, { size: 10, bold: true, fontSet })
  drawText(page, money(result.netTotal, result.currency), right - 16, y - 18, { size: 18, bold: true, color: [0.2, 0.4, 0.8], align: "right", fontSet })
  drawText(page, `Ingresos: ${money(result.grossIncome, result.currency)}`, left + 16, y - 30, { size: 8, color: COLORS.muted, fontSet })
  drawText(page, `Deducciones: ${money(result.totalDeductions, result.currency)}`, left + 200, y - 30, { size: 8, color: COLORS.muted, fontSet })
  y = y - 56

  y = drawSectionTitle(page, "Ingresos", left, y - 4, fontSet, { compact: true })
  const col1 = left + 4
  const col2 = left + 140
  const col3 = left + 300
  const col4 = right - 4
  y = drawTableHeader(page, [
    { label: "Concepto", x: col1 }, { label: "Formula", x: col2 },
    { label: "Base legal", x: col3 }, { label: "Monto", x: col4 },
  ], y, left, right, fontSet)
  for (const line of result.incomes) {
    y = drawTableRow(page, [
      { text: line.label, x: col1 }, { text: line.formula, x: col2, size: 7 },
      { text: line.legalReference, x: col3, size: 7 }, { text: money(line.amount, result.currency), x: col4, bold: true },
    ], y, left, right, fontSet)
  }
  y -= 2
  drawText(page, `Total ingresos: ${money(result.grossIncome, result.currency)}`, right - 4, y, {
    size: 10, bold: true, align: "right", color: [0.2, 0.4, 0.8], fontSet,
  })
  y -= 4
  drawLine(page, left, y, right, y, { color: COLORS.border, width: 0.3 })

  y = drawSectionTitle(page, "Deducciones", left, y - 4, fontSet, { compact: true })
  y = drawTableHeader(page, [
    { label: "Concepto", x: col1 }, { label: "Formula", x: col2 },
    { label: "Base legal", x: col3 }, { label: "Monto", x: col4 },
  ], y, left, right, fontSet)
  for (const line of result.deductions) {
    y = drawTableRow(page, [
      { text: line.label, x: col1 }, { text: line.formula, x: col2, size: 7 },
      { text: line.legalReference, x: col3, size: 7 }, { text: money(line.amount, result.currency), x: col4, bold: true },
    ], y, left, right, fontSet)
  }
  y -= 2
  drawText(page, `Total deducciones: ${money(result.totalDeductions, result.currency)}`, right - 4, y, {
    size: 10, bold: true, align: "right", fontSet,
  })
  y -= 4
  drawLine(page, left, y, right, y, { color: COLORS.border, width: 0.3 })

  y = drawSectionTitle(page, "Firmas", left, y - 4, fontSet, { compact: true })
  y = drawSignatureBoxes(page, y, left, fontSet)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
