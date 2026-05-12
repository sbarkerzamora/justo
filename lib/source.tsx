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
                Referencias normativas para Centroamerica, con reglas operativas del motor.
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
              <li>Inicia una consulta legal para aclarar dudas de prestaciones en Centroamerica.</li>
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
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/indemnizacion">Indemnizacion</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/aguinaldo">Aguinaldo</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/vacaciones">Vacaciones</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/salario-proporcional">Salario proporcional</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/deducciones">Deducciones</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/inss">INSS</Link></li>
              <li className="sm:col-span-2"><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/ir-rentas-trabajo">IR rentas del trabajo</Link></li>
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
    {
      type: "page",
      path: "legal/guatemala/index",
      slugs: ["legal", "guatemala"],
      data: {
        title: "⚖ Guatemala, marco legal",
        description: "Codigo de Trabajo Decreto 1441 y leyes complementarias.",
        body: (
          <ul className="grid gap-2 sm:grid-cols-2">
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/indemnizacion">Indemnizacion por antiguedad</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/aguinaldo">Aguinaldo y Bono 14</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/vacaciones">Vacaciones pendientes</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/salario-proporcional">Salario pendiente</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/deducciones">Deducciones legales</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/igss">IGSS laboral</a></li>
            <li className="sm:col-span-2"><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/isr">ISR rentas del trabajo</a></li>
          </ul>
        ),
      },
    },
    {
      type: "page",
      path: "legal/guatemala/indemnizacion",
      data: {
        title: "💼 Indemnizacion por antiguedad",
        description: "30 dias por ano, maximo 8 meses.",
        body: <p>Arts. 78-82 Codigo de Trabajo. 30 dias por ano, maximo 240 dias. Formula: (salario/30) * min(anos * 30, 240).</p>,
      },
    },
    {
      type: "page",
      path: "legal/guatemala/aguinaldo",
      data: {
        title: "🎁 Aguinaldo y Bono 14",
        description: "Dos prestaciones anuales de un salario cada una.",
        body: <p>Decreto 76-78 (Aguinaldo) y Decreto 42-92 (Bono 14). Cada uno: salario * (dias/365).</p>,
      },
    },
    {
      type: "page",
      path: "legal/guatemala/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "15 dias habiles por ano.",
        body: <p>Art. 130 Codigo de Trabajo. Formula: (salario/30) * dias pendientes.</p>,
      },
    },
    {
      type: "page",
      path: "legal/guatemala/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Proporcional del mes en curso.",
        body: <p>Arts. 68-76 Codigo de Trabajo. Formula: (salario/30) * dias trabajados.</p>,
      },
    },
    {
      type: "page",
      path: "legal/guatemala/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "IGSS e ISR.",
        body: <p>IGSS 4.83% e ISR 5% simplificado. Aguinaldo y Bono 14 exentos.</p>,
      },
    },
    {
      type: "page",
      path: "legal/guatemala/igss",
      data: {
        title: "🛡 IGSS laboral",
        description: "Cotizacion del 4.83%.",
        body: <p>Tasa operativa: 4.83%. Formula: base * 0.0483.</p>,
      },
    },
    {
      type: "page",
      path: "legal/guatemala/isr",
      data: {
        title: "📊 ISR rentas del trabajo",
        description: "Tasa simplificada del 5%.",
        body: <p>Tasa operativa propuesta: 5%. Formula: max(base, 0) * 0.05.</p>,
      },
    },
    {
      type: "page",
      path: "legal/honduras/index",
      slugs: ["legal", "honduras"],
      data: {
        title: "⚖ Honduras, marco legal",
        description: "Codigo de Trabajo Decreto 189-59 y leyes complementarias.",
        body: (
          <ul className="grid gap-2 sm:grid-cols-2">
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/honduras/indemnizacion">Indemnizacion por antiguedad</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/honduras/aguinaldo">Aguinaldo (Decimotercer Mes)</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/honduras/vacaciones">Vacaciones pendientes</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/honduras/salario-proporcional">Salario pendiente</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/honduras/deducciones">Deducciones legales</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/honduras/ihss">IHSS laboral</a></li>
          </ul>
        ),
      },
    },
    {
      type: "page",
      path: "legal/honduras/indemnizacion",
      data: {
        title: "💼 Indemnizacion por antiguedad",
        description: "Auxilio de cesantia, 1 mes por ano, maximo 25 meses.",
        body: <p>Arts. 116, 120 y 123 Codigo de Trabajo. 3-6m=10d, 6-12m=20d, +1a=1 mes/ano, max 750d. Formula: (salario/30) * min(anos * 30, 750).</p>,
      },
    },
    {
      type: "page",
      path: "legal/honduras/aguinaldo",
      data: {
        title: "🎁 Aguinaldo (Decimotercer Mes)",
        description: "Un salario mensual adicional proporcional.",
        body: <p>Decreto 133-92. Formula: salario * (dias/365).</p>,
      },
    },
    {
      type: "page",
      path: "legal/honduras/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "Escala progresiva de 10 a 20 dias habiles.",
        body: <p>Art. 346 Codigo de Trabajo. 1a=10d, 2a=12d, 3a=15d, 4a+=20d. Formula: (salario/30) * dias pendientes.</p>,
      },
    },
    {
      type: "page",
      path: "legal/honduras/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Proporcional del mes en curso.",
        body: <p>Arts. 322 y 378 Codigo de Trabajo. Formula: (salario/30) * dias trabajados.</p>,
      },
    },
    {
      type: "page",
      path: "legal/honduras/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "IHSS sobre conceptos imponibles.",
        body: <p>IHSS 3.5%. Aguinaldo exento.</p>,
      },
    },
    {
      type: "page",
      path: "legal/honduras/ihss",
      data: {
        title: "🛡 IHSS laboral",
        description: "Cotizacion del 3.5%.",
        body: <p>Tasa operativa: 3.5%. Formula: base * 0.035.</p>,
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/index",
      slugs: ["legal", "elsalvador"],
      data: {
        title: "⚖ El Salvador, marco legal",
        description: "Codigo de Trabajo de El Salvador y leyes complementarias.",
        body: (
          <ul className="grid gap-2 sm:grid-cols-2">
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/indemnizacion">Indemnizacion por despido</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/aguinaldo">Aguinaldo</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/vacaciones">Vacaciones pendientes</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/salario-proporcional">Salario pendiente</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/deducciones">Deducciones legales</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/isss">ISSS laboral</a></li>
            <li className="sm:col-span-2"><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/afp">AFP laboral</a></li>
          </ul>
        ),
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/indemnizacion",
      data: {
        title: "💼 Indemnizacion por despido",
        description: "30 dias por ano, minimo 15 dias.",
        body: <p>Arts. 58-59 Codigo de Trabajo. 30 dias/ano, min 15d. Formula: (salario/30) * max(anos * 30, 15).</p>,
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/aguinaldo",
      data: {
        title: "🎁 Aguinaldo",
        description: "Escala de 15, 19 o 21 dias segun antiguedad.",
        body: <p>Arts. 196-202 Codigo de Trabajo. 1-3a=15d, 3-10a=19d, 10a+=21d. Formula: (salario/30) * escala * (dias/365).</p>,
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "15 dias + 30% de prima.",
        body: <p>Arts. 177 y 187 Codigo de Trabajo. 15 dias + prima 30%. Formula: (salario/30) * dias * 1.30.</p>,
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Proporcional del mes en curso.",
        body: <p>Formula: (salario/30) * dias trabajados.</p>,
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "ISSS 3% y AFP 7.25%, tope 20%.",
        body: <p>ISSS 3% + AFP 7.25%. Tope legal 20% del salario (Art. 132).</p>,
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/isss",
      data: {
        title: "🏥 ISSS laboral",
        description: "Cotizacion del 3%.",
        body: <p>Tasa operativa: 3%. Formula: base * 0.03.</p>,
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/afp",
      data: {
        title: "💰 AFP laboral",
        description: "Cotizacion del 7.25%.",
        body: <p>Tasa operativa: 7.25%. Formula: base * 0.0725.</p>,
      },
    },
    {
      type: "page",
      path: "legal/costarica/index",
      slugs: ["legal", "costarica"],
      data: {
        title: "⚖ Costa Rica, marco legal",
        description: "Codigo de Trabajo de Costa Rica y leyes complementarias.",
        body: (
          <ul className="grid gap-2 sm:grid-cols-2">
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/costarica/indemnizacion">Cesantia y Preaviso</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/costarica/aguinaldo">Aguinaldo</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/costarica/vacaciones">Vacaciones pendientes</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/costarica/salario-proporcional">Salario pendiente</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/costarica/deducciones">Deducciones legales</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/costarica/ccss">CCSS laboral</a></li>
          </ul>
        ),
      },
    },
    {
      type: "page",
      path: "legal/costarica/indemnizacion",
      data: {
        title: "💼 Cesantia y Preaviso",
        description: "Cesantia progresiva + preaviso segun tiempo.",
        body: <p>Arts. 28-30 Codigo de Trabajo. Cesantia ~20d/ano (max 8a). Preaviso: 7d, 15d o 30d segun tiempo. Formula: (salario/30) * dias.</p>,
      },
    },
    {
      type: "page",
      path: "legal/costarica/aguinaldo",
      data: {
        title: "🎁 Aguinaldo",
        description: "1/12 de salarios anuales.",
        body: <p>Ley No. 2412. Formula: salario * (dias/365).</p>,
      },
    },
    {
      type: "page",
      path: "legal/costarica/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "14 dias por cada 50 semanas.",
        body: <p>Arts. 153 y 156 Codigo de Trabajo. 14d/50 semanas. Formula: (salario/30) * dias pendientes.</p>,
      },
    },
    {
      type: "page",
      path: "legal/costarica/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Proporcional del mes en curso.",
        body: <p>Formula: (salario/30) * dias trabajados.</p>,
      },
    },
    {
      type: "page",
      path: "legal/costarica/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "CCSS 9.17% sobre base imponible.",
        body: <p>CCSS 9.17% (salud + pension + invalidez). Aguinaldo exento.</p>,
      },
    },
    {
      type: "page",
      path: "legal/costarica/ccss",
      data: {
        title: "🏥 CCSS laboral",
        description: "Cotizacion del 9.17%.",
        body: <p>Tasa operativa: 9.17%. Formula: base * 0.0917.</p>,
      },
    },
    {
      type: "page",
      path: "legal/panama/index",
      slugs: ["legal", "panama"],
      data: {
        title: "⚖ Panama, marco legal",
        description: "Codigo de Trabajo de Panama y leyes complementarias.",
        body: (
          <ul className="grid gap-2 sm:grid-cols-2">
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/panama/indemnizacion">Indemnizacion y Prima</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/panama/aguinaldo">Decimotercer Mes</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/panama/vacaciones">Vacaciones pendientes</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/panama/salario-proporcional">Salario pendiente</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/panama/deducciones">Deducciones legales</a></li>
            <li><a className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/panama/css">CSS laboral</a></li>
          </ul>
        ),
      },
    },
    {
      type: "page",
      path: "legal/panama/indemnizacion",
      data: {
        title: "💼 Indemnizacion y Prima de Antiguedad",
        description: "Prima 7d/ano + Indemnizacion 3.4 sem/ano.",
        body: <p>Arts. 224-225 Codigo de Trabajo. Prima: 7d/ano. Indemnizacion: 3.4 sem/ano (1ros 10a), luego 1 sem/ano. Min: 1 sem.</p>,
      },
    },
    {
      type: "page",
      path: "legal/panama/aguinaldo",
      data: {
        title: "🎁 Decimotercer Mes",
        description: "1/12 de salarios anuales.",
        body: <p>Ley 13 de 1994. Formula: salario * (dias/365).</p>,
      },
    },
    {
      type: "page",
      path: "legal/panama/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "30 dias por cada 11 meses.",
        body: <p>Art. 54 Codigo de Trabajo. 30d/11 meses. Formula: (salario/30) * dias pendientes.</p>,
      },
    },
    {
      type: "page",
      path: "legal/panama/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Proporcional del mes en curso.",
        body: <p>Formula: (salario/30) * dias trabajados.</p>,
      },
    },
    {
      type: "page",
      path: "legal/panama/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "CSS 9.75% sobre base imponible.",
        body: <p>CSS 9.75%. Tope legal 50% del salario (Art. 161).</p>,
      },
    },
    {
      type: "page",
      path: "legal/panama/css",
      data: {
        title: "🏥 CSS laboral",
        description: "Cotizacion del 9.75%.",
        body: <p>Tasa operativa: 9.75%. Formula: base * 0.0975.</p>,
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
        pages: ["nicaragua", "guatemala", "honduras", "elsalvador", "costarica", "panama"],
      },
    },
    {
      type: "meta",
      path: "legal/panama/meta.json",
      data: {
        title: "Panama",
        pages: [
          "index",
          "indemnizacion",
          "aguinaldo",
          "vacaciones",
          "salario-proporcional",
          "deducciones",
          "css",
        ],
      },
    },
    {
      type: "meta",
      path: "legal/costarica/meta.json",
      data: {
        title: "Costa Rica",
        pages: [
          "index",
          "indemnizacion",
          "aguinaldo",
          "vacaciones",
          "salario-proporcional",
          "deducciones",
          "ccss",
        ],
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
    {
      type: "meta",
      path: "legal/guatemala/meta.json",
      data: {
        title: "Guatemala",
        pages: [
          "index",
          "indemnizacion",
          "aguinaldo",
          "vacaciones",
          "salario-proporcional",
          "deducciones",
          "igss",
          "isr",
        ],
      },
    },
    {
      type: "meta",
      path: "legal/honduras/meta.json",
      data: {
        title: "Honduras",
        pages: [
          "index",
          "indemnizacion",
          "aguinaldo",
          "vacaciones",
          "salario-proporcional",
          "deducciones",
          "ihss",
        ],
      },
    },
    {
      type: "meta",
      path: "legal/elsalvador/meta.json",
      data: {
        title: "El Salvador",
        pages: [
          "index",
          "indemnizacion",
          "aguinaldo",
          "vacaciones",
          "salario-proporcional",
          "deducciones",
          "isss",
          "afp",
        ],
      },
    },
  ],
})

export const source: any = loader({
  baseUrl: "/docs",
  source: docsSource,
})
