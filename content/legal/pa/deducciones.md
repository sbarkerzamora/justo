---
country: pa
topic: deducciones
version: pa-v0.1.0
status: proposed
source: "Codigo de Trabajo Art. 161 + Ley Organica CSS"
last_reviewed: "2026-05-11"
---

# Deducciones

## base_legal

- Art. 161: Deducciones autorizadas, tope maximo 50% del salario.
- Ley Organica de la CSS.

## regla_operativa

- CSS: 9.75% sobre base imponible.
- Tope maximo de deducciones: 50% del salario en efectivo (excepto pension alimenticia).

## formula

- `css_laboral = base_css * tasa_css_laboral`

## variables

- `base_css`
- `tasa_css_laboral`

## supuestos

- `tasa_css_laboral = 0.0975` (9.75%, Ley Organica CSS, pendiente confirmacion legal final en produccion).

## excepciones

- Tope maximo de deducciones: 50% del salario en efectivo (Art. 161), excepto pension alimenticia.
- Decimotercer mes no integra base de CSS segun regimen vigente.

## vigencia_fuente

- Codigo de Trabajo Art. 161 + Ley Organica CSS.
