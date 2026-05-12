import type { ReactNode } from "react"
import { loader, source as defineSource } from "fumadocs-core/source"
import Link from "next/link"

type JustoPageData = {
  title: string
  description?: string
  body: ReactNode
  toc?: { title: string; url: string; depth: number }[]
  full?: boolean
}

const docsSource = defineSource<JustoPageData, { title?: string; pages?: string[] }>({
  pages: [
    {
      type: "page",
      path: "index",
      slugs: [],
      data: {
        title: "Documentacion de Justo",
        description:
          "Base funcional del asistente laboral open source para Centroamerica, iniciando por Nicaragua.",
        body: (
          <div className="space-y-6">
            <p>
              Justo combina dos modos: chat legal para consultas y flujo guiado deterministico para
              calculo de liquidacion laboral.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Consulta legal en espanol con referencias del corpus.</li>
              <li>Calculo paso a paso con validaciones y trazabilidad.</li>
              <li>PDF imprimible con firmas de trabajador y empleador.</li>
            </ul>
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-2 text-base font-semibold">Corpus legal</h2>
              <p className="mb-3 text-sm text-muted-foreground">
                Referencias normativas para Nicaragua, con reglas operativas del motor.
              </p>
              <Link className="text-sm font-medium underline underline-offset-4" href="/docs/legal/nicaragua">
                Ver fuentes legales de Nicaragua
              </Link>
            </div>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "guia-rapida",
      data: {
        title: "🧭 Guia rapida",
        description: "Como usar Justo en menos de 2 minutos.",
        body: (
          <div className="space-y-4">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Inicia una consulta legal para aclarar dudas de prestaciones en Nicaragua.</li>
              <li>Pulsa Iniciar calculo y completa salario, fechas y vacaciones pendientes.</li>
              <li>Confirma los datos y revisa el desglose con formulas y deducciones.</li>
              <li>Genera el PDF para firma de trabajador y empleador.</li>
            </ol>
            <p className="text-sm text-muted-foreground">
              Si hay disputa o caso complejo, valida el resultado con asesoria legal y contable.
            </p>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/index",
      slugs: ["legal", "nicaragua"],
      data: {
        title: "⚖ Nicaragua, marco legal",
        description:
          "Referencias legales y operativas usadas por el sistema para el calculo de liquidacion.",
        body: (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Esta seccion resume la base normativa usada para formulas, supuestos y deducciones.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li>
                <Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/indemnizacion">
                  Indemnizacion
                </Link>
              </li>
              <li>
                <Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/aguinaldo">
                  Aguinaldo
                </Link>
              </li>
              <li>
                <Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/vacaciones">
                  Vacaciones
                </Link>
              </li>
              <li>
                <Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/salario-proporcional">
                  Salario proporcional
                </Link>
              </li>
              <li>
                <Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/deducciones">
                  Deducciones
                </Link>
              </li>
              <li>
                <Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/inss">
                  INSS
                </Link>
              </li>
              <li className="sm:col-span-2">
                <Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/ir-rentas-trabajo">
                  IR rentas del trabajo
                </Link>
              </li>
            </ul>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/indemnizacion",
      data: {
        title: "💼 Indemnizacion por antiguedad",
        description: "Regla de antiguedad para terminacion sin causa justificada.",
        body: (
          <>
            <p>Arts. 42, 43 y 45 de Ley 185.</p>
            <p>1 mes por ano en los primeros 3 anos; luego 20 dias por ano, minimo 1 mes.</p>
          </>
        ),
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/aguinaldo",
      data: {
        title: "🎁 Aguinaldo proporcional",
        description: "Decimo tercer mes completo o proporcional.",
        body: <p>Arts. 93, 94, 95 y 97 de Ley 185. Formula: base * (dias/365).</p>,
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "Pago de vacaciones pendientes no gozadas.",
        body: <p>Arts. 76, 77 y 78 de Ley 185. Formula: (salario/30) * dias pendientes.</p>,
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Liquidacion del salario pendiente del periodo en curso.",
        body: <p>Art. 42 y Arts. 81, 84, 86 de Ley 185. Formula: (salario/30) * dias.</p>,
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "Deducciones legales sobre conceptos imponibles.",
        body: <p>Art. 88 y Art. 97 de Ley 185. INSS e IR solo sobre base imponible.</p>,
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/inss",
      data: {
        title: "🛡 INSS laboral",
        description: "Cotizacion laboral en el MVP.",
        body: <p>Tasa operativa actual del corpus: 0.07, sujeta a revision legal.</p>,
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/ir-rentas-trabajo",
      data: {
        title: "📊 IR rentas del trabajo",
        description: "Base imponible y tasa operativa provisional.",
        body: <p>Tasa operativa actual del corpus: 0.015, sujeta a revision legal.</p>,
      },
    },
  ],
  metas: [
    {
      type: "meta",
      path: "meta.json",
      data: {
        title: "Justo Docs",
        pages: ["index", "guia-rapida", "legal"],
      },
    },
    {
      type: "meta",
      path: "legal/meta.json",
      data: {
        title: "Legal",
        pages: ["nicaragua"],
      },
    },
    {
      type: "meta",
      path: "legal/nicaragua/meta.json",
      data: {
        title: "Nicaragua",
        pages: [
          "index",
          "indemnizacion",
          "aguinaldo",
          "vacaciones",
          "salario-proporcional",
          "deducciones",
          "inss",
          "ir-rentas-trabajo",
        ],
      },
    },
  ],
})

export const source: any = loader({
  baseUrl: "/docs",
  source: docsSource,
})
