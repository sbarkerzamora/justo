---
country: sv
topic: afp
version: sv-v0.1.0
status: proposed
source: "Ley del Sistema de Ahorro para Pensiones (SAP)"
last_reviewed: "2026-05-11"
---

# AFP (cotizacion previsional)

## base_legal

- Ley del Sistema de Ahorro para Pensiones (Decreto 927).
- Reglamentacion administrativa vigente de las AFP.

## regla_operativa

- La cotizacion previsional del trabajador se aplica sobre el salario ordinario.

## formula

- `afp_laboral = base_afp * tasa_afp_laboral`

## variables

- `base_afp`
- `tasa_afp_laboral`

## supuestos

- `tasa_afp_laboral = 0.0725` (set normativo propuesto, pendiente confirmacion legal final en produccion).

## vigencia_fuente

- Se requiere validacion periodica por cambios normativos del SAP.

## alcance_documental

- País: El Salvador.
- Tema operativo: `afp`.
- Fuente primaria local para contraste: `OpenL-2605112301.md` (Código de Trabajo de El Salvador).
- Fuente declarada del resumen: Ley del Sistema de Ahorro para Pensiones (SAP).
- Estado del documento: `proposed`.
- Uso previsto: Describe aportes o cotizaciones de seguridad social/previsión que pueden incidir en el neto de una liquidación o nómina.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Ley del Sistema de Ahorro para Pensiones (Decreto 927).
- Reglamentacion administrativa vigente de las AFP.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- base salarial sujeta a cotización
- régimen o entidad aplicable
- periodo de nómina
- tasa vigente documentada o comprobante del empleador

## criterios_de_interpretacion

- no mezclar aporte laboral con aporte patronal
- marcar incertidumbre cuando la tasa depende de reglamento administrativo actualizado
- usar el motor determinístico para montos si existe soporte en país
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

- `afp_laboral = base_afp * tasa_afp_laboral`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `base_afp`
- `tasa_afp_laboral`

## preguntas_sugeridas

- ¿Qué periodo o nómina quieres revisar?
- ¿Cuál fue la base salarial usada?
- ¿El descuento aparece en tu comprobante y con qué nombre?

## ejemplos_de_consulta

- "¿Cómo aplica afp en mi liquidación?"
- "¿Qué datos necesito para revisar afp?"
