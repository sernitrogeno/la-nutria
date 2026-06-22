import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../components/Icon.jsx';
import { Button, TextField, TextArea, SelectField, RangeField, ChipGroup } from '../../components/ui.jsx';
import {
  newAssessment,
  GOAL_OPTIONS,
  MEDICAL_CONDITIONS,
  DIGESTIVE_SYMPTOMS,
  ACTIVITY_LEVELS,
  DIET_TYPES,
  bmi,
  fullName,
} from '../../store/schema.js';
import { ageFrom } from '../../lib/calendar.js';

const STEPS = [
  'Datos personales',
  'Objetivos',
  'Antropometría',
  'Información médica',
  'Alergias y preferencias',
  'Hábitos',
  'Actividad física',
  'Historia dietética',
  'Registro alimentario',
  'Síntomas digestivos',
];

export function AssessmentTab({ patient, onSave }) {
  const [draft, setDraft] = useState(() => ({ ...newAssessment(), ...patient.assessment }));
  const [step, setStep] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const baseline = useRef(JSON.stringify(patient.assessment));

  const set = (k, v) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setDirty(true);
    setSaved(false);
  };
  const setMeas = (k, v) => {
    setDraft((d) => ({ ...d, measurement: { ...d.measurement, [k]: v } }));
    setDirty(true);
    setSaved(false);
  };
  const setRecord = (k, v) => {
    setDraft((d) => ({ ...d, foodRecord: { ...d.foodRecord, [k]: v } }));
    setDirty(true);
    setSaved(false);
  };

  /* Aviso al salir de la pestaña/ventana con cambios sin guardar */
  useEffect(() => {
    const handler = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const persist = () => {
    const completed = Array.from(new Set([...(draft.completedSteps || []), step])).sort((a, b) => a - b);
    const next = { ...draft, completedSteps: completed, updatedAt: new Date().toISOString() };
    setDraft(next);
    onSave(next);
    baseline.current = JSON.stringify(next);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const goStep = (i) => {
    if (i === step) return;
    setStep(i);
  };

  const age = ageFrom(patient.birthDate);
  const computedBmi = bmi(draft.measurement.weight, draft.measurement.height);
  const progress = Math.round(((draft.completedSteps?.length || 0) / STEPS.length) * 100);

  return (
    <div className="assess">
      <div className="assess__bar">
        <div className="assess__progress">
          <div className="assess__progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="assess__progress-txt">{progress}% completado</span>
      </div>

      <div className="assess__layout">
        <nav className="assess__steps">
          {STEPS.map((s, i) => {
            const done = draft.completedSteps?.includes(i);
            return (
              <button key={s} className={'astep' + (step === i ? ' astep--on' : '') + (done ? ' astep--done' : '')} onClick={() => goStep(i)}>
                <span className="astep__num">{done ? <Icon name="check" size={13} /> : i + 1}</span>
                {s}
              </button>
            );
          })}
        </nav>

        <div className="assess__panel">
          <div className="assess__panel-head">
            <h3>
              {step + 1}. {STEPS[step]}
            </h3>
            <span className={'assess__save-state' + (dirty ? ' is-dirty' : '')}>
              {saved ? (
                <>
                  <Icon name="check" size={14} /> Guardado
                </>
              ) : dirty ? (
                'Cambios sin guardar'
              ) : (
                'Al día'
              )}
            </span>
          </div>

          <div className="assess__fields">
            {step === 0 && (
              <div className="recap">
                <p className="field__hint" style={{ marginBottom: 14 }}>
                  Datos personales del paciente. Edítalos desde el botón “Editar” de la cabecera.
                </p>
                <div className="recap__grid">
                  <div>
                    <span>Nombre</span>
                    <b>{fullName(patient) || '—'}</b>
                  </div>
                  <div>
                    <span>Edad</span>
                    <b>{age != null ? `${age} años` : '—'}</b>
                  </div>
                  <div>
                    <span>Teléfono</span>
                    <b>{patient.phone || '—'}</b>
                  </div>
                  <div>
                    <span>Correo</span>
                    <b>{patient.email || '—'}</b>
                  </div>
                  <div>
                    <span>Profesión</span>
                    <b>{patient.profession || '—'}</b>
                  </div>
                  <div>
                    <span>Alta</span>
                    <b>{patient.admittedAt || '—'}</b>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <>
                <label className="flabel">Objetivos (uno o varios)</label>
                <ChipGroup options={GOAL_OPTIONS} value={draft.goals} onChange={(v) => set('goals', v)} />
                <TextArea label="Descripción del objetivo" value={draft.goalDescription} onChange={(e) => set('goalDescription', e.target.value)} />
                <RangeField label="Nivel de motivación" value={draft.motivation} onChange={(v) => set('motivation', v)} />
                <TextField label="Fecha orientativa para alcanzarlo" type="date" value={draft.targetDate} onChange={(e) => set('targetDate', e.target.value)} />
                <TextArea label="Observaciones" value={draft.goalNotes} onChange={(e) => set('goalNotes', e.target.value)} />
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid2">
                  <TextField label="Peso actual (kg)" type="number" value={draft.measurement.weight} onChange={(e) => setMeas('weight', e.target.value)} />
                  <TextField label="Altura (cm)" type="number" value={draft.measurement.height} onChange={(e) => setMeas('height', e.target.value)} />
                </div>
                <div className="imc-box">
                  IMC calculado: <b>{computedBmi ?? '—'}</b>
                  <span className="field__hint"> · Valor orientativo, no es un diagnóstico médico.</span>
                </div>
                <div className="grid2">
                  <TextField label="Peso habitual (kg)" type="number" value={draft.measurement.usualWeight} onChange={(e) => setMeas('usualWeight', e.target.value)} />
                  <TextField label="Peso objetivo (kg)" type="number" value={draft.measurement.targetWeight} onChange={(e) => setMeas('targetWeight', e.target.value)} />
                  <TextField label="Perímetro cintura (cm)" type="number" value={draft.measurement.waist} onChange={(e) => setMeas('waist', e.target.value)} />
                  <TextField label="Perímetro cadera (cm)" type="number" value={draft.measurement.hip} onChange={(e) => setMeas('hip', e.target.value)} />
                  <TextField label="% Grasa corporal" type="number" value={draft.measurement.fatPct} onChange={(e) => setMeas('fatPct', e.target.value)} />
                  <TextField label="% Masa muscular" type="number" value={draft.measurement.musclePct} onChange={(e) => setMeas('musclePct', e.target.value)} />
                </div>
                <TextArea label="Observaciones sobre la evolución del peso" value={draft.measurement.notes} onChange={(e) => setMeas('notes', e.target.value)} />
              </>
            )}

            {step === 3 && (
              <>
                <label className="flabel">Condiciones médicas</label>
                <ChipGroup options={[...MEDICAL_CONDITIONS, 'Ninguna']} value={draft.conditions} onChange={(v) => set('conditions', v)} />
                <TextArea label="Diagnósticos" value={draft.diagnoses} onChange={(e) => set('diagnoses', e.target.value)} />
                <TextArea label="Intervenciones quirúrgicas relevantes" value={draft.surgeries} onChange={(e) => set('surgeries', e.target.value)} />
                <TextArea label="Antecedentes familiares" value={draft.familyHistory} onChange={(e) => set('familyHistory', e.target.value)} />
                <div className="grid2">
                  <TextArea label="Medicación habitual" value={draft.medication} onChange={(e) => set('medication', e.target.value)} />
                  <TextArea label="Suplementos" value={draft.supplements} onChange={(e) => set('supplements', e.target.value)} />
                </div>
                <TextArea label="Analíticas recientes" value={draft.labs} onChange={(e) => set('labs', e.target.value)} />
                <TextArea label="Observaciones médicas" value={draft.medicalNotes} onChange={(e) => set('medicalNotes', e.target.value)} />
              </>
            )}

            {step === 4 && (
              <>
                <div className="grid2">
                  <TextArea label="Alergias alimentarias" hint="Aparecerán como aviso al crear dietas" value={draft.allergies} onChange={(e) => set('allergies', e.target.value)} />
                  <TextArea label="Intolerancias" hint="Aparecerán como aviso al crear dietas" value={draft.intolerances} onChange={(e) => set('intolerances', e.target.value)} />
                  <TextArea label="Alimentos que debe evitar" value={draft.avoidFoods} onChange={(e) => set('avoidFoods', e.target.value)} />
                  <TextArea label="Alimentos que no le gustan" value={draft.dislikedFoods} onChange={(e) => set('dislikedFoods', e.target.value)} />
                </div>
                <TextArea label="Alimentos preferidos" value={draft.preferredFoods} onChange={(e) => set('preferredFoods', e.target.value)} />
                <SelectField label="Tipo de alimentación" options={DIET_TYPES} value={draft.dietType} onChange={(e) => set('dietType', e.target.value)} />
              </>
            )}

            {step === 5 && (
              <>
                <div className="grid2">
                  <TextField label="Horario de trabajo o estudio" value={draft.workSchedule} onChange={(e) => set('workSchedule', e.target.value)} />
                  <TextField label="Hora de levantarse" type="time" value={draft.wakeTime} onChange={(e) => set('wakeTime', e.target.value)} />
                  <TextField label="Hora de acostarse" type="time" value={draft.sleepTime} onChange={(e) => set('sleepTime', e.target.value)} />
                  <TextField label="Horas de sueño" type="number" value={draft.sleepHours} onChange={(e) => set('sleepHours', e.target.value)} />
                </div>
                <div className="grid2">
                  <RangeField label="Calidad del sueño" value={draft.sleepQuality} onChange={(v) => set('sleepQuality', v)} />
                  <RangeField label="Nivel de estrés" value={draft.stress} onChange={(v) => set('stress', v)} />
                </div>
                <div className="grid2">
                  <SelectField label="Consumo de tabaco" options={['No', 'Ocasional', 'Sí']} value={draft.tobacco} onChange={(e) => set('tobacco', e.target.value)} />
                  <SelectField label="Consumo de alcohol" options={['No', 'Ocasional', 'Habitual']} value={draft.alcohol} onChange={(e) => set('alcohol', e.target.value)} />
                </div>
                <TextField label="Agua diaria (L)" type="number" value={draft.water} onChange={(e) => set('water', e.target.value)} />
                <TextArea label="Observaciones" value={draft.habitsNotes} onChange={(e) => set('habitsNotes', e.target.value)} />
              </>
            )}

            {step === 6 && (
              <>
                <SelectField label="Nivel de actividad" options={ACTIVITY_LEVELS} value={draft.activityLevel} onChange={(e) => set('activityLevel', e.target.value)} />
                <div className="grid2">
                  <TextField label="Tipo de ejercicio" value={draft.exerciseType} onChange={(e) => set('exerciseType', e.target.value)} />
                  <TextField label="Días de entrenamiento / semana" type="number" value={draft.trainingDays} onChange={(e) => set('trainingDays', e.target.value)} />
                  <TextField label="Duración (min)" type="number" value={draft.trainingDuration} onChange={(e) => set('trainingDuration', e.target.value)} />
                  <TextField label="Horario de entrenamiento" value={draft.trainingTime} onChange={(e) => set('trainingTime', e.target.value)} />
                </div>
                <TextField label="Objetivo deportivo" value={draft.sportGoal} onChange={(e) => set('sportGoal', e.target.value)} />
                <TextArea label="Lesiones o limitaciones físicas" value={draft.injuries} onChange={(e) => set('injuries', e.target.value)} />
                <TextArea label="Observaciones" value={draft.activityNotes} onChange={(e) => set('activityNotes', e.target.value)} />
              </>
            )}

            {step === 7 && (
              <>
                <div className="grid2">
                  <TextField label="Comidas al día" type="number" value={draft.mealsPerDay} onChange={(e) => set('mealsPerDay', e.target.value)} />
                  <TextField label="Quién cocina habitualmente" value={draft.whoCooks} onChange={(e) => set('whoCooks', e.target.value)} />
                  <TextField label="¿Come en casa o fuera?" value={draft.eatsOut} onChange={(e) => set('eatsOut', e.target.value)} />
                  <TextField label="Tiempo para cocinar" value={draft.cookingTime} onChange={(e) => set('cookingTime', e.target.value)} />
                </div>
                <TextField label="Presupuesto aproximado" value={draft.budget} onChange={(e) => set('budget', e.target.value)} />
                <div className="grid2">
                  <TextArea label="Dietas realizadas anteriormente" value={draft.pastDiets} onChange={(e) => set('pastDiets', e.target.value)} />
                  <TextArea label="Resultados obtenidos" value={draft.pastResults} onChange={(e) => set('pastResults', e.target.value)} />
                </div>
                <SelectField label="¿Efecto rebote?" options={['No', 'Sí', 'A veces']} value={draft.rebound} onChange={(e) => set('rebound', e.target.value)} />
                <div className="grid2">
                  <TextArea label="Relación con la comida" value={draft.foodRelationship} onChange={(e) => set('foodRelationship', e.target.value)} />
                  <TextArea label="Ansiedad por comer" value={draft.eatingAnxiety} onChange={(e) => set('eatingAnxiety', e.target.value)} />
                  <TextArea label="Comer por aburrimiento" value={draft.boredomEating} onChange={(e) => set('boredomEating', e.target.value)} />
                  <TextArea label="Miedo o rechazo a alimentos" value={draft.foodFears} onChange={(e) => set('foodFears', e.target.value)} />
                </div>
                <SelectField label="Episodios de atracones" options={['No', 'Ocasional', 'Frecuente']} value={draft.bingeing} onChange={(e) => set('bingeing', e.target.value)} />
                <TextArea label="Observaciones profesionales" value={draft.dietaryNotes} onChange={(e) => set('dietaryNotes', e.target.value)} />
              </>
            )}

            {step === 8 && (
              <>
                <p className="field__hint" style={{ marginBottom: 12 }}>Describe un día habitual de comidas (incluye horario, alimentos y cantidades).</p>
                <TextArea label="Desayuno" value={draft.foodRecord.breakfast} onChange={(e) => setRecord('breakfast', e.target.value)} />
                <TextArea label="Media mañana" value={draft.foodRecord.midMorning} onChange={(e) => setRecord('midMorning', e.target.value)} />
                <TextArea label="Comida" value={draft.foodRecord.lunch} onChange={(e) => setRecord('lunch', e.target.value)} />
                <TextArea label="Merienda" value={draft.foodRecord.snack} onChange={(e) => setRecord('snack', e.target.value)} />
                <TextArea label="Cena" value={draft.foodRecord.dinner} onChange={(e) => setRecord('dinner', e.target.value)} />
                <TextArea label="Entre horas" value={draft.foodRecord.between} onChange={(e) => setRecord('between', e.target.value)} />
                <TextArea label="Bebidas" value={draft.foodRecord.drinks} onChange={(e) => setRecord('drinks', e.target.value)} />
                <TextArea label="Diferencias el fin de semana" value={draft.foodRecord.weekendDiff} onChange={(e) => setRecord('weekendDiff', e.target.value)} />
              </>
            )}

            {step === 9 && (
              <>
                <label className="flabel">Síntomas digestivos</label>
                <ChipGroup options={DIGESTIVE_SYMPTOMS} value={draft.digestive} onChange={(v) => set('digestive', v)} />
                <div className="grid2">
                  <TextField label="Frecuencia de deposiciones" value={draft.stoolFrequency} onChange={(e) => set('stoolFrequency', e.target.value)} />
                  <SelectField label="Escala de Bristol (opcional)" options={['', '1', '2', '3', '4', '5', '6', '7']} value={draft.bristol} onChange={(e) => set('bristol', e.target.value)} />
                </div>
                <TextArea label="Observaciones digestivas" value={draft.digestiveNotes} onChange={(e) => set('digestiveNotes', e.target.value)} />
              </>
            )}
          </div>

          <div className="assess__nav">
            <button className="btn btn--ghost" disabled={step === 0} onClick={() => goStep(step - 1)}>
              <Icon name="chevron" size={16} style={{ transform: 'rotate(180deg)' }} />
              Anterior
            </button>
            <Button icon="save" variant="ghost" onClick={persist}>
              Guardar
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                icon="arrow"
                onClick={() => {
                  persist();
                  goStep(step + 1);
                }}
              >
                Guardar y seguir
              </Button>
            ) : (
              <Button icon="check" onClick={persist}>
                Finalizar valoración
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
