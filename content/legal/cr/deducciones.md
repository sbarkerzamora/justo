---
country: cr
topic: deducciones
version: cr-v0.1.0
status: proposed
source: "Codigo de Trabajo + Ley Constitutiva CCSS"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- Ley Constitutiva de la CCSS (Ley No. 17).
- Normativa vigente de deducciones obligatorias.

## regla_operativa

- CCSS: 9.17% sobre base imponible.
- Aguinaldo exento de deducciones.

## formula

- `ccss_laboral = base_ccss * 0.0917`

## vigencia_fuente

- Ley No. 17 + normativa CCSS vigente.

## alcance_documental

- País: Costa Rica.
- Tema operativo: `deducciones`.
- Fuente primaria local para contraste: `OpenL-2605112303.md` (Código de Trabajo de Costa Rica).
- Fuente declarada del resumen: Codigo de Trabajo + Ley Constitutiva CCSS.
- Estado del documento: `proposed`.
- Uso previsto: Enumera deducciones laborales usuales y cómo tratarlas sin convertirlas en asesoría fiscal o previsional definitiva.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Ley Constitutiva de la CCSS (Ley No. 17).
- Normativa vigente de deducciones obligatorias.

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

- `ccss_laboral = base_ccss * 0.0917`

## preguntas_sugeridas

- ¿Qué deducción quieres revisar?
- ¿Sobre qué salario o base te la aplicaron?
- ¿Tienes el comprobante de nómina o detalle de descuento?

## ejemplos_de_consulta

- "¿Qué descuentos pueden aplicar a mi liquidación?"
- "¿Por qué mi neto es menor que el bruto?"
