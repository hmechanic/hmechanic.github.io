import { motion } from 'framer-motion';
import { cvData } from '../utils/loadCv';
import { SkillCategory } from '../types';

const Skills = () => {
    const skillsData = (cvData.sections.find(s => s.type === 'skills')?.content.find(c => c.name === "Habilidades")?.entity || []) as SkillCategory[];

    return (
        <section className="py-20 px-6 bg-dark-bg relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-16">
                    <span className="text-neon-cyan">Stack</span> Tecnológico
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {skillsData.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm"
                        >
                            <h3 className="text-xl font-bold text-neon-magenta mb-4">{category.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                {category.data.split(',').map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-black/50 border border-white/20 rounded-full text-sm text-gray-300 hover:border-neon-cyan hover:text-white transition-colors cursor-default">
                                        {skill.trim()}
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
