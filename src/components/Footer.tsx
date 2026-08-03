import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useAccent } from '@/context/AccentContext';
import { skills } from '@/data/portfolio';

interface Props {
  onNavigate: (target: string) => void;
}

export default function Footer({ onNavigate }: Props) {
  const { color, colorHex } = useAccent();
  const allSkills = [...skills.languages, ...skills.mlDl, ...skills.systems];

  return (
    <footer className="relative px-6 md:px-16 lg:px-24 py-16 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div>
          <div className="text-2xl font-bold text-white mb-2">Degama Aaryan Jitendrakumar</div>
          <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
            Building on-device ML systems and accessible AI tools. Open to opportunities.
          </p>
        </div>

        <div>
          <div className={`text-xs font-mono uppercase tracking-wider ${color} mb-3`}>Navigate</div>
          <div className="flex flex-col gap-2">
            {['hero', 'projects', 'about'].map((s) => (
              <button
                key={s}
                onClick={() => onNavigate(s)}
                className="text-sm text-zinc-400 hover:text-white transition-colors text-left capitalize"
              >
                {s === 'hero' ? 'Home' : s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className={`text-xs font-mono uppercase tracking-wider ${color} mb-3`}>Stack</div>
          <div className="flex flex-wrap gap-1.5">
            {allSkills.slice(0, 10).map((s) => (
              <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-400">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <p className="text-xs text-zinc-600">
          © 2025 Degama Aaryan Jitendrakumar. Crafted with React, Vite & Framer Motion.
        </p>
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors"
        >
          Back to top
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10"
            style={{ backgroundColor: `${colorHex}15` }}
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </span>
        </motion.button>
      </div>
    </footer>
  );
}
