import { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { createCombustionScene } from './combustionScene';

// Thin React shell around the imperative scene: it is created once, mounted as
// a primitive and stepped from useFrame, so React never re-renders while it runs.
const CombustionReaction = ({ small, reducedMotion }: { small: boolean; reducedMotion: boolean }) => {
  const [scene] = useState(() =>
    createCombustionScene({ small, reducedMotion, labels: !small && !reducedMotion }),
  );
  useEffect(() => () => scene.dispose(), [scene]);

  useFrame((state, delta) => {
    // Clamp large gaps (tab switch, frameloop resuming) so nothing teleports.
    scene.update(state, reducedMotion ? 0 : Math.min(delta, 0.05));
  });

  return (
    <>
      <color attach="background" args={[scene.background]} />
      <primitive object={scene.root} />
    </>
  );
};

export default CombustionReaction;
