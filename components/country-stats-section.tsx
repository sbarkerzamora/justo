import {
  IconChartBar,
  IconInfoCircle,
} from "@tabler/icons-react"
import type { Locale } from "@/lib/i18n"
import { getCountryStats } from "@/lib/stats/repository"
import type { CountryCode } from "@/lib/settlement/types"
import { StatsClientSection } from "@/components/stats/stats-client-section"

export async function CountryStatsSection({
  countryCode,
  locale,
}: {
  countryCode: string
  locale: Locale
}) {
  if (!countryCode) return null

  const stats = await getCountryStats(countryCode as CountryCode)
  if (stats.totalSettlements === 0) return null

  const info = getStatsInfo(locale, stats.totalSettlements)

  return (
    <section className="border-t border-border bg-background px-4 py-12 md:px-8 md:py-14">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <IconChartBar className="size-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {info.title}
            </h2>
          </div>
          <p className="mt-2 max-w-[48ch] text-sm text-muted-foreground">
            {info.description}
          </p>
        </header>

        <StatsClientSection
          stats={stats}
          currency={getCurrencySymbol(stats.countryCode)}
          filters={info.filters}
          labels={info.labels}
        />

        <footer className="mt-6 flex items-start gap-2 border-t border-border pt-4">
          <IconInfoCircle className="mt-px size-3.5 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{info.disclaimer}</p>
        </footer>
      </div>
    </section>
  )
}

function getStatsInfo(locale: Locale, total: number) {
  const count = total.toLocaleString(locale === "en" ? "en" : "es-NI")

  if (locale === "en") {
    return {
      title: `Settlement data — ${count} calculations`,
      description:
        "Anonymous statistics based on real calculations. No personal information is stored — only salary ranges, tenure, and net outcomes.",
      disclaimer:
        "Anonymous data for informational purposes. Does not constitute legal advice.",
      filters: {
        salary: "Salaries",
        tenure: "Tenure",
        net: "Net",
        termination: "Termination",
      },
      labels: {
        cases: "cases",
        medianSalary: "median salary",
        medianTenure: "median tenure",
        medianNet: "median net",
      },
    }
  }

  return {
    title: `Datos de liquidaciones — ${count} cálculos`,
    description:
      "Estadísticas anónimas basadas en cálculos reales. No se almacena información personal — solo rangos de salario, antigüedad y montos netos.",
    disclaimer:
      "Datos anónimos con fines informativos. No constituye asesoría legal.",
    filters: {
      salary: "Salarios",
      tenure: "Antigüedad",
      net: "Neto",
      termination: "Despido",
    },
    labels: {
      cases: "casos",
      medianSalary: "salario medio",
      medianTenure: "antigüedad media",
      medianNet: "neto medio",
    },
  }
}

function getCurrencySymbol(code: string): string {
  const symbols: Record<string, string> = {
    NIO: "C$",
    GTQ: "Q",
    HNL: "L",
    USD: "$",
    CRC: "₡",
    MXN: "$",
    COP: "$",
    PEN: "S/",
    ARS: "$",
    CLP: "$",
  }
  return symbols[code] ?? code
}

export type StatsFilterInfo = ReturnType<typeof getStatsInfo>
