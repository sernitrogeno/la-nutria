import { Button } from '../../components/ui.jsx';
import { Icon } from '../../components/Icon.jsx';
import { fullName, getCurrentUserName } from '../../store/schema.js';
import { ageFrom } from '../../lib/calendar.js';
import otter from '../../assets/otter.png';

/* Documento imprimible / exportable a PDF (vía imprimir → guardar como PDF).
   NO incluye notas privadas ni información médica sensible. */
export function ExportView({ patient }) {
  const plan = patient.plan || {};
  const diet = patient.weeklyDiet?.days || [];
  const subs = plan.substitutions || [];
  const rec = plan.recommendations || {};
  const age = ageFrom(patient.birthDate);
  const today = new Date().toLocaleDateString('es-ES');

  return (
    <div className="tabpane">
      <div className="tabpane__head no-print">
        <div>
          <h3>Exportar plan</h3>
          <p className="field__hint">Vista para el paciente. Las notas privadas y la información médica sensible quedan excluidas.</p>
        </div>
        <Button icon="print" onClick={() => window.print()}>
          Imprimir / Guardar PDF
        </Button>
      </div>

      <div className="doc" id="export-doc">
        <header className="doc__head">
          <div className="doc__brand">
            <img src={otter} alt="" className="doc__logo" />
            <div>
              <h2 className="doc__title">LaNutria</h2>
              <span className="doc__sub">Plan nutricional personalizado</span>
            </div>
          </div>
          <div className="doc__meta">
            <span>Profesional: {patient.professional || getCurrentUserName()}</span>
            <span>Fecha: {today}</span>
            {plan.review && <span>Revisión: {plan.review}</span>}
          </div>
        </header>

        <section className="doc__sec">
          <h3>Paciente</h3>
          <div className="doc__grid">
            <div>
              <span>Nombre</span>
              <b>{fullName(patient)}</b>
            </div>
            <div>
              <span>Edad</span>
              <b>{age != null ? `${age} años` : '—'}</b>
            </div>
            <div>
              <span>Objetivo</span>
              <b>{plan.objective || patient.assessment?.goals?.[0] || '—'}</b>
            </div>
          </div>
        </section>

        {(plan.energy || plan.protein) && (
          <section className="doc__sec">
            <h3>Objetivos del plan (orientativos)</h3>
            <div className="doc__macros">
              {plan.energy && <span><b>{plan.energy}</b> kcal</span>}
              {plan.protein && <span><b>{plan.protein}</b> g proteína</span>}
              {plan.carbs && <span><b>{plan.carbs}</b> g hidratos</span>}
              {plan.fat && <span><b>{plan.fat}</b> g grasa</span>}
              {plan.water && <span><b>{plan.water}</b> L agua</span>}
            </div>
          </section>
        )}

        <section className="doc__sec">
          <h3>Dieta semanal</h3>
          {diet.every((d) => d.meals.length === 0) && <p className="field__hint">Aún no se ha definido la dieta semanal.</p>}
          {diet.map((day) =>
            day.meals.length === 0 ? null : (
              <div className="doc__day" key={day.id}>
                <h4>{day.day}</h4>
                {day.meals.map((m) => (
                  <div className="doc__meal" key={m.id}>
                    <span className="doc__meal-slot">
                      {m.slot}
                      {m.time ? ` · ${m.time}` : ''}
                    </span>
                    <span className="doc__meal-name">{m.name}</span>
                    {m.foods?.length > 0 && <span className="doc__meal-foods">{m.foods.map((f) => `${f.name}${f.qty ? ` (${f.qty}${f.unit})` : ''}`).join(', ')}</span>}
                    {m.alternatives && <span className="doc__meal-alt">Alternativa: {m.alternatives}</span>}
                  </div>
                ))}
              </div>
            )
          )}
        </section>

        {subs.length > 0 && (
          <section className="doc__sec">
            <h3>Sustituciones</h3>
            <table className="doc__table">
              <thead>
                <tr>
                  <th>Grupo</th>
                  <th>Alimento</th>
                  <th>Cantidad</th>
                  <th>Sustituto</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id}>
                    <td>{s.group}</td>
                    <td>{s.food}</td>
                    <td>{s.qty}</td>
                    <td>{s.sub}</td>
                    <td>{s.subQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {Object.values(rec).some(Boolean) && (
          <section className="doc__sec">
            <h3>Recomendaciones</h3>
            <ul className="doc__recs">
              {rec.hydration && <li>{rec.hydration}</li>}
              {rec.fruitsVeg && <li>{rec.fruitsVeg}</li>}
              {rec.cooking && <li>{rec.cooking}</li>}
              {rec.eatingOut && <li>{rec.eatingOut}</li>}
              {rec.organization && <li>{rec.organization}</li>}
              {rec.supplements && <li>{rec.supplements}</li>}
              {rec.other && <li>{rec.other}</li>}
            </ul>
          </section>
        )}

        <footer className="doc__foot">
          <Icon name="leaf" size={14} /> Documento orientativo generado con LaNutria · Revísalo siempre con tu profesional.
        </footer>
      </div>
    </div>
  );
}
