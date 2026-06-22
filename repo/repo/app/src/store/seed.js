/* Datos semilla ficticios de LaNutria. Ningún dato real de pacientes. */
import { newPatient, newAssessment, newNutritionPlan, newWeeklyDiet, meta } from './schema.js';

function patient(base, clinical = {}) {
  const p = newPatient(base);
  return { ...p, ...clinical };
}

/* Construye una dieta semanal de ejemplo (solo algunos días/comidas). */
function sampleDiet() {
  const d = newWeeklyDiet();
  d.days[0].meals = [
    { id: 'm1', slot: 'Desayuno', name: 'Avena con fruta', time: '08:00', prep: 'En frío, reposada toda la noche', notes: '', alternatives: 'Yogur con granola',
      foods: [{ id: 'f1', name: 'Copos de avena', qty: '60', unit: 'g' }, { id: 'f2', name: 'Plátano', qty: '1', unit: 'ud' }, { id: 'f3', name: 'Leche', qty: '200', unit: 'ml' }] },
    { id: 'm2', slot: 'Comida', name: 'Pollo con arroz y verduras', time: '14:00', prep: 'Plancha', notes: '', alternatives: 'Pavo o tofu',
      foods: [{ id: 'f4', name: 'Pechuga de pollo', qty: '150', unit: 'g' }, { id: 'f5', name: 'Arroz', qty: '70', unit: 'g' }] },
  ];
  d.days[1].meals = [
    { id: 'm3', slot: 'Desayuno', name: 'Tostadas de aguacate', time: '08:00', prep: '', notes: '', alternatives: '',
      foods: [{ id: 'f6', name: 'Pan integral', qty: '2', unit: 'reb' }, { id: 'f7', name: 'Aguacate', qty: '1/2', unit: 'ud' }] },
  ];
  return d;
}

function samplePlan() {
  const p = newNutritionPlan();
  return {
    ...p,
    name: 'Plan de mantenimiento equilibrado',
    start: '2025-06-01',
    review: '2025-07-01',
    objective: 'Reducir grasa corporal manteniendo masa muscular.',
    energy: '1850',
    meals: 5,
    protein: '120',
    carbs: '190',
    fat: '60',
    fiber: '30',
    water: '2.0',
    notes: 'Repartir proteína en todas las comidas. Cálculos orientativos, revisar en consulta.',
    recommendations: {
      hydration: 'Al menos 2 L de agua al día, más en días de entreno.',
      fruitsVeg: '5 raciones diarias entre frutas y verduras.',
      cooking: 'Priorizar plancha, horno y vapor.',
      eatingOut: 'Elegir proteína + verdura, evitar salsas pesadas.',
      organization: 'Dejar comidas preparadas el domingo.',
      supplements: '',
      other: '',
    },
    substitutions: [
      { id: 's1', group: 'Proteínas', food: 'Pechuga de pollo', qty: '150', unit: 'g', sub: 'Lomos de pavo', subQty: '150', unit2: 'g', notes: '' },
      { id: 's2', group: 'Hidratos de carbono', food: 'Arroz', qty: '70', unit: 'g', sub: 'Pasta integral', subQty: '70', notes: 'En seco' },
      { id: 's3', group: 'Frutas', food: 'Plátano', qty: '1', unit: 'ud', sub: 'Manzana', subQty: '1', notes: '' },
    ],
    ...meta(),
  };
}

const martaAssessment = {
  ...newAssessment(),
  goals: ['Pérdida de peso', 'Mejora de hábitos alimentarios'],
  goalDescription: 'Bajar grasa corporal de forma sostenible sin pasar hambre.',
  motivation: 8,
  conditions: [],
  allergies: 'Frutos secos',
  intolerances: 'Lactosa (leve)',
  dietType: 'Omnívora',
  activityLevel: 'Moderadamente activo',
  exerciseType: 'Fuerza 3 días/semana',
  completedSteps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  updatedAt: '2025-02-10T10:00:00.000Z',
};

