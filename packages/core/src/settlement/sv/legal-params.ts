import { readFileSync } from "node:fs"
import { join } from "node:path"

const LEGAL_DIR = join(process.cwd(), "content", "legal", "sv")

const read = (name: string) => readFileSync(join(LEGAL_DIR, name), "utf8")

const extractRate = (content: string, key: string) => {
  const regex = new RegExp(`${key}\\s*=\\s*([0-9.]+)`)
  const match = content.match(regex)
  if (!match) throw new Error(`No se encontro ${key} en corpus legal de El Salvador`)
  return Number(match[1])
}

export const getElSalvadorLegalRates = () => {
  const isss = read("isss.md")
  const afp = read("afp.md")

  return {
    isssRate: extractRate(isss, "tasa_isss_laboral"),
    afpRate: extractRate(afp, "tasa_afp_laboral"),
  }
}
