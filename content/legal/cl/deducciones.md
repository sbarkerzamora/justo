---
country: cl
topic: deducciones
version: cl-v0.1.0
status: proposed
source: "DL 3.500 + Ley 18.933 + Ley 19.728"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- Art. 58: Empleador debe deducir cotizaciones de seguridad social.
- D.L. 3.500: AFP (11.5%).
- Ley 18.933: Salud FONASA/ISAPRE (7%).
- Ley 19.728: Seguro de Cesantia AFC (0.6%).

## formula

- `afp_laboral = base_afp * tasa_afp`
- `salud_laboral = base_salud * tasa_salud`
- `afc_laboral = base_afc * tasa_afc`
- `total = afp_laboral + salud_laboral + afc_laboral`

## variables

- `base_afp`
- `tasa_afp`
- `base_salud`
- `tasa_salud`
- `base_afc`
- `tasa_afc`

## supuestos

- `tasa_afp = 0.115` (11.5%: 10% cotizacion + 1.5% comision promedio, D.L. 3.500, pendiente confirmacion).
- `tasa_salud = 0.07` (7% FONASA/ISAPRE, Ley 18.933).
- `tasa_afc = 0.006` (0.6% Seguro Cesantia, Ley 19.728).

## excepciones

- Indemnizacion por anos de servicio no integra base de cotizaciones previsionales.
- Tope imponible de AFP y Salud (80,2 UF) no aplicado en MVP.

## vigencia_fuente

- Codigo del Trabajo Art. 58 + DL 3.500 + Ley 18.933 + Ley 19.728.

## alcance_documental

- País: Chile.
- Tema operativo: `deducciones`.
- Fuente primaria local para contraste: `codigodeltrabajochile.md` (Código del Trabajo de Chile).
- Fuente declarada del resumen: DL 3.500 + Ley 18.933 + Ley 19.728.
- Estado del documento: `proposed`.
- Uso previsto: Enumera deducciones laborales usuales y cómo tratarlas sin convertirlas en asesoría fiscal o previsional definitiva.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 58: Empleador debe deducir cotizaciones de seguridad social.
- D.L. 3.500: AFP (11.5%).
- Ley 18.933: Salud FONASA/ISAPRE (7%).
- Ley 19.728: Seguro de Cesantia AFC (0.6%).

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

- `afp_laboral = base_afp * tasa_afp`
- `salud_laboral = base_salud * tasa_salud`
- `afc_laboral = base_afc * tasa_afc`
- `total = afp_laboral + salud_laboral + afc_laboral`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `base_afp`
- `tasa_afp`
- `base_salud`
- `tasa_salud`
- `base_afc`
- `tasa_afc`

## preguntas_sugeridas

- ¿Qué deducción quieres revisar?
- ¿Sobre qué salario o base te la aplicaron?
- ¿Tienes el comprobante de nómina o detalle de descuento?

## ejemplos_de_consulta

- "¿Qué descuentos pueden aplicar a mi liquidación?"
- "¿Por qué mi neto es menor que el bruto?"
