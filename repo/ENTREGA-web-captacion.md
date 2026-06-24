# Entrega · Web de captación de nutrición online (Fase 1)

## 1. Qué se ha implementado
Web pública rehecha como página de venta, manteniendo tu estética verde y sin
dependencias nuevas. Todo el contenido y los precios están **centralizados** en
un único archivo de configuración.

Secciones de la home: promoción de lanzamiento (configurable) · hero con nuevo
mensaje · problema del cliente · metodología (5 pasos) · beneficios · programa
destacado (**Cambio Sostenible**) · comparador de planes · servicios sueltos y
mantenimiento · llamada de orientación (15 min) · sobre mí (con placeholders) ·
testimonios (ocultos hasta tener reales) · FAQ (acordeón accesible) · formulario
de valoración ampliado · condiciones del servicio · pie.

## 2. Archivos principales
- `app/src/public/site.config.js` — **fuente única**: negocio, planes, precios,
  promoción, FAQ, textos, SEO, placeholders. **Aquí se edita todo.**
- `app/src/public/Landing.jsx` — la web (lee la config; sin precios a mano).
- `app/src/styles/landing.css` — estilos de las secciones nuevas.
- `app/index.html` — title + meta description + Open Graph.
- `supabase/seed-planes.sql` — catálogo de planes para el panel/Finanzas.

## 3. Cómo cambiar precios y contenido
Edita **`app/src/public/site.config.js`**:
- Precios/planes → `nutritionPlans` (campo `price`, `launchPrice`, `includes`…).
- Activar/desactivar oferta → `launchPromotion.enabled = true/false`.
- FAQ → `faqs`. Método → `methodology`. Problemas → `problems`.
- Datos del profesional y contacto → `businessConfig`.
Cambiar un precio en un solo sitio se refleja en toda la web.

## 4. Datos REALES que debes proporcionar (placeholders pendientes)
En `businessConfig` (ahora vacíos / con [corchetes]):
- [ ] `contactEmail` — email de contacto
- [ ] `whatsappNumber` — WhatsApp (formato 34XXXXXXXXX); vacío = se oculta el botón
- [ ] `bookingUrl` — enlace de reserva (Calendly/Cal.com); vacío = los CTA llevan al formulario
- [ ] `titulacion` — titulación oficial
- [ ] `colegiado` — nº de colegiado/a
- [ ] `formacion` — formación/certificaciones reales
- [ ] `social` — Instagram/TikTok
- [ ] Confirmar **precios** (son los de tu prompt; cámbialos si quieres)
- [ ] Foto `maria.jpg` en `app/public/` (ya la tenías)
- [ ] Testimonios reales (con consentimiento) → `testimonials` + `showTestimonials = true`

No se ha inventado ninguno de estos datos.

## 5. Cómo desplegar
1. **Supabase → SQL Editor:** ejecuta `supabase/seed-planes.sql` (actualiza los planes del panel).
2. **Sube el código** (rama `master`, dentro de `repo/app/`):
   - `app/index.html`
   - `app/src/public/site.config.js`
   - `app/src/public/Landing.jsx`
   - `app/src/styles/landing.css`
   - y `supabase/seed-planes.sql` en `repo/supabase/`.
3. Espera el deploy y recarga con Ctrl+Shift+R.

## 6. Pruebas realizadas
- `vite build` ✅ (compila sin errores).
- `eslint` sobre los archivos nuevos ✅ (sin avisos).
- No hay claves privadas en el frontend; el formulario escribe en `solicitudes`
  (que ya tiene RLS: cualquiera inserta, solo tú lees).
- Datos sensibles NO van a localStorage ni a analítica.
> Pruebas manuales en navegador (visual/responsive) pendientes de que lo despliegues.

## 7. Fase 2 (pendiente, no incluido)
Listado para cuando quieras seguir:
- Rutas/páginas separadas (programa, sobre mí, legales) — hoy es one-page por secciones.
- Pasarela de pago (Stripe): productos por plan, pago único/fraccionado, webhooks, páginas éxito/cancelación.
- Reserva real (Calendly/Cal.com) — hoy preparado vía `bookingUrl`.
- SEO técnico: sitemap.xml, robots.txt, datos estructurados (Person/ProfessionalService/FAQPage/Offer).
- Analítica + eventos (`plan_selected`, `lead_form_submitted`…) + consentimiento de cookies.
- Páginas legales (privacidad, aviso legal, cookies) con textos revisados.
- Tests automatizados (render de planes, promo on/off, validación de formulario).
- Blog/recursos.
- Que la landing lea los planes desde la BBDD en vivo (hoy usa la config).

## 8. Notas / limitaciones
- La web usa `site.config.js` como fuente; el panel usa la tabla `services`.
  Mantenerlos en sintonía a mano por ahora (Fase 2 los unifica).
- Los textos de condiciones/legales son orientativos: **requieren revisión legal**.
- La promoción no muestra cuenta atrás ni nº de plazas falso (solo "plazas limitadas").
