-- ============================================================================
-- LaNutria · Módulo de Finanzas
-- Tablas para suscripciones (contrataciones recurrentes) y pagos (cobros).
-- Mismo patrón que el resto: id + JSONB `data`. Acceso SOLO autenticado.
-- Ejecutar en Supabase → SQL Editor.
-- ============================================================================

create table if not exists public.suscripciones (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.pagos (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Seguridad: solo el personal autenticado (el panel) accede.
alter table public.suscripciones enable row level security;
alter table public.pagos         enable row level security;

do $$
declare t text;
begin
  foreach t in array array['suscripciones','pagos'] loop
    execute format('drop policy if exists "solo_auth" on public.%I;', t);
    execute format('create policy "solo_auth" on public.%I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;
