/* Iconos de línea (estilo trazo, 24x24). Set base portado del rediseño + iconos clínicos. */

const ICON_PATHS = {
  panel: (
    <>
      <path d="M3 13h8V3H3v10Z" />
      <path d="M13 21h8V8h-8v13Z" />
      <path d="M13 3v3h8V3h-8Z" />
      <path d="M3 21h8v-5H3v5Z" />
    </>
  ),
  clients: (
    <>
      <path d="M16 3.6a4 4 0 0 1 0 7.7" />
      <path d="M21 20v-1.5a4 4 0 0 0-3-3.8" />
      <circle cx="9" cy="7.5" r="3.8" />
      <path d="M3 20v-1.6a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4V20" />
    </>
  ),
  agenda: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.4" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v3.4M16 3v3.4" />
      <path d="M8 13.5h3M8 17h5" />
    </>
  ),
  content: (
    <>
      <rect x="3.5" y="4" width="6.5" height="16" rx="1.8" />
      <rect x="14" y="4" width="6.5" height="10" rx="1.8" />
    </>
  ),
  services: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.4" />
      <path d="M2.5 10h19" />
      <path d="M6.5 14.5h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  chevron: <path d="m9 5 7 7-7 7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  trend: (
    <>
      <path d="m3 16 5.5-5.5 4 4L21 6" />
      <path d="M21 6h-5M21 6v5" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c0-8 5-13 16-13 0 9-6 13-13 13a8 8 0 0 1-3 0Z" />
      <path d="M9 15c2-3 5-5 8-6" />
    </>
  ),
  spark: <path d="M12 3.5 13.7 9 19 10.7 13.7 12.4 12 18l-1.7-5.6L5 10.7 10.3 9 12 3.5Z" />,
  message: <path d="M4 5.5h16v10H9l-4 3.5V15.5H4v-10Z" />,
  pencil: (
    <>
      <path d="M14.5 5.5l4 4" />
      <path d="M4 20.5l1-4L16 5.5a2 2 0 0 1 3 3L8 19.5l-4 1Z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  calendar2: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2.2" />
      <path d="M4 9.5h16M8 3v4M16 3v4" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  dollar: (
    <>
      <path d="M12 3v18" />
      <path d="M16.5 7.5c0-1.9-2-3-4.5-3S7.5 5.6 7.5 7.5 9.5 10 12 10.5s4.5 1.1 4.5 3-2 3-4.5 3-4.5-1.1-4.5-3" />
    </>
  ),
  /* --- clínicos --- */
  patient: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2.2" />
      <path d="M9 4a3 3 0 0 1 6 0" />
      <path d="M9 11h6M9 15h4" />
    </>
  ),
  plate: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
    </>
  ),
  pulse: <path d="M3 12h4l2.5-7 4 14 2.5-7H21" />,
  note: (
    <>
      <path d="M5 4h11l3 3v13H5V4Z" />
      <path d="M15 4v3h3" />
      <path d="M8 12h7M8 16h5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 2.5 20h19L12 4Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  print: (
    <>
      <path d="M7 9V4h10v5" />
      <rect x="4.5" y="9" width="15" height="7" rx="1.6" />
      <path d="M7 14h10v6H7z" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4.5h6V7" />
      <path d="M6 7l1 13h10l1-13" />
    </>
  ),
  archive: (
    <>
      <rect x="3.5" y="4.5" width="17" height="4" rx="1.2" />
      <path d="M5 8.5V20h14V8.5" />
      <path d="M10 12h4" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  swap: (
    <>
      <path d="M7 4 3 8l4 4" />
      <path d="M3 8h13a4 4 0 0 1 0 8h-2" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v3" />
      <path d="M6 6h12l3 7a4 4 0 0 1-6 0l3-7" />
      <path d="M6 6 3 13a4 4 0 0 0 6 0L6 6" />
      <path d="M8 21h8" />
    </>
  ),
  heart: <path d="M12 20s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9Z" />,
  download: (
    <>
      <path d="M12 4v10" />
      <path d="m8 11 4 4 4-4" />
      <path d="M5 19h14" />
    </>
  ),
  save: (
    <>
      <path d="M5 4h11l3 3v13H5V4Z" />
      <path d="M8 4v5h7V4" />
      <path d="M8 20v-6h8v6" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
      <path d="M16 16l4-4-4-4" />
      <path d="M20 12H9" />
    </>
  ),
};

export function Icon({ name, size = 24, className = '', ...rest }) {
  const p = ICON_PATHS[name] || ICON_PATHS.spark;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {p}
    </svg>
  );
}
