---
country: mx
topic: deducciones
version: mx-v0.2.0
status: proposed
source: "Ley Federal del Trabajo Art. 110 + Ley del Seguro Social"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- Art. 110: Deducciones autorizadas y limites.
- Ley del Seguro Social: cotizacion IMSS.
- Ley del INFONAVIT: aportacion patronal del 5% (no descontada al trabajador).

## texto_legal

**Artículo 110.-** Los descuentos en los salarios de los trabajadores, están prohibidos salvo en los casos y con los requisitos siguientes:

I. Pago de deudas contraídas con el patrón por anticipo de salarios, pagos hechos con exceso al trabajador, errores, pérdidas, averías o adquisición de artículos producidos por la empresa o establecimiento. La cantidad exigible en ningún caso podrá ser mayor del importe de los salarios de un mes y el descuento será al que convengan el trabajador y el patrón, sin que pueda ser mayor del treinta por ciento del excedente del salario mínimo;

II. Pago de la renta a que se refiere el artículo 151 que no podrá exceder del quince por ciento del salario.

III. Pago de abonos para cubrir préstamos provenientes del Fondo Nacional de la Vivienda para los Trabajadores destinados a la adquisición, construcción, reparación, ampliación o mejoras de casas habitación o al pago de pasivos adquiridos por estos conceptos. ...

IV. Pago de cuotas para la constitución y fomento de sociedades cooperativas y de cajas de ahorro, siempre que los trabajadores manifiesten expresa y libremente su conformidad y que no sean mayores del treinta por ciento del excedente del salario mínimo;

V. Pago de pensiones alimenticias en favor de acreedores alimentarios, decretado por la autoridad competente. ...

VI. Pago de las cuotas sindicales ordinarias previstas en los estatutos de los sindicatos.

VII. Pago de abonos para cubrir créditos garantizados por el Instituto a que se refiere el artículo 103 Bis de esta Ley, destinados a la adquisición de bienes de consumo, o al pago de servicios. Estos descuentos deberán haber sido aceptados libremente por el trabajador y no podrán exceder del veinte por ciento del salario.

## regla_operativa

- IMSS: ~2.5% sobre salario base de cotizacion.
- Aguinaldo exento de deducciones.
- INFONAVIT es aportacion patronal, no se descuenta al trabajador.

## formula

- `imss_laboral = base_imss * tasa_imss_laboral`

## variables

- `base_imss`
- `tasa_imss_laboral`

## supuestos

- `tasa_imss_laboral = 0.025` (2.5%: enfermedades ~1.5% + invalidez ~0.625% + cesantia ~0.375%, pendiente confirmacion legal final).

## excepciones

- Aguinaldo exento de deducciones IMSS segun LFT Art. 87.
- INFONAVIT es aportacion patronal, no se descuenta al trabajador.

## vigencia_fuente

- LFT Art. 110 + Ley del Seguro Social.

## alcance_documental

- País: México.
- Tema operativo: `deducciones`.
- Fuente primaria local para contraste: `1044_Ley_Federal_del_Trabajo.md` (Ley Federal del Trabajo).
- Fuente declarada del resumen: Ley Federal del Trabajo Art. 110 + Ley del Seguro Social.
- Estado del documento: `proposed`.
- Uso previsto: Enumera deducciones laborales usuales y cómo tratarlas sin convertirlas en asesoría fiscal o previsional definitiva.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 110: Deducciones autorizadas y limites.
- Ley del Seguro Social: cotizacion IMSS.
- Ley del INFONAVIT: aportacion patronal del 5% (no descontada al trabajador).

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

- `imss_laboral = base_imss * tasa_imss_laboral`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `base_imss`
- `tasa_imss_laboral`

## preguntas_sugeridas

- ¿Qué deducción quieres revisar?
- ¿Sobre qué salario o base te la aplicaron?
- ¿Tienes el comprobante de nómina o detalle de descuento?

## ejemplos_de_consulta

- "¿Qué descuentos pueden aplicar a mi liquidación?"
- "¿Por qué mi neto es menor que el bruto?"
