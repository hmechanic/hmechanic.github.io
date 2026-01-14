
import { motion } from 'framer-motion';
import { ExternalLink, Folder } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const Projects = () => {
    // Hardcoded based on user prompt and typical portfolio needs
    const projects = [
        {
            title: "SatEmis Platform",
            description: "Plataforma de procesamiento de datos satelitales. Arquitectura de microservicios con NestJS y Docker, optimizada para Google Cloud Platform.",
            tech: ["NestJS", "Docker", "GCP", "Python"],
            github: "https://github.com/satemis/b-satemi", // Inferred from prompt
            external: "#",
            featured: true
        },
        {
            title: "Frontend SatEmis",
            description: "Interfaz de usuario para la visualización e interpretación de datos satelitales y gestión de la plataforma.",
            tech: ["React", "TypeScript", "Vite"],
            github: "https://github.com/satemis/f-satemis",
            external: "#",
            featured: true
        },
        {
            title: "Deep Learning Concepts",
            description: "Implementación de modelos de Deep Learning y redes neuronales desde cero o utilizando frameworks modernos.",
            tech: ["Python", "PyTorch", "TensorFlow"],
            github: "https://github.com/deep-leaning.ai",
            external: "#",
            featured: false
        }
    ];

    return (
        <section id="projects" className="py-20 px-6 bg-dark-bg">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-4xl font-bold mb-16 flex items-center justify-end"
                >
                    <span className="mr-6 h-px bg-white/20 flex-grow max-w-xs"></span>
                    Proyectos Destacados
                    <span className="text-neon-green ml-4">03.</span>
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-dark-surface border border-white/5 rounded-xl p-8 hover:-translate-y-2 hover:border-neon-green/50 transition-all duration-300 group"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <Folder size={40} className="text-neon-cyan" />
                                <div className="flex gap-4">
                                    {project.github && (
                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                            <FaGithub size={20} />
                                        </a>
                                    )}
                                    {project.external && project.external !== '#' && (
                                        <a href={project.external} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                            <ExternalLink size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-green transition-colors">{project.title}</h3>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-3 mt-auto">
                                {project.tech.map(t => (
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
