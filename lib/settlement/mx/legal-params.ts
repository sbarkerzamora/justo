import { readFileSync } from "node:fs"
import { join } from "node:path"

const LEGAL_DIR = join(process.cwd(), "content", "legal", "mx")

const read = (name: string) => readFileSync(join(LEGAL_DIR, name), "utf8")

const extractRate = (content: string, key: string) => {
  const regex = new RegExp(`${key}\\s*=\\s*([0-9.]+)`)
  const match = content.match(regex)
  if (!match) throw new Error(`No se encontro ${key} en corpus legal de Mexico`)
  return Number(match[1])
}

export const getMexicoLegalRates = () => {
  const imss = read("imss.md")
  return {
    imssRate: extractRate(imss, "tasa_imss_laboral"),
  }
}
