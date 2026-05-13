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
        title: "Documentación de Justo",
        description:
          "Asistente laboral open source: consultas legales respaldadas por corpus y liquidaciones determinísticas.",
        body: (
          <div className="space-y-8">
            <div>
              <p>
                Justo es un asistente laboral open source que combina un
                chat legal con acceso al corpus normativo de cada país y un motor de liquidación
                determinístico paso a paso.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Qué podés hacer
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="mb-1 text-sm font-semibold">💬 Consulta legal</h3>
                  <p className="text-xs text-muted-foreground">
                    Preguntá sobre derechos, prestaciones, indemnizaciones y deducciones. El
                    asistente consulta el corpus normativo del país activo y responde con
                    referencias legales concretas. También podés hacer clic en los ejemplos de
                    preguntas de la pantalla principal.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="mb-1 text-sm font-semibold">🧮 Cálculo estimativo</h3>
                  <p className="text-xs text-muted-foreground">
                    Pedí un cálculo rápido en el chat, ej:{" "}
                    <em>"cuánto me corresponde con 5 años y salario de 15000"</em>. El motor
                    determinístico calcula al instante usando las tasas del corpus legal.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="mb-1 text-sm font-semibold">📋 Liquidación guiada</h3>
                  <p className="text-xs text-muted-foreground">
                    Completá nombre, salario, fechas y vacaciones paso a paso. Obtené el desglose
                    completo con fórmulas, deducciones, referencias legales y PDF descargable con
                    firmas.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="mb-1 text-sm font-semibold">📚 Marco legal por país</h3>
                  <p className="text-xs text-muted-foreground">
                    Explorá las leyes, fórmulas y tasas de cada país en la sección{" "}
                    <Link
                      className="underline underline-offset-2 hover:text-foreground"
                      href="/docs/legal"
                    >
                      Marco legal
                    </Link>
                    . Cada país tiene su propio conjunto de reglas documentadas.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Países soportados
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "Nicaragua", "El Salvador", "Guatemala", "Honduras",
                  "Costa Rica", "Panamá", "México", "Colombia",
                  "Perú", "Argentina", "Chile",
                ].map((name) => (
                  <span
                    key={name}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="mb-3 text-sm text-muted-foreground">
                Seleccioná tu país desde la pantalla principal. Todo el contenido, cálculos y
                referencias se adaptan automáticamente.
              </p>
              <Link
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white"
                href="/"
              >
                Ir a la aplicación
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
        title: "🧭 Guía rápida",
        description: "Cómo usar Justo en menos de 2 minutos.",
        body: (
          <div className="space-y-4">
            <ol className="list-decimal space-y-3 pl-5">
              <li>
                <strong>Seleccioná tu país</strong> al iniciar la aplicación. Todo el contenido,
                cálculos y referencias legales se adaptan automáticamente a la legislación de
                ese país.
              </li>
              <li>
                <strong>Escribí una pregunta</strong> en el chat o hacé clic en uno de los
                ejemplos de la pantalla de inicio. El asistente consulta el corpus legal para
                responder con información respaldada.
              </li>
              <li>
                <strong>Pedí un cálculo estimado</strong> directamente en el chat, por ejemplo:
                <em> "cuánto me corresponde de indemnización con 5 años y salario de 15000?"</em>
                El sistema calcula automáticamente usando el motor determinístico del país activo.
              </li>
              <li>
                <strong>Iniciá el cálculo guiado</strong> para una liquidación formal. Completá
                nombre, salario, fechas y vacaciones paso a paso. Revisá el resumen y confirmá.
              </li>
              <li>
                <strong>Revisá el resultado</strong> con desglose de ingresos, deducciones,
                fórmulas y referencias legales. Descargá el PDF imprimible con firmas.
              </li>
            </ol>
            <p className="text-sm text-muted-foreground">
              Si hay disputa o caso complejo, validá el resultado con asesoría legal y contable
              profesional.
            </p>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/index",
      slugs: ["legal"],
      data: {
        title: "Marco legal",
        description: "Referencias normativas por país.",
        body: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Seleccioná un país para ver su marco legal, fórmulas de liquidación y tasas
              vigentes documentadas en el corpus legal.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["nicaragua", "Nicaragua"],
                ["elsalvador", "El Salvador"],
                ["guatemala", "Guatemala"],
                ["honduras", "Honduras"],
                ["costarica", "Costa Rica"],
                ["panama", "Panamá"],
                ["mexico", "México"],
                ["colombia", "Colombia"],
                ["peru", "Perú"],
                ["argentina", "Argentina"],
                ["chile", "Chile"],
              ].map(([slug, label]) => (
                <a
                  key={slug}
                  href={`/docs/legal/${slug}`}
                  className="rounded-xl border border-border bg-card p-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  {label} →
                </a>
              ))}
            </div>
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
        description: "Ley No. 185 (Codigo del Trabajo) y reglas operativas del motor de liquidacion.",
        body: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              El sistema laboral nicaraguense se rige por la <strong>Ley No. 185, Codigo del
              Trabajo</strong> (La Gaceta No. 205, 30-Oct-1996) con sus reformas vigentes. Esta
              seccion documenta las reglas operativas usadas por el motor de calculo, los articulos
              aplicables y ejemplos practicos por rubro.
            </p>
            <p className="text-sm text-muted-foreground">
              Version del corpus: <code>ni-v0.2.0</code>
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/indemnizacion">💼 Indemnizacion</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/aguinaldo">🎁 Aguinaldo</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/vacaciones">🌴 Vacaciones</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/salario-proporcional">🧾 Salario proporcional</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/deducciones">➖ Deducciones</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/inss">🛡 INSS</Link></li>
              <li className="sm:col-span-2"><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/nicaragua/ir-rentas-trabajo">📊 IR rentas del trabajo</Link></li>
            </ul>
            <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">
              Aviso: contenido informativo. Para casos complejos validar con asesoria legal.
            </div>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/indemnizacion",
      data: {
        title: "💼 Indemnizacion por antiguedad",
        description: "Indemnizacion por despido sin causa justificada en contrato por tiempo indeterminado. Arts. 42, 43, 45 Ley 185.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 42</strong>: Pago proporcional de prestaciones al terminar la relacion laboral.</li>
                <li><strong>Art. 43</strong>: Renuncia o mutuo acuerdo no elimina el derecho por antiguedad del Art. 45.</li>
                <li><strong>Art. 45</strong>: Despido sin causa justificada en contrato por tiempo indeterminado.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Primer tramo</strong> (anos 1 a 3): 30 dias de salario por cada ano.</li>
                <li><strong>Segundo tramo</strong> (ano 4 en adelante): 20 dias de salario por cada ano.</li>
                <li><strong>Minimo</strong>: 30 dias (1 mes).</li>
                <li><strong>Maximo</strong>: 150 dias (5 meses).</li>
                <li>Fracciones de ano se liquidan proporcionalmente.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en NIO</td></tr>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">anos_antiguedad</td><td className="py-1">Anos completos desde inicio hasta salida</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">salario_diario</td><td className="py-1">salario_mensual / 30</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
dias_primer_tramo = min(anos_antiguedad, 3) * 30
dias_segundo_tramo = max(anos_antiguedad - 3, 0) * 20
dias_indemnizacion = min(150, max(30, dias_primer_tramo + dias_segundo_tramo))
monto_indemnizacion = salario_diario * dias_indemnizacion`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Trabajador con 5 anos de antiguedad y salario de C$15,000</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 15,000 / 30 = <strong>C$500</strong></li>
                  <li>dias_primer_tramo = min(5, 3) * 30 = <strong>90</strong></li>
                  <li>dias_segundo_tramo = max(5 - 3, 0) * 20 = <strong>40</strong></li>
                  <li>dias_indemnizacion = min(150, max(30, 90 + 40)) = <strong>130</strong></li>
                  <li>monto_indemnizacion = 500 * 130 = <strong>C$65,000</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Excepciones</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>Despido con causa justificada imputable al trabajador: no aplica indemnizacion.</li>
                <li>Casos de reintegro y sanciones adicionales se tratan fuera del calculo base.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley No. 185, Arts. 42, 43, 45. Corpus: <code>ni-v0.2.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/aguinaldo",
      data: {
        title: "🎁 Aguinaldo proporcional",
        description: "Decimo tercer mes completo o proporcional segun tiempo trabajado. Arts. 93-97 Ley 185.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 93</strong>: Derecho a decimo tercer mes completo o proporcional.</li>
                <li><strong>Art. 94</strong>: Base de calculo: ultimo salario o salario mas alto de ultimos 6 meses si variable.</li>
                <li><strong>Art. 95</strong>: Oportunidad de pago.</li>
                <li><strong>Art. 97</strong>: Exencion de impuesto, descuentos, cotizaciones y deducciones.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">Al finalizar la relacion laboral, se paga la parte proporcional del decimo tercer mes por tiempo trabajado mayor de un mes y menor de un ano.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_base</td><td className="py-1">Salario mensual ordinario en NIO</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_periodo</td><td className="py-1">Dias transcurridos desde el 1 de enero hasta la fecha de salida</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`aguinaldo_proporcional = salario_base * (dias_periodo / 365)`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de C$15,000, salida el 30 de septiembre (273 dias)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>aguinaldo = 15,000 * (273 / 365) = 15,000 * 0.748 = <strong>C$11,220</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Excepciones</h2>
              <p className="text-sm">Si el tiempo trabajado no supera un mes, no se liquida proporcional de aguinaldo por esta regla. Aguinaldo exento de INSS e IR (Art. 97).</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley No. 185, Arts. 93, 94, 95, 97. Corpus: <code>ni-v0.2.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "Pago de vacaciones no gozadas al cierre. Arts. 76, 77, 78 Ley 185.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 76</strong>: 15 dias de vacaciones por cada 6 meses de trabajo ininterrumpido.</li>
                <li><strong>Art. 77</strong>: Al terminar, se pagan salarios y prestaciones proporcionales acumuladas.</li>
                <li><strong>Art. 78</strong>: Base en ultimo salario ordinario o promedio de ultimos 6 meses si variable.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">Se liquidan las vacaciones pendientes no gozadas al cierre de la relacion laboral. El usuario declara los dias pendientes y el motor los valida en rango permitido.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en NIO</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_vacaciones_pendientes</td><td className="py-1">Dias de vacaciones acumulados no gozados</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de C$15,000, 10 dias de vacaciones pendientes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 15,000 / 30 = <strong>C$500</strong></li>
                  <li>vacaciones = 500 * 10 = <strong>C$5,000</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Excepciones</h2>
              <p className="text-sm">Si el salario es variable, debe usarse el promedio ordinario de los ultimos 6 meses como base.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley No. 185, Arts. 76, 77, 78. Corpus: <code>ni-v0.2.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Liquidacion del salario del mes en curso al momento de la salida. Arts. 42, 81, 84, 86 Ley 185.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 42</strong>: Pago de prestaciones y conceptos proporcionales al cierre.</li>
                <li><strong>Arts. 81, 84, 86</strong>: Definicion de salario, salario ordinario y pago.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">Se liquida el salario pendiente del periodo en curso al momento de la salida. El MVP usa captura explicita de dias pendientes para evitar ambiguedad de calendario de pago.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en NIO</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_salario_pendiente</td><td className="py-1">Dias trabajados en el mes de salida no pagados aun</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
salario_proporcional = salario_diario * dias_salario_pendiente`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de C$15,000, salida el dia 15 del mes (15 dias pendientes)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 15,000 / 30 = <strong>C$500</strong></li>
                  <li>salario_proporcional = 500 * 15 = <strong>C$7,500</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Excepciones</h2>
              <p className="text-sm">Si existe salario variable o esquema mixto, se debe aplicar promedio ordinario conforme reglas internas.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley No. 185, Arts. 42, 81, 84, 86. Corpus: <code>ni-v0.2.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "INSS e IR sobre conceptos imponibles. Arts. 88 y 97 Ley 185.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 88 (Ley 185)</strong>: Del salario se hacen deducciones legales.</li>
                <li><strong>Art. 97 (Ley 185)</strong>: El decimo tercer mes esta exento de impuesto, descuentos, cotizaciones y deducciones.</li>
                <li><strong>Normativa INSS</strong>: Cotizacion laboral aplicable.</li>
                <li><strong>Normativa IR</strong>: Rentas del trabajo.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>Solo se aplican deducciones permitidas legalmente y sobre conceptos imponibles.</li>
                <li>Aguinaldo proporcional no integra base imponible de deducciones (Art. 97).</li>
                <li>INSS se calcula sobre salario proporcional + vacaciones pagadas.</li>
                <li>IR se calcula sobre ingreso bruto menos INSS y aguinaldo.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">base_inss</td><td className="py-1">Salario proporcional + vacaciones pagadas</td></tr>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">tasa_inss_laboral</td><td className="py-1">0.07 (7%)</td></tr>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">base_ir</td><td className="py-1">Ingreso bruto - INSS - aguinaldo</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">tasa_ir_laboral</td><td className="py-1">0.015 (1.5%)</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formulas</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`inss_laboral = base_inss * 0.07
ir_laboral = max(base_ir, 0) * 0.015
total_deducciones = inss_laboral + ir_laboral
neto = ingreso_bruto - total_deducciones`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Ingreso bruto C$88,720, aguinaldo C$11,220</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>base_inss = C$7,500 (salario prop.) + C$5,000 (vac.) = <strong>C$12,500</strong></li>
                  <li>inss = 12,500 * 0.07 = <strong>C$875</strong></li>
                  <li>base_ir = 88,720 - 875 - 11,220 = <strong>C$76,625</strong></li>
                  <li>ir = max(76,625, 0) * 0.015 = <strong>C$1,149</strong></li>
                  <li>total deducciones = 875 + 1,149 = <strong>C$2,024</strong></li>
                  <li>neto = 88,720 - 2,024 = <strong>C$86,696</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Excepciones</h2>
              <p className="text-sm">Si la base imponible resulta 0 o negativa, la deduccion correspondiente es 0.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley No. 185 Arts. 88 y 97 + normativa INSS e IR vigente. Corpus: <code>ni-v0.2.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/inss",
      data: {
        title: "🛡 INSS laboral",
        description: "Cotizacion del 7% sobre base imponible. Ley de Seguridad Social + normativa INSS.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Ley de Seguridad Social y reglamentacion administrativa aplicable del INSS.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>La cotizacion laboral del trabajador se aplica sobre conceptos salariales imponibles.</li>
                <li>En el MVP inicial, la base imponible contempla salario proporcional y vacaciones pagadas.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">base_inss</td><td className="py-1">Salario proporcional + vacaciones pagadas</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">tasa_inss_laboral</td><td className="py-1">0.07 (7%)</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`inss_laboral = base_inss * 0.07`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base INSS de C$12,500</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>inss = 12,500 * 0.07 = <strong>C$875</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Excepciones</h2>
              <p className="text-sm">Conceptos no imponibles por ley no se incluyen en <code>base_inss</code>.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley de Seguridad Social + normativa INSS. Tasa: 7% (set propuesto). Corpus: <code>ni-v0.2.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/nicaragua/ir-rentas-trabajo",
      data: {
        title: "📊 IR rentas del trabajo",
        description: "Impuesto sobre la renta del trabajo al 1.5%. Ley de Concertacion Tributaria.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Ley de Concertacion Tributaria y disposiciones vigentes para retencion o calculo de rentas del trabajo aplicables a liquidacion.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>El IR se aplica sobre base imponible definida por normativa tributaria, despues de deducciones permitidas.</li>
                <li>Base IR = Ingreso bruto - INSS - Aguinaldo.</li>
                <li>En el MVP inicial se usa una tasa referencial operativa del 1.5%.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">base_ir</td><td className="py-1">Ingreso bruto - INSS - aguinaldo</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">tasa_ir_laboral</td><td className="py-1">0.015 (1.5%)</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`ir_laboral = max(base_ir, 0) * 0.015`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base IR de C$76,625</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>ir = max(76,625, 0) * 0.015 = <strong>C$1,149</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Excepciones</h2>
              <p className="text-sm">Aguinaldo proporcional exento de deducciones segun Art. 97 de Ley 185.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley de Concertacion Tributaria. Tasa: 1.5% (set propuesto, pendiente confirmacion). Corpus: <code>ni-v0.2.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/guatemala/index",
      slugs: ["legal", "guatemala"],
      data: {
        title: "⚖ Guatemala, marco legal",
        description: "Codigo de Trabajo Decreto 1441, Decreto 76-78 (Aguinaldo) y Decreto 42-92 (Bono 14).",
        body: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              El sistema laboral guatemalteco se rige por el <strong>Codigo de Trabajo (Decreto
              1441)</strong>, la <strong>Ley de Aguinaldo (Decreto 76-78)</strong> y el <strong>Bono
              14 (Decreto 42-92)</strong>. Esta seccion documenta las reglas operativas usadas por
              el motor de calculo, los articulos aplicables y ejemplos practicos por rubro.
            </p>
            <p className="text-sm text-muted-foreground">
              Version del corpus: <code>gt-v0.1.0</code>
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/indemnizacion">💼 Indemnizacion por antiguedad</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/aguinaldo">🎁 Aguinaldo y Bono 14</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/vacaciones">🌴 Vacaciones pendientes</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/salario-proporcional">🧾 Salario pendiente</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/deducciones">➖ Deducciones legales</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/igss">🛡 IGSS laboral</Link></li>
              <li className="sm:col-span-2"><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/guatemala/isr">📊 ISR rentas del trabajo</Link></li>
            </ul>
            <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">
              Aviso: contenido informativo. Para casos complejos validar con asesoria legal.
            </div>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/guatemala/indemnizacion",
      data: {
        title: "💼 Indemnizacion por antiguedad",
        description: "30 dias de salario por cada ano de servicio, maximo 8 meses. Arts. 78-82 Codigo de Trabajo.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Arts. 78-82</strong>: Indemnizacion universal: 30 dias de salario por cada ano de servicio continuo.</li>
                <li><strong>Art. 82</strong>: Limite maximo de 8 meses (240 dias).</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>30 dias de salario por cada ano trabajado.</li>
                <li>Fracciones de ano se pagan proporcionalmente.</li>
                <li>Maximo: 240 dias (8 meses).</li>
                <li>Aplica a terminacion por despido injustificado o renuncia voluntaria.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en GTQ</td></tr>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">anos_antiguedad</td><td className="py-1">Anos completos desde inicio hasta salida</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">salario_diario</td><td className="py-1">salario_mensual / 30</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
dias_indemnizacion = min(anos_antiguedad * 30, 240)
monto_indemnizacion = salario_diario * dias_indemnizacion`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Trabajador con 6 anos de antiguedad y salario de Q8,000</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 8,000 / 30 = <strong>Q266.67</strong></li>
                  <li>dias_indemnizacion = min(6 * 30, 240) = min(180, 240) = <strong>180</strong></li>
                  <li>monto = 266.67 * 180 = <strong>Q48,000</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo Decreto 1441, Arts. 78-82. Corpus: <code>gt-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/guatemala/aguinaldo",
      data: {
        title: "🎁 Aguinaldo y Bono 14",
        description: "Dos prestaciones anuales equivalentes a un salario cada una. Decreto 76-78 y Decreto 42-92.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Decreto 76-78</strong>: Ley de Aguinaldo para Trabajadores del Sector Privado.</li>
                <li><strong>Decreto 42-92</strong>: Bono Anual para Trabajadores del Sector Privado (Bono 14).</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Aguinaldo</strong>: 1 salario ordinario mensual por cada ano, pagadero en diciembre.</li>
                <li><strong>Bono 14</strong>: 1 salario ordinario mensual por cada ano, pagadero en julio.</li>
                <li>Al finalizar la relacion laboral, se paga la parte proporcional de ambos.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en GTQ</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_periodo</td><td className="py-1">Dias del ano en curso hasta la fecha de salida</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formulas</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`aguinaldo_proporcional = salario_mensual * (dias_periodo / 365)
bono14_proporcional = salario_mensual * (dias_periodo / 365)`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de Q8,000, salida el 31 de octubre (304 dias)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>aguinaldo = 8,000 * (304 / 365) = 8,000 * 0.833 = <strong>Q6,664</strong></li>
                  <li>bono14 = 8,000 * (304 / 365) = <strong>Q6,664</strong></li>
                  <li>total = Q6,664 + Q6,664 = <strong>Q13,328</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Excepciones</h2>
              <p className="text-sm">Aguinaldo y Bono 14 estan exentos de deducciones (IGSS e ISR).</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Decreto 76-78 y Decreto 42-92. Corpus: <code>gt-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/guatemala/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "15 dias habiles de vacaciones por cada ano. Art. 130 Codigo de Trabajo.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 130</strong>: 15 dias habiles de vacaciones remuneradas por cada ano de servicio continuo.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>15 dias habiles de vacaciones por cada ano trabajado.</li>
                <li>Se pagan las vacaciones no gozadas al cierre de la relacion laboral.</li>
                <li>Base de calculo: ultimo salario ordinario.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en GTQ</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_vacaciones_pendientes</td><td className="py-1">Dias de vacaciones acumulados no gozados</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de Q8,000, 8 dias de vacaciones pendientes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 8,000 / 30 = <strong>Q266.67</strong></li>
                  <li>vacaciones = 266.67 * 8 = <strong>Q2,133</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo Decreto 1441, Art. 130. Corpus: <code>gt-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/guatemala/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Pago proporcional del mes en curso. Arts. 68-76 Codigo de Trabajo.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Arts. 68-76</strong>: Regulacion del salario ordinario y pago proporcional.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">Se liquida el salario pendiente del periodo en curso al momento de la salida. Base: ultimo salario ordinario mensual.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en GTQ</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_trabajados</td><td className="py-1">Dias trabajados en el mes de salida</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
salario_proporcional = salario_diario * dias_trabajados`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de Q8,000, salida el dia 20 del mes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 8,000 / 30 = <strong>Q266.67</strong></li>
                  <li>salario_proporcional = 266.67 * 20 = <strong>Q5,333</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo Decreto 1441, Arts. 68-76. Corpus: <code>gt-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/guatemala/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "IGSS 4.83% e ISR 5% sobre conceptos imponibles. Codigo de Trabajo Art. 88.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Codigo de Trabajo Art. 88</strong>: Del salario se hacen deducciones legales.</li>
                <li><strong>Ley del IGSS</strong>: Cotizacion del 4.83% para el trabajador.</li>
                <li><strong>Ley del ISR</strong>: Impuesto sobre la renta del trabajo.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>IGSS se calcula sobre salario proporcional + vacaciones pagadas.</li>
                <li>ISR se calcula sobre ingreso bruto menos IGSS, aguinaldo y bono 14.</li>
                <li>Aguinaldo y Bono 14 estan exentos de deducciones.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formulas</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`igss_laboral = (salario_prop. + vacaciones) * 0.0483
isr_base = ingreso_bruto - igss - aguinaldo - bono14
isr_laboral = max(isr_base, 0) * 0.05
total_deducciones = igss_laboral + isr_laboral`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Ingreso bruto Q64,458, base IGSS Q7,466</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>igss = 7,466 * 0.0483 = <strong>Q361</strong></li>
                  <li>isr_base = 64,458 - 361 - 6,664 - 6,664 = <strong>Q50,769</strong></li>
                  <li>isr = max(50,769, 0) * 0.05 = <strong>Q2,538</strong></li>
                  <li>total deducciones = 361 + 2,538 = <strong>Q2,899</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo Art. 88 + Ley IGSS + Ley ISR. Corpus: <code>gt-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/guatemala/igss",
      data: {
        title: "🛡 IGSS laboral",
        description: "Cotizacion del 4.83% al Instituto Guatemalteco de Seguridad Social.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Ley del Instituto Guatemalteco de Seguridad Social.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>La cotizacion laboral se aplica sobre el salario ordinario y prestaciones imponibles.</li>
                <li>Tasa laboral: 4.83% sobre el salario.</li>
                <li>Tasa patronal: 10.67% (no descontada al trabajador).</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`igss_laboral = base_igss * 0.0483`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base IGSS de Q7,466</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>igss = 7,466 * 0.0483 = <strong>Q361</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley del IGSS. Tasa: 4.83% (pendiente confirmacion oficial). Corpus: <code>gt-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/guatemala/isr",
      data: {
        title: "📊 ISR rentas del trabajo",
        description: "Impuesto sobre la renta del trabajo al 5% simplificado. Ley del ISR.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Ley del Impuesto Sobre la Renta (ISR) de Guatemala.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>Se aplica sobre la renta imponible despues de deducciones permitidas.</li>
                <li>Base ISR = Ingreso bruto - IGSS - aguinaldo - bono 14.</li>
                <li>En el MVP inicial se usa una tasa simplificada del 5%.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`isr_laboral = max(base_isr, 0) * 0.05`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base ISR de Q50,769</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>isr = max(50,769, 0) * 0.05 = <strong>Q2,538</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Excepciones</h2>
              <p className="text-sm">Aguinaldo y Bono 14 exentos de ISR.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley del ISR. Tasa: 5% simplificada (pendiente tabla progresiva oficial). Corpus: <code>gt-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/honduras/index",
      slugs: ["legal", "honduras"],
      data: {
        title: "⚖ Honduras, marco legal",
        description: "Codigo de Trabajo Decreto 189-59 y Decreto 133-92 (Decimotercer Mes).",
        body: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              El sistema laboral hondureno se rige por el <strong>Codigo de Trabajo (Decreto
              189-59)</strong> y la <strong>Ley del Decimotercer Mes (Decreto 133-92)</strong>.
              Esta seccion documenta las reglas operativas usadas por el motor de calculo, los
              articulos aplicables y ejemplos practicos por rubro.
            </p>
            <p className="text-sm text-muted-foreground">
              Version del corpus: <code>hn-v0.1.0</code>
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/honduras/indemnizacion">💼 Indemnizacion por antiguedad</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/honduras/aguinaldo">🎁 Aguinaldo (Decimotercer Mes)</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/honduras/vacaciones">🌴 Vacaciones pendientes</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/honduras/salario-proporcional">🧾 Salario pendiente</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/honduras/deducciones">➖ Deducciones legales</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/honduras/ihss">🛡 IHSS laboral</Link></li>
            </ul>
            <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">
              Aviso: contenido informativo. Para casos complejos validar con asesoria legal.
            </div>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/honduras/indemnizacion",
      data: {
        title: "💼 Indemnizacion por antiguedad",
        description: "Auxilio de cesantia: 1 mes por ano, maximo 25 meses. Arts. 116, 120, 123 Codigo de Trabajo.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 116</strong>: Preaviso segun tiempo de servicio (1 sem a 2 meses).</li>
                <li><strong>Art. 120</strong>: Auxilio de cesantia por antiguedad.</li>
                <li><strong>Art. 123(b)</strong>: Base de calculo: promedio salarial ultimos 6 meses.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>3 a 6 meses</strong>: 10 dias de salario.</li>
                <li><strong>6 a 12 meses</strong>: 20 dias de salario.</li>
                <li><strong>1 ano o mas</strong>: 1 mes (30 dias) de salario por cada ano.</li>
                <li>Fracciones de ano se pagan proporcionalmente.</li>
                <li><strong>Maximo</strong>: 750 dias (25 meses).</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en HNL</td></tr>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">anos_antiguedad</td><td className="py-1">Anos completos desde inicio hasta salida</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">salario_diario</td><td className="py-1">salario_mensual / 30</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
dias_indemnizacion = min(anos_antiguedad * 30, 750)
monto_indemnizacion = salario_diario * dias_indemnizacion`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Trabajador con 8 anos de antiguedad y salario de L15,000</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 15,000 / 30 = <strong>L500</strong></li>
                  <li>dias_indemnizacion = min(8 * 30, 750) = min(240, 750) = <strong>240</strong></li>
                  <li>monto = 500 * 240 = <strong>L120,000</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Excepciones</h2>
              <p className="text-sm">No aplica si el trabajador esta cubierto por pension equivalente del IHSS (Art. 120-f).</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo Decreto 189-59, Arts. 116, 120, 123. Corpus: <code>hn-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/honduras/aguinaldo",
      data: {
        title: "🎁 Aguinaldo (Decimotercer Mes)",
        description: "Un salario mensual adicional por ano, proporcional al cierre. Decreto 133-92.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Decreto 133-92</strong>: Ley del Decimotercer Mes de Honduras.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>1 salario mensual ordinario por cada ano de servicio.</li>
                <li>Al finalizar la relacion laboral, se paga la parte proporcional al tiempo trabajado en el periodo vigente.</li>
                <li>Base: salario ordinario mensual.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en HNL</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_periodo</td><td className="py-1">Dias del ano en curso hasta la fecha de salida</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`aguinaldo_proporcional = salario_mensual * (dias_periodo / 365)`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de L15,000, salida el 31 de octubre (304 dias)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>aguinaldo = 15,000 * (304 / 365) = 15,000 * 0.833 = <strong>L12,495</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Excepciones</h2>
              <p className="text-sm">Aguinaldo exento de deducciones IHSS.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Decreto 133-92. Corpus: <code>hn-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/honduras/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "Escala progresiva: 10 a 20 dias habiles segun antiguedad. Art. 346 Codigo de Trabajo.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 346</strong>: Escala de vacaciones segun anos de servicio continuo.</li>
                <li><strong>Art. 349</strong>: Al terminar, se pagan vacaciones no gozadas proporcionalmente.</li>
                <li><strong>Art. 352</strong>: Base: promedio ordinario ultimos 6 meses.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>1 ano</strong>: 10 dias habiles.</li>
                <li><strong>2 anos</strong>: 12 dias habiles.</li>
                <li><strong>3 anos</strong>: 15 dias habiles.</li>
                <li><strong>4 anos o mas</strong>: 20 dias habiles.</li>
                <li>Se pagan las vacaciones no gozadas al cierre de la relacion laboral.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en HNL</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_vacaciones_pendientes</td><td className="py-1">Dias de vacaciones acumulados no gozados</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de L15,000, 10 dias de vacaciones pendientes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 15,000 / 30 = <strong>L500</strong></li>
                  <li>vacaciones = 500 * 10 = <strong>L5,000</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo Decreto 189-59, Arts. 346, 349, 352. Corpus: <code>hn-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/honduras/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Pago proporcional del mes en curso. Arts. 322 y 378 Codigo de Trabajo.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 322</strong>: Regla de salario semanal (44h pagadas como 48h).</li>
                <li><strong>Art. 378</strong>: Pago proporcional por obra o tiempo trabajado.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">Se liquida el salario pendiente del periodo en curso al momento de la salida, calculado de forma proporcional a los dias trabajados.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en HNL</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_trabajados</td><td className="py-1">Dias trabajados en el mes de salida</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
salario_proporcional = salario_diario * dias_trabajados`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de L15,000, salida el dia 18 del mes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 15,000 / 30 = <strong>L500</strong></li>
                  <li>salario_proporcional = 500 * 18 = <strong>L9,000</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo Decreto 189-59, Arts. 322 y 378. Corpus: <code>hn-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/honduras/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "IHSS 3.5% sobre base imponible. Codigo de Trabajo Art. 667.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 667 (Art. 95.5)</strong>: Deducciones solo permitidas por ley, orden judicial o autorizacion escrita.</li>
                <li><strong>Ley del IHSS</strong>: Cotizacion laboral obligatoria.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>IHSS se calcula sobre salario proporcional + vacaciones pagadas.</li>
                <li>Aguinaldo proporcional exento de deducciones.</li>
                <li>Solo se aplican deducciones permitidas legalmente.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`ihss_laboral = (salario_prop. + vacaciones) * 0.035
total_deducciones = ihss_laboral`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base IHSS de L14,000 (salario prop. L9,000 + vac. L5,000)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>ihss = 14,000 * 0.035 = <strong>L490</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo Art. 667 + Ley del IHSS. Corpus: <code>hn-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/honduras/ihss",
      data: {
        title: "🛡 IHSS laboral",
        description: "Cotizacion del 3.5% al Instituto Hondureno de Seguridad Social.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Ley del Instituto Hondureno de Seguridad Social y su reglamento.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>La cotizacion laboral se aplica sobre el salario ordinario y prestaciones imponibles.</li>
                <li>Tasa laboral propuesta: 3.5% sobre el salario.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`ihss_laboral = base_ihss * 0.035`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base IHSS de L14,000</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>ihss = 14,000 * 0.035 = <strong>L490</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley del IHSS. Tasa: 3.5% (pendiente confirmacion oficial). Corpus: <code>hn-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/index",
      slugs: ["legal", "elsalvador"],
      data: {
        title: "⚖ El Salvador, marco legal",
        description: "Codigo de Trabajo de El Salvador, Ley del ISSS y Ley del SAP (AFP).",
        body: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              El sistema laboral salvadoreno se rige por el <strong>Codigo de Trabajo</strong>, la
              <strong> Ley del Seguro Social (ISSS)</strong> y la <strong>Ley del Sistema de Ahorro
              para Pensiones (AFP)</strong>. Esta seccion documenta las reglas operativas usadas por
              el motor de calculo, los articulos aplicables y ejemplos practicos por rubro.
            </p>
            <p className="text-sm text-muted-foreground">
              Version del corpus: <code>sv-v0.1.0</code> | Moneda: USD
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/indemnizacion">💼 Indemnizacion por despido</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/aguinaldo">🎁 Aguinaldo</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/vacaciones">🌴 Vacaciones pendientes</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/salario-proporcional">🧾 Salario pendiente</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/deducciones">➖ Deducciones legales</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/isss">🏥 ISSS laboral</Link></li>
              <li className="sm:col-span-2"><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/elsalvador/afp">💰 AFP laboral</Link></li>
            </ul>
            <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">
              Aviso: contenido informativo. Para casos complejos validar con asesoria legal.
            </div>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/indemnizacion",
      data: {
        title: "💼 Indemnizacion por despido",
        description: "30 dias de salario por cada ano, minimo 15 dias. Arts. 58-59 Codigo de Trabajo.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 58</strong>: Indemnizacion por despido injustificado en contrato por tiempo indeterminado: 30 dias por ano.</li>
                <li><strong>Art. 59</strong>: Indemnizacion en contrato a plazo fijo: salario por tiempo restante, tope del Art. 58.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>30 dias de salario por cada ano de servicio.</li>
                <li>Fracciones de ano se pagan proporcionalmente.</li>
                <li><strong>Minimo</strong>: 15 dias de salario.</li>
                <li>Base: salario ordinario mensual.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en USD</td></tr>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">anos_antiguedad</td><td className="py-1">Anos desde inicio hasta salida</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">salario_diario</td><td className="py-1">salario_mensual / 30</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
dias_indemnizacion = max(anos_antiguedad * 30, 15)
monto_indemnizacion = salario_diario * dias_indemnizacion`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Trabajador con 4 anos y salario de $1,200</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 1,200 / 30 = <strong>$40</strong></li>
                  <li>dias_indemnizacion = max(4 * 30, 15) = max(120, 15) = <strong>120</strong></li>
                  <li>monto = 40 * 120 = <strong>$4,800</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo de El Salvador, Arts. 58 y 59. Corpus: <code>sv-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/aguinaldo",
      data: {
        title: "🎁 Aguinaldo",
        description: "Escala progresiva de 15, 19 o 21 dias de salario segun antiguedad. Arts. 196-202.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 196</strong>: Obligacion de pago de aguinaldo anual.</li>
                <li><strong>Art. 197</strong>: Pago completo (1 ano+) o proporcional.</li>
                <li><strong>Art. 198</strong>: Monto minimo escalonado segun antiguedad.</li>
                <li><strong>Art. 202</strong>: Pago proporcional al terminar la relacion laboral.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>1 a 3 anos</strong>: 15 dias de salario.</li>
                <li><strong>3 a 10 anos</strong>: 19 dias de salario.</li>
                <li><strong>10 anos o mas</strong>: 21 dias de salario.</li>
                <li>Al terminar la relacion, proporcional al periodo trabajado en el ano.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en USD</td></tr>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">anos_antiguedad</td><td className="py-1">Anos de servicio para determinar escala</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_periodo</td><td className="py-1">Dias del ano en curso hasta la fecha de salida</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`escala = 15 si anos < 3, 19 si anos < 10, 21 si anos >= 10
aguinaldo_prop. = (salario / 30) * escala * (dias_periodo / 365)`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario $1,200, 6 anos de servicio, salida octubre (304 dias)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>escala = 19 (3 a 10 anos)</li>
                  <li>diario = 1,200 / 30 = <strong>$40</strong></li>
                  <li>aguinaldo = 40 * 19 * (304 / 365) = 40 * 19 * 0.833 = <strong>$633</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Excepciones</h2>
              <p className="text-sm">Aguinaldo exento de deducciones ISSS y AFP.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo Arts. 196-202. Corpus: <code>sv-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "15 dias con prima del 30% sobre salario ordinario. Arts. 177 y 187.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 177</strong>: 15 dias de vacaciones despues de 1 ano de trabajo, pagadas a salario ordinario + 30% de prima.</li>
                <li><strong>Art. 187</strong>: Pago proporcional al terminar la relacion laboral.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>15 dias de vacaciones remuneradas por cada ano de servicio.</li>
                <li><strong>Prima del 30%</strong> sobre el salario ordinario.</li>
                <li>Se pagan vacaciones no gozadas al cierre de la relacion.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en USD</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_vacaciones_pendientes</td><td className="py-1">Dias de vacaciones acumulados no gozados</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes * 1.30`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de $1,200, 8 dias de vacaciones pendientes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 1,200 / 30 = <strong>$40</strong></li>
                  <li>vacaciones = 40 * 8 * 1.30 = <strong>$416</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo de El Salvador, Arts. 177 y 187. Corpus: <code>sv-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Pago proporcional del mes en curso. Codigo de Trabajo.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Principio general del Codigo de Trabajo de El Salvador. El salario se debe en proporcion al tiempo trabajado.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en USD</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_trabajados</td><td className="py-1">Dias trabajados en el mes de salida</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
salario_proporcional = salario_diario * dias_trabajados`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de $1,200, salida el dia 22 del mes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 1,200 / 30 = <strong>$40</strong></li>
                  <li>salario_proporcional = 40 * 22 = <strong>$880</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo de El Salvador. Corpus: <code>sv-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "ISSS 3% + AFP 7.25%. Tope legal 20% del salario (Art. 132).",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 132</strong>: Tope maximo de deducciones del 20% del salario.</li>
                <li><strong>Ley del ISSS</strong>: Cotizacion de salud: 3% trabajador.</li>
                <li><strong>Ley del SAP (AFP)</strong>: Cotizacion previsional: 7.25% trabajador.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>ISSS + AFP no pueden exceder el 20% del salario.</li>
                <li>Base: salario proporcional + vacaciones pagadas.</li>
                <li>Aguinaldo exento de deducciones.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formulas</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`isss = base * 0.03
afp = base * 0.0725
total = isss + afp
(maximo 20% del salario)`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base de $1,296 (salario prop. $880 + vac. $416)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>isss = 1,296 * 0.03 = <strong>$39</strong></li>
                  <li>afp = 1,296 * 0.0725 = <strong>$94</strong></li>
                  <li>total = 39 + 94 = <strong>$133</strong></li>
                  <li>(tope 20% = $259, no excedido)</li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo Art. 132 + Ley ISSS + Ley SAP. Corpus: <code>sv-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/isss",
      data: {
        title: "🏥 ISSS laboral",
        description: "Cotizacion del 3% al Seguro Social de El Salvador.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Ley del Seguro Social de El Salvador.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">La cotizacion laboral del ISSS se aplica sobre el salario ordinario y prestaciones imponibles. Tasa laboral: 3%.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`isss_laboral = base_isss * 0.03`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base ISSS de $1,296</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>isss = 1,296 * 0.03 = <strong>$39</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley del ISSS. Tasa: 3% (pendiente confirmacion). Corpus: <code>sv-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/elsalvador/afp",
      data: {
        title: "💰 AFP laboral",
        description: "Cotizacion del 7.25% al Sistema de Ahorro para Pensiones.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Ley del Sistema de Ahorro para Pensiones (SAP), Decreto 927.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">La cotizacion previsional se aplica sobre el salario ordinario. Tasa laboral propuesta: 7.25%.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`afp_laboral = base_afp * 0.0725`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base AFP de $1,296</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>afp = 1,296 * 0.0725 = <strong>$94</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Decreto 927 (Ley SAP). Tasa: 7.25% (pendiente confirmacion). Corpus: <code>sv-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/costarica/index",
      slugs: ["legal", "costarica"],
      data: {
        title: "⚖ Costa Rica, marco legal",
        description: "Codigo de Trabajo de Costa Rica, Ley 2412 (Aguinaldo) y Ley Constitutiva de la CCSS.",
        body: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              El sistema laboral costarricense se rige por el <strong>Codigo de Trabajo</strong>, la
              <strong> Ley del Aguinaldo (Ley 2412)</strong> y la <strong>Ley Constitutiva de la
              CCSS (Ley 17)</strong>. Esta seccion documenta las reglas operativas usadas por el
              motor de calculo, los articulos aplicables y ejemplos practicos por rubro.
            </p>
            <p className="text-sm text-muted-foreground">
              Version del corpus: <code>cr-v0.1.0</code> | Moneda: CRC (Colon)
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/costarica/indemnizacion">💼 Cesantia y Preaviso</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/costarica/aguinaldo">🎁 Aguinaldo</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/costarica/vacaciones">🌴 Vacaciones pendientes</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/costarica/salario-proporcional">🧾 Salario pendiente</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/costarica/deducciones">➖ Deducciones legales</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/costarica/ccss">🏥 CCSS laboral</Link></li>
            </ul>
            <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">
              Aviso: contenido informativo. Para casos complejos validar con asesoria legal.
            </div>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/costarica/indemnizacion",
      data: {
        title: "💼 Cesantia y Preaviso",
        description: "Cesantia ~20 dias/ano (max 8 anos) + preaviso 7/15/30 dias. Arts. 28-30 Codigo de Trabajo.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 28</strong>: Preaviso: 1 sem (3-6m), 15d (6-12m), 1 mes (+1a).</li>
                <li><strong>Art. 29</strong>: Cesantia: tabla progresiva ~20 dias/ano, max 8 anos.</li>
                <li><strong>Art. 30</strong>: Base: promedio salarial ultimos 6 meses.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Cesantia</strong>: ~20 dias de salario por ano (max. 8 anos = 160 dias).</li>
                <li><strong>Preaviso</strong>: 7 dias (3-6m), 15 dias (6-12m), 30 dias (+1a).</li>
                <li>Base: promedio ordinario de ultimos 6 meses.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en CRC</td></tr>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">anos_antiguedad</td><td className="py-1">Anos desde inicio hasta salida</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">salario_diario</td><td className="py-1">salario_mensual / 30</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formulas</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
dias_cesantia = min(anos_antiguedad * 20, 160)
monto_cesantia = salario_diario * dias_cesantia
dias_preaviso = anos >= 1 ? 30 : meses >= 6 ? 15 : 7
monto_preaviso = salario_diario * dias_preaviso`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Trabajador con 5 anos y salario de CRC 800,000</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 800,000 / 30 = <strong>CRC 26,667</strong></li>
                  <li>dias_cesantia = min(5 * 20, 160) = min(100, 160) = <strong>100</strong></li>
                  <li>cesantia = 26,667 * 100 = <strong>CRC 2,666,700</strong></li>
                  <li>preaviso = 30 dias (1 ano+) = 26,667 * 30 = <strong>CRC 800,000</strong></li>
                  <li>total indemnizacion = 2,666,700 + 800,000 = <strong>CRC 3,466,700</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo de Costa Rica, Arts. 28, 29, 30. Corpus: <code>cr-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/costarica/aguinaldo",
      data: {
        title: "🎁 Aguinaldo",
        description: "Equivalente a 1/12 de salarios anuales. Ley No. 2412.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Ley No. 2412</strong>: Ley del Aguinaldo de Costa Rica.</li>
                <li>Equivalente a 1/12 del total de salarios devengados en el ano.</li>
                <li>Debe pagarse antes del 20 de diciembre.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>1/12 de salarios anuales, proporcional al tiempo trabajado.</li>
                <li>Al finalizar la relacion, se paga proporcional al periodo trabajado en el ano.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en CRC</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_periodo</td><td className="py-1">Dias del ano en curso hasta la fecha de salida</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`aguinaldo_proporcional = salario_mensual * (dias_periodo / 365)`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de CRC 800,000, salida el 30 de septiembre (273 dias)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>aguinaldo = 800,000 * (273 / 365) = 800,000 * 0.748 = <strong>CRC 598,400</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Excepciones</h2>
              <p className="text-sm">Aguinaldo exento de deducciones CCSS.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley No. 2412. Corpus: <code>cr-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/costarica/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "14 dias por cada 50 semanas de servicio. Arts. 153 y 156 Codigo de Trabajo.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 153</strong>: 2 semanas (14 dias) por cada 50 semanas de servicio continuo.</li>
                <li><strong>Art. 156</strong>: No compensables en dinero, excepto al terminar la relacion.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>14 dias de vacaciones por cada 50 semanas trabajadas.</li>
                <li>Al terminar antes de 50 semanas: 1 dia por mes trabajado.</li>
                <li>Se pagan las no gozadas al cierre.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en CRC</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_vacaciones_pendientes</td><td className="py-1">Dias de vacaciones acumulados no gozados</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de CRC 800,000, 10 dias de vacaciones pendientes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 800,000 / 30 = <strong>CRC 26,667</strong></li>
                  <li>vacaciones = 26,667 * 10 = <strong>CRC 266,670</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo de Costa Rica, Arts. 153 y 156. Corpus: <code>cr-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/costarica/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Pago proporcional del mes en curso.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Principio general del Codigo de Trabajo de Costa Rica.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en CRC</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_trabajados</td><td className="py-1">Dias trabajados en el mes de salida</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
salario_proporcional = salario_diario * dias_trabajados`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de CRC 800,000, salida el dia 18 del mes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 800,000 / 30 = <strong>CRC 26,667</strong></li>
                  <li>salario_proporcional = 26,667 * 18 = <strong>CRC 480,006</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo de Costa Rica. Corpus: <code>cr-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/costarica/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "CCSS 9.17% sobre base imponible. Ley Constitutiva de la CCSS.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Ley No. 17</strong>: Ley Constitutiva de la CCSS.</li>
                <li>CCSS: 9.17% (salud ~5.5% + pension ~2.84% + invalidez ~0.83%).</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>CCSS se calcula sobre salario proporcional + vacaciones pagadas.</li>
                <li>Aguinaldo exento de deducciones.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`ccss_laboral = base_ccss * 0.0917
total_deducciones = ccss_laboral`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base CCSS de CRC 746,676 (salario prop. + vacaciones)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>ccss = 746,676 * 0.0917 = <strong>CRC 68,470</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley No. 17 (Ley Constitutiva de la CCSS). Corpus: <code>cr-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/costarica/ccss",
      data: {
        title: "🏥 CCSS laboral",
        description: "Cotizacion del 9.17% a la Caja Costarricense de Seguro Social.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Ley Constitutiva de la CCSS (Ley No. 17).</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>Tasa laboral: 9.17% (salud ~5.5% + pension ~2.84% + invalidez ~0.83%).</li>
                <li>Se aplica sobre salario ordinario y prestaciones imponibles.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`ccss_laboral = base_ccss * 0.0917`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base CCSS de CRC 746,676</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>ccss = 746,676 * 0.0917 = <strong>CRC 68,470</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley No. 17. Tasa: 9.17% (pendiente confirmacion). Corpus: <code>cr-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/panama/index",
      slugs: ["legal", "panama"],
      data: {
        title: "⚖ Panama, marco legal",
        description: "Codigo de Trabajo de Panama, Ley 13 de 1994 (Decimotercer Mes) y Ley Organica de la CSS.",
        body: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              El sistema laboral panameno se rige por el <strong>Codigo de Trabajo</strong>, la
              <strong> Ley 13 de 1994 (Decimotercer Mes)</strong> y la <strong>Ley Organica de la
              Caja de Seguro Social (CSS)</strong>. Esta seccion documenta las reglas operativas
              usadas por el motor de calculo, los articulos aplicables y ejemplos practicos.
            </p>
            <p className="text-sm text-muted-foreground">
              Version del corpus: <code>pa-v0.1.0</code> | Moneda: USD
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/panama/indemnizacion">💼 Indemnizacion y Prima de Antiguedad</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/panama/aguinaldo">🎁 Decimotercer Mes</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/panama/vacaciones">🌴 Vacaciones pendientes</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/panama/salario-proporcional">🧾 Salario pendiente</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/panama/deducciones">➖ Deducciones legales</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/panama/css">🏥 CSS laboral</Link></li>
            </ul>
            <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">
              Aviso: contenido informativo. Para casos complejos validar con asesoria legal.
            </div>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/panama/indemnizacion",
      data: {
        title: "💼 Indemnizacion y Prima de Antiguedad",
        description: "Prima 7d/ano (Art. 224) + Indemnizacion 3.4 sem/ano (Art. 225-C). Codigo de Trabajo de Panama.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 224</strong>: Prima de antiguedad: 1 semana (7 dias) de salario por cada ano, toda terminacion.</li>
                <li><strong>Art. 225-C</strong>: Indemnizacion por despido injustificado: 3.4 semanas/ano primeros 10 anos, 1 sem/ano extra.</li>
                <li><strong>Art. 212</strong>: Preaviso de 30 dias para trabajadores exceptuados.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Prima de antiguedad</strong>: 7 dias de salario por cada ano, proporcional.</li>
                <li><strong>Indemnizacion</strong>: 3.4 sem/ano (23.8 dias) primeros 10 anos, luego 1 sem/ano (7 dias).</li>
                <li><strong>Minimo</strong>: 1 semana de salario.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en USD</td></tr>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">anos_antiguedad</td><td className="py-1">Anos desde inicio hasta salida</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">salario_diario</td><td className="py-1">salario_mensual / 30</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formulas</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
prima_antiguedad = salario_diario * anos * 7

dias_indemnizacion = min(anos,10)*23.8 + max(anos-10,0)*7
dias_indemnizacion = max(dias_indemnizacion, 7)
indemnizacion = salario_diario * dias_indemnizacion`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Trabajador con 7 anos y salario de $1,500</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 1,500 / 30 = <strong>$50</strong></li>
                  <li>prima = 50 * 7 * 7 = <strong>$2,450</strong></li>
                  <li>dias_indem = min(7,10)*23.8 + max(7-10,0)*7 = <strong>166.6</strong></li>
                  <li>indemnizacion = 50 * 166.6 = <strong>$8,330</strong></li>
                  <li>total = 2,450 + 8,330 = <strong>$10,780</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo de Panama, Arts. 224, 225. Corpus: <code>pa-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/panama/aguinaldo",
      data: {
        title: "🎁 Decimotercer Mes",
        description: "1/12 de salarios anuales. Ley 13 de 1994.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Ley 13 de 1994</strong>: Regula el Decimotercer Mes en Panama.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>Equivalente a 1/12 del total de salarios devengados en el ano.</li>
                <li>Proporcional al tiempo laborado al terminar la relacion.</li>
                <li>Base: salario ordinario mensual.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en USD</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_periodo</td><td className="py-1">Dias del ano en curso hasta la fecha de salida</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`decimotercer_mes = salario_mensual * (dias_periodo / 365)`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de $1,500, salida el 30 de septiembre (273 dias)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>decimo = 1,500 * (273 / 365) = 1,500 * 0.748 = <strong>$1,122</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley 13 de 1994. Corpus: <code>pa-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/panama/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "30 dias por cada 11 meses de servicio. Art. 54 Codigo de Trabajo.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 54</strong>: 30 dias de vacaciones por cada 11 meses de trabajo continuo.</li>
                <li>Tasa: 1 dia por cada 11 dias trabajados.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>30 dias de vacaciones remuneradas por cada 11 meses de servicio.</li>
                <li>Proporcional al tiempo trabajado al terminar la relacion.</li>
                <li>Base: promedio ordinario + extraordinario ultimos 11 meses.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en USD</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_vacaciones_pendientes</td><td className="py-1">Dias de vacaciones acumulados no gozados</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de $1,500, 12 dias de vacaciones pendientes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 1,500 / 30 = <strong>$50</strong></li>
                  <li>vacaciones = 50 * 12 = <strong>$600</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo de Panama, Art. 54. Corpus: <code>pa-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/panama/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Pago proporcional del mes en curso.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Principio general del Codigo de Trabajo de Panama.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Variables</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="pr-4 text-left font-medium">Variable</th><th className="text-left font-medium">Descripcion</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-1 pr-4 font-mono text-xs">salario_mensual</td><td className="py-1">Salario ordinario mensual en USD</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-xs">dias_trabajados</td><td className="py-1">Dias trabajados en el mes de salida</td></tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
salario_proporcional = salario_diario * dias_trabajados`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de $1,500, salida el dia 15 del mes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 1,500 / 30 = <strong>$50</strong></li>
                  <li>salario_proporcional = 50 * 15 = <strong>$750</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo de Panama. Corpus: <code>pa-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/panama/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "CSS 9.75% sobre base imponible. Tope legal 50% (Art. 161).",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 161</strong>: Tope maximo de deducciones del 50% del salario en efectivo (excepto pension alimenticia).</li>
                <li><strong>Ley Organica de la CSS</strong>: Cotizacion social obligatoria.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>CSS se calcula sobre salario proporcional + vacaciones pagadas.</li>
                <li>Tasa: 9.75% sobre base imponible.</li>
                <li>Tope maximo de deducciones: 50% del salario.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`css_laboral = base_css * 0.0975
total_deducciones = css_laboral
(maximo 50% del salario, Art. 161)`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base CSS de $1,350 (salario prop. $750 + vac. $600)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>css = 1,350 * 0.0975 = <strong>$132</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo de Trabajo Art. 161 + Ley Organica de la CSS. Corpus: <code>pa-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/panama/css",
      data: {
        title: "🏥 CSS laboral",
        description: "Cotizacion del 9.75% a la Caja de Seguro Social de Panama.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Ley Organica de la Caja de Seguro Social de Panama.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">Tasa laboral propuesta: 9.75% sobre el salario ordinario y prestaciones imponibles.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`css_laboral = base_css * 0.0975`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base CSS de $1,350</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>css = 1,350 * 0.0975 = <strong>$132</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley Organica de la CSS. Tasa: 9.75% (pendiente confirmacion). Corpus: <code>pa-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
      {
      type: "page",
      path: "legal/mexico/index",
      slugs: ["legal", "mexico"],
      data: {
        title: "⚖ Mexico, marco legal",
        description: "Ley Federal del Trabajo de Mexico, Ley del IMSS e INFONAVIT.",
        body: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              El sistema laboral mexicano se rige por la <strong>Ley Federal del Trabajo (LFT)</strong>,
              la <strong>Ley del Seguro Social (IMSS)</strong> y la <strong>Ley del INFONAVIT</strong>.
              Version del corpus: <code>mx-v0.1.0</code> | Moneda: MXN.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/mexico/indemnizacion">💼 Indemnizacion</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/mexico/aguinaldo">🎁 Aguinaldo</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/mexico/vacaciones">🌴 Vacaciones</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/mexico/salario-proporcional">🧾 Salario proporcional</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/mexico/deducciones">➖ Deducciones</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/mexico/imss">🏥 IMSS</Link></li>
            </ul>
            <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">
              Aviso: contenido informativo. Para casos complejos validar con asesoria legal.
            </div>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/mexico/indemnizacion",
      data: {
        title: "💼 Indemnizacion por despido",
        description: "3 meses constitucionales + 12 dias/ano + prima de antiguedad. Arts. 48, 50, 162 LFT.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 48</strong>: Indemnizacion constitucional de 3 meses de salario.</li>
                <li><strong>Art. 50</strong>: 12 dias de salario por cada ano (reforma 2019).</li>
                <li><strong>Art. 162</strong>: Prima de antiguedad: 12 dias/ano, tope 2 salarios minimos.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
total = salario_diario * 90 + salario_diario * anos * 12 + salario_diario * anos * 12`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de $20,000 MXN, 6 anos de antiguedad</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 20,000 / 30 = <strong>$666.67</strong></li>
                  <li>ind. constitucional = 666.67 * 90 = <strong>$60,000</strong></li>
                  <li>ind. anual = 666.67 * 6 * 12 = <strong>$48,000</strong></li>
                  <li>prima antiguedad = 666.67 * 6 * 12 = <strong>$48,000</strong></li>
                  <li><strong>Total: $156,000</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">LFT Arts. 48, 50, 162. Corpus: <code>mx-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/mexico/aguinaldo",
      data: {
        title: "🎁 Aguinaldo",
        description: "15 dias de salario minimo, proporcional al cierre. Art. 87 LFT.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Art. 87 LFT: 15 dias de salario como aguinaldo minimo, pagadero antes del 20 de diciembre.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`aguinaldo = (salario / 30) * 15 * (dias_periodo / 365)`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario $20,000 MXN, salida 30 septiembre (273 dias)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>aguinaldo = (20,000/30) * 15 * (273/365) = <strong>$7,480</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">LFT Art. 87. Corpus: <code>mx-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/mexico/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "Escala 6-12d segun antiguedad + prima 25%. Arts. 76-80 LFT.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 76</strong>: 6 dias al cumplir 1 ano, +2/ano hasta 12.</li>
                <li><strong>Art. 78</strong>: +2 cada 5 anos desde el 4to.</li>
                <li><strong>Art. 80</strong>: Prima vacacional minima del 25%.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`vacaciones = (salario / 30) * dias * 1.25`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario $20,000 MXN, 8 dias de vacaciones pendientes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 20,000 / 30 = <strong>$666.67</strong></li>
                  <li>vacaciones = 666.67 * 8 * 1.25 = <strong>$6,667</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">LFT Arts. 76-80. Corpus: <code>mx-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/mexico/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Pago proporcional del mes en curso.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_proporcional = (salario / 30) * dias_trabajados`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario $20,000 MXN, 18 dias trabajados</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_proporcional = (20,000/30) * 18 = <strong>$12,000</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/mexico/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "IMSS 2.5% sobre base imponible. Art. 110 LFT.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Art. 110 LFT + Ley del Seguro Social. IMSS ~2.5% sobre base. Aguinaldo exento.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`imss = base * 0.025`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base de $18,667</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>imss = 18,667 * 0.025 = <strong>$467</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/mexico/imss",
      data: {
        title: "🏥 IMSS laboral",
        description: "Cotizacion del 2.5% al Instituto Mexicano del Seguro Social.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">Tasa laboral propuesta: 2.5% sobre salario base de cotizacion (incluye seguro de enfermedades, maternidad, invalidez y vida).</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`imss = base_imss * 0.025`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley del Seguro Social. Corpus: <code>mx-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/index",
      slugs: ["legal", "colombia"],
      data: {
        title: "⚖ Colombia, marco legal",
        description: "Codigo Sustantivo del Trabajo, Ley 100 de 1993 y normas concordantes.",
        body: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              El sistema laboral colombiano se rige por el <strong>Codigo Sustantivo del Trabajo (CST)</strong>,
              la <strong>Ley 52 de 1975 (Cesantia)</strong>, la <strong>Ley 100 de 1993 (Sistema de
              Seguridad Social)</strong> y demas normas concordantes. Esta seccion documenta las reglas
              operativas usadas por el motor de calculo, los articulos aplicables y ejemplos practicos
              por rubro.
            </p>
            <p className="text-sm text-muted-foreground">
              Version del corpus: <code>co-v0.1.0</code> | Moneda: COP (Peso colombiano)
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/cesantia">💰 Cesantia</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/indemnizacion">💼 Indemnizacion por despido</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/prima-servicios">🎁 Prima de servicios</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/vacaciones">🌴 Vacaciones pendientes</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/salario-proporcional">🧾 Salario pendiente</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/deducciones">➖ Deducciones legales</Link></li>
              <li className="sm:col-span-2"><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/eps-pension">🏥 EPS y Pension</Link></li>
            </ul>
            <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">
              Aviso: contenido informativo. Para casos complejos validar con asesoria legal.
            </div>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/cesantia",
      data: {
        title: "💰 Cesantia",
        description: "30 dias de salario por cada ano de servicio + intereses del 12% anual. Arts. 249 CST y Ley 52/1975.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 249 CST</strong>: El empleador debe pagar un mes de salario por cada ano de servicio continuo o proporcional al tiempo trabajado como auxilio de cesantia.</li>
                <li><strong>Ley 52 de 1975</strong>: Regula los intereses sobre cesantias a una tasa minima del 12% anual sobre el valor acumulado.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
cesantia = salario_diario * anos_antiguedad * 30
intereses = cesantia * 0.12
total = cesantia + intereses`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Trabajador con 5 anos de antiguedad y salario de COP 2,000,000</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 2,000,000 / 30 = <strong>COP 66,667</strong></li>
                  <li>cesantia = 66,667 * 5 * 30 = <strong>COP 10,000,000</strong></li>
                  <li>intereses = 10,000,000 * 0.12 = <strong>COP 1,200,000</strong></li>
                  <li>total = 10,000,000 + 1,200,000 = <strong>COP 11,200,000</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo Sustantivo del Trabajo Art. 249. Ley 52 de 1975. Corpus: <code>co-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/indemnizacion",
      data: {
        title: "💼 Indemnizacion por despido",
        description: "30 dias el primer ano y 20 dias por cada ano adicional. Art. 64 CST.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 64 CST</strong>: Indemnizacion por despido sin justa causa en contratos a termino indefinido.</li>
              </ul>
              <p className="mt-2 text-sm">Cuando el salario es inferior a 10 SMMLV, se aplica la siguiente tabla:</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Primer ano</strong>: 30 dias de salario.</li>
                <li><strong>Anos adicionales</strong>: 20 dias de salario por cada ano adicional al primero.</li>
                <li>Fracciones de ano se pagan proporcionalmente.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
dias_indemnizacion = 30 + max(anos_antiguedad - 1, 0) * 20
monto_indemnizacion = salario_diario * dias_indemnizacion`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Trabajador con 4 anos de antiguedad, salario de COP 2,000,000 (&lt;10 SMMLV)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 2,000,000 / 30 = <strong>COP 66,667</strong></li>
                  <li>dias_indemnizacion = 30 + max(4 - 1, 0) * 20 = 30 + 60 = <strong>90</strong></li>
                  <li>monto = 66,667 * 90 = <strong>COP 6,000,000</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo Sustantivo del Trabajo Art. 64. Corpus: <code>co-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/prima-servicios",
      data: {
        title: "🎁 Prima de servicios",
        description: "30 dias de salario por ano, pagadera en dos cuotas. Art. 306 CST.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 306 CST</strong>: El empleador debe pagar una prima de servicios equivalente a 30 dias de salario por ano, pagadera en dos cuotas: 50% en junio y 50% en diciembre.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>30 dias de salario por cada ano de servicio (1 salario mensual).</li>
                <li>Se paga en dos cuotas: 50% a mas tardar el 30 de junio y 50% a mas tardar el 20 de diciembre.</li>
                <li>Al finalizar la relacion laboral, se liquida proporcional al tiempo trabajado en el semestre respectivo.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
prima_proporcional = salario_diario * 30 * (dias_periodo / 365)`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de COP 2,000,000, salida el 30 de septiembre (273 dias trabajados en el ano)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 2,000,000 / 30 = <strong>COP 66,667</strong></li>
                  <li>prima = 66,667 * 30 * (273 / 365) = 2,000,000 * 0.748 = <strong>COP 1,495,890</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo Sustantivo del Trabajo Art. 306. Corpus: <code>co-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "15 dias habiles de vacaciones por cada ano de servicio. Arts. 186, 189 CST.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 186 CST</strong>: Los trabajadores tienen derecho a 15 dias habiles consecutivos de vacaciones remuneradas por cada ano de servicio.</li>
                <li><strong>Art. 189 CST</strong>: Las vacaciones deben pagarse con el salario ordinario que el trabajador devengue al momento de tomarlas.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>15 dias habiles de vacaciones por cada ano trabajado.</li>
                <li>Al terminar la relacion laboral, se pagan las vacaciones no gozadas.</li>
                <li>Base de calculo: salario ordinario mensual.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
vacaciones_pendientes = salario_diario * dias_vacaciones_pendientes`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de COP 2,000,000, 10 dias de vacaciones pendientes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 2,000,000 / 30 = <strong>COP 66,667</strong></li>
                  <li>vacaciones = 66,667 * 10 = <strong>COP 666,667</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo Sustantivo del Trabajo Arts. 186, 189. Corpus: <code>co-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Liquidacion proporcional del salario del mes en curso.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Principio general del Codigo Sustantivo del Trabajo: el salario se debe en proporcion al tiempo efectivamente trabajado durante el periodo de pago en curso.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_diario = salario_mensual / 30
salario_proporcional = salario_diario * dias_trabajados`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario de COP 2,000,000, salida el dia 18 del mes (18 dias trabajados)</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_diario = 2,000,000 / 30 = <strong>COP 66,667</strong></li>
                  <li>salario_proporcional = 66,667 * 18 = <strong>COP 1,200,000</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Codigo Sustantivo del Trabajo. Corpus: <code>co-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "EPS 4% + Pension 4%. Total 8% sobre conceptos imponibles. Ley 100 de 1993.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Ley 100 de 1993</strong>: Sistema de Seguridad Social Integral: salud (EPS) y pension.</li>
                <li><strong>Art. 204 Ley 100</strong>: Cotizacion al regimen de salud: 4% a cargo del trabajador.</li>
                <li><strong>Art. 20 Ley 100</strong>: Cotizacion al regimen de pensiones: 4% a cargo del trabajador.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>EPS (Salud)</strong>: 4% sobre el ingreso base de cotizacion.</li>
                <li><strong>Pension</strong>: 4% sobre el ingreso base de cotizacion.</li>
                <li><strong>Total</strong>: 8% sobre base imponible.</li>
                <li>Se aplica sobre salario proporcional + vacaciones pagadas.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`eps = base * 0.04
pension = base * 0.04
total_deducciones = eps + pension = base * 0.08`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base imponible de COP 1,200,000</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>eps = 1,200,000 * 0.04 = <strong>COP 48,000</strong></li>
                  <li>pension = 1,200,000 * 0.04 = <strong>COP 48,000</strong></li>
                  <li>total deducciones = 48,000 + 48,000 = <strong>COP 96,000</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley 100 de 1993, Arts. 20 y 204. Corpus: <code>co-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/eps-pension",
      data: {
        title: "🏥 EPS y Pension",
        description: "Cotizacion a salud (EPS 4%) y pension (4%). Ley 100 de 1993.",
        body: (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Ley 100 de 1993</strong>: Crea el Sistema de Seguridad Social Integral en Colombia.</li>
                <li><strong>EPS (Entidad Promotora de Salud)</strong>: 4% a cargo del trabajador sobre el ingreso base de cotizacion.</li>
                <li><strong>AFP (Administradora de Fondos de Pensiones)</strong>: 4% a cargo del trabajador sobre el ingreso base de cotizacion.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Regla operativa</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>Ambas cotizaciones son obligatorias y se descuentan al trabajador.</li>
                <li>La base de cotizacion incluye salario ordinario, vacaciones pagadas y otros conceptos imponibles.</li>
                <li>El empleador aporta una tasa adicional (no descontada al trabajador).</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`eps = base_cotizacion * 0.04
pension = base_cotizacion * 0.04`}</code></pre>
            </section>
            <section>
              <h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base de cotizacion de COP 1,200,000</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>eps = 1,200,000 * 0.04 = <strong>COP 48,000</strong></li>
                  <li>pension = 1,200,000 * 0.04 = <strong>COP 48,000</strong></li>
                  <li>total seguridad social = 48,000 + 48,000 = <strong>COP 96,000</strong></li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley 100 de 1993. Tasas: EPS 4%, Pension 4%. Corpus: <code>co-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
      {
      type: "page",
      path: "legal/colombia/index",
      slugs: ["legal", "colombia"],
      data: {
        title: "⚖ Colombia, marco legal",
        description: "Codigo Sustantivo del Trabajo y Ley 100 de 1993.",
        body: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              El sistema laboral colombiano se rige por el <strong>Codigo Sustantivo del Trabajo (CST)</strong>
              y la <strong>Ley 100 de 1993</strong> (Seguridad Social). Version del corpus: <code>co-v0.1.0</code> | Moneda: COP.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/cesantia">💰 Cesantia</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/indemnizacion">💼 Indemnizacion</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/prima-servicios">🎁 Prima de servicios</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/vacaciones">🌴 Vacaciones</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/salario-proporcional">🧾 Salario proporcional</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/deducciones">➖ Deducciones</Link></li>
              <li className="sm:col-span-2"><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/colombia/eps-pension">🏥 EPS y Pension</Link></li>
            </ul>
            <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">Aviso: contenido informativo.</div>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/cesantia",
      data: {
        title: "💰 Cesantia",
        description: "30 dias/ano + intereses 12%. Art. 249 CST + Ley 52/1975.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 249 CST</strong>: 30 dias por cada ano de servicio, proporcional por fraccion.</li>
                <li><strong>Art. 253 CST</strong>: Base: ultimo salario mensual o promedio del ultimo ano.</li>
                <li><strong>Ley 52/1975</strong>: Intereses del 12% anual sobre cesantias.</li>
              </ul>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`cesantia = (salario / 30) * anos * 30
intereses = cesantia * 0.12
total = cesantia + intereses`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario COP 2,000,000, 5 anos</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>cesantia = (2,000,000/30) * 5 * 30 = <strong>COP 10,000,000</strong></li>
                  <li>intereses = 10,000,000 * 0.12 = <strong>COP 1,200,000</strong></li>
                  <li><strong>Total: COP 11,200,000</strong></li>
                </ul>
              </div>
            </section>
            <section><h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">CST Arts. 249, 253 + Ley 52/1975. Corpus: <code>co-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/indemnizacion",
      data: {
        title: "💼 Indemnizacion por despido",
        description: "30d primer ano + 20d adicionales. Art. 64 CST.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Art. 64 CST: Salario &lt;10 SMMLV: 30 dias el primer ano + 20 dias por cada ano adicional. Fracciones proporcionales.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`indemnizacion = (salario / 30) * (30 + max(anos - 1, 0) * 20)`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario COP 2,000,000, 4 anos</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>dias = 30 + (4-1)*20 = 30 + 60 = <strong>90</strong></li>
                  <li>indemnizacion = (2,000,000/30) * 90 = <strong>COP 6,000,000</strong></li>
                </ul>
              </div>
            </section>
            <section><h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">CST Art. 64. Corpus: <code>co-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/prima-servicios",
      data: {
        title: "🎁 Prima de servicios",
        description: "30 dias/ano. Art. 306 CST.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Art. 306 CST: 30 dias de salario por ano, pagaderos en dos cuotas (junio y diciembre). Proporcional al tiempo trabajado.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`prima = (salario / 30) * 30 * (dias / 365)`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario COP 2,000,000, 273 dias laborados</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>prima = (2,000,000/30) * 30 * (273/365) = <strong>COP 1,495,890</strong></li>
                </ul>
              </div>
            </section>
            <section><h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">CST Art. 306. Corpus: <code>co-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "15 dias habiles/ano. Arts. 186, 189 CST.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Arts. 186 y 189 CST: 15 dias habiles de vacaciones por cada ano de servicio. Proporcional al tiempo trabajado al terminar la relacion.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`vacaciones = (salario / 30) * dias_pendientes`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario COP 2,000,000, 10 dias pendientes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>vacaciones = (2,000,000/30) * 10 = <strong>COP 666,667</strong></li>
                </ul>
              </div>
            </section>
            <section><h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">CST Arts. 186, 189. Corpus: <code>co-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Pago proporcional del mes en curso.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_proporcional = (salario / 30) * dias_trabajados`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario COP 2,000,000, 18 dias trabajados</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario = (2,000,000/30) * 18 = <strong>COP 1,200,000</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "EPS 4% + Pension 4%.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Ley 100 de 1993: EPS (salud) 4% + AFP (pension) 4% = 8% total sobre base.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`eps = base * 0.04
pension = base * 0.04
total = base * 0.08`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base COP 1,200,000</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>eps = 1,200,000 * 0.04 = <strong>COP 48,000</strong></li>
                  <li>pension = 1,200,000 * 0.04 = <strong>COP 48,000</strong></li>
                  <li><strong>Total: COP 96,000</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/colombia/eps-pension",
      data: {
        title: "🏥 EPS y Pension",
        description: "Salud 4%, Pension 4%.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">EPS (salud): 4% sobre salario base. AFP (pension): 4% sobre salario base. Ley 100 de 1993.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`eps = base * 0.04
pension = base * 0.04`}</code></pre>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/peru/index",
      slugs: ["legal", "peru"],
      data: {
        title: "⚖ Peru, marco legal",
        description: "Ley General de Trabajo y Sistema Nacional de Pensiones.",
        body: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              El sistema laboral peruano se rige por la <strong>Ley General de Trabajo</strong>,
              el <strong>D.L. 19990 (ONP)</strong> y la <strong>Ley 25897 (AFP)</strong>.
              Version del corpus: <code>pe-v0.1.0</code> | Moneda: PEN.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/peru/indemnizacion">💼 Indemnizacion</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/peru/cts">💰 CTS</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/peru/gratificaciones">🎁 Gratificaciones</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/peru/vacaciones">🌴 Vacaciones</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/peru/salario-proporcional">🧾 Salario proporcional</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/peru/deducciones">➖ Deducciones</Link></li>
              <li className="sm:col-span-2"><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/peru/onp-afp">🏦 ONP y AFP</Link></li>
            </ul>
            <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">Aviso: contenido informativo.</div>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/peru/indemnizacion",
      data: {
        title: "💼 Indemnizacion por despido",
        description: "45/30/15 dias/ano segun antiguedad. Art. 167.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 167</strong>: Anos 1-8: 45d/ano. Anos 9-16: 30d/ano. Anos 17+: 15d/ano.</li>
                <li>Minimo: 90 dias. Maximo: 720 dias.</li>
              </ul>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`t1 = min(anos,8)*45 + max(min(anos-8,8),0)*30 + max(anos-16,0)*15
dias = min(max(t1, 90), 720)
indemnizacion = (salario/30) * dias`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario S/2,500, 6 anos</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>dias = 6*45 = <strong>270</strong></li>
                  <li>indemnizacion = (2,500/30) * 270 = <strong>S/22,500</strong></li>
                </ul>
              </div>
            </section>
            <section><h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Art. 167. Corpus: <code>pe-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/peru/cts",
      data: {
        title: "💰 CTS",
        description: "8.33% mensual (1 salario/ano). Art. 219.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Art. 219: CTS equivalente al 8.33% de la remuneracion mensual (~1 salario por ano).</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`cts = salario * 0.0833 * anos`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario S/2,500, 5 anos</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>cts = 2,500 * 0.0833 * 5 = <strong>S/1,041</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/peru/gratificaciones",
      data: {
        title: "🎁 Gratificaciones",
        description: "2 al ano (julio y diciembre). Arts. 206-208.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Arts. 206-208: 2 gratificaciones al ano (julio y diciembre), cada una de 1 remuneracion mensual. Proporcional al terminar.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`gratificacion = salario * 2 * (dias / 365)`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario S/2,500, 273 dias</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>gratificacion = 2,500 * 2 * (273/365) = <strong>S/3,740</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/peru/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "30 dias naturales/ano. Art. 285.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Art. 285: 30 dias naturales de vacaciones por cada ano. Art. 289: proporcional por fracciones al terminar.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`vacaciones = (salario / 30) * dias_pendientes`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario S/2,500, 12 dias pendientes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>vacaciones = (2,500/30) * 12 = <strong>S/1,000</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/peru/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Pago proporcional del mes en curso.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_proporcional = (salario / 30) * dias_trabajados`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario S/2,500, 18 dias trabajados</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario = (2,500/30) * 18 = <strong>S/1,500</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/peru/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "ONP 13% o AFP ~12.5%.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">D.L. 19990 (ONP): 13%. Ley 25897 (AFP): ~12.5% variable.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`onp = base * 0.13`}</code></pre>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/peru/onp-afp",
      data: {
        title: "🏦 ONP y AFP",
        description: "Sistema nacional (13%) o privado de pensiones.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">ONP (Sistema Nacional): 13%. AFP (Sistema Privado): ~12.5% incluyendo comision.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`onp = base * 0.13`}</code></pre>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/argentina/index",
      slugs: ["legal", "argentina"],
      data: {
        title: "⚖ Argentina, marco legal",
        description: "Ley de Contrato de Trabajo (Ley 20.744) y leyes previsionales.",
        body: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              El sistema laboral argentino se rige por la <strong>Ley de Contrato de Trabajo (Ley 20.744)</strong>,
              la <strong>Ley 23.041 (SAC)</strong> y las leyes previsionales. Version del corpus: <code>ar-v0.1.0</code> | Moneda: ARS.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/argentina/indemnizacion">💼 Indemnizacion</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/argentina/preaviso">📢 Preaviso</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/argentina/sac-aguinaldo">🎁 SAC / Aguinaldo</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/argentina/vacaciones">🌴 Vacaciones</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/argentina/salario-proporcional">🧾 Salario proporcional</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/argentina/deducciones">➖ Deducciones</Link></li>
            </ul>
            <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">Aviso: contenido informativo.</div>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/argentina/indemnizacion",
      data: {
        title: "💼 Indemnizacion por despido",
        description: "1 mes/ano. Art. 245 LCT.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 245 LCT</strong>: 1 mes de salario por cada ano o fraccion mayor a 3 meses.</li>
                <li>Base: mejor remuneracion mensual normal y habitual del ultimo ano.</li>
                <li>Tope: 3× el promedio CCT. Minimo: nunca menos de 1 mes.</li>
              </ul>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`indemnizacion = salario_mensual * anos_antiguedad`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario $500,000 ARS, 7 anos</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>indemnizacion = 500,000 * 7 = <strong>$3,500,000 ARS</strong></li>
                </ul>
              </div>
            </section>
            <section><h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">Ley 20.744 Art. 245. Corpus: <code>ar-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/argentina/preaviso",
      data: {
        title: "📢 Preaviso",
        description: "1 mes (≤5a) o 2 meses (>5a). Arts. 231-233.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 231</strong>: Hasta 5 anos: 1 mes. Mas de 5 anos: 2 meses de preaviso.</li>
                <li><strong>Art. 232</strong>: Indemnizacion sustitutiva si no se otorga preaviso.</li>
              </ul>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`dias = antiguedad > 5 ? 60 : 30
preaviso = (salario / 30) * dias`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario $500,000 ARS, 7 anos</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>dias = 60 (&gt;5 anos)</li>
                  <li>preaviso = (500,000/30) * 60 = <strong>$1,000,000 ARS</strong></li>
                </ul>
              </div>
            </section>
            <section><h2 className="text-base font-semibold">Vigencia</h2>
              <p className="text-sm text-muted-foreground">LCT Arts. 231-233. Corpus: <code>ar-v0.1.0</code></p>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/argentina/sac-aguinaldo",
      data: {
        title: "🎁 SAC / Aguinaldo",
        description: "50% mejor salario del semestre. Ley 23.041.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Ley 23.041: 50% de la mejor remuneracion mensual del semestre. Pagadero en junio y diciembre. Proporcional al terminar.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`sac = (mejor_salario * 0.5) * (dias_semestre / 181)`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario $500,000 ARS, 140 dias en el semestre</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>sac = (500,000 * 0.5) * (140/181) = <strong>$193,370 ARS</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/argentina/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "14-35d segun antiguedad. Salario/25. Arts. 150-155.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 150</strong>: 0-5a: 14d, 5-10a: 21d, 10-20a: 28d, 20a+: 35d.</li>
                <li><strong>Art. 155</strong>: Pago: salario mensual <strong>÷ 25</strong> por dia.</li>
              </ul>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_vacacional = salario / 25
vacaciones = salario_vacacional * dias_pendientes`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario $500,000 ARS, 14 dias pendientes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario_vacacional = 500,000 / 25 = <strong>$20,000</strong></li>
                  <li>vacaciones = 20,000 * 14 = <strong>$280,000 ARS</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/argentina/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Pago proporcional del mes en curso.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_proporcional = (salario / 30) * dias_trabajados`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario $500,000 ARS, 15 dias trabajados</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario = (500,000/30) * 15 = <strong>$250,000 ARS</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/argentina/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "Jubilacion 11% + PAMI 3% + Obra Social 3% = 17%.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Ley 24.241 (SIPA): 11%. Ley 19.032 (PAMI): 3%. Ley 23.660 (Obra Social): 3%. Total: 17%.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`total = base * 0.17`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base $280,000 ARS</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>total = 280,000 * 0.17 = <strong>$47,600 ARS</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/chile/index",
      slugs: ["legal", "chile"],
      data: {
        title: "⚖ Chile, marco legal",
        description: "Codigo del Trabajo de Chile, AFP, FONASA/ISAPRE y AFC.",
        body: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              El sistema laboral chileno se rige por el <strong>Codigo del Trabajo (DFL 1)</strong>,
              el <strong>D.L. 3.500 (AFP)</strong>, la <strong>Ley 18.933 (FONASA/ISAPRE)</strong>
              y la <strong>Ley 19.728 (AFC)</strong>. Version: <code>cl-v0.1.0</code> | Moneda: CLP.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/chile/indemnizacion">💼 Indemnizacion</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/chile/vacaciones">🌴 Vacaciones</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/chile/salario-proporcional">🧾 Salario proporcional</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/chile/deducciones">➖ Deducciones</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/chile/afp">💰 AFP</Link></li>
              <li><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/chile/salud">🏥 Salud</Link></li>
              <li className="sm:col-span-2"><Link className="block rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent" href="/docs/legal/chile/afc">🛡 AFC</Link></li>
            </ul>
            <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">Aviso: contenido informativo.</div>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/chile/indemnizacion",
      data: {
        title: "💼 Indemnizacion por anos de servicio",
        description: "30d/ano max 330d + aviso sustitutivo. Arts. 161-163.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li><strong>Art. 163</strong>: 30 dias por ano, fraccion mayor a 6m = ano completo. Max: 330d (11 anos).</li>
                <li><strong>Arts. 161-162</strong>: Aviso sustitutivo: 1 mes de ultima remuneracion.</li>
              </ul>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`ind_anos = (salario/30) * min(anos, 11) * 30
aviso = salario
total = ind_anos + aviso`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario $800,000 CLP, 8 anos</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>ind_anos = (800,000/30) * 8 * 30 = <strong>$6,400,000</strong></li>
                  <li>aviso = <strong>$800,000</strong></li>
                  <li><strong>Total: $7,200,000 CLP</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/chile/vacaciones",
      data: {
        title: "🌴 Vacaciones pendientes",
        description: "15d habiles + feriado progresivo. Arts. 67-73.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Art. 67: 15 dias habiles. Art. 68: feriado progresivo (+1d/3a desde 10 anos). Art. 73: proporcional al terminar.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`feriado_extra = max(0, floor((anos - 10) / 3))
vacaciones = (salario/30) * (15 + feriado_extra)`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario $800,000 CLP, 10 dias pendientes</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>vacaciones = (800,000/30) * 10 = <strong>$266,667 CLP</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/chile/salario-proporcional",
      data: {
        title: "🧾 Salario pendiente",
        description: "Pago proporcional del mes en curso.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salario_proporcional = (salario / 30) * dias_trabajados`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Salario $800,000 CLP, 15 dias trabajados</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>salario = (800,000/30) * 15 = <strong>$400,000 CLP</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/chile/deducciones",
      data: {
        title: "➖ Deducciones legales",
        description: "AFP 11.5% + Salud 7% + AFC 0.6% = 19.1%.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Base legal</h2>
              <p className="text-sm">Art. 58 Codigo del Trabajo. AFP: 11.5%. Salud: 7%. AFC: 0.6%. Total: ~19.1%.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`total = base * (0.115 + 0.07 + 0.006) = base * 0.191`}</code></pre>
            </section>
            <section><h2 className="text-base font-semibold">Ejemplo</h2>
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="mb-1 font-medium">Base $266,667 CLP</p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  <li>total = 266,667 * 0.191 = <strong>$50,933 CLP</strong></li>
                </ul>
              </div>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/chile/afp",
      data: {
        title: "💰 AFP",
        description: "Cotizacion del 11.5%.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">D.L. 3.500: 10% cotizacion obligatoria + ~1.5% comision AFP. Tasa simplificada: 11.5%.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`afp = base * 0.115`}</code></pre>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/chile/salud",
      data: {
        title: "🏥 Salud (FONASA/ISAPRE)",
        description: "Cotizacion del 7%.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">Ley 18.933: 7% sobre remuneracion imponible para FONASA o ISAPRE.</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`salud = base * 0.07`}</code></pre>
            </section>
          </div>
        ),
      },
    },
    {
      type: "page",
      path: "legal/chile/afc",
      data: {
        title: "🛡 AFC (Seguro Cesantia)",
        description: "Cotizacion del 0.6%.",
        body: (
          <div className="space-y-6">
            <section><h2 className="text-base font-semibold">Regla operativa</h2>
              <p className="text-sm">Ley 19.728: 0.6% trabajador (empleador paga 2.4% adicional).</p>
            </section>
            <section><h2 className="text-base font-semibold">Formula</h2>
              <pre className="rounded-lg bg-muted p-3 text-xs"><code>{`afc = base * 0.006`}</code></pre>
            </section>
          </div>
        ),
      },
    },
  ],
  metas: [
    {
      type: "meta",
      path: "meta.json",
      data: {
        title: "Documentación",
        pages: ["index", "guia-rapida", "legal"],
      },
    },
    {
      type: "meta",
      path: "legal/meta.json",
      data: {
        title: "Marco legal por país",
        pages: ["index", "nicaragua", "guatemala", "honduras", "elsalvador", "costarica", "panama", "mexico", "colombia", "peru", "argentina", "chile"],
      },
    },
    {
      type: "meta",
      path: "legal/chile/meta.json",
      data: {
        title: "Chile",
        pages: [
          "index",
          "indemnizacion",
          "vacaciones",
          "salario-proporcional",
          "deducciones",
          "afp",
          "salud",
          "afc",
        ],
      },
    },
    {
      type: "meta",
      path: "legal/argentina/meta.json",
      data: {
        title: "Argentina",
        pages: [
          "index",
          "indemnizacion",
          "preaviso",
          "sac-aguinaldo",
          "vacaciones",
          "salario-proporcional",
          "deducciones",
        ],
      },
    },
    {
      type: "meta",
      path: "legal/peru/meta.json",
      data: {
        title: "Peru",
        pages: [
          "index",
          "indemnizacion",
          "cts",
          "gratificaciones",
          "vacaciones",
          "salario-proporcional",
          "deducciones",
          "onp-afp",
        ],
      },
    },
    {
      type: "meta",
      path: "legal/colombia/meta.json",
      data: {
        title: "Colombia",
        pages: [
          "index",
          "cesantia",
          "indemnizacion",
          "prima-servicios",
          "vacaciones",
          "salario-proporcional",
          "deducciones",
          "eps-pension",
        ],
      },
    },
    {
      type: "meta",
      path: "legal/mexico/meta.json",
      data: {
        title: "Mexico",
        pages: [
          "index",
          "indemnizacion",
          "aguinaldo",
          "vacaciones",
          "salario-proporcional",
          "deducciones",
          "imss",
        ],
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
