# Plan: SEO minimalista basado en GSC

Fecha: 2026-07-06

Dominio canonico: `https://justo.stephanbarker.com`

Alcance: plan de mejoras SEO para aumentar usuarios que calculan y autoridad legal por pais, usando los exports en `docs/GSC-data/`. No incluye cambios de codigo en este documento.

## 1. Datos usados

1.1. Archivos revisados:

- `docs/GSC-data/justo.stephanbarker.com-Performance-on-Search-2026-07-06 - Consultas.csv`
- `docs/GSC-data/justo.stephanbarker.com-Performance-on-Search-2026-07-06 - Páginas.csv`
- `docs/GSC-data/justo.stephanbarker.com-Performance-on-Search-2026-07-06 - Países.csv`
- `docs/GSC-data/justo.stephanbarker.com-Performance-on-Search-2026-07-06 - Dispositivos.csv`
- `docs/GSC-data/justo.stephanbarker.com-Performance-on-Search-2026-07-06 - Gráfico.csv`

1.2. Baseline observable:

- Export de paginas: 35 clics, 7,920 impresiones, 204 URLs.
- Export de consultas: 13 clics, 5,166 impresiones, 1,000 consultas. La diferencia contra paginas es esperable por agregacion/anonimizacion de GSC.
- Dispositivos: mobile tiene 20 clics / 1,511 impresiones / CTR 1.32%; desktop tiene 15 clics / 5,819 impresiones / CTR 0.26%.
- Tendencia diaria: las impresiones crecen desde inicios de junio, pero el CTR sigue inestable y bajo.

## 2. Diagnostico

2.1. Justo ya aparece para busquedas con intencion de calculo, especialmente liquidacion, salario neto y vacaciones. El problema principal no es solo descubrir mas paginas, sino convertir impresiones existentes en clics y calculos iniciados.

2.2. Las URLs actuales con query params (`/tools/liquidacion-laboral?country=ni`, `/guia-laboral?country=co`) funcionan, pero no son ideales como URLs canonicas para busquedas tipo `calculadora de liquidacion Peru 2026` o `calculadora de vacaciones Nicaragua`.

2.3. El CTR bajo en desktop indica que los snippets/titulos no estan ganando contra competidores, aunque varias posiciones ya son razonables. Ejemplos: Nicaragua tiene posiciones cercanas a top 10 en consultas de liquidacion y salario neto, pero CTR bajo.

2.4. Colombia tiene el mayor volumen por pais en paginas, pero 0 clics: 2,091 impresiones, posicion media 68.7. Requiere enfoque mas especifico: cesantias, prima, vacaciones y calculadora laboral Colombia, no solo una pagina generica.

2.5. Las paginas legales reciben impresiones pero casi no clics. Eso no es malo si sirven como autoridad interna, pero deben enlazar de forma clara hacia calculadoras y tener titulos mas orientados a dudas reales.

2.6. El sitio debe mantener tono informativo, no prometer resultado definitivo. Todas las calculadoras se posicionan como estimaciones informativas con formulas, referencias legales y version de corpus.

## 3. Priorizacion

3.1. Todos los paises cubiertos por Justo son prioritarios. La diferencia no es si entran o no al plan, sino el orden de ejecucion segun senales actuales de GSC, esfuerzo y probabilidad de conversion.

3.2. Fases por pais:

- [x] Fase 1, captura de demanda existente: Nicaragua, Peru, Colombia, Costa Rica y Panama.
- [x] Fase 2, completar Centroamerica: Guatemala, El Salvador y Honduras.
- [x] Fase 3, completar mercados grandes/restantes: Mexico, Argentina y Chile.

3.3. Justificacion por pais:

