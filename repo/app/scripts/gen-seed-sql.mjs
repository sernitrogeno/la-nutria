/* Genera supabase/seed.sql a partir de los datos semilla de la app.
 *
 * Usa los MISMOS mappers que la app (patientToRow / simpleToRow), de modo que
 * las columnas e índices del JSONB `data` coinciden exactamente con lo que el
 * frontend espera al leer. Así los datos fake quedan guardados en la BBDD y la
 * app los lee de ahí (no hardcodeados en el front).
 *
 * Uso:
 *   node app/scripts/gen-seed-sql.mjs   → escribe supabase/seed.sql
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { buildSeed } from '../src/store/seed.js';
import { patientToRow, simpleToRow } from '../src/backend/mappers.js';

const here = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(here, '../../supabase/seed.sql');

/* Literal de texto SQL con escape de comillas simples. NULL si es null/undefined. */
function sql(value) {
  if (value === null || value === undefined) return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

/* Literal JSONB usando dollar-quoting para no pelearnos con comillas internas. */
function jsonb(obj) {
  return `$json$${JSON.stringify(obj)}$json$::jsonb`;
}

const { patients, appointments, content, services } = buildSeed();

const lines = [];
lines.push('-- ============================================================================');
lines.push('-- LaNutria · Datos de demostración (semilla)');
lines.push('-- ----------------------------------------------------------------------------');
lines.push('-- GENERADO AUTOMÁTICAMENTE por app/scripts/gen-seed-sql.mjs — no editar a mano.');
lines.push('-- Ejecuta primero schema.sql y luego este archivo en el SQL Editor de Supabase.');
lines.push('--');
lines.push('-- Es idempotente (UPSERT): puedes ejecutarlo varias veces sin duplicar datos.');
lines.push('-- Solo datos FICTICIOS. No metas datos reales de pacientes hasta tener login.');
lines.push('-- ============================================================================');
lines.push('');

/* ---- Pacientes ---- */
lines.push('-- ---- Pacientes -------------------------------------------------------------');
for (const p of patients) {
  const r = patientToRow(p);
  lines.push('insert into public.patients');
  lines.push('  (id, first_name, last_name, birth_date, phone, email, status, professional, last_consult, next_review, deleted, data, created_at, updated_at)');
  lines.push('values (');
  lines.push(`  ${sql(r.id)}, ${sql(r.first_name)}, ${sql(r.last_name)}, ${sql(r.birth_date)}, ${sql(r.phone)}, ${sql(r.email)},`);
  lines.push(`  ${sql(r.status)}, ${sql(r.professional)}, ${sql(r.last_consult)}, ${sql(r.next_review)}, ${r.deleted},`);
  lines.push(`  ${jsonb(r.data)}, ${sql(r.created_at)}, ${sql(r.updated_at)}`);
  lines.push(')');
  lines.push('on conflict (id) do update set');
  lines.push('  first_name = excluded.first_name, last_name = excluded.last_name, birth_date = excluded.birth_date,');
  lines.push('  phone = excluded.phone, email = excluded.email, status = excluded.status, professional = excluded.professional,');
  lines.push('  last_consult = excluded.last_consult, next_review = excluded.next_review, deleted = excluded.deleted,');
  lines.push('  data = excluded.data, updated_at = excluded.updated_at;');
  lines.push('');
}

/* ---- Colecciones simples (id + JSONB data) ---- */
function simpleBlock(table, rows) {
  lines.push(`-- ---- ${table} ----`);
  for (const obj of rows) {
    const r = simpleToRow(obj);
    lines.push(`insert into public.${table} (id, data, updated_at)`);
    lines.push(`values (${sql(r.id)}, ${jsonb(r.data)}, ${sql(r.updated_at)})`);
    lines.push('on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;');
  }
  lines.push('');
}

simpleBlock('appointments', appointments);
simpleBlock('content', content);
simpleBlock('services', services);

writeFileSync(outPath, lines.join('\n'));
console.log(`OK → ${outPath}`);
console.log(`  patients=${patients.length} appointments=${appointments.length} content=${content.length} services=${services.length}`);
