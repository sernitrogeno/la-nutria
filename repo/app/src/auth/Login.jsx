/* Pantalla de inicio de sesión de LaNutria.
 *
 * Acceso restringido: solo las personas dadas de alta en Supabase pueden entrar.
 * No hay registro: si alguien necesita acceso, se crea su usuario en el panel.
 */
import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { Button, TextField } from '../components/ui.jsx';
import otterCream from '../assets/otter-cream.png';

export function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      await signIn(email, password);
      /* Al lograrse, onAuthChange actualiza la sesión y AuthGate muestra la app. */
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <form className="auth__card card" onSubmit={submit}>
        <div className="auth__brand">
          <img src={otterCream} alt="" />
          <div>
            <span className="auth__name">LaNutria</span>
            <span className="auth__tag">Nutrición para todos</span>
          </div>
        </div>

        <h1 className="auth__title">Iniciar sesión</h1>
        <p className="auth__sub">Acceso solo para el equipo autorizado.</p>

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="auth__error">{error}</div>}

        <Button type="submit" disabled={busy} icon={busy ? undefined : 'check'}>
          {busy ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
