---
country: ni
topic: salario-proporcional
version: ni-v0.2.0
status: active
source: "Codigo del Trabajo, Ley No. 185"
---

# Salario Proporcional

## base_legal

- Art. 42: pago de prestaciones y conceptos proporcionales al cierre.
- Arts. 81, 84, 86: definicion de salario, salario ordinario y pago.

## regla_operativa

- Se liquida salario pendiente del periodo en curso al momento de la salida.

## formula

- `salario_diario = salario_mensual / 30`
- `salario_proporcional = salario_diario * dias_salario_pendiente`

## variables

- `salario_mensual`
- `dias_salario_pendiente`

## supuestos

- El MVP usa una captura explicita de dias pendientes para evitar ambiguedad de calendario de pago.

## excepciones

- Si existe salario variable o esquema mixto, se debe aplicar promedio ordinario conforme reglas internas definidas por politica laboral vigente.

## vigencia_fuente

- Ley No. 185, Arts. 42, 81, 84, 86.

## alcance_documental

- País: Nicaragua.
- Tema operativo: `salario-proporcional`.
- Fuente primaria local para contraste: `Ley185Nic.md` (Código del Trabajo, Ley No. 185).
- Fuente declarada del resumen: Codigo del Trabajo, Ley No. 185.
- Estado del documento: `active`.
- Uso previsto: Cubre salarios devengados no pagados al cierre, días parciales de mes y base diaria para liquidación.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 42: pago de prestaciones y conceptos proporcionales al cierre.
- Arts. 81, 84, 86: definicion de salario, salario ordinario y pago.

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

- `salario_diario = salario_mensual / 30`
- `salario_proporcional = salario_diario * dias_salario_pendiente`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `salario_mensual`
- `dias_salario_pendiente`

## preguntas_sugeridas

- ¿Hasta qué fecha te pagaron salario?
- ¿Cuántos días trabajados quedaron pendientes?
- ¿Cuál era tu salario mensual o diario?

## ejemplos_de_consulta

- "Me quedaron días trabajados sin pagar, ¿cómo se calculan?"
