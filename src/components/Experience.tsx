import { motion } from 'framer-motion';
import { cvData } from '../utils/loadCv';
import { Job } from '../types';

const Experience = () => {
    // Find the experience section from the sections array
    const expData = (cvData.sections.find(s => s.type === 'experience')?.content.find(c => c.name === "Experiencia Profesional")?.entity || []) as Job[];

    return (
        <section id="experience" className="py-20 px-6 bg-dark-surface relative">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-4xl font-bold mb-16 flex items-center"
                >
                    <span className="text-neon-cyan mr-4">02.</span>
                    Experiencia
                    <span className="ml-6 h-px bg-white/20 flex-grow max-w-xs"></span>
                </motion.h2>

                <div className="relative border-l border-white/20 ml-4 md:ml-6 space-y-12">
                    {expData.map((job, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-8 md:pl-12"
                        >
                            {/* Dot on timeline */}
                            <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-neon-magenta shadow-[0_0_10px_#ff00ff]"></span>

                            <div className="bg-white/5 border border-white/10 p-6 rounded-lg hover:border-neon-cyan/50 transition-colors group">
                                <h3 className="text-2xl font-bold text-white group-hover:text-neon-cyan">{job.position}</h3>
                                <div className="flex flex-col md:flex-row md:justify-between text-neon-purple font-mono text-sm my-2">
                                    <span>{job.organization}</span>
                                    <span>{job.dates}</span>
                                </div>
                                <ul className="mt-4 space-y-2">
                                    {job.responsibilities.map((resp, i) => (
                                        <li key={i} className="text-gray-400 text-sm flex items-start">
                                            <span className="text-neon-cyan mr-2">▹</span>
                                            {resp}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
