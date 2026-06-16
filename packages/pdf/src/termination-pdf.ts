import { PDFDocument } from "pdf-lib"
import type { TerminationInput, TerminationResult } from "@justo/core"
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
  const left = 48
  const right = W - 48
  let y = H - 48

  drawIcon(page, "◆", "TERMINACION", left, y, fontSet)
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
  drawBox(page, left, y - 64, right - left, 62, { fillColor: COLORS.bg })
  y -= 4
  y = drawKeyValue(page, "Salario mensual:", money(input.monthlySalary, result.currency), left, y, fontSet)
  y = drawKeyValue(page, "Periodo:", `${input.startDate} → ${input.endDate}`, left, y, fontSet)
  y = drawKeyValue(page, "Antiguedad:", `${result.tenureYears} anos (${result.tenureDays} dias)`, left, y, fontSet)
  y = drawKeyValue(page, "Salario diario:", money(result.dailySalary, result.currency), left, y, fontSet)

  const applicableScenarios = result.scenarios.filter((s) => s.applicable)
  for (const scenario of applicableScenarios) {
    y = drawSectionTitle(page, scenarioLabel(scenario.type), left, y - 4, fontSet, { compact: true })
    drawBox(page, left, y - 46, right - left, 42, { borderColor: COLORS.border, borderWidth: 1, fillColor: COLORS.white })
    drawText(page, "MONTO ESTIMADO", left + 16, y - 16, { size: 10, bold: true, fontSet })
    drawText(page, money(scenario.total, result.currency), right - 16, y - 22, {
      size: 18, bold: true, color: [0.2, 0.4, 0.8], align: "right", fontSet,
    })
    y = y - 50

    if (scenario.lines.length > 0) {
      for (const line of scenario.lines) {
        drawBox(page, left, y - 42, right - left, 40, { fillColor: COLORS.bg })
        drawText(page, line.label, left + 4, y - 10, { size: 9, bold: true, fontSet })
        drawText(page, money(line.amount, result.currency), right - 4, y - 10, {
          size: 9, bold: true, align: "right", fontSet,
        })
        drawText(page, line.formula, left + 4, y - 24, { size: 7, color: COLORS.muted, fontSet })
        drawText(page, line.legalReference, left + 4, y - 36, { size: 7, color: COLORS.muted, fontSet })
        y -= 44
      }
    }

    if (scenario.note) {
      drawBox(page, left, y - 30, right - left, 28, { fillColor: COLORS.bg })
      drawText(page, `Nota: ${scenario.note}`, left + 8, y - 12, { size: 8, color: COLORS.muted, fontSet })
      y -= 34
    }
  }

  y = drawSectionTitle(page, "Firmas", left, y - 4, fontSet, { compact: true })
  y = drawSignatureBoxes(page, y, left, fontSet)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
