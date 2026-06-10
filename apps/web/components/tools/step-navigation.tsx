import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

export function StepNavigation({
  onBack,
  onContinue,
  canContinue,
  showBack,
  backLabel,
  continueLabel,
}: {
  onBack: () => void
  onContinue: () => void
  canContinue: boolean
  showBack: boolean
  backLabel: string
  continueLabel: string
}) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-border bg-background px-4 py-3">
      <div className="mx-auto flex w-full max-w-xl items-center gap-3">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <IconArrowLeft className="size-4" />
            {backLabel}
          </button>
        ) : (
          <div className="min-w-[44px]" />
        )}
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity disabled:opacity-40 hover:opacity-90"
        >
          {continueLabel}
          <IconArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
