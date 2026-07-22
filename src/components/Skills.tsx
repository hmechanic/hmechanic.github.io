import { motion } from 'framer-motion';
import { useI18n } from '@/hooks/useI18n';
import { useReveal } from './Reveal';
import { SkillCategory } from '@/types/cv';

const Skills = () => {
  const { t, cv } = useI18n();
  const headingReveal = useReveal();
  // Match by section type (language-independent); the skills section has a
  // single content group whose label differs per language.
  const skillsData = (cv.sections.find((s) => s.type === 'skills')?.content?.[0]?.entity ||
    []) as SkillCategory[];

  return (
    <section id="skills" className="py-20 px-6 bg-dark-bg relative overflow-hidden">
      {/* Background decorative elements */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl -z-10"
      ></div>
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl -z-10"
      ></div>

      <div className="max-w-5xl mx-auto">
        <motion.h2 {...headingReveal} className="text-3xl font-bold text-center mb-16">
          {t.skills.title}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {skillsData.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm"
            >
              <h3 className="text-xl font-bold text-neon-magenta mb-4">{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {/* Split on top-level commas only, so items with an
                                    internal list like "Databases (SQL, NoSQL, vector)"
                                    stay in a single chip instead of breaking apart. */}
                {category.data
                  .split(/,(?![^(]*\))/)
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-black/50 border border-white/20 rounded-full text-sm text-gray-300 hover:border-neon-cyan hover:text-white transition-colors cursor-default"
                    >
                      {skill}
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

export default Skills;
