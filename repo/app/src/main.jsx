import { StrictMode, useState, useEffect, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { Landing } from './public/Landing.jsx';

/* Enrutado mínimo, sin librería:
 *   /        → web pública (Landing), abierta, sin login.
 *   /panel   → app privada (panel de gestión) tras el login.
 *
 * El panel se carga de forma DIFERIDA (code-splitting): los visitantes de la web
 * pública no descargan el código de la app de gestión; solo se baja al ir a
 * /panel. El cambio de vista actualiza la URL (history) para que el botón atrás
 * funcione; vercel.json sirve index.html en cualquier ruta (SPA). */
const Panel = lazy(() => import('./Panel.jsx'));

const isPanel = () => window.location.pathname.startsWith('/panel');

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

  if (panel) {
    return (
      <Suspense fallback={<div className="auth-loading">Cargando…</div>}>
        <Panel />
      </Suspense>
    );
  }
  return <Landing onAccess={goPanel} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
