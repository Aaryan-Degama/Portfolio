import { motion } from 'framer-motion';
import { Code2, Cpu, Database, Globe, GraduationCap, Trophy } from 'lucide-react';
import { useAccent } from '@/context/AccentContext';
import { skills, achievements } from '@/data/portfolio';

export default function About() {
  const { color } = useAccent();

  const groups = [
    { label: 'Languages', icon: Code2, items: skills.languages },
    { label: 'ML / Deep Learning', icon: Cpu, items: skills.mlDl },
    { label: 'Systems & Tools', icon: Database, items: skills.systems },
    { label: 'Databases', icon: Database, items: skills.databases },
    { label: 'Web & APIs', icon: Globe, items: skills.webApis },
  ];

  return (
    <section id="about" className="relative px-6 md:px-16 lg:px-24 py-24">
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-xs font-mono uppercase tracking-widest ${color} mb-3`}
        >
          03 — About
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Skills & Experience
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-1 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className={`w-4 h-4 ${color}`} />
            <span className="text-sm font-medium text-white">Profile</span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed mb-5">
            B.Tech IT student at IIIT Allahabad focused on on-device ML systems, C++ performance,
            and practical AI deployment. Competitive programmer with a passion for building tools
            that work without the cloud.
          </p>
          <div className="space-y-3">
            {achievements.map((a) => (
              <div key={a.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <div className="text-sm text-zinc-300 font-medium">{a.label}</div>
                  <div className="text-[10px] text-zinc-600">{a.sub}</div>
                </div>
                <div className={`text-lg font-bold ${color}`}>{a.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {groups.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.label} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-sm font-medium text-white">{g.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <motion.span
                      key={item}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-zinc-300 hover:border-white/20 cursor-default"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Achievement strip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Trophy className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-medium text-white">Achievements</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((a) => (
            <div key={a.label} className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
              <div className={`text-2xl font-bold ${color}`}>{a.value}</div>
              <div className="text-xs text-zinc-400 mt-1">{a.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
