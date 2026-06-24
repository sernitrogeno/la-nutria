/* Pantalla de Solicitudes (panel privado).
 *
 * Muestra las solicitudes del formulario público (tabla `solicitudes`) y permite
 * gestionarlas. Acción clave: "Confirmar pago y dar de alta" → al confirmar que
 * el pago (Bizum/transferencia) se ha recibido, crea el PACIENTE, registra el
 * COBRO y la SUSCRIPCIÓN en Finanzas, y marca la solicitud como convertida.
 *
 * Las solicitudes se leen/escriben directo contra Supabase (RLS exige login).
 * Paciente, cobro y suscripción van por el store (que sincroniza con Supabase).
 */
import { useEffect, useState, useCallback } from 'react';
import { Icon } from '../components/Icon.jsx';
import { EmptyState, SlideOver, TextField, SelectField, Button } from '../components/ui.jsx';
import { useStore } from '../store/StoreContext.jsx';
import { newPatient, uid } from '../store/schema.js';
import { parsePrice, periodicidadFromService, formatMoney, METODOS_PAGO } from '../lib/finance.js';
import { supabase, isConfigured } from '../backend/supabase.js';
import * as C from '../lib/calendar.js';
import '../styles/solicitudes.css';

const ESTADOS = [
  { id: 'nuevo', label: 'Nuevo' },
  { id: 'contactado', label: 'Contactado' },
  { id: 'convertido', label: 'Convertido' },
  { id: 'descartado', label: 'Descartado' },
];

