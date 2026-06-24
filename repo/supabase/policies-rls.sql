-- ============================================================================
-- LaNutria · BLINDAJE de seguridad (RLS) — EJECUTAR ANTES DE METER DATOS REALES
-- ----------------------------------------------------------------------------
-- El schema.sql original dejaba las tablas ABIERTAS al rol anónimo (anon),
-- pensado solo para demo. Ahora que hay login y datos reales de pacientes,
-- esto cierra el acceso: SOLO usuarios autenticados (el panel) pueden leer y
-- escribir. La web pública NO lee estas tablas (la landing usa datos propios y
-- el formulario escribe en `solicitudes`, que tiene su propia política).
-- Ejecutar en Supabase → SQL Editor.
-- ============================================================================

do $$
declare t text;
begin
  foreach t in array array['patients','appointments','content','services'] loop
    execute format('alter table public.%I enable row level security;', t);
    -- quitamos la política demo abierta a 'anon'
    execute format('drop policy if exists "demo_all" on public.%I;', t);
    execute format('drop policy if exists "solo_auth" on public.%I;', t);
    -- solo autenticados
    execute format('create policy "solo_auth" on public.%I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- Nota: si más adelante quieres que la web pública muestre los planes en vivo,
-- se puede permitir SÓLO lectura anónima de `services` (no es dato sensible):
--   create policy "planes_publicos" on public.services for select to anon using (true);
