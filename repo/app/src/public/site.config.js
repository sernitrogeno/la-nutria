/* ===========================================================================
 * Configuración central del negocio y de la web pública.
 * TODO el contenido y los precios viven aquí (fuente única). Cambiar la web =
 * editar este archivo. Ningún precio está escrito a mano en los componentes.
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
  bookingUrl: '',            // [ENLACE DE RESERVA] — vacío = el CTA lleva al formulario
  colegiado: '',             // [Nº COLEGIADO/A]
  titulacion: '',            // [TITULACIÓN OFICIAL]
  formacion: [],             // ['[Máster en ...]']
  social: { instagram: '', tiktok: '' },
};

/* ---- Tarifa fundadora (activable/desactivable desde aquí) ----
 * enabled false → solo se muestra la tarifa estándar.
 * remainingPlaces null → se muestra "Plazas fundadoras limitadas" (sin nº falso). */
export const founderOffer = {
  enabled: true,
  label: 'Tarifa fundadora',
  totalPlaces: 10,
  remainingPlaces: null,     // pon un número real solo si lo controlas de verdad
  showRemainingPlaces: false,
  endDate: null,
  headline: 'Tarifa fundadora para las primeras 10 contrataciones',
  subline: 'Cuando finalice esta primera edición, las nuevas contrataciones pasarán a la tarifa estándar.',
};

/* ---- Tarifa de fidelidad para antiguos clientes (no pública por defecto) ---- */
export const loyaltyPricing = {
  enabled: false,
  maintenance: 89,
  maintenancePlus: 129,
  validityMonths: 12,
};

/* ---- Sesiones individuales (sección secundaria) ---- */
export const individualServices = [
  {
    id: 'valoracion',
    name: 'Valoración nutricional',
    price: 79,
    duration: '60–75 minutos',
    availableToNewClients: true,
    summary: 'Donde empieza el trabajo profesional: revisamos hábitos, horarios y objetivos.',
    includes: ['Cuestionario previo', 'Consulta online de 60–75 min', 'Revisión de hábitos, horarios y preferencias', 'Definición de objetivos', 'Recomendaciones iniciales', 'Resumen de próximos pasos'],
    cta: 'Reservar valoración nutricional',
  },
  {
    id: 'seguimiento',
    name: 'Seguimiento individual',
    price: 59,
    duration: '35–40 minutos',
    availableToNewClients: false,
    summary: 'Revisión de evolución y ajustes. Para quien ya hizo una valoración o un programa.',
    includes: ['Revisión de evolución y adherencia', 'Ajustes del plan', 'Nuevos objetivos', 'Resumen escrito'],
    cta: 'Reservar seguimiento',
  },
];

