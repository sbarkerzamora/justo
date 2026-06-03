import { PDFDocument } from "pdf-lib"
import type { SettlementInput, SettlementResult } from "@justo/core"
import {
  loadFonts,
  drawText,
  drawLine,
  drawBox,
  drawSectionTitle,
  drawKeyValue,
  drawSignatureBoxes,
  drawTableHeader,
  drawTableRow,
  drawFooter,
} from "./pdf-helpers"

const currencyFormatters: Record<string, Intl.NumberFormat> = {
  NIO: new Intl.NumberFormat("es-NI", { style: "currency", currency: "NIO", minimumFractionDigits: 2 }),
  USD: new Intl.NumberFormat("es-NI", { style: "currency", currency: "USD", minimumFractionDigits: 2 }),
  GTQ: new Intl.NumberFormat("es-NI", { style: "currency", currency: "GTQ", minimumFractionDigits: 2 }),
  HNL: new Intl.NumberFormat("es-NI", { style: "currency", currency: "HNL", minimumFractionDigits: 2 }),
  CRC: new Intl.NumberFormat("es-NI", { style: "currency", currency: "CRC", minimumFractionDigits: 2 }),
  MXN: new Intl.NumberFormat("es-NI", { style: "currency", currency: "MXN", minimumFractionDigits: 2 }),
  COP: new Intl.NumberFormat("es-NI", { style: "currency", currency: "COP", minimumFractionDigits: 2 }),
  PEN: new Intl.NumberFormat("es-NI", { style: "currency", currency: "PEN", minimumFractionDigits: 2 }),
  ARS: new Intl.NumberFormat("es-NI", { style: "currency", currency: "ARS", minimumFractionDigits: 2 }),
  CLP: new Intl.NumberFormat("es-NI", { style: "currency", currency: "CLP", minimumFractionDigits: 2 }),
}

const money = (amount: number, currencyCode: string) =>
  (currencyFormatters[currencyCode] ?? currencyFormatters.NIO).format(amount)

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

  // ── HEADER ──
  drawText(page, "LIQUIDACION LABORAL", left, y, { size: 24, bold: true, fontSet })
  y -= 32
  drawText(page, `Reporte generado automaticamente · ${result.currency}`, left, y, {
    size: 10,
    color: [0.55, 0.55, 0.55],
    fontSet,
  })

  const dateStr = new Date(result.generatedAt).toLocaleString("es-NI")
  const corpusStr = `Corpus: ${result.legalCorpusVersion}`
  drawText(page, dateStr, right, y + 16, { size: 9, color: [0.55, 0.55, 0.55], align: "right", fontSet })
  drawText(page, corpusStr, right, y, { size: 9, color: [0.55, 0.55, 0.55], align: "right", fontSet })

  y -= 12
  drawLine(page, left, y, right, y, { color: [0.1, 0.1, 0.1], width: 1 })

  // ── DATOS DEL CASO ──
  y = drawSectionTitle(page, "Datos del caso", left, y - 12, fontSet)
  const cardY = y + 4
  const cardH = 90
  drawBox(page, left - 4, cardY - cardH + 4, right - left + 8, cardH, {
    borderColor: [0.85, 0.85, 0.85],
    borderWidth: 1,
    fillColor: [0.98, 0.98, 0.98],
  })
  y = cardY - 10
  y = drawKeyValue(page, "Trabajador:", input.employeeName, left, y, fontSet)
  y = drawKeyValue(page, "Empleador:", input.employerName, left, y, fontSet)
  y = drawKeyValue(page, "Salario mensual:", money(input.monthlySalary, result.currency), left, y, fontSet)
  y = drawKeyValue(page, "Antiguedad:", result.tenureText, left, y, fontSet)
  y -= 4

  // ── RESUMEN EJECUTIVO ──
  y = drawSectionTitle(page, "Resumen ejecutivo", left, y - 8, fontSet)

  const netBoxH = 56
  const netBoxY = y - netBoxH
  drawBox(page, left, netBoxY, right - left, netBoxH, {
    borderColor: [0.1, 0.1, 0.1],
    borderWidth: 1.5,
    fillColor: [1, 1, 1],
  })
  drawText(page, "NETO A RECIBIR", left + 16, netBoxY + 34, { size: 11, bold: true, fontSet })
  const netAmountStr = money(result.netTotal, result.currency)
  drawText(page, netAmountStr, right - 16, netBoxY + 28, { size: 20, bold: true, align: "right", fontSet })

  drawText(page, `Total ingresos: ${money(result.grossIncome, result.currency)}`, left + 16, netBoxY + 10, {
    size: 9,
    color: [0.55, 0.55, 0.55],
    fontSet,
  })
  drawText(page, `Total deducciones: ${money(result.totalDeductions, result.currency)}`, left + 220, netBoxY + 10, {
    size: 9,
    color: [0.55, 0.55, 0.55],
    fontSet,
  })

  y = netBoxY - 12

  // ── INGRESOS ──
  y = drawSectionTitle(page, "Ingresos", left, y - 8, fontSet)

  const col1 = left + 4
  const col2 = left + 140
  const col3 = left + 300
  const col4 = right - 4

  y = drawTableHeader(page, [
    { label: "Concepto", x: col1 },
    { label: "Formula", x: col2 },
    { label: "Base legal", x: col3 },
    { label: "Monto", x: col4 },
  ], y, left, right, fontSet)

  for (const line of result.incomes) {
    y = drawTableRow(page, [
      { text: line.label, x: col1 },
      { text: line.formula, x: col2, size: 8 },
      { text: line.legalReference, x: col3, size: 8 },
      { text: money(line.amount, result.currency), x: col4, bold: true },
    ], y, left, right, fontSet)
  }

  y = y - 4
  drawText(page, `Total ingresos: ${money(result.grossIncome, result.currency)}`, right - 4, y, {
    size: 11,
    bold: true,
    align: "right",
    fontSet,
  })
  y -= 6
  drawLine(page, left, y, right, y, { color: [0.85, 0.85, 0.85], width: 0.5 })

  // ── DEDUCCIONES ──
  y = drawSectionTitle(page, "Deducciones", left, y - 8, fontSet)

  y = drawTableHeader(page, [
    { label: "Concepto", x: col1 },
    { label: "Formula", x: col2 },
    { label: "Base legal", x: col3 },
    { label: "Monto", x: col4 },
  ], y, left, right, fontSet)

  for (const line of result.deductions) {
    y = drawTableRow(page, [
      { text: line.label, x: col1 },
      { text: line.formula, x: col2, size: 8 },
      { text: line.legalReference, x: col3, size: 8 },
      { text: money(line.amount, result.currency), x: col4, bold: true },
    ], y, left, right, fontSet)
  }

  y = y - 4
  drawText(page, `Total deducciones: ${money(result.totalDeductions, result.currency)}`, right - 4, y, {
    size: 11,
    bold: true,
    align: "right",
    fontSet,
  })
  y -= 6
  drawLine(page, left, y, right, y, { color: [0.85, 0.85, 0.85], width: 0.5 })

  // ── FIRMAS ──
  y = drawSectionTitle(page, "Firmas", left, y - 8, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet)

  // ── FOOTER ──
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
