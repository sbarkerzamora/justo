import { PDFDocument } from "pdf-lib"
import type { TerminationInput, TerminationResult } from "@justo/core"
import {
  loadFonts, drawSectionTitle, drawHeader, drawSignatureBoxes,
  drawFooter, drawBreakdownItem, drawPageBreakIfNeeded,
  drawStackedKeyValues, drawSummaryCard, money,
} from "./pdf-helpers"

const scenarioLabel = (type: string): string => {
  const labels: Record<string, string> = {
    renuncia: "Renuncia voluntaria",
    despido_justificado: "Despido justificado",
    despido_injustificado: "Despido injustificado",
    mutuo_acuerdo: "Mutuo acuerdo",
  }
  return labels[type] ?? type
}

export const buildTerminationPdf = async (
  input: TerminationInput,
  result: TerminationResult,
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

  y = drawHeader(page, "Terminacion", headerSub, left, y, fontSet)

  const drawNewPageHeader = (nextPage: typeof page) =>
    drawHeader(nextPage, "Terminacion", headerSub, left, H - 36, fontSet)

  y = drawSectionTitle(page, "Datos del caso", left, y, fontSet)
  y = drawStackedKeyValues(page, [
    { label: "Salario mensual", value: money(input.monthlySalary, result.currency) },
    { label: "Periodo", value: `${input.startDate} -> ${input.endDate}` },
    { label: "Antiguedad", value: `${result.tenureYears} anos (${result.tenureDays} dias)` },
    { label: "Causa", value: scenarioLabel(input.terminationCause) },
  ], left, y, fontSet)

  const applicableScenarios = result.scenarios.filter((s) => s.applicable)
  for (const scenario of applicableScenarios) {
    ;({ page, y } = drawPageBreakIfNeeded(pdf, page, y, 150, drawNewPageHeader))
    y = drawSectionTitle(page, scenarioLabel(scenario.type), left, y - 2, fontSet)
    y = drawSummaryCard(page, "Monto estimado", money(scenario.total, result.currency), [], left, right, y, fontSet)

    if (scenario.lines.length > 0) {
      for (const line of scenario.lines) {
        ;({ page, y } = drawPageBreakIfNeeded(pdf, page, y, 120, drawNewPageHeader))
        y = drawBreakdownItem(page, {
          label: line.label,
          amount: money(line.amount, result.currency),
          formula: line.formula,
          legalReference: line.legalReference,
        }, left, right, y, fontSet)
      }
    }

    if (scenario.note) {
      y = drawBreakdownItem(page, { label: "Nota", note: scenario.note }, left, right, y, fontSet)
    }
  }

  ;({ page, y } = drawPageBreakIfNeeded(pdf, page, y, 150, drawNewPageHeader))
  y = drawSectionTitle(page, "Firmas", left, y - 2, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet, right)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
