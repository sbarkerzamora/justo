# Roadmap

## Now

- [x] App shell con sidebar global.
- [x] Herramientas invocables desde chat (query param `?tool=settlement|vacations`).
- [x] Flujo vacaciones Nicaragua con endpoint determinístico.
- [x] Ruta `/guia-laboral` (antes `/anon-stats`) con explicación "cómo funciona" y estadísticas anónimas.
- [x] Página principal por país solo muestra hero de chat.

## Next

- [ ] Mejorar UX de flujos guiados (tool flow framework común).
- [ ] Agregar página de documentación para crear herramientas en `@justo/tools`.
- [ ] Tercera herramienta OSS (salario neto, aguinaldo/décimo o horas extra).
- [ ] Más países para vacaciones (validar corpus legal por jurisdicción).
- [ ] `packages/ui` si hay reutilización real de componentes entre `apps/web` y futuro `justo-pro`.

## Later

- [ ] `justo-pro` privado — repo separado con Convex, organizaciones, empleados, casos.
- [ ] Asistente interno RRHH (no OSS).
- [ ] Paquete de caso para revisión profesional (no OSS).
- [ ] Billing, auditoría, integraciones empresariales.
- [ ] API comercial (futura, no implementar todavía).

---

| Área | Estado | Notas |
|---|---|---|
| OSS Core (`@justo/core`) | Done | Cálculos determinísticos por jurisdicción. |
| Tools Registry (`@justo/tools`) | Done | Registry de herramientas OSS con tipos. |
| PDF OSS (`@justo/pdf`) | Done | PDF básico imprimible. |
| App Web (`@justo/web`) | Done | Next.js 16, Tailwind v4, shadcn, chat AI. |
| Sidebar global | Done | Aceternity sidebar, no se muestra en `/docs`. |
| `/guia-laboral` (antes `/anon-stats`) | Done | Cómo funciona + estadísticas anónimas. |
| Vacations NI | Done | Flujo guiado + endpoint determinístico + tool backend. |
| Settlement NI+10 | Done | 11 países con liquidación laboral determinística. |
| `justo-pro` repo | Later | No crear todavía. |
| Billing / Pro API | Later | Futuro. |
