import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Activity, Zap } from 'lucide-react';
import { useAccent } from '@/context/AccentContext';
import ParticleCanvas from './ParticleCanvas';

export default function Playground() {
  const { color, colorHex, accent, setAccent } = useAccent();
  const [speed, setSpeed] = useState(0.4);
  const [density, setDensity] = useState(1);
  const [connectionDistance, setConnectionDistance] = useState(140);
  const [particleCount, setParticleCount] = useState(60);

  const reset = () => {
    setSpeed(0.4);
    setDensity(1);
    setConnectionDistance(140);
    setParticleCount(60);
  };

  return (
    <section id="playground" className="relative px-6 md:px-16 lg:px-24 py-24">
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-xs font-mono uppercase tracking-widest ${color} mb-3`}
        >
          02 — Playground
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Tweak the System
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-3 text-zinc-400 max-w-xl"
        >
          Adjust the sliders to control the particle field in real time. The same engine powering the background runs here.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
      >
        {/* Canvas preview */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-xl overflow-hidden h-[420px] relative">
          <ParticleCanvas
            particleCount={particleCount}
            connectionDistance={connectionDistance}
            speed={speed}
            density={density}
            interactive={true}
          />
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
            <Activity className={`w-3.5 h-3.5 ${color}`} />
            <span className="text-xs text-zinc-300 font-mono">live preview</span>
          </div>
          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-600">
            {Math.floor(particleCount * density)} particles · {speed.toFixed(1)}x speed
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className={`w-4 h-4 ${color}`} />
              <span className="text-sm font-medium text-white">Controls</span>
            </div>
            <button
              onClick={reset}
              className="text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/5"
            >
              Reset
            </button>
          </div>

          <Slider
            label="Speed"
            icon={Zap}
            value={speed}
            min={0.1}
            max={2}
            step={0.1}
            onChange={setSpeed}
            display={`${speed.toFixed(1)}x`}
            accentColor={colorHex}
          />

          <Slider
            label="Particle Count"
            icon={Activity}
            value={particleCount}
            min={20}
            max={150}
            step={5}
            onChange={(v) => setParticleCount(v)}
            display={`${particleCount}`}
            accentColor={colorHex}
          />

          <Slider
            label="Connection Distance"
            icon={Activity}
            value={connectionDistance}
            min={50}
            max={250}
            step={10}
            onChange={setConnectionDistance}
            display={`${connectionDistance}px`}
            accentColor={colorHex}
          />

          <Slider
            label="Density"
            icon={Activity}
            value={density}
            min={0.3}
            max={2}
            step={0.1}
            onChange={setDensity}
            display={`${density.toFixed(1)}x`}
            accentColor={colorHex}
          />

          <div>
            <div className="text-xs text-zinc-500 mb-2 font-medium">Accent Color</div>
            <div className="flex gap-2">
              {(['emerald', 'violet', 'cyan'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAccent(a)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all border ${
                    accent === a
                      ? 'border-white/20 bg-white/10 text-white'
                      : 'border-white/5 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

interface SliderProps {
  label: string;
  icon: typeof Zap;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
  accentColor: string;
}

function Slider({ label, icon: Icon, value, min, max, step, onChange, display, accentColor }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 text-sm text-zinc-300">
          <Icon className="w-3.5 h-3.5 text-zinc-500" />
          {label}
        </span>
        <span className="text-xs font-mono text-zinc-400">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none"
        style={{
          background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${pct}%, rgba(255,255,255,0.1) ${pct}%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
    </div>
  );
}
