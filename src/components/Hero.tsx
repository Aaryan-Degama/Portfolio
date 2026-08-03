import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { useAccent } from '@/context/AccentContext';
import { achievements } from '@/data/portfolio';

interface Props {
  onOpenPalette: () => void;
  onNavigate: (target: string) => void;
}

export default function Hero({ onOpenPalette, onNavigate }: Props) {
  const { color, colorHex } = useAccent();
  const [isAppleDevice, setIsAppleDevice] = useState(false);

  useEffect(() => {
    const userAgentData = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
    const platform = userAgentData?.platform ?? navigator.platform ?? navigator.userAgent;
    setIsAppleDevice(/mac|iphone|ipad|ipod/i.test(platform));
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24">
      <motion.div
        className="max-w-5xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
        >
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: colorHex }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: colorHex }} />
          </span>
          <span className="text-xs font-medium text-zinc-300 tracking-wide">Available for projects</span>
        </motion.div>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95]"
        >
          Degama Aaryan
          <br />
          Jitendrakumar
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed"
        >
          Software & ML engineer building privacy-first, on-device AI systems in C++ and React Native.
          Currently working on <span className={color}>Vanta</span> — natural-language search for your local media,
          with no cloud involved.
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={() => onNavigate('projects')}
            className="group relative px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
            style={{ backgroundColor: `${colorHex}20`, border: `1px solid ${colorHex}40` }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${colorHex}30`; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${colorHex}20`; }}
          >
            View Work
            <ArrowDown className="inline-block w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={onOpenPalette}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-zinc-300 border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all"
          >
            <span>Quick Search</span>
            <span className="ml-1 flex items-center gap-1" aria-label={`${isAppleDevice ? 'Command' : 'Control'} K`}>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-zinc-400 group-hover:text-zinc-200">
                {isAppleDevice ? '⌘' : 'Ctrl'}
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-zinc-400 group-hover:text-zinc-200">K</kbd>
            </span>
          </button>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="mt-10 flex items-center gap-5"
        >
          {[
            { Icon: Github, href: 'https://github.com' },
            { Icon: Linkedin, href: 'https://linkedin.com' },
            { Icon: Mail, href: 'mailto:hello@example.com' },
          ].map(({ Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl"
        >
          {achievements.map((a) => (
            <div key={a.label} className="rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-sm p-4">
              <div className={`text-2xl font-bold ${color}`}>{a.value}</div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">{a.label}</div>
              <div className="text-[10px] text-zinc-600 mt-0.5">{a.sub}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => onNavigate('projects')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowDown className="w-5 h-5" />
      </motion.button>
    </section>
  );
}
