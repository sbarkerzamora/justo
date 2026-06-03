---
country: hn
topic: aguinaldo
version: hn-v0.2.0
status: proposed
source: "Ley del Decimotercer Mes (Decreto 133-92)"
last_reviewed: "2026-05-11"
---

# Aguinaldo (Decimotercer Mes)

## base_legal

- Decreto 133-92, Ley del Decimotercer Mes.

## regla_operativa

- El trabajador tiene derecho a un salario mensual adicional por cada ano trabajado.
- Al finalizar la relacion laboral, se paga la parte proporcional.

## formula

- `aguinaldo_proporcional = salario_base * (dias_periodo / 365)`

## variables

- `salario_base`
- `dias_periodo`

## supuestos

- Se usa salario mensual ordinario como base.

## excepciones

- Aguinaldo proporcional exento de deducciones segun ley.

## vigencia_fuente

- Decreto 133-92, vigente con reformas aplicables.

## alcance_documental

- País: Honduras.
- Tema operativo: `aguinaldo`.
- Fuente primaria local para contraste: `OpenL-2605112256.md` (Código de Trabajo de Honduras).
- Fuente declarada del resumen: Ley del Decimotercer Mes (Decreto 133-92).
- Estado del documento: `proposed`.
- Uso previsto: Describe el aguinaldo o décimo/bonificación anual aplicable, su proporcionalidad y datos necesarios para estimarlo.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Decreto 133-92, Ley del Decimotercer Mes.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- periodo anual aplicable
- meses o días laborados en el periodo
- salario ordinario o promedio
- pagos de aguinaldo ya recibidos

## criterios_de_interpretacion

- calcular proporcionalidad solo con periodo conocido
- deducir pagos ya realizados si el usuario los confirma
- distinguir aguinaldo legal de bonos voluntarios
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

- `aguinaldo_proporcional = salario_base * (dias_periodo / 365)`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `salario_base`
- `dias_periodo`

## preguntas_sugeridas

- ¿Qué periodo quieres calcular?
- ¿Ya recibiste algún pago de aguinaldo de ese periodo?
- ¿Tu salario mensual era fijo o variable?

## ejemplos_de_consulta

- "¿Cuánto aguinaldo proporcional me toca?"
- "¿Se incluye el aguinaldo en mi liquidación?"
