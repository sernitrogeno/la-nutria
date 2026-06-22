import { useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Button, SlideOver } from '../components/ui.jsx';
import { useStore } from '../store/StoreContext.jsx';
import { SESSION_TYPES, TYPE_COLORS, DURATIONS } from '../store/seed.js';
import { fullName } from '../store/schema.js';
import * as C from '../lib/calendar.js';

const HSTART = 7;
const HEND = 22;
const HH = 56;
const HOURS = Array.from({ length: HEND - HSTART }, (_, i) => HSTART + i);
const TIME_OPTS = (() => {
  const o = [];
  for (let m = HSTART * 60; m <= (HEND - 1) * 60 + 45; m += 15) o.push(C.toHHMM(m));
  return o;
})();

const color = (type) => TYPE_COLORS[type] || '#7e9b76';
const tint = (type) => `color-mix(in srgb, ${color(type)} 14%, var(--surface))`;

function layout(evs) {
  const list = [...evs].sort((a, b) => C.toMin(a.start) - C.toMin(b.start)).map((e) => ({ ...e }));
  let i = 0;
  while (i < list.length) {
    let j = i;
    let maxEnd = C.toMin(list[i].start) + list[i].dur;
    const lanes = [];
    while (j < list.length && C.toMin(list[j].start) < maxEnd) {
      const s = C.toMin(list[j].start);
      const en = s + list[j].dur;
      let k = 0;
      while (k < lanes.length && lanes[k] > s) k++;
      lanes[k] = en;
      list[j]._lane = k;
      maxEnd = Math.max(maxEnd, en);
      j++;
    }
    const cols = lanes.length;
    for (let x = i; x < j; x++) list[x]._cols = cols;
    i = j;
  }
  return list;
}

function Event({ a, onClick }) {
  const top = ((C.toMin(a.start) - HSTART * 60) / 60) * HH;
  const h = Math.max(20, (a.dur / 60) * HH - 3);
  const w = 100 / (a._cols || 1);
  return (
    <button
      className={'evt' + (a.done ? ' evt--done' : '')}
      style={{ top, height: h, left: `calc(${w * a._lane}% + 2px)`, width: `calc(${w}% - 4px)`, background: tint(a.type), borderColor: color(a.type) }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(a);
      }}
    >
      <span className="evt__time">{a.start}–{C.endTime(a.start, a.dur)}</span>
      <span className="evt__name">{a.clientName}</span>
      {h > 44 && <span className="evt__type">{a.type}</span>}
    </button>
  );
}

function DayCol({ date, appts, onSlot, onPick }) {
  const evs = layout(appts.filter((a) => a.date === C.iso(date)));
  const click = (e) => {
    const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
    const min = HSTART * 60 + Math.round(((y / HH) * 60) / 15) * 15;
    onSlot(date, C.toHHMM(Math.max(HSTART * 60, Math.min((HEND - 1) * 60 + 45, min))));
  };
  return (
    <div className="daycol" style={{ height: (HEND - HSTART) * HH }} onClick={click}>
      {HOURS.map((h, i) => (
        <div key={h} className="daycol__line" style={{ top: i * HH }} />
      ))}
      {evs.map((a) => (
        <Event key={a.id} a={a} onClick={onPick} />
      ))}
    </div>
  );
}

function TimeGutter() {
  return (
    <div className="gutter" style={{ height: (HEND - HSTART) * HH }}>
      {HOURS.map((h) => (
        <div key={h} className="gutter__h" style={{ height: HH }}>
          {C.pad(h)}:00
        </div>
      ))}
    </div>
  );
}

function DayView({ cursor, appts, onSlot, onPick }) {
  return (
    <div className="cal-card">
      <div className="tgrid tgrid--day">
        <TimeGutter />
        <DayCol date={cursor} appts={appts} onSlot={onSlot} onPick={onPick} />
      </div>
    </div>
  );
}

function WeekView({ cursor, appts, onSlot, onPick }) {
  const days = C.weekDates(cursor);
  return (
    <div className="cal-card">
      <div className="wk-head">
        <div className="wk-head__gut" />
        {days.map((d) => (
          <div key={C.iso(d)} className={'wk-head__day' + (C.isToday(d) ? ' is-today' : '')}>
            <span className="wk-head__dow">{C.DIAS_AB[(d.getDay() + 6) % 7]}</span>
            <span className="wk-head__num">{d.getDate()}</span>
          </div>
        ))}
      </div>
      <div className="tgrid tgrid--week">
        <TimeGutter />
        {days.map((d) => (
          <DayCol key={C.iso(d)} date={d} appts={appts} onSlot={onSlot} onPick={onPick} />
        ))}
      </div>
    </div>
  );
}

