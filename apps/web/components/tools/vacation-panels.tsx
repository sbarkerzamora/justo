import { IconBook } from "@tabler/icons-react"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"
import type { VacationApiResponse } from "./tool-types"
import { Row } from "./settlement-panels"

export { Row }

export function VacationResultPanel({
  result,
  fmt,
  copy,
  backToLegalChat,
}: {
  result: VacationApiResponse
  fmt: (v: number) => string
  copy: (typeof homeCopy)[Locale]
  backToLegalChat: () => Promise<void>
}) {
  return (
    <div className="mb-3 space-y-3 rounded-2xl border border-border bg-card p-5 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Resultado de vacaciones
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-foreground">
          {fmt(result.result.amount)}
        </p>
      </div>
      <div className="grid gap-2 text-sm border-t border-border pt-3">
        <Row label="Dias acumulados" value={`${result.result.accruedVacationDays} dias`} />
        <Row label="Dias gozados" value={`${result.result.usedVacationDays} dias`} />
        <Row label="Dias pendientes" value={`${result.result.pendingVacationDays} dias`} />
        <Row label="Salario diario" value={fmt(result.result.dailySalary)} />
        <Row label="Formula" value={result.result.formula} />
        <Row label="Referencia legal" value={result.result.legalReference} />
        <Row label="Corpus" value={result.result.legalCorpusVersion} />
      </div>
      <p className="text-xs text-muted-foreground border-t border-border pt-3">
        Resultado informativo. No sustituye asesoria legal o contable profesional.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void backToLegalChat()}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
        >
          <IconBook className="size-4" />
          {copy.backToChat}
        </button>
      </div>
    </div>
  )
}
