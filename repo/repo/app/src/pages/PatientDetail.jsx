import { useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Badge } from '../components/ui.jsx';
import { PatientForm } from './patient/PatientForm.jsx';
import { AssessmentTab } from './patient/AssessmentTab.jsx';
import { PlanTab } from './patient/PlanTab.jsx';
import { DietTab } from './patient/DietTab.jsx';
import { FollowUpTab } from './patient/FollowUpTab.jsx';
import { NotesTab } from './patient/NotesTab.jsx';
import { ExportView } from './patient/ExportView.jsx';
import { usePatient } from '../store/StoreContext.jsx';
import { fullName, initials, statusLabel } from '../store/schema.js';
import { ageFrom } from '../lib/calendar.js';

const TABS = [
  { id: 'summary', label: 'Resumen', icon: 'patient' },
  { id: 'assessment', label: 'Valoración', icon: 'clipboard' },
  { id: 'plan', label: 'Plan', icon: 'leaf' },
  { id: 'diet', label: 'Dieta semanal', icon: 'grid' },
  { id: 'followup', label: 'Seguimiento', icon: 'pulse' },
  { id: 'notes', label: 'Notas', icon: 'note' },
  { id: 'export', label: 'Exportar', icon: 'print' },
];

const STATUS_TONE = { active: 'ok', pending: 'accent', inactive: 'warn' };
const num = (v) => (v === '' || v == null ? null : parseFloat(v));

function summaryOf(patient) {
  const ms = [...(patient.measurements || [])].sort((a, b) => a.date.localeCompare(b.date));
  const first = ms[0];
  const last = ms[ms.length - 1];
  const weight = last ? num(last.weight) : num(patient.assessment?.measurement?.weight);
  let change = null;
  if (first && last && num(first.weight) != null && num(last.weight) != null) change = +(num(last.weight) - num(first.weight)).toFixed(1);
  const fus = [...(patient.followUps || [])].sort((a, b) => b.date.localeCompare(a.date));
  const adherence = fus[0]?.adherence != null ? `${fus[0].adherence}/10` : '—';
  const conditions = (patient.assessment?.conditions || []).filter((c) => c && c !== 'Ninguna');
  const alerts = [...conditions];
  if (patient.assessment?.allergies?.trim()) alerts.push(`Alergia: ${patient.assessment.allergies.trim()}`);
  if (patient.assessment?.intolerances?.trim()) alerts.push(`Intolerancia: ${patient.assessment.intolerances.trim()}`);
  return { weight, change, adherence, alerts };
}

