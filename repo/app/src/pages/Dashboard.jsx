import { Icon } from '../components/Icon.jsx';
import { Badge } from '../components/ui.jsx';
import { useStore } from '../store/StoreContext.jsx';
import { initials } from '../store/schema.js';
import { useAuth } from '../auth/AuthContext.jsx';
import * as C from '../lib/calendar.js';

export function Dashboard({ onNav, onOpenPatient }) {
  const { livePatients, appointments, content } = useStore();
  const { firstName } = useAuth();
  const today = appointments
    .filter((a) => a.date === C.iso(C.TODAY))
    .sort((a, b) => C.toMin(a.start) - C.toMin(b.start));
  const ready = content.filter((c) => c.column === 'ready');
  const active = livePatients.filter((c) => c.status === 'active').length;

  const stats = [
    { ico: 'clients', label: 'Pacientes activos', value: active, trend: null },
    { ico: 'agenda', label: 'Sesiones de hoy', value: today.length, trend: null },
    { ico: 'spark', label: 'Listo para publicar', value: ready.length, trend: null },
    /* Ingresos: a 0 hasta que añadamos un módulo de cobros/facturación. */
    { ico: 'dollar', label: 'Ingresos del mes', value: '0€', trend: null },
  ];

  return (
    <div>
      <header className="phead">
        <div className="eyebrow">{C.longDate(C.TODAY)}</div>
        <h1>Hola, {firstName || 'Elena'} 👋</h1>
        <p className="phead__sub">
          Así va tu día hoy. Tienes {today.length} sesiones y {ready.length} piezas listas para subir.
        </p>
      </header>

      <div className="stats">
        {stats.map((s, i) => (
          <div className="stat" key={i}>
            <div className="stat__ico">
              <Icon name={s.ico} />
            </div>
            <div className="stat__value">{s.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="stat__label">{s.label}</span>
              {s.trend && (
                <span className="stat__trend">
                  <Icon name="trend" />
                  {s.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="dash-cols">
        <section className="panel">
          <div className="panel__head">
            <h2>Sesiones de hoy</h2>
            <button className="panel__link" onClick={() => onNav('agenda')}>
              Ver agenda
            </button>
          </div>
          <div className="panel__list">
            {today.length === 0 && <p className="empty">No tienes sesiones hoy.</p>}
            {today.map((s) => (
              <button className="row" key={s.id} onClick={() => s.patientId && onOpenPatient(s.patientId)}>
                <div className="row__avatar">{initials(s.clientName)}</div>
                <div className="row__main">
                  <div className="row__title">{s.clientName}</div>
                  <div className="row__sub">{s.type}</div>
                </div>
                <div className="row__meta">
                  <span className="row__time">{s.start}</span>
                  <Badge tone={s.done ? 'ok' : 'neutral'} dot>
                    {s.done ? 'Hecha' : 'Pendiente'}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2>Listo para subir</h2>
            <button className="panel__link" onClick={() => onNav('content')}>
              Ver tablero
            </button>
          </div>
          <div className="panel__list">
            {ready.length === 0 && <p className="empty">Nada en la columna “Listo”.</p>}
            {ready.map((c) => (
              <div className="row" key={c.id}>
                <div className="row__avatar" style={{ background: 'var(--accent-soft)' }}>
                  <Icon name="spark" size={17} />
                </div>
                <div className="row__main">
                  <div className="row__title">{c.title}</div>
                  <div className="row__sub">Programado · {c.date}</div>
                </div>
                <div className="row__meta">
                  <Badge tone="accent">{c.platform}</Badge>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
