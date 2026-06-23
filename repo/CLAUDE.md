# LaNutria — Guía del proyecto (para Claude Code)

> Este archivo lo lee Claude Code automáticamente al abrir una sesión sobre el
> repo. Resume cómo está montado el proyecto, cómo se despliega y los detalles
> que más cuesta recordar. Manténlo actualizado.

## Qué es
App de gestión para una consulta de nutrición ("LaNutria"): panel, pacientes,
agenda, fichas clínicas, contenido y servicios. React 19 + Vite. Persistencia
en Supabase (con modo local de respaldo en `localStorage`).

## Estructura del repositorio (IMPORTANTE)
- El repo de GitHub es **`la-nutria`**.
- El código de la app NO está en la raíz: está dentro de **`repo/app/`**.
  (En GitHub: `la-nutria` → `repo/` → `app/`.)
- En Vercel, **Root Directory = `repo/app`**.
- La app vive en `repo/app/src/`.

## Despliegue (Vercel) — reglas que han dado problemas
- **Rama de producción: `master`** (NO `main`). Hay que commitear a `master`.
- Los archivos deben acabar en **`repo/app/src/...`**. Si se suben a `app/src/...`
  (sin el prefijo `repo/`) o a otro nivel, Vercel NO los ve y el build usa código viejo.
- Tras subir, **verificar** abriendo el archivo en GitHub (rama `master`) y
  comprobando que el contenido es el nuevo, antes de dar nada por hecho.
- Método más fiable para editar: el **lápiz ✏️ (Edit)** sobre el archivo ya
  existente en GitHub, en vez de arrastrar carpetas (que se descolocan).
- Vercel redespliega solo al hacer push/commit a `master`.
- Tras un deploy: cerrar sesión + recarga forzada (Ctrl+Shift+R) o incógnito,
  porque un service worker / caché puede servir la versión vieja.

## Backend (Supabase)
- Cliente en `repo/app/src/backend/supabase.js`. Lee variables de entorno Vite:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - Se configuran en **Vercel → Settings → Environment Variables** (y en
    `app/.env.local` para desarrollo local; nunca subir `.env.local`).
- Si esas variables están vacías → la app funciona en **modo local** (localStorage),
  sin login.
- SQL del proyecto en `repo/supabase/`: `schema.sql`, `policies-auth.sql`, `seed.sql`.

## Autenticación y nombre de usuario
- Acceso restringido: los usuarios se crean a mano en
  **Supabase → Authentication → Users** (no hay registro público).
- El **nombre a mostrar** se guarda en los metadatos del usuario:
  `raw_user_meta_data.full_name` (vale también `name` / `display_name`).
  Se edita por SQL:
  ```sql
  update auth.users
  set raw_user_meta_data = coalesce(raw_user_meta_data,'{}'::jsonb)
      || '{"full_name":"Nombre Apellido"}'::jsonb
  where email = 'correo@ejemplo.com';
  ```
- El nombre cambia en el token al **volver a iniciar sesión** (no en caliente).
- En el código:
  - `src/auth/AuthContext.jsx` expone `user`, `displayName` y `firstName`, y
    propaga el nombre con `setCurrentUserName()`.
  - `src/store/schema.js` guarda el nombre actual (`getCurrentUserName` /
    `setCurrentUserName`); es el autor/profesional por defecto de los datos.
  - Lo usan `Layout.jsx` (barra lateral), `Dashboard.jsx` (saludo),
    `StoreContext.jsx` (autoría) y `ExportView.jsx` (PDF).
  - Respaldo de demo si no hay login: "Elena Vidal" (en `seed.js` y como default).

## Comandos
```bash
cd repo/app
npm install
npm run dev      # desarrollo
npm run build    # compila (verificar antes de desplegar)
npm run lint
```

## Hoja de ruta
- [ ] Web pública (landing) de la consulta.
- [ ] Formulario público para que el cliente rellene sus datos y se guarden en
      Supabase (insert anónimo con políticas RLS adecuadas). Ver `ROADMAP-web-publica.md`.
