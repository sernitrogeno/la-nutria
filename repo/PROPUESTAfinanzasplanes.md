# Propuesta: Planes/Tarifas + Módulo de Finanzas (LaNutria)

Documento de diseño. Dos partes: (1) catálogo de planes alineado con el mercado
para arrancar y fidelizar, y (2) diseño del módulo de Finanzas del panel privado.

---

## PARTE 1 · Planes y tarifas

### Investigación de mercado (nutricionista online, España, 2025-2026)
- Primera consulta online: **30–60 €**.
- Seguimiento: **25–65 €** (cada 2–4 semanas al principio).
- Bono 6 sesiones: **~235 €**.
- Planes largos: 3 meses ~160 €, 6 meses ~260 €, 12 meses ~747 €.
- Online ≈ 15–20 % más barato que presencial.
- Quien empieza se posiciona en franja **baja-media** y sube con reputación.

Fuentes: cronoshare.com, zaask.es, medibilbaosalud.com, saulnutri.com, dinut.es.

### Catálogo propuesto para arrancar (editable)
Pensado para **captar** (gancho de entrada barato) y **fidelizar** (plan
recurrente mensual = ingresos predecibles + hábito).

| Plan | Precio | Tipo | Qué incluye | Rol |
|---|---|---|---|---|
| **Primera consulta** | 49 € | Puntual | Valoración inicial completa + primeras pautas | Gancho de captación |
| **Seguimiento suelto** | 35 € | Puntual | Una revisión de progreso y ajuste | Flexibilidad |
| **Plan mensual "En forma"** ⭐ | 55 €/mes | Recurrente | Valoración + 2 seguimientos/mes + plan semanal + chat | **Fidelización (núcleo)** |
| **Plan trimestral "Transformación"** | 145 €/trim (~48 €/mes) | Recurrente | Todo lo del mensual + revisión de objetivos mensual | Compromiso + mejor precio |

> Opcional: **Pack 6 sesiones – 195 €** para quien no quiere recurrencia.

### Estrategia captar + fidelizar
- **Oferta de lanzamiento (captación):** primera consulta a **1 €** o **primer
  mes -50 %** al contratar el plan mensual. Baja la barrera de entrada.
- **Recurrencia = fidelización:** el plan mensual genera ingreso predecible (MRR)
  y crea hábito. Es el corazón del negocio.
- **Trimestral con descuento:** más compromiso → mayor retención.
- A medida que haya reputación/reseñas, subir precios un escalón.

> ⚠️ Los importes son una recomendación alineada con el mercado. Confírmalos o
> ajústalos: son decisión de negocio tuya.

---

## PARTE 2 · Módulo de Finanzas (panel privado)

Objetivo: que los ingresos sean **reales** (no inventados) y dar a la
nutricionista una visión profesional de sus cuentas con pacientes.

### Modelo de datos (Supabase)
Dos conceptos enlazados:

1. **Suscripciones / contrataciones** (lo recurrente):
   - `id`, `patient_id`, `plan` (nombre), `importe`, `periodicidad`
     (puntual | mensual | trimestral), `fecha_inicio`, `estado`
     (activa | pausada | cancelada), `proximo_cobro`.
   - Responde "quién tiene qué plan" y alimenta los **ingresos recurrentes (MRR)**
     y la **previsión**.

2. **Cobros / pagos** (el dinero real recibido):
   - `id`, `patient_id`, `concepto`, `importe`, `fecha`, `metodo`
     (transferencia | tarjeta | efectivo | Bizum), `suscripcion_id` (opcional).
   - Es el **libro de caja**: alimenta "ingresos del mes" reales y el histórico.

> Regla: un cobro suelto puede existir sin suscripción; una suscripción genera
> cobros mes a mes (manuales al principio; automatizables más adelante).

### Qué muestra la pantalla "Finanzas"
**KPIs (arriba):**
- Ingresos del mes (suma de cobros reales del mes en curso).
- Ingresos recurrentes mensuales (MRR = suma de suscripciones activas
  normalizadas a mes: trimestral 145 € → ~48 €/mes).
- Nº de pacientes de pago activos.
- Ticket medio por paciente.

**Tabla "Quién ha contratado qué":**
- Paciente · Plan · Importe · Periodicidad · Estado · Próximo cobro · (acción: registrar cobro).

**Gráficas:**
- **Ingresos por mes** (barras, últimos 12 meses) — reusa `components/Chart.jsx`.
- **Previsión** (MRR proyectado a 3–6 meses) vs **objetivo mensual** (línea de meta
  que la nutricionista define, p.ej. 1.500 €/mes).

### Conexión con lo que ya hay
- El **Dashboard** "Ingresos del mes" pasará a leer el cobro real del mes (en vez
  de 0 €), una vez exista el módulo.
- Al **crear/editar un paciente** se podrá asignarle un plan (crea su suscripción).
- Los **planes** del catálogo (Servicios) son la fuente de los importes.

### Fases de implementación sugeridas
1. **Datos**: tablas `suscripciones` y `pagos` en Supabase (+ políticas RLS auth) y
   asignar plan a paciente.
2. **Pantalla Finanzas v1**: KPIs + tabla "quién contrató qué" + registrar cobros.
3. **Gráficas**: ingresos mensuales + previsión + objetivo.
4. **Enlazar Dashboard** y, si se quiere, recordatorios de próximos cobros.

> Empezar por la Fase 1+2 ya da valor real (ver ingresos reales y quién paga qué).
> Las gráficas (Fase 3) son la guinda profesional.
