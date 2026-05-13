import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { isValidCountry } from "@/lib/countries"
import { CountryShell } from "@/components/country-shell"

const metadataByCountry: Record<string, { title: string; description: string }> = {
  ni: {
    title: "Calculadora laboral Nicaragua | Justo",
    description: "Consulta laboral y calculadora de liquidacion para Nicaragua.",
  },
  gt: {
    title: "Calculadora laboral Guatemala | Justo",
    description: "Consulta laboral y calculadora de liquidacion para Guatemala.",
  },
  sv: {
    title: "Calculadora laboral El Salvador | Justo",
    description: "Consulta laboral y calculadora de liquidacion para El Salvador.",
  },
  hn: {
    title: "Calculadora laboral Honduras | Justo",
    description: "Consulta laboral y calculadora de liquidacion para Honduras.",
  },
  cr: {
    title: "Calculadora laboral Costa Rica | Justo",
    description: "Consulta laboral y calculadora de liquidacion para Costa Rica.",
  },
  pa: {
    title: "Calculadora laboral Panama | Justo",
    description: "Consulta laboral y calculadora de liquidacion para Panama.",
  },
  mx: {
    title: "Calculadora laboral Mexico | Justo",
    description: "Consulta laboral y calculadora de liquidacion para Mexico.",
  },
  co: {
    title: "Calculadora laboral Colombia | Justo",
    description: "Consulta laboral y calculadora de liquidacion para Colombia.",
  },
  pe: {
    title: "Calculadora laboral Peru | Justo",
    description: "Consulta laboral y calculadora de liquidacion para Peru.",
  },
  ar: {
    title: "Calculadora laboral Argentina | Justo",
    description: "Consulta laboral y calculadora de liquidacion para Argentina.",
  },
  cl: {
    title: "Calculadora laboral Chile | Justo",
    description: "Consulta laboral y calculadora de liquidacion para Chile.",
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>
}): Promise<Metadata> {
  const { country } = await params
  if (!isValidCountry(country)) {
    return {
      title: "Justo",
      description: "Asistente laboral y calculadora de liquidaciones.",
    }
  }

  return metadataByCountry[country] ?? {
    title: "Justo",
    description: "Asistente laboral y calculadora de liquidaciones.",
  }
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country } = await params

  if (!isValidCountry(country)) {
    notFound()
  }

  return <CountryShell countryCode={country} />
}
