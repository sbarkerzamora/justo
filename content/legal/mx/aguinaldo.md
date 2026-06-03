---
country: mx
topic: aguinaldo
version: mx-v0.2.0
status: proposed
source: "Ley Federal del Trabajo de Mexico"
last_reviewed: "2026-05-11"
---

# Aguinaldo

## base_legal

- Art. 87: Derecho a 15 dias de salario como aguinaldo minimo.
- Se paga antes del 20 de diciembre de cada ano.

## texto_legal

**Artículo 87.-** Los trabajadores tendrán derecho a un aguinaldo anual que deberá pagarse antes del día veinte de diciembre, equivalente a quince días de salario, por lo menos.

Los que no hayan cumplido el año de servicios, independientemente de que se encuentren laborando o no en la fecha de liquidación del aguinaldo, tendrán derecho a que se les pague la parte proporcional del mismo, conforme al tiempo que hubieren trabajado, cualquiera que fuere éste.

## regla_operativa

- 15 dias de salario por cada ano de servicio.
- Proporcional al tiempo trabajado al terminar la relacion laboral.
- Base: salario diario ordinario.

## formula

- `salario_diario = salario_mensual / 30`
- `aguinaldo_proporcional = salario_diario * 15 * (dias_periodo / 365)`

## vigencia_fuente

- Ley Federal del Trabajo de Mexico, Art. 87.

## alcance_documental

- País: México.
- Tema operativo: `aguinaldo`.
- Fuente primaria local para contraste: `1044_Ley_Federal_del_Trabajo.md` (Ley Federal del Trabajo).
- Fuente declarada del resumen: Ley Federal del Trabajo de Mexico.
- Estado del documento: `proposed`.
- Uso previsto: Describe el aguinaldo o décimo/bonificación anual aplicable, su proporcionalidad y datos necesarios para estimarlo.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 87: Derecho a 15 dias de salario como aguinaldo minimo.
- Se paga antes del 20 de diciembre de cada ano.

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

- `salario_diario = salario_mensual / 30`
- `aguinaldo_proporcional = salario_diario * 15 * (dias_periodo / 365)`

## preguntas_sugeridas

- ¿Qué periodo quieres calcular?
- ¿Ya recibiste algún pago de aguinaldo de ese periodo?
- ¿Tu salario mensual era fijo o variable?

## ejemplos_de_consulta

- "¿Cuánto aguinaldo proporcional me toca?"
- "¿Se incluye el aguinaldo en mi liquidación?"
