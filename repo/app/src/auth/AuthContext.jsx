/* eslint-disable react-refresh/only-export-components */
/* Contexto de autenticación de LaNutria.
 *
 * Mantiene la sesión actual y la expone a la app. El gating real lo hace
 * <AuthGate>: mientras no haya sesión, se muestra la pantalla de login y NO se
 * monta el resto de la app (ni el StoreProvider), de modo que los datos solo se
 * cargan de Supabase una vez la persona está identificada.
 *
 * Modo local: si no hay backend configurado, no hay login (no hay nada que
 * proteger ni datos remotos) y la app entra directamente.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSession, onAuthChange, signIn, signOut, isConfigured } from '../backend/auth.js';
import { setCurrentUserName } from '../store/schema.js';
import { Login } from './Login.jsx';

/* Caché local del store; la limpiamos al cerrar sesión para no dejar datos
 * de pacientes en el navegador de quien ya no está identificado. */
const STORE_CACHE_KEY = 'lanutria.store.v1';

const AuthContext = createContext(null);

/* Nombre a mostrar de quien ha iniciado sesión.
 * Lo tomamos de los metadatos del usuario en Supabase (full_name / name /
 * display_name, lo que esté relleno). Si no hay nombre, usamos la parte del
 * email anterior a la @ como respaldo razonable. */
function displayNameFromUser(user) {
  if (!user) return null;
  const m = user.user_metadata || {};
  const name = m.full_name || m.name || m.display_name;
  if (name && name.trim()) return name.trim();
  if (user.email) return user.email.split('@')[0];
  return null;
}

/* Solo el nombre de pila (primera palabra), para saludos tipo "Hola, X". */
function firstNameFromUser(user) {
  const n = displayNameFromUser(user);
  return n ? n.split(/\s+/)[0] : null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isConfigured); // sin backend no hay que esperar

  useEffect(() => {
    if (!isConfigured) return;
    let active = true;
    getSession().then((s) => {
      if (!active) return;
      setSession(s);
      setLoading(false);
    });
    const unsubscribe = onAuthChange((s) => active && setSession(s));
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  /* Propaga el nombre del usuario a los módulos no-React (store, export). */
  useEffect(() => {
    setCurrentUserName(displayNameFromUser(session?.user ?? null));
  }, [session]);

  const value = useMemo(
    () => {
      const user = session?.user ?? null;
      return {
        session,
        loading,
        isConfigured,
        user,
        displayName: displayNameFromUser(user),
        firstName: firstNameFromUser(user),
        signIn,
        signOut: async () => {
          await signOut();
          try {
            localStorage.removeItem(STORE_CACHE_KEY);
          } catch {
            /* sin almacenamiento: nada que limpiar */
          }
        },
      };
    },
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

/* Puerta de acceso: decide entre login y la app. */
export function AuthGate({ children }) {
  const { session, loading, isConfigured: configured } = useAuth();
  if (loading) return <div className="auth-loading">Cargando…</div>;
  if (configured && !session) return <Login />;
  return children;
}
