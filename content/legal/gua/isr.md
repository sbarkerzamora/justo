---
country: gt
topic: isr
version: gt-v0.1.0
status: proposed
source: "Ley del ISR y disposiciones vigentes"
last_reviewed: "2026-05-11"
---

# ISR (rentas del trabajo)

## base_legal

- Ley del Impuesto Sobre la Renta.
- Disposiciones vigentes para retencion de ISR sobre rentas del trabajo.

## regla_operativa

- El ISR se aplica sobre la renta imponible despues de deducciones permitidas.
- En el MVP inicial se usa una tasa simplificada documentada y revisable.

## formula

- `isr_laboral = max(base_isr, 0) * tasa_isr`

## variables

- `base_isr`
- `tasa_isr`

## supuestos

- `tasa_isr = 0.05` (set normativo propuesto, pendiente confirmacion con tabla progresiva oficial).

## vigencia_fuente

- Requiere confirmacion de tabla anual vigente antes de uso productivo.

## alcance_documental

- País: Guatemala.
- Tema operativo: `isr`.
- Fuente primaria local para contraste: `Leydeltrabajogua.md` (Código de Trabajo de Guatemala).
- Fuente declarada del resumen: Ley del ISR y disposiciones vigentes.
- Estado del documento: `proposed`.
- Uso previsto: Describe retenciones de impuesto sobre rentas de trabajo y su relación con el neto a recibir.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Ley del Impuesto Sobre la Renta.
- Disposiciones vigentes para retencion de ISR sobre rentas del trabajo.

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

- `isr_laboral = max(base_isr, 0) * tasa_isr`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `base_isr`
- `tasa_isr`

## preguntas_sugeridas

- ¿Qué periodo fiscal o de nómina quieres revisar?
- ¿Cuál fue la base usada para la retención?
- ¿Tienes retenciones acumuladas o comprobantes?

## ejemplos_de_consulta

- "¿Cómo aplica isr en mi liquidación?"
- "¿Qué datos necesito para revisar isr?"
