import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Star, GitFork, ArrowUpRight, X } from 'lucide-react';
import { useAccent } from '@/context/AccentContext';
import { projects, Project } from '@/data/portfolio';

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const { color, colorHex } = useAccent();

  return (
    <section id="projects" className="relative px-6 md:px-16 lg:px-24 py-24">
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-xs font-mono uppercase tracking-widest ${color} mb-3`}
        >
          01 — Selected Work
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Featured Projects
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(220px,auto)]">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            onClick={() => setSelected(project)}
            accentColor={colorHex}
            accentClass={color}
          />
        ))}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} accentColor={colorHex} accentClass={color} />
    </section>
  );
}

interface CardProps {
  project: Project;
  index: number;
  onClick: () => void;
  accentColor: string;
  accentClass: string;
}

function ProjectCard({ project, index, onClick, accentColor, accentClass }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const [isHovered, setIsHovered] = useState(false);

  const colSpan = project.size === 'large' ? 'md:col-span-4' : project.size === 'medium' ? 'md:col-span-3' : 'md:col-span-2';
  const rowSpan = project.size === 'large' ? 'md:row-span-2' : '';

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    rotateX.set(((y - cy) / cy) * -8);
    rotateY.set(((x - cx) / cx) * 8);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`group relative rounded-2xl border border-white/10 bg-gradient-to-br ${project.color} backdrop-blur-xl p-6 cursor-pointer overflow-hidden ${colSpan} ${rowSpan}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 60px ${accentColor}15` }}
      />

      <div style={{ transform: 'translateZ(40px)' }} className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`text-xs font-mono uppercase tracking-wider ${accentClass}`}>{project.year}</div>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" /> {project.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" /> {project.forks}
            </span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
        <p className={`text-sm font-medium ${accentClass} mb-3`}>{project.subtitle}</p>
        <p className="text-sm text-zinc-400 leading-relaxed mb-5">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, project.size === 'small' ? 3 : 5).map((tag) => (
            <motion.span
              key={tag}
              animate={isHovered ? { y: [0, -2, 0] } : {}}
              transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0, delay: Math.random() * 0.3 }}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-zinc-300"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      <ArrowUpRight
        className="absolute top-5 right-5 w-5 h-5 text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:rotate-0 -rotate-12 transition-all"
        style={{ transform: 'translateZ(30px)' }}
      />
    </motion.div>
  );
}

interface ModalProps {
  project: Project | null;
  onClose: () => void;
  accentColor: string;
  accentClass: string;
}

function ProjectModal({ project, onClose, accentColor, accentClass }: ModalProps) {
  if (!project) return null;
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950/95 max-h-[85vh] overflow-y-auto"
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative bg-gradient-to-br ${project.color} p-8 border-b border-white/10`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className={`text-xs font-mono uppercase tracking-wider ${accentClass} mb-2`}>{project.year} · {project.status}</div>
          <h3 className="text-3xl font-bold text-white mb-1">{project.title}</h3>
          <p className={`text-sm font-medium ${accentClass}`}>{project.subtitle}</p>
        </div>

        <div className="p-8">
          <p className="text-zinc-300 leading-relaxed mb-6">{project.longDescription}</p>

          <div className="mb-6">
            <div className={`text-xs font-mono uppercase tracking-wider ${accentClass} mb-3`}>Key Highlights</div>
            <ul className="space-y-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-zinc-400">
                  <span style={{ backgroundColor: accentColor }} className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <div className={`text-xs font-mono uppercase tracking-wider ${accentClass} mb-3`}>Tech Stack</div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-zinc-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4" /> {project.stars} stars</span>
              <span className="flex items-center gap-1.5"><GitFork className="w-4 h-4" /> {project.forks} forks</span>
            </div>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-2 text-sm text-white hover:gap-3 transition-all"
              style={{ color: accentColor }}
            >
              View on GitHub <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
