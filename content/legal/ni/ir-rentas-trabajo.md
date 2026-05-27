---
country: ni
topic: ir-rentas-trabajo
version: ni-v0.2.0
status: proposed
source: "Ley de Concertacion Tributaria y normativa vigente de rentas del trabajo"
last_reviewed: "2026-05-11"
---

# IR (rentas del trabajo)

## base_legal

- Ley de Concertacion Tributaria.
- Disposiciones vigentes para retencion o calculo de rentas del trabajo aplicables a liquidacion.

## regla_operativa

- El IR se aplica sobre base imponible definida por normativa tributaria, despues de deducciones permitidas.
- En el MVP inicial se usa una tasa referencial operativa documentada y revisable.

## formula

- `ir_laboral = max(base_ir, 0) * tasa_ir_laboral`

## variables

- `base_ir`
- `tasa_ir_laboral`

## supuestos

- `tasa_ir_laboral = 0.015` (set normativo propuesto, pendiente confirmacion legal final en produccion).

## excepciones

- Aguinaldo proporcional exento de deducciones segun Art. 97 de Ley 185.

## vigencia_fuente

- Requiere confirmacion de tabla/escala anual vigente antes de uso productivo.

## alcance_documental

- País: Nicaragua.
- Tema operativo: `ir-rentas-trabajo`.
- Fuente primaria local para contraste: `Ley185Nic.md` (Código del Trabajo, Ley No. 185).
- Fuente declarada del resumen: Ley de Concertacion Tributaria y normativa vigente de rentas del trabajo.
- Estado del documento: `proposed`.
- Uso previsto: Describe retenciones de impuesto sobre rentas de trabajo y su relación con el neto a recibir.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Ley de Concertacion Tributaria.
- Disposiciones vigentes para retencion o calculo de rentas del trabajo aplicables a liquidacion.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- ingreso gravable o base de retención
- periodo fiscal o de nómina
- deducciones legales aplicadas
- retenciones acumuladas si se conocen

## criterios_de_interpretacion

- no dar asesoría fiscal definitiva
- pedir revisión contable si hay ingresos variables o múltiples empleadores
- no inventar tramos, mínimos o exenciones fuera del corpus
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

- `ir_laboral = max(base_ir, 0) * tasa_ir_laboral`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `base_ir`
- `tasa_ir_laboral`

## preguntas_sugeridas

- ¿Qué periodo fiscal o de nómina quieres revisar?
- ¿Cuál fue la base usada para la retención?
- ¿Tienes retenciones acumuladas o comprobantes?

## ejemplos_de_consulta

- "¿Cómo aplica ir-rentas-trabajo en mi liquidación?"
- "¿Qué datos necesito para revisar ir-rentas-trabajo?"
