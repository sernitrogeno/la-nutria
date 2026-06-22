import { useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { useStore } from '../store/StoreContext.jsx';
import { CONTENT_COLUMNS } from '../store/seed.js';

export function Content() {
  const { content, setContent } = useStore();
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);

  const drop = (col) => {
    if (drag == null) return;
    setContent(content.map((c) => (c.id === drag ? { ...c, column: col } : c)));
    setDrag(null);
    setOver(null);
  };

  return (
    <div>
      <header className="phead">
        <h1>Contenido</h1>
        <p className="phead__sub">Arrastra las tarjetas entre columnas para avanzar el contenido.</p>
      </header>

      <div className="board">
        {CONTENT_COLUMNS.map((col) => {
          const cards = content.filter((c) => c.column === col.id);
          return (
            <div
              key={col.id}
              className={'col' + (over === col.id ? ' col--over' : '')}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(col.id);
              }}
              onDragLeave={() => setOver((o) => (o === col.id ? null : o))}
              onDrop={() => drop(col.id)}
            >
              <div className="col__head">
                <span className="col__title">
                  <span className="col__dot" style={{ background: col.color }} />
                  {col.label}
                </span>
                <span className="col__count">{cards.length}</span>
              </div>
              <div className="col__cards">
                {cards.map((c) => (
                  <div
                    className="kcard"
                    key={c.id}
                    draggable
                    onDragStart={() => setDrag(c.id)}
                    onDragEnd={() => {
                      setDrag(null);
                      setOver(null);
                    }}
                  >
                    <div className="kcard__title">{c.title}</div>
                    <div className="kcard__foot">
                      <span className="kcard__date">
                        <Icon name="calendar2" size={12} />
                        {c.date}
                      </span>
                      <span className="kcard__plat">{c.platform}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
