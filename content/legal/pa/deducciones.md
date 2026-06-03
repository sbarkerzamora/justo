---
country: pa
topic: deducciones
version: pa-v0.2.0
status: proposed
source: "Codigo de Trabajo Art. 161 + Ley Organica CSS"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- Art. 161: Deducciones autorizadas, tope maximo 50% del salario.
- Ley Organica de la CSS.

## texto_legal

**Artículo 161. Deducciones autorizadas.** Solamente podrán realizarse las siguientes retenciones y descuentos:
- El importe del impuesto sobre la renta.
- La cuota del seguro social, en la parte que debe abonar el trabajador.
- El pago de las deudas que el trabajador contraiga con el empleador en concepto de anticipos de salarios o pagos hechos en exceso, pero en ningún caso los descuentos en este concepto podrán ser superiores al 15 por ciento del salario devengado en el respectivo período de pago.
- El pago de las cuotas mensuales por la compra de casas habitaciones, hasta el 30 por ciento de salario.
- El pago de cuotas para asociaciones cooperativas, de ahorros y bancos obreros.
- El pago de pensiones alimenticias a favor de quienes tuvieran derecho a exigir alimentos, siempre que el descuento fuere decretado y ordenado por autoridad competente.
- El excedente de las cuantías inembargables del salario, será embargable hasta en un 15 por ciento.
- El pago de las cuotas sindicales ordinarias y extraordinarias.
- Las sumas que el trabajador deba pagar en concepto de arrendamiento de su vivienda hasta un 30 por ciento de su salario.
- Los pagos por ventas a crédito de artículos elaborados o que se vendan en la empresa, siempre que no exceda de 10 por ciento.
- Las sumas que el trabajador autorice le sean descontadas para cubrir préstamos bancarios y créditos comerciales, hasta por un 20 por ciento de su salario.
- Los que se establezcan por la ley.
- El total de las deducciones o retenciones que autoriza este artículo en ningún caso excederá del 50 por ciento del salario en dinero, salvo que se trate de pensiones alimenticias.

## regla_operativa

- CSS: 9.75% sobre base imponible.
- Tope maximo de deducciones: 50% del salario en efectivo (excepto pension alimenticia).

## formula

- `css_laboral = base_css * tasa_css_laboral`

## variables

- `base_css`
- `tasa_css_laboral`

## supuestos

- `tasa_css_laboral = 0.0975` (9.75%, Ley Organica CSS, pendiente confirmacion legal final en produccion).

## excepciones

- Tope maximo de deducciones: 50% del salario en efectivo (Art. 161), excepto pension alimenticia.
- Decimotercer mes no integra base de CSS segun regimen vigente.

## vigencia_fuente

- Codigo de Trabajo Art. 161 + Ley Organica CSS.

## alcance_documental

- País: Panamá.
- Tema operativo: `deducciones`.
- Fuente primaria local para contraste: `codigo-de-trabajo-panama.md` (Código de Trabajo de Panamá).
- Fuente declarada del resumen: Codigo de Trabajo Art. 161 + Ley Organica CSS.
- Estado del documento: `proposed`.
- Uso previsto: Enumera deducciones laborales usuales y cómo tratarlas sin convertirlas en asesoría fiscal o previsional definitiva.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 161: Deducciones autorizadas, tope maximo 50% del salario.
- Ley Organica de la CSS.

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

- `css_laboral = base_css * tasa_css_laboral`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `base_css`
- `tasa_css_laboral`

## preguntas_sugeridas

- ¿Qué deducción quieres revisar?
- ¿Sobre qué salario o base te la aplicaron?
- ¿Tienes el comprobante de nómina o detalle de descuento?

## ejemplos_de_consulta

- "¿Qué descuentos pueden aplicar a mi liquidación?"
- "¿Por qué mi neto es menor que el bruto?"
