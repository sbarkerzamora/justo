import { PDFDocument } from "pdf-lib"
import type { BonusInput, BonusResult } from "@justo/core"
import {
  loadFonts, drawText, drawSectionTitle, drawHeader,
  drawSignatureBoxes, drawFooter, drawBreakdownItem,
  drawStackedKeyValues, drawSummaryCard, money, COLORS,
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
  y = drawStackedKeyValues(page, [
    { label: "Salario mensual", value: money(input.monthlySalary, result.currency) },
    { label: "Periodo", value: `${input.startDate} -> ${input.endDate}` },
    { label: "Dias del periodo", value: `${result.periodDays} dias` },
  ], left, y, fontSet)

  y = drawSectionTitle(page, "Resultado", left, y - 2, fontSet)
  y = drawSummaryCard(page, result.supported ? "Monto estimado" : "Monto (fallback)", money(result.total, result.currency), [], left, right, y, fontSet)
  if (result.fallbackReason) {
    drawText(page, result.fallbackReason, left, y - 2, { size: 7, fontSet })
    y -= 14
  }

  y = drawSectionTitle(page, "Detalle", left, y, fontSet)
  if (result.lines.length === 0) {
    drawText(page, "No hay lineas de calculo disponibles.", left, y - 2, { size: 8, color: COLORS.muted, fontSet })
    y -= 14
  } else {
    for (const line of result.lines) {
      y = drawBreakdownItem(page, {
        label: line.label,
        amount: money(line.amount, result.currency),
        formula: line.formula,
        legalReference: line.legalReference,
      }, left, right, y, fontSet)
    }
  }

  y = drawSectionTitle(page, "Firmas", left, y - 2, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet, right)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
