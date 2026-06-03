import { PDFDocument } from "pdf-lib"
import type { SalaryNetInput, SalaryNetResult } from "@justo/core"
import {
  loadFonts,
  drawText,
  drawLine,
  drawBox,
  drawSectionTitle,
  drawKeyValue,
  drawSignatureBoxes,
  drawFooter,
  COLORS,
} from "./pdf-helpers"

const currencyLocaleMap: Record<string, string> = {
  NIO: "es-NI",
  USD: "es-SV",
  GTQ: "es-GT",
  HNL: "es-HN",
  CRC: "es-CR",
  MXN: "es-MX",
  COP: "es-CO",
  PEN: "es-PE",
  ARS: "es-AR",
  CLP: "es-CL",
}

const currencyFormatters: Record<string, Intl.NumberFormat> = Object.fromEntries(
  Object.entries(currencyLocaleMap).map(([curr, locale]) => [
    curr,
    new Intl.NumberFormat(locale, { style: "currency", currency: curr, minimumFractionDigits: 2 }),
  ]),
)

const money = (amount: number, currencyCode: string) =>
  (currencyFormatters[currencyCode] ?? currencyFormatters.NIO).format(amount)

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

  // ── HEADER ──
  drawText(page, "SALARIO NETO", left, y, { size: 24, bold: true, fontSet })
  y -= 32
  drawText(page, `Reporte generado automaticamente · ${result.currency}`, left, y, {
    size: 10,
    color: [0.55, 0.55, 0.55],
    fontSet,
  })

  const dateStr = new Date(result.generatedAt).toLocaleString(currencyLocaleMap[result.currency] ?? "es-NI")
  const corpusStr = `Corpus: ${result.legalCorpusVersion}`
  drawText(page, dateStr, right, y + 16, { size: 9, color: [0.55, 0.55, 0.55], align: "right", fontSet })
  drawText(page, corpusStr, right, y, { size: 9, color: [0.55, 0.55, 0.55], align: "right", fontSet })

  y -= 12
  drawLine(page, left, y, right, y, { color: [0.1, 0.1, 0.1], width: 1 })

  // ── DATOS DEL CASO ──
  y = drawSectionTitle(page, "Datos del caso", left, y - 12, fontSet)
  const cardY = y + 4
  const cardH = 54
  drawBox(page, left - 4, cardY - cardH + 4, right - left + 8, cardH, {
    borderColor: [0.85, 0.85, 0.85],
    borderWidth: 1,
    fillColor: [0.98, 0.98, 0.98],
  })
  y = cardY - 10
  y = drawKeyValue(page, "Salario bruto mensual:", money(result.grossSalary, result.currency), left, y, fontSet)
  y = drawKeyValue(page, "Frecuencia de pago:", input.frequency, left, y, fontSet)
  y -= 4

  // ── RESUMEN ──
  y = drawSectionTitle(page, "Resumen de deducciones", left, y - 8, fontSet)

  const tableLeft = left
  const colX = [tableLeft, tableLeft + 260, tableLeft + 360]
  const headerY = y - 4

  drawBox(page, tableLeft - 4, headerY - 20, right - tableLeft + 8, 20, {
    fillColor: [0.94, 0.94, 0.94],
  })
  drawText(page, "Concepto", colX[0]!, headerY - 2, { size: 9, bold: true, fontSet })
  drawText(page, "Formula", colX[1]!, headerY - 2, { size: 9, bold: true, fontSet })
  drawText(page, "Monto", colX[2]!, headerY - 2, { size: 9, bold: true, fontSet })

  let rowY = headerY - 20
  for (const deduction of result.deductions) {
    drawLine(page, tableLeft - 4, rowY - 16, right + 4, rowY - 16, {
      color: [0.9, 0.9, 0.9],
      width: 0.3,
    })
    drawText(page, deduction.label, colX[0]!, rowY - 2, { size: 9, fontSet })
    drawText(page, deduction.formula, colX[1]!, rowY - 2, { size: 8, fontSet })
    drawText(page, money(deduction.amount, result.currency), colX[2]!, rowY - 2, { size: 9, bold: true, fontSet })
    rowY -= 16
  }

  y = rowY - 8

  // ── RESULTADO NETO ──
  y = drawSectionTitle(page, "Salario neto", left, y - 8, fontSet)

  const netBoxH = 60
  const netBoxY = y - netBoxH
  drawBox(page, left, netBoxY, right - left, netBoxH, {
    borderColor: [0.1, 0.1, 0.1],
    borderWidth: 1.5,
    fillColor: [1, 1, 1],
  })

  drawText(page, "MENSUAL", left + 16, netBoxY + 38, { size: 10, color: [0.45, 0.45, 0.45], fontSet })
  drawText(page, money(result.netSalaryPerPeriod.mensual, result.currency), left + 16, netBoxY + 18, {
    size: 18, bold: true, fontSet,
  })

  drawText(page, "QUINCENAL", left + 180, netBoxY + 38, { size: 10, color: [0.45, 0.45, 0.45], fontSet })
  drawText(page, money(result.netSalaryPerPeriod.quincenal, result.currency), left + 180, netBoxY + 18, {
    size: 18, bold: true, fontSet,
  })

  drawText(page, "SEMANAL", left + 350, netBoxY + 38, { size: 10, color: [0.45, 0.45, 0.45], fontSet })
  drawText(page, money(result.netSalaryPerPeriod.semanal, result.currency), left + 350, netBoxY + 18, {
    size: 18, bold: true, fontSet,
  })

  y = netBoxY - 12

  // ── PIEZAS LEGALES ──
  y = drawSectionTitle(page, "Referencias legales", left, y - 8, fontSet)
  for (const deduction of result.deductions) {
    drawText(page, `- ${deduction.label}: ${deduction.legalReference}`, left, y - 4, {
      size: 9,
      color: [0.45, 0.45, 0.45],
      fontSet,
    })
    y -= 14
  }

  y -= 8

  // ── FIRMAS ──
  y = drawSectionTitle(page, "Firmas", left, y - 8, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet)

  // ── FOOTER ──
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
