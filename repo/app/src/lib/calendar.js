/* Utilidades de calendario en español (módulo ES). */
export const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const MESES_AB = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
export const DIAS_AB = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
export const DIAS_MINI = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

/* "Hoy" real (a medianoche, sin hora) para los cálculos de fechas de la app. */
export const TODAY = (() => {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
})();

export const pad = (n) => String(n).padStart(2, '0');
export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parse = (s) => {
  const [y, m, dd] = s.split('-').map(Number);
  return new Date(y, m - 1, dd);
};
export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const addMonths = (d, n) => {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
};
export const sameDay = (a, b) => iso(a) === iso(b);
export const isToday = (d) => sameDay(d, TODAY);
export const startOfWeek = (d) => addDays(d, -((d.getDay() + 6) % 7));
export const weekDates = (d) => {
  const s = startOfWeek(d);
  return Array.from({ length: 7 }, (_, i) => addDays(s, i));
};

export function monthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const start = startOfWeek(first);
  return Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, i) => addDays(start, w * 7 + i)));
}

export const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
export const toHHMM = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
export const endTime = (start, dur) => toHHMM(toMin(start) + dur);

export const longDate = (d) => `${DIAS[(d.getDay() + 6) % 7]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
export const monthYear = (d) => `${MESES[d.getMonth()].replace(/^\w/, (c) => c.toUpperCase())} ${d.getFullYear()}`;
export const dayMonth = (d) => `${d.getDate()} ${MESES_AB[d.getMonth()]}`;
export function weekLabel(d) {
  const w = weekDates(d);
  const a = w[0];
  const b = w[6];
  if (a.getMonth() === b.getMonth()) return `${a.getDate()}–${b.getDate()} ${MESES_AB[a.getMonth()]} ${a.getFullYear()}`;
  return `${a.getDate()} ${MESES_AB[a.getMonth()]} – ${b.getDate()} ${MESES_AB[b.getMonth()]}`;
}

/* Edad a partir de fecha ISO de nacimiento. */
export function ageFrom(isoDate, ref = TODAY) {
  if (!isoDate) return null;
  const b = parse(isoDate);
  let age = ref.getFullYear() - b.getFullYear();
  const m = ref.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < b.getDate())) age--;
  return age;
}
