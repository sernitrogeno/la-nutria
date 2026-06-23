# Plan: Web pública + formulario de alta de clientes

Objetivo: una web pública (sin login) con un formulario donde un cliente nuevo
rellena sus datos y estos se guardan directamente en la base de datos (Supabase),
para que aparezcan luego en el panel privado de LaNutria.

## Cómo encaja con lo que ya hay
- La app actual (`repo/app`) es la parte **privada** (requiere login).
- La web pública puede ser:
  - **Opción A (recomendada):** una ruta/página pública dentro de la misma app
    (ej. `/alta` o `/contacto`) que NO está detrás del login.
  - **Opción B:** un proyecto/landing aparte. Más separación, más mantenimiento.

## Cómo se guardan los datos sin login (Supabase)
1. Crear una tabla para las solicitudes, p. ej. `lead_solicitudes`:
   - `id`, `created_at`, `nombre`, `apellidos`, `email`, `telefono`,
     `objetivo`, `mensaje`, `estado` (p.ej. 'nuevo').
2. **Row Level Security (RLS):** activar RLS y crear una política que permita
   **solo INSERT** al rol anónimo (`anon`), y **nada de lectura** pública:
   ```sql
   alter table lead_solicitudes enable row level security;
   create policy "alta publica: insertar"
     on lead_solicitudes for insert
     to anon
     with check (true);
   -- (sin policy de SELECT para anon => nadie público puede leer los datos)
   ```
   Así cualquiera puede ENVIAR el formulario, pero nadie puede LEER la lista
   salvo desde el panel privado (usuario autenticado o service role).
3. El formulario llama a `supabase.from('lead_solicitudes').insert({...})`.
4. En el panel privado, una pantalla "Solicitudes" lee esa tabla (usuario logado)
   para revisarlas y convertirlas en pacientes.

## Buenas prácticas / seguridad
- Validar campos en el cliente y marcar el email/teléfono.
- Añadir protección anti-spam (honeypot o captcha) antes de exponerlo del todo.
- No exponer datos sensibles en la tabla pública; solo lo necesario del alta.
- La `anon key` es pública por diseño; la seguridad real la da RLS. Revisar que
  ninguna tabla privada permita lectura a `anon`.

## Siguientes pasos cuando retomemos
1. Definir los campos exactos del formulario con el cliente.
2. Crear la migración SQL de `lead_solicitudes` + políticas (en `repo/supabase/`).
3. Crear la página pública y el componente de formulario.
4. Pantalla "Solicitudes" en el panel privado.
