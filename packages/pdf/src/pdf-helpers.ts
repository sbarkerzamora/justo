import { PDFDocument, PDFPage, rgb, StandardFonts } from "pdf-lib"
import type { RGB } from "pdf-lib"

type ColorInput = RGB | [number, number, number]

const toRgb = (color: ColorInput): RGB =>
  Array.isArray(color) ? rgb(...color) : color

const sanitizePdfText = (content: string) =>
  content.replaceAll("◆", "*").replaceAll("→", "->")

const wrapTextLines = (
  text: string,
  font: { widthOfTextAtSize: (content: string, size: number) => number },
  size: number,
  maxWidth: number
) => {
  const words = sanitizePdfText(text).split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ""

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(testLine, size) > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = testLine
    }
  }

  if (line) lines.push(line)
  return lines.length > 0 ? lines : [""]
}

export const COLORS = {
  text: rgb(0.1, 0.1, 0.1),
  muted: rgb(0.45, 0.45, 0.45),
  light: rgb(0.65, 0.65, 0.65),
  border: rgb(0.85, 0.85, 0.85),
  bg: rgb(0.97, 0.97, 0.97),
  tableHeaderBg: rgb(0.94, 0.94, 0.94),
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0),
}

export const currencyLocaleMap: Record<string, string> = {
  NIO: "es-NI", USD: "es-SV", GTQ: "es-GT",
  HNL: "es-HN", CRC: "es-CR", MXN: "es-MX",
  COP: "es-CO", PEN: "es-PE", ARS: "es-AR", CLP: "es-CL",
}

export const currencyFormatters: Record<string, Intl.NumberFormat> =
  Object.fromEntries(
    Object.entries(currencyLocaleMap).map(([curr, locale]) => [
      curr,
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: curr,
        minimumFractionDigits: 2,
      }),
    ])
  )

export const money = (amount: number, currencyCode: string) =>
  (currencyFormatters[currencyCode] ?? currencyFormatters.NIO).format(amount)

export type FontSet = { font: any; bold: any }

export async function loadFonts(pdf: PDFDocument): Promise<FontSet> {
  const [font, bold] = await Promise.all([
    pdf.embedFont(StandardFonts.Helvetica),
    pdf.embedFont(StandardFonts.HelveticaBold),
  ])
  return { font, bold }
}

export function drawText(
  page: PDFPage,
  content: string,
  x: number,
  y: number,
  opts: {
    size?: number
    bold?: boolean
    color?: ColorInput
    align?: "left" | "right"
    fontSet: FontSet
  }
) {
  const safeContent = sanitizePdfText(content)
  const f = opts.bold ? opts.fontSet.bold : opts.fontSet.font
  const size = opts.size ?? 11
  const color = opts.color ? toRgb(opts.color) : COLORS.text
  let px = x
  if (opts.align === "right") {
    px = x - f.widthOfTextAtSize(safeContent, size)
  }
  page.drawText(safeContent, { x: px, y, size, font: f, color })
}

export function drawLine(
  page: PDFPage,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  opts?: { color?: ColorInput; width?: number }
) {
  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness: opts?.width ?? 0.5,
    color: opts?.color ? toRgb(opts.color) : COLORS.border,
  })
}

export function drawBox(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  opts?: { borderColor?: ColorInput; borderWidth?: number; fillColor?: ColorInput }
) {
  if (opts?.fillColor) {
    page.drawRectangle({ x, y, width: w, height: h, color: toRgb(opts.fillColor) })
  }
  if (opts?.borderColor && (opts.borderWidth ?? 0) > 0) {
    page.drawRectangle({
      x, y, width: w, height: h,
      borderColor: toRgb(opts.borderColor),
      borderWidth: opts.borderWidth,
    })
  }
}

export function drawHeader(
  page: PDFPage,
  title: string,
  subtitle: string,
  x: number,
  y: number,
  fontSet: FontSet
): number {
  drawText(page, title, x, y, { size: 13, bold: true, fontSet })
  drawText(page, subtitle, x, y - 14, { size: 7, color: COLORS.muted, fontSet })
  const lineY = y - 20
  drawLine(page, x, lineY, x + 499, lineY, { color: COLORS.border, width: 0.3 })
  return lineY - 6
}

