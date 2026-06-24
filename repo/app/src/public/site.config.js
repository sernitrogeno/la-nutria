/* ===========================================================================
 * Configuración central del negocio y de la web pública.
 * TODO el contenido editable vive aquí: datos del profesional, planes, precios,
 * promoción, FAQ, textos legales y metadatos. Cambiar la web = editar este
 * archivo (no hay precios escritos a mano en los componentes).
 *
 * ⚠️ CAMPOS CON [CORCHETES] = pendientes de datos REALES del propietario.
 *    No se inventan títulos, colegiación, testimonios ni datos de contacto.
 * =========================================================================== */

/* ---- Datos del profesional / negocio ---- */
export const businessConfig = {
  professionalName: 'Maria Torre',
  role: 'Dietista-Nutricionista',
  experienceYears: 2,
  photo: '/maria.jpg',
  tagline: 'Nutrición online flexible y sostenible',

  /* --- A RELLENAR (no inventar) --- */
  contactEmail: '',          // [EMAIL DE CONTACTO]
  whatsappNumber: '',        // [WHATSAPP, formato 34XXXXXXXXX] — vacío = se oculta
  bookingUrl: '',            // [ENLACE DE RESERVA: Calendly / Cal.com] — vacío = el CTA lleva al formulario
  colegiado: '',             // [Nº COLEGIADO/A]
  titulacion: '',            // [TITULACIÓN OFICIAL]
  formacion: [],             // ['[Máster en ...]', '[Curso en ...]']
  social: { instagram: '', tiktok: '' },
};

/* ---- Promoción de lanzamiento (activable/desactivable) ---- */
export const launchPromotion = {
  enabled: true,
  label: 'Edición fundadora',
  // Sin cuenta atrás ni escasez falsa. Solo mensaje honesto:
  note: 'Plazas de lanzamiento limitadas.',
  totalPlaces: 10,
};

/* ---- Catálogo de planes (fuente única de precios) ---- */
/* price: número en € · launchPrice: precio de lanzamiento (opcional) ·
 * kind: 'servicio' | 'programa' | 'mantenimiento' · featured: destacado ·
 * compare: atributos para el comparador. */