- [ ] Nicaragua: 1,394 impresiones por paginas, 4 clics, posicion media 15.9. Mejor oportunidad de CTR y conversion porque ya rankea cerca.
- [ ] Peru: 756 impresiones por paginas, 8 clics, posicion media 49.0. Ya recibe clics para `calculadora de liquidacion Peru 2026`; necesita landings de herramienta limpias.
- [ ] Colombia: 2,091 impresiones por paginas, 0 clics, posicion media 68.7. Mayor upside, pero mas competitivo.
- [ ] Costa Rica: 317 impresiones por paginas, 7 clics, CTR 2.21%. Buenas senales iniciales.
- [ ] Panama: 277 impresiones por paginas, 2 clics. Volumen menor, pero hay consultas directas de liquidacion.
- [ ] Guatemala: 237 impresiones por paginas, 5 clics, posicion media 30.1. Buena senal inicial en herramienta de liquidacion.
- [ ] El Salvador: 280 impresiones por paginas, 3 clics, posicion media 43.3. Requiere landings especificas para liquidacion, salario neto, aguinaldo y AFP/ISSS.
- [ ] Honduras: 173 impresiones por paginas, 3 clics, posicion media 26.2. Volumen menor, pero posiciones iniciales utiles.
- [ ] Mexico: 841 impresiones por paginas, 0 clics, posicion media 74.1. Mercado competitivo; requiere contenido muy especifico y autoridad legal.
- [ ] Argentina: 617 impresiones por paginas, 0 clics, posicion media 74.2. Mercado competitivo; conviene posicionar finiquito/liquidacion, SAC, vacaciones e indemnizacion.
- [ ] Chile: 680 impresiones por paginas, 1 clic, posicion media 75.5. Mercado competitivo; conviene posicionar finiquito, vacaciones proporcionales, AFP/salud/AFC e indemnizacion.

3.4. Herramientas prioritarias por intencion:

- [ ] Liquidacion laboral: 2,237 impresiones en consultas y 12 clics. Es la categoria principal.
- [ ] Vacaciones: 690 impresiones en consultas y 0 clics. Hay oportunidad clara en Nicaragua y busquedas genericas.
- [ ] Salario neto: 575 impresiones en consultas y 1 clic. Nicaragua ya rankea bien; Peru, Mexico y Colombia tienen impresiones sin clics.
- [ ] Aguinaldo / decimo / bono: 263 impresiones en consultas y 0 clics. Debe integrarse como pagina secundaria por pais.
- [ ] Preaviso / indemnizacion: 255 impresiones en consultas y 0 clics. Util para autoridad legal y enlaces internos.
- [ ] Contratos: bajo volumen, pero puede atraer usuarios de mayor valor; mantener como herramienta de soporte.
- [ ] Terminacion: mantener como herramienta complementaria, enlazada desde liquidacion.

## 4. Estrategia de URLs

4.1. Mantener el sitio minimalista, pero crear URLs canonicas limpias para paginas con intencion de calculo. No crear articulos largos ni blog masivo.

4.2. Patron recomendado para paginas de herramienta por pais:

- `/es/ni/liquidacion-laboral`
- `/es/ni/vacaciones`
- `/es/ni/salario-neto`
- `/es/ni/aguinaldo-decimo-bono`
- `/es/ni/preaviso`
- `/es/ni/simulador-terminacion`
- `/es/ni/generador-contratos`

4.3. El titulo, H1 y metadata pueden usar `Calculadora de ...` aunque la URL conserve el slug corto. Esto evita slugs demasiado largos y reutiliza la taxonomia actual de herramientas.

4.4. Las URLs actuales con query params deben quedar como rutas funcionales o redirects, pero no como destino canonico en sitemap cuando exista equivalente limpio.

4.5. Canonical propuesto:

- `/tools/liquidacion-laboral?country=ni` -> canonical `/es/ni/liquidacion-laboral`.
- `/guia-laboral?country=ni` -> canonical `/es/ni/guia-laboral` si se crea ruta limpia; si no, no duplicar en sitemap.
- `/{country}` sin locale debe seguir redirigiendo 301 a `/es/{country}`.

