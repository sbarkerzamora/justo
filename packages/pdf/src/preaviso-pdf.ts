import { PDFDocument } from "pdf-lib"
import type { PreavisoInput, PreavisoResult } from "@justo/core"
import {
  loadFonts, drawText, drawBox, drawSectionTitle,
  drawHeader, drawKeyValue, drawSignatureBoxes, drawFooter,
  money, COLORS,
} from "./pdf-helpers"

export const buildPreavisoPdf = async (
  input: PreavisoInput,
  result: PreavisoResult,
) => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89])
  const fontSet = await loadFonts(pdf)

  const W = 595.28
  const H = 841.89
  const left = 40
  const right = W - 40
  let y = H - 36

  y = drawHeader(page, "Preaviso",
    `${result.currency} · ${new Date(result.generatedAt).toLocaleString()} · Corpus: ${result.legalCorpusVersion}`,
    left, y, fontSet)

  y = drawSectionTitle(page, "Datos del caso", left, y, fontSet)
  y = drawKeyValue(page, "Salario mensual", money(input.monthlySalary, result.currency), left, y, fontSet)
  y = drawKeyValue(page, "Antiguedad", `${input.tenureYears} anos`, left, y, fontSet)
  y = drawKeyValue(page, "Aviso escrito", input.noticeGivenInWriting ? "Si" : "No", left, y, fontSet)
  y = drawKeyValue(page, "Sustitucion en dinero", input.replaceNoticeWithPayment ? "Si" : "No", left, y, fontSet)

  y = drawSectionTitle(page, "Resultado", left, y - 2, fontSet)
  drawBox(page, left, y - 36, right - left, 34, { borderColor: COLORS.border, borderWidth: 1, fillColor: COLORS.white })
  drawText(page, "Monto estimado", left + 12, y - 10, { size: 9, bold: true, fontSet })
  drawText(page, money(result.noticeAmount, result.currency), right - 12, y - 16, { size: 16, bold: true, align: "right", fontSet })
  drawText(page, `Dias de aviso: ${result.noticeDays}`, left + 12, y - 24, { size: 7, color: COLORS.muted, fontSet })
  y = y - 40

  y = drawSectionTitle(page, "Detalle", left, y, fontSet)
  drawBox(page, left, y - 38, right - left, 34, { fillColor: COLORS.bg })
  drawText(page, "Dias de aviso segun ley", left + 8, y - 8, { size: 7, color: COLORS.muted, fontSet })
  drawText(page, `${result.noticeDays} dias`, left + 8, y - 20, { size: 8, bold: true, fontSet })
  if (result.hasSubstitutePayment) {
    drawText(page, "Con sustitucion en dinero", left + 8, y - 32, { size: 7, color: COLORS.muted, fontSet })
  }
  y = y - 44

  y = drawSectionTitle(page, "Fundamento legal", left, y, fontSet)
  drawText(page, result.legalReference, left, y - 2, { size: 8, fontSet })

  if (result.calculationNote) {
    y -= 14
    drawText(page, `Nota: ${result.calculationNote}`, left, y - 2, { size: 7, color: COLORS.muted, fontSet })
  }

  y = drawSectionTitle(page, "Firmas", left, y - 4, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
