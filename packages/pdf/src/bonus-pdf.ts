import { PDFDocument } from "pdf-lib"
import type { BonusInput, BonusResult } from "@justo/core"
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

export const buildBonusPdf = async (input: BonusInput, result: BonusResult) => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89])
  const fontSet = await loadFonts(pdf)

  const W = 595.28
  const H = 841.89
  const left = 48
  const right = W - 48
  let y = H - 48

  drawIcon(page, "◆", "AGUINALDO", left, y, fontSet)
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
  drawBox(page, left, y - 56, right - left, 54, { fillColor: COLORS.bg })
  y -= 4
  y = drawKeyValue(page, "Salario mensual:", money(input.monthlySalary, result.currency), left, y, fontSet)
  y = drawKeyValue(page, "Periodo:", `${input.startDate} → ${input.endDate}`, left, y, fontSet)
  y = drawKeyValue(page, "Dias del periodo:", `${result.periodDays} dias`, left, y, fontSet)

  y = drawSectionTitle(page, "Resultado", left, y - 4, fontSet, { compact: true })
  const rH = result.supported ? 48 : 64
  drawBox(page, left, y - rH, right - left, rH, { borderColor: COLORS.border, borderWidth: 1, fillColor: COLORS.white })
  drawText(page, result.supported ? "MONTO ESTIMADO" : "FALLBACK", left + 16, y - rH + 18, {
    size: 10, bold: true, fontSet,
  })
  drawText(page, money(result.total, result.currency), right - 16, y - rH + 12, {
    size: 18, bold: true, color: [0.2, 0.4, 0.8], align: "right", fontSet,
  })
  if (result.fallbackReason) {
    drawText(page, result.fallbackReason, left + 16, y - rH + rH - 12, {
      size: 8, color: COLORS.muted, fontSet,
    })
  }
  y = y - rH - 6

  y = drawSectionTitle(page, "Detalle", left, y - 4, fontSet, { compact: true })
  if (result.lines.length === 0) {
    drawText(page, "No hay lineas de calculo disponibles.", left, y - 4, { size: 9, color: COLORS.muted, fontSet })
  } else {
    for (const line of result.lines) {
      drawBox(page, left, y - 44, right - left, 42, { fillColor: y % 2 === 0 ? COLORS.bg : COLORS.white })
      drawText(page, line.label, left + 4, y - 10, { size: 9, bold: true, fontSet })
      drawText(page, money(line.amount, result.currency), right - 4, y - 10, {
        size: 9, bold: true, align: "right", fontSet,
      })
      drawText(page, line.formula, left + 4, y - 24, { size: 7, color: COLORS.muted, fontSet })
      drawText(page, line.legalReference, left + 4, y - 36, { size: 7, color: COLORS.muted, fontSet })
      y -= 46
    }
  }

  y = drawSectionTitle(page, "Firmas", left, y - 4, fontSet, { compact: true })
  y = drawSignatureBoxes(page, y, left, fontSet)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