export function drawSectionTitle(
  page: PDFPage,
  title: string,
  x: number,
  y: number,
  fontSet: FontSet
): number {
  drawText(page, title, x, y, { size: 9, bold: true, fontSet })
  const newY = y - 8
  drawLine(page, x, newY, x + 200, newY, { color: COLORS.border, width: 0.2 })
  return newY - 4
}

export function drawKeyValue(
  page: PDFPage,
  label: string,
  value: string,
  x: number,
  y: number,
  fontSet: FontSet,
  valueX?: number
): number {
  drawText(page, label, x, y, { size: 8, color: COLORS.muted, fontSet })
  drawText(page, value, valueX ?? x + 130, y, { size: 8, bold: true, fontSet })
  return y - 13
}

export function drawSignatureBoxes(
  page: PDFPage,
  y: number,
  left: number,
  fontSet: FontSet,
  right?: number
): number {
  const boxW = right ? right - left : 160
  const boxH = right ? 52 : 40

  const drawOne = (label: string, xPos: number, yPos: number) => {
    drawBox(page, xPos, yPos, boxW, boxH, {
      borderColor: COLORS.border, borderWidth: 1,
    })
    drawLine(page, xPos + 10, yPos + 18, xPos + boxW - 10, yPos + 18, {
      color: COLORS.text, width: 0.5,
    })
    drawText(page, label, xPos + 10, yPos + 5, {
      size: 7, color: COLORS.muted, fontSet,
    })
    drawText(page, "Firma", xPos + 10, yPos + 23, {
      size: 7, color: COLORS.muted, fontSet,
    })
  }

  if (right) {
    const workerY = y - boxH
    const employerY = workerY - boxH - 10
    drawOne("Trabajador", left, workerY)
    drawOne("Empleador", left, employerY)
    return employerY - 12
  }

  const gap = 30
  const sigY = y - boxH
  drawOne("Trabajador", left, sigY)
  drawOne("Empleador", left + boxW + gap, sigY)

  return sigY - 10
}

export function drawTableHeader(
  page: PDFPage,
  columns: { label: string; x: number }[],
  y: number,
  left: number,
  right: number,
  fontSet: FontSet
): number {
  const hdrH = 16
  drawBox(page, left - 4, y - hdrH + 4, right - left + 8, hdrH, {
    fillColor: COLORS.tableHeaderBg,
  })
  for (const col of columns) {
    drawText(page, col.label, col.x, y - 1, { size: 7, bold: true, fontSet })
  }
  return y - hdrH
}

export function drawTableRow(
  page: PDFPage,
  cells: { text: string; x: number; bold?: boolean; size?: number }[],
  y: number,
  left: number,
  right: number,
  fontSet: FontSet
): number {
  const rowH = 16
  for (const cell of cells) {
    drawText(page, cell.text, cell.x, y - 1, {
      size: cell.size ?? 7, bold: cell.bold, fontSet,
    })
  }
  drawLine(page, left, y - rowH + 4, right, y - rowH + 4, {
    color: COLORS.border, width: 0.2,
  })
  return y - rowH
}

export function drawWrappedText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  opts: {
    size?: number; bold?: boolean; color?: ColorInput
    fontSet: FontSet; lineHeight?: number
  }
): { y: number; lines: number } {
  const f = opts.bold ? opts.fontSet.bold : opts.fontSet.font
  const size = opts.size ?? 11
  const lh = opts.lineHeight ?? size + 4
  const color = opts.color ? toRgb(opts.color) : COLORS.text
  const wrappedLines = wrapTextLines(text, f, size, maxWidth)
  let cy = y

  for (const line of wrappedLines) {
    page.drawText(line, { x, y: cy, size, font: f, color })
    cy -= lh
  }

  return { y: cy, lines: wrappedLines.length }
}

export function drawStackedKeyValues(
  page: PDFPage,
  rows: { label: string; value: string }[],
  left: number,
  y: number,
  fontSet: FontSet,
  maxWidth = 220
): number {
  let cy = y
  for (const row of rows) {
    drawText(page, row.label, left, cy, { size: 7, color: COLORS.muted, fontSet })
    const wrapped = drawWrappedText(page, row.value, left, cy - 10, maxWidth, {
      size: 8, bold: true, fontSet, lineHeight: 10,
    })
    cy = wrapped.y - 3
  }
  return cy
}

