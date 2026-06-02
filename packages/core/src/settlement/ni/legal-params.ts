import { readFileSync } from "node:fs"
import { join } from "node:path"

const LEGAL_DIR = join(process.cwd(), "content", "legal", "ni")

const read = (name: string) => readFileSync(join(LEGAL_DIR, name), "utf8")

const extractRate = (content: string, key: string) => {
  const regex = new RegExp(`${key}\\s*=\\s*([0-9.]+)`)
  const match = content.match(regex)
  if (!match) throw new Error(`No se encontro ${key} en corpus legal`)
  return Number(match[1])
}

export const getNicaraguaLegalRates = () => {
  const inss = read("inss.md")
  const ir = read("ir-rentas-trabajo.md")

  return {
    inssLaborRate: extractRate(inss, "tasa_inss_laboral"),
    irLaborRate: extractRate(ir, "tasa_ir_laboral"),
  }
}
