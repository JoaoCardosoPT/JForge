import type { ReactNode } from 'react';

export type IconName =
  | 'github' | 'discord' | 'external' | 'code' | 'cloud' | 'layers'
  | 'nodes' | 'home' | 'list' | 'puzzle' | 'settings' | 'play' | 'pause'
  | 'mail' | 'database' | 'http' | 'minus' | 'plus' | 'fit' | 'chevron-down';

const drawings: Record<IconName, ReactNode> = {
  github: <path fill="currentColor" stroke="none" d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.64 1.22 3.28.93.1-.73.39-1.22.72-1.5-2.5-.29-5.13-1.26-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.97 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.62 0c2.15-1.46 3.1-1.15 3.1-1.15.61 1.54.23 2.69.11 2.97.72.79 1.16 1.79 1.16 3.02 0 4.32-2.63 5.28-5.14 5.56.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.25 11.25 0 0 0 12 .75Z" />,
  discord: <path fill="currentColor" stroke="none" d="M20.3 4.4a20.1 20.1 0 0 0-4.9-1.5l-.6 1.2a18.7 18.7 0 0 0-5.6 0l-.6-1.2a20.1 20.1 0 0 0-4.9 1.5C.6 9 .1 13.4.4 17.7a20 20 0 0 0 6 3l1.2-2a12.6 12.6 0 0 1-1.9-.9l.5-.4a14.1 14.1 0 0 0 11.6 0l.5.4-1.9.9 1.2 2a20 20 0 0 0 6-3c.4-5-1-9.4-3.3-13.3ZM8.1 15.1c-1.2 0-2.1-1.1-2.1-2.5s.9-2.5 2.1-2.5 2.1 1.1 2.1 2.5-.9 2.5-2.1 2.5Zm7.8 0c-1.2 0-2.1-1.1-2.1-2.5s.9-2.5 2.1-2.5 2.1 1.1 2.1 2.5-.9 2.5-2.1 2.5Z" />,
  external: <><path d="M14 4h6v6m0-6-9 9" /><path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" /></>,
  code: <path d="m7 6-5 6 5 6m10-12 5 6-5 6m-3-15-4 18" />,
  cloud: <path d="M7 18a5 5 0 0 1-1-9.9A6 6 0 0 1 17.8 8a5 5 0 0 1 .2 10Z" />,
  layers: <path d="m12 2 10 6-10 6L2 8Zm-9 11 9 5 9-5M3 18l9 5 9-5" />,
  nodes: <><circle cx="12" cy="5" r="3" /><circle cx="5" cy="19" r="3" /><circle cx="19" cy="19" r="3" /><path d="m10.5 7.6-4 8.8m7-8.8 4 8.8M8 19h8" /></>,
  home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1Z" />,
  list: <path d="M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1" />,
  puzzle: <path d="M9 4H5v5a3 3 0 1 0 0 6v5h5a3 3 0 1 1 6 0h4v-5a3 3 0 1 0 0-6V4h-5a3 3 0 1 0-6 0Z" />,
  settings: <><path d="m9 3-.7 3-2.7 1L3 6l-2 3 2 2v3l-2 2 2 3 2.6-1 2.7 1 .7 3h4l.7-3 2.7-1 2.6 1 2-3-2-2v-3l2-2-2-3-2.6 1-2.7-1L13 3Z" /><circle cx="11" cy="12.5" r="3" /></>,
  play: <path d="m7 3 14 9-14 9Z" />,
  pause: <path d="M7 4v16M17 4v16" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 6 9 7 9-7" /></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  http: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 8h20M7 11l-2 3 2 3m10-6 2 3-2 3m-6 0 2-6" /></>,
  minus: <path d="M5 12h14" />,
  plus: <path d="M5 12h14M12 5v14" />,
  fit: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
};

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" focusable="false">
      {drawings[name]}
    </svg>
  );
}