export function PatientDetail({ patientId, onBack }) {
  const { patient, update } = usePatient(patientId);
  const [tab, setTab] = useState('summary');
  const [editing, setEditing] = useState(false);

  if (!patient) {
    return (
      <div>
        <button className="backlink" onClick={onBack}>
          <Icon name="chevron" size={16} style={{ transform: 'rotate(180deg)' }} /> Volver a pacientes
        </button>
        <p className="empty">Este paciente ya no está disponible.</p>
      </div>
    );
  }

  const age = ageFrom(patient.birthDate);
  const { weight, change, adherence, alerts } = summaryOf(patient);
  const objective = patient.assessment?.goals?.[0] || '—';

  return (
    <div className="pdetail">
      <button className="backlink no-print" onClick={onBack}>
        <Icon name="chevron" size={16} style={{ transform: 'rotate(180deg)' }} /> Pacientes
      </button>

      <header className="pdetail__head no-print">
        <div className="pdetail__id">
          <div className="pdetail__avatar">{initials(fullName(patient))}</div>
          <div>
            <h1>{fullName(patient)}</h1>
            <div className="pdetail__tags">
              <Badge tone={STATUS_TONE[patient.status]} dot>
                {statusLabel[patient.status]}
              </Badge>
              <span className="pdetail__sub">
                {age != null ? `${age} años` : 'Edad —'} · {objective}
              </span>
            </div>
          </div>
        </div>
        <button className="btn btn--ghost" onClick={() => setEditing(true)}>
          <Icon name="pencil" size={16} />
          Editar
        </button>
      </header>

      {alerts.length > 0 && (
        <div className="alert-banner no-print">
          <Icon name="alert" size={18} />
          <div>
            <b>Alertas a tener en cuenta</b>
            <div className="alert-banner__tags">
              {alerts.map((a, i) => (
                <span key={i} className="badge badge--warn">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="pdetail__summary no-print">
        <div className="mini-stat">
          <span>Peso actual</span>
          <b>{weight != null ? `${weight} kg` : '—'}</b>
        </div>
        <div className="mini-stat">
          <span>Cambio de peso</span>
          <b className={change != null && change <= 0 ? 'is-down' : 'is-up'}>{change != null ? `${change > 0 ? '+' : ''}${change} kg` : '—'}</b>
        </div>
        <div className="mini-stat">
          <span>Adherencia</span>
          <b>{adherence}</b>
        </div>
        <div className="mini-stat">
          <span>Próxima revisión</span>
          <b>{patient.nextReview || '—'}</b>
        </div>
      </div>

      <nav className="ptabs no-print">
        {TABS.map((t) => (
          <button key={t.id} className={'ptab' + (tab === t.id ? ' ptab--on' : '')} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} size={16} />
            {t.label}
          </button>
        ))}
      </nav>

      <div className="pdetail__body">
        {tab === 'summary' && <SummaryTab patient={patient} age={age} onGo={setTab} />}
        {tab === 'assessment' && <AssessmentTab patient={patient} onSave={(assessment) => update({ assessment })} />}
        {tab === 'plan' && <PlanTab patient={patient} onSave={(plan) => update({ plan })} />}
        {tab === 'diet' && <DietTab patient={patient} onSave={update} />}
        {tab === 'followup' && <FollowUpTab patient={patient} onSave={update} />}
        {tab === 'notes' && <NotesTab patient={patient} onSave={update} />}
        {tab === 'export' && <ExportView patient={patient} />}
      </div>

      {editing && (
        <PatientForm
          initial={patient}
          onSave={(p) => {
            update(p);
            setEditing(false);
          }}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}

function SummaryTab({ patient, age, onGo }) {
  const a = patient.assessment || {};
  const steps = a.completedSteps?.length || 0;
  const fields = [
    ['Teléfono', patient.phone],
    ['Correo', patient.email],
    ['Profesión', patient.profession],
    ['Alta', patient.admittedAt],
    ['Última consulta', patient.lastConsult],
    ['Tipo de dieta', a.dietType],
  ];
  return (
    <div className="tabpane">
      <div className="summary-cards">
        <div className="card cardpad">
          <h4 className="sec-title">Datos del paciente</h4>
          <div className="kv">
            <div className="kv__row">
              <span>Edad</span>
              <b>{age != null ? `${age} años` : '—'}</b>
            </div>
            {fields.map(([k, v]) => (
              <div className="kv__row" key={k}>
                <span>{k}</span>
                <b>{v || '—'}</b>
              </div>
            ))}
          </div>
          {patient.observations && <p className="summary-obs">{patient.observations}</p>}
        </div>

        <div className="card cardpad">
          <h4 className="sec-title">Estado clínico</h4>
          <div className="kv">
            <div className="kv__row">
              <span>Valoración inicial</span>
              <b>{steps}/10 pasos</b>
            </div>
            <div className="kv__row">
              <span>Objetivos</span>
              <b>{a.goals?.length ? a.goals.join(', ') : '—'}</b>
            </div>
            <div className="kv__row">
              <span>Plan activo</span>
              <b>{patient.plan?.name || 'Sin plan'}</b>
            </div>
            <div className="kv__row">
              <span>Mediciones</span>
              <b>{patient.measurements?.length || 0}</b>
            </div>
            <div className="kv__row">
              <span>Revisiones</span>
              <b>{patient.followUps?.length || 0}</b>
            </div>
          </div>
          <div className="summary-actions">
            <button className="btn btn--ghost" onClick={() => onGo('assessment')}>
              <Icon name="clipboard" size={15} /> Continuar valoración
            </button>
            <button className="btn btn--ghost" onClick={() => onGo('diet')}>
              <Icon name="grid" size={15} /> Editar dieta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
