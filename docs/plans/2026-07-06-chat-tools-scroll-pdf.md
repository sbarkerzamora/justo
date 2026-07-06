# Plan: chat, herramientas sin scroll y PDFs verticales

Fecha: 2026-07-06

Alcance: chat principal, AppShell, herramientas guiadas, sidebar y PDFs generados por las herramientas.

1. Hallazgos iniciales

1.1. La captura `Screenshot From 2026-07-06 11-32-20.png` muestra scroll doble en el chat. En codigo, el problema probable esta entre `apps/web/components/app-shell.tsx` y `apps/web/components/chat/llm-home-view.tsx`: `AppShell` permite scroll en el area principal (`overflow-y-auto` en el wrapper y en `main`), mientras `LlmHomeView` y `ChatContainerRoot` tambien administran overflow.

1.2. La captura `Screenshot From 2026-07-06 11-35-49.png` muestra scrollbar en una herramienta aunque el paso inicial cabe visualmente. En `SettlementTool`, varios paneles usan combinaciones de `h-full`, `overflow-y-auto`, `sticky bottom-0` y contenedores centrados. Eso fuerza overflow artificial en desktop y mobile.

1.3. La captura `Screenshot From 2026-07-06 11-38-02.png` muestra una pregunta de pensiones con copy insuficiente: solo dice `ONP 13%` y `AFP 11.2%`. El corpus `content/legal/pe/onp-afp.md` y el motor usan ONP 13% y AFP como `10% + prima 1.37%`, con tope para la prima. Tambien hay una inconsistencia visible en el progreso (`Paso 10 de 8`), porque `pensionSystem` no esta contemplado correctamente en el total de pasos.

1.4. La captura `Screenshot From 2026-07-06 11-40-26.png` muestra un PDF demasiado horizontal: tablas de 4 columnas, texto legal y formulas comprimidas, totales alineados muy a la derecha y firmas en fila. El archivo principal observado es `packages/pdf/src/settlement-pdf.ts`, con soporte comun en `packages/pdf/src/pdf-helpers.ts`. Existen builders adicionales para otras herramientas en `packages/pdf/src/*-pdf.ts`.

1.5. El CTA de sidebar `Justo para RRHH` esta en `apps/web/components/app-shell.tsx`, dentro de `renderSidebarContent`, usando `homeCopy[locale].hrCtaTitle` y `hrCtaBadge`. El banner superior de `Proximamente Justo para ...` es otro elemento distinto y no debe tocarse salvo que se pida.

2. Mostrar 4 herramientas aleatorias junto a `Nuevo chat`

2.1. Actualizar `apps/web/components/chat/chat-input-panel.tsx` para que la variante `compact` renderice una fila de acciones antes del input: `Nuevo chat` y 4 herramientas aleatorias visibles como pills.

2.2. Mantener el menu de herramientas existente como opcion secundaria solo si quedan herramientas fuera de las 4 visibles. Si el espacio no alcanza en mobile, permitir wrap a dos lineas, no scroll horizontal.

2.3. Elegir las 4 herramientas con un estado inicial del cliente para que la seleccion quede estable durante la sesion visible y no cambie en cada render. Si se quiere que cambien al presionar `Nuevo chat`, regenerar la seleccion dentro del handler de nuevo chat.

2.4. Reutilizar `chatActions` de `apps/web/components/chat/llm-home-view.tsx` y filtrar acciones con `mode`, dejando `Nuevo chat` separado. Evitar duplicar definiciones de herramientas.

2.5. Criterio de aceptacion: en desktop se ve `Nuevo chat` y 4 accesos directos al lado o en la misma fila; en mobile se ve sin overflow ni scroll horizontal; cada pill cambia al modo correcto.

3. Eliminar scroll doble del chat y simplificar anidamiento

3.1. Definir un solo responsable de scroll para el chat con mensajes: `ChatContainerRoot`. El `AppShell` debe fijar la altura del viewport y ocultar overflow en los contenedores padre.

