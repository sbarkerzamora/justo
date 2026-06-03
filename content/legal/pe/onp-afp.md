---
country: pe
topic: onp-afp
version: pe-v0.2.0
status: proposed
source: "Ley 26790 y D.L. 19990 (Sistema de Pensiones Peruano)"
last_reviewed: "2026-05-11"
---

# ONP y AFP (sistema de pensiones)

## base_legal

- D.L. 19990 - Sistema Nacional de Pensiones (ONP).
- Ley 25897 - Sistema Privado de Pensiones (AFP).
- Ley 26790 - Seguro Social de Salud (EsSalud).

## regla_operativa

- ONP (Sistema Nacional): 13% del salario del trabajador.
- AFP (Sistema Privado): ~12.5% (incluye comision y prima de seguro).
- EsSalud: 9% empleador (no descontado al trabajador).
- En el MVP se usa la tasa ONP del 13%.

## formula

- `onp_laboral = base_onp * 0.13`

## supuestos

- `tasa_onp = 0.13` (13% para ONP, pendiente confirmacion).

## vigencia_fuente

- D.L. 19990, Ley 25897, Ley 26790.

## alcance_documental

- País: Perú.
- Tema operativo: `onp-afp`.
- Fuente primaria local para contraste: `LEY_GENERAL_TRABAJO_Peru.md` (Ley General de Trabajo de Perú).
- Fuente declarada del resumen: Ley 26790 y D.L. 19990 (Sistema de Pensiones Peruano).
- Estado del documento: `proposed`.
- Uso previsto: Describe aportes o cotizaciones de seguridad social/previsión que pueden incidir en el neto de una liquidación o nómina.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- D.L. 19990 - Sistema Nacional de Pensiones (ONP).
- Ley 25897 - Sistema Privado de Pensiones (AFP).
- Ley 26790 - Seguro Social de Salud (EsSalud).

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

- `onp_laboral = base_onp * 0.13`

## preguntas_sugeridas

- ¿Qué periodo o nómina quieres revisar?
- ¿Cuál fue la base salarial usada?
- ¿El descuento aparece en tu comprobante y con qué nombre?

## ejemplos_de_consulta

- "¿Cómo aplica onp-afp en mi liquidación?"
- "¿Qué datos necesito para revisar onp-afp?"
