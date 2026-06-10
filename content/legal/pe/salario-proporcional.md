---
country: pe
topic: salario-proporcional
version: pe-v0.2.0
status: proposed
source: "Ley General de Trabajo de Peru"
last_reviewed: "2026-05-11"
---

# Salario proporcional

## regla_operativa

- Al terminar la relacion, se paga el salario proporcional a los dias trabajados en el mes.
- Se calcula sobre la base del salario mensual dividido entre 30 dias.

## formula

- `salario_proporcional = (salario_mensual / 30) * dias_trabajados`

## alcance_documental

- Pais: Peru.
- Tema operativo: `salario-proporcional`.
- Fuente primaria local para contraste: `LEY_GENERAL_TRABAJO_Peru.md` (Ley General de Trabajo de Peru).
- Fuente declarada del resumen: Ley General de Trabajo de Peru.
- Estado del documento: `proposed`.
- Uso previsto: Cubre salarios devengados no pagados al cierre, dias parciales de mes y base diaria para liquidacion.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del pais antes de responder:

- Base legal no estructurada; consultar fuente primaria local.

## datos_minimos_para_responder

Antes de calcular o dar una conclusion personalizada, el asistente debe verificar estos datos:

- ultimo periodo pagado
- dias trabajados pendientes
- salario mensual o diario
- pagos parciales recibidos

## criterios_de_interpretacion

- no mezclar salario pendiente con prestaciones
- descontar pagos parciales solo si el usuario los confirma
- usar convencion de 30 dias del corpus o motor deterministico
- contrastar con la fuente primaria local cuando la pregunta pida articulo, causal, excepcion o fundamento legal detallado
- no extrapolar reglas de otro pais ni tasas administrativas no confirmadas en el corpus

## guia_para_respuestas_llm

- Responder en espanol claro, con alcance informativo y sin presentarlo como asesoria legal profesional.
- Citar este archivo, su version y la fuente primaria local cuando se use para una respuesta.
- Si faltan datos minimos, hacer 2 o 3 preguntas concretas antes de calcular.
- Si el usuario pide un monto, usar el motor deterministico disponible; no hacer aritmetica libre con el LLM.
- Si la consulta involucra conflicto, salario variable, pagos parciales, fueros, convenio especial o una causal discutida, marcar incertidumbre y recomendar revision legal/contable profesional.

## formula_documentada

La formula operativa existente en este archivo es:

- `salario_proporcional = (salario_mensual / 30) * dias_trabajados`

## preguntas_sugeridas

- Hasta que fecha te pagaron salario?
- Cuantos dias trabajados quedaron pendientes?
- Cual era tu salario mensual o diario?

## ejemplos_de_consulta

- "Me quedaron dias trabajados sin pagar, como se calculan?"