## 5. Modelo de contenido minimalista

5.1. Cada landing de herramienta por pais debe ser corta y util. Estructura maxima:

- H1: `Calculadora de liquidacion laboral en Nicaragua 2026`.
- Intro de 2 frases: que calcula, que no promete.
- CTA visible: `Calcular ahora`.
- Lista breve: `Que calcula`.
- Lista breve: `Datos necesarios`.
- Formula resumida en lenguaje simple.
- Referencias legales principales y version del corpus.
- 2 o 3 FAQs reales.
- Disclaimer informativo.

5.2. Longitud objetivo: 350-700 palabras por pagina. Suficiente para resolver intencion, sin convertir el sitio en blog pesado.

5.3. No usar `open source` como promesa principal en titles/descriptions de calculadoras. Es diferenciador secundario, pero el usuario busca calcular.

5.4. Copy base para meta descriptions:

- Liquidacion: `Calcula liquidacion laboral en {Pais}: prestaciones, vacaciones, deducciones y total neto. Gratis, sin registro, con formulas y referencias legales.`
- Vacaciones: `Calcula vacaciones pendientes en {Pais} con salario, fechas y dias gozados. Resultado informativo con formula y referencia legal.`
- Salario neto: `Calcula salario neto en {Pais} desde tu salario bruto y deducciones aplicables. Gratis, sin registro y con desglose.`

## 6. Matriz de paginas por fase

6.1. Fase 0, base tecnica antes de escalar paginas:

- [x] Definir helpers compartidos para metadata, canonical, hreflang y JSON-LD por `country` + `tool`.
- [x] Definir generacion de sitemap solo con URLs canonicas limpias.
- [x] Definir redirects/canonicals desde URLs existentes con query params.
- [x] Confirmar que cada herramienta abre con pais y herramienta preseleccionados desde la landing.
- [x] Confirmar que cada landing incluye disclaimer informativo y version de corpus.

6.2. Fase 1, captura de demanda existente:

- [x] `/es/ni/liquidacion-laboral`
- [x] `/es/ni/vacaciones`
- [x] `/es/ni/salario-neto`
- [x] `/es/ni/aguinaldo-decimo-bono`
- [x] `/es/pe/liquidacion-laboral`
- [x] `/es/pe/salario-neto`
- [x] `/es/pe/vacaciones`
- [x] `/es/co/liquidacion-laboral`
- [x] `/es/co/vacaciones`
- [x] `/es/co/salario-neto`
- [x] `/es/co/aguinaldo-decimo-bono`
- [x] `/es/cr/liquidacion-laboral`
- [x] `/es/cr/vacaciones`
- [x] `/es/cr/salario-neto`
- [x] `/es/pa/liquidacion-laboral`
- [x] `/es/pa/vacaciones`
- [x] `/es/pa/salario-neto`

6.3. Fase 2, completar Centroamerica:

- [x] `/es/gt/liquidacion-laboral`
- [x] `/es/gt/vacaciones`
- [x] `/es/gt/salario-neto`
- [x] `/es/gt/aguinaldo-decimo-bono`
- [x] `/es/gt/preaviso`
- [x] `/es/gt/simulador-terminacion`
- [x] `/es/gt/generador-contratos`
- [x] `/es/sv/liquidacion-laboral`
- [x] `/es/sv/vacaciones`
- [x] `/es/sv/salario-neto`
- [x] `/es/sv/aguinaldo-decimo-bono`
- [x] `/es/sv/preaviso`
- [x] `/es/sv/simulador-terminacion`
- [x] `/es/sv/generador-contratos`
- [x] `/es/hn/liquidacion-laboral`
- [x] `/es/hn/vacaciones`
- [x] `/es/hn/salario-neto`
- [x] `/es/hn/aguinaldo-decimo-bono`
- [x] `/es/hn/preaviso`
- [x] `/es/hn/simulador-terminacion`
- [x] `/es/hn/generador-contratos`

