import { PDFDocument } from "pdf-lib"
import type { BonusInput, BonusResult } from "@justo/core"
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

const currencyFormatters: Record<string, Intl.NumberFormat> = Object.fromEntries(
  Object.entries(currencyLocaleMap).map(([curr, locale]) => [
    curr,
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 2,
    }),
  ])
)

const money = (amount: number, currencyCode: string) =>
  (currencyFormatters[currencyCode] ?? currencyFormatters.NIO).format(amount)

export const buildBonusPdf = async (input: BonusInput, result: BonusResult) => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89])
  const fontSet = await loadFonts(pdf)

  const W = 595.28
  const H = 841.89
  const left = 48
  const right = W - 48
  let y = H - 48

  drawText(page, "AGUINALDO / DECIMO / BONO", left, y, {
    size: 22,
    bold: true,
    fontSet,
  })
  y -= 32
  drawText(page, `Reporte generado automaticamente · ${result.currency}`, left, y, {
    size: 10,
    color: [0.55, 0.55, 0.55],
    fontSet,
  })

  const dateStr = new Date(result.generatedAt).toLocaleString(
    currencyLocaleMap[result.currency] ?? "es-NI"
  )
  drawText(page, dateStr, right, y + 16, {
    size: 9,
    color: [0.55, 0.55, 0.55],
    align: "right",
    fontSet,
  })
  drawText(page, `Corpus: ${result.legalCorpusVersion}`, right, y, {
    size: 9,
    color: [0.55, 0.55, 0.55],
    align: "right",
    fontSet,
  })

  y -= 12
  drawLine(page, left, y, right, y, { color: [0.1, 0.1, 0.1], width: 1 })

  y = drawSectionTitle(page, "Datos del caso", left, y - 12, fontSet)
  const cardY = y + 4
  const cardH = 72
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
    fontSet
  )
  y = drawKeyValue(page, "Periodo:", `${input.startDate} -> ${input.endDate}`, left, y, fontSet)
  y = drawKeyValue(page, "Dias del periodo:", `${result.periodDays} dias`, left, y, fontSet)
  y -= 4

  y = drawSectionTitle(page, "Resultado", left, y - 8, fontSet)
  const resultBoxH = result.supported ? 58 : 76
  const resultBoxY = y - resultBoxH
  drawBox(page, left, resultBoxY, right - left, resultBoxH, {
    borderColor: [0.1, 0.1, 0.1],
    borderWidth: 1.5,
    fillColor: [1, 1, 1],
  })
  drawText(page, result.supported ? "MONTO ESTIMADO" : "FALLBACK INFORMATIVO", left + 16, resultBoxY + resultBoxH - 22, {
    size: 11,
    bold: true,
    fontSet,
  })
  drawText(page, money(result.total, result.currency), right - 16, resultBoxY + resultBoxH - 28, {
    size: 20,
    bold: true,
    align: "right",
    fontSet,
  })
  if (result.fallbackReason) {
    drawText(page, result.fallbackReason, left + 16, resultBoxY + 16, {
      size: 9,
      color: [0.45, 0.45, 0.45],
      fontSet,
    })
  }
  y = resultBoxY - 12

  y = drawSectionTitle(page, "Detalle", left, y - 8, fontSet)
  if (result.lines.length === 0) {
    drawText(page, "No hay lineas de calculo aplicables en el corpus MVP.", left, y - 4, {
      size: 10,
      color: [0.45, 0.45, 0.45],
      fontSet,
    })
    y -= 22
  } else {
    for (const line of result.lines) {
      drawBox(page, left - 4, y - 50, right - left + 8, 48, {
        borderColor: [0.9, 0.9, 0.9],
        borderWidth: 1,
        fillColor: [0.98, 0.98, 0.98],
      })
      drawText(page, line.label, left, y - 12, { size: 10, bold: true, fontSet })
      drawText(page, money(line.amount, result.currency), right, y - 12, {
        size: 10,
        bold: true,
        align: "right",
        fontSet,
      })
      drawText(page, line.formula, left, y - 28, { size: 8, color: [0.45, 0.45, 0.45], fontSet })
      drawText(page, line.legalReference, left, y - 42, {
        size: 8,
        color: [0.45, 0.45, 0.45],
        fontSet,
      })
      y -= 56
    }
  }

  y = drawSectionTitle(page, "Firmas", left, y - 8, fontSet)
  y = drawSignatureBoxes(page, y, left, fontSet)
  drawFooter(page, y, left, right, fontSet)

  return pdf.save()
}
