---
country: ar
topic: vacaciones
version: ar-v0.2.0
status: proposed
source: "Ley 20.744 de Contrato de Trabajo"
last_reviewed: "2026-05-11"
---

# Vacaciones

## base_legal

- Art. 150: Dias de vacaciones segun antiguedad.
- Art. 151: Requisito minimo de dias trabajados.
- Art. 153: Proporcional al tiempo trabajado.
- Art. 155: Pago a salario dividido 25 por dia.

## texto_legal

**Art. 150.** — Licencia ordinaria. El trabajador gozará de un período mínimo y continuado de descanso anual remunerado por los siguientes plazos:

a) De catorce (14) días corridos cuando la antigüedad en el empleo no exceda de cinco (5) años.

b) De veintiún (21) días corridos cuando siendo la antigüedad mayor de cinco (5) años no exceda de diez (10).

c) De veintiocho (28) días corridos cuando la antigüedad siendo mayor de diez (10) años no exceda de veinte (20).

d) De treinta y cinco (35) días corridos cuando la antigüedad exceda de veinte (20) años.

**Art. 151.** — Requisitos para su goce. Comienzo de la licencia. El trabajador, para tener derecho cada año al beneficio establecido en el artículo 150 de esta ley, deberá haber prestado servicios durante la mitad, como mínimo, de los días hábiles comprendidos en el año calendario o aniversario respectivo.

**Art. 153.** — Falta de tiempo mínimo. Licencia proporcional. Cuando el trabajador no llegase a totalizar el tiempo mínimo de trabajo previsto en el artículo 151 de esta ley, gozará de un período de descanso anual, en proporción de un (1) día de descanso por cada veinte (20) días de trabajo efectivo.

**Art. 155.** — Retribución. El trabajador percibirá retribución durante el período de vacaciones, la que se determinará de la siguiente manera:

a) Tratándose de trabajos remunerados con sueldo mensual, dividiendo por veinticinco (25) el importe del sueldo que perciba en el momento de su otorgamiento.

b) Tratándose de trabajos remunerados por día o por hora, se abonará por cada día de vacación el importe que le hubiere correspondido percibir al trabajador en la jornada anterior a la fecha en que comience en el goce de las mismas.

c) En caso de salario a destajo, comisiones individuales o colectivas, porcentajes u otras formas variables, de acuerdo al promedio de los sueldos devengados durante el año que corresponda al otorgamiento de las vacaciones o, a opción del trabajador, durante los últimos seis (6) meses de prestación de servicios.

## regla_operativa

- 0 a 5 anos: 14 dias.
- 5 a 10 anos: 21 dias.
- 10 a 20 anos: 28 dias.
- 20 anos o mas: 35 dias.
- Pago: salario_mensual / 25 por dia (no /30).
- Proporcional al tiempo trabajado al terminar la relacion.

## formula

- `salario_vacacional = salario_mensual / 25`
- `vacaciones_pendientes = salario_vacacional * dias_vacaciones_pendientes`

## vigencia_fuente

- Ley 20.744, Arts. 150, 151, 153, 155.

## alcance_documental

- País: Argentina.
- Tema operativo: `vacaciones`.
- Fuente primaria local para contraste: `leydeltrabajoargentina.md` (Ley de Contrato de Trabajo 20.744).
- Fuente declarada del resumen: Ley 20.744 de Contrato de Trabajo.
- Estado del documento: `proposed`.
- Uso previsto: Explica el derecho a vacaciones, su pago al terminar la relación y la forma de valorar días pendientes o proporcionales.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 150: Dias de vacaciones segun antiguedad.
- Art. 151: Requisito minimo de dias trabajados.
- Art. 153: Proporcional al tiempo trabajado.
- Art. 155: Pago a salario dividido 25 por dia.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- días de vacaciones pendientes o gozados
- periodo laborado desde el último corte
- salario ordinario o promedio si era variable

## criterios_de_interpretacion

- no confundir vacaciones gozadas con vacaciones pagadas pendientes
- usar salario ordinario/promedio indicado por la fuente
- pedir días pendientes cuando el sistema no pueda inferirlos con certeza
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

- `salario_vacacional = salario_mensual / 25`
- `vacaciones_pendientes = salario_vacacional * dias_vacaciones_pendientes`

## preguntas_sugeridas

- ¿Cuántos días de vacaciones pendientes tenías?
- ¿Tu salario era fijo o variable?
- ¿Desde cuándo no te liquidaban vacaciones?

## ejemplos_de_consulta

- "¿Me deben pagar vacaciones no gozadas?"
- "¿Cómo calculo días pendientes si trabajé parte del año?"
