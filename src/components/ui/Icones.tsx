import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { titulo?: string };

function Svg({ titulo, children, ...rest }: P) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={titulo ? undefined : true}
      role={titulo ? "img" : undefined}
      {...rest}
    >
      {titulo && <title>{titulo}</title>}
      {children}
    </svg>
  );
}

export const IconeCheck = (p: P) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);
export const IconeX = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
export const IconeSeta = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
export const IconeChevron = (p: P) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);
export const IconeCamera = (p: P) => (
  <Svg {...p}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </Svg>
);
export const IconeTexto = (p: P) => (
  <Svg {...p}>
    <path d="M5 6h14M5 12h14M5 18h9" />
  </Svg>
);
export const IconeLivro = (p: P) => (
  <Svg {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
    <path d="M4 18V5.5M8 7h8M8 11h6" />
  </Svg>
);
export const IconeLupa = (p: P) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4-4" />
  </Svg>
);
export const IconeEstrela = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 17l-5.3 2.7 1.1-5.9-4.3-4.1 5.9-.8z" />
  </Svg>
);
export const IconeCadeado = (p: P) => (
  <Svg {...p}>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </Svg>
);
export const IconeMenu = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);
export const IconeAlvo = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.5" />
  </Svg>
);
export const IconeLampada = (p: P) => (
  <Svg {...p}>
    <path d="M9 18h6M10 21h4M8.5 14.5A6 6 0 1 1 15.5 14.5c-.6.6-1 1.5-1 2.5h-5c0-1-.4-1.9-1-2.5z" />
  </Svg>
);
export const IconeCaneta = (p: P) => (
  <Svg {...p}>
    <path d="M4 20l4-1 10.5-10.5a2.1 2.1 0 0 0-3-3L5 16z" />
    <path d="M13 7l3 3" />
  </Svg>
);
export const IconeRelogio = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);
export const IconeUpload = (p: P) => (
  <Svg {...p}>
    <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
  </Svg>
);
export const IconeAlerta = (p: P) => (
  <Svg {...p}>
    <path d="M12 4l9 16H3z" />
    <path d="M12 10v4M12 17.5v.5" />
  </Svg>
);
export const IconeExterno = (p: P) => (
  <Svg {...p}>
    <path d="M14 5h5v5M19 5l-8 8M19 14v5H5V5h5" />
  </Svg>
);
export const IconeCopiar = (p: P) => (
  <Svg {...p}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </Svg>
);
export const IconeImpressora = (p: P) => (
  <Svg {...p}>
    <path d="M6 9V4h12v5" />
    <rect x="4" y="9" width="16" height="7" rx="1.5" />
    <path d="M6 16v4h12v-4" />
  </Svg>
);
export const IconeLixeira = (p: P) => (
  <Svg {...p}>
    <path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    <path d="M10 11v6M14 11v6" />
  </Svg>
);
export const IconeTendencia = (p: P) => (
  <Svg {...p}>
    <path d="M4 16l5.5-5.5 4 4L20 7" />
    <path d="M14 7h6v6" />
  </Svg>
);
