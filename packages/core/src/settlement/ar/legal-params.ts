import { readFileSync } from "node:fs"
import { join } from "node:path"

const LEGAL_DIR = join(process.cwd(), "content", "legal", "ar")

const read = (name: string) => readFileSync(join(LEGAL_DIR, name), "utf8")

const extractRate = (content: string, key: string) => {
  const regex = new RegExp(`${key}\\s*=\\s*([0-9.]+)`)
  const match = content.match(regex)
  if (!match) throw new Error(`No se encontro ${key} en corpus legal de Argentina`)
  return Number(match[1])
}

export const getArgentinaLegalRates = () => {
  const ded = read("deducciones.md")
  return {
    jubilacionRate: extractRate(ded, "jubilacion"),
    pamiRate: extractRate(ded, "pami"),
    obraSocialRate: extractRate(ded, "obra_social"),
  }
}
