import { createContext, useContext, useState, ReactNode } from 'react';

export type Accent = 'emerald' | 'violet' | 'cyan' | 'orange';

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
  orange:  { color: 'text-orange-400',  colorRgb: '251,146,60',  colorHex: '#fb923c' },
};

const AccentContext = createContext<AccentContextValue>({
  accent: 'orange',
  setAccent: () => {},
  ...map.orange,
});

export function AccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState<Accent>('orange');
  return (
    <AccentContext.Provider value={{ accent, setAccent, ...map[accent] }}>
      {children}
    </AccentContext.Provider>
  );
}

export const useAccent = () => useContext(AccentContext);