function MonthView({ cursor, appts, onSlot, onPick, goDay }) {
  const matrix = C.monthMatrix(cursor.getFullYear(), cursor.getMonth());
  const month = cursor.getMonth();
  const byDay = {};
  appts.forEach((a) => {
    (byDay[a.date] = byDay[a.date] || []).push(a);
  });
  return (
    <div className="cal-card mcal">
      <div className="mhead">
        {C.DIAS_AB.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="mgrid">
        {matrix.flat().map((d) => {
          const items = (byDay[C.iso(d)] || []).sort((a, b) => C.toMin(a.start) - C.toMin(b.start));
          const out = d.getMonth() !== month;
          return (
            <div key={C.iso(d)} className={'mcell' + (out ? ' mcell--out' : '')} onClick={() => onSlot(d, '10:00')}>
              <div className="mcell__top">
                <span className={'mcell__num' + (C.isToday(d) ? ' is-today' : '')}>{d.getDate()}</span>
              </div>
              <div className="mcell__chips">
                {items.slice(0, 3).map((a) => (
                  <button
                    key={a.id}
                    className={'mchip' + (a.done ? ' mchip--done' : '')}
                    style={{ borderColor: color(a.type) }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPick(a);
                    }}
                  >
                    <span className="mchip__dot" style={{ background: color(a.type) }} />
                    <span className="mchip__t">
                      {a.start} {a.clientName}
                    </span>
                  </button>
                ))}
                {items.length > 3 && (
                  <button
                    className="mchip mchip--more"
                    onClick={(e) => {
                      e.stopPropagation();
                      goDay(d);
                    }}
                  >
                    +{items.length - 3} más
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YearView({ cursor, appts, goMonth }) {
  const year = cursor.getFullYear();
  const days = {};
  appts.forEach((a) => {
    if (a.date.startsWith(year + '-')) days[a.date] = (days[a.date] || 0) + 1;
  });
  return (
    <div className="ygrid">
      {C.MESES.map((name, m) => {
        const matrix = C.monthMatrix(year, m);
        return (
          <button key={m} className="ymonth" onClick={() => goMonth(m)}>
            <div className="ymonth__name">{name}</div>
            <div className="ymini-head">
              {C.DIAS_MINI.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className="ymini">
              {matrix.flat().map((d) => {
                const out = d.getMonth() !== m;
                const n = days[C.iso(d)] || 0;
                return (
                  <span key={C.iso(d)} className={'yday' + (out ? ' yday--out' : '') + (C.isToday(d) ? ' yday--today' : '') + (n ? ' yday--has' : '')}>
                    {d.getDate()}
                  </span>
                );
              })}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ApptForm({ initial, patients, onSave, onDelete, onClose }) {
  const editing = !!initial.id;
  const [f, setF] = useState({
    id: initial.id || null,
    patientId: initial.patientId || patients[0]?.id || '',
    clientName: initial.clientName || (patients[0] ? fullName(patients[0]) : ''),
    type: initial.type || SESSION_TYPES[1],
    date: initial.date || C.iso(C.TODAY),
    start: initial.start || '10:00',
    dur: initial.dur || 60,
    done: initial.done || false,
  });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const setPatient = (id) => {
    const p = patients.find((x) => x.id === id);
    setF((s) => ({ ...s, patientId: id, clientName: p ? fullName(p) : s.clientName }));
  };
  const submit = (e) => {
    e.preventDefault();
    onSave({ ...f, id: f.id || Date.now() });
  };
  return (
    <SlideOver eyebrow={editing ? 'Editar cita' : 'Nueva cita'} title={editing ? f.clientName : 'Reservar consulta'} onClose={onClose}>
      <form className="eform" onSubmit={submit}>
        <div className="field">
          <label>Paciente</label>
          <select value={f.patientId} onChange={(e) => setPatient(e.target.value)}>
            {patients.map((c) => (
              <option key={c.id} value={c.id}>
                {fullName(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Tipo de consulta</label>
          <select value={f.type} onChange={(e) => set('type', e.target.value)}>
            {SESSION_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Fecha</label>
          <input type="date" value={f.date} onChange={(e) => set('date', e.target.value)} />
        </div>
        <div className="erow">
          <div className="field">
            <label>Hora de inicio</label>
            <select value={f.start} onChange={(e) => set('start', e.target.value)}>
              {TIME_OPTS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Duración</label>
            <select value={f.dur} onChange={(e) => set('dur', +e.target.value)}>
              {DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {d} min
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="eform__end">
          Termina a las <b>{C.endTime(f.start, f.dur)}</b>
        </div>
        {editing && (
          <label className="echeck">
            <input type="checkbox" checked={f.done} onChange={(e) => set('done', e.target.checked)} />
            <span>
              <Icon name="check" size={13} />
            </span>{' '}
            Marcar como realizada
          </label>
        )}
        <div className="eform__actions">
          {editing && (
            <button type="button" className="btn btn--ghost btn--danger" onClick={() => onDelete(f.id)}>
              Eliminar
            </button>
          )}
          <Button icon="check" type="submit">
            {editing ? 'Guardar' : 'Reservar'}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}

export function Agenda() {
  const { livePatients, appointments, saveAppointment, deleteAppointment } = useStore();
  const [view, setView] = useState('week');
  const [cursor, setCursor] = useState(C.TODAY);
  const [form, setForm] = useState(null);

  const step = (dir) => {
    if (view === 'day') setCursor((c) => C.addDays(c, dir));
    else if (view === 'week') setCursor((c) => C.addDays(c, dir * 7));
    else if (view === 'month') setCursor((c) => C.addMonths(c, dir));
    else
      setCursor((c) => {
        const x = new Date(c);
        x.setFullYear(x.getFullYear() + dir);
        return x;
      });
  };
  const title =
    view === 'day' ? C.longDate(cursor) : view === 'week' ? C.weekLabel(cursor) : view === 'month' ? C.monthYear(cursor) : String(cursor.getFullYear());

  const save = (a) => {
    saveAppointment(a);
    setForm(null);
  };
  const del = (id) => {
    deleteAppointment(id);
    setForm(null);
  };
  const onSlot = (date, start) => setForm({ date: C.iso(date), start });
  const onPick = (a) => setForm(a);

  const VIEWS = [
    ['day', 'Día'],
    ['week', 'Semana'],
    ['month', 'Mes'],
    ['year', 'Año'],
  ];

  return (
    <div>
      <header className="phead phead--row">
        <div>
          <h1>Agenda</h1>
          <p className="phead__sub">Tu calendario de consultas. Pulsa un hueco para reservar.</p>
        </div>
        <Button icon="plus" onClick={() => setForm({ date: C.iso(cursor), start: '10:00' })}>
          Nueva cita
        </Button>
      </header>

      <div className="cal-bar">
        <div className="cal-bar__left">
          <button className="cal-today" onClick={() => setCursor(C.TODAY)}>
            Hoy
          </button>
          <div className="cal-nav">
            <button onClick={() => step(-1)} aria-label="Anterior">
              <Icon name="chevron" size={18} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button onClick={() => step(1)} aria-label="Siguiente">
              <Icon name="chevron" size={18} />
            </button>
          </div>
          <span className="cal-title">{title}</span>
        </div>
        <div className="seg cal-seg">
          {VIEWS.map(([v, l]) => (
            <button key={v} data-on={view === v ? '1' : '0'} onClick={() => setView(v)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {view === 'day' && <DayView cursor={cursor} appts={appointments} onSlot={onSlot} onPick={onPick} />}
      {view === 'week' && <WeekView cursor={cursor} appts={appointments} onSlot={onSlot} onPick={onPick} />}
      {view === 'month' && (
        <MonthView
          cursor={cursor}
          appts={appointments}
          onSlot={onSlot}
          onPick={onPick}
          goDay={(d) => {
            setCursor(d);
            setView('day');
          }}
        />
      )}
      {view === 'year' && (
        <YearView
          cursor={cursor}
          appts={appointments}
          goMonth={(m) => {
            setCursor(new Date(cursor.getFullYear(), m, 1));
            setView('month');
          }}
        />
      )}

      {form && <ApptForm initial={form} patients={livePatients} onSave={save} onDelete={del} onClose={() => setForm(null)} />}
    </div>
  );
}
