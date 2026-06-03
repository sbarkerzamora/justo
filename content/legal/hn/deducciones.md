---
country: hn
topic: deducciones
version: hn-v0.2.0
status: proposed
source: "Codigo de Trabajo Decreto 189-59 + normativa IHSS vigente"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- Art. 667 (Art. 95.5): Deducciones solo permitidas por ley, orden judicial o autorizacion escrita.
- Normativa IHSS vigente: cotizacion laboral aplicable.

## regla_operativa

- Solo se aplican deducciones permitidas legalmente.
- Aguinaldo proporcional no integra base imponible de deducciones.

## formula

- `ihss_laboral = base_ihss * tasa_ihss_laboral`

## variables

- `base_ihss`
- `tasa_ihss_laboral`

## supuestos

- Tasa IHSS cargada desde `ihss.md`.

## vigencia_fuente

- Codigo de Trabajo Art. 667 + normativa IHSS vigente.

## alcance_documental

- País: Honduras.
- Tema operativo: `deducciones`.
- Fuente primaria local para contraste: `OpenL-2605112256.md` (Código de Trabajo de Honduras).
- Fuente declarada del resumen: Codigo de Trabajo Decreto 189-59 + normativa IHSS vigente.
- Estado del documento: `proposed`.
- Uso previsto: Enumera deducciones laborales usuales y cómo tratarlas sin convertirlas en asesoría fiscal o previsional definitiva.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 667 (Art. 95.5): Deducciones solo permitidas por ley, orden judicial o autorizacion escrita.
- Normativa IHSS vigente: cotizacion laboral aplicable.

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

- `ihss_laboral = base_ihss * tasa_ihss_laboral`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `base_ihss`
- `tasa_ihss_laboral`

## preguntas_sugeridas

- ¿Qué deducción quieres revisar?
- ¿Sobre qué salario o base te la aplicaron?
- ¿Tienes el comprobante de nómina o detalle de descuento?

## ejemplos_de_consulta

- "¿Qué descuentos pueden aplicar a mi liquidación?"
- "¿Por qué mi neto es menor que el bruto?"
