import { useState } from 'react';
import { Icon } from '../../components/Icon.jsx';
import { Button, SlideOver, TextField, TextArea, EmptyState } from '../../components/ui.jsx';
import { newNote } from '../../store/schema.js';

function NoteForm({ initial, onSave, onDelete, onClose }) {
  const editing = !!initial.title || !!initial.assessment;
  const [n, setN] = useState(() => ({ ...newNote(), ...initial, tags: initial.tags || [] }));
  const [tagInput, setTagInput] = useState('');
  const set = (k, v) => setN((s) => ({ ...s, [k]: v }));
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !n.tags.includes(t)) set('tags', [...n.tags, t]);
    setTagInput('');
  };
  const submit = (e) => {
    e.preventDefault();
    onSave({ ...n, updatedAt: new Date().toISOString() });
  };
  return (
    <SlideOver eyebrow={editing ? 'Editar nota' : 'Nueva nota'} title="Nota profesional" onClose={onClose}>
      <p className="field__hint" style={{ marginBottom: 14 }}>
        <Icon name="alert" size={13} /> Privada · no se incluye en documentos entregados al paciente.
      </p>
      <form className="eform" onSubmit={submit}>
        <TextField label="Título" value={n.title} onChange={(e) => set('title', e.target.value)} placeholder="Valoración general" />
        <TextArea label="Valoración general" value={n.assessment} onChange={(e) => set('assessment', e.target.value)} />
        <TextArea label="Aspectos prioritarios" value={n.priorities} onChange={(e) => set('priorities', e.target.value)} />
        <TextArea label="Cambios pendientes" value={n.pending} onChange={(e) => set('pending', e.target.value)} />
        <TextArea label="Observaciones clínicas" value={n.clinical} onChange={(e) => set('clinical', e.target.value)} />
        <TextArea label="Recordatorios" value={n.reminders} onChange={(e) => set('reminders', e.target.value)} />
        <div className="field">
          <label>Etiquetas</label>
          <div className="tag-input">
            {n.tags.map((t) => (
              <span key={t} className="tag-pill">
                {t}
                <button type="button" onClick={() => set('tags', n.tags.filter((x) => x !== t))}>
                  <Icon name="x" size={11} />
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              placeholder="Añadir etiqueta…"
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
          </div>
        </div>
        <div className="eform__actions">
          {editing && initial.id && (
            <button type="button" className="btn btn--ghost btn--danger" onClick={() => onDelete(initial.id)}>
              Eliminar
            </button>
          )}
          <Button icon="check" type="submit">
            Guardar nota
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}

export function NotesTab({ patient, onSave }) {
  const [form, setForm] = useState(null);
  const notes = [...(patient.notes || [])].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));

  const save = (note) => {
    const exists = (patient.notes || []).some((x) => x.id === note.id);
    const next = exists ? patient.notes.map((x) => (x.id === note.id ? note : x)) : [...(patient.notes || []), note];
    onSave({ notes: next });
    setForm(null);
  };
  const del = (id) => {
    onSave({ notes: (patient.notes || []).filter((x) => x.id !== id) });
    setForm(null);
  };

  return (
    <div className="tabpane">
      <div className="tabpane__head">
        <div>
          <h3>Notas profesionales</h3>
          <p className="field__hint">
            <Icon name="alert" size={13} /> Privadas · nunca se incluyen en la exportación al paciente.
          </p>
        </div>
        <Button icon="plus" onClick={() => setForm(newNote())}>
          Nueva nota
        </Button>
      </div>

      {notes.length === 0 ? (
        <EmptyState icon="note" title="Sin notas privadas" message="Apunta valoraciones, prioridades y recordatorios solo para ti." />
      ) : (
        <div className="notes-grid">
          {notes.map((n) => (
            <button className="pro-note card" key={n.id} onClick={() => setForm(n)}>
              <div className="pro-note__head">
                <b>{n.title || 'Sin título'}</b>
                <span className="pro-note__date">{(n.updatedAt || '').slice(0, 10)}</span>
              </div>
              {n.assessment && <p className="pro-note__text">{n.assessment}</p>}
              {n.priorities && (
                <p className="pro-note__line">
                  <Icon name="target" size={13} /> {n.priorities}
                </p>
              )}
              {n.tags?.length > 0 && (
                <div className="pro-note__tags">
                  {n.tags.map((t) => (
                    <span key={t} className="badge badge--neutral">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              <span className="pro-note__author">— {n.author}</span>
            </button>
          ))}
        </div>
      )}

      {form && <NoteForm initial={form} onSave={save} onDelete={del} onClose={() => setForm(null)} />}
    </div>
  );
}
