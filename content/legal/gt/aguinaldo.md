---
country: gt
topic: aguinaldo
version: gt-v0.2.0
status: proposed
source: "Decreto 76-78 (Ley de Aguinaldo) y Decreto 42-92 (Bono 14)"
last_reviewed: "2026-06-03"
---

# Aguinaldo y Bono 14

## base_legal

- Decreto 76-78: Ley de Aguinaldo para Trabajadores del Sector Privado.
- Decreto 42-92: Bono Anual para Trabajadores del Sector Privado (Bono 14).

## regla_operativa

- Aguinaldo: 1 salario ordinario mensual por cada ano, pagadero en diciembre.
- Bono 14: 1 salario ordinario mensual por cada ano, pagadero en julio.
- Al finalizar la relacion laboral, se paga la parte proporcional de ambos.

## formula

- `aguinaldo_proporcional = salario_mensual * (dias_periodo / 365)`
- `bono14_proporcional = salario_mensual * (dias_periodo / 365)`

## variables

- `salario_mensual`
- `dias_periodo`

## supuestos

- Aguinaldo y Bono 14 estan exentos de deducciones (IGSS e ISR).

## vigencia_fuente

- Decreto 76-78 y Decreto 42-92.

## alcance_documental

- País: Guatemala.
- Tema operativo: `aguinaldo`.
- Fuente primaria local para contraste: `codigo-de-trabajo.md` (Código de Trabajo de Guatemala, Decreto 1441).
- Fuente declarada del resumen: Decreto 76-78 (Ley de Aguinaldo) y Decreto 42-92 (Bono 14).
- Estado del documento: `proposed`.
- Uso previsto: Explica el aguinaldo y bono 14, su proporcionalidad y cómo documentarlos dentro de una liquidación laboral.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Decreto 76-78: Ley de Aguinaldo para Trabajadores del Sector Privado.
- Decreto 42-92: Bono Anual para Trabajadores del Sector Privado (Bono 14).

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- periodo o festividad aplicable
- meses laborados
- remuneración base
- pagos ya recibidos

## criterios_de_interpretacion

- separar aguinaldo de otras prestaciones
- usar proporcionalidad cuando no se completó el periodo
- pedir salario promedio si hubo variables salariales
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

- `aguinaldo_proporcional = salario_mensual * (dias_periodo / 365)`
- `bono14_proporcional = salario_mensual * (dias_periodo / 365)`

## preguntas_sugeridas

- ¿Qué periodo quieres calcular?
- ¿Cuántos meses trabajaste en ese periodo?
- ¿Cuál fue tu salario base?

## ejemplos_de_consulta

- "¿Cómo aplica aguinaldo en mi liquidación?"
- "¿Qué datos necesito para revisar aguinaldo y bono 14?"
