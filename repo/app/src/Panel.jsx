/* Raíz de la app privada (panel de gestión).
 *
 * Se importa de forma DIFERIDA desde main.jsx (React.lazy), de modo que todo el
 * código del panel —páginas, store, sincronización con Supabase— va en un chunk
 * aparte y NO se descarga al visitar la web pública. Solo se carga al entrar a
 * /panel.
 *
 * AuthGate envuelve al StoreProvider: los datos solo se cargan de Supabase
 * cuando hay sesión iniciada. Sin login → solo se ve la pantalla de acceso.
 */
import App from './App.jsx';
import { StoreProvider } from './store/StoreContext.jsx';
import { AuthProvider, AuthGate } from './auth/AuthContext.jsx';

export default function Panel() {
  return (
    <AuthProvider>
      <AuthGate>
        <StoreProvider>
          <App />
        </StoreProvider>
      </AuthGate>
    </AuthProvider>
  );
}
