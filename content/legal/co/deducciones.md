---
country: co
topic: deducciones
version: co-v0.2.0
status: proposed
source: "Codigo Sustantivo del Trabajo Art. 150 + Ley 100 de 1993"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- Art. 150: Deducciones autorizadas y topes.
- Ley 100 de 1993: Seguridad social obligatoria.

## texto_legal

**Artículo 150. Descuentos permitidos.** Son permitidos los descuentos y retenciones por conceptos de cuotas sindicales y de cooperativas y cajas de ahorro, autorizadas en forma legal; de cuotas con destino al seguro social obligatorio, y de sanciones disciplinarias impuestas de conformidad con el reglamento del trabajo debidamente aprobado.

## regla_operativa

- EPS (salud): 4% sobre base.
- Pension (AFP): 4% sobre base.
- Total seguridad social: 8% sobre base imponible.
- Tope de embargabilidad: 20% del exceso sobre minimo (Art. 155).

## formula

- `eps_laboral = base_eps * tasa_eps`
- `pension_laboral = base_pension * tasa_pension`
- `total_seguridad_social = eps_laboral + pension_laboral`

## variables

- `base_eps`
- `tasa_eps`
- `base_pension`
- `tasa_pension`

## supuestos

- `tasa_eps = 0.04` (4% salud, Ley 100 de 1993, pendiente confirmacion legal final).
- `tasa_pension = 0.04` (4% pension, Ley 100 de 1993, pendiente confirmacion legal final).

## excepciones

- Aguinaldo y cesantia no integran base de deducciones de seguridad social segun regimen vigente.
- Aportes a cuenta AFC (ahorro voluntario) no implementados en MVP.

## vigencia_fuente

- Codigo Sustantivo del Trabajo Arts. 150, 155 + Ley 100 de 1993.

## alcance_documental

- País: Colombia.
- Tema operativo: `deducciones`.
- Fuente primaria local para contraste: `CODIGO SUSTANTIVO DEL TRABAJO - Colombia _ SUIN Juriscol.md` (Código Sustantivo del Trabajo).
- Fuente declarada del resumen: Codigo Sustantivo del Trabajo Art. 150 + Ley 100 de 1993.
- Estado del documento: `proposed`.
- Uso previsto: Enumera deducciones laborales usuales y cómo tratarlas sin convertirlas en asesoría fiscal o previsional definitiva.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 150: Deducciones autorizadas y topes.
- Ley 100 de 1993: Seguridad social obligatoria.

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

- `eps_laboral = base_eps * tasa_eps`
- `pension_laboral = base_pension * tasa_pension`
- `total_seguridad_social = eps_laboral + pension_laboral`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `base_eps`
- `tasa_eps`
- `base_pension`
- `tasa_pension`

## preguntas_sugeridas

- ¿Qué deducción quieres revisar?
- ¿Sobre qué salario o base te la aplicaron?
- ¿Tienes el comprobante de nómina o detalle de descuento?

## ejemplos_de_consulta

- "¿Qué descuentos pueden aplicar a mi liquidación?"
- "¿Por qué mi neto es menor que el bruto?"
