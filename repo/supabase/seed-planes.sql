-- ============================================================================
-- LaNutria · Catálogo inicial de planes/servicios (alineado con el mercado)
-- Inserta los 4 planes de arranque. Editables luego desde el panel (Servicios).
-- `on conflict do nothing`: puedes ejecutarlo sin miedo a duplicar.
-- Ejecutar en Supabase → SQL Editor.
-- ============================================================================

insert into public.services (id, data) values
('plan-consulta', '{
  "id":"plan-consulta","name":"Primera consulta","price":"49€","period":null,
  "description":"Valoración inicial completa y primeras pautas personalizadas.",
  "features":["Valoración inicial completa","Primeras pautas personalizadas","Sin compromiso"],
  "highlighted":false
}'::jsonb),
('plan-seguimiento', '{
  "id":"plan-seguimiento","name":"Seguimiento suelto","price":"35€","period":null,
  "description":"Una revisión de progreso y ajuste del plan.",
  "features":["Revisión de progreso","Ajuste del plan","Resolución de dudas"],
  "highlighted":false
}'::jsonb),
('plan-mensual', '{
  "id":"plan-mensual","name":"Plan mensual En forma","price":"55€","period":"/mes",
  "description":"Acompañamiento continuo con seguimiento y ajustes cada semana.",
  "features":["Valoración inicial","2 seguimientos al mes","Plan adaptado cada semana","Chat de apoyo entre sesiones"],
  "highlighted":true
}'::jsonb),
('plan-trimestral', '{
  "id":"plan-trimestral","name":"Plan trimestral Transformación","price":"145€","period":"/trim.",
  "description":"El acompañamiento más completo para resultados duraderos.",
  "features":["Todo lo del plan mensual","Revisión de objetivos mensual","Mejor precio por mes"],
  "highlighted":false
}'::jsonb)
on conflict (id) do nothing;
