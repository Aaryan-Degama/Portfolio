import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AccentProvider } from '@/context/AccentContext';
import ParticleCanvas from '@/components/ParticleCanvas';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Playground from '@/components/Playground';
import About from '@/components/About';
import Footer from '@/components/Footer';
import FloatingControls from '@/components/FloatingControls';
import CommandPalette from '@/components/CommandPalette';

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  const navigate = useCallback((target: string) => {
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <AccentProvider>
      <div className="relative min-h-screen bg-zinc-950 text-white overflow-x-hidden">
        {/* Fixed background particle canvas */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <ParticleCanvas particleCount={90} connectionDistance={130} speed={0.3} />
        </div>

        {/* Ambient gradient overlays */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
        </div>

        {/* Framed container */}
        <div className="relative z-10">
          {/* Top nav bar */}
          <nav className="fixed top-0 left-0 right-0 z-40 px-6 md:px-16 lg:px-24 py-4 flex items-center justify-between backdrop-blur-md bg-zinc-950/40 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <span className="text-sm font-medium text-white hidden sm:block">Aaryan.dev</span>
            </div>
            <div className="flex items-center gap-1">
              {[
                { label: 'Home', target: 'hero' },
                { label: 'Projects', target: 'projects' },
                { label: 'Playground', target: 'playground' },
                { label: 'About', target: 'about' },
              ].map((item) => (
                <button
                  key={item.target}
                  onClick={() => navigate(item.target)}
                  className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          <main className="pt-16">
            <Hero onOpenPalette={() => setPaletteOpen(true)} onNavigate={navigate} />
            <Projects />
            <Playground />
            <About />
          </main>

          <Footer onNavigate={navigate} />
        </div>

        <FloatingControls />

        <AnimatePresence>
          {paletteOpen && (
            <CommandPalette
              open={paletteOpen}
              onClose={() => setPaletteOpen(false)}
              onNavigate={navigate}
            />
          )}
        </AnimatePresence>
      </div>
    </AccentProvider>
  );
}

export default App;
