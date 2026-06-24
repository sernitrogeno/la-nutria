-- ============================================================================
-- LaNutria · Catálogo de planes del PANEL (Servicios / Finanzas)
-- Alineado con la web (src/public/site.config.js). El `price` es la TARIFA
-- FUNDADORA actual (lo que cobras durante el lanzamiento); la estándar va en la
-- descripción. La web es la fuente de cara al público; esto es para el panel.
-- `on conflict do update`: reejecutable para actualizar precios.
-- Ejecutar en Supabase → SQL Editor.
-- ============================================================================

insert into public.services (id, data) values
('valoracion', '{"id":"valoracion","name":"Valoración nutricional","price":"79€","period":null,"description":"Consulta online de 60-75 min: hábitos, horarios, objetivos y recomendaciones iniciales.","features":["Cuestionario previo","Consulta 60-75 min","Revisión de hábitos y horarios","Definición de objetivos","Recomendaciones iniciales"],"highlighted":false}'::jsonb),
('seguimiento', '{"id":"seguimiento","name":"Seguimiento individual","price":"59€","period":null,"description":"Revisión y ajustes (35-40 min). Para quien ya hizo valoración o programa.","features":["Revisión de evolución","Ajustes del plan","Nuevos objetivos","Resumen escrito"],"highlighted":false}'::jsonb),
('impulso', '{"id":"impulso","name":"Plan Impulso","price":"199€","period":"/programa","description":"6-8 semanas. Tarifa estándar posterior: 249€.","features":["Valoración + 2 seguimientos","Estrategia personalizada + 1 ajuste","Guía de sustituciones","Formulario quincenal","Dudas por email 24-48 h"],"highlighted":false}'::jsonb),
('cambio-sostenible', '{"id":"cambio-sostenible","name":"Cambio Sostenible","price":"299€","period":"/programa","description":"12 semanas. Tarifa estándar posterior: 399€. Fraccionado: 3 x 105€ (total 315€).","features":["Valoración + 4 seguimientos","Formulario quincenal","Hasta 2 ajustes","Estrategias restaurantes/viajes/finde","Soporte L-V 24-48 h","Plan de continuidad"],"highlighted":true}'::jsonb),
('intensivo', '{"id":"intensivo","name":"Acompañamiento Intensivo","price":"449€","period":"/programa","description":"12 semanas. Tarifa estándar posterior: 599€. Fraccionado: 3 x 159€ (total 477€).","features":["Valoración + 5 seguimientos","Formulario semanal","Hasta 3 ajustes","2 minisesiones de 15 min","Soporte prioritario L-V 24 h","Consulta de continuidad"],"highlighted":false}'::jsonb),
('mantenimiento', '{"id":"mantenimiento","name":"Mantenimiento","price":"99€","period":"/mes","description":"Solo tras completar un programa. Plus 149€/mes con 2 consultas.","features":["1 consulta mensual","Formulario mensual","1 ajuste mensual","Acceso a nuevos recursos"],"highlighted":false}'::jsonb)
on conflict (id) do update set data = excluded.data, updated_at = now();
