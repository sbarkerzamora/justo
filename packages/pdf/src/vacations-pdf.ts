import { PDFDocument } from "pdf-lib"
import type { VacationInput, VacationResult } from "@justo/core"
import {
  loadFonts,
  drawText,
  drawLine,
  drawBox,
  drawSectionTitle,
  drawKeyValue,
  drawSignatureBoxes,
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

export const buildVacationsPdf = async (
  input: VacationInput,
  result: VacationResult,
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
  drawText(page, "VACACIONES", left, y, { size: 24, bold: true, fontSet })
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
  const cardH = 72
  drawBox(page, left - 4, cardY - cardH + 4, right - left + 8, cardH, {
    borderColor: [0.85, 0.85, 0.85],
    borderWidth: 1,
    fillColor: [0.98, 0.98, 0.98],
  })
  y = cardY - 10
  y = drawKeyValue(page, "Salario mensual:", money(input.monthlySalary, result.currency), left, y, fontSet)
  y = drawKeyValue(page, "Periodo:", `${input.startDate} -> ${input.endDate}`, left, y, fontSet)
  y = drawKeyValue(page, "Dias gozados:", `${input.usedVacationDays} dias`, left, y, fontSet)
  y -= 4

  // ── RESULTADO ──
  y = drawSectionTitle(page, "Resultado", left, y - 8, fontSet)

  const netBoxH = 56
  const netBoxY = y - netBoxH
  drawBox(page, left, netBoxY, right - left, netBoxH, {
    borderColor: [0.1, 0.1, 0.1],
    borderWidth: 1.5,
    fillColor: [1, 1, 1],
  })
  drawText(page, "MONTO ESTIMADO", left + 16, netBoxY + 34, { size: 11, bold: true, fontSet })
  const amountStr = money(result.amount, result.currency)
  drawText(page, amountStr, right - 16, netBoxY + 28, { size: 20, bold: true, align: "right", fontSet })

  drawText(page, `Dias acumulados: ${result.accruedVacationDays}`, left + 16, netBoxY + 10, {
    size: 9,
    color: [0.55, 0.55, 0.55],
    fontSet,
  })
  drawText(page, `Dias pendientes: ${result.pendingVacationDays}`, left + 220, netBoxY + 10, {
    size: 9,
    color: [0.55, 0.55, 0.55],
    fontSet,
  })
  drawText(page, `Salario diario: ${money(result.dailySalary, result.currency)}`, left + 380, netBoxY + 10, {
    size: 9,
    color: [0.55, 0.55, 0.55],
    fontSet,
  })

  y = netBoxY - 12

  // ── DETALLE ──
  y = drawSectionTitle(page, "Detalle", left, y - 8, fontSet)

  const detailCardH = 80
  const detailCardY = y - detailCardH
  drawBox(page, left - 4, detailCardY + 4, right - left + 8, detailCardH, {
    borderColor: [0.85, 0.85, 0.85],
    borderWidth: 1,
    fillColor: [0.98, 0.98, 0.98],
  })

  drawText(page, "Formula aplicada", left, detailCardY + detailCardH - 14, {
    size: 10,
    color: [0.45, 0.45, 0.45],
    fontSet,
  })
  drawText(page, result.formula, left, detailCardY + detailCardH - 32, {
    size: 10,
    bold: true,
    fontSet,
  })

  drawText(page, "Referencia legal", left, detailCardY + detailCardH - 52, {
    size: 10,
    color: [0.45, 0.45, 0.45],
    fontSet,
  })
  drawText(page, result.legalReference, left, detailCardY + detailCardH - 68, {
    size: 9,
    fontSet,
  })

  y = detailCardY - 12

  // ── FIRMAS ──
  y = drawSectionTitle(page, "Firmas", left, y - 8, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet)

  // ── FOOTER ──
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
