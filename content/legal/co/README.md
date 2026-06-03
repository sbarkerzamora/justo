# Corpus Legal Colombia (MVP)

Version: `co-v0.2.0`

## Set normativo

1. **Codigo Sustantivo del Trabajo de Colombia**.
2. **Ley 100 de 1993** - Sistema de Seguridad Social (EPS, Pension).
3. **Ley 52 de 1975** - Intereses a las cesantias.

## Archivos

- `CODIGO SUSTANTIVO DEL TRABAJO - Colombia _ SUIN Juriscol.md` (fuente espejo)
- `cesantia.md`
- `indemnizacion.md`
- `prima-servicios.md`
- `vacaciones.md`
- `salario-proporcional.md`
- `deducciones.md`
- `eps-pension.md`

## Contrato de datos para el motor

Cada archivo tematico define `base_legal`, `regla_operativa`, `formula`, `variables`, `supuestos`, `excepciones`, `vigencia_fuente`.

## Guia de uso para el asistente

- País cubierto: Colombia.
- Fuente primaria local: `CODIGO SUSTANTIVO DEL TRABAJO - Colombia _ SUIN Juriscol.md` (Código Sustantivo del Trabajo).
- Documentos temáticos enriquecidos: `cesantia.md`, `deducciones.md`, `eps-pension.md`, `indemnizacion.md`, `prima-servicios.md`, `vacaciones.md`.
- Antes de responder, el LLM debe recuperar el documento temático más cercano y contrastarlo con la fuente primaria local cuando la pregunta solicite base legal o detalle normativo.
- Para liquidaciones o estimaciones, debe preguntar primero por salario/base, fechas o antigüedad, tipo de terminación y pagos/días pendientes relevantes.
- Si un documento tiene estado `proposed` o contiene tasas sujetas a norma administrativa, la respuesta debe marcar la necesidad de validación legal/contable vigente.
- Ningún documento temático reemplaza asesoría profesional; el contenido es informativo y sirve como fuente operativa del MVP.
