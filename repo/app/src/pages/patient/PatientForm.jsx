import { useState } from 'react';
import { Button, SlideOver } from '../../components/ui.jsx';
import { newPatient, PATIENT_STATUS, statusLabel } from '../../store/schema.js';
import { ageFrom } from '../../lib/calendar.js';

/* Alta / edición de los datos personales del paciente. */
export function PatientForm({ initial, isNew = false, onSave, onClose }) {
  const editing = !isNew;
  const [f, setF] = useState(() => ({ ...newPatient(), ...initial }));
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const age = ageFrom(f.birthDate);

  const submit = (e) => {
    e.preventDefault();
    if (!f.firstName.trim()) return;
    onSave(f);
  };

  return (
    <SlideOver eyebrow={editing ? 'Editar paciente' : 'Nuevo paciente'} title={editing ? `${f.firstName} ${f.lastName}` : 'Alta de paciente'} onClose={onClose}>
      <form className="eform" onSubmit={submit}>
        <div className="erow">
          <div className="field">
            <label>Nombre *</label>
            <input value={f.firstName} onChange={(e) => set('firstName', e.target.value)} required />
          </div>
          <div className="field">
            <label>Apellidos</label>
            <input value={f.lastName} onChange={(e) => set('lastName', e.target.value)} />
          </div>
        </div>
        <div className="erow">
          <div className="field">
            <label>Fecha de nacimiento</label>
            <input type="date" value={f.birthDate} onChange={(e) => set('birthDate', e.target.value)} />
          </div>
          <div className="field">
            <label>Edad</label>
            <input value={age != null ? `${age} años` : '—'} disabled />
          </div>
        </div>
        <div className="erow">
          <div className="field">
            <label>Teléfono</label>
            <input value={f.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div className="field">
            <label>Correo electrónico</label>
            <input type="email" value={f.email} onChange={(e) => set('email', e.target.value)} />
          </div>
        </div>
        <div className="erow">
          <div className="field">
            <label>Profesión</label>
            <input value={f.profession} onChange={(e) => set('profession', e.target.value)} />
          </div>
          <div className="field">
            <label>Fecha de alta</label>
            <input type="date" value={f.admittedAt} onChange={(e) => set('admittedAt', e.target.value)} />
          </div>
        </div>
        <div className="erow">
          <div className="field">
            <label>Estado</label>
            <select value={f.status} onChange={(e) => set('status', e.target.value)}>
              {PATIENT_STATUS.map((s) => (
                <option key={s} value={s}>
                  {statusLabel[s]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Profesional responsable</label>
            <input value={f.professional} onChange={(e) => set('professional', e.target.value)} />
          </div>
        </div>
        <div className="erow">
          <div className="field">
            <label>Última consulta</label>
            <input type="date" value={f.lastConsult || ''} onChange={(e) => set('lastConsult', e.target.value)} />
          </div>
          <div className="field">
            <label>Próxima revisión</label>
            <input type="date" value={f.nextReview || ''} onChange={(e) => set('nextReview', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Observaciones generales</label>
          <textarea rows="3" value={f.observations} onChange={(e) => set('observations', e.target.value)} />
        </div>
        <div className="eform__actions">
          <Button icon="check" type="submit">
            {editing ? 'Guardar cambios' : 'Crear paciente'}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}