export function buildSeed() {
  const patients = [
    patient(
      {
        id: 'pat_marta',
        firstName: 'Marta',
        lastName: 'Iglesias',
        birthDate: '1990-04-12',
        phone: '600 111 222',
        email: 'marta.iglesias@email.com',
        profession: 'Diseñadora',
        status: 'active',
        admittedAt: '2025-02-01',
        lastConsult: '2025-06-12',
        nextReview: '2025-06-20',
        observations: 'Muy constante. Trabaja desde casa.',
      },
      {
        assessment: martaAssessment,
        plan: samplePlan(),
        weeklyDiet: sampleDiet(),
        measurements: [
          { id: 'me1', date: '2025-02-01', weight: '74', height: '166', waist: '88', hip: '102', fatPct: '34', musclePct: '28', usualWeight: '72', targetWeight: '66', notes: 'Inicio', ...meta() },
          { id: 'me2', date: '2025-04-01', weight: '71', height: '166', waist: '84', hip: '99', fatPct: '31', musclePct: '29', notes: '', ...meta() },
          { id: 'me3', date: '2025-06-01', weight: '68.5', height: '166', waist: '80', hip: '96', fatPct: '28', musclePct: '31', notes: 'Gran progreso', ...meta() },
        ],
        followUps: [
          { id: 'fu1', date: '2025-04-01', weight: '71', waist: '84', fatPct: '31', adherence: 8, hunger: 4, energy: 8, sleep: 7, stress: 4, symptoms: [], wentWell: 'Desayunos resueltos', difficulties: 'Cenas fuera el finde', hardMeals: 'Cena', changes: 'Añadimos snack de tarde', nextGoal: 'Mantener adherencia', nextReview: '2025-06-01', ...meta() },
          { id: 'fu2', date: '2025-06-01', weight: '68.5', waist: '80', fatPct: '28', adherence: 9, hunger: 3, energy: 9, sleep: 8, stress: 3, symptoms: ['Gases'], wentWell: 'Mucha energía en entrenos', difficulties: 'Poca', hardMeals: '—', changes: 'Subimos hidratos en días de fuerza', nextGoal: 'Recomposición', nextReview: '2025-07-01', ...meta() },
        ],
        notes: [
          { id: 'n1', title: 'Valoración general', assessment: 'Perfil muy trabajable, alta motivación.', priorities: 'Estabilizar cenas de fin de semana.', pending: 'Pedir analítica reciente.', clinical: 'Vigilar lactosa.', reminders: 'Preguntar por dolores de cabeza.', tags: ['prioritaria', 'analítica'], ...meta() },
        ],
      }
    ),
    patient(
      {
        id: 'pat_javier',
        firstName: 'Javier',
        lastName: 'Roldán',
        birthDate: '1985-09-30',
        phone: '600 333 444',
        email: 'javier.roldan@email.com',
        profession: 'Ingeniero',
        status: 'active',
        admittedAt: '2024-11-15',
        lastConsult: '2025-06-14',
        nextReview: '2025-06-21',
      },
      {
        assessment: { ...newAssessment(), goals: ['Ganancia de masa muscular', 'Rendimiento deportivo'], motivation: 9, activityLevel: 'Muy activo', dietType: 'Omnívora', completedSteps: [0, 1, 2, 6] },
        measurements: [
          { id: 'mj1', date: '2024-11-15', weight: '78', height: '180', waist: '85', fatPct: '18', musclePct: '40', ...meta() },
          { id: 'mj2', date: '2025-06-01', weight: '81', height: '180', waist: '84', fatPct: '16', musclePct: '43', ...meta() },
        ],
        followUps: [],
        notes: [],
      }
    ),
    patient({
      id: 'pat_carla',
      firstName: 'Carla',
      lastName: 'Soto',
      birthDate: '1996-01-22',
      phone: '600 555 666',
      email: 'carla.soto@email.com',
      profession: 'Comercial',
      status: 'inactive',
      admittedAt: '2025-05-01',
      lastConsult: '2025-06-01',
      nextReview: '',
      observations: 'Pausa temporal por viaje de trabajo.',
    }),
    patient(
      {
        id: 'pat_diego',
        firstName: 'Diego',
        lastName: 'Fernández',
        birthDate: '1992-07-08',
        phone: '600 777 888',
        email: 'diego.fernandez@email.com',
        profession: 'Profesor de educación física',
        status: 'pending',
        admittedAt: '2025-06-10',
        lastConsult: '',
        nextReview: '2025-06-22',
      },
      { assessment: { ...newAssessment(), goals: ['Rendimiento deportivo'], completedSteps: [0] } }
    ),
    patient({
      id: 'pat_lucia',
      firstName: 'Lucía',
      lastName: 'Prieto',
      birthDate: '1988-11-03',
      phone: '600 999 000',
      email: 'lucia.prieto@email.com',
      profession: 'Enfermera',
      status: 'active',
      admittedAt: '2025-06-05',
      lastConsult: '2025-06-10',
      nextReview: '2025-06-25',
    }),
  ];

  const appointments = [
    { id: 1, patientId: 'pat_marta', clientName: 'Marta Iglesias', type: 'Seguimiento mensual', date: '2025-06-16', start: '10:00', dur: 60, done: false },
    { id: 2, patientId: 'pat_diego', clientName: 'Diego Fernández', type: 'Primera consulta', date: '2025-06-16', start: '12:30', dur: 75, done: false },
    { id: 3, patientId: 'pat_lucia', clientName: 'Lucía Prieto', type: 'Revisión de plan', date: '2025-06-16', start: '17:00', dur: 45, done: true },
    { id: 4, patientId: 'pat_lucia', clientName: 'Lucía Prieto', type: 'Seguimiento mensual', date: '2025-06-17', start: '16:00', dur: 60, done: false },
    { id: 5, patientId: 'pat_diego', clientName: 'Diego Fernández', type: 'Seguimiento mensual', date: '2025-06-18', start: '11:00', dur: 60, done: false },
    { id: 6, patientId: 'pat_carla', clientName: 'Carla Soto', type: 'Check-in rápido', date: '2025-06-18', start: '18:00', dur: 30, done: false },
    { id: 7, patientId: 'pat_javier', clientName: 'Javier Roldán', type: 'Seguimiento mensual', date: '2025-06-19', start: '18:30', dur: 60, done: false },
    { id: 8, patientId: 'pat_marta', clientName: 'Marta Iglesias', type: 'Check-in rápido', date: '2025-06-20', start: '09:30', dur: 30, done: false },
    { id: 9, patientId: 'pat_diego', clientName: 'Diego Fernández', type: 'Primera consulta', date: '2025-06-20', start: '13:00', dur: 75, done: false },
    { id: 10, patientId: 'pat_lucia', clientName: 'Lucía Prieto', type: 'Check-in rápido', date: '2025-06-13', start: '10:00', dur: 30, done: true },
    { id: 11, patientId: 'pat_javier', clientName: 'Javier Roldán', type: 'Revisión de plan', date: '2025-06-23', start: '12:00', dur: 45, done: false },
    { id: 12, patientId: 'pat_marta', clientName: 'Marta Iglesias', type: 'Seguimiento mensual', date: '2025-06-24', start: '18:00', dur: 60, done: false },
    { id: 13, patientId: 'pat_diego', clientName: 'Diego Fernández', type: 'Seguimiento mensual', date: '2025-07-02', start: '11:00', dur: 60, done: false },
  ];

  const content = [
    { id: 1, title: '5 mitos sobre el desayuno', platform: 'Instagram', date: '19 jun', column: 'idea' },
    { id: 2, title: 'Cómo leer etiquetas sin agobiarte', platform: 'Blog', date: '21 jun', column: 'idea' },
    { id: 3, title: 'Receta: bowl de avena express', platform: 'TikTok', date: '20 jun', column: 'draft' },
    { id: 4, title: 'Newsletter de junio', platform: 'Newsletter', date: '24 jun', column: 'draft' },
    { id: 5, title: 'Snacks para media tarde', platform: 'Instagram', date: '22 jun', column: 'ready' },
    { id: 6, title: '3 señales de que comes suficiente', platform: 'TikTok', date: '23 jun', column: 'ready' },
    { id: 7, title: 'Testimonio: el plan de Marta', platform: 'Instagram', date: '15 jun', column: 'published' },
    { id: 8, title: 'Newsletter de mayo', platform: 'Newsletter', date: '30 may', column: 'published' },
  ];

  const services = [
    { id: 1, name: 'Sesión única', price: '35€', period: null, description: 'Una consulta puntual para resolver dudas o hacer un primer diagnóstico.', features: ['Valoración inicial', 'Recomendaciones personalizadas', 'Sin compromiso'], highlighted: false },
    { id: 2, name: 'Plan mensual', price: '49€', period: '/mes', description: 'Acompañamiento continuo con seguimiento semanal y ajustes del plan.', features: ['4 sesiones de seguimiento', 'Plan adaptado cada semana', 'Chat de apoyo entre sesiones'], highlighted: true },
    { id: 3, name: 'Plan trimestral', price: '120€', period: '/trim.', description: 'El acompañamiento más completo para resultados duraderos.', features: ['12 sesiones de seguimiento', 'Plan adaptado cada semana', 'Chat de apoyo entre sesiones', 'Revisión de objetivos mensual'], highlighted: false },
  ];

  return { patients, appointments, content, services };
}

export const ME = { name: 'Elena Vidal', role: 'Nutricionista' };

export const SESSION_TYPES = ['Primera consulta', 'Seguimiento mensual', 'Revisión de plan', 'Check-in rápido'];
export const TYPE_COLORS = {
  'Primera consulta': '#2f6f4f',
  'Seguimiento mensual': '#7e9b76',
  'Revisión de plan': '#bf923a',
  'Check-in rápido': '#a9805a',
};
export const DURATIONS = [30, 45, 60, 90];
export const CONTENT_COLUMNS = [
  { id: 'idea', label: 'Idea', color: '#bf923a' },
  { id: 'draft', label: 'Borrador', color: '#7e9b76' },
  { id: 'ready', label: 'Listo', color: '#4f9a76' },
  { id: 'published', label: 'Publicado', color: '#9aa39a' },
];
