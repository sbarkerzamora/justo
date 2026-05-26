---
country: pe
topic: cts
version: pe-v0.1.0
status: proposed
source: "Ley General de Trabajo de Peru"
last_reviewed: "2026-05-11"
---

# CTS (Compensacion por Tiempo de Servicios)

## base_legal

- Art. 219: CTS equivalente al 8.33% de la remuneracion mensual (1/12 = 1 salario por ano).

## regla_operativa

- 8.33% de la remuneracion mensual, equivalente a 1 salario por ano.
- Se deposita mensualmente o semestralmente en una entidad bancaria.
- Al terminar la relacion, el empleador paga la CTS directamente.

## formula

- `cts = salario_mensual * 8.33 / 100 * anos_antiguedad`

## vigencia_fuente

- Ley General de Trabajo de Peru, Art. 219.

## alcance_documental

- País: Perú.
- Tema operativo: `cts`.
- Fuente primaria local para contraste: `LEY_GENERAL_TRABAJO_Peru.md` (Ley General de Trabajo de Perú).
- Fuente declarada del resumen: Ley General de Trabajo de Peru.
- Estado del documento: `proposed`.
- Uso previsto: Resume la compensación por tiempo de servicios, su finalidad y datos para estimar depósitos o saldos pendientes.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 219: CTS equivalente al 8.33% de la remuneracion mensual (1/12 = 1 salario por ano).

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- periodo semestral aplicable
- remuneración computable
- depósitos ya efectuados
- tiempo laborado dentro del periodo

## criterios_de_interpretacion

- verificar si se trata de depósito periódico o liquidación final
- no asumir disponibilidad del fondo
- separar CTS de gratificaciones y vacaciones
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

- `cts = salario_mensual * 8.33 / 100 * anos_antiguedad`

## preguntas_sugeridas

- ¿Qué periodo de CTS quieres revisar?
- ¿Cuál fue tu remuneración computable?
- ¿Te hicieron depósitos anteriores?

## ejemplos_de_consulta

- "¿Cómo aplica cts en mi liquidación?"
- "¿Qué datos necesito para revisar cts?"
