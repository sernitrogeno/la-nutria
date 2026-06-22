/* Cliente de Supabase.
 *
 * Las credenciales se leen de variables de entorno de Vite (prefijo VITE_),
 * nunca van escritas en el código. Si no están configuradas, `supabase` es
 * null y la app funciona en modo local (localStorage), de forma que el
 * proyecto sigue arrancando sin backend.
 *
 * Copia `.env.example` a `.env.local` y rellena los valores de tu proyecto
 * Supabase (Project Settings → API).
 */
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* Indica si hay backend configurado. Las páginas no la usan directamente;
 * el store decide entre persistencia local o remota a partir de este flag. */
export const isConfigured = Boolean(url && anonKey);

export const supabase = isConfigured ? createClient(url, anonKey) : null;
