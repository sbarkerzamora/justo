import { PDFDocument, PDFPage, rgb, StandardFonts } from "pdf-lib"
import type { RGB } from "pdf-lib"

type ColorInput = RGB | [number, number, number]

const toRgb = (color: ColorInput): RGB =>
  Array.isArray(color) ? rgb(...color) : color

const sanitizePdfText = (content: string) =>
  content.replaceAll("◆", "*").replaceAll("→", "->")

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
  fontSet: FontSet
): number {
  const boxW = 160
  const boxH = 40
  const gap = 30
  const sigY = y - boxH

  const drawOne = (label: string, xPos: number) => {
    drawBox(page, xPos, sigY, boxW, boxH, {
      borderColor: COLORS.border, borderWidth: 1,
    })
    drawLine(page, xPos + 8, sigY + 14, xPos + boxW - 8, sigY + 14, {
      color: COLORS.text, width: 0.5,
    })
    drawText(page, label, xPos + 8, sigY + 2, {
      size: 7, color: COLORS.muted, fontSet,
    })
    drawText(page, "Firma", xPos + 8, sigY + 17, {
      size: 7, color: COLORS.muted, fontSet,
    })
  }

  drawOne("Trabajador", left)
  drawOne("Empleador", left + boxW + gap)

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
  const safeText = sanitizePdfText(text)
  const f = opts.bold ? opts.fontSet.bold : opts.fontSet.font
  const size = opts.size ?? 11
  const lh = opts.lineHeight ?? size + 4
  const color = opts.color ? toRgb(opts.color) : COLORS.text
  const words = safeText.split(/\s+/)
  let line = ""
  let lines = 0
  let cy = y

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word
    const w = f.widthOfTextAtSize(testLine, size)
    if (w > maxWidth && line) {
      page.drawText(line, { x, y: cy, size, font: f, color })
      cy -= lh
      lines++
      line = word
    } else {
      line = testLine
    }
  }
  if (line) {
    page.drawText(line, { x, y: cy, size, font: f, color })
    cy -= lh
    lines++
  }

  return { y: cy, lines }
}

export function drawFooter(
  page: PDFPage,
  y: number,
  left: number,
  right: number,
  fontSet: FontSet
): number {
  drawLine(page, left, y, right, y, { color: COLORS.border, width: 0.3 })
  let cy = y - 10
  drawText(page, "Generado por Justo (github.com/sbarkerzamora/justo) · Estimacion referencial, validar con profesional", left, cy, {
    size: 6, color: COLORS.light, fontSet,
  })
  return cy
}
