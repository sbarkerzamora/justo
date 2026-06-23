import { PDFDocument } from "pdf-lib"
import type { TerminationInput, TerminationResult } from "@justo/core"
import {
  loadFonts, drawText, drawLine, drawBox, drawSectionTitle,
  drawHeader, drawKeyValue, drawSignatureBoxes, drawFooter,
  money, COLORS,
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
  const page = pdf.addPage([595.28, 841.89])
  const fontSet = await loadFonts(pdf)

  const W = 595.28
  const H = 841.89
  const left = 40
  const right = W - 40
  let y = H - 36

  y = drawHeader(page, "Terminacion",
    `${result.currency} · ${new Date(result.generatedAt).toLocaleString()} · Corpus: ${result.legalCorpusVersion}`,
    left, y, fontSet)

  y = drawSectionTitle(page, "Datos del caso", left, y, fontSet)
  y = drawKeyValue(page, "Salario mensual", money(input.monthlySalary, result.currency), left, y, fontSet)
  y = drawKeyValue(page, "Periodo", `${input.startDate} → ${input.endDate}`, left, y, fontSet)
  y = drawKeyValue(page, "Antiguedad", `${result.tenureYears} anos (${result.tenureDays} dias)`, left, y, fontSet)
  y = drawKeyValue(page, "Causa", scenarioLabel(input.terminationCause), left, y, fontSet)

  const applicableScenarios = result.scenarios.filter((s) => s.applicable)
  for (const scenario of applicableScenarios) {
    y = drawSectionTitle(page, scenarioLabel(scenario.type), left, y - 2, fontSet)
    drawBox(page, left, y - 32, right - left, 30, { borderColor: COLORS.border, borderWidth: 1, fillColor: COLORS.white })
    drawText(page, "Monto estimado", left + 12, y - 12, { size: 9, bold: true, fontSet })
    drawText(page, money(scenario.total, result.currency), right - 12, y - 18, {
      size: 16, bold: true, align: "right", fontSet,
    })
    y = y - 36

    if (scenario.lines.length > 0) {
      for (const line of scenario.lines) {
        drawBox(page, left, y - 30, right - left, 28, { fillColor: COLORS.bg })
        drawText(page, line.label, left + 4, y - 8, { size: 8, bold: true, fontSet })
        drawText(page, money(line.amount, result.currency), right - 4, y - 8, {
          size: 8, bold: true, align: "right", fontSet,
        })
        drawText(page, line.formula, left + 4, y - 18, { size: 7, color: COLORS.muted, fontSet })
        drawText(page, line.legalReference, left + 4, y - 26, { size: 7, color: COLORS.muted, fontSet })
        y -= 32
      }
    }

    if (scenario.note) {
      drawBox(page, left, y - 24, right - left, 22, { fillColor: COLORS.bg })
      drawText(page, `Nota: ${scenario.note}`, left + 8, y - 10, { size: 7, color: COLORS.muted, fontSet })
      y -= 28
    }
  }

  y = drawSectionTitle(page, "Firmas", left, y - 2, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
