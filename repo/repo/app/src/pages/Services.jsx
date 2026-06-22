import { useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Button, SlideOver } from '../components/ui.jsx';
import { useStore } from '../store/StoreContext.jsx';

function ServiceForm({ initial, onSave, onDelete, onClose }) {
  const editing = !!initial.id;
  const [f, setF] = useState({
    id: initial.id || null,
    name: initial.name || '',
    price: initial.price || '',
    period: initial.period || '',
    description: initial.description || '',
    features: initial.features ? [...initial.features] : [''],
    highlighted: initial.highlighted || false,
  });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const setFeat = (i, v) => setF((s) => ({ ...s, features: s.features.map((x, j) => (j === i ? v : x)) }));
  const addFeat = () => setF((s) => ({ ...s, features: [...s.features, ''] }));
  const delFeat = (i) => setF((s) => ({ ...s, features: s.features.filter((_, j) => j !== i) }));
  const submit = (e) => {
    e.preventDefault();
    onSave({ ...f, id: f.id || Date.now(), period: f.period.trim() || null, features: f.features.map((x) => x.trim()).filter(Boolean) });
  };
  return (
    <SlideOver eyebrow={editing ? 'Editar servicio' : 'Nuevo servicio'} title={editing ? initial.name : 'Crear plan'} onClose={onClose}>
      <form className="eform" onSubmit={submit}>
        <div className="field">
          <label>Nombre</label>
          <input value={f.name} placeholder="Ej. Plan mensual" onChange={(e) => set('name', e.target.value)} required />
        </div>
        <div className="erow">
          <div className="field">
            <label>Precio</label>
            <input value={f.price} placeholder="49€" onChange={(e) => set('price', e.target.value)} />
          </div>
          <div className="field">
            <label>Periodo</label>
            <input value={f.period || ''} placeholder="/mes (opcional)" onChange={(e) => set('period', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Descripción</label>
          <textarea rows="3" value={f.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div className="field">
          <label>Qué incluye</label>
          <div className="feats-edit">
            {f.features.map((ft, i) => (
              <div className="feat-row" key={i}>
                <Icon name="check" size={16} />
                <input value={ft} placeholder="Característica" onChange={(e) => setFeat(i, e.target.value)} />
                <button type="button" className="feat-del" onClick={() => delFeat(i)} aria-label="Quitar">
                  <Icon name="x" size={14} />
                </button>
              </div>
            ))}
            <button type="button" className="feat-add" onClick={addFeat}>
              <Icon name="plus" size={15} />
              Añadir característica
            </button>
          </div>
        </div>
        <label className="echeck">
          <input type="checkbox" checked={f.highlighted} onChange={(e) => set('highlighted', e.target.checked)} />
          <span>
            <Icon name="check" size={13} />
          </span>{' '}
          Destacar como “Más popular”
        </label>
        <div className="eform__actions">
          {editing && (
            <button type="button" className="btn btn--ghost btn--danger" onClick={() => onDelete(f.id)}>
              Eliminar
            </button>
          )}
          <Button icon="check" type="submit">
            {editing ? 'Guardar' : 'Crear'}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}

export function Services() {
  const { services, saveService, deleteService } = useStore();
  const [form, setForm] = useState(null);
  const save = (s) => {
    saveService(s);
    setForm(null);
  };
  const del = (id) => {
    deleteService(id);
    setForm(null);
  };

  return (
    <div>
      <header className="phead phead--row">
        <div>
          <div className="eyebrow">Tus planes</div>
          <h1>Servicios y planes</h1>
          <p className="phead__sub">Edita precios y contenidos. Esto es tu catálogo interno, listo para usar.</p>
        </div>
        <Button icon="plus" onClick={() => setForm({})}>
          Añadir servicio
        </Button>
      </header>

      <div className="svc-grid">
        {services.map((s) => (
          <div className={'svc' + (s.highlighted ? ' svc--hi' : '')} key={s.id}>
            {s.highlighted && <span className="svc__tag">Más popular</span>}
            <button className="svc__edit" onClick={() => setForm(s)} aria-label="Editar">
              <Icon name="pencil" size={16} />
            </button>
            <h2 className="svc__name">{s.name}</h2>
            <div className="svc__price">
              {s.price}
              {s.period && <span>{s.period}</span>}
            </div>
            <p className="svc__desc">{s.description}</p>
            <ul className="svc__feats">
              {s.features.map((ft, i) => (
                <li key={i}>
                  <Icon name="check" size={18} />
                  {ft}
                </li>
              ))}
            </ul>
            <button className={'btn ' + (s.highlighted ? 'btn--primary' : 'btn--ghost')} onClick={() => setForm(s)}>
              <Icon name="pencil" size={16} />
              Editar plan
            </button>
          </div>
        ))}
        <button className="svc svc--add" onClick={() => setForm({})}>
          <span className="svc-add__ico">
            <Icon name="plus" size={26} />
          </span>
          <span className="svc-add__t">Añadir servicio</span>
        </button>
      </div>

      {form && <ServiceForm initial={form} onSave={save} onDelete={del} onClose={() => setForm(null)} />}
    </div>
  );
}