3.2. Cambiar en `apps/web/components/app-shell.tsx` el wrapper principal y el `main` para que no creen scroll independiente. El objetivo es `flex h-svh` o equivalente en el root, `min-h-0`, `overflow-hidden` en padres y scroll solo dentro del panel que lo necesita.

3.3. Cambiar la raiz de `LlmHomeView` de `main` a `section` o `div`, porque actualmente queda un `main` dentro de otro `main`. Esto reduce anidamiento semantico y facilita controlar overflow.

3.4. En `apps/web/components/chat/llm-home-view.tsx`, remover `overflow-y-auto` de la raiz para estados que no deben scrollear. Para chat vacio, centrar el contenido sin contenedor scroll adicional. Para chat con mensajes, mantener padding inferior suficiente para el input absoluto.

3.5. Mantener el input inferior como overlay controlado, pero asegurar que no aumente la altura del documento. El padding inferior del `ChatContainerRoot` debe ser el unico espacio reservado para que el ultimo mensaje no quede tapado.

3.6. Criterio de aceptacion: en desktop y mobile el chat muestra una sola barra de scroll cuando hay mensajes largos; en conversaciones cortas no aparece scrollbar; el input queda fijo visualmente y no tapa el ultimo mensaje.

4. Eliminar CTA `Justo para RRHH` del sidebar

4.1. Remover de `apps/web/components/app-shell.tsx` el bloque expandido del sidebar que renderiza `homeCopy[locale as Locale].hrCtaTitle` y `hrCtaBadge`.

4.2. Remover imports o tipos que queden sin uso por esa eliminacion, especialmente `homeCopy` y `type Locale` si ya no se usan en el archivo.

4.3. No eliminar el banner superior de `Proximamente Justo para ...` en desktop/mobile en esta tarea, porque el pedido especifica sidebar.

4.4. Criterio de aceptacion: el sidebar expandido y colapsado no muestra CTA de RRHH; no quedan imports sin uso.

5. Quitar scroll innecesario en herramientas

5.1. Auditar todas las herramientas en `apps/web/components/tools/*/index.tsx`, empezando por `settlement`, porque ahi se ve el problema. Buscar `overflow-y-auto`, `h-full`, `sticky bottom-0` y wrappers con `justify-center` que suman altura extra.

5.2. Crear o consolidar un layout comun de herramienta si reduce anidamiento: header compacto, progreso, contenido central y footer de acciones. El footer debe vivir dentro del flujo flex con `mt-auto` o area fija del layout, no como `sticky` que agrega overflow.

5.3. En `StepNavigation`, reemplazar `sticky bottom-0` por un footer normal dentro del viewport de herramienta, con `pb-[env(safe-area-inset-bottom)]` para mobile. El boton principal debe seguir siendo facil de tocar sin crear scroll.

5.4. En `SettlementTool`, remover scroll interno en pasos cortos como `frequency`, `pensionSystem`, `confirm` y preguntas simples. Los resultados largos deben usar detalles colapsados por defecto para caber sin scrollbar en el estado inicial.

5.5. En mobile, permitir que los controles pasen a una columna o dos filas antes de permitir overflow. No usar scroll horizontal en pills, botones ni formularios.

5.6. Criterio de aceptacion: los pasos de captura y seleccion no muestran ninguna barra de scroll en desktop ni mobile; los footers no desplazan el contenido; no aparece scroll del documento al abrir una herramienta desde `?tool=`.

6. Mejorar copy del sistema de pensiones

6.1. Actualizar el paso `pensionSystem` en `apps/web/components/tools/settlement/index.tsx` para explicar en lenguaje simple que ONP y AFP son sistemas de pensiones del trabajador, no beneficios adicionales ni aportes del empleador.

6.2. Corregir la tasa visual de AFP para alinearla al corpus y motor: mostrar `10% + prima 1.37%` o `aprox. 11.37%`, no `11.2%`. Incluir nota breve de que la prima puede tener tope y que Justo usa el supuesto documentado del corpus.

