---
country: gt
topic: deducciones
version: gt-v0.2.0
status: proposed
source: "Codigo de Trabajo Decreto 1441 Art. 88 + Ley del IGSS + Ley del ISR"
last_reviewed: "2026-06-03"
---

# Deducciones legales

## base_legal

- Art. 88: Del salario se hacen deducciones legales.
- Ley del IGSS: Cotizacion del 4.83% para el trabajador.
- Ley del ISR: Impuesto sobre la renta del trabajo.

## texto_legal

**Artículo 88. Salario o sueldo.** Salario o sueldo es la retribución que el patrono debe pagar al trabajador en virtud del cumplimiento del contrato de trabajo o de la relación de trabajo vigente entre ambos. Salvo las excepciones legales, todo servicio prestado por un trabajador a su respectivo patrono, debe ser remunerado por éste.

El cálculo de esta remuneración, para el efecto de su pago, puede pactarse:

a) Por unidad de tiempo (por mes, quincena, semana, día u hora);

b) Por unidad de obra (por pieza, tarea, precio alzado o a destajo), y

c) Por participación en las utilidades, ventas o cobros que haga el patrono; pero en ningún caso el trabajador deberá asumir los riesgos de pérdidas que tenga el patrono.

## regla_operativa

- IGSS se calcula sobre salario proporcional + vacaciones pagadas.
- ISR se calcula sobre ingreso bruto menos IGSS, aguinaldo y bono 14.
- Aguinaldo y Bono 14 estan exentos de deducciones.

## formula

- `igss_laboral = (salario_proporcional + vacaciones) * 0.0483`
- `isr_base = ingreso_bruto - igss - aguinaldo - bono14`
- `isr_laboral = max(isr_base, 0) * 0.05`
- `total_deducciones = igss_laboral + isr_laboral`

## variables

- `salario_proporcional`
- `vacaciones`
- `ingreso_bruto`
- `aguinaldo`
- `bono14`

## supuestos

- `tasa_igss = 0.0483` (4.83% IGSS trabajador, pendiente confirmacion legal final).
- `tasa_isr = 0.05` (5% ISR simplificado, pendiente tabla progresiva oficial).

## excepciones

- Aguinaldo y Bono 14 no integran base de deducciones de seguridad social.
- Aportes a cuenta AFC (ahorro voluntario) no implementados en MVP.

## vigencia_fuente

- Codigo de Trabajo Decreto 1441 Art. 88 + Ley del IGSS + Ley del ISR.

## alcance_documental

- País: Guatemala.
- Tema operativo: `deducciones`.
- Fuente primaria local para contraste: `codigo-de-trabajo.md` (Código de Trabajo de Guatemala, Decreto 1441).
- Fuente declarada del resumen: Codigo de Trabajo Decreto 1441 Art. 88 + Ley del IGSS + Ley del ISR.
- Estado del documento: `proposed`.
- Uso previsto: Enumera deducciones laborales usuales y cómo tratarlas sin convertirlas en asesoría fiscal o previsional definitiva.

## trazabilidad_normativa

La respuesta del asistente debe partir de estas referencias ya capturadas en el corpus y, cuando el usuario pida detalle legal, contrastarlas con la fuente primaria del país antes de responder:

- Art. 88: Del salario se hacen deducciones legales.
- Ley del IGSS: Cotizacion del 4.83% para el trabajador.
- Ley del ISR: Impuesto sobre la renta del trabajo.

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

- `igss_laboral = (salario_proporcional + vacaciones) * 0.0483`
- `isr_base = ingreso_bruto - igss - aguinaldo - bono14`
- `isr_laboral = max(isr_base, 0) * 0.05`
- `total_deducciones = igss_laboral + isr_laboral`

## variables_documentadas

Variables ya definidas para el motor o para capturar contexto:

- `salario_proporcional`
- `vacaciones`
- `ingreso_bruto`
- `aguinaldo`
- `bono14`

## preguntas_sugeridas

- ¿Qué deducción quieres revisar?
- ¿Sobre qué salario o base te la aplicaron?
- ¿Tienes el comprobante de nómina o detalle de descuento?

## ejemplos_de_consulta

- "¿Qué descuentos pueden aplicar a mi liquidación?"
- "¿Por qué mi neto es menor que el bruto?"