export const nutritionPlans = [
  {
    id: 'valoracion',
    name: 'Consulta de valoración',
    kind: 'servicio',
    price: 65,
    launchPrice: 59,
    duration: '60–75 min',
    summary: 'Primera sesión para conocer tu situación, objetivos, horarios y dificultades.',
    includes: [
      'Cuestionario previo',
      'Consulta online de 60–75 min',
      'Historia clínica y dietética',
      'Revisión de horarios, actividad y preferencias',
      'Definición de objetivos realistas',
      '3 primeras acciones para empezar',
      'Estrategia/planificación personalizada (entrega en 48–72 h)',
      'Una ronda de aclaraciones',
    ],
    cta: 'Reservar valoración',
    featured: false,
  },
  {
    id: 'seguimiento',
    name: 'Seguimiento individual',
    kind: 'servicio',
    price: 49,
    duration: '35–40 min',
    summary: 'Revisión de evolución y ajustes. Pensado para quien ya hizo una consulta inicial.',
    includes: [
      'Revisión de evolución y adherencia',
      'Identificación de bloqueos',
      'Ajustes del plan y nuevos objetivos',
      'Resumen escrito',
      'Dudas durante las siguientes 48 h',
    ],
    cta: 'Reservar seguimiento',
    note: 'Requiere una consulta inicial previa.',
    featured: false,
  },
  {
    id: 'impulso',
    name: 'Plan Impulso',
    kind: 'programa',
    price: 159,
    launchPrice: 149,
    duration: '8 semanas',
    summary: 'Para personas autónomas que necesitan estructura profesional sin seguimiento intensivo.',
    includes: [
      'Consulta inicial',
      '2 consultas de seguimiento',
      'Plan nutricional personalizado',
      '2 ajustes del plan',
      'Guía de sustituciones',
      'Recetario básico',
      'Plantilla de lista de la compra',
      'Formulario semanal',
      'Soporte limitado por WhatsApp/email (24–48 h laborables)',
    ],
    compare: { sesiones: '3', frecuencia: 'Mensual', soporte: 'Limitado', materiales: 'Sí', fraccionado: 'No' },
    cta: 'Empezar con Impulso',
    featured: false,
  },
  {
    id: 'cambio-sostenible',
    name: 'Cambio Sostenible',
    kind: 'programa',
    price: 299,
    launchPrice: 269,
    duration: '12 semanas',
    summary: 'El programa principal: el mejor equilibrio entre acompañamiento y precio.',
    includes: [
      'Consulta inicial de 60–75 min',
      '5 seguimientos quincenales',
      'Evaluación semanal por formulario',
      'Plan nutricional personalizado',
      'Ajustes quincenales (hasta 2 revisiones importantes)',
      'Guía de equivalencias y sustituciones',
      'Recetas y lista de la compra',
      'Estrategias para restaurantes, viajes y fines de semana',
      'Soporte por WhatsApp L–V (24–48 h laborables)',
      'Plan final de mantenimiento',
    ],
    compare: { sesiones: '6', frecuencia: 'Quincenal', soporte: 'WhatsApp L–V', materiales: 'Completo', fraccionado: '3 × 109 €' },
    payment: { single: 299, installments: '3 × 109 €' },
    cta: 'Quiero un cambio sostenible',
    featured: true,
  },
  {
    id: 'intensivo',
    name: 'Acompañamiento Intensivo',
    kind: 'programa',
    price: 429,
    launchPrice: 389,
    duration: '12 semanas',
    summary: 'Todo lo de Cambio Sostenible, con más contacto, supervisión y rapidez en los ajustes.',
    includes: [
      'Todo el Plan Cambio Sostenible',
      '6 minisesiones adicionales de 15 min',
      'Revisión personalizada semanal',
      'Prioridad en las respuestas y ajustes más frecuentes',
      'Planificación de situaciones especiales',
      'Análisis de diarios de comidas o fotografías',
      'Revisión de información clínica (dentro de las competencias)',
      'Informe final de evolución',
      'Una consulta adicional el mes posterior',
    ],
    compare: { sesiones: '6 + 6 mini', frecuencia: 'Semanal', soporte: 'Prioritario L–V', materiales: 'Completo', fraccionado: '3 × 155 €' },
    payment: { single: 429, installments: '3 × 155 €' },
    cta: 'Necesito acompañamiento intensivo',
    featured: false,
  },
  {
    id: 'mantenimiento',
    name: 'Plan Mantenimiento',
    kind: 'mantenimiento',
    price: 69,
    period: '/mes',
    duration: 'Renovación mensual',
    summary: 'Para quien ha terminado un programa y quiere mantener los hábitos con apoyo.',
    includes: [
      '1 consulta mensual de 40 min',
      'Formulario semanal',
      '1 ajuste mensual',
      'Soporte limitado L–V',
      'Acceso a nuevos materiales y recetas',
    ],
    variant: { name: 'Mantenimiento Plus', price: 99, period: '/mes', extra: 'Incluye 2 consultas mensuales.' },
    cta: 'Continuar en mantenimiento',
    featured: false,
  },
];

/* ---- Home: problema, método, beneficios ---- */
export const problems = [
  'Empiezas dietas, pero terminas abandonándolas.',
  'No sabes qué comer cuando tienes poco tiempo.',
  'Comes bien entre semana y pierdes el control el fin de semana.',
  'Entrenas, pero no ves los resultados que esperabas.',
  'Te cuesta organizar la compra y las comidas.',
  'Sientes que para mejorar necesitas eliminar demasiados alimentos.',
  'Recuperas el peso después de cada dieta.',
];

export const methodology = [
  { n: 1, title: 'Evaluamos tu situación', text: 'Conocemos tus hábitos, horarios, preferencias, objetivos y dificultades.' },
  { n: 2, title: 'Creamos una estrategia realista', text: 'Diseñamos una planificación flexible y adaptada a tu contexto.' },
  { n: 3, title: 'Aplicamos y revisamos', text: 'Ponemos en práctica los cambios y analizamos qué está funcionando.' },
  { n: 4, title: 'Ajustamos', text: 'Modificamos la estrategia cuando sea necesario.' },
  { n: 5, title: 'Consolidamos', text: 'Trabajamos para que mantengas los resultados con más autonomía.' },
];

