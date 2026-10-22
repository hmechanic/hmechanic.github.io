import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CombustionReaction from './CombustionReaction';

// Isolated so the three.js / r3f bundle can be code-split out of the main chunk
// and loaded lazily after the hero's first paint.
const HeroBackground = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Tune the renderer for the device. The scene is a handful of draw calls with
  // a cheap shader, so phones can afford a crisper pixel ratio than before; they
  // still skip MSAA and ask for the battery-friendly GPU.
  const { small, reducedMotion, dpr, antialias, powerPreference } = useMemo(() => {
    const mq = (query: string) =>
      typeof window !== 'undefined' && !!window.matchMedia?.(query).matches;
    const small = mq('(max-width: 768px)');
    return {
      small,
      reducedMotion: mq('(prefers-reduced-motion: reduce)'),
      dpr: (small ? [1, 1.5] : [1, 1.75]) as [number, number],
      antialias: !small,
      powerPreference: small ? ('low-power' as const) : ('high-performance' as const),
    };
  }, []);

  // Stop the render loop entirely while the hero is scrolled out of view.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Reduced motion renders a single still frame on demand.
  const frameloop = reducedMotion ? 'demand' : visible ? 'always' : 'never';

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <Canvas
        className="w-full h-full"
        frameloop={frameloop}
        dpr={dpr}
        camera={{ position: [0, 0, 14], fov: 45, near: 0.1, far: 60 }}
        gl={{ antialias, powerPreference, alpha: false, stencil: false }}
      >
        <CombustionReaction small={small} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

export default HeroBackground;
