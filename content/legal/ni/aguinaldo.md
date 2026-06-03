---
country: ni
topic: aguinaldo
version: ni-v0.3.0
status: active
source: "Codigo del Trabajo, Ley No. 185"
---

# Aguinaldo

## base_legal

- Art. 93: derecho a decimo tercer mes completo o proporcional.
- Art. 94: base de calculo (ultimo salario o salario mas alto de ultimos 6 meses en modalidad variable).
- Art. 95: oportunidad de pago.
- Art. 97: exencion de impuesto, descuentos, cotizaciones y deducciones.

## texto_legal

**Artículo 93.-** Todo trabajador tiene derecho a que su empleador le pague un mes de salario adicional después de un año de trabajo continuo, o la parte proporcional que corresponda al período de tiempo trabajado, mayor de un mes y menor de un año.

Se entiende por salario adicional o décimo-tercer mes la remuneración en dinero recibido por el trabajador en concepto de salario ordinario conforme este Código.

**Artículo 94.-** El salario adicional anual o décimo tercer mes se pagará conforme al último mes de salario recibido, salvo cuando se devengare salario por comisiones, obra, al destajo y cualquier otra modalidad compleja; en estos casos se pagará conforme el salario más alto recibido durante los últimos seis meses.

**Artículo 95.-** El décimo-tercer mes deberá ser pagado dentro de los primeros diez días del mes de diciembre de cada año, o dentro de los primeros diez días después de terminado el contrato de trabajo. En caso de no hacerlo el empleador pagará al trabajador una indemnización equivalente al valor de un día de trabajo por cada día de retraso.

**Artículo 97.-** El salario correspondiente al décimo tercer mes es inembargable, salvo para el cumplimiento de las obligaciones de prestar alimentos, tiene la misma protección que el salario mínimo, y estará exento del pago de todo impuesto, descuentos, cotizaciones y deducciones de cualquier especie.

## regla_operativa

- Al finalizar relacion laboral, se paga parte proporcional del decimo tercer mes por tiempo trabajado mayor de un mes y menor de un ano.

## formula

- `aguinaldo_proporcional = salario_base_aguinaldo * (dias_periodo / 365)`

## variables

- `salario_base_aguinaldo`
- `dias_periodo`
- `modalidad_salario` (fijo o variable)

## supuestos

- El MVP usa salario mensual fijo como base, salvo que se habilite modulo de salario variable.

## excepciones

- Si el tiempo trabajado no supera un mes, no se liquida proporcional de aguinaldo por esta regla.

## vigencia_fuente

- Ley No. 185, Arts. 93, 94, 95, 97.

## alcance_documental

- País: Nicaragua.
- Tema operativo: `aguinaldo`.
- Fuente primaria local para contraste: `Ley185Nic.md` (Código del Trabajo, Ley No. 185).
- Fuente declarada del resumen: Codigo del Trabajo, Ley No. 185.
- Estado del documento: `active`.
- Uso previsto: Describe el aguinaldo o décimo/bonificación anual aplicable, su proporcionalidad y datos necesarios para estimarlo.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 93: derecho a decimo tercer mes completo o proporcional.
- Art. 94: base de calculo (ultimo salario o salario mas alto de ultimos 6 meses en modalidad variable).
- Art. 95: oportunidad de pago.
- Art. 97: exencion de impuesto, descuentos, cotizaciones y deducciones.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- periodo anual aplicable
- meses o días laborados en el periodo
- salario ordinario o promedio
- pagos de aguinaldo ya recibidos

## criterios_de_interpretacion

- calcular proporcionalidad solo con periodo conocido
- deducir pagos ya realizados si el usuario los confirma
- distinguir aguinaldo legal de bonos voluntarios
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

- `aguinaldo_proporcional = salario_base_aguinaldo * (dias_periodo / 365)`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `salario_base_aguinaldo`
- `dias_periodo`
- `modalidad_salario` (fijo o variable)

## preguntas_sugeridas

- ¿Qué periodo quieres calcular?
- ¿Ya recibiste algún pago de aguinaldo de ese periodo?
- ¿Tu salario mensual era fijo o variable?

## ejemplos_de_consulta

- "¿Cuánto aguinaldo proporcional me toca?"
- "¿Se incluye el aguinaldo en mi liquidación?"