export const benefits = [
  'Saber organizar tus comidas',
  'Tener alternativas cuando comes fuera',
  'Reducir la improvisación',
  'Mejorar tu relación con la planificación',
  'Entender qué cambios producen resultados',
  'Dejar de depender de dietas cerradas',
  'Sentirte acompañado durante el proceso',
  'Aprender a mantener los hábitos',
];

export const trustItems = [
  'Atención online',
  'Plan personalizado',
  'Seguimiento profesional',
  'Alimentación flexible',
  'Más de 2 años de experiencia',
];

/* ---- FAQ ---- */
export const faqs = [
  { q: '¿Necesito hacer una dieta estricta?', a: 'No. El enfoque adapta la alimentación a tus horarios, preferencias y objetivos. Puede haber una planificación, pero flexible y educativa.' },
  { q: '¿Los planes son personalizados?', a: 'Sí. La estrategia se adapta a la información de la valoración y a tu evolución durante el proceso.' },
  { q: '¿Cuándo recibiré mi planificación?', a: 'La documentación inicial se entrega habitualmente en 48–72 h tras la consulta, salvo que se indique otra cosa.' },
  { q: '¿Puedo escribir por WhatsApp?', a: 'Sí, cuando el programa lo incluya. Las respuestas se realizan de lunes a viernes, normalmente en 24–48 h laborables.' },
  { q: '¿Puedo cancelar o cambiar una sesión?', a: 'Sí, con al menos 24 horas de antelación.' },
  { q: '¿Trabajas con patologías?', a: 'Depende del caso, la formación y las competencias profesionales. Algunos casos pueden requerir coordinación o derivación a otros profesionales sanitarios.' },
  { q: '¿Se garantizan los resultados?', a: 'No. Los resultados dependen de múltiples factores: punto de partida, adherencia, contexto y evolución individual.' },
  { q: '¿Puedo pagar a plazos?', a: 'Los programas de 12 semanas pueden tener pago fraccionado. El coste total fraccionado puede ser ligeramente superior.' },
  { q: '¿Qué programa debería elegir?', a: 'La consulta o llamada de valoración permite recomendar la opción más adecuada para ti.' },
];

/* ---- Límites del servicio y condiciones (editable, no es asesoría legal) ---- */
export const serviceSupportText =
  'Podrás enviar tus dudas de lunes a viernes. Las consultas se responden habitualmente en 24–48 h laborables. Este canal no sustituye una consulta profesional ni debe usarse para situaciones urgentes.';

export const commercialConditions = [
  'El pago se realiza antes de comenzar.',
  'Las sesiones pueden modificarse o cancelarse con un mínimo de 24 h de antelación.',
  'Las cancelaciones con menos de 24 h pueden considerarse realizadas.',
  'El Plan Impulso tiene una caducidad máxima de 10 semanas.',
  'El Plan Cambio Sostenible tiene una caducidad máxima de 16 semanas.',
  'Las sesiones no utilizadas dentro del periodo pueden perderse, salvo causa justificada.',
  'Los mensajes no sustituyen una consulta.',
  'Las situaciones fuera de las competencias profesionales serán derivadas.',
  'Los programas no sustituyen diagnóstico ni tratamiento médico.',
  'Las urgencias deben dirigirse a los servicios sanitarios correspondientes.',
];

export const medicalDisclaimer =
  'Este servicio se centra en alimentación, hábitos y composición corporal en población general. Algunos casos (patologías complejas, trastornos de la conducta alimentaria o enfermedades que requieran atención clínica especializada) pueden necesitar atención médica o derivación a otro profesional.';

/* ---- Testimonios: vacío hasta tener reales y con consentimiento ---- */
export const showTestimonials = false;
export const testimonials = []; // { name, context, quote, result, image, consentConfirmed }

/* ---- Opciones del formulario de valoración ---- */
export const objetivoOptions = [
  'Pérdida de grasa',
  'Mejora de hábitos',
  'Composición corporal',
  'Nutrición deportiva',
  'Organización de comidas',
  'Otro',
];

/* ---- SEO ---- */
export const seo = {
  title: 'Maria Torre · Nutricionista online | Pierde grasa sin vivir a dieta',
  description:
    'Acompañamiento nutricional online flexible y sostenible. Aprende a organizarte, comer con flexibilidad y construir hábitos que puedas mantener. Más de 2 años de experiencia.',
};
