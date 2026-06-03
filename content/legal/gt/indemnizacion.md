---
country: gt
topic: indemnizacion
version: gt-v0.2.0
status: proposed
source: "Codigo de Trabajo de Guatemala, Decreto 1441"
last_reviewed: "2026-06-03"
---

# Indemnizacion por antiguedad

## base_legal

- Arts. 78-82: Indemnizacion universal: 30 dias de salario por cada ano de servicio continuo.
- Art. 82: Limite maximo de 8 meses (240 dias).

## texto_legal

**Artículo 78.** La terminación del contrato de trabajo conforme a una o varias de las causas enumeradas en el artículo anterior, surte efectos desde que el patrono lo comunique por escrito al trabajador indicándole la causa del despido y éste cese efectivamente sus labores, pero el trabajador goza del derecho de emplazar al patrono ante los Tribunales de Trabajo y Previsión Social, antes de que transcurra el término de prescripción, con el objeto de que pruebe la justa causa en que se fundó el despido. Si el patrono no prueba dicha causa, debe pagar al trabajador:

a) Las indemnizaciones que según este Código le pueda corresponder; y

b) A título de daños y perjuicios, los salarios que el trabajador ha dejado de percibir desde el momento del despido hasta el pago de su indemnización hasta un máximo de doce meses de salario y las costas judiciales.

**Artículo 82.** Si el contrato de trabajo por tiempo indeterminado concluye una vez transcurrido el período de prueba, por razón de despido injustificado del trabajador, o por alguna de las causas previstas en el artículo 79, el patrono debe pagar a éste una indemnización por tiempo servido equivalente a un mes de salario por cada año de servicio continuos y si los servicios no alcanzan a un año, en forma proporcional al plazo trabajado.

La indemnización por tiempo servido se rige, además, por estas reglas:

a) Su importe no puede ser objeto de compensación, venta o cesión, ni puede ser embargado, salvo en los términos del artículo 97;

b) Su importe debe calcularse tomando como base el promedio de los salarios devengados por el trabajador durante los últimos seis meses que tengan de vigencia el contrato o el tiempo que haya trabajado, si no se ha ajustado dicho término;

c) La continuidad del trabajo no se interrumpe por enfermedad, vacaciones, licencias, huelga legal u otras causas análogas que según este Código suspenden y no terminan el contrato de trabajo;

d) Es nula ipso jure la cláusula del contrato que tienda a interrumpir la continuidad de los servicios prestados o por prestarse.

## regla_operativa

- 30 dias de salario por cada ano trabajado.
- Fracciones de ano se pagan proporcionalmente.
- Maximo: 240 dias (8 meses).
- Aplica a terminacion por despido injustificado o renuncia voluntaria.

## formula

- `salario_diario = salario_mensual / 30`
- `dias_indemnizacion = min(anos_antiguedad * 30, 240)`
- `monto_indemnizacion = salario_diario * dias_indemnizacion`

## vigencia_fuente

- Codigo de Trabajo Decreto 1441, Arts. 78, 82.

## alcance_documental

- País: Guatemala.
- Tema operativo: `indemnizacion`.
- Fuente primaria local para contraste: `codigo-de-trabajo.md` (Código de Trabajo de Guatemala, Decreto 1441).
- Fuente declarada del resumen: Codigo de Trabajo de Guatemala, Decreto 1441.
- Estado del documento: `proposed`.
- Uso previsto: Determina la indemnización por tiempo servido al terminar la relación laboral.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Arts. 78-82: Indemnizacion universal: 30 dias de salario por cada ano de servicio continuo.
- Art. 82: Limite maximo de 8 meses (240 dias).

## datos_minimos_para_responder

Antes de calcular o dar una conclusión personalizada, el asistente debe verificar estos datos:

- tipo de terminación y causa invocada
- fecha de inicio y fecha de salida
- salario ordinario mensual o promedio aplicable
- si hubo pagos parciales o acuerdos previos

## criterios_de_interpretacion

- distinguir derecho a indemnización de pago de prestaciones proporcionales
- aplicar tope máximo de 240 días solo si está expresamente en la base legal
- no asumir despido injustificado si el usuario solo dice que terminó la relación
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
- `dias_indemnizacion = min(anos_antiguedad * 30, 240)`
- `monto_indemnizacion = salario_diario * dias_indemnizacion`

## preguntas_sugeridas

- ¿La salida fue renuncia, despido con causa, despido sin causa o mutuo acuerdo?
- ¿Cuál fue tu salario ordinario mensual o promedio?
- ¿Cuáles fueron las fechas exactas de inicio y salida?

## ejemplos_de_consulta

- "Me despidieron, ¿qué indemnización aplica?"
- "Renuncié con varios años, ¿qué prestaciones siguen pendientes?"
