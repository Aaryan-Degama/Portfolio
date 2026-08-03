import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AccentProvider } from '@/context/AccentContext';
import ParticleCanvas from '@/components/ParticleCanvas';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import About from '@/components/About';
import Footer from '@/components/Footer';
import FloatingControls from '@/components/FloatingControls';
import CommandPalette from '@/components/CommandPalette';
import ProjectPage from '@/components/ProjectPage';
import { projects } from '@/data/portfolio';
import { useAccent } from '@/context/AccentContext';
import { Search } from 'lucide-react';

function PortfolioSite() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pathname, setPathname] = useState(window.location.pathname);
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  const { colorRgb } = useAccent();

  const goTo = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setPathname(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigate = useCallback((target: string) => {
    if (pathname !== '/') {
      goTo('/');
      window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 50);
      return;
    }
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, [goTo, pathname]);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const userAgentData = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
    const platform = userAgentData?.platform ?? navigator.platform ?? navigator.userAgent;
    setIsAppleDevice(/mac|iphone|ipad|ipod/i.test(platform));
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

  const projectId = pathname.match(/^\/projects\/([^/]+)\/?$/)?.[1];
  const project = projectId ? projects.find((item) => item.id === projectId) : undefined;

  return (
      <div className="relative min-h-screen bg-zinc-950 text-white overflow-x-hidden">
        {/* Fixed background particle canvas */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <ParticleCanvas particleCount={90} connectionDistance={130} speed={0.3} />
        </div>

        {/* Ambient gradient overlays */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full blur-[120px]" style={{ backgroundColor: `rgba(${colorRgb}, 0.07)` }} />
          <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full blur-[120px]" style={{ backgroundColor: `rgba(${colorRgb}, 0.045)` }} />
        </div>

        {/* Framed container */}
        <div className="relative z-10">
          {/* Top nav bar */}
          <nav className="fixed top-0 left-0 right-0 z-40 px-6 md:px-16 lg:px-24 py-4 flex items-center justify-between backdrop-blur-md bg-zinc-950/40 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <span className="text-sm font-medium text-white hidden sm:block">Degama Aaryan</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="hidden items-center gap-1 sm:flex">
                {[
                { label: 'Home', target: 'hero' },
                { label: 'Projects', target: 'projects' },
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
              <button
                onClick={() => setPaletteOpen(true)}
                className="ml-1 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-400 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                aria-label="Open quick search"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Search</span>
                <kbd className="rounded bg-white/10 px-1 py-0.5 text-[10px] text-zinc-300">{isAppleDevice ? '⌘' : 'Ctrl'}</kbd>
                <kbd className="rounded bg-white/10 px-1 py-0.5 text-[10px] text-zinc-300">K</kbd>
              </button>
            </div>
          </nav>

          <main className="pt-16">
            {project ? (
              <ProjectPage project={project} onBack={() => goTo('/')} />
            ) : (
              <>
                <Hero onOpenPalette={() => setPaletteOpen(true)} onNavigate={navigate} />
                <Projects onOpenProject={(id) => goTo(`/projects/${id}`)} />
                <About />
              </>
            )}
          </main>

          {!project && <Footer onNavigate={navigate} />}
        </div>

        <FloatingControls />

        <AnimatePresence>
          {paletteOpen && (
            <CommandPalette
              open={paletteOpen}
              onClose={() => setPaletteOpen(false)}
              onNavigate={navigate}
              onOpenProject={(id) => goTo(`/projects/${id}`)}
            />
          )}
        </AnimatePresence>
      </div>
  );
}

function App() {
  return (
    <AccentProvider>
      <PortfolioSite />
    </AccentProvider>
  );
}

export default App;