function fechaCorta(iso) {
  try {
    return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

/* Diálogo de conversión: confirmar pago → alta de paciente. */
function ConvertDialog({ solicitud, services, onConfirm, onClose }) {
  const [f, setF] = useState({
    nombre: solicitud.nombre || '',
    email: solicitud.email || '',
    telefono: solicitud.telefono || '',
    plan: '',
    importe: '',
    metodo: 'bizum',
    pagoConfirmado: false,
  });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const pickPlan = (name) => {
    const svc = services.find((s) => s.name === name);
    setF((s) => ({ ...s, plan: name, importe: svc ? parsePrice(svc.price) : s.importe }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!f.pagoConfirmado) return;
    onConfirm(f);
  };

  return (
    <SlideOver eyebrow="Alta de paciente" title="Confirmar pago y dar de alta" onClose={onClose}>
      <form className="eform" onSubmit={submit}>
        {solicitud.objetivo && <p className="sol-conv__ctx"><Icon name="target" size={14} /> Objetivo: {solicitud.objetivo}</p>}
        {solicitud.mensaje && <p className="sol-conv__ctx sol-conv__msg">{solicitud.mensaje}</p>}

        <div className="erow">
          <TextField label="Nombre y apellidos" value={f.nombre} onChange={(e) => set('nombre', e.target.value)} required />
          <TextField label="Teléfono" value={f.telefono} onChange={(e) => set('telefono', e.target.value)} />
        </div>
        <TextField label="Email" type="email" value={f.email} onChange={(e) => set('email', e.target.value)} />

        <SelectField
          label="Plan contratado"
          value={f.plan}
          onChange={(e) => pickPlan(e.target.value)}
          options={[{ value: '', label: services.length ? 'Elige un plan…' : 'Sin planes (escribe el importe)' }, ...services.map((s) => ({ value: s.name, label: `${s.name} · ${s.price || ''}` }))]}
        />
        <div className="erow">
          <TextField label="Importe pagado (€)" type="number" min="0" step="1" value={f.importe} onChange={(e) => set('importe', e.target.value)} required />
          <SelectField label="Método de pago" value={f.metodo} onChange={(e) => set('metodo', e.target.value)} options={METODOS_PAGO} />
        </div>

        <label className="sol-conv__check">
          <input type="checkbox" checked={f.pagoConfirmado} onChange={(e) => set('pagoConfirmado', e.target.checked)} />
          <span>Confirmo que he recibido el pago{f.importe ? ` de ${formatMoney(f.importe)}` : ''}.</span>
        </label>

        <div className="eform__actions">
          <Button icon="check" type="submit" disabled={!f.pagoConfirmado}>Dar de alta como paciente</Button>
        </div>
      </form>
    </SlideOver>
  );
}

export function Solicitudes() {
  const { services, addPatient, savePayment, saveSubscription } = useStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [conv, setConv] = useState(null); // solicitud en conversión

  const cargar = useCallback(async () => {
    if (!isConfigured || !supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('solicitudes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Carga inicial al montar la pantalla.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, [cargar]);

  const cambiarEstado = async (id, estado) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, estado } : it)));
    if (isConfigured && supabase) {
      const { error } = await supabase.from('solicitudes').update({ estado }).eq('id', id);
      if (error) {
        setError(error.message);
        cargar();
      }
    }
  };

  /* Conversión: crea paciente + suscripción + cobro y marca la solicitud. */
  const convertir = (f) => {
    const parts = (f.nombre || '').trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ');
    const patient = newPatient({
      firstName,
      lastName,
      email: f.email || '',
      phone: f.telefono || '',
      status: 'active',
      observations: conv?.objetivo ? `Objetivo inicial: ${conv.objetivo}` : '',
    });
    addPatient(patient);

    const svc = services.find((s) => s.name === f.plan);
    const importe = Number(f.importe) || 0;
    const sub = {
      id: uid('sub'),
      patientId: patient.id,
      patientName: f.nombre,
      plan: f.plan || '',
      importe,
      periodicidad: svc ? periodicidadFromService(svc.period) : 'puntual',
      fechaInicio: C.iso(C.TODAY),
      estado: 'activa',
    };
    saveSubscription(sub);

    savePayment({
      id: uid('pay'),
      patientId: patient.id,
      patientName: f.nombre,
      concepto: f.plan ? `${f.plan} · alta` : 'Alta de paciente',
      importe,
      fecha: C.iso(C.TODAY),
      metodo: f.metodo || 'bizum',
      subscriptionId: sub.id,
    });

    cambiarEstado(conv.id, 'convertido');
    setConv(null);
  };

  const visibles = filtro === 'todos' ? items : items.filter((it) => it.estado === filtro);
  const nuevas = items.filter((it) => it.estado === 'nuevo').length;

  return (
    <div>
      <header className="phead phead--row">
        <div>
          <div className="eyebrow">Captación</div>
          <h1>Solicitudes</h1>
          <p className="phead__sub">
            Las personas que rellenan el formulario de tu web aparecen aquí.
            {nuevas > 0 && <> Tienes <b>{nuevas}</b> sin revisar.</>}
          </p>
        </div>
        <button className="btn btn--ghost" onClick={cargar} disabled={loading}>
          <Icon name="arrow" size={16} /> Actualizar
        </button>
      </header>

      {!isConfigured ? (
        <EmptyState icon="alert" title="Backend no configurado" message="Conecta Supabase (variables VITE_SUPABASE_*) para recibir y ver las solicitudes." />
      ) : loading ? (
        <p className="sol-loading">Cargando solicitudes…</p>
      ) : error ? (
        <EmptyState icon="alert" title="No se han podido cargar" message={error} />
      ) : items.length === 0 ? (
        <EmptyState icon="message" title="Aún no hay solicitudes" message="Cuando alguien rellene el formulario de tu web pública, lo verás aquí." />
      ) : (
        <>
          <div className="sol-filtros">
            <button className={'sol-chip' + (filtro === 'todos' ? ' is-on' : '')} onClick={() => setFiltro('todos')}>
              Todas ({items.length})
            </button>
            {ESTADOS.map((e) => {
              const n = items.filter((it) => it.estado === e.id).length;
              return (
                <button key={e.id} className={'sol-chip' + (filtro === e.id ? ' is-on' : '')} onClick={() => setFiltro(e.id)}>
                  {e.label} ({n})
                </button>
              );
            })}
          </div>

          <div className="sol-list">
            {visibles.map((it) => (
              <article className="sol-card" key={it.id}>
                <div className="sol-card__top">
                  <div>
                    <h3>{it.nombre}</h3>
                    <span className="sol-card__date">{fechaCorta(it.created_at)}</span>
                  </div>
                  <span className={'sol-estado sol-estado--' + it.estado}>
                    {ESTADOS.find((e) => e.id === it.estado)?.label || it.estado}
                  </span>
                </div>

                <div className="sol-card__contact">
                  <a href={`mailto:${it.email}`}><Icon name="message" size={15} /> {it.email}</a>
                  {it.telefono && <span><Icon name="clock" size={15} /> {it.telefono}</span>}
                  {it.objetivo && <span className="sol-card__obj"><Icon name="target" size={15} /> {it.objetivo}</span>}
                </div>

                {it.mensaje && <p className="sol-card__msg">“{it.mensaje}”</p>}

                {it.estado === 'convertido' ? (
                  <div className="sol-card__done"><Icon name="check" size={16} /> Paciente dado de alta</div>
                ) : (
                  <button className="btn btn--primary sol-card__convert" onClick={() => setConv(it)}>
                    <Icon name="check" size={16} /> Confirmar pago y dar de alta
                  </button>
                )}

                <div className="sol-card__actions">
                  <span className="sol-card__lbl">Estado:</span>
                  {ESTADOS.map((e) => (
                    <button
                      key={e.id}
                      className={'sol-set' + (it.estado === e.id ? ' is-on' : '')}
                      onClick={() => cambiarEstado(it.id, e.id)}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {conv && <ConvertDialog solicitud={conv} services={services} onConfirm={convertir} onClose={() => setConv(null)} />}
    </div>
  );
}
