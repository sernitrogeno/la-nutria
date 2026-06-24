/* Web pública de captación · Nutrición online.
 *
 * Página ABIERTA (sin login), orientada a vender PROGRAMAS de acompañamiento.
 * Todo el contenido y los precios vienen de site.config.js (fuente única).
 * Modelo de captación híbrido: "Solicitar plaza" (contratación directa) o
 * "Hablar antes con la nutricionista" (llamada gratuita de orientación).
 * El formulario guarda la solicitud en Supabase (`solicitudes`).
 */
import { useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { supabase, isConfigured } from '../backend/supabase.js';
import {
  businessConfig as B, founderOffer, programs, individualServices, maintenance, comparison,
  orientationCall, problems, methodology, benefits, trustItems, faqs, serviceSupportText,
  commercialConditions, medicalDisclaimer, showTestimonials, testimonials, objetivoOptions,
} from './site.config.js';
import otter from '../assets/otter.png';
import '../styles/landing.css';

const euro = (n) => `${n} €`;

const scrollTo = (id) => (e) => {
  if (e) e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

/* Nombres de todos los servicios para el desplegable del formulario. */
const allPlanNames = [
  ...programs.map((p) => p.name),
  ...individualServices.map((s) => s.name),
  ...maintenance.plans.map((m) => m.name),
];

/* ---------- Precio de un programa (fundadora vs estándar, sin tachados) ---------- */
function ProgramPrice({ p }) {
  const f = founderOffer.enabled;
  return (
    <div className="lprice">
      {f && <span className="lprice__tag">{founderOffer.label}</span>}
      <span className="lprice__now">{euro(f ? p.founderPrice : p.standardPrice)}</span>
      {f && <span className="lprice__after">Nuevas contrataciones tras el lanzamiento: {euro(p.standardPrice)}</span>}
      {p.installment && (
        <span className="lprice__inst">
          o {p.installment.payments} pagos de {euro(f ? p.installment.founderAmount : p.installment.standardAmount)} · total {euro(f ? p.installment.founderTotal : p.installment.standardTotal)}
        </span>
      )}
    </div>
  );
}

/* ---------- Tarjeta de programa ---------- */
function ProgramCard({ p, onSolicitar, onHablar }) {
  return (
    <div className={'lplan' + (p.featured ? ' lplan--hi' : '')}>
      {p.featured && <span className="lplan__tag">Más recomendado</span>}
      <h3 className="lplan__name">{p.name}</h3>
      <p className="lplan__for">{p.forWhom}</p>
      <div className="lplan__dur"><Icon name="clock" size={14} /> {p.duration}</div>
      <ProgramPrice p={p} />
      <div className="lplan__meta">
        <span><b>Sesiones:</b> {p.sessions}</span>
        <span><b>Seguimiento:</b> {p.support}</span>
      </div>
      <ul className="lplan__feats">
        {p.includes.slice(0, 7).map((ft) => <li key={ft}><Icon name="check" size={16} />{ft}</li>)}
      </ul>
      <details className="lplan__details">
        <summary>Ver todos los detalles <Icon name="chevron" size={15} /></summary>
        <strong>Incluye</strong>
        <ul className="lplan__det-list">{p.includes.map((ft) => <li key={ft}><Icon name="check" size={14} />{ft}</li>)}</ul>
        {p.notIncludes?.length > 0 && (
          <>
            <strong>No incluye</strong>
            <ul className="lplan__det-list lplan__det-list--no">{p.notIncludes.map((ft) => <li key={ft}><Icon name="x" size={14} />{ft}</li>)}</ul>
          </>
        )}
      </details>
      <button className={'btn ' + (p.featured ? 'btn--primary' : 'btn--ghost')} onClick={() => onSolicitar(p.name)}>{p.cta}</button>
      <button className="lplan__secondary" onClick={onHablar}>Hablar antes con la nutricionista</button>
    </div>
  );
}

/* ---------- Comparativa ---------- */
function Comparison() {
  return (
    <table className="lcompare">
      <thead>
        <tr>
          <th>Característica</th>
          {comparison.columns.map((c) => <th key={c}>{c}</th>)}
        </tr>
      </thead>
      <tbody>
        {comparison.rows.map((r) => (
          <tr key={r.label}>
            <th scope="row">{r.label}</th>
            {r.values.map((v, i) => <td key={i} data-col={comparison.columns[i]}>{v}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---------- Formulario de solicitud ---------- */
function SolicitudForm({ preselect }) {
  const empty = {
    nombre: '', email: '', telefono: '', objetivo: '', dificultad: '',
    planInteres: preselect?.plan || '', modo: preselect?.modo || 'directa', mensaje: '', consent: false,
  };
  const [f, setF] = useState(empty);
  const [state, setState] = useState('idle');
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.consent) return;
    setState('sending');
    const detalle = [
      `Vía: ${f.modo === 'llamada' ? 'Llamada de orientación' : 'Contratación directa'}`,
      f.planInteres && `Programa de interés: ${f.planInteres}`,
      f.dificultad && `Principal dificultad: ${f.dificultad}`,
      f.mensaje && `Mensaje: ${f.mensaje}`,
    ].filter(Boolean).join('\n');
    try {
      if (isConfigured && supabase) {
        const { error } = await supabase.from('solicitudes').insert({
          nombre: f.nombre.trim(), email: f.email.trim(), telefono: f.telefono.trim() || null,
          objetivo: f.objetivo || null, mensaje: detalle || null,
        });
        if (error) throw error;
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }
      setF(empty);
      setState('ok');
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
      setState('error');
    }
  };

  if (state === 'ok') {
    return (
      <div className="lf-done">
        <div className="lf-done__ico"><Icon name="check" size={30} /></div>
        <h3>¡Gracias! He recibido tu solicitud</h3>
        <p>Te escribiré para confirmar los detalles y, si decides empezar, enviarte los datos para el pago.</p>
        <button className="btn btn--ghost" onClick={() => setState('idle')}>Enviar otra</button>
      </div>
    );
  }

  return (
    <form className="lform" onSubmit={submit} noValidate>
      <div className="lform__modo">
        <label className={'lmodo' + (f.modo === 'directa' ? ' is-on' : '')}>
          <input type="radio" name="modo" checked={f.modo === 'directa'} onChange={() => set('modo', 'directa')} />
          <span><b>Solicitar plaza</b><i>Contratar un programa</i></span>
        </label>
        <label className={'lmodo' + (f.modo === 'llamada' ? ' is-on' : '')}>
          <input type="radio" name="modo" checked={f.modo === 'llamada'} onChange={() => set('modo', 'llamada')} />
          <span><b>Llamada de orientación</b><i>Hablar antes (15 min, gratis)</i></span>
        </label>
      </div>
      <div className="lform__row">
        <label className="lfield"><span>Nombre*</span>
          <input value={f.nombre} required placeholder="Tu nombre" onChange={(e) => set('nombre', e.target.value)} />
        </label>
        <label className="lfield"><span>Email*</span>
          <input type="email" value={f.email} required placeholder="tu@email.com" onChange={(e) => set('email', e.target.value)} />
        </label>
      </div>
      <div className="lform__row">
        <label className="lfield"><span>Teléfono</span>
          <input value={f.telefono} placeholder="Opcional" onChange={(e) => set('telefono', e.target.value)} />
        </label>
        <label className="lfield"><span>Programa de interés</span>
          <select value={f.planInteres} onChange={(e) => set('planInteres', e.target.value)}>
            <option value="">No lo sé / que me recomienden</option>
            {allPlanNames.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>
      <div className="lform__row">
        <label className="lfield"><span>Objetivo principal</span>
          <select value={f.objetivo} onChange={(e) => set('objetivo', e.target.value)}>
            <option value="">Elige una opción</option>
            {objetivoOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        <label className="lfield"><span>Tu principal dificultad</span>
          <input value={f.dificultad} placeholder="Ej. me organizo mal entre semana" onChange={(e) => set('dificultad', e.target.value)} />
        </label>
      </div>
      <label className="lfield"><span>Cuéntame un poco más</span>
        <textarea rows="3" value={f.mensaje} placeholder="Opcional" onChange={(e) => set('mensaje', e.target.value)} />
      </label>
      <p className="lform__cond">Antes de empezar verás las <a href="#condiciones" onClick={scrollTo('condiciones')}>condiciones del servicio</a>. El pago se realiza antes de comenzar.</p>
      <label className="lconsent">
        <input type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} />
        <span>He leído y acepto la política de privacidad y el tratamiento de mis datos para contactarme.*</span>
      </label>
      {state === 'error' && <p className="lform__err">No se ha podido enviar. Inténtalo de nuevo más tarde.</p>}
      <button className="btn btn--primary lform__send" type="submit" disabled={state === 'sending' || !f.consent}>
        {state === 'sending' ? 'Enviando…' : (f.modo === 'llamada' ? 'Reservar llamada gratuita' : 'Solicitar plaza')}
        {state !== 'sending' && <Icon name="arrow" size={17} />}
      </button>
    </form>
  );
}

export function Landing({ onAccess }) {
  const [request, setRequest] = useState(null); // { plan, modo, k }
  const wa = B.whatsappNumber ? `https://wa.me/${B.whatsappNumber}` : null;

  const solicitar = (planName, modo = 'directa') => {
    setRequest((r) => ({ plan: planName, modo, k: (r?.k || 0) + 1 }));
    requestAnimationFrame(() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }));
  };
  const irLlamada = scrollTo('llamada');

  return (
    <div className="landing" data-palette="0">
      {/* Banner tarifa fundadora */}
      {founderOffer.enabled && (
        <div className="lpromo-bar">
          <Icon name="spark" size={15} /> <b>{founderOffer.label}:</b>&nbsp;
          {founderOffer.showRemainingPlaces && typeof founderOffer.remainingPlaces === 'number'
            ? `quedan ${founderOffer.remainingPlaces} de ${founderOffer.totalPlaces} plazas`
            : 'Plazas fundadoras limitadas'}
        </div>
      )}

      {/* Nav */}
      <header className="lnav">
        <div className="lnav__inner">
          <a className="lnav__brand" href="#top" onClick={scrollTo('top')}>
            <img src={otter} alt="" />
            <span><b>{B.professionalName}</b><i>{B.role}</i></span>
          </a>
          <nav className="lnav__links">
            <a href="#metodo" onClick={scrollTo('metodo')}>Método</a>
            <a href="#planes" onClick={scrollTo('planes')}>Programas</a>
            <a href="#faq" onClick={scrollTo('faq')}>FAQ</a>
            <a href="#contacto" onClick={scrollTo('contacto')}>Contacto</a>
          </nav>
          <button className="lnav__access" onClick={onAccess}>
            <Icon name="logout" size={16} /> Acceso profesional
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="lhero" id="top">
        <div className="lhero__text">
          <span className="leyebrow"><Icon name="leaf" size={15} /> {B.tagline}</span>
          <h1>Pierde grasa y mejora tu alimentación <em>sin vivir a dieta</em></h1>
          <p>
            Un acompañamiento nutricional online adaptado a tus horarios, tus preferencias y tu vida real.
            Aprende a organizarte, comer con flexibilidad y construir hábitos que puedas mantener.
          </p>
          <div className="lhero__cta">
            <button className="btn btn--primary" onClick={scrollTo('planes')}>Ver programas <Icon name="arrow" size={17} /></button>
            <button className="btn btn--ghost" onClick={irLlamada}>Hablar antes con la nutricionista</button>
          </div>
          <ul className="lhero__trust">
            {trustItems.map((t) => <li key={t}><Icon name="check" size={15} /> {t}</li>)}
          </ul>
        </div>
        <div className="lhero__art">
          <div className="lhero__photo">
            <img src={B.photo} alt={`${B.professionalName}, ${B.role}`} />
            <div className="lhero__badge"><Icon name="heart" size={16} /> Trato cercano y humano</div>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section className="lsec" id="problema">
        <div className="lsec__head"><span className="leyebrow">¿Te suena?</span><h2>¿Te identificas con alguna de estas situaciones?</h2></div>
        <ul className="lproblems">{problems.map((p) => <li key={p}><Icon name="alert" size={17} /> {p}</li>)}</ul>
        <p className="lsec__close">No necesitas otra dieta temporal. Necesitas un sistema adaptado a tu vida.</p>
      </section>

      {/* Método */}
      <section className="lsec lsec--alt" id="metodo">
        <div className="lsec__head"><span className="leyebrow">Cómo trabajo</span><h2>Un proceso para que no dependas siempre de una dieta</h2></div>
        <div className="lsteps">
          {methodology.map((s) => (
            <div className="lstep" key={s.n}><div className="lstep__n">{s.n}</div><h3>{s.title}</h3><p>{s.text}</p></div>
          ))}
        </div>
      </section>

      {/* Beneficios */}
      <section className="lsec" id="beneficios">
        <div className="lsec__head"><span className="leyebrow">Qué te llevas</span><h2>No solo perder peso: aprender a mantenerlo</h2></div>
        <ul className="lbenefits">{benefits.map((b) => <li key={b}><Icon name="check" size={18} /> {b}</li>)}</ul>
      </section>

      {/* Programas */}
      <section className="lsec lsec--alt" id="planes">
        <div className="lsec__head">
          <span className="leyebrow">Programas</span>
          <h2>Elige el acompañamiento que encaja contigo</h2>
          {founderOffer.enabled && <p>{founderOffer.headline}. {founderOffer.subline}</p>}
        </div>
        <div className="lplans">
          {programs.map((p) => <ProgramCard key={p.id} p={p} onSolicitar={solicitar} onHablar={irLlamada} />)}
        </div>

        {/* Comparativa */}
        <div className="lcompare-wrap">
          <h3 className="lcompare-title">Compara los programas</h3>
          <Comparison />
        </div>
      </section>

      {/* Mantenimiento (secundario) */}
      <section className="lsec" id="mantenimiento">
        <div className="lsec__head"><span className="leyebrow">Después del programa</span><h2>{maintenance.title}</h2><p>{maintenance.subtitle}</p></div>
        <div className="lmaint">
          {maintenance.plans.map((m) => (
            <div className="lmaint__card" key={m.id}>
              <h4>{m.name}</h4>
              <div className="lmaint__price">{euro(m.price)}<span>/{m.billingPeriod}</span></div>
              <ul>{m.includes.map((ft) => <li key={ft}><Icon name="check" size={15} />{ft}</li>)}</ul>
            </div>
          ))}
        </div>
        <p className="lmaint__note"><Icon name="alert" size={15} /> {maintenance.note}</p>
        <div className="lmaint__cta"><button className="btn btn--ghost" onClick={() => solicitar('Mantenimiento')}>{maintenance.cta}</button></div>
      </section>

      {/* Sesiones individuales (secundario) */}
      <section className="lsec lsec--alt" id="sesiones">
        <div className="lsec__head"><span className="leyebrow">Sesiones sueltas</span><h2>¿Prefieres empezar por una sesión?</h2></div>
        <div className="lservices">
          {individualServices.map((s) => (
            <div className="lservice" key={s.id}>
              <div className="lservice__top">
                <h4>{s.name}</h4>
                <div className="lprice"><span className="lprice__now">{euro(s.price)}</span></div>
              </div>
              <div className="lplan__dur"><Icon name="clock" size={14} /> {s.duration}</div>
              <p>{s.summary}{!s.availableToNewClients && <em> Disponible para quien ya hizo una valoración o un programa.</em>}</p>
              <button className="btn btn--ghost" onClick={() => solicitar(s.name)}>{s.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Llamada gratuita */}
      <section className="lsec" id="llamada">
        <div className="lcall">
          <div className="lcall__ico"><Icon name="message" size={26} /></div>
          <div>
            <h2>{orientationCall.title}</h2>
            <p>{orientationCall.text}</p>
            <p className="lcall__warn"><Icon name="alert" size={15} /> {orientationCall.disclaimer}</p>
            <button className="btn btn--primary" onClick={() => solicitar('', 'llamada')}>{orientationCall.cta} <Icon name="arrow" size={16} /></button>
          </div>
        </div>
      </section>

      {/* Sobre mí */}
      <section className="lsec lsec--alt" id="sobre">
        <div className="labout">
          <div className="labout__photo"><img src={B.photo} alt={B.professionalName} /></div>
          <div className="labout__body">
            <span className="leyebrow">Sobre mí</span>
            <h2>{B.professionalName}</h2>
            <p><b>{B.role}</b> · más de {B.experienceYears} años de experiencia. Acompaño a personas con poco tiempo a perder grasa, mejorar su alimentación y construir hábitos sostenibles, sin menús imposibles ni dietas extremas.</p>
            <ul className="labout__data">
              <li><Icon name="clipboard" size={16} /> Titulación: {B.titulacion || '[TITULACIÓN OFICIAL — pendiente]'}</li>
              <li><Icon name="check" size={16} /> Nº colegiado/a: {B.colegiado || '[Nº COLEGIADO — pendiente]'}</li>
              {B.formacion.length > 0 && B.formacion.map((ff) => <li key={ff}><Icon name="spark" size={16} /> {ff}</li>)}
            </ul>
            <p className="labout__note">{medicalDisclaimer}</p>
          </div>
        </div>
      </section>

      {/* Testimonios (oculto hasta tener reales) */}
      {showTestimonials && testimonials.length > 0 && (
        <section className="lsec" id="testimonios">
          <div className="lsec__head"><span className="leyebrow">Testimonios</span><h2>Lo que dicen quienes ya han dado el paso</h2></div>
          <div className="ltestis">
            {testimonials.filter((t) => t.consentConfirmed).map((t, i) => (
              <figure className="ltesti" key={i}><blockquote>“{t.quote}”</blockquote><figcaption>{t.name}{t.context && <span> · {t.context}</span>}</figcaption></figure>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="lsec lsec--alt" id="faq">
        <div className="lsec__head"><span className="leyebrow">Dudas frecuentes</span><h2>Preguntas frecuentes</h2></div>
        <div className="lfaq">
          {faqs.map((item) => (
            <details className="lfaq__item" key={item.q}><summary>{item.q}<Icon name="chevron" size={18} /></summary><p>{item.a}</p></details>
          ))}
        </div>
      </section>

      {/* Contacto / solicitud */}
      <section className="lsec" id="contacto">
        <div className="lcontact">
          <div className="lcontact__intro">
            <span className="leyebrow">Empecemos</span>
            <h2>Solicita tu plaza o tu llamada</h2>
            <p>Elige cómo quieres empezar: contratar un programa directamente o hablar antes en una llamada gratuita de orientación.</p>
            <ul className="lcontact__list">
              <li><Icon name="clock" size={18} /> Respuesta en 24–48 h laborables</li>
              <li><Icon name="leaf" size={18} /> Sin dietas milagro, solo hábitos reales</li>
              {wa && <li><a href={wa} target="_blank" rel="noopener"><Icon name="message" size={18} /> Escríbeme por WhatsApp</a></li>}
            </ul>
            <p className="lsupport">{serviceSupportText}</p>
          </div>
          <div className="lcontact__form"><SolicitudForm key={request?.k || 'init'} preselect={request} /></div>
        </div>
      </section>

      {/* Condiciones */}
      <section className="lsec lsec--alt" id="condiciones">
        <details className="lcond">
          <summary>Condiciones del servicio y límites</summary>
          <ul>{commercialConditions.map((c) => <li key={c}>{c}</li>)}</ul>
          <p className="lcond__legal">Textos orientativos, pendientes de revisión legal. No constituyen asesoramiento jurídico.</p>
        </details>
      </section>

      {/* Pie */}
      <footer className="lfoot">
        <div className="lfoot__brand"><img src={otter} alt="" /><span>{B.professionalName} · {B.role}</span></div>
        <p>© {new Date().getFullYear()} {B.professionalName}. {B.contactEmail || '[email de contacto]'}</p>
        <button className="lfoot__access" onClick={onAccess}>Acceso profesional</button>
      </footer>
    </div>
  );
}
