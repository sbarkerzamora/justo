import { readFileSync } from "node:fs"
import { join } from "node:path"

const LEGAL_DIR = join(process.cwd(), "content", "legal", "cl")

const read = (name: string) => readFileSync(join(LEGAL_DIR, name), "utf8")

const extractRate = (content: string, key: string) => {
  const regex = new RegExp(`${key}\\s*=\\s*([0-9.]+)`)
  const match = content.match(regex)
  if (!match) throw new Error(`No se encontro ${key} en corpus legal de Chile`)
  return Number(match[1])
}

export const getChileLegalRates = () => {
  const afp = read("afp.md")
  const salud = read("salud.md")
  const afc = read("afc.md")

  return {
    afpRate: extractRate(afp, "tasa_afp"),
    saludRate: extractRate(salud, "tasa_salud"),
    afcRate: extractRate(afc, "tasa_afc"),
  }
}
