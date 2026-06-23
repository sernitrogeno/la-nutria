/* API de datos de LaNutria contra Supabase.
 *
 * Punto único de acceso al backend. El store (StoreContext) llama a estas
 * funciones; las pantallas nunca tocan Supabase directamente. Cuando no hay
 * backend configurado, `isConfigured` es false y el store usa localStorage.
 *
 * Tablas: patients, appointments, content, services (ver supabase/schema.sql).
 */
import { supabase, isConfigured } from './supabase.js';
import { patientToRow, patientFromRow, simpleToRow, simpleFromRow } from './mappers.js';

export { isConfigured };

/* No registramos datos sensibles: solo un mensaje y el código de error. */
function warn(scope, error) {
  if (error) console.warn(`[backend:${scope}] ${error.message || error.code || 'error'}`);
}

/* Carga todo el estado desde el backend. Devuelve null si no hay backend o si
 * la base está vacía (primer arranque → el store sembrará los datos demo). */
export async function loadAll() {
  if (!isConfigured) return null;
  const [patients, appointments, content, services] = await Promise.all([
    supabase.from('patients').select('*'),
    supabase.from('appointments').select('*'),
    supabase.from('content').select('*'),
    supabase.from('services').select('*'),
  ]);
  warn('load.patients', patients.error);
  warn('load.appointments', appointments.error);
  warn('load.content', content.error);
  warn('load.services', services.error);

  const empty =
    !(patients.data?.length) &&
    !(appointments.data?.length) &&
    !(content.data?.length) &&
    !(services.data?.length);
  if (empty) return null;

  return {
    patients: (patients.data || []).map(patientFromRow),
    appointments: (appointments.data || []).map(simpleFromRow),
    content: (content.data || []).map(simpleFromRow),
    services: (services.data || []).map(simpleFromRow),
  };
}

/* Siembra inicial: vuelca el estado demo en una base vacía. */
export async function seedAll(state) {
  if (!isConfigured) return;
  const [pat, appt, cont, srv] = await Promise.all([
    supabase.from('patients').upsert(state.patients.map(patientToRow)),
    supabase.from('appointments').upsert(state.appointments.map(simpleToRow)),
    supabase.from('content').upsert(state.content.map(simpleToRow)),
    supabase.from('services').upsert(state.services.map(simpleToRow)),
  ]);
  warn('seed.patients', pat.error);
  warn('seed.appointments', appt.error);
  warn('seed.content', cont.error);
  warn('seed.services', srv.error);
}

/* ---- Operaciones por entidad (upsert = crear o actualizar) ---- */
export async function savePatient(patient) {
  if (!isConfigured) return;
  const { error } = await supabase.from('patients').upsert(patientToRow(patient));
  warn('savePatient', error);
}

export async function saveSimple(table, obj) {
  if (!isConfigured) return;
  const { error } = await supabase.from(table).upsert(simpleToRow(obj));
  warn(`save.${table}`, error);
}

export async function removeRow(table, id) {
  if (!isConfigured) return;
  const { error } = await supabase.from(table).delete().eq('id', String(id));
  warn(`delete.${table}`, error);
}
