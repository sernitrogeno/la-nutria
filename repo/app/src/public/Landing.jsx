/* Web pública de captación · Nutrición online.
 *
 * Página ABIERTA (sin login), orientada a vender acompañamiento nutricional.
 * Todo el contenido y los precios vienen de site.config.js (fuente única).
 * El formulario de valoración guarda la solicitud en Supabase (`solicitudes`).
 * El acceso al panel privado es el botón "Acceso profesional" → onAccess().
 */
import { useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { supabase, isConfigured } from '../backend/supabase.js';
import {
  businessConfig as B, launchPromotion as PROMO, nutritionPlans, problems, methodology,
  benefits, trustItems, faqs, serviceSupportText, commercialConditions, medicalDisclaimer,
  showTestimonials, testimonials, objetivoOptions,
} from './site.config.js';
import otter from '../assets/otter.png';
import '../styles/landing.css';

const euro = (n) => `${n} €`;
const planById = (id) => nutritionPlans.find((p) => p.id === id);
const promoOn = (p) => PROMO.enabled && typeof p.launchPrice === 'number';

/* Precio con tarifa de lanzamiento tachada cuando aplica. */
function Price({ plan, large }) {
  return (
    <div className={'lprice' + (large ? ' lprice--lg' : '')}>
      {promoOn(plan) ? (
        <>
          <span className="lprice__now">{euro(plan.launchPrice)}</span>
          <span className="lprice__was">{euro(plan.price)}</span>
        </>
      ) : (
        <span className="lprice__now">{euro(plan.price)}</span>
      )}
      {plan.period && <span className="lprice__per">{plan.period}</span>}
    </div>
  );
}

const scrollTo = (id) => (e) => {
  if (e) e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

/* Reservar: si hay enlace de reserva configurado lo abre; si no, lleva al
 * formulario de valoración. */
function goBooking(e) {
  if (e) e.preventDefault();
  if (B.bookingUrl) window.open(B.bookingUrl, '_blank', 'noopener');
  else document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
}

/* ---------- Formulario de valoración ---------- */
function ValoracionForm() {
  const empty = {
    nombre: '', email: '', telefono: '', edad: '', objetivo: '', dificultad: '',
    probado: '', disponibilidad: '', planInteres: '', contacto: 'Email', mensaje: '', consent: false,
  };
  const [f, setF] = useState(empty);
  const [state, setState] = useState('idle'); // idle | sending | ok | error
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.consent) return;
    setState('sending');
    /* Mapeamos a las columnas de `solicitudes` y empaquetamos el detalle en el
     * mensaje (legible en el panel) para no exponer un esquema clínico aquí. */
    const detalle = [
      f.edad && `Edad: ${f.edad}`,
      f.dificultad && `Principal dificultad: ${f.dificultad}`,
      f.probado && `Ha probado: ${f.probado}`,
      f.disponibilidad && `Disponibilidad: ${f.disponibilidad}`,
      f.planInteres && `Plan de interés: ${f.planInteres}`,
      `Preferencia de contacto: ${f.contacto}`,
      f.mensaje && `Mensaje: ${f.mensaje}`,
    ].filter(Boolean).join('\n');
    try {
      if (isConfigured && supabase) {
        const { error } = await supabase.from('solicitudes').insert({
          nombre: f.nombre.trim(),
          email: f.email.trim(),
          telefono: f.telefono.trim() || null,
          objetivo: f.objetivo || null,
          mensaje: detalle || null,
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
        <p>Te escribiré para proponerte una llamada de orientación y resolver tus dudas.</p>
        <button className="btn btn--ghost" onClick={() => setState('idle')}>Enviar otra</button>
      </div>
    );
  }

  return (
    <form className="lform" onSubmit={submit} noValidate>
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
        <label className="lfield"><span>Edad</span>
          <input type="number" min="0" value={f.edad} placeholder="Opcional" onChange={(e) => set('edad', e.target.value)} />
        </label>
      </div>
      <div className="lform__row">
        <label className="lfield"><span>Objetivo principal</span>
          <select value={f.objetivo} onChange={(e) => set('objetivo', e.target.value)}>
            <option value="">Elige una opción</option>
            {objetivoOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        <label className="lfield"><span>Plan que te interesa</span>
          <select value={f.planInteres} onChange={(e) => set('planInteres', e.target.value)}>
            <option value="">No lo sé / que me recomienden</option>
            {nutritionPlans.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </label>
      </div>
      <label className="lfield"><span>¿Cuál es tu principal dificultad?</span>
        <input value={f.dificultad} placeholder="Ej. me organizo mal entre semana" onChange={(e) => set('dificultad', e.target.value)} />
      </label>
      <label className="lfield"><span>¿Qué has probado antes?</span>
        <input value={f.probado} placeholder="Dietas, apps, otros profesionales…" onChange={(e) => set('probado', e.target.value)} />
      </label>
      <div className="lform__row">
        <label className="lfield"><span>Disponibilidad</span>
          <input value={f.disponibilidad} placeholder="Ej. tardes entre semana" onChange={(e) => set('disponibilidad', e.target.value)} />
        </label>
        <label className="lfield"><span>Prefieres que te contacte por</span>
          <select value={f.contacto} onChange={(e) => set('contacto', e.target.value)}>
            <option>Email</option><option>Teléfono</option><option>WhatsApp</option>
          </select>
        </label>
      </div>
      <label className="lfield"><span>Cuéntame un poco más</span>
        <textarea rows="3" value={f.mensaje} placeholder="Opcional" onChange={(e) => set('mensaje', e.target.value)} />
      </label>
      <label className="lconsent">
        <input type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} />
        <span>He leído y acepto la política de privacidad y el tratamiento de mis datos para contactarme.*</span>
      </label>
      {state === 'error' && <p className="lform__err">No se ha podido enviar. Inténtalo de nuevo más tarde.</p>}
      <button className="btn btn--primary lform__send" type="submit" disabled={state === 'sending' || !f.consent}>
        {state === 'sending' ? 'Enviando…' : 'Solicitar valoración'}
        {state !== 'sending' && <Icon name="arrow" size={17} />}
      </button>
    </form>
  );
}

/* ---------- Tarjeta de plan (comparador) ---------- */
function PlanCard({ plan }) {
  return (
    <div className={'lplan' + (plan.featured ? ' lplan--hi' : '')}>
      {plan.featured && <span className="lplan__tag">Más recomendado</span>}
      <h3 className="lplan__name">{plan.name}</h3>
      <Price plan={plan} />
      {plan.duration && <div className="lplan__dur"><Icon name="clock" size={14} /> {plan.duration}</div>}
      <p className="lplan__desc">{plan.summary}</p>
      <ul className="lplan__feats">
        {plan.includes.slice(0, 6).map((ft) => <li key={ft}><Icon name="check" size={16} />{ft}</li>)}
      </ul>
      {plan.payment?.installments && <p className="lplan__pay">o {plan.payment.installments} (pago fraccionado)</p>}
      <button className={'btn ' + (plan.featured ? 'btn--primary' : 'btn--ghost')} onClick={goBooking}>{plan.cta}</button>
    </div>
  );
}

export function Landing({ onAccess }) {
  const featured = planById('cambio-sostenible');
  const programas = nutritionPlans.filter((p) => p.kind === 'programa');
  const servicios = nutritionPlans.filter((p) => p.kind === 'servicio');
  const mantenimiento = planById('mantenimiento');
  const wa = B.whatsappNumber ? `https://wa.me/${B.whatsappNumber}` : null;

  return (
    <div className="landing" data-palette="0">
      {/* Banner promoción */}
      {PROMO.enabled && (
        <div className="lpromo-bar">
          <Icon name="spark" size={15} /> <b>{PROMO.label}:</b> {PROMO.note}
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
            <button className="btn btn--primary" onClick={goBooking}>Solicitar valoración <Icon name="arrow" size={17} /></button>
            <button className="btn btn--ghost" onClick={scrollTo('planes')}>Ver programas</button>
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
        <div className="lsec__head">
          <span className="leyebrow">¿Te suena?</span>
          <h2>¿Te identificas con alguna de estas situaciones?</h2>
        </div>
        <ul className="lproblems">
          {problems.map((p) => <li key={p}><Icon name="alert" size={17} /> {p}</li>)}
        </ul>
        <p className="lsec__close">No necesitas otra dieta temporal. Necesitas un sistema adaptado a tu vida.</p>
      </section>

      {/* Método */}
      <section className="lsec lsec--alt" id="metodo">
        <div className="lsec__head">
          <span className="leyebrow">Cómo trabajo</span>
          <h2>Un proceso para que no dependas siempre de una dieta</h2>
        </div>
        <div className="lsteps">
          {methodology.map((s) => (
            <div className="lstep" key={s.n}>
              <div className="lstep__n">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beneficios */}
      <section className="lsec" id="beneficios">
        <div className="lsec__head">
          <span className="leyebrow">Qué te llevas</span>
          <h2>No solo perder peso: aprender a mantenerlo</h2>
        </div>
        <ul className="lbenefits">
          {benefits.map((b) => <li key={b}><Icon name="check" size={18} /> {b}</li>)}
        </ul>
      </section>

      {/* Programa destacado */}
      {featured && (
        <section className="lsec" id="destacado">
          <div className="lfeatured">
            <div className="lfeatured__body">
              <span className="leyebrow">Programa principal</span>
              <h2>{featured.name}</h2>
              <p>{featured.summary}</p>
              <ul className="lfeatured__list">
                {featured.includes.slice(0, 6).map((ft) => <li key={ft}><Icon name="check" size={16} /> {ft}</li>)}
              </ul>
              <div className="lfeatured__cta">
                <button className="btn btn--primary" onClick={goBooking}>{featured.cta} <Icon name="arrow" size={17} /></button>
                <div className="lfeatured__price"><Price plan={featured} large />{featured.payment?.installments && <small>o {featured.payment.installments}</small>}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Comparador de planes */}
      <section className="lsec lsec--alt" id="planes">
        <div className="lsec__head">
          <span className="leyebrow">Programas y precios</span>
          <h2>Elige el acompañamiento que encaja contigo</h2>
          <p>Precios claros y sin permanencia. Si dudas, pide una llamada de orientación y te recomiendo el más adecuado.</p>
        </div>
        <div className="lplans">
          {programas.map((p) => <PlanCard key={p.id} plan={p} />)}
        </div>

        {/* Servicios sueltos + mantenimiento */}
        <div className="lservices">
          {servicios.map((s) => (
            <div className="lservice" key={s.id}>
              <div className="lservice__top">
                <h4>{s.name}</h4>
                <Price plan={s} />
              </div>
              <p>{s.summary}{s.note && <em> {s.note}</em>}</p>
              <button className="btn btn--ghost" onClick={goBooking}>{s.cta}</button>
            </div>
          ))}
          {mantenimiento && (
            <div className="lservice">
              <div className="lservice__top">
                <h4>{mantenimiento.name}</h4>
                <Price plan={mantenimiento} />
              </div>
              <p>{mantenimiento.summary} {mantenimiento.variant && <em>{mantenimiento.variant.name}: {euro(mantenimiento.variant.price)}{mantenimiento.variant.period} · {mantenimiento.variant.extra}</em>}</p>
              <button className="btn btn--ghost" onClick={goBooking}>{mantenimiento.cta}</button>
            </div>
          )}
        </div>
      </section>

      {/* Llamada de orientación */}
      <section className="lsec" id="llamada">
        <div className="lcall">
          <div className="lcall__ico"><Icon name="message" size={26} /></div>
          <div>
            <h2>Una llamada de orientación de 15 minutos</h2>
            <p>Sirve para conocer tu situación y explicarte cómo funciona el acompañamiento. No incluye valoración clínica, planificación nutricional ni elaboración de una dieta.</p>
            <button className="btn btn--primary" onClick={goBooking}>Reservar llamada <Icon name="arrow" size={16} /></button>
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
              <figure className="ltesti" key={i}>
                <blockquote>“{t.quote}”</blockquote>
                <figcaption>{t.name}{t.context && <span> · {t.context}</span>}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="lsec lsec--alt" id="faq">
        <div className="lsec__head"><span className="leyebrow">Dudas frecuentes</span><h2>Preguntas frecuentes</h2></div>
        <div className="lfaq">
          {faqs.map((item) => (
            <details className="lfaq__item" key={item.q}>
              <summary>{item.q}<Icon name="chevron" size={18} /></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contacto / valoración */}
      <section className="lsec" id="contacto">
        <div className="lcontact">
          <div className="lcontact__intro">
            <span className="leyebrow">Empecemos</span>
            <h2>Solicita tu valoración</h2>
            <p>Déjame tus datos y te propongo una llamada de orientación sin compromiso para ver si encajamos.</p>
            <ul className="lcontact__list">
              <li><Icon name="clock" size={18} /> Respuesta en 24–48 h laborables</li>
              <li><Icon name="leaf" size={18} /> Sin dietas milagro, solo hábitos reales</li>
              {wa && <li><a href={wa} target="_blank" rel="noopener"><Icon name="message" size={18} /> Escríbeme por WhatsApp</a></li>}
            </ul>
            <p className="lsupport">{serviceSupportText}</p>
          </div>
          <div className="lcontact__form"><ValoracionForm /></div>
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
