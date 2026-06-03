---
country: ar
topic: preaviso
version: ar-v0.2.0
status: proposed
source: "Ley 20.744 de Contrato de Trabajo"
last_reviewed: "2026-05-11"
---

# Preaviso

## base_legal

- Art. 231: Plazos de preaviso segun antiguedad.
- Art. 232: Indemnizacion sustitutiva si no se otorga preaviso.
- Art. 233: Integracion del mes de despido.

## texto_legal

**Art. 231.** — Plazos. El contrato de trabajo no podrá ser disuelto por voluntad de una de las partes, sin previo aviso, o en su defecto, indemnización además de la que corresponda al trabajador por su antigüedad en el empleo, cuando el contrato se disuelva por voluntad del empleador. El preaviso, cuando las partes no lo fijen en un término mayor, deberá darse con la anticipación siguiente:

a) por el trabajador, de QUINCE (15) días;

b) por el empleador, de un (1) mes cuando el trabajador tuviese una antigüedad en el empleo que no exceda de cinco (5) años y de dos (2) meses cuando fuere superior.

**Art. 232.** — Indemnización substitutiva. La parte que omita el preaviso o lo otorgue de modo insuficiente deberá abonar a la otra una indemnización substitutiva equivalente a la remuneración que correspondería al trabajador durante los plazos señalados en el artículo 231.

**Art. 233.** — Comienzo del plazo. Integración de la indemnización con los salarios del mes del despido. Los plazos del artículo 231 correrán a partir del día siguiente al de la notificación del preaviso.

Cuando la extinción del contrato de trabajo dispuesta por el empleador se produzca sin preaviso y en fecha que no coincida con el último día del mes, la indemnización sustitutiva debida al trabajador se integrará con una suma igual a los salarios por los días faltantes hasta el último día del mes en el que se produjera el despido.

## regla_operativa

- Antiguedad hasta 5 anos: 1 mes de preaviso.
- Antiguedad mayor a 5 anos: 2 meses de preaviso.
- Si no se otorga preaviso, se paga indemnizacion sustitutiva equivalente.
- Integracion mes de despido: si el despido no ocurre el ultimo dia del mes, se pagan los dias restantes.

## formula

- `dias_preaviso = antiguedad > 5 ? 60 : 30`
- `preaviso = salario_diario * dias_preaviso`

## vigencia_fuente

- Ley 20.744, Arts. 231, 232, 233.

## alcance_documental

- País: Argentina.
- Tema operativo: `preaviso`.
- Fuente primaria local para contraste: `leydeltrabajoargentina.md` (Ley de Contrato de Trabajo 20.744).
- Fuente declarada del resumen: Ley 20.744 de Contrato de Trabajo.
- Estado del documento: `proposed`.
- Uso previsto: Aclara cuándo procede preaviso, sustitución en dinero o descuento relacionado con la anticipación de la terminación.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 231: Plazos de preaviso segun antiguedad.
- Art. 232: Indemnizacion sustitutiva si no se otorga preaviso.
- Art. 233: Integracion del mes de despido.

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- tipo de terminación
- antigüedad
- días de aviso otorgados
- salario ordinario usado como base

## criterios_de_interpretacion

- separar preaviso de indemnización principal
- verificar si la obligación depende de antigüedad o causal
- evitar duplicar pago si el aviso ya fue laborado
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

- `dias_preaviso = antiguedad > 5 ? 60 : 30`
- `preaviso = salario_diario * dias_preaviso`

## preguntas_sugeridas

- ¿Quién terminó la relación laboral?
- ¿Cuántos días de aviso se dieron?
- ¿Cuál era tu antigüedad y salario ordinario?

## ejemplos_de_consulta

- "¿Me deben pagar preaviso?"
- "¿Pueden descontarme por no avisar?"
