import {
  IconChartBar,
  IconInfoCircle,
} from "@tabler/icons-react"
import type { Locale } from "@/lib/i18n"
import { getCountryStats, emptyStats } from "@/lib/stats/repository"
import type { CountryCode } from "@justo/core"
import { StatsClientSection } from "@/components/stats/stats-client-section"
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"

const STATS_TIMEOUT_MS = 800

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  const timer = new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  return Promise.race([promise, timer])
}

export async function CountryStatsSection({
  countryCode,
  locale,
}: {
  countryCode: string
  locale: Locale
}) {
  if (!countryCode) return null

  const stats = await withTimeout(
    getCountryStats(countryCode as CountryCode),
    STATS_TIMEOUT_MS,
    emptyStats(countryCode as CountryCode)
  )
  const hasData = stats.totalSettlements > 0
  const info = hasData
    ? getStatsInfo(locale, stats.totalSettlements)
    : getEmptyInfo(locale)

  return (
    <section className="relative overflow-hidden border-t border-border bg-background px-4 py-12 md:px-8 md:py-14">
      <BackgroundRippleEffect />
      <div className="relative z-10 mx-auto max-w-4xl">
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
          currency={getCurrencyCode(stats.countryCode)}
          filters={info.filters}
          labels={info.labels}
          isLoading={!hasData}
        />

        <footer className="mt-6 flex items-start gap-2 border-t border-border pt-4">
          <IconInfoCircle className="mt-px size-3.5 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{info.disclaimer}</p>
        </footer>
      </div>
    </section>
  )
}

function getEmptyInfo(locale: Locale) {
  const base = getSharedCopy(locale)

  if (locale === "en") {
    return {
      ...base,
      title: "Settlement statistics",
      description:
        "Anonymous data will appear here as calculations are performed. No personal information is stored.",
    }
  }

  return {
    ...base,
    title: "Estadísticas de liquidaciones",
    description:
      "Aquí aparecerán datos anónimos conforme se realicen cálculos. No se almacena información personal.",
  }
}

function getStatsInfo(locale: Locale, total: number) {
  const base = getSharedCopy(locale)
  const count = total.toLocaleString(locale === "en" ? "en" : "es-NI")

  if (locale === "en") {
    return {
      ...base,
      title: `Settlement data — ${count} calculations`,
      description:
        "Anonymous statistics based on real calculations. No personal information is stored — only salary ranges, tenure, and net outcomes.",
    }
  }

  return {
    ...base,
    title: `Datos de liquidaciones — ${count} cálculos`,
    description:
      "Estadísticas anónimas basadas en cálculos reales. No se almacena información personal — solo rangos de salario, antigüedad y montos netos.",
  }
}

function getSharedCopy(locale: Locale) {
  if (locale === "en") {
    return {
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

function getCurrencyCode(country: CountryCode): string {
  const map: Record<CountryCode, string> = {
    ni: "NIO",
    gt: "GTQ",
    hn: "HNL",
    sv: "USD",
    cr: "CRC",
    pa: "USD",
    mx: "MXN",
    co: "COP",
    pe: "PEN",
    ar: "ARS",
    cl: "CLP",
  }
  return map[country]
}

export type StatsFilterInfo = ReturnType<typeof getStatsInfo>
