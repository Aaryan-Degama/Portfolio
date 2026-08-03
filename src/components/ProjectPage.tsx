import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Check, Download, Github, Image, Layers } from 'lucide-react';
import { Project } from '@/data/portfolio';
import { useAccent } from '@/context/AccentContext';

interface Props {
  project: Project;
  onBack: () => void;
}

export default function ProjectPage({ project, onBack }: Props) {
  const { color, colorHex, colorRgb } = useAccent();

  return (
    <main className="relative min-h-screen px-6 pb-24 pt-32 md:px-16 lg:px-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] opacity-70"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(${colorRgb}, 0.22), transparent 70%)` }}
      />
      <div className="relative mx-auto max-w-6xl">
        <button
          onClick={onBack}
          className="mb-12 flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> All projects
        </button>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`mb-4 text-xs font-mono uppercase tracking-[0.2em] ${color}`}>
            {project.year} · {project.status}
          </div>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl">{project.title}</h1>
          <p className={`mt-4 text-lg font-medium md:text-xl ${color}`}>{project.subtitle}</p>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-300">{project.longDescription}</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ['Status', project.status],
            ['Year', project.year],
            ['Technologies', String(project.tags.length)],
            ['Core stack', project.tags.slice(0, 2).join(' · ')],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-zinc-950/50 p-4 backdrop-blur-md">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{label}</div>
              <div className="mt-1 text-lg font-semibold text-white capitalize">{value}</div>
            </div>
          ))}
        </div>

        {project.id === 'vanta' && <VantaVisuals color={color} colorHex={colorHex} />}
        {project.id === 'lilcv' && <LilCvVisual color={color} colorHex={colorHex} />}

        <div className="mt-16 grid gap-6 lg:grid-cols-5">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 lg:col-span-2">
            <div className="mb-6 flex items-center gap-2 text-sm font-medium text-white">
              <Check className={`h-4 w-4 ${color}`} /> Built for impact
            </div>
            <ul className="space-y-4">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-zinc-400">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full" style={{ backgroundColor: colorHex }} />
                  {highlight}
                </li>
              ))}
            </ul>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] lg:col-span-3">
            <div className="flex items-center justify-between border-b border-white/10 px-7 py-5">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Layers className={`h-4 w-4 ${color}`} /> Tech stack, unpacked
              </div>
              <span className="text-xs font-mono text-zinc-500">{project.tags.length} tools</span>
            </div>
            <div className="grid sm:grid-cols-2">
              {project.tags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ x: 4 }}
                  className="group flex items-center gap-4 border-b border-white/5 px-7 py-4 odd:sm:border-r odd:sm:border-white/5"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-mono text-xs" style={{ color: colorHex }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-sm text-zinc-300 transition-colors group-hover:text-white">{tag}</span>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-white/10 pt-8">
          {project.releaseUrl && (
            <a
              href={project.releaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5"
              style={{ borderColor: `${colorHex}70`, color: colorHex }}
            >
              <Download className="h-4 w-4" /> Download Vanta v0.1.1 <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-2 text-sm font-medium transition-all hover:gap-3" style={{ color: colorHex }}>
            <Github className="h-4 w-4" /> View on GitHub <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </main>
  );
}

function VantaVisuals({ color, colorHex }: { color: string; colorHex: string }) {
  const assetUrl = (fileName: string) => `${import.meta.env.BASE_URL}project-assets/${fileName}`;
  const screens = [
    { src: assetUrl('vanta-search.jpg'), alt: 'Vanta natural language search screen', label: 'Natural-language search' },
    { src: assetUrl('vanta-people.png'), alt: 'Vanta people recognition screen', label: 'People and face clusters' },
  ];

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className={`mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] ${color}`}>
            <Image className="h-3.5 w-3.5" /> In the app
          </div>
          <h2 className="text-2xl font-bold text-white">Private search, made tangible.</h2>
        </div>
        <span className="hidden text-sm text-zinc-500 sm:block">Runs entirely on-device</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        {screens.map((screen, index) => (
          <motion.figure
            key={screen.src}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-2 lg:col-span-1"
          >
            <img src={screen.src} alt={screen.alt} loading="lazy" className="h-80 w-full rounded-xl object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
            <figcaption className="px-2 py-3 text-xs font-medium text-zinc-300">{screen.label}</figcaption>
          </motion.figure>
        ))}
        <motion.figure
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-2 lg:col-span-3"
        >
          <div className="relative overflow-hidden rounded-xl">
            <img src={assetUrl('vanta-architecture.png')} alt="Vanta on-device system architecture" loading="lazy" className="h-80 w-full object-cover object-top" />
            <div className="absolute inset-x-0 bottom-0 h-20" style={{ background: `linear-gradient(transparent, ${colorHex}40)` }} />
          </div>
          <figcaption className="px-2 py-3 text-xs font-medium text-zinc-300">One local pipeline — from media scan to semantic retrieval.</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

function LilCvVisual({ color, colorHex }: { color: string; colorHex: string }) {
  const stages = ['Input image', 'MiDaS depth map', 'Depth-aware blur'];
  return (
    <section className="mt-16 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className={`mb-2 text-xs font-mono uppercase tracking-[0.2em] ${color}`}>Depth pipeline</div>
      <h2 className="text-2xl font-bold text-white">A lightweight path from pixels to depth.</h2>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {stages.map((stage, index) => (
          <div key={stage} className="relative overflow-hidden rounded-xl border border-white/10 bg-zinc-950/70 p-5">
            <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at ${25 + index * 25}% 30%, ${colorHex}, transparent 48%)` }} />
            <div className="relative font-mono text-[10px] tracking-widest text-zinc-500">0{index + 1}</div>
            <div className="relative mt-8 h-20 rounded-lg border border-white/10" style={{ background: index === 1 ? `linear-gradient(135deg, #111, ${colorHex}, #eee)` : `linear-gradient(135deg, ${colorHex}50, #18181b 70%)` }} />
            <div className="relative mt-4 text-sm font-medium text-zinc-200">{stage}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