6.4. Fase 3, completar mercados restantes:

- [x] `/es/mx/liquidacion-laboral`
- [x] `/es/mx/vacaciones`
- [x] `/es/mx/salario-neto`
- [x] `/es/mx/aguinaldo-decimo-bono`
- [x] `/es/mx/preaviso`
- [x] `/es/mx/simulador-terminacion`
- [x] `/es/mx/generador-contratos`
- [x] `/es/ar/liquidacion-laboral`
- [x] `/es/ar/vacaciones`
- [x] `/es/ar/salario-neto`
- [x] `/es/ar/aguinaldo-decimo-bono`
- [x] `/es/ar/preaviso`
- [x] `/es/ar/simulador-terminacion`
- [x] `/es/ar/generador-contratos`
- [x] `/es/cl/liquidacion-laboral`
- [x] `/es/cl/vacaciones`
- [x] `/es/cl/salario-neto`
- [x] `/es/cl/aguinaldo-decimo-bono`
- [x] `/es/cl/preaviso`
- [x] `/es/cl/simulador-terminacion`
- [x] `/es/cl/generador-contratos`

6.5. Fase 4, completar herramientas restantes en paises de fase 1:

- [x] `/es/ni/preaviso`
- [x] `/es/ni/simulador-terminacion`
- [x] `/es/ni/generador-contratos`
- [x] `/es/pe/aguinaldo-decimo-bono`
- [x] `/es/pe/preaviso`
- [x] `/es/pe/simulador-terminacion`
- [x] `/es/pe/generador-contratos`
- [x] `/es/co/preaviso`
- [x] `/es/co/simulador-terminacion`
- [x] `/es/co/generador-contratos`
- [x] `/es/cr/aguinaldo-decimo-bono`
- [x] `/es/cr/preaviso`
- [x] `/es/cr/simulador-terminacion`
- [x] `/es/cr/generador-contratos`
- [x] `/es/pa/aguinaldo-decimo-bono`
- [x] `/es/pa/preaviso`
- [x] `/es/pa/simulador-terminacion`
- [x] `/es/pa/generador-contratos`

6.6. Fase 5, evaluar version inglesa:

- [ ] Revisar si las paginas `/en/...` generan calculos o solo ruido de indexacion.
- [ ] Crear equivalentes en ingles solo para paginas con senal de busqueda o uso real.
- [ ] Si no hay senal, mantener ingles como app/documentacion secundaria y no expandir sitemap SEO en ingles.

## 7. Autoridad legal por pais

7.1. Cada pagina de calculadora debe enlazar a 2-4 documentos legales relevantes con anchor descriptivo, por ejemplo:

- `Indemnizacion laboral en Nicaragua`
- `Vacaciones en Nicaragua`
- `INSS e IR en Nicaragua`

7.2. Cada documento legal debe enlazar de vuelta a la calculadora correspondiente con CTA discreto:

- `Calcular liquidacion laboral en Nicaragua`
- `Calcular vacaciones pendientes en Nicaragua`
- `Calcular salario neto en Nicaragua`

7.3. Crear o reforzar hubs legales por pais con estructura breve:

- Que cubre el corpus.
- Herramientas disponibles.
- Temas legales documentados.
- Disclaimer informativo.

7.4. Evitar afirmaciones legales absolutas. Usar formulas y referencias del corpus versionado. Incluir `Resultado informativo, no asesoria legal` en paginas de calculadora y PDFs.

## 8. SEO tecnico

8.1. Robots y sitemap:

- Confirmar que produccion sirve `app/robots.ts` y no `public/robots.txt`.
- Corregir o eliminar el `public/robots.txt` con dominio mal escrito (`stephanbarler`) para evitar senales contradictorias.
- El sitemap debe listar solo URLs canonicas indexables.
- Remover URLs con query params del sitemap cuando existan URLs limpias equivalentes.

