---
country: cl
topic: afp
version: cl-v0.2.0
status: proposed
source: "D.L. 3.500 (Sistema de AFP de Chile)"
last_reviewed: "2026-05-11"
---

# AFP (Administradora de Fondos de Pensiones)

## base_legal

- D.L. 3.500, Sistema de AFP.
- Cotizacion obligatoria: 10% + comision variable segun AFP (~1.5%).

## formula

- `afp_laboral = base_afp * 0.115`

## supuestos

- `tasa_afp = 0.115` (11.5%: 10% cotizacion + 1.5% comision promedio).

## vigencia_fuente

- D.L. 3.500 y normas reglamentarias.

## alcance_documental

- País: Chile.
- Tema operativo: `afp`.
- Fuente primaria local para contraste: `codigodeltrabajochile.md` (Código del Trabajo de Chile).
- Fuente declarada del resumen: D.L. 3.500 (Sistema de AFP de Chile).
- Estado del documento: `proposed`.
- Uso previsto: Describe aportes o cotizaciones de seguridad social/previsión que pueden incidir en el neto de una liquidación o nómina.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- D.L. 3.500, Sistema de AFP.
- Cotizacion obligatoria: 10% + comision variable segun AFP (~1.5%).

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

- `afp_laboral = base_afp * 0.115`

## preguntas_sugeridas

- ¿Qué periodo o nómina quieres revisar?
- ¿Cuál fue la base salarial usada?
- ¿El descuento aparece en tu comprobante y con qué nombre?

## ejemplos_de_consulta

- "¿Cómo aplica afp en mi liquidación?"
- "¿Qué datos necesito para revisar afp?"
