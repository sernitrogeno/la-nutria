/* Pantalla de Solicitudes (panel privado).
 *
 * Muestra las solicitudes enviadas desde el formulario público de la web
 * (tabla `solicitudes` en Supabase). Lectura y cambio de estado requieren
 * sesión iniciada (lo garantizan las políticas RLS). Si no hay backend
 * configurado, se muestra un aviso.
 */
import { useEffect, useState, useCallback } from 'react';
import { Icon } from '../components/Icon.jsx';
import { EmptyState } from '../components/ui.jsx';
import { supabase, isConfigured } from '../backend/supabase.js';
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

export function Solicitudes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todos');

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
    if (error) {
      setError(error.message);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
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
        <EmptyState
          icon="alert"
          title="Backend no configurado"
          message="Conecta Supabase (variables VITE_SUPABASE_*) para recibir y ver las solicitudes."
        />
      ) : loading ? (
        <p className="sol-loading">Cargando solicitudes…</p>
      ) : error ? (
        <EmptyState icon="alert" title="No se han podido cargar" message={error} />
      ) : items.length === 0 ? (
        <EmptyState
          icon="message"
          title="Aún no hay solicitudes"
          message="Cuando alguien rellene el formulario de tu web pública, lo verás aquí."
        />
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

                <div className="sol-card__actions">
                  <span className="sol-card__lbl">Marcar como:</span>
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
    </div>
  );
}
