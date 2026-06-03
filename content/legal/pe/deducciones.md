---
country: pe
topic: deducciones
version: pe-v0.2.0
status: proposed
source: "Ley 26790 + D.L. 19990"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- D.L. 19990: Sistema Nacional de Pensiones (ONP) 13%.
- Ley 26790: EsSalud (9% empleador, no descontado al trabajador).

## regla_operativa

- ONP: 13% sobre base imponible.
- AFP: ~12.5% si el trabajador opto por sistema privado.

## formula

- `onp_laboral = base_onp * tasa_onp`

## variables

- `base_onp`
- `tasa_onp`

## supuestos

- `tasa_onp = 0.13` (13% ONP, D.L. 19990, pendiente confirmacion legal final).
- AFP: ~12.5% si el trabajador opto por sistema privado (no implementado en MVP).

## excepciones

- Gratificaciones no integran base de ONP segun regimen vigente.
- EsSalud (9%) es aportacion patronal, no se descuenta al trabajador.

## vigencia_fuente

- D.L. 19990, Ley 26790.

## alcance_documental

- País: Perú.
- Tema operativo: `deducciones`.
- Fuente primaria local para contraste: `LEY_GENERAL_TRABAJO_Peru.md` (Ley General de Trabajo de Perú).
- Fuente declarada del resumen: Ley 26790 + D.L. 19990.
- Estado del documento: `proposed`.
- Uso previsto: Enumera deducciones laborales usuales y cómo tratarlas sin convertirlas en asesoría fiscal o previsional definitiva.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- D.L. 19990: Sistema Nacional de Pensiones (ONP) 13%.
- Ley 26790: EsSalud (9% empleador, no descontado al trabajador).

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- salario base sujeto a deducción
- régimen de seguridad social o pensión aplicable
- deducciones ya aplicadas por el empleador
- beneficios exentos o no salariales si existen

## criterios_de_interpretacion

- no inventar tasas no documentadas
- distinguir aportes del trabajador y del empleador
- advertir que tasas pueden cambiar por norma administrativa
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

- `onp_laboral = base_onp * tasa_onp`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `base_onp`
- `tasa_onp`

## preguntas_sugeridas

- ¿Qué deducción quieres revisar?
- ¿Sobre qué salario o base te la aplicaron?
- ¿Tienes el comprobante de nómina o detalle de descuento?

## ejemplos_de_consulta

- "¿Qué descuentos pueden aplicar a mi liquidación?"
- "¿Por qué mi neto es menor que el bruto?"
