/* eslint-disable react-refresh/only-export-components */
/* Store de LaNutria — Context + reducer + persistencia local.
 *
 * Capa de datos modular: las páginas nunca tocan localStorage directamente,
 * solo llaman a las acciones de este store. Para conectar un backend más
 * adelante basta con sustituir el reducer/persistencia por llamadas a una API
 * (la forma de las acciones ya está pensada como operaciones CRUD por entidad).
 */
import { createContext, useContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import { buildSeed } from './seed.js';

const STORAGE_KEY = 'lanutria.store.v1';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* almacenamiento no disponible: usamos semilla */
  }
  return buildSeed();
}

function touch(entity, author = 'Elena Vidal') {
  return { ...entity, updatedAt: new Date().toISOString(), author: entity.author || author };
}

function reducer(state, action) {
  switch (action.type) {
    /* ---- Pacientes ---- */
    case 'patient/add':
      return { ...state, patients: [touch(action.patient), ...state.patients] };
    case 'patient/update':
      return {
        ...state,
        patients: state.patients.map((p) => (p.id === action.patient.id ? touch({ ...p, ...action.patient }) : p)),
      };
    case 'patient/patch':
      return {
        ...state,
        patients: state.patients.map((p) => (p.id === action.id ? touch({ ...p, [action.key]: action.value }) : p)),
      };
    case 'patient/archive':
      return {
        ...state,
        patients: state.patients.map((p) => (p.id === action.id ? touch({ ...p, status: 'inactive' }) : p)),
      };
    case 'patient/delete': // eliminación lógica
      return {
        ...state,
        patients: state.patients.map((p) => (p.id === action.id ? touch({ ...p, deleted: true }) : p)),
      };

    /* ---- Citas ---- */
    case 'appt/save': {
      const exists = state.appointments.some((a) => a.id === action.appt.id);
      return {
        ...state,
        appointments: exists
          ? state.appointments.map((a) => (a.id === action.appt.id ? action.appt : a))
          : [...state.appointments, action.appt],
      };
    }
    case 'appt/delete':
      return { ...state, appointments: state.appointments.filter((a) => a.id !== action.id) };

    /* ---- Contenido ---- */
    case 'content/set':
      return { ...state, content: action.content };

    /* ---- Servicios ---- */
    case 'service/save': {
      const exists = state.services.some((s) => s.id === action.service.id);
      return {
        ...state,
        services: exists
          ? state.services.map((s) => (s.id === action.service.id ? action.service : s))
          : [...state.services, action.service],
      };
    }
    case 'service/delete':
      return { ...state, services: state.services.filter((s) => s.id !== action.id) };

    case 'store/reset':
      return buildSeed();

    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* sin persistencia: la app sigue funcionando en memoria */
    }
  }, [state]);

  /* API de acciones — estable entre renders */
  const api = useMemo(
    () => ({
      addPatient: (patient) => dispatch({ type: 'patient/add', patient }),
      updatePatient: (patient) => dispatch({ type: 'patient/update', patient }),
      patchPatient: (id, key, value) => dispatch({ type: 'patient/patch', id, key, value }),
      archivePatient: (id) => dispatch({ type: 'patient/archive', id }),
      deletePatient: (id) => dispatch({ type: 'patient/delete', id }),
      saveAppointment: (appt) => dispatch({ type: 'appt/save', appt }),
      deleteAppointment: (id) => dispatch({ type: 'appt/delete', id }),
      setContent: (content) => dispatch({ type: 'content/set', content }),
      saveService: (service) => dispatch({ type: 'service/save', service }),
      deleteService: (id) => dispatch({ type: 'service/delete', id }),
      reset: () => dispatch({ type: 'store/reset' }),
    }),
    []
  );

  const value = useMemo(() => {
    const livePatients = state.patients.filter((p) => !p.deleted);
    return { ...state, livePatients, ...api };
  }, [state, api]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore debe usarse dentro de <StoreProvider>');
  return ctx;
}

/* Selector de un paciente vivo por id (con setContent helper para sub-registros). */
export function usePatient(id) {
  const { patients, updatePatient } = useStore();
  const patient = patients.find((p) => p.id === id) || null;
  const update = useCallback((partial) => patient && updatePatient({ id: patient.id, ...partial }), [patient, updatePatient]);
  return { patient, update };
}
