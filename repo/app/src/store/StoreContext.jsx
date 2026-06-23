/* eslint-disable react-refresh/only-export-components */
/* Store de LaNutria — Context + reducer + persistencia.
 *
 * Capa de datos modular: las páginas nunca tocan el almacenamiento
 * directamente, solo llaman a las acciones de este store. La persistencia
 * tiene dos modos transparentes para la UI:
 *
 *   • Sin backend configurado  → localStorage (la app arranca sin nada).
 *   • Con Supabase configurado → la nube (ver src/backend/). localStorage
 *     queda como caché local para arranque instantáneo y trabajo offline.
 *
 * La sincronización con el backend es por diferencias: en cada cambio de
 * estado solo se suben las entidades que realmente cambiaron.
 */
import { createContext, useContext, useEffect, useReducer, useCallback, useMemo, useRef } from 'react';
import { buildSeed } from './seed.js';
import { getCurrentUserName } from './schema.js';
import * as backend from '../backend/index.js';

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

function touch(entity, author = getCurrentUserName()) {
  return { ...entity, updatedAt: new Date().toISOString(), author: entity.author || author };
}

function reducer(state, action) {
  switch (action.type) {
    /* ---- Hidratación desde backend ---- */
    case 'store/hydrate':
      return action.state;

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

/* Sube al backend solo lo que cambió entre dos versiones de una colección.
 * `remove` es opcional: los pacientes no se borran físicamente (borrado lógico
 * vía upsert con deleted=true), así que para ellos no se pasa. */
function syncCollection(prev = [], next = [], upsert, remove) {
  const prevMap = new Map(prev.map((x) => [x.id, x]));
  for (const item of next) {
    const before = prevMap.get(item.id);
    if (before !== item) upsert(item); // referencia nueva o distinta = creado/modificado
    prevMap.delete(item.id);
  }
  if (remove) for (const id of prevMap.keys()) remove(id);
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);
  const prevRef = useRef(null);
  const bootstrapped = useRef(false);

  /* Arranque: si hay backend, cargamos de la nube o sembramos si está vacía. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (backend.isConfigured) {
        try {
          const remote = await backend.loadAll();
          if (cancelled) return;
          if (remote) {
            prevRef.current = remote;
            dispatch({ type: 'store/hydrate', state: remote });
          } else {
            await backend.seedAll(state);
            prevRef.current = state;
          }
        } catch (e) {
          console.warn('[backend:bootstrap]', e.message);
        }
      }
      bootstrapped.current = true;
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Caché local: siempre escribimos (también sirve para modo offline). */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* sin persistencia local: la app sigue funcionando en memoria */
    }
  }, [state]);

  /* Sincronización con el backend por diferencias. */
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = state;
    if (!backend.isConfigured || !bootstrapped.current) return;
    if (!prev || prev === state) return;
    syncCollection(prev.patients, state.patients, (p) => backend.savePatient(p));
    syncCollection(prev.appointments, state.appointments, (a) => backend.saveSimple('appointments', a), (id) => backend.removeRow('appointments', id));
    syncCollection(prev.content, state.content, (c) => backend.saveSimple('content', c), (id) => backend.removeRow('content', id));
    syncCollection(prev.services, state.services, (s) => backend.saveSimple('services', s), (id) => backend.removeRow('services', id));
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
