/* Finanzas (panel privado).
 *
 * Da una visión real de las cuentas con pacientes:
 *   • KPIs: ingresos del mes (cobros reales), ingresos recurrentes (MRR),
 *     pacientes de pago y ticket medio.
 *   • Gráfica de ingresos de los últimos 12 meses con objetivo mensual.
 *   • Suscripciones: quién ha contratado qué plan, por cuánto y en qué estado.
 *   • Cobros: el dinero realmente recibido.
 *
 * Los datos viven en el store (tablas `suscripciones` y `pagos` en Supabase).
 */
import { useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Button, SlideOver, TextField, SelectField, EmptyState } from '../components/ui.jsx';
import { useStore } from '../store/StoreContext.jsx';
import { uid } from '../store/schema.js';
import * as C from '../lib/calendar.js';
import {
  formatMoney, mrr, monthIncome, payingPatients, avgTicket, last12Months, nextBillingDate,
  parsePrice, periodicidadFromService,
  PERIODICIDADES, ESTADOS_SUB, METODOS_PAGO,
} from '../lib/finance.js';
import '../styles/finanzas.css';

const GOAL_KEY = 'lanutria.finance.goal';
const nameOf = (p) => `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Paciente sin nombre';
const estadoLabel = (v) => ESTADOS_SUB.find((e) => e.value === v)?.label || v;

/* ---------- Gráfica de barras de ingresos por mes ---------- */
function IncomeChart({ months, goal }) {
  const max = Math.max(goal || 0, ...months.map((m) => m.total), 1);
  const goalPct = goal ? Math.min(100, (goal / max) * 100) : null;
  return (
    <div className="fin-chart">
      <div className="fin-chart__plot">
        {goalPct != null && (
          <div className="fin-chart__goal" style={{ bottom: `${goalPct}%` }}>
            <span>Objetivo {formatMoney(goal)}</span>
          </div>
        )}
        {months.map((m) => (
          <div className="fin-chart__col" key={m.key}>
            <div
              className={'fin-chart__bar' + (goal && m.total >= goal ? ' is-goal' : '')}
              style={{ height: `${(m.total / max) * 100}%` }}
              title={formatMoney(m.total)}
            />
          </div>
        ))}
      </div>
      <div className="fin-chart__labels">
        {months.map((m) => <span key={m.key}>{m.label}</span>)}
      </div>
    </div>
  );
}

/* ---------- Formulario de suscripción ---------- */
function SubForm({ initial, patients, services, onSave, onDelete, onClose }) {
  const editing = !!initial.id;
  const [f, setF] = useState({
    id: initial.id || null,
    patientId: initial.patientId || (patients[0]?.id ?? ''),
    plan: initial.plan || '',
    importe: initial.importe ?? '',
    periodicidad: initial.periodicidad || 'mensual',
    fechaInicio: initial.fechaInicio || C.iso(C.TODAY),
    estado: initial.estado || 'activa',
  });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const pickPlan = (name) => {
    const svc = services.find((s) => s.name === name);
    setF((s) => ({
      ...s,
      plan: name,
      importe: svc ? parsePrice(svc.price) : s.importe,
      periodicidad: svc ? periodicidadFromService(svc.period) : s.periodicidad,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === f.patientId);
    onSave({
      ...f,
      id: f.id || uid('sub'),
      patientName: patient ? nameOf(patient) : '',
      importe: Number(f.importe) || 0,
    });
  };

  const planOptions = ['', ...services.map((s) => s.name)];

  return (
    <SlideOver eyebrow={editing ? 'Editar suscripción' : 'Nueva suscripción'} title={editing ? f.plan || 'Suscripción' : 'Contratar plan'} onClose={onClose}>
      <form className="eform" onSubmit={submit}>
        <SelectField
          label="Paciente"
          value={f.patientId}
          onChange={(e) => set('patientId', e.target.value)}
          options={patients.length ? patients.map((p) => ({ value: p.id, label: nameOf(p) })) : [{ value: '', label: 'No hay pacientes' }]}
        />
        <SelectField
          label="Plan"
          value={f.plan}
          onChange={(e) => pickPlan(e.target.value)}
          options={planOptions.map((n) => ({ value: n, label: n || 'Elige un plan…' }))}
        />
        <div className="erow">
          <TextField label="Importe (€)" type="number" min="0" step="1" value={f.importe} onChange={(e) => set('importe', e.target.value)} required />
          <SelectField label="Periodicidad" value={f.periodicidad} onChange={(e) => set('periodicidad', e.target.value)} options={PERIODICIDADES} />
        </div>
        <div className="erow">
          <TextField label="Fecha de inicio" type="date" value={f.fechaInicio} onChange={(e) => set('fechaInicio', e.target.value)} />
          <SelectField label="Estado" value={f.estado} onChange={(e) => set('estado', e.target.value)} options={ESTADOS_SUB} />
        </div>
        <div className="eform__actions">
          {editing && (
            <button type="button" className="btn btn--ghost btn--danger" onClick={() => onDelete(f.id)}>
              Eliminar
            </button>
          )}
          <Button icon="check" type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
        </div>
      </form>
    </SlideOver>
  );
}

/* ---------- Formulario de cobro ---------- */
function PayForm({ initial, patients, onSave, onDelete, onClose }) {
  const editing = !!initial.id;
  const [f, setF] = useState({
    id: initial.id || null,
    patientId: initial.patientId || '',
    concepto: initial.concepto || '',
    importe: initial.importe ?? '',
    fecha: initial.fecha || C.iso(C.TODAY),
    metodo: initial.metodo || 'transferencia',
    subscriptionId: initial.subscriptionId || null,
  });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === f.patientId);
    onSave({ ...f, id: f.id || uid('pay'), patientName: patient ? nameOf(patient) : '', importe: Number(f.importe) || 0 });
  };
  return (
    <SlideOver eyebrow={editing ? 'Editar cobro' : 'Registrar cobro'} title={editing ? f.concepto || 'Cobro' : 'Nuevo cobro'} onClose={onClose}>
      <form className="eform" onSubmit={submit}>
        <SelectField
          label="Paciente"
          value={f.patientId}
          onChange={(e) => set('patientId', e.target.value)}
          options={[{ value: '', label: 'Sin asignar' }, ...patients.map((p) => ({ value: p.id, label: nameOf(p) }))]}
        />
        <TextField label="Concepto" value={f.concepto} placeholder="Ej. Plan mensual junio" onChange={(e) => set('concepto', e.target.value)} required />
        <div className="erow">
          <TextField label="Importe (€)" type="number" min="0" step="1" value={f.importe} onChange={(e) => set('importe', e.target.value)} required />
          <TextField label="Fecha" type="date" value={f.fecha} onChange={(e) => set('fecha', e.target.value)} />
        </div>
        <SelectField label="Método" value={f.metodo} onChange={(e) => set('metodo', e.target.value)} options={METODOS_PAGO} />
        <div className="eform__actions">
          {editing && (
            <button type="button" className="btn btn--ghost btn--danger" onClick={() => onDelete(f.id)}>
              Eliminar
            </button>
          )}
          <Button icon="check" type="submit">{editing ? 'Guardar' : 'Registrar'}</Button>
        </div>
      </form>
    </SlideOver>
  );
}

export function Finanzas() {
  const { livePatients, services, subscriptions, payments, saveSubscription, deleteSubscription, savePayment, deletePayment } = useStore();
  const [subForm, setSubForm] = useState(null);
  const [payForm, setPayForm] = useState(null);
  const [goal, setGoal] = useState(() => Number(localStorage.getItem(GOAL_KEY)) || 0);

  const setGoalValue = (v) => {
    const n = Number(v) || 0;
    setGoal(n);
    try { localStorage.setItem(GOAL_KEY, String(n)); } catch { /* sin almacenamiento */ }
  };

  const ingresosMes = monthIncome(payments, C.TODAY);
  const recurrente = mrr(subscriptions);
  const nPago = payingPatients(subscriptions);
  const ticket = avgTicket(subscriptions);
  const months = last12Months(payments, C.TODAY);
  const recientes = [...payments].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '')).slice(0, 8);

  const kpis = [
    { ico: 'dollar', label: 'Ingresos del mes', value: formatMoney(ingresosMes) },
    { ico: 'trend', label: 'Ingresos recurrentes (mes)', value: formatMoney(recurrente) },
    { ico: 'clients', label: 'Pacientes de pago', value: nPago },
    { ico: 'pulse', label: 'Ticket medio', value: formatMoney(ticket) },
  ];

  const saveSub = (s) => { saveSubscription(s); setSubForm(null); };
  const delSub = (id) => { deleteSubscription(id); setSubForm(null); };
  const savePay = (p) => { savePayment(p); setPayForm(null); };
  const delPay = (id) => { deletePayment(id); setPayForm(null); };

  /* Registrar cobro a partir de una suscripción (prefill). */
  const cobrarDe = (s) => setPayForm({
    patientId: s.patientId,
    concepto: s.plan ? `${s.plan} · ${C.monthYear(C.TODAY)}` : 'Cobro',
    importe: s.importe,
    subscriptionId: s.id,
  });

  return (
    <div>
      <header className="phead phead--row">
        <div>
          <div className="eyebrow">Cuentas</div>
          <h1>Finanzas</h1>
          <p className="phead__sub">Tus ingresos reales, quién ha contratado qué y cómo evolucionas.</p>
        </div>
        <div className="fin-actions">
          <Button variant="ghost" icon="plus" onClick={() => setSubForm({})}>Nueva suscripción</Button>
          <Button icon="dollar" onClick={() => setPayForm({})}>Registrar cobro</Button>
        </div>
      </header>

      {/* KPIs */}
      <div className="stats">
        {kpis.map((k) => (
          <div className="stat" key={k.label}>
            <div className="stat__ico"><Icon name={k.ico} /></div>
            <div className="stat__value">{k.value}</div>
            <span className="stat__label">{k.label}</span>
          </div>
        ))}
      </div>

      {/* Gráfica de ingresos */}
      <section className="panel fin-panel">
        <div className="panel__head">
          <h2>Ingresos por mes</h2>
          <label className="fin-goal">
            Objetivo mensual:
            <input type="number" min="0" step="50" value={goal || ''} placeholder="0" onChange={(e) => setGoalValue(e.target.value)} />
            <span>€</span>
          </label>
        </div>
        <IncomeChart months={months} goal={goal} />
      </section>

      {/* Suscripciones */}
      <section className="panel fin-panel">
        <div className="panel__head">
          <h2>Suscripciones · quién paga qué</h2>
          <button className="panel__link" onClick={() => setSubForm({})}>Añadir</button>
        </div>
        {subscriptions.length === 0 ? (
          <EmptyState icon="clients" title="Aún no hay contrataciones" message="Cuando un paciente contrate un plan, regístralo aquí para ver tus ingresos recurrentes." action={<Button icon="plus" onClick={() => setSubForm({})}>Nueva suscripción</Button>} />
        ) : (
          <div className="fin-table">
            <div className="fin-row fin-row--head">
              <span>Paciente</span><span>Plan</span><span>Importe</span><span>Estado</span><span>Próx. cobro</span><span></span>
            </div>
            {subscriptions.map((s) => {
              const next = nextBillingDate(s, C.TODAY);
              return (
                <div className="fin-row" key={s.id}>
                  <span className="fin-row__name">{s.patientName || '—'}</span>
                  <span>{s.plan || '—'}</span>
                  <span>{formatMoney(s.importe)}<i className="fin-per">{s.periodicidad === 'mensual' ? '/mes' : s.periodicidad === 'trimestral' ? '/trim' : ''}</i></span>
                  <span className={'fin-estado fin-estado--' + s.estado}>{estadoLabel(s.estado)}</span>
                  <span>{next ? C.dayMonth(next) : '—'}</span>
                  <span className="fin-row__actions">
                    <button className="fin-mini" onClick={() => cobrarDe(s)} title="Registrar cobro"><Icon name="dollar" size={15} /></button>
                    <button className="fin-mini" onClick={() => setSubForm(s)} title="Editar"><Icon name="pencil" size={15} /></button>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Cobros recientes */}
      <section className="panel fin-panel">
        <div className="panel__head">
          <h2>Últimos cobros</h2>
          <button className="panel__link" onClick={() => setPayForm({})}>Registrar</button>
        </div>
        {payments.length === 0 ? (
          <EmptyState icon="dollar" title="Sin cobros todavía" message="Registra el dinero que vas recibiendo para tener tu libro de caja al día." />
        ) : (
          <div className="panel__list">
            {recientes.map((p) => (
              <button className="row" key={p.id} onClick={() => setPayForm(p)}>
                <div className="row__avatar" style={{ background: 'var(--accent-soft)' }}><Icon name="dollar" size={16} /></div>
                <div className="row__main">
                  <div className="row__title">{p.concepto || 'Cobro'}</div>
                  <div className="row__sub">{p.patientName || 'Sin asignar'} · {p.fecha}</div>
                </div>
                <div className="row__meta"><b className="fin-amount">{formatMoney(p.importe)}</b></div>
              </button>
            ))}
          </div>
        )}
      </section>

      {subForm && <SubForm initial={subForm} patients={livePatients} services={services} onSave={saveSub} onDelete={delSub} onClose={() => setSubForm(null)} />}
      {payForm && <PayForm initial={payForm} patients={livePatients} onSave={savePay} onDelete={delPay} onClose={() => setPayForm(null)} />}
    </div>
  );
}
