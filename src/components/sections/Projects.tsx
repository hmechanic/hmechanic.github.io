import { motion } from 'framer-motion';
import { ExternalLink, Folder, Satellite } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useI18n } from '@/hooks/useI18n';
import { useReveal } from '@/hooks/useReveal';

const Projects = () => {
  const { t } = useI18n();
  // The Projects heading is right-aligned, so it drifts in from the right.
  const headingReveal = useReveal(0, 'right');
  // Project titles/tech/links are language-independent; descriptions come from
  // the translation dictionary, keyed by title.
  const flagshipProjects = [
    { name: 'Orion Atiende', url: 'https://orionatiende.com' },
    { name: 'SatEmis', url: 'https://satemis.com' },
  ];
  const projects = [
    {
      title: 'Creasinhumo',
      tech: ['NestJS', 'Docker', 'GCP', 'Python'],
      github: 'https://github.com/satemis/b-satemi',
      external: '#',
      featured: true,
    },
    {
      title: 'cv-tool',
      tech: ['React', 'TypeScript', 'Vite'],
      github: 'https://github.com/satemis/f-satemis',
      external: '#',
      featured: true,
    },
    {
      title: 'Deep Learning Concepts',
      tech: ['Python', 'PyTorch', 'TensorFlow'],
      github: 'https://github.com/hmechanic/deep-leaning.ai',
      external: '#',
      featured: false,
    },
  ];

  return (
    <section id="projects" className="py-20 px-6 bg-dark-bg">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          {...headingReveal}
          className="text-3xl sm:text-4xl font-bold mb-16 flex items-center justify-end"
        >
          <span className="mr-6 h-px bg-white/20 flex-grow max-w-xs"></span>
          {t.projects.title}
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6">
          {flagshipProjects.map((project, index) => (
            <motion.a
              key={project.url}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${index === 0 ? 'border-[#2c2c34] bg-[#111115] hover:border-[#7c5cbf] focus-visible:border-[#7c5cbf] lg:col-start-2' : 'border-[#dbeafe] bg-[#f8fafc] hover:border-[#155dfc] focus-visible:border-[#155dfc]'} group relative isolate min-h-72 overflow-hidden rounded-xl border p-8 shadow-[0_4px_24px_#0006] transition-all duration-300 hover:-translate-y-2 focus-visible:outline-none lg:col-span-2`}
            >
              {index === 0 && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute -right-20 -top-24 -z-10 h-64 w-64 rounded-full bg-[#7c5cbf]/15 blur-3xl transition-transform duration-500 group-hover:scale-125"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_48%)]"
                  />

                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="relative grid h-10 w-10 place-items-center">
                          <span className="absolute inset-1 rotate-45 rounded-[9px] border border-[#7c5cbf]/70 bg-[#7c5cbf]/15" />
                          <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[#c4b0f0] shadow-[0_0_16px_#7c5cbf]" />
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#aaa6b8]">
                          Orion 1.0
                        </span>
                      </div>
                      <ExternalLink
                        size={18}
                        className="text-[#7a7888] transition-colors group-hover:text-[#c4b0f0]"
                      />
                    </div>

                    <div className="mt-8">
                      <h3 className="text-2xl font-semibold tracking-tight text-[#f0eff4]">
                        Orion AI
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#aaa6b8]">
                        {t.projects.descriptions['Orion Atiende']}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2 pt-7 font-mono text-[10px] uppercase tracking-[0.12em] text-[#c4b0f0]">
                      {['CRM', 'RAG', 'AI Agents'].map((technology) => (
                        <span
                          key={technology}
                          className="rounded-full border border-[#7c5cbf]/30 bg-[#7c5cbf]/10 px-2.5 py-1"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {index === 1 && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full bg-[#9810fa]/10 blur-3xl transition-transform duration-500 group-hover:scale-125"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-[linear-gradient(145deg,rgba(21,93,252,0.08),transparent_45%)]"
                  />

                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#155dfc] to-[#9810fa] text-white shadow-[0_8px_24px_rgba(21,93,252,0.25)]">
                          <Satellite size={21} strokeWidth={1.8} />
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#4a5565]">
                          Sentinel-5P
                        </span>
                      </div>
                      <ExternalLink
                        size={18}
                        className="text-[#94a3b8] transition-colors group-hover:text-[#155dfc]"
                      />
                    </div>

                    <div className="mt-6">
                      <h3 className="text-2xl font-semibold tracking-tight text-[#101828]">
                        SatEmis
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#4a5565]">
                        {t.projects.descriptions.SatEmis}
                      </p>
                    </div>

                    <div className="mt-auto rounded-lg border border-[#dbeafe] bg-white/80 p-3 shadow-sm">
                      <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-[#4a5565]">
                        <span>CH4</span>
                        <span>Median composite</span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="h-1.5 rounded-full bg-[linear-gradient(90deg,#0000ff,#00ffff,#00ff00,#ffff00,#ff0000)]"
                      />
                      <div className="mt-1.5 flex justify-between font-mono text-[9px] text-[#64748b]">
                        <span>1640</span>
                        <span>1960+ ppb</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.a>
          ))}
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 2) * 0.1 }}
              className="lg:col-span-2 bg-dark-surface border border-white/5 rounded-xl p-8 hover:-translate-y-2 hover:border-neon-green/50 transition-all duration-300 group"
            >
              <div className="flex justify-between items-center mb-6">
                <Folder size={40} className="text-neon-cyan" />
                <div className="flex gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaGithub size={20} />
                    </a>
                  )}
                  {project.external && project.external !== '#' && (
                    <a
                      href={project.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-green transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                {t.projects.descriptions[project.title]}
              </p>

              <div className="flex flex-wrap gap-3 mt-auto">
                {project.tech.map((t) => (
                  <span key={t} className="text-xs font-mono text-neon-purple">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