8.2. Canonicals:

- Self-canonical para cada `/es/{country}/{tool}`.
- Query pages canonizan a la ruta limpia.
- Evitar que cookies de pais cambien metadata canonica de paginas indexables.

8.3. Hreflang:

- Mantener `es-{PAIS}` para paginas en espanol.
- Mantener `en` solo donde exista pagina equivalente real.
- `x-default` debe apuntar a una pagina estable, no a una variante con cookie.

8.4. Structured data:

- `WebApplication` en cada calculadora.
- `FAQPage` solo si las FAQs estan visibles en la pagina.
- `BreadcrumbList` en paginas por pais/herramienta y docs legales.
- `Organization` global ya existe; mantenerlo.

8.5. Indexacion heredada:

- Redirigir o canonicalizar variantes `/{country}`, `/es/{country}?tool=...`, `/tools/{tool}?country=...`.
- Revisar 404 de docs con codigos de pais (`/docs/legal/ni`, `/docs/legal/pe`) y redirigir a nombres canonicos (`/docs/legal/nicaragua`, `/docs/legal/peru`).

## 9. On-page SEO por prioridad

9.1. Nicaragua:

- [ ] Problema: buena posicion, CTR bajo.
- [ ] Accion: titles mas orientados a calculo y 2026; CTA visible arriba; enlaces directos a liquidacion, vacaciones y salario neto.
- [ ] Meta ejemplo: `Calculadora de liquidacion laboral Nicaragua 2026 | Justo`.

9.2. Peru:

- [ ] Problema: clicks existentes en pagina pais, pero paginas de herramienta no capturan bien.
- [ ] Accion: landing limpia para liquidacion Peru con CTS, gratificaciones, vacaciones, indemnizacion y ONP/AFP.
- [ ] Meta ejemplo: `Calculadora de liquidacion Peru 2026 | CTS y gratificaciones`.

9.3. Colombia:

- [ ] Problema: alto volumen, 0 clics, posicion baja.
- [ ] Accion: contenido mas especifico a `calculadora laboral Colombia`, `cesantias`, `prima de servicios`, `vacaciones`.
- [ ] Evitar competir solo con `liquidacion` generica; usar subtitulos y FAQs orientadas a prestaciones sociales.

9.4. Costa Rica:

- [ ] Problema: buen CTR en bajo volumen.
- [ ] Accion: reforzar liquidacion, cesantia, preaviso, aguinaldo y vacaciones en una landing compacta.

9.5. Panama:

- [ ] Problema: impresiones menores pero queries directas.
- [ ] Accion: landing de liquidacion con prima de antiguedad, decimo tercer mes, vacaciones y CSS.

9.6. Guatemala:

- [ ] Problema: buen CTR inicial en algunas URLs, pero poco volumen y landings poco especificas.
- [ ] Accion: posicionar liquidacion con indemnizacion, aguinaldo, Bono 14, vacaciones, IGSS e ISR.
- [ ] Meta ejemplo: `Calculadora de liquidacion Guatemala 2026 | Bono 14 y aguinaldo`.

9.7. El Salvador:

- [ ] Problema: impresiones en salario/liquidacion, pero posicion media alta.
- [ ] Accion: posicionar liquidacion con indemnizacion, aguinaldo, vacaciones, ISSS, AFP e ISR.
- [ ] Meta ejemplo: `Calculadora de liquidacion El Salvador 2026 | ISSS y AFP`.

9.8. Honduras:

- [ ] Problema: volumen menor, pero posiciones iniciales razonables.
- [ ] Accion: posicionar auxilio de cesantia, decimotercer mes, vacaciones, IHSS y RAP.
- [ ] Meta ejemplo: `Calculadora de liquidacion Honduras 2026 | Cesantia y decimotercer mes`.

9.9. Mexico:

