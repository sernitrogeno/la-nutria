# Backend de LaNutria (Supabase)

La app guarda los datos en **Supabase** (PostgreSQL gratuito en su capa free).
Si no configuras nada, funciona en local con `localStorage`, así que puedes
arrancarla sin backend y conectarlo cuando quieras.

## Puesta en marcha (una sola vez)

1. **Crea un proyecto en Supabase** → https://supabase.com (gratis).
2. **Crea las tablas**: en el panel de Supabase ve a **SQL Editor → New query**,
   pega el contenido de [`schema.sql`](./schema.sql) y pulsa **Run**.
3. **Copia tus credenciales**: **Project Settings → API**
   - `Project URL` → `VITE_SUPABASE_URL`
   - `Project API keys → anon public` → `VITE_SUPABASE_ANON_KEY`
4. En la carpeta `app/`, crea el archivo `.env.local` a partir de la plantilla:
   ```bash
   cp .env.example .env.local
   # edita .env.local y pega tus dos valores
   ```
5. Arranca la app:
   ```bash
   npm install
   npm run dev
   ```

En el primer arranque con la base vacía, la app **siembra automáticamente** los
datos de demostración (pacientes ficticios). A partir de ahí, todo lo que crees
o edites se guarda en Supabase y lo verás desde cualquier dispositivo.

## Cómo funciona

- `src/backend/supabase.js` — crea el cliente con las variables de entorno.
- `src/backend/mappers.js` — convierte entre objetos de la app y filas de la BBDD.
- `src/backend/index.js` — API de datos (cargar, sembrar, guardar, borrar).
- `src/store/StoreContext.jsx` — decide entre local y nube, y **sincroniza por
  diferencias** (en cada cambio solo sube la entidad afectada). `localStorage`
  queda como caché para arranque instantáneo / offline.

Las pantallas no saben nada de esto: siguen llamando a las mismas acciones
(`addPatient`, `updatePatient`, `saveAppointment`…).

## ⚠️ Seguridad / privacidad

Todavía **no hay login**. El esquema deja acceso completo con la clave pública,
así que cualquiera con la URL y la anon key podría leer/escribir.

➜ **Usa solo datos ficticios** hasta que añadamos autenticación y políticas por
profesional (RLS basado en `auth.uid()`). El esquema ya tiene RLS activado para
que ese cambio sea sencillo: bastará con sustituir la política `demo_all`.
