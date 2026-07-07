import { PDFDocument } from "pdf-lib"
import type { SettlementInput, SettlementResult } from "@justo/core"
import {
  loadFonts, drawSectionTitle, drawHeader, drawSignatureBoxes,
  drawFooter, drawBreakdownItem, drawPageBreakIfNeeded,
  drawStackedKeyValues, drawSummaryCard, money,
} from "./pdf-helpers"

export const buildSettlementPdf = async (
  input: SettlementInput,
  result: SettlementResult,
) => {
  const pdf = await PDFDocument.create()
  let page = pdf.addPage([595.28, 841.89])
  const fontSet = await loadFonts(pdf)

  const W = 595.28
  const H = 841.89
  const left = 40
  const right = W - 40
  let y = H - 36

  const headerSub = `${result.currency} · ${new Date(result.generatedAt).toLocaleString("es-NI")} · Corpus: ${result.legalCorpusVersion}`
  const drawNewPageHeader = (nextPage: typeof page) =>
    drawHeader(nextPage, "Liquidacion Laboral", headerSub, left, H - 36, fontSet)

  y = drawNewPageHeader(page)

  y = drawSectionTitle(page, "Datos del caso", left, y, fontSet)
  y = drawStackedKeyValues(page, [
    { label: "Trabajador", value: input.employeeName },
    { label: "Empleador", value: input.employerName },
    { label: "Salario mensual", value: money(input.monthlySalary, result.currency) },
    { label: "Antiguedad", value: result.tenureText },
  ], left, y, fontSet)

  y = drawSectionTitle(page, "Resultado", left, y, fontSet)
  y = drawSummaryCard(page, "Neto a recibir", money(result.netTotal, result.currency), [
    { label: "Ingresos", value: money(result.grossIncome, result.currency) },
    { label: "Deducciones", value: money(result.totalDeductions, result.currency) },
  ], left, right, y, fontSet)

  if (result.warnings?.length) {
    ;({ page, y } = drawPageBreakIfNeeded(pdf, page, y, 120, drawNewPageHeader))
    y = drawSectionTitle(page, "Aviso de verificacion", left, y, fontSet)
    for (const warning of result.warnings) {
      y = drawBreakdownItem(
        page,
        { label: "Base legal documentada", note: warning },
        left,
        right,
        y,
        fontSet,
      )
    }
  }

  y = drawSectionTitle(page, "Ingresos", left, y, fontSet)
  for (const line of result.incomes) {
    ;({ page, y } = drawPageBreakIfNeeded(pdf, page, y, 120, drawNewPageHeader))
    y = drawBreakdownItem(page, {
      label: line.label,
      amount: money(line.amount, result.currency),
      formula: line.formula,
      legalReference: line.legalReference,
    }, left, right, y, fontSet)
  }

  y = drawSectionTitle(page, "Deducciones", left, y, fontSet)
  for (const line of result.deductions) {
    ;({ page, y } = drawPageBreakIfNeeded(pdf, page, y, 120, drawNewPageHeader))
    y = drawBreakdownItem(page, {
      label: line.label,
      amount: money(line.amount, result.currency),
      formula: line.formula,
      legalReference: line.legalReference,
    }, left, right, y, fontSet)
  }

  ;({ page, y } = drawPageBreakIfNeeded(pdf, page, y, 150, drawNewPageHeader))
  y = drawSectionTitle(page, "Firmas", left, y, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet, right)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
