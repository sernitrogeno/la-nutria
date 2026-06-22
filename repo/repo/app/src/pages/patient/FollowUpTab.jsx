import { useState } from 'react';
import { Icon } from '../../components/Icon.jsx';
import { Button, SlideOver, TextField, TextArea, RangeField, ChipGroup, EmptyState } from '../../components/ui.jsx';
import { LineChart } from '../../components/Chart.jsx';
import { newMeasurement, newFollowUp, bmi, DIGESTIVE_SYMPTOMS } from '../../store/schema.js';

const num = (v) => (v === '' || v == null ? null : parseFloat(v));

function MeasurementForm({ onSave, onClose }) {
  const [m, setM] = useState(newMeasurement);
  const set = (k, v) => setM((s) => ({ ...s, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    onSave(m);
  };
  return (
    <SlideOver eyebrow="Nueva medición" title="Registrar medidas" onClose={onClose}>
      <form className="eform" onSubmit={submit}>
        <TextField label="Fecha" type="date" value={m.date} onChange={(e) => set('date', e.target.value)} />
        <div className="grid2">
          <TextField label="Peso (kg)" type="number" value={m.weight} onChange={(e) => set('weight', e.target.value)} />
          <TextField label="Altura (cm)" type="number" value={m.height} onChange={(e) => set('height', e.target.value)} />
          <TextField label="Cintura (cm)" type="number" value={m.waist} onChange={(e) => set('waist', e.target.value)} />
          <TextField label="Cadera (cm)" type="number" value={m.hip} onChange={(e) => set('hip', e.target.value)} />
          <TextField label="% Grasa" type="number" value={m.fatPct} onChange={(e) => set('fatPct', e.target.value)} />
          <TextField label="% Músculo" type="number" value={m.musclePct} onChange={(e) => set('musclePct', e.target.value)} />
        </div>
        <TextArea label="Observaciones" value={m.notes} onChange={(e) => set('notes', e.target.value)} />
        <div className="eform__actions">
          <Button icon="check" type="submit">
            Guardar medición
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}

function FollowUpForm({ onSave, onClose }) {
  const [f, setF] = useState(newFollowUp);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    onSave(f);
  };
  return (
    <SlideOver eyebrow="Nueva revisión" title="Registrar seguimiento" onClose={onClose}>
      <form className="eform" onSubmit={submit}>
        <TextField label="Fecha" type="date" value={f.date} onChange={(e) => set('date', e.target.value)} />
        <div className="grid2">
          <TextField label="Peso (kg)" type="number" value={f.weight} onChange={(e) => set('weight', e.target.value)} />
          <TextField label="Cintura (cm)" type="number" value={f.waist} onChange={(e) => set('waist', e.target.value)} />
          <TextField label="Cadera (cm)" type="number" value={f.hip} onChange={(e) => set('hip', e.target.value)} />
          <TextField label="% Grasa" type="number" value={f.fatPct} onChange={(e) => set('fatPct', e.target.value)} />
          <TextField label="% Músculo" type="number" value={f.musclePct} onChange={(e) => set('musclePct', e.target.value)} />
        </div>
        <div className="grid2">
          <RangeField label="Adherencia al plan" value={f.adherence} onChange={(v) => set('adherence', v)} />
          <RangeField label="Nivel de hambre" value={f.hunger} onChange={(v) => set('hunger', v)} />
          <RangeField label="Nivel de energía" value={f.energy} onChange={(v) => set('energy', v)} />
          <RangeField label="Calidad del sueño" value={f.sleep} onChange={(v) => set('sleep', v)} />
          <RangeField label="Nivel de estrés" value={f.stress} onChange={(v) => set('stress', v)} />
        </div>
        <label className="flabel">Síntomas digestivos</label>
        <ChipGroup options={DIGESTIVE_SYMPTOMS} value={f.symptoms} onChange={(v) => set('symptoms', v)} />
        <TextArea label="Qué ha funcionado bien" value={f.wentWell} onChange={(e) => set('wentWell', e.target.value)} />
        <TextArea label="Dificultades" value={f.difficulties} onChange={(e) => set('difficulties', e.target.value)} />
        <TextField label="Comidas más difíciles de cumplir" value={f.hardMeals} onChange={(e) => set('hardMeals', e.target.value)} />
        <TextArea label="Cambios realizados" value={f.changes} onChange={(e) => set('changes', e.target.value)} />
        <TextField label="Objetivo hasta la próxima consulta" value={f.nextGoal} onChange={(e) => set('nextGoal', e.target.value)} />
        <TextField label="Fecha de próxima revisión" type="date" value={f.nextReview} onChange={(e) => set('nextReview', e.target.value)} />
        <div className="eform__actions">
          <Button icon="check" type="submit">
            Guardar revisión
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}

export function FollowUpTab({ patient, onSave }) {
  const [form, setForm] = useState(null); // 'meas' | 'fu' | null
  const measurements = [...(patient.measurements || [])].sort((a, b) => a.date.localeCompare(b.date));
  const followUps = [...(patient.followUps || [])].sort((a, b) => b.date.localeCompare(a.date));

  const series = (key, fn) => measurements.map((m) => ({ label: m.date, value: fn ? fn(m) : num(m[key]) })).filter((p) => p.value != null);

  const addMeasurement = (m) => {
    onSave({ measurements: [...(patient.measurements || []), m] });
    setForm(null);
  };
  const addFollowUp = (f) => {
    const patch = { followUps: [...(patient.followUps || []), f] };
    if (f.nextReview) patch.nextReview = f.nextReview;
    if (f.weight) patch.lastConsult = f.date;
    onSave(patch);
    setForm(null);
  };

  return (
    <div className="tabpane">
      <div className="tabpane__head">
        <div>
          <h3>Seguimiento y evolución</h3>
          <p className="field__hint">Mediciones y revisiones periódicas del paciente.</p>
        </div>
        <div className="tabpane__tools">
          <Button variant="ghost" icon="scale" onClick={() => setForm('meas')}>
            Nueva medición
          </Button>
          <Button icon="pulse" onClick={() => setForm('fu')}>
            Nueva revisión
          </Button>
        </div>
      </div>

      <div className="charts">
        <LineChart label="Peso" unit=" kg" points={series('weight')} color="var(--primary)" />
        <LineChart label="IMC" points={series(null, (m) => bmi(m.weight, m.height))} color="var(--accent)" />
        <LineChart label="Cintura" unit=" cm" points={series('waist')} color="#bf923a" />
        <LineChart label="% Grasa" unit="%" points={series('fatPct')} color="#a9805a" />
      </div>

      <h4 className="sec-title" style={{ marginTop: 28 }}>Historial de revisiones</h4>
      {followUps.length === 0 ? (
        <EmptyState icon="pulse" title="Sin revisiones todavía" message="Registra la primera revisión para construir la línea temporal." />
      ) : (
        <div className="timeline">
          {followUps.map((f) => (
            <div className="tl-item" key={f.id}>
              <div className="tl-dot" />
              <div className="tl-card card">
                <div className="tl-head">
                  <b>{f.date}</b>
                  <div className="tl-metrics">
                    {f.weight && <span className="badge badge--neutral">{f.weight} kg</span>}
                    <span className="badge badge--accent">Adherencia {f.adherence}/10</span>
                    <span className="badge badge--neutral">Energía {f.energy}/10</span>
                  </div>
                </div>
                {f.wentWell && (
                  <p className="tl-line">
                    <b>Funcionó:</b> {f.wentWell}
                  </p>
                )}
                {f.difficulties && (
                  <p className="tl-line">
                    <b>Dificultades:</b> {f.difficulties}
                  </p>
                )}
                {f.changes && (
                  <p className="tl-line">
                    <b>Cambios:</b> {f.changes}
                  </p>
                )}
                {f.symptoms?.length > 0 && (
                  <div className="tl-symptoms">
                    {f.symptoms.map((s) => (
                      <span key={s} className="badge badge--warn">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {f.nextGoal && (
                  <p className="tl-line tl-next">
                    <Icon name="target" size={14} /> {f.nextGoal}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {form === 'meas' && <MeasurementForm onSave={addMeasurement} onClose={() => setForm(null)} />}
      {form === 'fu' && <FollowUpForm onSave={addFollowUp} onClose={() => setForm(null)} />}
    </div>
  );
}
