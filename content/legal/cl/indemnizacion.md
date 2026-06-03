---
country: cl
topic: indemnizacion
version: cl-v0.2.0
status: proposed
source: "Codigo del Trabajo de Chile"
last_reviewed: "2026-05-11"
---

# Indemnizacion por anos de servicio

## base_legal

- Art. 163: 30 dias de ultima remuneracion por cada ano, fraccion >6 meses = ano completo.
- Art. 161-162: Indemnizacion sustitutiva del aviso previo (1 mes).
- Maximo: 330 dias (11 anos).

## texto_legal

**Artículo 161.** Sin perjuicio de lo señalado en los artículos precedentes, el empleador podrá poner término al contrato de trabajo invocando como causal las necesidades de la empresa, establecimiento o servicio, tales como las derivadas de la racionalización o modernización de los mismos, bajas en la productividad, cambios en las condiciones del mercado o de la economía, que hagan necesaria la separación de uno o más trabajadores.

En el caso de los trabajadores que tengan poder para representar al empleador, tales como gerentes, subgerentes, agentes o apoderados, siempre que, en todos estos casos, estén dotados, a lo menos, de facultades generales de administración, y en el caso de los trabajadores de casa particular, el contrato de trabajo podrá, además, terminar por desahucio escrito del empleador, el que deberá darse con treinta días de anticipación, a lo menos, con copia a la Inspección del Trabajo respectiva. Sin embargo, no se requerirá esta anticipación cuando el empleador pagare al trabajador, al momento de la terminación, una indemnización en dinero efectivo equivalente a la última remuneración mensual devengada.

**Artículo 162.** Si el contrato de trabajo termina de acuerdo con los números 4, 5 o 6 del artículo 159, o si el empleador le pusiere término por aplicación de una o más de las causales señaladas en el artículo 160, deberá comunicarlo por escrito al trabajador, personalmente o por carta certificada enviada al domicilio señalado en el contrato, expresando la o las causales invocadas y los hechos en que se funda.

Cuando el empleador invoque la causal señalada en el inciso primero del artículo 161, el aviso deberá darse al trabajador, con copia a la Inspección del Trabajo respectiva, a lo menos con treinta días de anticipación. Sin embargo, no se requerirá esta anticipación cuando el empleador pagare al trabajador una indemnización en dinero efectivo sustitutiva del aviso previo, equivalente a la última remuneración mensual devengada.

**Artículo 163.** Si el contrato hubiere estado vigente un año o más y el empleador le pusiere término en conformidad al artículo 161, deberá pagar al trabajador la indemnización por años de servicio que las partes hayan convenido individual o colectivamente, siempre que ésta fuere de un monto superior a la establecida en el inciso siguiente.

A falta de esta estipulación, el empleador deberá pagar al trabajador una indemnización equivalente a treinta días de la última remuneración mensual devengada por cada año de servicio y fracción superior a seis meses, prestados continuamente a dicho empleador. Esta indemnización tendrá un límite máximo de trescientos treinta días de remuneración.

La indemnización a que se refiere este artículo será compatible con la sustitutiva del aviso previo que corresponda al trabajador, según lo establecido en el inciso segundo del artículo 161 y en el inciso cuarto del artículo 162 de este Código.

## formula

- `salario_diario = salario_mensual / 30`
- `indemnizacion_anos = min(anos_antiguedad, 11) * 30 * salario_diario`
- `aviso_sustitutivo = salario_mensual`
- `total = indemnizacion_anos + aviso_sustitutivo`

## vigencia_fuente

- Codigo del Trabajo de Chile, Arts. 161, 162, 163.

## alcance_documental

- País: Chile.
- Tema operativo: `indemnizacion`.
- Fuente primaria local para contraste: `codigodeltrabajochile.md` (Código del Trabajo de Chile).
- Fuente declarada del resumen: Codigo del Trabajo de Chile.
- Estado del documento: `proposed`.
- Uso previsto: Determina si existe pago por terminación y cómo aproximar la base indemnizatoria cuando la relación laboral termina por despido, renuncia u otra causal documentada.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 163: 30 dias de ultima remuneracion por cada ano, fraccion >6 meses = ano completo.
- Art. 161-162: Indemnizacion sustitutiva del aviso previo (1 mes).
- Maximo: 330 dias (11 anos).

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- tipo de terminación y causa invocada
- fecha de inicio y fecha de salida
- salario ordinario mensual o promedio aplicable
- si hubo preaviso, pagos parciales o acuerdos previos

## criterios_de_interpretacion

- distinguir derecho a indemnización de pago de prestaciones proporcionales
- aplicar topes, tramos o mínimos solo si están expresamente en la base legal
- no asumir despido injustificado si el usuario solo dice que terminó la relación
- contrastar con la fuente primaria local cuando la pregunta pida artículo, causal, excepción o fundamento legal detallado
- no extrapolar reglas de otro país ni tasas administrativas no confirmadas en el corpus

## guia_para_respuestas_llm

- Responder en español claro, con alcance informativo y sin presentarlo como asesoría legal profesional.
- Citar este archivo, su versión y la fuente primaria local cuando se use para una respuesta.
- Si faltan datos mínimos, hacer 2 o 3 preguntas concretas antes de calcular.
- Si el usuario pide un monto, usar el motor determinístico disponible; no hacer aritmética libre con el LLM.
- Si la consulta involucra conflicto, salario variable, pagos parciales, fueros, convenio especial o una causal discutida, marcar incertidumbre y recomendar revisión legal/contable profesional.

## formula_documentada

La fórmula operativa existente en este archivo es:

- `salario_diario = salario_mensual / 30`
- `indemnizacion_anos = min(anos_antiguedad, 11) * 30 * salario_diario`
- `aviso_sustitutivo = salario_mensual`
- `total = indemnizacion_anos + aviso_sustitutivo`

## preguntas_sugeridas

- ¿La salida fue renuncia, despido con causa, despido sin causa o mutuo acuerdo?
- ¿Cuál fue tu salario ordinario mensual o promedio?
- ¿Cuáles fueron las fechas exactas de inicio y salida?

## ejemplos_de_consulta

- "Me despidieron, ¿qué indemnización aplica?"
- "Renuncié con varios años, ¿qué prestaciones siguen pendientes?"
