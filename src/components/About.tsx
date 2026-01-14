
import { motion } from 'framer-motion';
import { cvData } from '../utils/loadCv';

const About = () => {
    const profile = cvData.professional_profile;

    return (
        <section id="about" className="py-20 px-6 relative bg-dark-bg">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold mb-12 flex items-center">
                        <span className="text-neon-purple mr-4">01.</span>
                        {profile.title}
                        <span className="ml-6 h-px bg-white/20 flex-grow max-w-xs"></span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 text-gray-300 leading-loose text-lg text-justify whitespace-pre-line">
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="space-y-6 text-gray-300">
                                <p>
                                    Soy <span className="text-white font-bold">Ingeniero Mecánico</span> y <span className="text-white font-bold">desarrollador de software</span> con más de tres años de experiencia impulsando la <span className="text-neon-cyan">transición energética</span> mediante ciencia de datos y tecnología moderna.
                                </p>
                                <p>
                                    Mi enfoque único combina el <span className="text-neon-purple">modelado matemático</span> de sistemas energéticos con arquitecturas de software robustas (<span className="text-neon-green font-mono">Python</span>, <span className="text-neon-green font-mono">SQL</span>, <span className="text-neon-green font-mono">Microservicios</span>) para resolver desafíos de descarbonización.
                                </p>
                                <p>
                                    He liderado hitos clave, como la construcción del <span className="text-white font-semibold">modelo energético nacional de Colombia</span> bajo el marco TIMES y el despliegue de infraestructuras en la nube para el procesamiento de datos satelitales y emisiones. Apasionado por la innovación, integro <span className="text-neon-magenta font-bold">Inteligencia Artificial</span> y <span className="text-neon-magenta font-bold">Big Data</span> para diseñar sistemas de Monitoreo, Reporte y Verificación (MRV) que transforman datos complejos en decisiones estratégicas.
                                </p>
                            </div>
                        </motion.p>
                    </div>

                    {/* Stats/Highlight Box */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-magenta opacity-20 blur-2xl -z-10 rounded-full"></div>
                        <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-8 rounded-2xl h-full flex flex-col justify-center gap-6">
                            <div className="text-center">
                                <span className="block text-4xl font-bold text-white mb-2">3+</span>
                                <span className="text-sm text-neon-cyan uppercase tracking-widest">Años de experiencia</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-4xl font-bold text-white mb-2">10+</span>
                                <span className="text-sm text-neon-magenta uppercase tracking-widest">Proyectos de IA</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-4xl font-bold text-white mb-2">100%</span>
                                <span className="text-sm text-neon-green uppercase tracking-widest">Compromiso</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
