
import { motion } from 'framer-motion';
import { useI18n } from '../i18n/LanguageContext';

const About = () => {
    const { t, cv } = useI18n();
    const profile = cv.professional_profile;

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
                        <span className="text-neon-purple mr-4">{t.about.number}</span>
                        {profile.title}
                        <span className="ml-6 h-px bg-white/20 flex-grow max-w-xs"></span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-12">
                    <motion.div
                        className="md:col-span-2 space-y-6 text-gray-300 leading-loose text-lg"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        {t.about.paragraphs.map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </motion.div>

                    {/* Stats/Highlight Box */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-magenta opacity-20 blur-2xl -z-10 rounded-full"></div>
                        <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-8 rounded-2xl h-full flex flex-col justify-center gap-6">
                            {t.about.stats.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <span className="block text-4xl font-bold text-white mb-2">{stat.value}</span>
                                    <span className={`text-sm uppercase tracking-widest ${['text-neon-cyan', 'text-neon-magenta', 'text-neon-green'][i % 3]}`}>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
