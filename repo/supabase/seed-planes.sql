-- ============================================================================
-- LaNutria · Catálogo de planes (alineado con la web de captación)
-- Inserta/actualiza los planes que se muestran en el panel (Servicios) y que
-- alimentan el módulo de Finanzas. La web pública usa src/public/site.config.js
-- como fuente; estos registros son para el panel interno.
-- `on conflict do update`: puedes reejecutarlo para actualizar precios.
-- Ejecutar en Supabase → SQL Editor.
-- ============================================================================

insert into public.services (id, data) values
('valoracion', '{"id":"valoracion","name":"Consulta de valoración","price":"65€","period":null,"description":"Primera sesión (60-75 min) para conocer tu situación, objetivos, horarios y dificultades. Incluye estrategia personalizada.","features":["Cuestionario previo","Historia clínica y dietética","Objetivos realistas","3 primeras acciones","Documentación en 48-72 h"],"highlighted":false}'::jsonb),
('seguimiento', '{"id":"seguimiento","name":"Seguimiento individual","price":"49€","period":null,"description":"Revisión de evolución y ajustes (35-40 min). Para quien ya hizo una consulta inicial.","features":["Revisión de adherencia","Ajustes del plan","Nuevos objetivos","Resumen escrito","Dudas 48 h"],"highlighted":false}'::jsonb),
('impulso', '{"id":"impulso","name":"Plan Impulso","price":"159€","period":"/8 sem","description":"Estructura profesional sin seguimiento intensivo. 8 semanas.","features":["Consulta inicial + 2 seguimientos","Plan personalizado + 2 ajustes","Guía de sustituciones y recetario","Lista de la compra","Soporte limitado 24-48 h"],"highlighted":false}'::jsonb),
('cambio-sostenible', '{"id":"cambio-sostenible","name":"Cambio Sostenible","price":"299€","period":"/12 sem","description":"Programa principal. 12 semanas. Pago fraccionado: 3 x 109 €.","features":["Consulta inicial + 5 seguimientos quincenales","Evaluación semanal","Ajustes quincenales","Estrategias restaurantes/viajes/finde","Soporte WhatsApp L-V","Plan de mantenimiento final"],"highlighted":true}'::jsonb),
('intensivo', '{"id":"intensivo","name":"Acompañamiento Intensivo","price":"429€","period":"/12 sem","description":"Todo Cambio Sostenible + más contacto y supervisión. Pago fraccionado: 3 x 155 €.","features":["6 minisesiones extra","Revisión semanal","Prioridad y ajustes frecuentes","Análisis de diarios/fotos","Informe final","Consulta extra post-programa"],"highlighted":false}'::jsonb),
('mantenimiento', '{"id":"mantenimiento","name":"Plan Mantenimiento","price":"69€","period":"/mes","description":"Para quien terminó un programa. Modalidad Plus 99 €/mes con 2 consultas.","features":["1 consulta mensual (40 min)","Formulario semanal","1 ajuste mensual","Soporte L-V","Nuevos materiales y recetas"],"highlighted":false}'::jsonb)
on conflict (id) do update set data = excluded.data, updated_at = now();
