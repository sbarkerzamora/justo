---
country: ar
topic: indemnizacion
version: ar-v0.2.0
status: proposed
source: "Ley 20.744 de Contrato de Trabajo"
last_reviewed: "2026-05-11"
---

# Indemnizacion por despido

## base_legal

- Art. 245: 1 mes de salario por cada ano de servicio (o fraccion >3 meses).
- Base: mejor remuneracion mensual normal y habitual del ultimo ano.
- Tope: 3 veces el promedio de la categoria del convenio colectivo.
- Minimo: nunca menos de 1 mes.

## texto_legal

**Art. 245.** — En los casos de despido dispuesto por el empleador sin justa causa, habiendo o no mediado preaviso y luego de transcurrido el período de prueba, se deberá abonar al trabajador una indemnización equivalente a un (1) mes de sueldo por cada año de servicio o fracción mayor de tres (3) meses, tomando como base de cálculo la mejor remuneración mensual, normal y habitual devengada durante el último año o durante el tiempo de prestación de servicios si éste fuera menor.

Se entiende como remuneración, a estos fines, la devengada y pagada en cada mes calendario, por cuanto no tendrán incidencia los conceptos de pago no mensuales como el Sueldo Anual Complementario, vacaciones, premios que no sean de pago mensual.

Se define como habitual, a estos fines, aquellos conceptos devengados como mínimo seis (6) meses en el último año calendario.

Se define como normal, en el caso de conceptos variables como ser premios mensuales, horas extra, comisiones, el promedio de los últimos seis (6) meses, o del último año si fuera más favorable al trabajador.

Dicha base salarial no podrá exceder el equivalente a tres (3) veces el importe del salario mensual promedio de las remuneraciones previstas en el Convenio Colectivo de Trabajo aplicable al trabajador al momento del despido, por la jornada legal o convencional, excluida la antigüedad.

En ningún supuesto la aplicación del tope previsto en este artículo podrá ser inferior al sesenta y siete por ciento (67%) de la remuneración mensual, normal y habitual calculada conforme a lo establecido en los párrafos precedentes de este artículo.

La indemnización en ningún caso podrá ser inferior a un (1) mes de sueldo calculado sobre la base del sistema establecido en el presente artículo.

## formula

- `salario_diario = salario_mensual / 30`
- `indemnizacion = salario_mensual * anos_antiguedad`

## vigencia_fuente

- Ley 20.744, Art. 245 (reforma Ley 27.802).

## alcance_documental

- País: Argentina.
- Tema operativo: `indemnizacion`.
- Fuente primaria local para contraste: `leydeltrabajoargentina.md` (Ley de Contrato de Trabajo 20.744).
- Fuente declarada del resumen: Ley 20.744 de Contrato de Trabajo.
- Estado del documento: `proposed`.
- Uso previsto: Determina si existe pago por terminación y cómo aproximar la base indemnizatoria cuando la relación laboral termina por despido, renuncia u otra causal documentada.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 245: 1 mes de salario por cada ano de servicio (o fraccion >3 meses).
- Base: mejor remuneracion mensual normal y habitual del ultimo ano.
- Tope: 3 veces el promedio de la categoria del convenio colectivo.
- Minimo: nunca menos de 1 mes.

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
- `indemnizacion = salario_mensual * anos_antiguedad`

## preguntas_sugeridas

- ¿La salida fue renuncia, despido con causa, despido sin causa o mutuo acuerdo?
- ¿Cuál fue tu salario ordinario mensual o promedio?
- ¿Cuáles fueron las fechas exactas de inicio y salida?

## ejemplos_de_consulta

- "Me despidieron, ¿qué indemnización aplica?"
- "Renuncié con varios años, ¿qué prestaciones siguen pendientes?"
