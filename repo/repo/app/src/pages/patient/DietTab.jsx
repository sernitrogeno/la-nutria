import { useState } from 'react';
import { Icon } from '../../components/Icon.jsx';
import { Button, SlideOver, TextField, TextArea, SelectField } from '../../components/ui.jsx';
import { newWeeklyDiet, newMeal, newMealFood, uid, MEAL_SLOTS, WEEK_DAYS } from '../../store/schema.js';

/* Tokens de alergias/intolerancias del paciente para detectar conflictos. */
function allergenTokens(patient) {
  const raw = `${patient.assessment?.allergies || ''},${patient.assessment?.intolerances || ''},${patient.assessment?.avoidFoods || ''}`;
  return raw
    .split(/[,;\n]/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 2);
}

function mealConflicts(meal, tokens) {
  const hay = [meal.name, ...(meal.foods || []).map((f) => f.name)].join(' ').toLowerCase();
  return tokens.filter((t) => hay.includes(t));
}

function MealForm({ initial, onSave, onDelete, onClose }) {
  const editing = !!initial.name || (initial.foods && initial.foods.length);
  const [m, setM] = useState(() => ({ ...newMeal(initial.slot), ...initial, foods: initial.foods ? [...initial.foods] : [] }));
  const set = (k, v) => setM((s) => ({ ...s, [k]: v }));
  const setFood = (id, k, v) => set('foods', m.foods.map((f) => (f.id === id ? { ...f, [k]: v } : f)));
  const addFood = () => set('foods', [...m.foods, newMealFood()]);
  const delFood = (id) => set('foods', m.foods.filter((f) => f.id !== id));
  const submit = (e) => {
    e.preventDefault();
    onSave(m);
  };
  return (
    <SlideOver eyebrow={editing ? 'Editar comida' : 'Nueva comida'} title={m.slot} onClose={onClose}>
      <form className="eform" onSubmit={submit}>
        <div className="erow">
          <SelectField label="Tipo de comida" options={MEAL_SLOTS} value={m.slot} onChange={(e) => set('slot', e.target.value)} />
          <TextField label="Hora orientativa" type="time" value={m.time} onChange={(e) => set('time', e.target.value)} />
        </div>
        <TextField label="Nombre del plato" value={m.name} onChange={(e) => set('name', e.target.value)} placeholder="Ej. Avena con fruta" />
        <div className="field">
          <label>Alimentos</label>
          <div className="feats-edit">
            {m.foods.map((fd) => (
              <div className="food-row" key={fd.id}>
                <input value={fd.name} placeholder="Alimento" onChange={(e) => setFood(fd.id, 'name', e.target.value)} />
                <input value={fd.qty} placeholder="Cant." onChange={(e) => setFood(fd.id, 'qty', e.target.value)} />
                <input value={fd.unit} placeholder="g" onChange={(e) => setFood(fd.id, 'unit', e.target.value)} />
                <button type="button" className="feat-del" onClick={() => delFood(fd.id)} aria-label="Quitar">
                  <Icon name="x" size={14} />
                </button>
              </div>
            ))}
            <button type="button" className="feat-add" onClick={addFood}>
              <Icon name="plus" size={15} />
              Añadir alimento
            </button>
          </div>
        </div>
        <TextField label="Forma de preparación" value={m.prep} onChange={(e) => set('prep', e.target.value)} />
        <TextArea label="Alternativas / sustituciones" value={m.alternatives} onChange={(e) => set('alternatives', e.target.value)} />
        <TextArea label="Observaciones" value={m.notes} onChange={(e) => set('notes', e.target.value)} />
        <div className="eform__actions">
          {editing && initial.id && (
            <button type="button" className="btn btn--ghost btn--danger" onClick={() => onDelete(initial.id)}>
              Eliminar
            </button>
          )}
          <Button icon="check" type="submit">
            Guardar comida
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}

export function DietTab({ patient, onSave }) {
  const diet = patient.weeklyDiet?.days ? patient.weeklyDiet : newWeeklyDiet();
  const [view, setView] = useState('week');
  const [editor, setEditor] = useState(null); // { dayIdx, meal }
  const [copyMenu, setCopyMenu] = useState(null); // { type:'day'|'meal', dayIdx, mealId }
  const tokens = allergenTokens(patient);

  const commit = (days) => onSave({ weeklyDiet: { ...diet, days, updatedAt: new Date().toISOString() } });

  const saveMeal = (dayIdx, meal) => {
    const days = diet.days.map((d, i) => {
      if (i !== dayIdx) return d;
      const exists = d.meals.some((mm) => mm.id === meal.id);
      return { ...d, meals: exists ? d.meals.map((mm) => (mm.id === meal.id ? meal : mm)) : [...d.meals, meal] };
    });
    commit(days);
    setEditor(null);
  };
  const deleteMeal = (dayIdx, mealId) => {
    commit(diet.days.map((d, i) => (i === dayIdx ? { ...d, meals: d.meals.filter((mm) => mm.id !== mealId) } : d)));
    setEditor(null);
  };

  const copyDayTo = (fromIdx, toIdx) => {
    const src = diet.days[fromIdx].meals.map((mm) => ({ ...mm, id: uid('meal') }));
    commit(diet.days.map((d, i) => (i === toIdx ? { ...d, meals: src } : d)));
    setCopyMenu(null);
  };
  const copyMealTo = (meal, toIdx) => {
    const clone = { ...meal, id: uid('meal') };
    commit(diet.days.map((d, i) => (i === toIdx ? { ...d, meals: [...d.meals, clone] } : d)));
    setCopyMenu(null);
  };
  const clearWeek = () => commit(diet.days.map((d) => ({ ...d, meals: [] })));

  const hasAllergyData = tokens.length > 0;

  return (
    <div className="tabpane">
      <div className="tabpane__head">
        <div>
          <h3>Dieta semanal</h3>
          <p className="field__hint">
            {hasAllergyData ? 'Se avisará si un alimento coincide con alergias o intolerancias del paciente.' : 'Añade alergias en la valoración para activar los avisos automáticos.'}
          </p>
        </div>
        <div className="tabpane__tools">
          <div className="seg">
            {[['week', 'Semana'], ['list', 'Lista']].map(([v, l]) => (
              <button key={v} data-on={view === v ? '1' : '0'} onClick={() => setView(v)}>
                {l}
              </button>
            ))}
          </div>
          <button className="btn btn--ghost btn--danger" onClick={clearWeek}>
            <Icon name="trash" size={15} />
            Vaciar
          </button>
        </div>
      </div>

      <div className={view === 'week' ? 'diet-week' : 'diet-list'}>
        {diet.days.map((day, dayIdx) => (
          <div className="diet-day" key={day.id}>
            <div className="diet-day__head">
              <span className="diet-day__name">{day.day}</span>
              <div className="diet-day__acts">
                <button className="iconbtn" title="Copiar día a…" onClick={() => setCopyMenu({ type: 'day', dayIdx })}>
                  <Icon name="copy" size={15} />
                </button>
                <button className="iconbtn" title="Añadir comida" onClick={() => setEditor({ dayIdx, meal: newMeal() })}>
                  <Icon name="plus" size={15} />
                </button>
              </div>
            </div>
            <div className="diet-day__meals">
              {day.meals.length === 0 && <p className="diet-day__empty">Sin comidas</p>}
              {day.meals.map((meal) => {
                const conflicts = mealConflicts(meal, tokens);
                return (
                  <div className={'meal' + (conflicts.length ? ' meal--warn' : '')} key={meal.id}>
                    <div className="meal__top">
                      <span className="meal__slot">{meal.slot}</span>
                      {meal.time && <span className="meal__time">{meal.time}</span>}
                    </div>
                    <button className="meal__body" onClick={() => setEditor({ dayIdx, meal })}>
                      <span className="meal__name">{meal.name || 'Sin nombre'}</span>
                      {meal.foods?.length > 0 && (
                        <span className="meal__foods">{meal.foods.map((f) => `${f.name}${f.qty ? ` (${f.qty}${f.unit})` : ''}`).join(' · ')}</span>
                      )}
                    </button>
                    {conflicts.length > 0 && (
                      <div className="meal__alert">
                        <Icon name="alert" size={13} />
                        Posible conflicto: {conflicts.join(', ')}
                      </div>
                    )}
                    <div className="meal__acts">
                      <button className="textbtn" onClick={() => setCopyMenu({ type: 'meal', dayIdx, mealId: meal.id })}>
                        <Icon name="copy" size={13} /> Copiar a…
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {editor && (
        <MealForm
          initial={editor.meal}
          onSave={(meal) => saveMeal(editor.dayIdx, meal)}
          onDelete={(id) => deleteMeal(editor.dayIdx, id)}
          onClose={() => setEditor(null)}
        />
      )}

      {copyMenu && (
        <>
          <div className="overlay" style={{ zIndex: 50 }} onClick={() => setCopyMenu(null)} />
          <div className="confirm" role="dialog">
            <h3>{copyMenu.type === 'day' ? 'Copiar día completo a…' : 'Copiar comida a…'}</h3>
            <p>{copyMenu.type === 'day' ? 'Reemplaza las comidas del día destino.' : 'Añade esta comida al día elegido.'}</p>
            <div className="copy-grid">
              {WEEK_DAYS.map((d, i) =>
                i === copyMenu.dayIdx ? null : (
                  <button
                    key={d}
                    className="copy-day"
                    onClick={() => {
                      if (copyMenu.type === 'day') copyDayTo(copyMenu.dayIdx, i);
                      else copyMealTo(diet.days[copyMenu.dayIdx].meals.find((mm) => mm.id === copyMenu.mealId), i);
                    }}
                  >
                    {d}
                  </button>
                )
              )}
            </div>
            <div className="confirm__actions">
              <button className="btn btn--ghost" onClick={() => setCopyMenu(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
