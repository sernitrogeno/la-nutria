/* Conversión entre objetos de la app (camelCase, tal y como los usan las
 * pantallas) y las filas de la base de datos.
 *
 * Pacientes: extraemos a columnas propias los campos útiles para listar y
 * filtrar (nombre, estado, fechas…) y guardamos el resto del expediente
 * clínico en una columna JSONB `data`. Así la tabla es legible en el editor
 * de Supabase y, a la vez, el modelo clínico anidado queda flexible.
 *
 * Citas, contenido y servicios: colecciones simples → `id` + JSONB `data`.
 */

/* ---- Pacientes ---- */
export function patientToRow(p) {
  const {
    id,
    firstName,
    lastName,
    birthDate,
    phone,
    email,
    status,
    professional,
    lastConsult,
    nextReview,
    deleted,
    createdAt,
    updatedAt,
    ...rest
  } = p;
  return {
    id,
    first_name: firstName ?? '',
    last_name: lastName ?? '',
    birth_date: birthDate || null,
    phone: phone ?? '',
    email: email ?? '',
    status: status ?? 'pending',
    professional: professional ?? '',
    last_consult: lastConsult || null,
    next_review: nextReview || null,
    deleted: Boolean(deleted),
    created_at: createdAt || new Date().toISOString(),
    updated_at: updatedAt || new Date().toISOString(),
    /* Resto del expediente (assessment, plan, weeklyDiet, measurements,
     * followUps, notes, observations, profession, photo, admittedAt, author…) */
    data: rest,
  };
}

export function patientFromRow(row) {
  return {
    ...(row.data || {}),
    id: row.id,
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    birthDate: row.birth_date || '',
    phone: row.phone || '',
    email: row.email || '',
    status: row.status || 'pending',
    professional: row.professional || '',
    lastConsult: row.last_consult || '',
    nextReview: row.next_review || '',
    deleted: Boolean(row.deleted),
    createdAt: row.created_at || '',
    updatedAt: row.updated_at || '',
  };
}

/* ---- Colecciones simples (citas, contenido, servicios) ---- */
export function simpleToRow(obj) {
  return {
    id: String(obj.id),
    data: obj,
    updated_at: new Date().toISOString(),
  };
}

export function simpleFromRow(row) {
  return row.data;
}
