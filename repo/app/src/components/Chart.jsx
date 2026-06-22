/* Gráfico de líneas SVG ligero para la evolución de medidas. */
export function LineChart({ points, label, unit = '', color = 'var(--accent)', height = 120 }) {
  const vals = points.map((p) => p.value).filter((v) => typeof v === 'number' && !Number.isNaN(v));
  if (vals.length < 2) {
    return (
      <div className="chart chart--empty">
        <span className="chart__label">{label}</span>
        <p className="chart__hint">Necesitas al menos 2 mediciones para ver la evolución.</p>
      </div>
    );
  }
  const W = 260;
  const H = height;
  const pad = 22;
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const x = (i) => pad + (i * (W - pad * 2)) / (points.length - 1);
  const y = (v) => H - pad - ((v - min) / span) * (H - pad * 2);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ');
  const area = `${path} L ${x(points.length - 1).toFixed(1)} ${H - pad} L ${x(0).toFixed(1)} ${H - pad} Z`;
  const first = vals[0];
  const last = vals[vals.length - 1];
  const delta = +(last - first).toFixed(1);

  return (
    <div className="chart">
      <div className="chart__head">
        <span className="chart__label">{label}</span>
        <span className={'chart__delta' + (delta <= 0 ? ' is-down' : ' is-up')}>
          {delta > 0 ? '+' : ''}
          {delta}
          {unit}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart__svg" preserveAspectRatio="none">
        <path d={area} fill={color} opacity="0.12" />
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.value)} r="3" fill="var(--surface)" stroke={color} strokeWidth="2" />
        ))}
      </svg>
      <div className="chart__axis">
        <span>
          {first}
          {unit}
        </span>
        <span>
          {last}
          {unit}
        </span>
      </div>
    </div>
  );
}
