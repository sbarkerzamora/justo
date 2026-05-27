---
country: co
topic: eps-pension
version: co-v0.1.0
status: proposed
source: "Ley 100 de 1993 (Sistema de Seguridad Social)"
last_reviewed: "2026-05-11"
---

# EPS y Pension (seguridad social)

## base_legal

- Ley 100 de 1993, Sistema de Seguridad Social Integral.
- EPS (salud): ~4% trabajador.
- AFP/Pension: ~4% trabajador.
- Total aporte trabajador: ~8%.

## formula

- `eps_laboral = base_eps * 0.04`
- `pension_laboral = base_pension * 0.04`
- `total_seguridad_social = eps_laboral + pension_laboral`

## supuestos

- `tasa_eps = 0.04` (4% para salud)
- `tasa_pension = 0.04` (4% para pension)
- Tasas propuestas pendientes confirmacion legal final.

## vigencia_fuente

- Ley 100 de 1993 y normas reglamentarias.

## alcance_documental

- País: Colombia.
- Tema operativo: `eps-pension`.
- Fuente primaria local para contraste: `CODIGO SUSTANTIVO DEL TRABAJO - Colombia _ SUIN Juriscol.md` (Código Sustantivo del Trabajo).
- Fuente declarada del resumen: Ley 100 de 1993 (Sistema de Seguridad Social).
- Estado del documento: `proposed`.
- Uso previsto: Describe aportes o cotizaciones de seguridad social/previsión que pueden incidir en el neto de una liquidación o nómina.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Ley 100 de 1993, Sistema de Seguridad Social Integral.
- EPS (salud): ~4% trabajador.
- AFP/Pension: ~4% trabajador.
- Total aporte trabajador: ~8%.

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

- `eps_laboral = base_eps * 0.04`
- `pension_laboral = base_pension * 0.04`
- `total_seguridad_social = eps_laboral + pension_laboral`

## preguntas_sugeridas

- ¿Qué periodo o nómina quieres revisar?
- ¿Cuál fue la base salarial usada?
- ¿El descuento aparece en tu comprobante y con qué nombre?

## ejemplos_de_consulta

- "¿Cómo aplica eps-pension en mi liquidación?"
- "¿Qué datos necesito para revisar eps-pension?"
