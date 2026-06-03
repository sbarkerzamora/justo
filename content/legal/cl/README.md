# Corpus Legal Chile (MVP)

Version: `cl-v0.2.0`

## Set normativo

1. **Codigo del Trabajo de Chile** - DFL 1.
2. **D.L. 3.500** - Sistema de AFP.
3. **Ley 18.933** - FONASA/ISAPRE.
4. **Ley 19.728** - Seguro de Cesantia (AFC).

## Archivos

- `codigodeltrabajochile.md` (fuente espejo)
- `indemnizacion.md`
- `vacaciones.md`
- `salario-proporcional.md`
- `deducciones.md`
- `afp.md`
- `salud.md`
- `afc.md`

## Contrato de datos para el motor

Cada archivo tematico define `base_legal`, `regla_operativa`, `formula`, `variables`, `supuestos`, `excepciones`, `vigencia_fuente`.

## Guia de uso para el asistente

- País cubierto: Chile.
- Fuente primaria local: `codigodeltrabajochile.md` (Código del Trabajo de Chile).
- Documentos temáticos enriquecidos: `afc.md`, `afp.md`, `deducciones.md`, `indemnizacion.md`, `salario-proporcional.md`, `salud.md`, `vacaciones.md`.
- Antes de responder, el LLM debe recuperar el documento temático más cercano y contrastarlo con la fuente primaria local cuando la pregunta solicite base legal o detalle normativo.
- Para liquidaciones o estimaciones, debe preguntar primero por salario/base, fechas o antigüedad, tipo de terminación y pagos/días pendientes relevantes.
- Si un documento tiene estado `proposed` o contiene tasas sujetas a norma administrativa, la respuesta debe marcar la necesidad de validación legal/contable vigente.
- Ningún documento temático reemplaza asesoría profesional; el contenido es informativo y sirve como fuente operativa del MVP.
