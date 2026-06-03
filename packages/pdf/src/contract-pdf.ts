import { PDFDocument } from "pdf-lib"
import type { ContractInput, ContractResult, ContractSection } from "@justo/core"
import {
  loadFonts,
  drawText,
  drawLine,
  drawBox,
  drawSectionTitle,
  drawWrappedText,
  drawSignatureBoxes,
} from "./pdf-helpers"

const currencyLocaleMap: Record<string, string> = {
  NIO: "es-NI", USD: "es-SV", GTQ: "es-GT",
  HNL: "es-HN", CRC: "es-CR", MXN: "es-MX",
  COP: "es-CO", PEN: "es-PE", ARS: "es-AR", CLP: "es-CL",
}

const countryLaw: Record<string, { law: string; articles: string; dateFormat: string }> = {
  ni: { law: "Ley No. 185, Código del Trabajo", articles: "Arts. 19-29", dateFormat: "es-NI" },
  sv: { law: "Código de Trabajo", articles: "Art. 23", dateFormat: "es-SV" },
  gt: { law: "Código de Trabajo, Decreto 1441", articles: "Art. 29", dateFormat: "es-GT" },
  hn: { law: "Código de Trabajo, Decreto 189-59", articles: "Art. 37", dateFormat: "es-HN" },
  cr: { law: "Código de Trabajo", articles: "Art. 24", dateFormat: "es-CR" },
  pa: { law: "Código de Trabajo", articles: "Art. 68", dateFormat: "es-PA" },
  mx: { law: "Ley Federal del Trabajo", articles: "Art. 25", dateFormat: "es-MX" },
  co: { law: "Código Sustantivo del Trabajo", articles: "Art. 39", dateFormat: "es-CO" },
  pe: { law: "Ley General de Trabajo", articles: "Art. 14", dateFormat: "es-PE" },
  ar: { law: "Ley 20.744 de Contrato de Trabajo", articles: "Arts. 48-55", dateFormat: "es-AR" },
  cl: { law: "Código del Trabajo", articles: "Art. 10", dateFormat: "es-CL" },
}

const W = 595.28
const H = 841.89
const left = 48
const right = W - 48
const maxW = right - left
const marginBottom = 48

function drawPageHeader(page: any, result: ContractResult, pageNum: number, totalPages: number, fontSet: any) {
  const info = countryLaw[result.countryCode] ?? countryLaw.ni
  drawText(page, `CONTRATO INDIVIDUAL DE TRABAJO`, left, H - 36, {
    size: 18, bold: true, fontSet,
  })
  drawText(page, `${result.countryCode.toUpperCase()} · ${info.law}`, left, H - 52, {
    size: 8, color: [0.55, 0.55, 0.55], fontSet,
  })
  if (totalPages > 1) {
    drawText(page, `Pág. ${pageNum} de ${totalPages}`, right, H - 52, {
      size: 8, color: [0.55, 0.55, 0.55], align: "right", fontSet,
    })
  }
  hr(page, H - 58)
}

function hr(page: any, y: number, w?: number, c?: [number, number, number]) {
  drawLine(page, left, y, w ? left + w : right, y, {
    color: c ?? [0.7, 0.7, 0.7], width: 0.4,
  })
}

function drawBullets(page: any, items: string[], x: number, y: number, fontSet: any): number {
  let cy = y
  const fontSize = 9
  const indent = 12
  for (const item of items) {
    const wrapped = drawWrappedText(page, `·  ${item}`, x + indent, cy, maxW - indent, {
      size: fontSize, fontSet, lineHeight: 15,
    })
    cy = wrapped.y - 2
  }
  return cy
}

function estimateLines(text: string, maxWidth: number, fontSet: any, size: number): number {
  const f = fontSet.font
  const words = text.split(/\s+/)
  let line = ""
  let lines = 0
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word
    if (f.widthOfTextAtSize(testLine, size) > maxWidth && line) {
      lines++
      line = word
    } else {
      line = testLine
    }
  }
  if (line) lines++
  return lines
}