export function drawSummaryCard(
  page: PDFPage,
  title: string,
  amount: string,
  rows: { label: string; value: string }[],
  left: number,
  right: number,
  y: number,
  fontSet: FontSet
): number {
  const h = 76 + rows.length * 13
  drawBox(page, left, y - h, right - left, h - 4, {
    borderColor: COLORS.border, borderWidth: 1, fillColor: COLORS.white,
  })
  drawText(page, title, left + 12, y - 18, { size: 9, bold: true, fontSet })
  drawText(page, amount, left + 12, y - 39, { size: 18, bold: true, fontSet })
  let cy = y - 56
  for (const row of rows) {
    drawText(page, row.label, left + 12, cy, { size: 7, color: COLORS.muted, fontSet })
    drawText(page, row.value, right - 12, cy, { size: 7, bold: true, align: "right", fontSet })
    cy -= 13
  }
  return y - h
}

export function drawBreakdownItem(
  page: PDFPage,
  item: {
    label: string
    amount?: string
    formula?: string
    legalReference?: string
    note?: string
  },
  left: number,
  right: number,
  y: number,
  fontSet: FontSet
): number {
  const width = right - left
  const bodyWidth = width - 24
  const formulaLines = item.formula
    ? wrapTextLines(item.formula, fontSet.font, 7, bodyWidth).length
    : 0
  const legalLines = item.legalReference
    ? wrapTextLines(item.legalReference, fontSet.font, 7, bodyWidth).length
    : 0
  const noteLines = item.note
    ? wrapTextLines(item.note, fontSet.font, 7, bodyWidth).length
    : 0
  const h = 32 + formulaLines * 10 + legalLines * 10 + noteLines * 10 +
    (item.formula ? 10 : 0) + (item.legalReference ? 10 : 0) +
    (item.note ? 8 : 0)

  drawBox(page, left, y - h, width, h - 4, { fillColor: COLORS.bg })
  drawText(page, item.label, left + 12, y - 16, { size: 8, bold: true, fontSet })
  if (item.amount) {
    drawText(page, item.amount, right - 12, y - 16, {
      size: 9, bold: true, align: "right", fontSet,
    })
  }

  let cy = y - 30
  if (item.formula) {
    drawText(page, "Formula", left + 12, cy, { size: 6, color: COLORS.muted, fontSet })
    cy -= 9
    cy = drawWrappedText(page, item.formula, left + 12, cy, bodyWidth, {
      size: 7, color: COLORS.muted, fontSet, lineHeight: 10,
    }).y
  }
  if (item.legalReference) {
    drawText(page, "Base legal", left + 12, cy, { size: 6, color: COLORS.muted, fontSet })
    cy -= 9
    cy = drawWrappedText(page, item.legalReference, left + 12, cy, bodyWidth, {
      size: 7, color: COLORS.muted, fontSet, lineHeight: 10,
    }).y
  }
  if (item.note) {
    cy = drawWrappedText(page, item.note, left + 12, cy - 2, bodyWidth, {
      size: 7, color: COLORS.muted, fontSet, lineHeight: 10,
    }).y
  }

  return y - h - 4
}

export function drawPageBreakIfNeeded(
  pdf: PDFDocument,
  page: PDFPage,
  y: number,
  minY: number,
  drawNewPageHeader: (page: PDFPage) => number
): { page: PDFPage; y: number } {
  if (y >= minY) return { page, y }
  const nextPage = pdf.addPage([595.28, 841.89])
  return { page: nextPage, y: drawNewPageHeader(nextPage) }
}

export function drawFooter(
  page: PDFPage,
  y: number,
  left: number,
  right: number,
  fontSet: FontSet
): number {
  drawLine(page, left, y, right, y, { color: COLORS.border, width: 0.3 })
  const cy = y - 10
  drawText(page, "Generado por Justo (github.com/sbarkerzamora/justo) · Estimacion referencial, validar con profesional", left, cy, {
    size: 6, color: COLORS.light, fontSet,
  })
  return cy
}
