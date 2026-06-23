import { PDFDocument } from "pdf-lib"
import type { BonusInput, BonusResult } from "@justo/core"
import {
  loadFonts, drawText, drawLine, drawBox, drawSectionTitle,
  drawHeader, drawKeyValue, drawSignatureBoxes, drawFooter,
  money, COLORS,
} from "./pdf-helpers"

export const buildBonusPdf = async (input: BonusInput, result: BonusResult) => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89])
  const fontSet = await loadFonts(pdf)

  const W = 595.28
  const H = 841.89
  const left = 40
  const right = W - 40
  let y = H - 36

  y = drawHeader(page, "Aguinaldo",
    `${result.currency} · ${new Date(result.generatedAt).toLocaleString()} · Corpus: ${result.legalCorpusVersion}`,
    left, y, fontSet)

  y = drawSectionTitle(page, "Datos del caso", left, y, fontSet)
  y = drawKeyValue(page, "Salario mensual", money(input.monthlySalary, result.currency), left, y, fontSet)
  y = drawKeyValue(page, "Periodo", `${input.startDate} → ${input.endDate}`, left, y, fontSet)
  y = drawKeyValue(page, "Dias del periodo", `${result.periodDays} dias`, left, y, fontSet)

  y = drawSectionTitle(page, "Resultado", left, y - 2, fontSet)
  const rH = result.supported ? 36 : 50
  drawBox(page, left, y - rH, right - left, rH, { borderColor: COLORS.border, borderWidth: 1, fillColor: COLORS.white })
  drawText(page, result.supported ? "Monto estimado" : "Monto (fallback)", left + 12, y - rH + rH - 14, {
    size: 9, bold: true, fontSet,
  })
  drawText(page, money(result.total, result.currency), right - 12, y - rH + rH - 20, {
    size: 16, bold: true, align: "right", fontSet,
  })
  if (result.fallbackReason) {
    drawText(page, result.fallbackReason, left + 12, y - rH + 6, {
      size: 7, color: COLORS.muted, fontSet,
    })
  }
  y = y - rH - 4

  y = drawSectionTitle(page, "Detalle", left, y, fontSet)
  if (result.lines.length === 0) {
    drawText(page, "No hay lineas de calculo disponibles.", left, y - 2, { size: 8, color: COLORS.muted, fontSet })
    y -= 14
  } else {
    for (const line of result.lines) {
      drawBox(page, left, y - 34, right - left, 32, { fillColor: COLORS.bg })
      drawText(page, line.label, left + 4, y - 8, { size: 8, bold: true, fontSet })
      drawText(page, money(line.amount, result.currency), right - 4, y - 8, {
        size: 8, bold: true, align: "right", fontSet,
      })
      drawText(page, line.formula, left + 4, y - 18, { size: 7, color: COLORS.muted, fontSet })
      drawText(page, line.legalReference, left + 4, y - 28, { size: 7, color: COLORS.muted, fontSet })
      y -= 36
    }
  }

  y = drawSectionTitle(page, "Firmas", left, y - 2, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
