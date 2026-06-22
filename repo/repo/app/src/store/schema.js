/* Modelo de datos de LaNutria — fábricas de entidades.
 *
 * Diseño modular y escalable: cada entidad lleva metadatos comunes
 * (id, createdAt, updatedAt, author, status) para mapear sin fricción a un
 * backend/BBDD más adelante. La persistencia actual es local (ver StoreContext),
 * pero las formas de datos están pensadas como tablas/colecciones independientes
 * aunque hoy se almacenen anidadas bajo cada paciente.
 *
 * Entidades: Professional, Patient, PatientGoal, AnthropometricMeasurement,
 * MedicalHistory, Allergy/Intolerance, LifestyleProfile, PhysicalActivity,
 * DietaryHistory, FoodRecord, DigestiveSymptom, NutritionPlan, WeeklyDiet,
 * DietDay, Meal, MealFood, FoodSubstitution, Recommendation, FollowUp,
 * ProfessionalNote.
 */

let counter = Date.now();
export const uid = (prefix = 'id') => `${prefix}_${(counter++).toString(36)}`;

const now = () => new Date().toISOString();

export function meta(author = 'Elena Vidal') {
  const t = now();
  return { createdAt: t, updatedAt: t, author, deleted: false };
}

/* ---- Catálogos (constantes de dominio) ---- */
export const GOAL_OPTIONS = [
  'Pérdida de peso',
  'Ganancia de masa muscular',
  'Mejora de hábitos alimentarios',
  'Rendimiento deportivo',
  'Control de una patología',
  'Salud digestiva',
  'Embarazo o lactancia',
  'Otro',
];

export const MEDICAL_CONDITIONS = [
  'Diabetes',
  'Hipertensión',
  'Colesterol elevado',
  'Enfermedad cardiovascular',
  'Enfermedad renal',
  'Enfermedad hepática',
  'Problemas digestivos',
  'Alteraciones tiroideas',
  'Trastornos de la conducta alimentaria',
  'Otras enfermedades',
];

export const DIGESTIVE_SYMPTOMS = [
  'Hinchazón abdominal',
  'Gases',
  'Estreñimiento',
  'Diarrea',
  'Acidez',
  'Reflujo',
  'Dolor abdominal',
  'Náuseas',
  'Digestiones pesadas',
  'Otros',
];

export const ACTIVITY_LEVELS = ['Sedentario', 'Poco activo', 'Moderadamente activo', 'Muy activo'];
export const DIET_TYPES = ['Omnívora', 'Vegetariana', 'Vegana', 'Otra'];
export const PATIENT_STATUS = ['active', 'pending', 'inactive'];
export const MEAL_SLOTS = ['Desayuno', 'Media mañana', 'Comida', 'Merienda', 'Cena', 'Otros'];
export const WEEK_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const SUBSTITUTION_GROUPS = ['Proteínas', 'Hidratos de carbono', 'Verduras', 'Frutas', 'Grasas saludables', 'Lácteos o alternativas', 'Otros'];

/* ---- Fábricas ---- */
export function newMeal(slot = 'Desayuno') {
  return { id: uid('meal'), slot, name: '', time: '', foods: [], prep: '', notes: '', alternatives: '' };
}

export function newMealFood() {
  return { id: uid('food'), name: '', qty: '', unit: 'g' };
}

export function newDietDay(day) {
  return { id: uid('day'), day, meals: [] };
}

export function newWeeklyDiet() {
  return { id: uid('diet'), days: WEEK_DAYS.map((d) => newDietDay(d)), ...meta() };
}

export function newMeasurement() {
  return {
    id: uid('meas'),
    date: new Date().toISOString().slice(0, 10),
    weight: '',
    height: '',
    usualWeight: '',
    targetWeight: '',
    waist: '',
    hip: '',
    fatPct: '',
    musclePct: '',
    notes: '',
    ...meta(),
  };
}

export function newFollowUp() {
  return {
    id: uid('fu'),
    date: new Date().toISOString().slice(0, 10),
    weight: '',
    waist: '',
    hip: '',
    fatPct: '',
    musclePct: '',
    adherence: 7,
    hunger: 5,
    energy: 7,
    sleep: 7,
    stress: 5,
    symptoms: [],
    wentWell: '',
    difficulties: '',
    hardMeals: '',
    changes: '',
    nextGoal: '',
    nextReview: '',
    ...meta(),
  };
}