- [ ] Problema: muchas impresiones, 0 clics y competencia fuerte.
- [ ] Accion: evitar pagina generica; enfatizar LFT, indemnizacion constitucional, aguinaldo, vacaciones, prima de antiguedad, IMSS e ISR.
- [ ] Meta ejemplo: `Calculadora de liquidacion Mexico 2026 | LFT, aguinaldo e IMSS`.

9.10. Argentina:

- [ ] Problema: impresiones sin clics y posicion baja.
- [ ] Accion: usar lenguaje local: liquidacion final, indemnizacion por antiguedad, preaviso, SAC y vacaciones proporcionales.
- [ ] Meta ejemplo: `Calculadora de liquidacion Argentina 2026 | SAC e indemnizacion`.

9.11. Chile:

- [ ] Problema: impresiones sin conversion y competencia alta por finiquito.
- [ ] Accion: usar lenguaje local: finiquito, vacaciones proporcionales, indemnizacion, AFP, salud y AFC.
- [ ] Meta ejemplo: `Calculadora de finiquito Chile 2026 | Vacaciones, AFP y AFC`.

## 10. Conversion a calculo

10.1. Cada landing debe tener un CTA principal arriba y otro despues del bloque de formula.

10.2. El CTA debe abrir la herramienta con pais y herramienta preseleccionados.

10.3. Medir eventos en Plausible o analitica equivalente:

- `seo_calculator_cta_click`
- `tool_started`
- `tool_completed`
- `pdf_generated`
- `country_selected`

10.4. Separar metricas por `country`, `tool` y `landing_type`.

## 11. Metas

11.1. 30 dias despues de implementar fase 1:

- Subir CTR total desde ~0.5% a 1.0%.
- Duplicar clics desde paginas de calculadoras pais/herramienta.
- Reducir impresiones en URLs con query params dentro del sitemap.
- Lograr que Nicaragua liquidacion, vacaciones y salario neto tengan CTR superior a 1.5%.

11.2. 60 dias despues de implementar fase 2:

- Llegar a 100+ clics organicos mensuales.
- Tener al menos 5 paginas pais/herramienta con posicion media menor a 15.
- Lograr conversion organica medible: calculos iniciados y PDFs generados desde landings SEO.
- Mejorar Colombia desde 0 clics a clics recurrentes en consultas de calculadora laboral/prestaciones.

## 12. Checklist de ejecucion por fase

12.1. Fase 0, base tecnica:

- [x] Corregir o eliminar `apps/web/public/robots.txt` para quitar el dominio mal escrito.
- [ ] Confirmar que `https://justo.stephanbarker.com/robots.txt` sirve la version esperada.
- [x] Revisar `sitemap.ts` para que liste solo URLs canonicas indexables.
- [x] Remover del sitemap URLs con `?country=` cuando exista ruta limpia equivalente.
- [x] Crear estrategia de canonical para `/tools/{tool}?country={country}`.
- [ ] Crear estrategia de canonical para `/guia-laboral?country={country}`.
- [x] Definir redirects 301 desde `/{country}` a `/es/{country}`.
- [x] Definir redirects o canonicals desde `/docs/legal/{countryCode}` a `/docs/legal/{countrySlug}`.
- [x] Validar que metadata no dependa de cookies en paginas indexables.
- [ ] Preparar medicion de eventos SEO en Plausible o analitica equivalente.

12.2. Fase 1, landings de captura inmediata:

- [x] Crear landings de Nicaragua definidas en 6.2.
- [x] Crear landings de Peru definidas en 6.2.
- [x] Crear landings de Colombia definidas en 6.2.
- [x] Crear landings de Costa Rica definidas en 6.2.
- [x] Crear landings de Panama definidas en 6.2.
- [x] Agregar `WebApplication`, `FAQPage` y `BreadcrumbList` donde corresponda.
- [x] Enlazar cada landing a docs legales relevantes.
- [ ] Enlazar docs legales relevantes de vuelta a calculadoras.
- [ ] Enviar sitemap actualizado en Search Console.
- [ ] Inspeccionar manualmente 5 URLs nuevas en Search Console.

