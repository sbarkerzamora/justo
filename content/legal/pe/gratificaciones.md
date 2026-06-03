---
country: pe
topic: gratificaciones
version: pe-v0.2.0
status: proposed
source: "Ley General de Trabajo de Peru"
last_reviewed: "2026-05-11"
---

# Gratificaciones

## base_legal

- Arts. 206-208: Dos gratificaciones al ano, cada una equivalente a 1 remuneracion mensual.

## texto_legal

**Artículo 206. Gratificaciones. Contenido.** El trabajador tiene derecho a dos gratificaciones por año, que se abonan una en el mes de julio, con ocasión de fiestas patrias, y otra en el mes de diciembre, con ocasión de Navidad, de cada año, por un importe equivalente al de una remuneración mensual, en la forma prevista en el artículo 196° (cómputo de pagos anuales o semestrales).

**Artículo 207. Período adquisitivo y remuneración variable.** El monto de las gratificaciones para los trabajadores de remuneración imprecisa, se calculará en base al promedio de las remuneración percibida en los últimos seis meses anteriores al quince (15) de julio y quince (15) de diciembre según corresponda.

**Artículo 208. Oportunidad de pago y monto proporcional.** La gratificación se abona dentro de la primera quincena de los meses de julio y diciembre de cada año.

En caso de haberse trabajado en forma parcial o incompleta dentro del período adquisitivo, la gratificación se abona en monto proporcional a los meses y días trabajados.

## regla_operativa

- Primera: Fiestas Patrias (julio), pagadera en primeros 15 dias.
- Segunda: Navidad (diciembre), pagadera en primeros 15 dias.
- Proporcional al tiempo trabajado al terminar la relacion.

## formula

- `gratificacion_proporcional = salario_mensual * (dias_periodo / 365)`

## vigencia_fuente

- Ley General de Trabajo de Peru, Arts. 206, 207, 208.

## alcance_documental

- País: Perú.
- Tema operativo: `gratificaciones`.
- Fuente primaria local para contraste: `LEY_GENERAL_TRABAJO_Peru.md` (Ley General de Trabajo de Perú).
- Fuente declarada del resumen: Ley General de Trabajo de Peru.
- Estado del documento: `proposed`.
- Uso previsto: Explica gratificaciones legales, proporcionalidad y datos necesarios para estimarlas en una liquidación.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Arts. 206-208: Dos gratificaciones al ano, cada una equivalente a 1 remuneracion mensual.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- periodo o festividad aplicable
- meses laborados
- remuneración base
- pagos ya recibidos

## criterios_de_interpretacion

- validar periodo antes de calcular
- separar gratificación de bonificaciones extraordinarias
- usar solo tasas confirmadas en corpus
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

- `gratificacion_proporcional = salario_mensual * (dias_periodo / 365)`

## preguntas_sugeridas

- ¿Qué gratificación o periodo quieres calcular?
- ¿Cuántos meses trabajaste en ese periodo?
- ¿Cuál fue tu remuneración base?

## ejemplos_de_consulta

- "¿Cómo aplica gratificaciones en mi liquidación?"
- "¿Qué datos necesito para revisar gratificaciones?"
