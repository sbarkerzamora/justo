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

- `css_laboral = base_css * 0.0975`
- tope: sum(deducciones) <= salario * 0.50

## vigencia_fuente

- Codigo de Trabajo Art. 161 + Ley Organica CSS.