12.3. Fase 2, completar Centroamerica:

- [x] Crear landings de Guatemala definidas en 6.3.
- [x] Crear landings de El Salvador definidas en 6.3.
- [x] Crear landings de Honduras definidas en 6.3.
- [ ] Ajustar copy local de aguinaldo, Bono 14, decimotercer mes, ISSS, AFP, IGSS, IHSS y RAP.
- [ ] Agregar enlaces cruzados entre landings y hubs legales de Centroamerica.
- [ ] Verificar Search Console despues de indexacion inicial.

12.4. Fase 3, completar Mexico, Argentina y Chile:

- [x] Crear landings de Mexico definidas en 6.4.
- [x] Crear landings de Argentina definidas en 6.4.
- [x] Crear landings de Chile definidas en 6.4.
- [ ] Ajustar lenguaje local: finiquito en Chile, liquidacion final en Argentina, LFT/IMSS en Mexico.
- [ ] Agregar enlaces cruzados entre landings y docs legales de cada pais.
- [ ] Revisar si hace falta diferenciar snippets por busquedas locales.

12.5. Fase 4, completar herramientas restantes de fase 1:

- [x] Completar preaviso, terminacion y contratos para Nicaragua.
- [x] Completar aguinaldo, preaviso, terminacion y contratos para Peru.
- [x] Completar preaviso, terminacion y contratos para Colombia.
- [x] Completar aguinaldo, preaviso, terminacion y contratos para Costa Rica.
- [x] Completar aguinaldo, preaviso, terminacion y contratos para Panama.
- [x] Confirmar que todas las landings abren herramienta correcta y pais correcto.

12.6. Fase 5, medicion y ajustes:

- [ ] Esperar suficiente data en GSC despues de despliegue, idealmente 14-28 dias.
- [ ] Exportar nuevas consultas y paginas desde GSC.
- [ ] Comparar CTR, posicion e impresiones contra este baseline.
- [ ] Identificar paginas con muchas impresiones y CTR bajo.
- [ ] Ajustar titles/descriptions de paginas con CTR bajo.
- [ ] Identificar paginas con buena posicion pero pocas conversiones a calculo.
- [ ] Ajustar CTAs y enlaces internos de paginas con baja conversion.
- [ ] Revisar errores de indexacion, duplicados por canonical y 404.

## 13. Checklist de aceptacion

- [x] El sitemap no incluye duplicados con query params cuando exista URL limpia equivalente.
- [x] Cada pagina canonica tiene title unico.
- [x] Cada pagina canonica tiene meta description unica.
- [x] Cada pagina canonica tiene H1 unico.
- [x] Cada pagina canonica tiene canonical propio.
- [x] Cada pagina canonica tiene CTA a calcular visible arriba.
- [x] Cada pagina de calculadora muestra pais y herramienta.
- [x] Cada pagina de calculadora muestra formula resumida.
- [x] Cada pagina de calculadora muestra referencias legales.
- [x] Cada pagina de calculadora muestra version del corpus.
- [x] Cada pagina de calculadora muestra disclaimer informativo.
- [x] Cada pagina de calculadora enlaza a docs legales relevantes.
- [ ] Cada doc legal principal enlaza a calculadoras relevantes.
- [ ] Search Console no muestra crecimiento de duplicados por canonical despues del despliegue.
- [ ] Search Console no muestra crecimiento de 404 por rutas de docs antiguas despues del despliegue.
- [ ] La analitica permite atribuir calculos iniciados a paginas SEO.
- [ ] La analitica permite atribuir PDFs generados a paginas SEO.
- [ ] Las landings funcionan en mobile sin bloquear el inicio del calculo.
- [ ] Las landings funcionan en desktop con CTA claro y sin distracciones innecesarias.

