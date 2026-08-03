import { createContext, useContext, useState, ReactNode } from 'react';

export type Accent = 'emerald' | 'violet' | 'cyan';

interface AccentContextValue {
  accent: Accent;
  setAccent: (a: Accent) => void;
  color: string;
  colorRgb: string;
  colorHex: string;
}

const map: Record<Accent, { color: string; colorRgb: string; colorHex: string }> = {
  emerald: { color: 'text-emerald-400', colorRgb: '52,211,153', colorHex: '#34d399' },
  violet:  { color: 'text-violet-400',  colorRgb: '167,139,250', colorHex: '#a78bfa' },
  cyan:    { color: 'text-cyan-400',    colorRgb: '34,211,238',  colorHex: '#22d3ee' },
};

const AccentContext = createContext<AccentContextValue>({
  accent: 'emerald',
  setAccent: () => {},
  ...map.emerald,
});

export function AccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState<Accent>('emerald');
  return (
    <AccentContext.Provider value={{ accent, setAccent, ...map[accent] }}>
      {children}
    </AccentContext.Provider>
  );
}

export const useAccent = () => useContext(AccentContext);
