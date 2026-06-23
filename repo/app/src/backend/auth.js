/* Autenticación de LaNutria (Supabase Auth).
 *
 * Acceso restringido: solo entran las personas que demos de alta a mano en el
 * panel de Supabase (Authentication → Users → Add user). No hay registro
 * público. Estas funciones envuelven `supabase.auth`; la UI usa el contexto de
 * ../auth/AuthContext.jsx, no estas funciones directamente.
 *
 * Si no hay backend configurado (`isConfigured` false), no hay nada contra lo
 * que autenticar: la app funciona en modo local sin login (ver AuthContext).
 */
import { supabase, isConfigured } from './supabase.js';

export { isConfigured };

/* Sesión actual (o null). */
export async function getSession() {
  if (!isConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

/* Suscripción a cambios de sesión (login/logout/refresh de token).
 * Devuelve una función para cancelar la suscripción. */
export function onAuthChange(callback) {
  if (!isConfigured) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session ?? null));
  return () => data.subscription.unsubscribe();
}

/* Inicia sesión con email y contraseña. Lanza Error con mensaje legible. */
export async function signIn(email, password) {
  if (!isConfigured) throw new Error('El backend no está configurado.');
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw new Error(traducirError(error.message));
}

/* Cierra sesión. */
export async function signOut() {
  if (!isConfigured) return;
  await supabase.auth.signOut();
}

/* Mensajes de Supabase (en inglés) → texto claro para la persona usuaria. */
function traducirError(msg = '') {
  const m = msg.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email o contraseña incorrectos.';
  if (m.includes('email not confirmed')) return 'Tu email aún no está confirmado.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
  return 'No se ha podido iniciar sesión. Inténtalo de nuevo.';
}
