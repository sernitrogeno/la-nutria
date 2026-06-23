import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.jsx';
import { Landing } from './public/Landing.jsx';
import { StoreProvider } from './store/StoreContext.jsx';
import { AuthProvider, AuthGate } from './auth/AuthContext.jsx';

/* Enrutado mínimo, sin librería:
 *   /        → web pública (Landing), abierta, sin login.
 *   /panel   → app privada (panel de gestión) tras el login.
 * El cambio de vista actualiza la URL (history) para que el botón atrás
 * funcione; vercel.json sirve index.html en cualquier ruta (SPA). */
const isPanel = () => window.location.pathname.startsWith('/panel');

/* AuthGate envuelve al StoreProvider: los datos solo se cargan de Supabase
 * cuando hay sesión iniciada. Sin login → solo se ve la pantalla de acceso. */
function Panel() {
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

function Root() {
  const [panel, setPanel] = useState(isPanel());

  useEffect(() => {
    const onPop = () => setPanel(isPanel());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const goPanel = () => {
    window.history.pushState({}, '', '/panel');
    setPanel(true);
  };

  return panel ? <Panel /> : <Landing onAccess={goPanel} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
