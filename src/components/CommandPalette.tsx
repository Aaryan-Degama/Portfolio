import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Folder, User, Award, Code2, Sparkles, X } from 'lucide-react';
import { useAccent } from '@/context/AccentContext';
import { projects, skills } from '@/data/portfolio';

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (target: string) => void;
}

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: typeof Search;
  action: () => void;
  group: string;
}

export default function CommandPalette({ open, onClose, onNavigate }: Props) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { color, colorHex } = useAccent();

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = [
      { id: 'nav-home', label: 'Go to Home', hint: 'Section', icon: Sparkles, action: () => onNavigate('hero'), group: 'Navigation' },
      { id: 'nav-projects', label: 'Go to Projects', hint: 'Section', icon: Folder, action: () => onNavigate('projects'), group: 'Navigation' },
      { id: 'nav-about', label: 'Go to About', hint: 'Section', icon: User, action: () => onNavigate('about'), group: 'Navigation' },
      { id: 'nav-playground', label: 'Open Playground', hint: 'Interactive', icon: Code2, action: () => onNavigate('playground'), group: 'Navigation' },
    ];
    const proj: Command[] = projects.map((p) => ({
      id: `proj-${p.id}`,
      label: p.title,
      hint: p.subtitle,
      icon: Folder,
      action: () => onNavigate('projects'),
      group: 'Projects',
    }));
    const skillList = [...skills.languages, ...skills.mlDl, ...skills.systems];
    const sk: Command[] = skillList.slice(0, 6).map((s) => ({
      id: `skill-${s}`,
      label: s,
      hint: 'Skill',
      icon: Code2,
      action: () => onNavigate('about'),
      group: 'Skills',
    }));
    return [...nav, ...proj, ...sk];
  }, [onNavigate]);

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
  }, [query, commands]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filtered[activeIndex]?.action();
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, filtered, activeIndex, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            className="relative w-full max-w-xl"
            initial={{ scale: 0.96, y: -10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: -10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-2xl border border-white/10 bg-zinc-950/90 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
                <Search className={`w-5 h-5 ${color}`} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects, skills, sections..."
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-[15px]"
                />
                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <div className="px-4 py-8 text-center text-zinc-500 text-sm">No results found</div>
                )}
                {filtered.map((cmd, i) => {
                  const Icon = cmd.icon;
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => { cmd.action(); onClose(); }}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        isActive ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? color : 'text-zinc-400'}`} />
                      <span className="flex-1 text-sm text-white font-medium">{cmd.label}</span>
                      <span className="text-xs text-zinc-500">{cmd.hint}</span>
                      {isActive && (
                        <ArrowRight className={`w-3.5 h-3.5 ${color}`} />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/10 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">↵</kbd> Select
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">Esc</kbd> Close
                </span>
                <span className="ml-auto" style={{ color: colorHex }}>{filtered.length} results</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
