import { useState } from 'react';
import { Icon } from '../../components/Icon.jsx';
import { Button, TextField, TextArea } from '../../components/ui.jsx';
import { newNutritionPlan, newSubstitution, SUBSTITUTION_GROUPS } from '../../store/schema.js';

export function PlanTab({ patient, onSave }) {
  const [f, setF] = useState(() => ({ ...newNutritionPlan(), ...patient.plan }));
  const [saved, setSaved] = useState(false);
  const set = (k, v) => {
    setF((s) => ({ ...s, [k]: v }));
    setSaved(false);
  };
  const setRec = (k, v) => {
    setF((s) => ({ ...s, recommendations: { ...s.recommendations, [k]: v } }));
    setSaved(false);
  };
  const subs = f.substitutions || [];
  const setSub = (id, k, v) => set('substitutions', subs.map((s) => (s.id === id ? { ...s, [k]: v } : s)));
  const addSub = () => set('substitutions', [...subs, newSubstitution()]);
  const delSub = (id) => set('substitutions', subs.filter((s) => s.id !== id));

  const persist = () => {
    onSave({ ...f, updatedAt: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="tabpane">
      <div className="tabpane__head">
        <div>
          <h3>Plan nutricional</h3>
          <p className="field__hint">Los cálculos son orientativos y deben revisarse en consulta. No constituyen un diagnóstico médico.</p>
        </div>
        <Button icon="save" onClick={persist}>
          {saved ? 'Guardado ✓' : 'Guardar plan'}
        </Button>
      </div>

      <section className="card cardpad">
        <h4 className="sec-title">Datos generales</h4>
        <TextField label="Nombre del plan" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Ej. Plan de mantenimiento" />
        <div className="grid3">
          <TextField label="Fecha de inicio" type="date" value={f.start} onChange={(e) => set('start', e.target.value)} />
          <TextField label="Fecha de fin" type="date" value={f.end} onChange={(e) => set('end', e.target.value)} />
          <TextField label="Fecha de revisión" type="date" value={f.review} onChange={(e) => set('review', e.target.value)} />
        </div>
        <TextArea label="Objetivo del plan" value={f.objective} onChange={(e) => set('objective', e.target.value)} />
      </section>

      <section className="card cardpad">
        <h4 className="sec-title">Objetivos nutricionales (orientativos)</h4>
        <div className="grid3">
          <TextField label="Energía diaria (kcal)" type="number" value={f.energy} onChange={(e) => set('energy', e.target.value)} />
          <TextField label="Nº de comidas" type="number" value={f.meals} onChange={(e) => set('meals', e.target.value)} />
          <TextField label="Agua (L)" type="number" value={f.water} onChange={(e) => set('water', e.target.value)} />
          <TextField label="Proteínas (g)" type="number" value={f.protein} onChange={(e) => set('protein', e.target.value)} />
          <TextField label="Hidratos (g)" type="number" value={f.carbs} onChange={(e) => set('carbs', e.target.value)} />
          <TextField label="Grasas (g)" type="number" value={f.fat} onChange={(e) => set('fat', e.target.value)} />
          <TextField label="Fibra (g)" type="number" value={f.fiber} onChange={(e) => set('fiber', e.target.value)} />
        </div>
        <TextArea label="Observaciones generales" value={f.notes} onChange={(e) => set('notes', e.target.value)} />
      </section>

      <section className="card cardpad">
        <h4 className="sec-title">Recomendaciones generales</h4>
        <div className="grid2">
          <TextArea label="Hidratación" value={f.recommendations.hydration} onChange={(e) => setRec('hydration', e.target.value)} />
          <TextArea label="Frutas y verduras" value={f.recommendations.fruitsVeg} onChange={(e) => setRec('fruitsVeg', e.target.value)} />
          <TextArea label="Técnicas de cocinado" value={f.recommendations.cooking} onChange={(e) => setRec('cooking', e.target.value)} />
          <TextArea label="Comer fuera de casa" value={f.recommendations.eatingOut} onChange={(e) => setRec('eatingOut', e.target.value)} />
          <TextArea label="Organización de comidas" value={f.recommendations.organization} onChange={(e) => setRec('organization', e.target.value)} />
          <TextArea label="Suplementación (si procede)" value={f.recommendations.supplements} onChange={(e) => setRec('supplements', e.target.value)} />
        </div>
        <TextArea label="Otras indicaciones" value={f.recommendations.other} onChange={(e) => setRec('other', e.target.value)} />
      </section>

      <section className="card cardpad">
        <div className="sec-head">
          <h4 className="sec-title" style={{ margin: 0 }}>Sustituciones de alimentos</h4>
          <button className="feat-add" onClick={addSub}>
            <Icon name="plus" size={15} />
            Añadir sustitución
          </button>
        </div>
        {subs.length === 0 && <p className="field__hint">Sin equivalencias todavía.</p>}
        {subs.length > 0 && (
          <div className="subs">
            <div className="subs__head">
              <span>Grupo</span>
              <span>Alimento</span>
              <span>Cant.</span>
              <span>Sustituto</span>
              <span>Cant.</span>
              <span />
            </div>
            {subs.map((s) => (
              <div className="subs__row" key={s.id}>
                <select value={s.group} onChange={(e) => setSub(s.id, 'group', e.target.value)}>
                  {SUBSTITUTION_GROUPS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                <input value={s.food} placeholder="Pollo" onChange={(e) => setSub(s.id, 'food', e.target.value)} />
                <input value={s.qty} placeholder="150 g" onChange={(e) => setSub(s.id, 'qty', e.target.value)} />
                <input value={s.sub} placeholder="Pavo" onChange={(e) => setSub(s.id, 'sub', e.target.value)} />
                <input value={s.subQty} placeholder="150 g" onChange={(e) => setSub(s.id, 'subQty', e.target.value)} />
                <button className="feat-del" onClick={() => delSub(s.id)} aria-label="Quitar">
                  <Icon name="x" size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
