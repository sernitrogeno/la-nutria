/* Web pública de Maria Torre · Nutrición (landing introductoria).
 *
 * Página ABIERTA (sin login): se renderiza fuera de AuthGate. Presenta a la
 * profesional, sus servicios/planes y un formulario de contacto que guarda la
 * solicitud en Supabase (tabla `solicitudes`). El acceso al panel privado es el
 * botón "Acceso profesional" → onAccess().
 */
import { useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { supabase, isConfigured } from '../backend/supabase.js';
import otter from '../assets/otter.png';
import '../styles/landing.css';

const NUTRI = {
  name: 'Maria Torre',
  role: 'Nutricionista',
  email: 'hola@marianutricion.es',
};

const PLANS = [
  {
    name: 'Sesión única',
    price: '35€',
    period: null,
    description: 'Una consulta puntual para resolver dudas o hacer un primer diagnóstico.',
    features: ['Valoración inicial', 'Recomendaciones personalizadas', 'Sin compromiso'],
    highlighted: false,
  },
  {
    name: 'Plan mensual',
    price: '49€',
    period: '/mes',
    description: 'Acompañamiento continuo con seguimiento semanal y ajustes del plan.',
    features: ['4 sesiones de seguimiento', 'Plan adaptado cada semana', 'Chat de apoyo entre sesiones'],
    highlighted: true,
  },
  {
    name: 'Plan trimestral',
    price: '120€',
    period: '/trim.',
    description: 'El acompañamiento más completo para resultados duraderos.',
    features: ['12 sesiones de seguimiento', 'Plan adaptado cada semana', 'Chat de apoyo entre sesiones', 'Revisión de objetivos mensual'],
    highlighted: false,
  },
];

const FEATURES = [
  { icon: 'clipboard', title: 'Valoración completa', text: 'Analizamos tus hábitos, tu historia y tus objetivos para entender tu punto de partida.' },
  { icon: 'plate', title: 'Plan personalizado', text: 'Nada de dietas genéricas: un plan realista, sabroso y adaptado a tu vida.' },
  { icon: 'pulse', title: 'Seguimiento cercano', text: 'Ajustamos el plan semana a semana y resolvemos dudas entre sesiones.' },
  { icon: 'heart', title: 'Educación nutricional', text: 'Aprendes a comer bien para siempre, sin obsesiones ni restricciones absurdas.' },
];

const OBJETIVOS = [
  'Pérdida de peso',
  'Mejora de hábitos',
  'Salud digestiva',
  'Rendimiento deportivo',
  'Embarazo o lactancia',
  'Control de una patología',
  'Otro',
];

function ContactForm() {
  const empty = { nombre: '', email: '', telefono: '', objetivo: '', mensaje: '' };
  const [f, setF] = useState(empty);
  const [state, setState] = useState('idle'); // idle | sending | ok | error
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setState('sending');
    try {
      if (isConfigured && supabase) {
        const { error } = await supabase.from('solicitudes').insert({
          nombre: f.nombre.trim(),
          email: f.email.trim(),
          telefono: f.telefono.trim() || null,
          objetivo: f.objetivo || null,
          mensaje: f.mensaje.trim() || null,
        });
        if (error) throw error;
      } else {
        /* Sin backend configurado: simulamos envío para no bloquear la demo. */
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
        <h3>¡Gracias, te escribo pronto!</h3>
        <p>He recibido tu solicitud. Te contactaré por email en menos de 48&nbsp;h.</p>
        <button className="btn btn--ghost" onClick={() => setState('idle')}>Enviar otra</button>
      </div>
    );
  }

  return (
    <form className="lform" onSubmit={submit}>
      <div className="lform__row">
        <label className="lfield">
          <span>Nombre*</span>
          <input value={f.nombre} required placeholder="Tu nombre" onChange={(e) => set('nombre', e.target.value)} />
        </label>
        <label className="lfield">
          <span>Email*</span>
          <input type="email" value={f.email} required placeholder="tu@email.com" onChange={(e) => set('email', e.target.value)} />
        </label>
      </div>
      <div className="lform__row">
        <label className="lfield">
          <span>Teléfono</span>
          <input value={f.telefono} placeholder="Opcional" onChange={(e) => set('telefono', e.target.value)} />
        </label>
        <label className="lfield">
          <span>¿Qué buscas?</span>
          <select value={f.objetivo} onChange={(e) => set('objetivo', e.target.value)}>
            <option value="">Elige una opción</option>
            {OBJETIVOS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
      </div>
      <label className="lfield">
        <span>Cuéntame un poco más</span>
        <textarea rows="4" value={f.mensaje} placeholder="¿En qué te puedo ayudar?" onChange={(e) => set('mensaje', e.target.value)} />
      </label>
      {state === 'error' && <p className="lform__err">No se ha podido enviar. Inténtalo de nuevo o escríbeme a {NUTRI.email}.</p>}
      <button className="btn btn--primary lform__send" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Enviando…' : 'Solicitar información'}
        {state !== 'sending' && <Icon name="arrow" size={17} />}
      </button>
      <p className="lform__legal">Tus datos solo se usan para contactarte. No los comparto con nadie.</p>
    </form>
  );
}

export function Landing({ onAccess }) {
  const go = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing" data-palette="0">
      {/* ---- Cabecera ---- */}
      <header className="lnav">
        <div className="lnav__inner">
          <a className="lnav__brand" href="#top" onClick={go('top')}>
            <img src={otter} alt="" />
            <span><b>{NUTRI.name}</b><i>Nutrición</i></span>
          </a>
          <nav className="lnav__links">
            <a href="#sobre" onClick={go('sobre')}>Sobre mí</a>
            <a href="#planes" onClick={go('planes')}>Planes</a>
            <a href="#contacto" onClick={go('contacto')}>Contacto</a>
          </nav>
          <button className="lnav__access" onClick={onAccess}>
            <Icon name="logout" size={16} /> Acceso profesional
          </button>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className="lhero" id="top">
        <div className="lhero__text">
          <span className="leyebrow"><Icon name="leaf" size={15} /> Nutrición con cabeza y corazón</span>
          <h1>Come mejor, <em>vive mejor</em> — con un plan hecho para ti.</h1>
          <p>
            Soy {NUTRI.name}, {NUTRI.role.toLowerCase()}. Te ayudo a cambiar tu alimentación
            sin dietas imposibles: planes realistas, seguimiento cercano y resultados que duran.
          </p>
          <div className="lhero__cta">
            <button className="btn btn--primary" onClick={go('contacto')}>Reserva tu primera consulta <Icon name="arrow" size={17} /></button>
            <button className="btn btn--ghost" onClick={go('planes')}>Ver planes</button>
          </div>
          <div className="lhero__trust">
            <span><Icon name="check" size={16} /> + de 2 años de experiencia</span>
            <span><Icon name="check" size={16} /> Consultas online y presenciales</span>
          </div>
        </div>
        <div className="lhero__art">
          <div className="lhero__photo">
            <img src="/maria.jpg" alt="Maria Torre, nutricionista" />
            <div className="lhero__badge"><Icon name="heart" size={16} /> Trato cercano y humano</div>
          </div>
        </div>
      </section>

      {/* ---- Sobre mí / qué hago ---- */}
      <section className="lsec" id="sobre">
        <div className="lsec__head">
          <span className="leyebrow">Qué hago</span>
          <h2>Acompañamiento nutricional de verdad</h2>
          <p>Cada persona es distinta. Por eso no vendo dietas: construyo contigo un plan que puedas mantener.</p>
        </div>
        <div className="lfeats">
          {FEATURES.map((ft) => (
            <div className="lfeat" key={ft.title}>
              <div className="lfeat__ico"><Icon name={ft.icon} size={22} /></div>
              <h3>{ft.title}</h3>
              <p>{ft.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Planes ---- */}
      <section className="lsec lsec--alt" id="planes">
        <div className="lsec__head">
          <span className="leyebrow">Servicios y planes</span>
          <h2>Elige cómo quieres empezar</h2>
          <p>Precios claros, sin permanencia. Si tienes dudas, escríbeme y lo vemos juntas.</p>
        </div>
        <div className="lplans">
          {PLANS.map((p) => (
            <div className={'lplan' + (p.highlighted ? ' lplan--hi' : '')} key={p.name}>
              {p.highlighted && <span className="lplan__tag">Más popular</span>}
              <h3 className="lplan__name">{p.name}</h3>
              <div className="lplan__price">{p.price}{p.period && <span>{p.period}</span>}</div>
              <p className="lplan__desc">{p.description}</p>
              <ul className="lplan__feats">
                {p.features.map((ft) => (
                  <li key={ft}><Icon name="check" size={17} />{ft}</li>
                ))}
              </ul>
              <button className={'btn ' + (p.highlighted ? 'btn--primary' : 'btn--ghost')} onClick={go('contacto')}>
                Empezar con este
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Contacto ---- */}
      <section className="lsec" id="contacto">
        <div className="lcontact">
          <div className="lcontact__intro">
            <span className="leyebrow">Hablemos</span>
            <h2>¿Damos el primer paso?</h2>
            <p>Déjame tus datos y te escribo para conocernos. La primera toma de contacto es sin compromiso.</p>
            <ul className="lcontact__list">
              <li><Icon name="message" size={18} /> Respuesta en menos de 48&nbsp;h</li>
              <li><Icon name="clock" size={18} /> Consultas online y presenciales</li>
              <li><Icon name="leaf" size={18} /> Sin dietas milagro, solo hábitos reales</li>
            </ul>
          </div>
          <div className="lcontact__form">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ---- Pie ---- */}
      <footer className="lfoot">
        <div className="lfoot__brand">
          <img src={otter} alt="" />
          <span>{NUTRI.name} · Nutrición</span>
        </div>
        <p>© {new Date().getFullYear()} {NUTRI.name}. Hecho con cariño.</p>
        <button className="lfoot__access" onClick={onAccess}>Acceso profesional</button>
      </footer>
    </div>
  );
}
