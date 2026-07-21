import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useLocation } from 'react-router';
import { useI18n } from '../i18n/LanguageContext';

/**
 * Fixed lateral pagination for the single-page home: a vertical rail that
 * "fills" with the scroll progress, plus a dot per section that lights up as
 * that section enters the viewport (scroll-spy) and scrolls to it on click.
 * Desktop-only and fully keyboard-accessible; hidden on the /cv route.
 */
const SectionProgress = () => {
    const { t } = useI18n();
    const items = t.progress.items;
    const shouldReduceMotion = useReducedMotion();
    const { pathname } = useLocation();
    const [active, setActive] = useState(items[0]?.id ?? 'home');

    // Rail fill tied to overall page scroll, smoothed with a spring.
    const { scrollYProgress } = useScroll();
    const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.35 });

    // Scroll-spy: mark the section closest to the viewport centre as active.
    useEffect(() => {
        const observed = items
            .map(item => document.getElementById(item.id))
            .filter((el): el is HTMLElement => el !== null);
        if (observed.length === 0) return;

        const observer = new IntersectionObserver(
            entries => {
                const visible = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]) setActive(visible[0].target.id);
            },
            { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5, 1] },
        );

        observed.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [items, pathname]);

    // Only relevant on the single-page home.
    if (pathname.replace(/\/$/, '') === '/cv') return null;

    const goTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: shouldReduceMotion ? 'auto' : 'smooth',
            block: 'start',
        });
    };

    return (
        <motion.nav
            aria-label={t.progress.label}
            className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:right-8"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="relative flex flex-col items-center gap-6 py-1">
                {/* Static track */}
                <span aria-hidden="true" className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
                {/* Progress fill drawn as you scroll */}
                <motion.span
                    aria-hidden="true"
                    className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 origin-top bg-gradient-to-b from-neon-cyan via-neon-magenta to-neon-purple"
                    style={{ scaleY: fill }}
                />

                {items.map(item => {
                    const isActive = active === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => goTo(item.id)}
                            aria-current={isActive ? 'true' : undefined}
                            aria-label={item.label}
                            className="group relative z-10 flex items-center outline-none"
                        >
                            {/* Label reveals to the left on hover / focus */}
                            <span
                                className={`pointer-events-none absolute right-7 whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.16em] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${isActive ? 'translate-x-0 text-neon-cyan opacity-100' : 'translate-x-1 text-white/60 opacity-0'}`}
                            >
                                {item.label}
                            </span>

                            {/* Dot */}
                            <span
                                className={`rounded-full transition-all duration-300 ${isActive ? 'h-2.5 w-2.5 bg-neon-cyan shadow-[0_0_10px_#00f3ff]' : 'h-1.5 w-1.5 bg-white/30 group-hover:bg-white/70'}`}
                            />
                        </button>
                    );
                })}
            </div>
        </motion.nav>
    );
};

export default SectionProgress;
