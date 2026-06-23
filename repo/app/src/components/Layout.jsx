import { useState } from 'react';
import { Icon } from './Icon.jsx';
import { ME } from '../store/seed.js';
import { initials } from '../store/schema.js';
import { useAuth } from '../auth/AuthContext.jsx';
import otterCream from '../assets/otter-cream.png';

const NAV_GROUPS = [
  {
    label: 'Consulta',
    items: [
      { id: 'dashboard', label: 'Panel', icon: 'panel' },
      { id: 'patients', label: 'Pacientes', icon: 'patient' },
      { id: 'agenda', label: 'Agenda', icon: 'agenda' },
      { id: 'solicitudes', label: 'Solicitudes', icon: 'message' },
    ],
  },
  {
    label: 'Negocio',
    items: [
      { id: 'content', label: 'Contenido', icon: 'content' },
      { id: 'services', label: 'Servicios', icon: 'services' },
    ],
  },
];

function Brand() {
  return (
    <div className="side__brand">
      <img className="side__otter" src={otterCream} alt="" />
      <div className="side__brand-text">
        <span className="side__name">LaNutria</span>
        <span className="side__tag">Nutrición para todos</span>
      </div>
    </div>
  );
}

export function Layout({ active, onNav, children }) {
  const [open, setOpen] = useState(false);
  const { user, displayName, signOut } = useAuth();
  /* Nombre del usuario logado; si no hay backend/login, usamos el de demo. */
  const name = displayName || ME.name;
  const go = (id) => {
    onNav(id);
    setOpen(false);
  };
  return (
    <div className="app" data-nav="side">
      {/* Barra móvil con menú */}
      <header className="mobilebar no-print">
        <button className="mobilebar__burger" onClick={() => setOpen(true)} aria-label="Abrir menú">
          <Icon name="grid" size={20} />
        </button>
        <div className="mobilebar__brand">
          <img src={otterCream} alt="" />
          LaNutria
        </div>
      </header>

      {open && <div className="side__scrim no-print" onClick={() => setOpen(false)} />}

      <aside className={'side no-print' + (open ? ' side--open' : '')}>
        <Brand />
        <nav className="side__nav">
          {NAV_GROUPS.map((g) => (
            <div key={g.label}>
              <div className="side__group-label">{g.label}</div>
              {g.items.map((n) => (
                <button key={n.id} className={'nav-item' + (active === n.id ? ' nav-item--active' : '')} onClick={() => go(n.id)}>
                  <Icon name={n.icon} />
                  {n.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="side__foot">
          <div className="side__avatar">{initials(name)}</div>
          <div className="side__me">
            <b>{name}</b>
            <span>{user?.email || ME.role}</span>
          </div>
          {user && (
            <button className="side__logout" onClick={signOut} aria-label="Cerrar sesión" title="Cerrar sesión">
              <Icon name="logout" size={18} />
            </button>
          )}
        </div>
      </aside>

      <main className="main">
        <div className="main__inner">{children}</div>
      </main>
    </div>
  );
}
