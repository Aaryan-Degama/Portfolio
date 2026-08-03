import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Palette, Check } from 'lucide-react';
import { useAccent, Accent } from '@/context/AccentContext';

const accentOptions: { id: Accent; label: string; hex: string }[] = [
  { id: 'emerald', label: 'Emerald', hex: '#34d399' },
  { id: 'violet',  label: 'Electric Violet', hex: '#a78bfa' },
  { id: 'cyan',    label: 'Cyber Cyan', hex: '#22d3ee' },
  { id: 'orange',  label: 'Solar Orange', hex: '#fb923c' },
];

export default function FloatingControls() {
  const [muted, setMuted] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { accent, setAccent } = useAccent();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<{ freq: number; osc: OscillatorNode; gain: GainNode }[]>([]);

  function playHover() {
    if (muted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch { /* no-op */ }
  }

  function stopAmbient() {
    oscillatorsRef.current.forEach(({ osc, gain }) => {
      try {
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current!.currentTime + 0.4);
        osc.stop(audioCtxRef.current!.currentTime + 0.4);
      } catch { /* no-op */ }
    });
    oscillatorsRef.current = [];
  }

  function startAmbient() {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const freqs = [110, 165, 220];
      oscillatorsRef.current = freqs.map((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 1.5);
        osc.start();
        return { freq, osc, gain };
      });
    } catch { /* no-op */ }
  }

  useEffect(() => {
    if (!muted) startAmbient();
    return () => stopAmbient();
  }, [muted]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
    >
      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="mr-1 flex max-w-[calc(100vw-7rem)] flex-wrap justify-end gap-1.5 rounded-xl border border-white/10 bg-zinc-950/90 px-2 py-1.5 backdrop-blur-xl shadow-xl"
          >
            {accentOptions.map((opt) => (
              <button
                key={opt.id}
                onMouseEnter={playHover}
                onClick={() => { setAccent(opt.id); }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  accent === opt.id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.hex }} />
                {opt.label}
                {accent === opt.id && <Check className="w-3 h-3" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onMouseEnter={playHover}
        onClick={() => setPaletteOpen((v) => !v)}
        className="w-10 h-10 rounded-xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all shadow-lg"
        aria-label="Theme accent color"
      >
        <Palette className="w-4.5 h-4.5" />
      </button>

      <button
        onMouseEnter={playHover}
        onClick={() => setMuted((v) => !v)}
        className="w-10 h-10 rounded-xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all shadow-lg"
        aria-label="Toggle sound"
      >
        {muted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
      </button>
    </motion.div>
  );
}
