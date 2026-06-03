# Corpus Legal Argentina (MVP)

Version: `ar-v0.2.0`

## Set normativo

1. **Ley de Contrato de Trabajo** - Ley 20.744 (reforma Ley 27.802).
2. **Ley 23.041** - Sueldo Anual Complementario (SAC).
3. **Ley 24.241** - Sistema Integrado Previsional Argentino (SIPA).
4. **Ley 19.032** - PAMI.
5. **Ley 23.660** - Obras Sociales.

## Archivos

- `leydeltrabajoargentina.md` (fuente espejo LCT)
- `indemnizacion.md`
- `preaviso.md`
- `sac-aguinaldo.md`
- `vacaciones.md`
- `salario-proporcional.md`
- `deducciones.md`

## Contrato de datos para el motor

Cada archivo tematico define `base_legal`, `regla_operativa`, `formula`, `variables`, `supuestos`, `excepciones`, `vigencia_fuente`.

## Guia de uso para el asistente

- País cubierto: Argentina.
- Fuente primaria local: `leydeltrabajoargentina.md` (Ley de Contrato de Trabajo 20.744).
- Documentos temáticos enriquecidos: `deducciones.md`, `indemnizacion.md`, `preaviso.md`, `sac-aguinaldo.md`, `salario-proporcional.md`, `vacaciones.md`.
- Antes de responder, el LLM debe recuperar el documento temático más cercano y contrastarlo con la fuente primaria local cuando la pregunta solicite base legal o detalle normativo.
- Para liquidaciones o estimaciones, debe preguntar primero por salario/base, fechas o antigüedad, tipo de terminación y pagos/días pendientes relevantes.
- Si un documento tiene estado `proposed` o contiene tasas sujetas a norma administrativa, la respuesta debe marcar la necesidad de validación legal/contable vigente.
- Ningún documento temático reemplaza asesoría profesional; el contenido es informativo y sirve como fuente operativa del MVP.
