import { motion } from 'framer-motion';
import { useI18n } from '@/hooks/useI18n';
import { useReveal } from './Reveal';
import { ExperienceGroup } from '../types';

const Experience = () => {
  const { t, cv } = useI18n();
  const headingReveal = useReveal();
  // Gather every `experience` section and flatten their content groups so that
  // Professional Experience, Teaching and Volunteering, and Certifications are
  // all rendered (matching by `type`, not by translatable label text).
  const groups = cv.sections
    .filter((s) => s.type === 'experience')
    .flatMap((s) => s.content ?? []) as ExperienceGroup[];

  return (
    <section id="experience" className="py-20 px-6 bg-dark-surface relative">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          {...headingReveal}
          className="text-3xl sm:text-4xl font-bold mb-16 flex items-center"
        >
          {t.experience.title}
          <span className="ml-6 h-px bg-white/20 flex-grow max-w-xs"></span>
        </motion.h2>

        <div className="space-y-16">
          {groups.map((group) => (
            <div key={group.name}>
              <h3 className="text-xl font-mono text-neon-purple uppercase tracking-widest mb-8">
                {group.name}
              </h3>

              <div className="relative border-l border-white/20 ml-4 md:ml-6 space-y-12">
                {group.entity.map((job, index) => (
                  <motion.div
                    key={`${job.organization}-${job.dates}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-8 md:pl-12"
                  >
                    {/* Dot on timeline */}
                    <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-neon-magenta shadow-[0_0_10px_#ff00ff]"></span>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-lg hover:border-neon-cyan/50 transition-colors group">
                      <h4 className="text-2xl font-bold text-white group-hover:text-neon-cyan">
                        {job.position}
                      </h4>
                      <div className="flex flex-col md:flex-row md:justify-between text-neon-purple font-mono text-sm my-2">
                        <span>{job.organization}</span>
                        <span>{job.dates}</span>
                      </div>

                      {job.responsibilities && (
                        <ul className="mt-4 space-y-2">
                          {job.responsibilities.map((resp, i) => (
                            <li key={i} className="text-gray-400 text-sm flex items-start">
                              <span className="text-neon-cyan mr-2">▹</span>
                              {resp}
                            </li>
                          ))}
                        </ul>
                      )}

                      {job.certificate && (
                        <a
                          href={job.certificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-4 text-sm font-mono text-neon-cyan hover:text-white transition-colors"
                        >
                          {t.experience.viewCertificate}
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
