import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { EASE } from '@/hooks/useReveal';
import Typewriter from '@/components/motion/Typewriter';

// Lazily loaded so the three.js bundle is split out of the main chunk.
const HeroBackground = lazy(() => import('@/components/three/HeroBackground'));

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
  const { t, cv, lang } = useI18n();
  const firstName = cv.heading.name.split(' ')[0];
  const shouldReduceMotion = useReducedMotion() ?? false;
  // Mount the 3D background only AFTER the name has finished typing, then wait
  // for an idle slot, so the WebGL warm-up hitch never stutters the keystrokes.
  const [showBackground, setShowBackground] = useState(false);

  // Tell the scene where the copy starts so, in portrait, the reaction fills the
  // free band above it. Re-measured whenever the hero or the copy resizes
  // (rotation, font load, language switch).
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [copyTop, setCopyTop] = useState<number>();
  useEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    if (!section || !copy || typeof ResizeObserver === 'undefined') return;
    // offsetTop ignores the entrance transforms, so the value is stable.
    const measure = () => setCopyTop(copy.offsetTop / section.offsetHeight);
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(copy);
    return () => ro.disconnect();
  }, []);

  // Staggered rise-in for each block of the copy.
  const enter = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    // The layout follows orientation, like the 3D scene does: in portrait the copy
    // is anchored to the bottom (near the thumb) and the reaction owns the top; in
    // landscape the copy sits on the left and the reaction on the right. The
    // portrait top padding guarantees the reaction a band even on short phones,
    // where the hero then grows past one screen instead of hiding it.
    <section
      ref={sectionRef}
      id="home"
      className="min-h-svh w-full flex items-end landscape:items-center relative overflow-hidden pt-[max(7rem,36svh)] pb-8 sm:pb-10 landscape:pt-24"
    >
      {/* Ambient glow where the reaction will appear: gives the hero colour from the
          first paint while three.js is still loading (the canvas is opaque on top). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_26%,rgba(0,243,255,0.12),rgba(188,19,254,0.05)_35%,transparent_60%)] landscape:bg-[radial-gradient(ellipse_at_64%_48%,rgba(0,243,255,0.12),rgba(188,19,254,0.05)_30%,transparent_55%)]"
      />

      {/* Full-bleed animated background (three.js loaded lazily + deferred to idle,
          fading in so its warm-up never stutters the hero intro). */}
      <div
        className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${showBackground ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      >
        {showBackground && (
          <Suspense fallback={null}>
            <HeroBackground copyTop={copyTop} />
          </Suspense>
        )}
      </div>

      {/* Legibility overlay: darkens toward the copy (bottom in portrait, left in landscape) */}
      <div className="absolute inset-0 z-1 pointer-events-none landscape:hidden bg-linear-to-t from-dark-bg via-dark-bg/80 via-45% to-transparent" />
      <div className="absolute inset-0 z-1 pointer-events-none hidden landscape:block bg-linear-to-r from-dark-bg via-dark-bg/70 to-transparent" />
      {/* Soft vertical vignette to seat the text against the scene */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-linear-to-b from-dark-bg/40 via-transparent to-dark-bg/60" />

      {/* Text Content */}
      <div
        ref={copyRef}
        className="relative z-10 w-full landscape:w-3/5 flex flex-col justify-center items-start px-6 sm:px-8 md:landscape:pl-20"
      >
        <div className="w-full max-w-lg lg:max-w-xl">
          <h1 className="mb-5 sm:mb-8 short:mb-3 font-bold tracking-tight">
            {/* The visual lines below are decorative; this is what screen readers get. */}
            <span className="sr-only">{`${t.hero.greeting} ${t.hero.namePrefix} ${firstName}`}</span>
            <motion.span
              {...enter(0)}
              aria-hidden="true"
              className="block text-xl sm:text-3xl md:text-4xl short:text-lg font-medium tracking-normal text-gray-300"
            >
              {t.hero.greeting}
            </motion.span>
            <span className="mt-1 sm:mt-2 block whitespace-nowrap text-5xl sm:text-6xl md:text-7xl 2xl:text-8xl short:text-4xl leading-[1.08]">
              <Typewriter
                key={lang}
                instant={shouldReduceMotion}
                startDelay={550}
                segments={[
                  { text: `${t.hero.namePrefix} ` },
                  {
                    text: firstName,
                    className:
                      'text-transparent bg-clip-text bg-linear-to-r from-neon-cyan via-sky-300 to-neon-purple drop-shadow-[0_0_18px_rgba(0,243,255,0.35)]',
                  },
                ]}
                onDone={() => whenIdle(() => setShowBackground(true))}
              />
            </span>
          </h1>

          <motion.div {...enter(0.25)} className="mb-6 sm:mb-9 short:mb-5">
            {/* backdrop-blur only on desktop: over an animated canvas it re-blurs every
                frame, which is a noticeable cost on phones/tablets for little visual gain. */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/70 lg:bg-black/45 lg:backdrop-blur-md py-4 pl-5 pr-4 sm:py-6 sm:pl-7 sm:pr-6 short:py-4 shadow-[0_24px_60px_-28px_rgba(0,243,255,0.35)]">
              <span
                aria-hidden="true"
                className="absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full bg-linear-to-b from-neon-cyan via-neon-purple to-neon-magenta"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent"
              />
              <div className="text-gray-300 text-sm sm:text-base short:text-sm leading-6 sm:leading-7 short:leading-6 text-pretty space-y-3 sm:space-y-4 short:space-y-2 [&>p:first-child]:font-medium [&>p:first-child]:text-white">
                {t.hero.tagline}
              </div>
            </div>
          </motion.div>

          <motion.div {...enter(0.4)} className="flex flex-wrap gap-3 sm:gap-4">
            <a
              href="#projects"
              className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-neon-cyan px-3 sm:px-7 py-3 text-[0.8125rem] sm:text-base font-semibold tracking-wide text-black shadow-[0_0_24px_-6px_rgba(0,243,255,0.7)] transition-all duration-300 hover:bg-white hover:shadow-[0_0_32px_-4px_rgba(0,243,255,0.9)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan"
            >
              {t.hero.viewProjects}
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="hidden sm:block transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <a
              href="#contact"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-white/15 bg-white/5 px-3 sm:px-7 py-3 text-[0.8125rem] sm:text-base font-semibold tracking-wide text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t.hero.contact}
              <MessageCircle size={18} aria-hidden="true" className="hidden sm:block" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue: only on desktop-sized landscape screens, where the copy is
          vertically centred and the bottom edge is free. */}
      <motion.a
        href="#about"
        aria-label={t.hero.scroll}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-white/45 transition-colors hover:text-neon-cyan lg:landscape:flex"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span aria-hidden="true">{t.hero.scroll}</span>
        <span aria-hidden="true" className="relative h-9 w-5 rounded-full border border-current">
          <span className="absolute left-1/2 top-1.5 -ml-px h-2 w-0.5 rounded-full bg-current motion-safe:animate-scroll-dot" />
        </span>
      </motion.a>
    </section>
  );
};

export default Hero;
