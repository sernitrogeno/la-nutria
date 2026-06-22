import { useEffect } from 'react';
import { Icon } from './Icon.jsx';

export function Badge({ tone = 'neutral', dot = false, children }) {
  return <span className={`badge badge--${tone}${dot ? ' badge--dot' : ''}`}>{children}</span>;
}

export function Button({ variant = 'primary', icon, children, ...rest }) {
  return (
    <button className={`btn btn--${variant}`} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

/* Panel deslizante (slide-over) reutilizable */
export function SlideOver({ eyebrow, title, onClose, children, width }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="sheet" style={width ? { width } : undefined}>
        <button className="sheet__close" onClick={onClose} aria-label="Cerrar">
          <Icon name="x" />
        </button>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        {title && <h2 style={{ marginBottom: 18 }}>{title}</h2>}
        {children}
      </aside>
    </>
  );
}

/* Diálogo de confirmación (para eliminar/archivar) */
export function ConfirmDialog({ title, message, confirmLabel = 'Confirmar', tone = 'danger', onConfirm, onCancel }) {
  return (
    <>
      <div className="overlay" style={{ zIndex: 50 }} onClick={onCancel} />
      <div className="confirm" role="dialog" aria-modal="true">
        <div className="confirm__icon">
          <Icon name="alert" />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button className={`btn btn--primary${tone === 'danger' ? ' btn--danger-solid' : ''}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="field">
      {label && <label>{label}</label>}
      {children}
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}

export function TextField({ label, hint, ...rest }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <input {...rest} />
      {hint && <span className="field__hint">{hint}</span>}
    </div>
  );
}

export function TextArea({ label, hint, rows = 3, ...rest }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <textarea rows={rows} {...rest} />
      {hint && <span className="field__hint">{hint}</span>}
    </div>
  );
}

export function SelectField({ label, options, ...rest }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <select {...rest}>
        {options.map((o) => (typeof o === 'string' ? <option key={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>
  );
}

export function RangeField({ label, value, onChange, min = 1, max = 10 }) {
  return (
    <div className="field">
      {label && (
        <label>
          {label} <b className="range__val">{value}</b>
        </label>
      )}
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} className="range" />
    </div>
  );
}

/* Selección múltiple en chips */
export function ChipGroup({ options, value, onChange }) {
  const toggle = (opt) => onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  return (
    <div className="chips">
      {options.map((opt) => (
        <button type="button" key={opt} className={'chip' + (value.includes(opt) ? ' chip--on' : '')} onClick={() => toggle(opt)}>
          {value.includes(opt) && <Icon name="check" size={13} />}
          {opt}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ icon = 'leaf', title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__ico">
        <Icon name={icon} size={26} />
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
