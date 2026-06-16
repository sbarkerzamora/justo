import { PDFDocument } from "pdf-lib"
import type { VacationInput, VacationResult } from "@justo/core"
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

  drawIcon(page, "◆", "VACACIONES", left, y, fontSet)
  y -= 24
  drawText(page, `${result.currency} · ${new Date(result.generatedAt).toLocaleString()})`, left, y, {
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
  y = drawKeyValue(page, "Dias gozados:", `${input.usedVacationDays} dias`, left, y, fontSet)

  y = drawSectionTitle(page, "Resultado", left, y - 4, fontSet, { compact: true })
  drawBox(page, left, y - 52, right - left, 48, { borderColor: COLORS.border, borderWidth: 1, fillColor: COLORS.white })
  drawText(page, "MONTO ESTIMADO", left + 16, y - 14, { size: 10, bold: true, fontSet })
  drawText(page, money(result.amount, result.currency), right - 16, y - 18, { size: 18, bold: true, color: [0.2, 0.4, 0.8], align: "right", fontSet })
  drawText(page, `Acumulados: ${result.accruedVacationDays} · Pendientes: ${result.pendingVacationDays} · Diario: ${money(result.dailySalary, result.currency)}`, left + 16, y - 30, {
    size: 8, color: COLORS.muted, fontSet,
  })
  y = y - 56

  y = drawSectionTitle(page, "Detalle", left, y - 4, fontSet, { compact: true })
  drawBox(page, left, y - 62, right - left, 58, { fillColor: COLORS.bg })
  drawText(page, "Formula aplicada", left + 8, y - 10, { size: 9, color: COLORS.muted, fontSet })
  drawText(page, result.formula, left + 8, y - 24, { size: 9, bold: true, fontSet })
  drawText(page, "Referencia legal", left + 8, y - 40, { size: 9, color: COLORS.muted, fontSet })
  drawText(page, result.legalReference, left + 8, y - 54, { size: 8, fontSet })
  y = y - 66

  y = drawSectionTitle(page, "Firmas", left, y - 4, fontSet, { compact: true })
  y = drawSignatureBoxes(page, y, left, fontSet)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