export function newNote() {
  return {
    id: uid('note'),
    title: '',
    assessment: '',
    priorities: '',
    pending: '',
    clinical: '',
    reminders: '',
    tags: [],
    ...meta(),
  };
}

export function newSubstitution(group = 'Proteínas') {
  return { id: uid('sub'), group, food: '', qty: '', unit: 'g', sub: '', subQty: '', notes: '' };
}

export function newNutritionPlan() {
  return {
    id: uid('plan'),
    name: '',
    start: '',
    end: '',
    review: '',
    objective: '',
    energy: '',
    meals: 5,
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    water: '',
    notes: '',
    recommendations: {
      hydration: '',
      fruitsVeg: '',
      cooking: '',
      eatingOut: '',
      organization: '',
      supplements: '',
      other: '',
    },
    substitutions: [],
    ...meta(),
  };
}

export function newAssessment() {
  return {
    /* 2. Objetivo */
    goals: [],
    goalDescription: '',
    motivation: 7,
    targetDate: '',
    goalNotes: '',
    /* 3. Antropometría (medición inicial) */
    measurement: newMeasurement(),
    /* 4. Información médica */
    conditions: [],
    diagnoses: '',
    surgeries: '',
    familyHistory: '',
    medication: '',
    supplements: '',
    labs: '',
    medicalNotes: '',
    /* 5. Alergias y preferencias */
    allergies: '',
    intolerances: '',
    avoidFoods: '',
    dislikedFoods: '',
    preferredFoods: '',
    dietType: 'Omnívora',
    /* 6. Hábitos */
    workSchedule: '',
    wakeTime: '',
    sleepTime: '',
    sleepHours: '',
    sleepQuality: 7,
    stress: 5,
    tobacco: 'No',
    alcohol: 'No',
    water: '',
    habitsNotes: '',
    /* 7. Actividad física */
    activityLevel: 'Moderadamente activo',
    exerciseType: '',
    trainingDays: '',
    trainingDuration: '',
    trainingTime: '',
    sportGoal: '',
    injuries: '',
    activityNotes: '',
    /* 8. Historia dietética */
    mealsPerDay: '',
    whoCooks: '',
    eatsOut: '',
    cookingTime: '',
    budget: '',
    pastDiets: '',
    pastResults: '',
    rebound: 'No',
    foodRelationship: '',
    eatingAnxiety: '',
    boredomEating: '',
    bingeing: 'No',
    foodFears: '',
    dietaryNotes: '',
    /* 9. Registro alimentario habitual */
    foodRecord: { breakfast: '', midMorning: '', lunch: '', snack: '', dinner: '', between: '', drinks: '', weekendDiff: '' },
    /* 10. Síntomas digestivos */
    digestive: [],
    stoolFrequency: '',
    bristol: '',
    digestiveNotes: '',
    /* meta */
    completedSteps: [],
    updatedAt: null,
  };
}

export function newPatient(overrides = {}) {
  return {
    id: uid('pat'),
    firstName: '',
    lastName: '',
    birthDate: '',
    phone: '',
    email: '',
    profession: '',
    photo: null,
    admittedAt: new Date().toISOString().slice(0, 10),
    status: 'pending',
    professional: 'Elena Vidal',
    observations: '',
    lastConsult: '',
    nextReview: '',
    /* sub-registros clínicos (colecciones embebidas) */
    assessment: newAssessment(),
    plan: newNutritionPlan(),
    weeklyDiet: newWeeklyDiet(),
    measurements: [],
    followUps: [],
    notes: [],
    ...meta(),
    ...overrides,
  };
}

/* Helpers derivados */
export const fullName = (p) => `${p.firstName} ${p.lastName}`.trim();
export const initials = (name) =>
  (name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export function bmi(weight, height) {
  const w = parseFloat(weight);
  const h = parseFloat(height) / 100;
  if (!w || !h) return null;
  return +(w / (h * h)).toFixed(1);
}

export const statusLabel = { active: 'Activo', pending: 'Pendiente', inactive: 'Inactivo' };
