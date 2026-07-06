import { PDFDocument } from "pdf-lib"
import type { PreavisoInput, PreavisoResult } from "@justo/core"
import {
  loadFonts, drawText, drawSectionTitle, drawHeader,
  drawSignatureBoxes, drawFooter, drawBreakdownItem,
  drawPageBreakIfNeeded, drawStackedKeyValues,
  drawSummaryCard, money, COLORS,
} from "./pdf-helpers"

export const buildPreavisoPdf = async (
  input: PreavisoInput,
  result: PreavisoResult,
) => {
  const pdf = await PDFDocument.create()
  let page = pdf.addPage([595.28, 841.89])
  const fontSet = await loadFonts(pdf)

  const W = 595.28
  const H = 841.89
  const left = 40
  const right = W - 40
  let y = H - 36

  const headerSub = `${result.currency} · ${new Date(result.generatedAt).toLocaleString()} · Corpus: ${result.legalCorpusVersion}`

  y = drawHeader(page, "Preaviso", headerSub, left, y, fontSet)

  const drawNewPageHeader = (nextPage: typeof page) =>
    drawHeader(nextPage, "Preaviso", headerSub, left, H - 36, fontSet)

  y = drawSectionTitle(page, "Datos del caso", left, y, fontSet)
  y = drawStackedKeyValues(page, [
    { label: "Salario mensual", value: money(input.monthlySalary, result.currency) },
    { label: "Antiguedad", value: `${input.tenureYears} anos` },
    { label: "Aviso escrito", value: input.noticeGivenInWriting ? "Si" : "No" },
    { label: "Sustitucion en dinero", value: input.replaceNoticeWithPayment ? "Si" : "No" },
  ], left, y, fontSet)

  y = drawSectionTitle(page, "Resultado", left, y - 2, fontSet)
  y = drawSummaryCard(page, "Monto estimado", money(result.noticeAmount, result.currency), [
    { label: "Dias de aviso", value: String(result.noticeDays) },
  ], left, right, y, fontSet)

  y = drawSectionTitle(page, "Detalle", left, y, fontSet)
  y = drawBreakdownItem(page, {
    label: "Dias de aviso segun ley",
    amount: `${result.noticeDays} dias`,
    note: result.hasSubstitutePayment ? "Con sustitucion en dinero" : undefined,
  }, left, right, y, fontSet)

  y = drawSectionTitle(page, "Fundamento legal", left, y, fontSet)
  drawText(page, result.legalReference, left, y - 2, { size: 8, fontSet })

  if (result.calculationNote) {
    y -= 14
    drawText(page, `Nota: ${result.calculationNote}`, left, y - 2, { size: 7, color: COLORS.muted, fontSet })
  }

  ;({ page, y } = drawPageBreakIfNeeded(pdf, page, y, 150, drawNewPageHeader))
  y = drawSectionTitle(page, "Firmas", left, y - 4, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet, right)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
