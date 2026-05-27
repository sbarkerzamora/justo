---
country: cl
topic: vacaciones
version: cl-v0.1.0
status: proposed
source: "Codigo del Trabajo de Chile"
last_reviewed: "2026-05-11"
---

# Vacaciones (Feriado anual)

## base_legal

- Art. 67: 15 dias habiles de vacaciones por cada ano.
- Art. 68: Feriado progresivo: +1 dia cada 3 anos desde 10 anos.
- Art. 73: Proporcional al terminar la relacion.

## formula

- `dias_adicionales = max(0, floor((anos_antiguedad - 10) / 3))`
- `total_dias_escala = 15 + dias_adicionales`
- `vacaciones = (salario/30) * min(dias_pendientes, total_dias_escala)`

## vigencia_fuente

- Codigo del Trabajo de Chile, Arts. 67, 68, 73.

## alcance_documental

- País: Chile.
- Tema operativo: `vacaciones`.
- Fuente primaria local para contraste: `codigodeltrabajochile.md` (Código del Trabajo de Chile).
- Fuente declarada del resumen: Codigo del Trabajo de Chile.
- Estado del documento: `proposed`.
- Uso previsto: Explica el derecho a vacaciones, su pago al terminar la relación y la forma de valorar días pendientes o proporcionales.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 67: 15 dias habiles de vacaciones por cada ano.
- Art. 68: Feriado progresivo: +1 dia cada 3 anos desde 10 anos.
- Art. 73: Proporcional al terminar la relacion.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- días de vacaciones pendientes o gozados
- periodo laborado desde el último corte
- salario ordinario o promedio si era variable

## criterios_de_interpretacion

- no confundir vacaciones gozadas con vacaciones pagadas pendientes
- usar salario ordinario/promedio indicado por la fuente
- pedir días pendientes cuando el sistema no pueda inferirlos con certeza
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

- `dias_adicionales = max(0, floor((anos_antiguedad - 10) / 3))`
- `total_dias_escala = 15 + dias_adicionales`
- `vacaciones = (salario/30) * min(dias_pendientes, total_dias_escala)`

## preguntas_sugeridas

- ¿Cuántos días de vacaciones pendientes tenías?
- ¿Tu salario era fijo o variable?
- ¿Desde cuándo no te liquidaban vacaciones?

## ejemplos_de_consulta

- "¿Me deben pagar vacaciones no gozadas?"
- "¿Cómo calculo días pendientes si trabajé parte del año?"
