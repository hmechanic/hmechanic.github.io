import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CombustionReaction from './CombustionReaction';

// Isolated so the three.js / r3f bundle can be code-split out of the main chunk
// and loaded lazily after the hero's first paint.
const HeroBackground = () => (
    <Canvas className="w-full h-full" dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <Suspense fallback={null}>
            <CombustionReaction />
        </Suspense>
    </Canvas>
);

export default HeroBackground;
