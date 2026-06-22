-- ============================================================================
-- LaNutria · Esquema de base de datos (Supabase / PostgreSQL)
-- ----------------------------------------------------------------------------
-- Cópialo y ejecútalo en tu proyecto Supabase:
--   Dashboard → SQL Editor → New query → pega esto → Run.
--
-- Modelo:
--   • patients      : columnas para listar/filtrar + JSONB `data` con el
--                     expediente clínico (valoración, plan, dieta, medidas,
--                     seguimientos, notas privadas…).
--   • appointments  : citas de la agenda           (id + JSONB data)
--   • content       : tablero de contenido          (id + JSONB data)
--   • services      : servicios/tarifas             (id + JSONB data)
--
-- ⚠️  SEGURIDAD — IMPORTANTE
-- Este esquema deja acceso COMPLETO con la clave pública (anon), porque
-- todavía NO hay sistema de login (lo activaremos más adelante). Eso significa
-- que cualquiera con la URL y la anon key podría leer y escribir.
-- ➜ Úsalo solo con DATOS FICTICIOS de demostración, NUNCA con datos reales de
--   pacientes, hasta que añadamos autenticación y políticas por usuario.
-- ============================================================================

-- ---- Pacientes -------------------------------------------------------------
create table if not exists public.patients (
  id            text primary key,
  first_name    text not null default '',
  last_name     text not null default '',
  birth_date    text,
  phone         text default '',
  email         text default '',
  status        text not null default 'pending',   -- active | pending | inactive
  professional  text default '',
  last_consult  text,
  next_review   text,
  deleted       boolean not null default false,    -- borrado lógico (soft delete)
  data          jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists patients_status_idx  on public.patients (status);
create index if not exists patients_deleted_idx on public.patients (deleted);

-- ---- Citas -----------------------------------------------------------------
create table if not exists public.appointments (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- ---- Contenido -------------------------------------------------------------
create table if not exists public.content (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- ---- Servicios -------------------------------------------------------------
create table if not exists public.services (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
-- ----------------------------------------------------------------------------
-- Activamos RLS (buena práctica) pero con políticas permisivas para el rol
-- anónimo, ya que aún no hay auth. Cuando añadamos login, sustituiremos estas
-- políticas por otras basadas en auth.uid() / professional.
-- ============================================================================
alter table public.patients     enable row level security;
alter table public.appointments enable row level security;
alter table public.content      enable row level security;
alter table public.services     enable row level security;

do $$
declare t text;
begin
  foreach t in array array['patients','appointments','content','services'] loop
    execute format('drop policy if exists "demo_all" on public.%I;', t);
    execute format(
      'create policy "demo_all" on public.%I for all to anon, authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;
