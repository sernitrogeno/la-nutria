import { useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Button, Badge, ConfirmDialog, EmptyState } from '../components/ui.jsx';
import { PatientForm } from './patient/PatientForm.jsx';
import { useStore } from '../store/StoreContext.jsx';
import { newPatient, fullName, initials, statusLabel } from '../store/schema.js';
import { ageFrom, parse, dayMonth } from '../lib/calendar.js';

const STATUS_TONE = { active: 'ok', pending: 'accent', inactive: 'warn' };

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return dayMonth(parse(iso));
  } catch {
    return iso;
  }
}

function objectiveOf(p) {
  return p.assessment?.goals?.[0] || '—';
}

export function Patients({ onOpenPatient }) {
  const { livePatients, addPatient, updatePatient, archivePatient, deletePatient } = useStore();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState(null); // { patient, isNew } | null
  const [confirm, setConfirm] = useState(null); // {kind, patient}

  const term = q.trim().toLowerCase();
  const list = livePatients.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (!term) return true;
    return [fullName(p), p.phone, p.email].some((v) => (v || '').toLowerCase().includes(term));
  });

  const save = (p) => {
    if (livePatients.some((x) => x.id === p.id)) updatePatient(p);
    else addPatient(p);
    setForm(null);
  };

  const doConfirm = () => {
    if (confirm.kind === 'archive') archivePatient(confirm.patient.id);
    else deletePatient(confirm.patient.id);
    setConfirm(null);
  };

  return (
    <div>
      <header className="phead phead--row">
        <div>
          <h1>Pacientes</h1>
          <p className="phead__sub">Tu cartera de pacientes.</p>
        </div>
        <Button icon="plus" onClick={() => setForm({ patient: newPatient(), isNew: true })}>
          Nuevo paciente
        </Button>
      </header>

      <div className="toolbar">
        <div className="search">
          <Icon name="search" />
          <input placeholder="Buscar por nombre, teléfono o correo…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="seg">
          {[
            ['all', 'Todos'],
            ['active', 'Activos'],
            ['pending', 'Pendientes'],
            ['inactive', 'Inactivos'],
          ].map(([v, l]) => (
            <button key={v} data-on={filter === v ? '1' : '0'} onClick={() => setFilter(v)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon="patient"
          title="No hay pacientes que mostrar"
          message={term || filter !== 'all' ? 'Prueba a cambiar la búsqueda o el filtro.' : 'Crea tu primer paciente para empezar.'}
          action={
            <Button icon="plus" onClick={() => setForm({ patient: newPatient(), isNew: true })}>
              Nuevo paciente
            </Button>
          }
        />
      ) : (
        <div className="ptable">
          <div className="ptable__head">
            <span>Paciente</span>
            <span>Objetivo</span>
            <span>Última</span>
            <span>Próxima</span>
            <span>Estado</span>
            <span />
          </div>
          {list.map((p) => {
            const age = ageFrom(p.birthDate);
            const allergy = p.assessment?.allergies?.trim();
            return (
              <div className="prow" key={p.id} onClick={() => onOpenPatient(p.id)} role="button" tabIndex={0}>
                <div className="prow__id">
                  <div className="ccard__avatar">{initials(fullName(p))}</div>
                  <div className="prow__name">
                    <b>{fullName(p)}</b>
                    <span>
                      {age != null ? `${age} años` : 'Edad —'} · {p.phone || 'Sin teléfono'}
                      {allergy && (
                        <span className="prow__allergy">
                          <Icon name="alert" size={12} /> {allergy}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <span className="prow__goal">{objectiveOf(p)}</span>
                <span className="prow__date">{fmtDate(p.lastConsult)}</span>
                <span className="prow__date">{fmtDate(p.nextReview)}</span>
                <span>
                  <Badge tone={STATUS_TONE[p.status]} dot>
                    {statusLabel[p.status]}
                  </Badge>
                </span>
                <div className="prow__actions" onClick={(e) => e.stopPropagation()}>
                  <button className="iconbtn" title="Editar" onClick={() => setForm({ patient: p, isNew: false })}>
                    <Icon name="pencil" size={16} />
                  </button>
                  <button className="iconbtn" title="Archivar" onClick={() => setConfirm({ kind: 'archive', patient: p })}>
                    <Icon name="archive" size={16} />
                  </button>
                  <button className="iconbtn iconbtn--danger" title="Eliminar" onClick={() => setConfirm({ kind: 'delete', patient: p })}>
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {form && <PatientForm initial={form.patient} isNew={form.isNew} onSave={save} onClose={() => setForm(null)} />}

      {confirm && (
        <ConfirmDialog
          title={confirm.kind === 'archive' ? '¿Archivar paciente?' : '¿Eliminar paciente?'}
          message={
            confirm.kind === 'archive'
              ? `${fullName(confirm.patient)} pasará a estado inactivo. Podrás reactivarlo cuando quieras.`
              : `Se eliminará ${fullName(confirm.patient)} de tu lista (borrado lógico, recuperable a nivel de datos). Esta acción afecta a toda su ficha clínica.`
          }
          confirmLabel={confirm.kind === 'archive' ? 'Archivar' : 'Eliminar'}
          tone={confirm.kind === 'archive' ? 'default' : 'danger'}
          onConfirm={doConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
