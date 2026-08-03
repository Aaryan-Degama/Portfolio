import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useAccent } from '@/context/AccentContext';
import { projects, Project } from '@/data/portfolio';

interface Props {
  onOpenProject: (projectId: string) => void;
}

export default function Projects({ onOpenProject }: Props) {
  const { color, colorHex, colorRgb } = useAccent();

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
            onClick={() => onOpenProject(project.id)}
            accentColor={colorHex}
            accentClass={color}
            accentRgb={colorRgb}
          />
        ))}
      </div>

    </section>
  );
}

interface CardProps {
  project: Project;
  index: number;
  onClick: () => void;
  accentColor: string;
  accentClass: string;
  accentRgb: string;
}

function ProjectCard({ project, index, onClick, accentColor, accentClass, accentRgb }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const [isHovered, setIsHovered] = useState(false);

  const colSpan = project.size === 'large' ? 'md:col-span-4' : project.size === 'medium' ? 'md:col-span-3' : 'md:col-span-2';

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
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        backgroundImage: `linear-gradient(135deg, rgba(${accentRgb}, 0.22), rgba(9, 9, 11, 0.72))`,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`group relative rounded-2xl border border-white/10 backdrop-blur-xl p-6 cursor-pointer overflow-hidden ${colSpan}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 60px ${accentColor}15` }}
      />

      <div style={{ transform: 'translateZ(40px)' }} className="relative">
        <div className="mb-4">
          <div className={`text-xs font-mono uppercase tracking-wider ${accentClass}`}>{project.year}</div>
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