export const buildContractPdf = async (
  input: ContractInput,
  result: ContractResult,
) => {
  const pdf = await PDFDocument.create()
  const fontSet = await loadFonts(pdf)
  const locale = currencyLocaleMap[result.currency] ?? "es-NI"
  const info = countryLaw[result.countryCode] ?? countryLaw.ni
  let pageCount = 0

  const dateStr = new Date(result.generatedAt).toLocaleDateString(locale)

  const preambleParas = [
    `En ${result.celebrationPlace}, a ${result.celebrationDate}, comparecen por una parte ${result.employerName}, identificado con ${result.employerIdLabel} No. ${result.employerId}, representado legalmente por ${result.employerRepresentative}, del domicilio de ${result.employerAddress}, a quien en adelante se denominará EL EMPLEADOR; y por otra parte ${result.workerName}, identificado con ${result.workerIdLabel} No. ${result.workerId}, del domicilio de ${result.workerAddress}, a quien en adelante se denominará EL TRABAJADOR.`,
    `Las partes, de común acuerdo, convienen en suscribir el presente Contrato Individual de Trabajo, que se regirá por las disposiciones contenidas en las cláusulas siguientes y por ${info.law} (${info.articles}).`,
  ]

  const totalSections = result.sections.length
  const sectionCount = totalSections + 1 // preamble
  const sigLines = 10
  const estLinesPerPage = 45
  const totalEstLines = preambleParas.reduce((s, p) => s + estimateLines(p, maxW, fontSet, 10), 0) +
    result.sections.reduce((s, sec) => s + 2 + estimateLines(sec.content, maxW - 8, fontSet, 9), 0) + sigLines
  const totalPages = Math.max(1, Math.ceil(totalEstLines / estLinesPerPage))

  let page = pdf.addPage([W, H])
  drawPageHeader(page, result, 1, totalPages, fontSet)
  let y = H - 80

  const infoStr = `Generado: ${dateStr}  ·  Corpus: ${result.legalCorpusVersion}`
  drawText(page, infoStr, left, y, { size: 8, color: [0.55, 0.55, 0.55], fontSet })
  y -= 16
  hr(page, y)
  y -= 14

  const preambleResult = drawWrappedText(page, preambleParas.join(" "), left, y, maxW, {
    size: 10, fontSet, lineHeight: 16,
  })
  y = preambleResult.y - 8
  hr(page, y, 200, [0.5, 0.5, 0.5])
  y -= 16

  const partiesY = drawPartiesBox(page, result, y, fontSet, locale)
  y = partiesY - 16
  hr(page, y)
  y -= 14

  y = drawSectionTitle(page, "CLÁUSULAS", left, y, fontSet)
  y -= 4

  for (let i = 0; i < result.sections.length; i++) {
    const sec = result.sections[i]
    if (y < 140) {
      y = addPage(pdf, fontSet, page, result, 0, totalPages)
    }

    drawText(page, sec.title, left, y, { size: 11, bold: true, fontSet })
    y -= 16

    const contentLines = sec.content.split("\n")
    let inBulletList = false
    let bulletItems: string[] = []

    for (const rawLine of contentLines) {
      if (y < 120) {
        y = addPage(pdf, fontSet, page, result, 0, totalPages)
      }

      const trimmed = rawLine.trim()
      const clean = trimmed.replace(/\*\*/g, "")
      const isBold = trimmed.startsWith("**") && trimmed.endsWith("**")

      if (!trimmed) {
        if (inBulletList && bulletItems.length > 0) {
          y = drawBullets(page, bulletItems, left, y, fontSet)
          y -= 6
          bulletItems = []
          inBulletList = false
        }
        y -= 4
        continue
      }

      if (trimmed.startsWith("- ")) {
        inBulletList = true
        bulletItems.push(clean.slice(2))
        continue
      }

      if (inBulletList && bulletItems.length > 0) {
        y = drawBullets(page, bulletItems, left, y, fontSet)
        y -= 6
        bulletItems = []
        inBulletList = false
      }

      if (isBold) {
        drawText(page, clean, left + 4, y, { size: 9, bold: true, fontSet })
        y -= 15
      } else {
        const wrapped = drawWrappedText(page, clean, left + 4, y, maxW - 8, {
          size: 9, fontSet, lineHeight: 14,
        })
        y = wrapped.y
      }
    }

    if (inBulletList && bulletItems.length > 0) {
      y = drawBullets(page, bulletItems, left, y, fontSet)
      y -= 4
    }

    y -= 6
    if (i < result.sections.length - 1) {
      hr(page, y, maxW * 0.3, [0.8, 0.8, 0.8])
      y -= 10
    }
  }

  if (y < 180) {
    y = addPage(pdf, fontSet, page, result, 0, totalPages)
  }

  y = drawSectionTitle(page, "FIRMAS", left, y, fontSet)
  y -= 6

  const noteText = "El presente contrato se extiende en dos ejemplares del mismo tenor y valor, quedando un ejemplar en poder de cada una de las partes."
  const noteResult = drawWrappedText(page, noteText, left, y, maxW, {
    size: 9, color: [0.45, 0.45, 0.45], fontSet,
  })
  y = noteResult.y - 6

  const empLine = `${result.employerName} · Representante legal: ${result.employerRepresentative}`
  const wkLine = `${result.workerName} · ${result.workerIdLabel}: ${result.workerId}`

  drawText(page, "EL EMPLEADOR", left, y, { size: 10, bold: true, fontSet })
  drawText(page, empLine, left, y - 14, { size: 8, color: [0.45, 0.45, 0.45], fontSet })
  drawText(page, "EL TRABAJADOR", right - 160, y, { size: 10, bold: true, fontSet })
  drawText(page, wkLine, right - 160, y - 14, { size: 8, color: [0.45, 0.45, 0.45], fontSet })

  y -= 40
  y = drawSignatureBoxes(page, y, left, fontSet)

  y -= 12
  hr(page, y)
  y -= 8

  const disclaimer = `Este documento es un modelo informativo generado automáticamente por Justo con base en ${info.law} (${info.articles}) de ${result.countryCode.toUpperCase()}. No constituye asesoría legal profesional. Se recomienda revisión por un abogado laboralista antes de su firma.`
  drawWrappedText(page, disclaimer, left, y, maxW, {
    size: 7.5, color: [0.55, 0.55, 0.55], fontSet, lineHeight: 11,
  })

  return pdf.save()
}

