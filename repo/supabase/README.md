# Backend de LaNutria (Supabase)

La app guarda los datos en **Supabase** (PostgreSQL gratuito en su capa free).
Si no configuras nada, funciona en local con `localStorage`, así que puedes
arrancarla sin backend y conectarlo cuando quieras.

## Puesta en marcha (una sola vez)

1. **Crea un proyecto en Supabase** → https://supabase.com (gratis).
2. **Crea las tablas**: en el panel de Supabase ve a **SQL Editor → New query**,
   pega el contenido de [`schema.sql`](./schema.sql) y pulsa **Run**.
3. **Carga los datos de demostración**: en **SQL Editor → New query**, pega el
   contenido de [`seed.sql`](./seed.sql) y pulsa **Run**. Deja los pacientes
   ficticios guardados en la BBDD; la app los leerá de ahí. Es idempotente
   (UPSERT): puedes volver a ejecutarlo sin duplicar datos.
4. **Copia tus credenciales**: **Project Settings → API**
   - `Project URL` → `VITE_SUPABASE_URL`
   - `Project API keys → anon public` → `VITE_SUPABASE_ANON_KEY`
5. En la carpeta `app/`, crea el archivo `.env.local` a partir de la plantilla:
   ```bash
   cp .env.example .env.local
   # edita .env.local y pega tus dos valores
   ```
6. Arranca la app:
   ```bash
   npm install
   npm run dev
   ```

Con `seed.sql` ya ejecutado, los pacientes ficticios viven en la BBDD y la app
los lee de ahí. A partir de ahí, todo lo que crees o edites (en la app o en el
editor de tablas de Supabase) se refleja en el otro lado. Si llegas a arrancar
con la base totalmente vacía, la app además **siembra sola** esos mismos datos
demo en el primer arranque.

> `seed.sql` se genera a partir de los datos de la app con
> `node app/scripts/gen-seed-sql.mjs`. Si cambias los datos demo en
> `src/store/seed.js`, regenéralo con ese comando.

## Cómo funciona

- `src/backend/supabase.js` — crea el cliente con las variables de entorno.
- `src/backend/mappers.js` — convierte entre objetos de la app y filas de la BBDD.
- `src/backend/index.js` — API de datos (cargar, sembrar, guardar, borrar).
- `src/store/StoreContext.jsx` — decide entre local y nube, y **sincroniza por
  diferencias** (en cada cambio solo sube la entidad afectada). `localStorage`
  queda como caché para arranque instantáneo / offline.

Las pantallas no saben nada de esto: siguen llamando a las mismas acciones
(`addPatient`, `updatePatient`, `saveAppointment`…).

## Acceso restringido (login)

La app exige iniciar sesión cuando hay backend configurado: solo entran las
personas que des de alta a mano. No hay registro público.

**Activarlo (una vez):**

1. **Crea los usuarios autorizados**: en Supabase, **Authentication → Users →
   "Add user"**. Pon su email y contraseña y marca **"Auto Confirm User"** para
   que puedan entrar sin verificar el correo. Repite por cada persona del equipo.
2. **Cierra el acceso anónimo**: en **SQL Editor → New query**, pega el contenido
   de [`policies-auth.sql`](./policies-auth.sql) y pulsa **Run**. Esto sustituye
   la política de demo por una que **solo permite leer/escribir a usuarios
   autenticados**: a partir de aquí, tener la URL + anon key ya no basta para ver
   los datos.

No hacen falta variables de entorno nuevas: el login usa la misma
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.

- `src/backend/auth.js` — funciones de login/logout sobre Supabase Auth.
- `src/auth/AuthContext.jsx` — estado de sesión + `AuthGate` (puerta de acceso).
- `src/auth/Login.jsx` — pantalla de inicio de sesión.

Para **dar de baja** a alguien: bórralo (o desactívalo) en Authentication → Users.
Para **cambiar una contraseña**: desde ese mismo panel.

## ⚠️ Pendiente

Con `policies-auth.sql` cualquier usuario autenticado ve **todos** los datos
(equipo con acceso compartido). Si en el futuro quieres que cada profesional vea
solo sus pacientes, habrá que añadir una columna de propietario y políticas RLS
basadas en `auth.uid()`. Mientras tanto, mantén el criterio de **datos
ficticios** hasta que hayáis validado el acceso real con vuestro equipo.
