# Corpus Legal Nicaragua (MVP)

Version: `ni-v0.2.0`

Este directorio contiene la base legal y operativa del MVP de liquidacion laboral en Nicaragua.

## Set normativo propuesto

1. **Codigo del Trabajo, Ley No. 185** (La Gaceta No. 205, 30-Oct-1996) con reformas.
2. **Ley de Seguridad Social y normativa administrativa INSS vigente** para cotizacion laboral aplicable.
3. **Ley de Concertacion Tributaria y disposiciones vigentes de rentas del trabajo (IR)**.

## Archivos

- `Ley185Nic.md` (fuente espejo de texto legal)
- `indemnizacion.md`
- `aguinaldo.md`
- `vacaciones.md`
- `salario-proporcional.md`
- `deducciones.md`
- `inss.md`
- `ir-rentas-trabajo.md`

## Contrato de datos para el motor

Cada archivo tematico define:

- `base_legal`
- `regla_operativa`
- `formula`
- `variables`
- `supuestos`
- `excepciones`
- `vigencia_fuente`

## Regla operativa

El asistente y el motor deben tratar estos archivos como fuente de verdad. Si existe duda o conflicto normativo, la respuesta debe marcar incertidumbre y recomendar revision profesional.