function drawPartiesBox(
  page: any, result: ContractResult, y: number, fontSet: any, locale: string,
): number {
  const boxW = (right - left - 16) / 2
  const boxH = 64
  const cy = y - boxH

  drawBox(page, left, cy, boxW, boxH, {
    borderColor: [0.75, 0.75, 0.75], borderWidth: 1, fillColor: [0.98, 0.98, 0.98],
  })
  drawText(page, "EL EMPLEADOR", left + 8, cy + boxH - 12, { size: 9, bold: true, fontSet })
  drawWrappedText(page, result.employerName, left + 8, cy + boxH - 28, boxW - 16, {
    size: 8, fontSet, lineHeight: 12, color: [0.35, 0.35, 0.35],
  })
  drawText(page, result.employerId, left + 8, cy + 4, {
    size: 8, color: [0.55, 0.55, 0.55], fontSet,
  })

  drawBox(page, left + boxW + 16, cy, boxW, boxH, {
    borderColor: [0.75, 0.75, 0.75], borderWidth: 1, fillColor: [0.98, 0.98, 0.98],
  })
  drawText(page, "EL TRABAJADOR", left + boxW + 24, cy + boxH - 12, { size: 9, bold: true, fontSet })
  drawWrappedText(page, result.workerName, left + boxW + 24, cy + boxH - 28, boxW - 16, {
    size: 8, fontSet, lineHeight: 12, color: [0.35, 0.35, 0.35],
  })
  drawText(page, result.workerId, left + boxW + 24, cy + 4, {
    size: 8, color: [0.55, 0.55, 0.55], fontSet,
  })

  return cy - 4
}

function addPage(
  pdf: any, fontSet: any, currentPage: any, result: ContractResult,
  _pageNum: number, totalPages: number,
): number {
  const page = pdf.addPage([W, H])
  const pageNum = 1 + Math.min(999, Math.max(0, pdf.getPageCount() - 1))
  drawPageHeader(page, result, pageNum, totalPages, fontSet)
  return H - 80
}
