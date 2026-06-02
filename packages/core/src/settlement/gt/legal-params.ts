import { readFileSync } from "node:fs"
import { join } from "node:path"

const LEGAL_DIR = join(process.cwd(), "content", "legal", "gua")

const read = (name: string) => readFileSync(join(LEGAL_DIR, name), "utf8")

const extractRate = (content: string, key: string) => {
  const regex = new RegExp(`${key}\\s*=\\s*([0-9.]+)`)
  const match = content.match(regex)
  if (!match) throw new Error(`No se encontro ${key} en corpus legal de Guatemala`)
  return Number(match[1])
}

export const getGuatemalaLegalRates = () => {
  const igss = read("igss.md")
  const isr = read("isr.md")

  return {
    igssRate: extractRate(igss, "tasa_igss_laboral"),
    isrRate: extractRate(isr, "tasa_isr"),
  }
}
