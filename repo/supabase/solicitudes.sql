-- Tabla de solicitudes del formulario público de la landing.
-- El formulario es ABIERTO (sin login): cualquiera puede ENVIAR (insert), pero
-- solo el personal autenticado puede LEER las solicitudes desde el panel.
-- Ejecutar en Supabase → SQL Editor.

create table if not exists public.solicitudes (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  nombre      text not null,
  email       text not null,
  telefono    text,
  objetivo    text,
  mensaje     text,
  estado      text not null default 'nuevo'   -- nuevo | contactado | descartado | convertido
);

-- Seguridad a nivel de fila
alter table public.solicitudes enable row level security;

-- 1) Cualquiera (rol anónimo) puede INSERTAR una solicitud desde la web.
drop policy if exists "alta publica: insertar" on public.solicitudes;
create policy "alta publica: insertar"
  on public.solicitudes
  for insert
  to anon, authenticated
  with check (true);

-- 2) Solo usuarios autenticados (el panel) pueden LEER y ACTUALIZAR.
drop policy if exists "panel: leer" on public.solicitudes;
create policy "panel: leer"
  on public.solicitudes
  for select
  to authenticated
  using (true);

drop policy if exists "panel: actualizar" on public.solicitudes;
create policy "panel: actualizar"
  on public.solicitudes
  for update
  to authenticated
  using (true)
  with check (true);

-- (No se concede SELECT a 'anon': nadie público puede leer la lista de solicitudes.)
