import { motion, useReducedMotion } from 'framer-motion';
import { useI18n } from '../i18n/LanguageContext';

const statAccents = ['text-neon-cyan', 'text-neon-magenta', 'text-neon-green'];
const statBars = [
    'from-neon-cyan/70 to-neon-cyan/0',
    'from-neon-magenta/70 to-neon-magenta/0',
    'from-neon-green/70 to-neon-green/0',
];

const About = () => {
    const { t, cv } = useI18n();
    const profile = cv.professional_profile;
    const shouldReduceMotion = useReducedMotion();
    const reveal = shouldReduceMotion ? {} : { opacity: 0, y: 20 };
    const revealFromSide = shouldReduceMotion ? {} : { opacity: 0, y: 16 };

    return (
        <section id="about" className="relative overflow-hidden bg-dark-bg px-6 py-20 sm:py-28">
            {/* Ambient blooms */}
            <div aria-hidden="true" className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 translate-x-1/2 rounded-full bg-neon-cyan/[0.04] blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute left-0 bottom-0 h-80 w-80 -translate-x-1/3 rounded-full bg-neon-purple/[0.035] blur-3xl" />
            {/* Faint blueprint grid — a subtle engineering motif */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.6]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
                    backgroundSize: '72px 72px',
                    maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 0%, transparent 75%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 0%, transparent 75%)',
                }}
            />

            <div className="relative mx-auto max-w-6xl">
                <motion.div
                    initial={reveal}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                >
                    <h2 className="flex items-center text-3xl font-bold sm:text-4xl">
                        <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{profile.title}</span>
                        <span aria-hidden="true" className="ml-6 hidden h-1.5 w-1.5 shrink-0 rotate-45 bg-neon-cyan/80 [box-shadow:0_0_10px_rgba(0,243,255,0.7)] sm:block" />
                        <span aria-hidden="true" className="ml-3 h-px max-w-xs flex-grow bg-gradient-to-r from-neon-cyan/40 via-white/15 to-transparent" />
                    </h2>
                </motion.div>

                <motion.div
                    className="relative z-10 mt-12"
                    initial={revealFromSide}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: 0.45 }}
                >
                    <p className="max-w-4xl text-balance text-xl leading-relaxed text-slate-200 sm:text-2xl">
                        {t.about.intro}
                    </p>

                    <div className="mt-9 h-px w-full bg-gradient-to-r from-white/20 via-white/10 to-transparent" />

                    <div className="mt-9 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
                        <div className="relative order-2 text-[1.02rem] leading-8 text-slate-300 md:columns-2 md:gap-10 md:[column-rule:1px_solid_rgba(255,255,255,0.08)] lg:order-1">
                            {/* Slim accent rail marking the body copy */}
                            <span aria-hidden="true" className="absolute -left-5 top-1 hidden h-14 w-px bg-gradient-to-b from-neon-cyan/60 to-transparent lg:block" />
                            <p className="mb-7 break-inside-avoid text-left first-letter:float-left first-letter:mr-2 first-letter:mt-2 first-letter:bg-gradient-to-br first-letter:from-neon-cyan first-letter:to-neon-purple first-letter:bg-clip-text first-letter:text-5xl first-letter:font-semibold first-letter:leading-9 first-letter:text-transparent">
                                {t.about.areas.map((area, index) => (
                                    <span key={area.number}>{index > 0 && ' '}{area.content}</span>
                                ))}
                            </p>

                            {t.about.details.map(detail => (
                                <p key={detail.title} className="mb-7 break-inside-avoid text-left">
                                    {detail.content}
                                </p>
                            ))}
                        </div>

                        <aside className="order-1 mx-auto w-full max-w-xs lg:order-2 lg:sticky lg:top-28 lg:mx-0">
                            <figure className="group">
                                <div className="relative aspect-[4/5] overflow-hidden border border-white/15 bg-gradient-to-br from-white/[0.035] to-white/[0.01] transition-colors duration-500 group-hover:border-white/25">
                                    <img
                                        src="/I.JPG"
                                        alt={t.about.photo.label}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full scale-[1.45] object-cover object-[65%_68%] transition-transform duration-700 group-hover:scale-150"
                                    />
                                    {/* Registration corner marks */}
                                    <span aria-hidden="true" className="absolute left-0 top-0 z-10 h-8 w-px bg-neon-cyan/70 transition-all duration-500 group-hover:h-10" />
                                    <span aria-hidden="true" className="absolute left-0 top-0 z-10 h-px w-8 bg-neon-cyan/70 transition-all duration-500 group-hover:w-10" />
                                    <span aria-hidden="true" className="absolute bottom-0 right-0 z-10 h-8 w-px bg-neon-purple/70 transition-all duration-500 group-hover:h-10" />
                                    <span aria-hidden="true" className="absolute bottom-0 right-0 z-10 h-px w-8 bg-neon-purple/70 transition-all duration-500 group-hover:w-10" />
                                    {/* Subtle diagonal sheen */}
                                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/[0.05]" />
                                </div>
                            </figure>

                            <dl className="mt-7 border-t border-white/15">
                                {t.about.stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        className="group relative flex items-baseline justify-between gap-4 border-b border-white/10 py-4 lg:block"
                                        initial={reveal}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: shouldReduceMotion ? 0 : 0.15 + index * 0.08, duration: 0.4 }}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`absolute -left-3 top-4 hidden h-6 w-px bg-gradient-to-b ${statBars[index % 3]} opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block`}
                                        />
                                        <dd className="text-2xl font-semibold tabular-nums tracking-tight text-white transition-colors duration-300 group-hover:text-white">
                                            {stat.value}
                                        </dd>
                                        <dt className={`text-right text-[0.62rem] font-medium uppercase tracking-[0.15em] lg:mt-1 lg:text-left ${statAccents[index % 3]}`}>
                                            {stat.label}
                                        </dt>
                                    </motion.div>
                                ))}
                            </dl>
                        </aside>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