## 14. Checklist maestro por pais

14.1. Nicaragua:

- [ ] Liquidacion laboral
- [ ] Vacaciones
- [ ] Salario neto
- [ ] Aguinaldo / decimo / bono
- [ ] Preaviso
- [ ] Simulador de terminacion
- [ ] Generador de contratos
- [ ] Enlaces a docs legales
- [ ] Eventos de conversion

14.2. Peru:

- [ ] Liquidacion laboral
- [ ] Vacaciones
- [ ] Salario neto
- [ ] Aguinaldo / decimo / bono
- [ ] Preaviso
- [ ] Simulador de terminacion
- [ ] Generador de contratos
- [ ] Enlaces a docs legales
- [ ] Eventos de conversion

14.3. Colombia:

- [ ] Liquidacion laboral
- [ ] Vacaciones
- [ ] Salario neto
- [ ] Aguinaldo / decimo / bono
- [ ] Preaviso
- [ ] Simulador de terminacion
- [ ] Generador de contratos
- [ ] Enlaces a docs legales
- [ ] Eventos de conversion

14.4. Costa Rica:

- [ ] Liquidacion laboral
- [ ] Vacaciones
- [ ] Salario neto
- [ ] Aguinaldo / decimo / bono
- [ ] Preaviso
- [ ] Simulador de terminacion
- [ ] Generador de contratos
- [ ] Enlaces a docs legales
- [ ] Eventos de conversion

14.5. Panama:

- [ ] Liquidacion laboral
- [ ] Vacaciones
- [ ] Salario neto
- [ ] Aguinaldo / decimo / bono
- [ ] Preaviso
- [ ] Simulador de terminacion
- [ ] Generador de contratos
- [ ] Enlaces a docs legales
- [ ] Eventos de conversion

14.6. Guatemala:

- [ ] Liquidacion laboral
- [ ] Vacaciones
- [ ] Salario neto
- [ ] Aguinaldo / decimo / bono
- [ ] Preaviso
- [ ] Simulador de terminacion
- [ ] Generador de contratos
- [ ] Enlaces a docs legales
- [ ] Eventos de conversion

14.7. El Salvador:

- [ ] Liquidacion laboral
- [ ] Vacaciones
- [ ] Salario neto
- [ ] Aguinaldo / decimo / bono
- [ ] Preaviso
- [ ] Simulador de terminacion
- [ ] Generador de contratos
- [ ] Enlaces a docs legales
- [ ] Eventos de conversion

14.8. Honduras:

- [ ] Liquidacion laboral
- [ ] Vacaciones
- [ ] Salario neto
- [ ] Aguinaldo / decimo / bono
- [ ] Preaviso
- [ ] Simulador de terminacion
- [ ] Generador de contratos
- [ ] Enlaces a docs legales
- [ ] Eventos de conversion

14.9. Mexico:

- [ ] Liquidacion laboral
- [ ] Vacaciones
- [ ] Salario neto
- [ ] Aguinaldo / decimo / bono
- [ ] Preaviso
- [ ] Simulador de terminacion
- [ ] Generador de contratos
- [ ] Enlaces a docs legales
- [ ] Eventos de conversion

14.10. Argentina:

- [ ] Liquidacion laboral
- [ ] Vacaciones
- [ ] Salario neto
- [ ] Aguinaldo / decimo / bono
- [ ] Preaviso
- [ ] Simulador de terminacion
- [ ] Generador de contratos
- [ ] Enlaces a docs legales
- [ ] Eventos de conversion

14.11. Chile:

- [ ] Liquidacion laboral
- [ ] Vacaciones
- [ ] Salario neto
- [ ] Aguinaldo / decimo / bono
- [ ] Preaviso
- [ ] Simulador de terminacion
- [ ] Generador de contratos
- [ ] Enlaces a docs legales
- [ ] Eventos de conversion
