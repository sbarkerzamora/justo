"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("App error boundary caught:", error)
  }, [error])

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6">
      <div className="max-w-sm text-center space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Error inesperado
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          Ocurrio un error al cargar la pagina. Intenta de nuevo o regresa al inicio.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
