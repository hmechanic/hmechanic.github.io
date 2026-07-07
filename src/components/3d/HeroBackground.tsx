import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import CombustionReaction from './CombustionReaction';

// Isolated so the three.js / r3f bundle can be code-split out of the main chunk
// and loaded lazily after the hero's first paint.
const HeroBackground = () => {
    // Tune the renderer for the device: on phones we cap the pixel ratio at 1,
    // drop antialiasing, and ask for the default (battery-friendly) GPU. This
    // roughly halves fragment work and avoids draining battery on mobile, where
    // the scene is a subtle background rather than a focal point.
    const { dpr, antialias, powerPreference } = useMemo(() => {
        const small =
            typeof window !== 'undefined' &&
            window.matchMedia?.('(max-width: 768px)').matches;
        return small
            ? { dpr: [1, 1] as [number, number], antialias: false, powerPreference: 'low-power' as const }
            : { dpr: [1, 1.5] as [number, number], antialias: true, powerPreference: 'high-performance' as const };
    }, []);

    return (
        <Canvas className="w-full h-full" dpr={dpr} gl={{ antialias, powerPreference }}>
            <Suspense fallback={null}>
                <CombustionReaction />
            </Suspense>
        </Canvas>
    );
};

export default HeroBackground;
