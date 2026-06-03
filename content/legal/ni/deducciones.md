---
country: ni
topic: deducciones
version: ni-v0.3.0
status: active
source: "Ley 185 Art. 88 + normativa INSS e IR vigente"
---

# Deducciones

## base_legal

- Art. 88 (Ley 185): del salario se hacen deducciones legales.
- Art. 97 (Ley 185): el decimo tercer mes esta exento de impuesto, descuentos, cotizaciones y deducciones.
- Normativa INSS vigente: cotizacion laboral aplicable.
- Normativa IR vigente para rentas del trabajo.

## texto_legal

**Artículo 88.-** Del salario serán hechas las deducciones legales correspondientes.

**Artículo 97.-** El salario correspondiente al décimo tercer mes es inembargable, salvo para el cumplimiento de las obligaciones de prestar alimentos, tiene la misma protección que el salario mínimo, y estará exento del pago de todo impuesto, descuentos, cotizaciones y deducciones de cualquier especie.

## regla_operativa

- Solo se aplican deducciones permitidas legalmente y sobre conceptos imponibles.
- Aguinaldo proporcional no integra base imponible de deducciones por regla del Art. 97.

## formula

- `inss_laboral = base_inss * tasa_inss_laboral`
- `ir_laboral = base_ir * tasa_ir_laboral`

## variables

- `base_inss`
- `tasa_inss_laboral`
- `base_ir`
- `tasa_ir_laboral`

## supuestos

- Las tasas vigentes son cargadas desde `inss.md` e `ir-rentas-trabajo.md`.

## excepciones

- Si la base imponible resulta 0 o negativa, la deduccion correspondiente es 0.

## vigencia_fuente

- Ley 185 Arts. 88 y 97, mas normas administrativas vigentes de INSS e IR.

## alcance_documental

- País: Nicaragua.
- Tema operativo: `deducciones`.
- Fuente primaria local para contraste: `Ley185Nic.md` (Código del Trabajo, Ley No. 185).
- Fuente declarada del resumen: Ley 185 Art. 88 + normativa INSS e IR vigente.
- Estado del documento: `active`.
- Uso previsto: Enumera deducciones laborales usuales y cómo tratarlas sin convertirlas en asesoría fiscal o previsional definitiva.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 88 (Ley 185): del salario se hacen deducciones legales.
- Art. 97 (Ley 185): el decimo tercer mes esta exento de impuesto, descuentos, cotizaciones y deducciones.
- Normativa INSS vigente: cotizacion laboral aplicable.
- Normativa IR vigente para rentas del trabajo.

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

- `inss_laboral = base_inss * tasa_inss_laboral`
- `ir_laboral = base_ir * tasa_ir_laboral`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `base_inss`
- `tasa_inss_laboral`
- `base_ir`
- `tasa_ir_laboral`

## preguntas_sugeridas

- ¿Qué deducción quieres revisar?
- ¿Sobre qué salario o base te la aplicaron?
- ¿Tienes el comprobante de nómina o detalle de descuento?

## ejemplos_de_consulta

- "¿Qué descuentos pueden aplicar a mi liquidación?"
- "¿Por qué mi neto es menor que el bruto?"
