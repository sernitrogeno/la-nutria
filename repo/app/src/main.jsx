import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.jsx';
import { StoreProvider } from './store/StoreContext.jsx';
import { AuthProvider, AuthGate } from './auth/AuthContext.jsx';

/* AuthGate envuelve al StoreProvider: los datos solo se cargan de Supabase
 * cuando hay sesión iniciada. Sin login → solo se ve la pantalla de acceso. */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AuthGate>
        <StoreProvider>
          <App />
        </StoreProvider>
      </AuthGate>
    </AuthProvider>
  </StrictMode>
);
