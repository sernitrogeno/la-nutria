/* Utilidades financieras de LaNutria.
 *
 * Cálculos puros sobre suscripciones (contrataciones recurrentes) y pagos
 * (cobros reales). Sin estado ni efectos: reciben los arrays del store y
 * devuelven números/listas listos para pintar.
 *
 * Modelo:
 *   suscripción = { id, patientId, patientName, plan, importe, periodicidad
 *                   ('puntual'|'mensual'|'trimestral'), fechaInicio, estado
 *                   ('activa'|'pausada'|'cancelada') }
 *   pago        = { id, patientId, patientName, concepto, importe, fecha,
 *                   metodo, subscriptionId }
 */
import { MESES_AB } from './calendar.js';

export const PERIODICIDADES = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'puntual', label: 'Puntual (pago único)' },
];

export const ESTADOS_SUB = [
  { value: 'activa', label: 'Activa' },
  { value: 'pausada', label: 'Pausada' },
  { value: 'cancelada', label: 'Cancelada' },
];

export const METODOS_PAGO = [
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'bizum', label: 'Bizum' },
  { value: 'efectivo', label: 'Efectivo' },
];

/* Formato de dinero en euros (es-ES, sin decimales). */
export function formatMoney(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(n) || 0);
}

/* Valor mensualizado de una suscripción activa (trimestral → /3, puntual → 0). */
export function monthlyValue(sub) {
  if (!sub || sub.estado !== 'activa') return 0;
  const imp = Number(sub.importe) || 0;
  if (sub.periodicidad === 'mensual') return imp;
  if (sub.periodicidad === 'trimestral') return imp / 3;
  return 0; // puntual no es recurrente
}

/* Ingresos recurrentes mensuales (MRR). */
export function mrr(subscriptions = []) {
  return subscriptions.reduce((sum, s) => sum + monthlyValue(s), 0);
}

function sameMonth(isoDate, ref) {
  if (!isoDate) return false;
  const d = new Date(isoDate);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

/* Ingresos reales cobrados en el mes de `ref`. */
export function monthIncome(payments = [], ref) {
  return payments.filter((p) => sameMonth(p.fecha, ref)).reduce((s, p) => s + (Number(p.importe) || 0), 0);
}

/* Nº de pacientes distintos con suscripción activa. */
export function payingPatients(subscriptions = []) {
  return new Set(subscriptions.filter((s) => s.estado === 'activa' && s.patientId).map((s) => s.patientId)).size;
}

/* Ticket medio mensual por paciente de pago. */
export function avgTicket(subscriptions = []) {
  const n = payingPatients(subscriptions);
  return n ? mrr(subscriptions) / n : 0;
}

/* Serie de los últimos 12 meses con el total cobrado en cada uno. */
export function last12Months(payments = [], ref) {
  const out = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    const total = payments
      .filter((p) => {
        if (!p.fecha) return false;
        const pd = new Date(p.fecha);
        return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
      })
      .reduce((s, p) => s + (Number(p.importe) || 0), 0);
    out.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MESES_AB[d.getMonth()], total });
  }
  return out;
}

/* Próxima fecha de cobro estimada de una suscripción recurrente. */
export function nextBillingDate(sub, ref) {
  if (!sub || sub.estado !== 'activa' || sub.periodicidad === 'puntual' || !sub.fechaInicio) return null;
  const step = sub.periodicidad === 'trimestral' ? 3 : 1;
  const today = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  let d = new Date(sub.fechaInicio);
  if (Number.isNaN(d.getTime())) return null;
  let guard = 0;
  while (d < today && guard++ < 600) d = new Date(d.getFullYear(), d.getMonth() + step, d.getDate());
  return d;
}

/* Extrae el número de un precio tipo "55€" → 55. */
export function parsePrice(price) {
  const n = parseFloat(String(price ?? '').replace(',', '.').replace(/[^\d.]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

/* Periodicidad a partir del campo `period` de un servicio ("/mes", "/trim."). */
export function periodicidadFromService(period) {
  const p = String(period || '').toLowerCase();
  if (p.includes('trim')) return 'trimestral';
  if (p.includes('mes')) return 'mensual';
  return 'puntual';
}
