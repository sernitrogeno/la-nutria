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
import { Login } from './Login.jsx';

/* Caché local del store; la limpiamos al cerrar sesión para no dejar datos
 * de pacientes en el navegador de quien ya no está identificado. */
const STORE_CACHE_KEY = 'lanutria.store.v1';

const AuthContext = createContext(null);

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

  const value = useMemo(
    () => ({
      session,
      loading,
      isConfigured,
      user: session?.user ?? null,
      signIn,
      signOut: async () => {
        await signOut();
        try {
          localStorage.removeItem(STORE_CACHE_KEY);
        } catch {
          /* sin almacenamiento: nada que limpiar */
        }
      },
    }),
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
