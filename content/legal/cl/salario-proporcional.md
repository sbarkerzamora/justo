---
country: cl
topic: salario-proporcional
version: cl-v0.1.0
status: proposed
source: "Codigo del Trabajo de Chile"
last_reviewed: "2026-05-11"
---

# Salario proporcional

## formula

- `salario_proporcional = (salario_mensual / 30) * dias_trabajados`

## alcance_documental

- País: Chile.
- Tema operativo: `salario-proporcional`.
- Fuente primaria local para contraste: `codigodeltrabajochile.md` (Código del Trabajo de Chile).
- Fuente declarada del resumen: Codigo del Trabajo de Chile.
- Estado del documento: `proposed`.
- Uso previsto: Cubre salarios devengados no pagados al cierre, días parciales de mes y base diaria para liquidación.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Base legal no estructurada; consultar fuente primaria local.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- último periodo pagado
- días trabajados pendientes
- salario mensual o diario
- pagos parciales recibidos

## criterios_de_interpretacion

- no mezclar salario pendiente con prestaciones
- descontar pagos parciales solo si el usuario los confirma
- usar convención de días del corpus o motor determinístico
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

- `salario_proporcional = (salario_mensual / 30) * dias_trabajados`

## preguntas_sugeridas

- ¿Hasta qué fecha te pagaron salario?
- ¿Cuántos días trabajados quedaron pendientes?
- ¿Cuál era tu salario mensual o diario?

## ejemplos_de_consulta

- "Me quedaron días trabajados sin pagar, ¿cómo se calculan?"
