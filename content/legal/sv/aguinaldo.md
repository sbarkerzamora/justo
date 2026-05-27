---
country: sv
topic: aguinaldo
version: sv-v0.1.0
status: proposed
source: "Codigo de Trabajo de El Salvador"
last_reviewed: "2026-05-11"
---

# Aguinaldo

## base_legal

- Art. 196: Obligacion de pago de aguinaldo anual.
- Art. 197: Pago completo (1 ano o mas) o proporcional (menos de 1 ano).
- Art. 198: Monto minimo escalonado segun antiguedad.
- Art. 199: Base de calculo segun tipo de salario.
- Art. 202: Pago proporcional al terminar relacion laboral.

## regla_operativa

- 1 a 3 anos: 15 dias de salario.
- 3 a 10 anos: 19 dias de salario.
- 10 anos o mas: 21 dias de salario.
- Al terminar la relacion, se paga proporcional al periodo trabajado en el ano.

## formula

- `aguinaldo_proporcional = (salario_mensual / 30) * dias_aguinaldo_segun_escala * (dias_periodo / 365)`
- donde `dias_aguinaldo_segun_escala` = 15, 19 o 21 segun anios de servicio

## variables

- `salario_mensual`
- `anos_antiguedad`
- `dias_periodo`

## vigencia_fuente

- Codigo de Trabajo de El Salvador, Arts. 196, 197, 198, 199, 202.

## alcance_documental

- País: El Salvador.
- Tema operativo: `aguinaldo`.
- Fuente primaria local para contraste: `OpenL-2605112301.md` (Código de Trabajo de El Salvador).
- Fuente declarada del resumen: Codigo de Trabajo de El Salvador.
- Estado del documento: `proposed`.
- Uso previsto: Describe el aguinaldo o décimo/bonificación anual aplicable, su proporcionalidad y datos necesarios para estimarlo.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 196: Obligacion de pago de aguinaldo anual.
- Art. 197: Pago completo (1 ano o mas) o proporcional (menos de 1 ano).
- Art. 198: Monto minimo escalonado segun antiguedad.
- Art. 199: Base de calculo segun tipo de salario.
- Art. 202: Pago proporcional al terminar relacion laboral.

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

- `aguinaldo_proporcional = (salario_mensual / 30) * dias_aguinaldo_segun_escala * (dias_periodo / 365)`
- donde `dias_aguinaldo_segun_escala` = 15, 19 o 21 segun anios de servicio

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `salario_mensual`
- `anos_antiguedad`
- `dias_periodo`

## preguntas_sugeridas

- ¿Qué periodo quieres calcular?
- ¿Ya recibiste algún pago de aguinaldo de ese periodo?
- ¿Tu salario mensual era fijo o variable?

## ejemplos_de_consulta

- "¿Cuánto aguinaldo proporcional me toca?"
- "¿Se incluye el aguinaldo en mi liquidación?"
