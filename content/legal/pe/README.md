# Corpus Legal Peru (MVP)

Version: `pe-v0.2.0`

## Set normativo

1. **Ley General de Trabajo de Peru**.
2. **D.L. 19990** - Sistema Nacional de Pensiones (ONP).
3. **Ley 26790** - Seguro Social de Salud (EsSalud).

## Archivos

- `LEY_GENERAL_TRABAJO_Peru.md` (fuente espejo)
- `indemnizacion.md`
- `cts.md`
- `gratificaciones.md`
- `vacaciones.md`
- `salario-proporcional.md`
- `deducciones.md`
- `onp-afp.md`

## Contrato de datos para el motor

Cada archivo tematico define `base_legal`, `regla_operativa`, `formula`, `variables`, `supuestos`, `excepciones`, `vigencia_fuente`.

## Guia de uso para el asistente

- País cubierto: Perú.
- Fuente primaria local: `LEY_GENERAL_TRABAJO_Peru.md` (Ley General de Trabajo de Perú).
- Documentos temáticos enriquecidos: `cts.md`, `deducciones.md`, `gratificaciones.md`, `indemnizacion.md`, `onp-afp.md`, `vacaciones.md`.
- Antes de responder, el LLM debe recuperar el documento temático más cercano y contrastarlo con la fuente primaria local cuando la pregunta solicite base legal o detalle normativo.
- Para liquidaciones o estimaciones, debe preguntar primero por salario/base, fechas o antigüedad, tipo de terminación y pagos/días pendientes relevantes.
- Si un documento tiene estado `proposed` o contiene tasas sujetas a norma administrativa, la respuesta debe marcar la necesidad de validación legal/contable vigente.
- Ningún documento temático reemplaza asesoría profesional; el contenido es informativo y sirve como fuente operativa del MVP.
