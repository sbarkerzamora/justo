# Plan: navegación clara en herramientas guiadas

Fecha: 2026-07-06

Alcance: navegación, copy, progreso y accesibilidad de pasos en todas las herramientas guiadas: liquidación, salario neto, vacaciones, aguinaldo/bono, terminación, contrato y preaviso.

## 1. Contexto

Las herramientas guiadas ya comparten una estructura visual cercana, pero la navegación de pasos todavía mezcla lenguaje de chat con lenguaje de formulario. El usuario está capturando datos, revisando y calculando; por eso el botón principal debe decir qué ocurre en cada momento.

El estándar esperado es producto listo para PR: claro, consistente, accesible y sin totales de progreso incorrectos.

## 2. Problemas detectados

1. `send` se reutiliza como acción de formulario. `Enviar` funciona para chat, pero no para avanzar en una herramienta guiada.
2. `backToPrevious` incluye flecha textual aunque el botón ya usa icono de flecha.
3. Algunas herramientas dependen del total default de `progressStep` o usan divisores hardcodeados.
4. Mobile usa abreviaturas poco claras como `P1` y `OK`.
5. Las barras de progreso no exponen estado suficiente para lectores de pantalla.
6. `contract` usa footers propios y debe alinearse con el mismo vocabulario de navegación.

## 3. Principios de solución

1. Separar copy de chat y copy de formularios.
2. Usar `Continuar` para pasos intermedios.
3. Usar `Confirmar y calcular` solo en resumen.
4. Usar `Anterior` sin flecha textual.
5. Calcular `Paso X de Y` con los pasos visibles reales de cada herramienta.
6. No mostrar abreviaturas que requieran aprendizaje.
7. Mantener cambios mínimos y no introducir componentes nuevos salvo que sean necesarios.

## 4. Cambios a implementar

### 4.1 Copy compartido

Archivo: `apps/web/lib/home-copy.tsx`

Agregar:

- `continueStep`: `Continuar` / `Continue`
- `progressResult`: `Resultado` / `Result`

Cambiar:

- `backToPrevious`: `Anterior` / `Previous`

Mantener:

- `send`: reservado para chat y mensajes.

### 4.2 StepNavigation

Archivo: `apps/web/components/tools/step-navigation.tsx`

- Mantener el API actual.
- Marcar el spacer del botón atrás con `aria-hidden="true"`.
- Usar el texto recibido sin flecha duplicada.

### 4.3 Progreso accesible

En cada herramienta, la barra debe incluir:

- `role="progressbar"`
- `aria-valuemin={1}`
- `aria-valuemax={totalSteps}`
- `aria-valuenow={currentStep}`
- `aria-valuetext={copy.progressStep(currentStep, totalSteps)}`

### 4.4 Herramientas

- `settlement`: mantener `flowSteps.length`, cambiar labels a `continueStep`, agregar ARIA.
- `salary-net`: usar pasos visibles por país para incluir pensión solo cuando aplica, cambiar labels, agregar ARIA.
- `vacations`: reemplazar divisor hardcodeado por `vacationSteps.length`, eliminar `P1`/`OK`, agregar ARIA.
- `bonus`: reemplazar total hardcodeado por `bonusSteps.length`, eliminar `P1`/`OK`, agregar ARIA.
- `termination`: calcular pasos visibles cuando `writtenNotice` se salta, cambiar labels, agregar ARIA.
- `contract`: alinear labels de botones propios con `Anterior`/`Continuar` y progreso accesible.
- `preaviso`: corregir índice base cero, pasar total real y usar `continueStep`.

## 5. Criterios de aceptación

1. Ninguna herramienta muestra `Paso X de 8` por accidente.
2. Ninguna herramienta usa `Enviar` para avanzar pasos de formulario.
3. No aparecen abreviaturas `P1` ni `OK` en progreso mobile.
4. El botón atrás no duplica flecha textual.
5. Perú cuenta pensión solo donde aplica.
6. Las barras de progreso son accesibles por lector de pantalla.
7. `pnpm typecheck`, `pnpm lint` y `bun test apps packages` pasan.

## 6. Orden de ejecución

1. Actualizar copy compartido.
2. Pulir `StepNavigation`.
3. Corregir labels de navegación por herramienta.
4. Corregir cálculo de progreso por herramienta.
5. Agregar ARIA a barras de progreso.
6. Validar técnicamente.
