import { PDFDocument } from "pdf-lib"
import type { VacationInput, VacationResult } from "@justo/core"
import {
  loadFonts, drawText, drawLine, drawBox, drawSectionTitle,
  drawHeader, drawKeyValue, drawSignatureBoxes, drawFooter,
  money, COLORS,
} from "./pdf-helpers"

export const buildVacationsPdf = async (
  input: VacationInput,
  result: VacationResult,
) => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89])
  const fontSet = await loadFonts(pdf)

  const W = 595.28
  const H = 841.89
  const left = 40
  const right = W - 40
  let y = H - 36

  y = drawHeader(page, "Vacaciones",
    `${result.currency} · ${new Date(result.generatedAt).toLocaleString()} · Corpus: ${result.legalCorpusVersion}`,
    left, y, fontSet)

  y = drawSectionTitle(page, "Datos del caso", left, y, fontSet)
  y = drawKeyValue(page, "Salario mensual", money(input.monthlySalary, result.currency), left, y, fontSet)
  y = drawKeyValue(page, "Periodo", `${input.startDate} → ${input.endDate}`, left, y, fontSet)
  y = drawKeyValue(page, "Dias gozados", `${input.usedVacationDays} dias`, left, y, fontSet)

  y = drawSectionTitle(page, "Resultado", left, y - 2, fontSet)
  drawBox(page, left, y - 36, right - left, 34, { borderColor: COLORS.border, borderWidth: 1, fillColor: COLORS.white })
  drawText(page, "Monto estimado", left + 12, y - 10, { size: 9, bold: true, fontSet })
  drawText(page, money(result.amount, result.currency), right - 12, y - 16, { size: 16, bold: true, align: "right", fontSet })
  drawText(page, `Acumulados: ${result.accruedVacationDays} · Pendientes: ${result.pendingVacationDays} · Diario: ${money(result.dailySalary, result.currency)}`, left + 12, y - 24, {
    size: 7, color: COLORS.muted, fontSet,
  })
  y = y - 40

  y = drawSectionTitle(page, "Detalle", left, y, fontSet)
  drawBox(page, left, y - 52, right - left, 48, { fillColor: COLORS.bg })
  drawText(page, "Formula", left + 8, y - 8, { size: 7, color: COLORS.muted, fontSet })
  drawText(page, result.formula, left + 8, y - 20, { size: 8, bold: true, fontSet })
  drawText(page, "Referencia legal", left + 8, y - 34, { size: 7, color: COLORS.muted, fontSet })
  drawText(page, result.legalReference, left + 8, y - 46, { size: 7, fontSet })
  y = y - 56

  y = drawSectionTitle(page, "Firmas", left, y, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