/* ---- Programas principales ---- */
export const programs = [
  {
    id: 'impulso',
    name: 'Plan Impulso',
    forWhom: 'Para personas autónomas que necesitan una estructura clara y un acompañamiento moderado.',
    duration: '6–8 semanas',
    founderPrice: 199,
    standardPrice: 249,
    featured: false,
    installment: null,
    sessions: 'Valoración + 2 seguimientos',
    support: 'Correo (24–48 h laborables)',
    message: 'La estructura necesaria para empezar a mejorar tu alimentación con autonomía.',
    includes: ['Cuestionario previo', 'Valoración inicial', '2 seguimientos', 'Estrategia nutricional personalizada', '1 ajuste principal', 'Guía de sustituciones', 'Formulario quincenal', 'Dudas por email (24–48 h laborables)'],
    notIncludes: ['WhatsApp continuado', 'Revisión semanal', 'Ajustes ilimitados', 'Minisesiones', 'Análisis frecuente de diarios o fotos'],
    cta: 'Empezar con Impulso',
  },
  {
    id: 'cambio-sostenible',
    name: 'Cambio Sostenible',
    forWhom: 'Para quien quiere perder grasa, mejorar hábitos y aprender a organizarse con acompañamiento profesional.',
    duration: '12 semanas',
    founderPrice: 299,
    standardPrice: 399,
    featured: true,
    installment: { payments: 3, founderAmount: 105, founderTotal: 315, standardAmount: 141, standardTotal: 423 },
    sessions: 'Valoración + 4 seguimientos',
    support: 'Lunes a viernes (24–48 h laborables)',
    message: 'Un acompañamiento de 12 semanas para construir una forma de alimentarte que puedas mantener.',
    includes: ['Cuestionario previo', 'Valoración inicial de 60–75 min', '4 seguimientos', 'Formulario quincenal', 'Estrategia personalizada (hasta 2 ajustes)', 'Guía de equivalencias y sustituciones', 'Estrategias para restaurantes, viajes y fines de semana', 'Soporte L–V (24–48 h) + plan final de continuidad'],
    notIncludes: ['Respuestas inmediatas', 'Disponibilidad en fines de semana', 'Cambios diarios', 'Videollamadas ilimitadas', 'Una planificación nueva cada semana'],
    cta: 'Quiero un cambio sostenible',
  },
  {
    id: 'intensivo',
    name: 'Acompañamiento Intensivo',
    forWhom: 'Para quien necesita mayor frecuencia, responsabilidad, supervisión y rapidez en los ajustes.',
    duration: '12 semanas',
    founderPrice: 449,
    standardPrice: 599,
    featured: false,
    installment: { payments: 3, founderAmount: 159, founderTotal: 477, standardAmount: 212, standardTotal: 636 },
    sessions: 'Valoración + 5 seguimientos + 2 minisesiones',
    support: 'Prioritario L–V (24 h laborables)',
    message: 'Mayor contacto y supervisión para quienes necesitan un acompañamiento más cercano.',
    includes: ['Todo el programa Cambio Sostenible', '5 seguimientos (en vez de 4)', 'Formulario semanal y revisión semanal breve', 'Hasta 3 ajustes importantes', '2 minisesiones de 15 min', 'Soporte prioritario L–V (24 h)', 'Revisión de diarios o fotos en momentos acordados', 'Consulta de continuidad tras el programa'],
    notIncludes: ['La prioridad no significa disponibilidad inmediata', 'No hay soporte 24 h', 'No hay atención de urgencias', 'Las minisesiones caducan con el programa', 'El análisis de fotos se hace en revisiones acordadas, no a diario'],
    cta: 'Solicitar acompañamiento intensivo',
  },
];

/* ---- Mantenimiento (sección secundaria; solo tras completar un programa) ---- */
export const maintenance = {
  title: 'Continúa avanzando después de tu programa',
  subtitle: 'Opciones exclusivas para personas que ya han completado uno de nuestros programas.',
  note: 'No disponible para nuevas altas sin haber completado antes un programa.',
  cta: 'Consultar continuidad',
  plans: [
    { id: 'mantenimiento', name: 'Mantenimiento', price: 99, billingPeriod: 'mes', includes: ['1 consulta mensual', 'Formulario mensual', '1 ajuste mensual', 'Resolución de dudas limitada', 'Acceso a nuevos recursos'] },
    { id: 'mantenimiento-plus', name: 'Mantenimiento Plus', price: 149, billingPeriod: 'mes', includes: ['2 consultas mensuales', 'Formulario quincenal', 'Hasta 2 ajustes mensuales', 'Resolución de dudas limitada', 'Acceso a nuevos recursos'] },
  ],
};

/* ---- Comparativa de programas ---- */
export const comparison = {
  columns: ['Plan Impulso', 'Cambio Sostenible', 'Acompañamiento Intensivo'],
  rows: [
    { label: 'Duración', values: ['6–8 semanas', '12 semanas', '12 semanas'] },
    { label: 'Valoración inicial', values: ['Sí', 'Sí', 'Sí'] },
    { label: 'Seguimientos', values: ['2', '4', '5'] },
    { label: 'Formularios', values: ['Quincenales', 'Quincenales', 'Semanales'] },
    { label: 'Ajustes importantes', values: ['1', 'Hasta 2', 'Hasta 3'] },
    { label: 'Soporte', values: ['Correo', 'Laborables', 'Prioritario'] },
    { label: 'Minisesiones', values: ['No', 'No', '2'] },
    { label: 'Plan de continuidad', values: ['No', 'Sí', 'Sí'] },
  ],
};

