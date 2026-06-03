import { PDFDocument } from "pdf-lib"
import type { TerminationInput, TerminationResult } from "@justo/core"
import {
  loadFonts,
  drawText,
  drawLine,
  drawBox,
  drawSectionTitle,
  drawKeyValue,
  drawSignatureBoxes,
  drawFooter,
} from "./pdf-helpers"

const currencyLocaleMap: Record<string, string> = {
  NIO: "es-NI",
  USD: "es-SV",
  GTQ: "es-GT",
  HNL: "es-HN",
  CRC: "es-CR",
  MXN: "es-MX",
  COP: "es-CO",
  PEN: "es-PE",
  ARS: "es-AR",
  CLP: "es-CL",
}

const currencyFormatters: Record<string, Intl.NumberFormat> =
  Object.fromEntries(
    Object.entries(currencyLocaleMap).map(([curr, locale]) => [
      curr,
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: curr,
        minimumFractionDigits: 2,
      }),
    ]),
  )

const money = (amount: number, currencyCode: string) =>
  (currencyFormatters[currencyCode] ?? currencyFormatters.NIO).format(amount)

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

  drawText(page, "SIMULADOR DE TERMINACION", left, y, {
    size: 22,
    bold: true,
    fontSet,
  })
  y -= 32
  drawText(
    page,
    `Reporte generado automaticamente · ${result.currency}`,
    left,
    y,
    { size: 10, color: [0.55, 0.55, 0.55], fontSet },
  )

  const dateStr = new Date(result.generatedAt).toLocaleString(
    currencyLocaleMap[result.currency] ?? "es-NI",
  )
  drawText(page, dateStr, right, y + 16, {
    size: 9,
    color: [0.55, 0.55, 0.55],
    align: "right",
    fontSet,
  })
  drawText(
    page,
    `Corpus: ${result.legalCorpusVersion}`,
    right,
    y,
    { size: 9, color: [0.55, 0.55, 0.55], align: "right", fontSet },
  )

  y -= 12
  drawLine(page, left, y, right, y, { color: [0.1, 0.1, 0.1], width: 1 })

  y = drawSectionTitle(page, "Datos del caso", left, y - 12, fontSet)
  const cardY = y + 4
  const cardH = 88
  drawBox(page, left - 4, cardY - cardH + 4, right - left + 8, cardH, {
    borderColor: [0.85, 0.85, 0.85],
    borderWidth: 1,
    fillColor: [0.98, 0.98, 0.98],
  })
  y = cardY - 10
  y = drawKeyValue(
    page,
    "Salario mensual:",
    money(input.monthlySalary, result.currency),
    left,
    y,
    fontSet,
  )
  y = drawKeyValue(
    page,
    "Periodo:",
    `${input.startDate} -> ${input.endDate}`,
    left,
    y,
    fontSet,
  )
  y = drawKeyValue(
    page,
    "Antiguedad:",
    `${result.tenureYears} anos (${result.tenureDays} dias)`,
    left,
    y,
    fontSet,
  )
  y = drawKeyValue(
    page,
    "Salario diario:",
    money(result.dailySalary, result.currency),
    left,
    y,
    fontSet,
  )
  y -= 4

  const applicableScenarios = result.scenarios.filter((s) => s.applicable)

  for (const scenario of applicableScenarios) {
    y = drawSectionTitle(
      page,
      scenarioLabel(scenario.type),
      left,
      y - 8,
      fontSet,
    )

    const resultBoxH = 48
    drawBox(page, left, y - resultBoxH, right - left, resultBoxH, {
      borderColor: [0.1, 0.1, 0.1],
      borderWidth: 1.5,
      fillColor: [1, 1, 1],
    })
    drawText(
      page,
      "MONTO ESTIMADO",
      left + 16,
      y - resultBoxH + 18,
      { size: 11, bold: true, fontSet },
    )
    drawText(
      page,
      money(scenario.total, result.currency),
      right - 16,
      y - resultBoxH + 12,
      { size: 20, bold: true, align: "right", fontSet },
    )
    y = y - resultBoxH - 8

    if (scenario.lines.length > 0) {
      y = drawSectionTitle(page, "Detalle", left, y - 8, fontSet)
      for (const line of scenario.lines) {
        const lineH = 56
        drawBox(page, left - 4, y - lineH, right - left + 8, lineH, {
          borderColor: [0.85, 0.85, 0.85],
          borderWidth: 1,
          fillColor: [0.98, 0.98, 0.98],
        })
        drawText(page, line.label, left, y - 14, {
          size: 10,
          bold: true,
          fontSet,
        })
        drawText(
          page,
          money(line.amount, result.currency),
          right,
          y - 14,
          { size: 10, bold: true, align: "right", fontSet },
        )
        drawText(page, line.formula, left, y - 30, {
          size: 8,
          color: [0.55, 0.55, 0.55],
          fontSet,
        })
        drawText(page, line.legalReference, left, y - 44, {
          size: 8,
          color: [0.55, 0.55, 0.55],
          fontSet,
        })
        y -= lineH + 4
      }
    }

    if (scenario.note) {
      drawBox(page, left, y - 36, right - left, 34, {
        borderColor: [0.65, 0.65, 0.65],
        borderWidth: 1,
        fillColor: [0.98, 0.98, 0.98],
      })
      drawText(page, "Nota:", left + 8, y - 14, {
        size: 9,
        bold: true,
        color: [0.55, 0.55, 0.55],
        fontSet,
      })
      drawText(page, scenario.note, left + 48, y - 14, {
        size: 9,
        color: [0.55, 0.55, 0.55],
        fontSet,
      })
      y -= 40
    }
  }

  y = drawSectionTitle(page, "Firmas", left, y - 8, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