6.3. Agregar ayuda practica: `Elige ONP si tu boleta dice ONP o Sistema Nacional de Pensiones. Elige AFP si tu boleta menciona una AFP como Integra, Prima, Habitat o Profuturo. Si no estas seguro, revisa tu boleta o consulta a planilla antes de calcular.`

6.4. Validar que el paso solo aparezca en paises donde aplica. Si aparece para Nicaragua por algun estado de URL o seleccion, corregir el flujo para no mezclar reglas de paises.

6.5. Corregir el progreso para que el total de pasos sea dinamico. Para Peru debe contar `pensionSystem`; para paises sin pensionSystem no debe inflar el indice. Esto elimina estados como `Paso 10 de 8`.

6.6. Criterio de aceptacion: el usuario entiende que opcion elegir, las tasas coinciden con corpus y motor, y el progreso siempre muestra un indice valido.

7. Rediseñar PDFs generados con estructura mas vertical

7.1. Crear helpers comunes en `packages/pdf/src/pdf-helpers.ts` para bloques verticales: `drawSummaryCard`, `drawBreakdownItem`, `drawStackedKeyValues`, `drawPageBreakIfNeeded` y firmas apiladas o de ancho completo.

7.2. Cambiar `packages/pdf/src/settlement-pdf.ts` para reemplazar la tabla de 4 columnas por bloques verticales por concepto. Cada bloque debe mostrar: concepto, monto, formula envuelta, base legal envuelta y tipo de linea. Esto evita texto comprimido.

7.3. Aplicar el mismo patron a todos los builders de herramientas: `bonus-pdf.ts`, `salary-net-pdf.ts`, `vacations-pdf.ts`, `termination-pdf.ts`, `preaviso-pdf.ts` y `contract-pdf.ts` si genera documentos para descarga.

7.4. Reestructurar el resumen del resultado para que el neto sea protagonista arriba y los totales de ingresos/deducciones aparezcan como filas verticales debajo, no como una banda horizontal.

7.5. Hacer las firmas mas verticales y legibles: cajas de ancho completo apiladas o con mas altura, etiquetas claras para trabajador y empleador, y linea de firma amplia.

7.6. Mantener requisitos legales del proyecto: timestamp generado, version del corpus, resumen, ingresos, deducciones, total neto, disclaimer y lineas de firma.

7.7. Criterio de aceptacion: el PDF A4 se lee de arriba hacia abajo sin columnas comprimidas; formulas y bases legales se envuelven; no se corta texto; si el detalle no cabe, el documento agrega pagina en vez de reducirlo agresivamente.

8. Verificacion tecnica y visual

8.1. Ejecutar `pnpm lint` y `pnpm typecheck` despues de los cambios de UI.

8.2. Ejecutar `bun test apps packages` o, como minimo, pruebas de `packages/pdf` y `packages/core` si solo se toca PDF/copy conectado a calculos.

8.3. Probar manualmente desktop y mobile para rutas `/{locale}/{country}`, `/{locale}/{country}?tool=settlement`, y al menos una herramienta adicional.

8.4. Validar visualmente con capturas nuevas: chat con mensajes largos, chat vacio, herramienta en paso inicial, herramienta en pensiones de Peru y PDF generado.

8.5. Revisar accesibilidad basica: foco visible en pills de herramientas, botones de navegacion, dropdown de herramientas y botones de PDF; labels claros para lectores de pantalla.

9. Orden recomendado de implementacion

9.1. Primero corregir overflow en `AppShell`, `LlmHomeView` y `StepNavigation`, porque afecta chat y herramientas.

9.2. Segundo agregar las 4 herramientas aleatorias junto a `Nuevo chat`, ya sobre el layout sin doble scroll.

9.3. Tercero eliminar el CTA de RRHH del sidebar.

9.4. Cuarto corregir copy y progreso del paso de pensiones.

9.5. Quinto rediseñar PDFs con helpers comunes y aplicar a todos los builders.

9.6. Sexto ejecutar pruebas, typecheck y revision visual desktop/mobile.
