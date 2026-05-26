---
country: ar
topic: deducciones
version: ar-v0.1.0
status: proposed
source: "Ley 24.241 (SIPA) + Ley 23.660 (Obras Sociales)"
last_reviewed: "2026-05-11"
---

# Deducciones (Jubilacion, PAMI, Obra Social)

## base_legal

- Ley 24.241: Sistema Integrado Previsional Argentino (SIPA).
- Ley 19.032: PAMI (INSSJP).
- Ley 23.660: Obras Sociales.

## regla_operativa

- Jubilacion (SIPA): 11% del salario.
- PAMI: 3% del salario.
- Obra Social: 3% del salario.
- Total deducciones seguridad social: 17%.

## formula

- `jubilacion = base * 0.11`
- `pami = base * 0.03`
- `obra_social = base * 0.03`
- `total_seguridad_social = base * 0.17`

## variables

- `base`
- `jubilacion`
- `pami`
- `obra_social`

## supuestos

- `jubilacion = 0.11` (11% SIPA, Ley 24.241, pendiente confirmacion legal final).
- `pami = 0.03` (3% INSSJP, Ley 19.032, pendiente confirmacion legal final).
- `obra_social = 0.03` (3% Obra Social, Ley 23.660, pendiente confirmacion legal final).

## excepciones

- Aguinaldo (SAC) no integra base de deducciones de seguridad social segun regimen vigente.
- Topes minimos y maximos imponibles establecidos por ANSES no aplicados en MVP.

## vigencia_fuente

- Ley 24.241, Ley 19.032, Ley 23.660.

## alcance_documental

- País: Argentina.
- Tema operativo: `deducciones`.
- Fuente primaria local para contraste: `leydeltrabajoargentina.md` (Ley de Contrato de Trabajo 20.744).
- Fuente declarada del resumen: Ley 24.241 (SIPA) + Ley 23.660 (Obras Sociales).
- Estado del documento: `proposed`.
- Uso previsto: Enumera deducciones laborales usuales y cómo tratarlas sin convertirlas en asesoría fiscal o previsional definitiva.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Ley 24.241: Sistema Integrado Previsional Argentino (SIPA).
- Ley 19.032: PAMI (INSSJP).
- Ley 23.660: Obras Sociales.

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

- `jubilacion = base * 0.11`
- `pami = base * 0.03`
- `obra_social = base * 0.03`
- `total_seguridad_social = base * 0.17`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `base`
- `jubilacion`
- `pami`
- `obra_social`

## preguntas_sugeridas

- ¿Qué deducción quieres revisar?
- ¿Sobre qué salario o base te la aplicaron?
- ¿Tienes el comprobante de nómina o detalle de descuento?

## ejemplos_de_consulta

- "¿Qué descuentos pueden aplicar a mi liquidación?"
- "¿Por qué mi neto es menor que el bruto?"
