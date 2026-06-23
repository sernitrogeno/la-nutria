-- ============================================================================
-- LaNutria · Políticas RLS con autenticación
-- ----------------------------------------------------------------------------
-- Ejecútalo en Supabase (SQL Editor → New query → pegar → Run) UNA VEZ que ya
-- tengas el login funcionando y al menos un usuario creado.
--
-- Qué hace: sustituye la política de demo (acceso con la clave pública / anon)
-- por una que SOLO permite leer y escribir a usuarios autenticados. A partir de
-- aquí, tener la URL y la anon key ya NO basta para ver los datos: hay que
-- iniciar sesión con un usuario que tú hayas dado de alta.
--
-- Dar de alta personas:  Authentication → Users → "Add user"
--                        (marca "Auto Confirm User" para que entren sin email).
-- No hay registro público: solo existen los usuarios que crees a mano.
-- ============================================================================

do $$
declare t text;
begin
  foreach t in array array['patients','appointments','content','services'] loop
    -- Quitamos la política permisiva de demostración (acceso anónimo).
    execute format('drop policy if exists "demo_all" on public.%I;', t);
    -- Y la posible versión previa de esta, para que el script sea reejecutable.
    execute format('drop policy if exists "auth_all" on public.%I;', t);
    -- Acceso completo SOLO para usuarios autenticados.
    execute format(
      'create policy "auth_all" on public.%I for all to authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;