/* ---- Llamada gratuita de orientación (NO es consulta nutricional) ---- */
export const orientationCall = {
  title: '¿No sabes qué programa elegir?',
  text: 'Reserva una llamada gratuita de orientación de 15 minutos. Conoceremos brevemente tu situación, resolveremos tus dudas sobre el servicio y veremos qué opción puede encajar mejor contigo.',
  disclaimer: 'No es una consulta nutricional y no incluye valoración, diagnóstico, revisión clínica ni planificación alimentaria.',
  cta: 'Reservar llamada gratuita',
};

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
  { q: '¿La llamada gratuita es una consulta nutricional?', a: 'No. Es una llamada breve para conocer tu situación, resolver dudas sobre el servicio y comprobar qué programa puede encajar contigo. No incluye valoración ni planificación alimentaria.' },
  { q: '¿Por qué existe una tarifa fundadora?', a: 'Es una tarifa limitada para las primeras contrataciones del nuevo servicio online. Al terminar esta primera edición, las nuevas altas pasarán a la tarifa estándar.' },
  { q: '¿Conservaré el precio fundador para siempre?', a: 'La tarifa se respeta durante el programa contratado. Los servicios posteriores pueden tener otras tarifas.' },
  { q: '¿Puedo contratar directamente?', a: 'Sí. Puedes solicitar una plaza sin realizar previamente la llamada gratuita.' },
  { q: '¿Puedo pagar a plazos?', a: 'Los programas de 12 semanas disponen de pago fraccionado. Antes de contratar se muestra tanto el importe de cada pago como el coste total.' },
  { q: '¿El mantenimiento está disponible para nuevos clientes?', a: 'No. Está reservado para personas que ya han completado uno de los programas.' },
  { q: '¿Puedo escribir por WhatsApp?', a: 'Cuando el programa lo incluya, las dudas se responden de lunes a viernes dentro del plazo indicado. El canal no sustituye una consulta ni puede utilizarse para urgencias.' },
  { q: '¿Cómo se realiza el pago?', a: 'El pago se realiza por transferencia o Bizum antes de empezar. Tras confirmar tu plaza te envío los datos para el pago y, en los programas de 12 semanas, la opción de pago fraccionado.' },
];

/* ---- Soporte, condiciones y avisos ---- */
export const serviceSupportText =
  'Podrás enviar tus dudas de lunes a viernes. Las consultas se responden habitualmente en 24–48 h laborables. Este canal no sustituye una consulta profesional ni debe usarse para situaciones urgentes.';

export const commercialConditions = [
  'El pago se realiza antes de comenzar.',
  'Las sesiones pueden modificarse o cancelarse con un mínimo de 24 h de antelación.',
  'Las cancelaciones con menos de 24 h pueden considerarse realizadas.',
  'Las sesiones no utilizadas dentro del periodo pueden perderse, salvo causa justificada.',
  'La tarifa contratada se mantiene hasta finalizar el programa correspondiente.',
  'Los mensajes no sustituyen una consulta.',
  'Las situaciones fuera de las competencias profesionales serán derivadas.',
  'Los programas no sustituyen diagnóstico ni tratamiento médico.',
  'Las urgencias deben dirigirse a los servicios sanitarios correspondientes.',
];

export const medicalDisclaimer =
  'Este servicio se centra en alimentación, hábitos y composición corporal en población general. Algunos casos (patologías complejas, trastornos de la conducta alimentaria o enfermedades que requieran atención clínica especializada) pueden necesitar atención médica o derivación a otro profesional.';

/* ---- Testimonios: vacío hasta tener reales y con consentimiento ---- */
export const showTestimonials = false;
export const testimonials = [];

/* ---- Opciones del formulario ---- */
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
    'Acompañamiento nutricional online flexible y sostenible. Programas de 6–12 semanas para perder grasa, mejorar hábitos y aprender a organizarte. Más de 2 años de experiencia.',
};
