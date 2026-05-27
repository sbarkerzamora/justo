# Corpus Legal Panama (MVP)

Version: `pa-v0.1.0`

## Set normativo

1. **Codigo de Trabajo de Panama**.
2. **Ley 13 de 1994** (Decimotercer Mes).
3. **Ley Organica de la Caja de Seguro Social**.

## Archivos

- `codigo-de-trabajo-panama.md` (fuente espejo)
- `codigo-de-trabajo-panama.pdf`
- `indemnizacion.md`
- `aguinaldo.md`
- `vacaciones.md`
- `deducciones.md`
- `css.md`

## Contrato de datos para el motor

Cada archivo tematico define `base_legal`, `regla_operativa`, `formula`, `variables`, `supuestos`, `excepciones`, `vigencia_fuente`.

## Guia de uso para el asistente

- País cubierto: Panamá.
- Fuente primaria local: `codigo-de-trabajo-panama.md` (Código de Trabajo de Panamá).
- Documentos temáticos enriquecidos: `aguinaldo.md`, `css.md`, `deducciones.md`, `indemnizacion.md`, `vacaciones.md`.
- Antes de responder, el LLM debe recuperar el documento temático más cercano y contrastarlo con la fuente primaria local cuando la pregunta solicite base legal o detalle normativo.
- Para liquidaciones o estimaciones, debe preguntar primero por salario/base, fechas o antigüedad, tipo de terminación y pagos/días pendientes relevantes.
- Si un documento tiene estado `proposed` o contiene tasas sujetas a norma administrativa, la respuesta debe marcar la necesidad de validación legal/contable vigente.
- Ningún documento temático reemplaza asesoría profesional; el contenido es informativo y sirve como fuente operativa del MVP.
