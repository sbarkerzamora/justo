import { PDFDocument } from "pdf-lib"
import type { SettlementInput, SettlementResult } from "@justo/core"
import {
  loadFonts, drawText, drawLine, drawBox, drawSectionTitle,
  drawHeader, drawKeyValue, drawSignatureBoxes,
  drawTableHeader, drawTableRow, drawFooter,
  money, COLORS,
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
  const left = 40
  const right = W - 40
  let y = H - 36

  y = drawHeader(page, "Liquidacion Laboral",
    `${result.currency} · ${new Date(result.generatedAt).toLocaleString("es-NI")} · Corpus: ${result.legalCorpusVersion}`,
    left, y, fontSet)

  y = drawSectionTitle(page, "Datos del caso", left, y, fontSet)
  y = drawKeyValue(page, "Trabajador", input.employeeName, left, y, fontSet)
  y = drawKeyValue(page, "Empleador", input.employerName, left, y, fontSet)
  y = drawKeyValue(page, "Salario mensual", money(input.monthlySalary, result.currency), left, y, fontSet)
  y = drawKeyValue(page, "Antiguedad", result.tenureText, left, y, fontSet)
  y -= 2

  y = drawSectionTitle(page, "Resultado", left, y, fontSet)
  drawBox(page, left, y - 36, right - left, 34, { borderColor: COLORS.border, borderWidth: 1, fillColor: COLORS.white })
  drawText(page, "Neto a recibir", left + 12, y - 10, { size: 9, bold: true, fontSet })
  drawText(page, money(result.netTotal, result.currency), right - 12, y - 16, { size: 16, bold: true, align: "right", fontSet })
  drawText(page, `Ingresos: ${money(result.grossIncome, result.currency)}`, left + 12, y - 24, { size: 7, color: COLORS.muted, fontSet })
  drawText(page, `Deducciones: ${money(result.totalDeductions, result.currency)}`, left + 160, y - 24, { size: 7, color: COLORS.muted, fontSet })
  y = y - 40

  y = drawSectionTitle(page, "Ingresos", left, y, fontSet)
  const col1 = left + 4
  const col2 = left + 140
  const col3 = left + 290
  const col4 = right - 4
  y = drawTableHeader(page, [
    { label: "Concepto", x: col1 }, { label: "Formula", x: col2 },
    { label: "Base legal", x: col3 }, { label: "Monto", x: col4 },
  ], y, left, right, fontSet)
  for (const line of result.incomes) {
    y = drawTableRow(page, [
      { text: line.label, x: col1 }, { text: line.formula, x: col2 },
      { text: line.legalReference, x: col3 }, { text: money(line.amount, result.currency), x: col4, bold: true },
    ], y, left, right, fontSet)
  }
  drawText(page, `Total ingresos: ${money(result.grossIncome, result.currency)}`, right - 4, y - 2, {
    size: 8, bold: true, align: "right", fontSet,
  })
  y -= 6

  y = drawSectionTitle(page, "Deducciones", left, y, fontSet)
  y = drawTableHeader(page, [
    { label: "Concepto", x: col1 }, { label: "Formula", x: col2 },
    { label: "Base legal", x: col3 }, { label: "Monto", x: col4 },
  ], y, left, right, fontSet)
  for (const line of result.deductions) {
    y = drawTableRow(page, [
      { text: line.label, x: col1 }, { text: line.formula, x: col2 },
      { text: line.legalReference, x: col3 }, { text: money(line.amount, result.currency), x: col4, bold: true },
    ], y, left, right, fontSet)
  }
  drawText(page, `Total deducciones: ${money(result.totalDeductions, result.currency)}`, right - 4, y - 2, {
    size: 8, bold: true, align: "right", fontSet,
  })
  y -= 6

  y = drawSectionTitle(page, "Firmas", left, y, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
