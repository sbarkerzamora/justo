import { PDFDocument } from "pdf-lib"
import type { ContractInput, ContractResult } from "@justo/core"
import {
  loadFonts, drawText, drawLine, drawBox, drawHeader,
  drawSectionTitle, drawWrappedText, drawSignatureBoxes, COLORS,
} from "./pdf-helpers"
import type { FontSet } from "./pdf-helpers"

const currencyLocaleMap: Record<string, string> = {
  NIO: "es-NI", USD: "es-SV", GTQ: "es-GT",
  HNL: "es-HN", CRC: "es-CR", MXN: "es-MX",
  COP: "es-CO", PEN: "es-PE", ARS: "es-AR", CLP: "es-CL",
}

const countryLaw: Record<string, { law: string; articles: string }> = {
  ni: { law: "Ley No. 185, Codigo del Trabajo", articles: "Arts. 19-29" },
  sv: { law: "Codigo de Trabajo", articles: "Art. 23" },
  gt: { law: "Codigo de Trabajo, Decreto 1441", articles: "Art. 29" },
  hn: { law: "Codigo de Trabajo, Decreto 189-59", articles: "Art. 37" },
  cr: { law: "Codigo de Trabajo", articles: "Art. 24" },
  pa: { law: "Codigo de Trabajo", articles: "Art. 68" },
  mx: { law: "Ley Federal del Trabajo", articles: "Art. 25" },
  co: { law: "Codigo Sustantivo del Trabajo", articles: "Art. 39" },
  pe: { law: "Ley General de Trabajo", articles: "Art. 14" },
  ar: { law: "Ley 20.744 de Contrato de Trabajo", articles: "Arts. 48-55" },
  cl: { law: "Codigo del Trabajo", articles: "Art. 10" },
}

const W = 595.28
const H = 841.89
const left = 36
const right = W - 36
const maxW = right - left
const bodySize = 7.5
const bodyLH = 11

function drawPageHeader(page: any, result: ContractResult, fontSet: FontSet) {
  const info = countryLaw[result.countryCode] ?? countryLaw.ni
  drawText(page, "CONTRATO INDIVIDUAL DE TRABAJO", left, H - 30, {
    size: 14, bold: true, fontSet,
  })
  drawText(page, `${result.countryCode.toUpperCase()} · ${info.law}`, left, H - 42, {
    size: 7, color: COLORS.muted, fontSet,
  })
  drawLine(page, left, H - 48, right, H - 48, { color: COLORS.border, width: 0.3 })
}

export const buildContractPdf = async (
  input: ContractInput,
  result: ContractResult,
) => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([W, H])
  const fontSet = await loadFonts(pdf)
  const locale = currencyLocaleMap[result.currency] ?? "es-NI"
  const info = countryLaw[result.countryCode] ?? countryLaw.ni

  drawPageHeader(page, result, fontSet)
  let y = H - 62

  const dateStr = new Date(result.generatedAt).toLocaleDateString(locale)
  drawText(page, `Generado: ${dateStr} · Corpus: ${result.legalCorpusVersion}`, left, y, {
    size: 6, color: COLORS.light, fontSet,
  })
  y -= 10

  const preamble = (
    `En ${result.celebrationPlace}, a ${result.celebrationDate}, comparecen ` +
    `${result.employerName}, identificado con ${result.employerIdLabel} No. ${result.employerId}, ` +
    `representado legalmente por ${result.employerRepresentative}, a quien se denominara EL EMPLEADOR; ` +
    `y ${result.workerName}, identificado con ${result.workerIdLabel} No. ${result.workerId}, ` +
    `a quien se denominara EL TRABAJADOR. Ambas partes convienen en suscribir el presente Contrato ` +
    `Individual de Trabajo, regido por las clausulas siguientes y por ${info.law} (${info.articles}).`
  )
  const preambleResult = drawWrappedText(page, preamble, left, y, maxW, {
    size: bodySize, fontSet, lineHeight: bodyLH,
  })
  y = preambleResult.y - 4
  drawLine(page, left, y, left + 300, y, { color: COLORS.border, width: 0.2 })
  y -= 6

  for (let i = 0; i < result.sections.length; i++) {
    const sec = result.sections[i]
    drawText(page, sec.title, left, y, { size: 8, bold: true, fontSet })
    y -= bodyLH

    const contentLines = sec.content.split("\n")
    let bulletItems: string[] = []
    let inBulletList = false

    for (const rawLine of contentLines) {
      const trimmed = rawLine.trim()
      if (!trimmed) {
        if (inBulletList && bulletItems.length > 0) {
          for (const item of bulletItems) {
            const wr = drawWrappedText(page, item, left + 10, y, maxW - 10, {
              size: bodySize, fontSet, lineHeight: bodyLH,
            })
            y = wr.y
          }
          y -= 2
          bulletItems = []
          inBulletList = false
        }
        y -= 2
        continue
      }

      if (trimmed.startsWith("- ")) {
        inBulletList = true
        bulletItems.push(trimmed.slice(2))
        continue
      }

      if (inBulletList && bulletItems.length > 0) {
        for (const item of bulletItems) {
          const wr = drawWrappedText(page, item, left + 10, y, maxW - 10, {
            size: bodySize, fontSet, lineHeight: bodyLH,
          })
          y = wr.y
        }
        y -= 2
        bulletItems = []
        inBulletList = false
      }

      const clean = trimmed.replace(/\*\*/g, "")
      const wr = drawWrappedText(page, clean, left, y, maxW, {
        size: bodySize, fontSet, lineHeight: bodyLH,
      })
      y = wr.y
    }

    if (inBulletList && bulletItems.length > 0) {
      for (const item of bulletItems) {
        const wr = drawWrappedText(page, item, left + 10, y, maxW - 10, {
          size: bodySize, fontSet, lineHeight: bodyLH,
        })
        y = wr.y
      }
      y -= 2
    }
    y -= 4
  }

  y -= 2
  drawText(page, "FIRMAS", left, y, { size: 9, bold: true, fontSet })
  y -= bodyLH

  const noteText = "El presente contrato se extiende en dos ejemplares del mismo tenor y valor."
  const noteResult = drawWrappedText(page, noteText, left, y, maxW, {
    size: bodySize, color: COLORS.muted, fontSet, lineHeight: bodyLH,
  })
  y = noteResult.y - 4

  const empInfo = `${result.employerName} (${result.employerRepresentative})`
  const wkInfo = `${result.workerName} · ${result.workerIdLabel}: ${result.workerId}`

  drawText(page, "EL EMPLEADOR", left, y, { size: 8, bold: true, fontSet })
  drawText(page, empInfo, left, y - 10, { size: 6, color: COLORS.muted, fontSet })
  drawText(page, "EL TRABAJADOR", right - 140, y, { size: 8, bold: true, fontSet })
  drawText(page, wkInfo, right - 140, y - 10, { size: 6, color: COLORS.muted, fontSet })
  y -= 28
  y = drawSignatureBoxes(page, y, left, fontSet)

  y -= 8
  drawLine(page, left, y, right, y, { color: COLORS.border, width: 0.3 })
  y -= 6
  drawWrappedText(page,
    `Documento informativo generado por Justo con base en ${info.law} (${info.articles}). No constituye asesoria legal profesional.`,
    left, y, maxW, { size: 6, color: COLORS.light, fontSet, lineHeight: 8 },
  )

  return pdf.save()
}
