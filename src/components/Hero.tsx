import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n/LanguageContext';

// Lazily loaded so the three.js bundle is split out of the main chunk.
const HeroBackground = lazy(() => import('./3d/HeroBackground'));

// Schedule heavy work (three.js parse + shader compile + texture upload) for a
// moment when the browser is idle. The synchronous WebGL warm-up is unavoidable,
// so the goal is to place it where nothing else is animating.
const whenIdle = (cb: () => void) => {
    const w = window as typeof window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 600 });
    else window.setTimeout(cb, 200);
};

const Hero = () => {
    const { t, cv } = useI18n();
    const { name } = cv.heading;
    // Mount the 3D background only AFTER the intro text animation has fully settled,
    // then wait for an idle slot. This keeps the WebGL warm-up hitch strictly out of
    // the text animation's tail, where it was being perceived as a stutter.
    const [showBackground, setShowBackground] = useState(false);

    return (
        <section id="home" className="min-h-[100svh] w-full flex items-center relative overflow-hidden pt-24 pb-12 md:pt-20 md:pb-0">
            {/* Full-bleed animated background (three.js loaded lazily + deferred to idle,
                fading in so its warm-up never stutters the hero intro). */}
            <div
                className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 ${showBackground ? 'opacity-100' : 'opacity-0'}`}
                aria-hidden="true"
            >
                {showBackground && (
                    <Suspense fallback={null}>
                        <HeroBackground />
                    </Suspense>
                )}
            </div>

            {/* Legibility overlay: darkens toward the left where the copy sits */}
            <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-dark-bg via-dark-bg/70 to-transparent" />
            {/* Soft vertical vignette to seat the text against the scene */}
            <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-dark-bg/40 via-transparent to-dark-bg/60" />

            {/* Text Content */}
            <div className="relative z-10 w-full md:w-3/5 flex flex-col justify-center items-start px-6 sm:px-8 md:pl-20">
                <motion.div
                    className="w-full max-w-lg"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    onAnimationComplete={() => whenIdle(() => setShowBackground(true))}
                >
                    <h2 className="text-neon-magenta font-mono text-sm sm:text-lg mb-3 sm:mb-4 tracking-widest">
                        {t.hero.badge}
                    </h2>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                        {t.hero.greeting} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple filter drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                            {name.split(' ')[0]}
                        </span>
                    </h1>
                    <div className="relative mb-6 sm:mb-8 w-full group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-20 blur transition duration-1000 group-hover:opacity-40"></div>
                        <div className="relative bg-black/40 backdrop-blur-sm border-l-4 border-neon-cyan p-4 sm:p-6 rounded-r-xl">
                            <p className="text-gray-300 text-sm sm:text-lg leading-relaxed">
                                {t.hero.tagline}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 sm:gap-4">
                        <a href="#projects" className="flex-1 sm:flex-none text-center whitespace-nowrap px-4 sm:px-8 py-3 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all font-bold text-sm sm:text-base tracking-wide sm:tracking-wider rounded">
                            {t.hero.viewProjects}
                        </a>
                        <a href="#contact" className="flex-1 sm:flex-none text-center whitespace-nowrap px-4 sm:px-8 py-3 border border-white/20 text-white hover:border-white transition-all font-bold text-sm sm:text-base tracking-wide sm:tracking-wider rounded">
                            {t.hero.contact}
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
