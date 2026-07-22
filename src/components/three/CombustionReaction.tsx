/*
 * Performance note: this is an imperative three.js animation. Particle physics
 * fields are mutated in place inside useFrame every frame and pushed to the GPU
 * via object refs — React never reads them for rendering (it only uses id/type
 * and spawn-time transform). setParticles is called ONLY when a reaction changes
 * the molecule list. The React Compiler's immutability rule assumes state is never
 * mutated, which doesn't hold for this deliberate render-loop pattern, so it is
 * disabled for this file.
 */
/* eslint-disable react-hooks/immutability */
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// --- Theme Colors (aligned with tailwind neon palette) ---
const THEME: Record<string, string> = {
  H: '#00f3ff', // Neon Cyan
  C: '#8a8f98', // Light Carbon (readable on dark bg)
  O: '#ff00ff', // Neon Magenta
  N: '#00ff9f', // Neon Green
  Bond: '#5a5f6a',
};

// --- Shared geometry (created once, reused by every atom/bond) ---
const SPHERE_GEO = new THREE.SphereGeometry(1, 16, 16);
const BOND_GEO = new THREE.CylinderGeometry(0.035, 0.035, 1, 10);
const FLASH_GEO = new THREE.SphereGeometry(1, 16, 16);

// --- Shared materials, cached per color ---
const atomMaterials = new Map<string, THREE.MeshStandardMaterial>();
const getAtomMaterial = (color: string) => {
  let mat = atomMaterials.get(color);
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.55,
      roughness: 0.35,
      metalness: 0.4,
    });
    atomMaterials.set(color, mat);
  }
  return mat;
};

const BOND_MATERIAL = new THREE.MeshStandardMaterial({
  color: THEME.Bond,
  emissive: THEME.Bond,
  emissiveIntensity: 0.15,
  roughness: 0.4,
  metalness: 0.5,
  transparent: true,
  opacity: 0.85,
});

// --- Cheap billboarded text labels via a canvas texture atlas ---
const labelMaterials = new Map<string, THREE.SpriteMaterial>();
const getLabelMaterial = (text: string, color: string) => {
  const key = `${text}|${color}`;
  let mat = labelMaterials.get(key);
  if (!mat) {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.font = 'bold 74px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Neon glow, matching the site's text-shadow language
    ctx.shadowColor = color;
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, size / 2, size / 2 + 4);
    ctx.fillText(text, size / 2, size / 2 + 4); // second pass = stronger glow
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    labelMaterials.set(key, mat);
  }
  return mat;
};

// --- Molecule recipes (static local geometry) ---
type MoleculeType = 'CH4' | 'O2' | 'N2' | 'CO2' | 'H2O';
type Vec3 = [number, number, number];

interface AtomDef {
  el: keyof typeof THEME;
  pos: Vec3;
  size: number;
}
interface Recipe {
  atoms: AtomDef[];
  bonds: [Vec3, Vec3][];
}

const HD = 0.4; // tetrahedral H distance for methane
const MOLECULES: Record<MoleculeType, Recipe> = {
  CH4: {
    atoms: [
      { el: 'C', pos: [0, 0, 0], size: 0.28 },
      { el: 'H', pos: [HD, HD, HD], size: 0.18 },
      { el: 'H', pos: [-HD, -HD, HD], size: 0.18 },
      { el: 'H', pos: [-HD, HD, -HD], size: 0.18 },
      { el: 'H', pos: [HD, -HD, -HD], size: 0.18 },
    ],
    bonds: [
      [
        [0, 0, 0],
        [HD, HD, HD],
      ],
      [
        [0, 0, 0],
        [-HD, -HD, HD],
      ],
      [
        [0, 0, 0],
        [-HD, HD, -HD],
      ],
      [
        [0, 0, 0],
        [HD, -HD, -HD],
      ],
    ],
  },
  O2: {
    atoms: [
      { el: 'O', pos: [-0.22, 0, 0], size: 0.22 },
      { el: 'O', pos: [0.22, 0, 0], size: 0.22 },
    ],
    bonds: [
      [
        [-0.22, 0, 0],
        [0.22, 0, 0],
      ],
    ],
  },
  N2: {
    atoms: [
      { el: 'N', pos: [-0.2, 0, 0], size: 0.2 },
      { el: 'N', pos: [0.2, 0, 0], size: 0.2 },
    ],
    bonds: [
      [
        [-0.2, 0, 0],
        [0.2, 0, 0],
      ],
    ],
  },
  CO2: {
    atoms: [
      { el: 'C', pos: [0, 0, 0], size: 0.28 },
      { el: 'O', pos: [-0.55, 0, 0], size: 0.22 },
      { el: 'O', pos: [0.55, 0, 0], size: 0.22 },
    ],
    bonds: [
      [
        [0, 0, 0],
        [-0.55, 0, 0],
      ],
      [
        [0, 0, 0],
        [0.55, 0, 0],
      ],
    ],
  },
  H2O: {
    atoms: [
      { el: 'O', pos: [0, 0, 0], size: 0.24 },
      { el: 'H', pos: [-0.3, -0.25, 0], size: 0.16 },
      { el: 'H', pos: [0.3, -0.25, 0], size: 0.16 },
    ],
    bonds: [
      [
        [0, 0, 0],
        [-0.3, -0.25, 0],
      ],
      [
        [0, 0, 0],
        [0.3, -0.25, 0],
      ],
    ],
  },
};

// Precompute bond transforms (position / quaternion / length) once per recipe.
const _up = new THREE.Vector3(0, 1, 0);
interface BondTransform {
  position: Vec3;
  quaternion: THREE.Quaternion;
  length: number;
}
const bondTransform = (start: Vec3, end: Vec3): BondTransform => {
  const s = new THREE.Vector3(...start);
  const e = new THREE.Vector3(...end);
  const dir = new THREE.Vector3().subVectors(e, s);
  const length = dir.length();
  const position = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(_up, dir.clone().normalize());
  return { position: [position.x, position.y, position.z], quaternion, length };
};

// --- Molecule render component (renders once; parent group is animated via ref) ---
const Molecule = ({
  type,
  groupRef,
  showLabels,
  initialPosition,
  initialScale,
}: {
  type: MoleculeType;
  groupRef: { current: THREE.Group | null };
  showLabels: boolean;
  initialPosition: Vec3;
  initialScale: number;
}) => {
  const recipe = MOLECULES[type];
  const bonds = useMemo(() => recipe.bonds.map(([a, b]) => bondTransform(a, b)), [recipe]);

  return (
    <group ref={groupRef} position={initialPosition} scale={initialScale}>
      {recipe.atoms.map((a, i) => {
        const color = THEME[a.el];
        return (
          <group key={i} position={a.pos}>
            <mesh geometry={SPHERE_GEO} material={getAtomMaterial(color)} scale={a.size} />
            {showLabels && (
              <sprite
                material={getLabelMaterial(a.el, color)}
                position={[0, a.size + 0.12, 0]}
                scale={[0.34, 0.34, 0.34]}
              />
            )}
          </group>
        );
      })}
      {bonds.map((b, i) => (
        <mesh
          key={`b${i}`}
          geometry={BOND_GEO}
          material={BOND_MATERIAL}
          position={b.position}
          quaternion={b.quaternion}
          scale={[1, b.length, 1]}
        />
      ))}
    </group>
  );
};

// --- Particle simulation data (mutable, ref-held — never in React state per frame) ---
type Phase = 'idle' | 'reacting_implode' | 'reacting_explode';
type Ref<T> = { current: T | null };

interface Particle {
  id: number;
  type: MoleculeType;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  scale: number;
  phase: Phase;
  timer: number;
  dead: boolean;
  reactionTarget?: THREE.Vector3;
  groupRef: Ref<THREE.Group>;
}

interface ExplosionSlot {
  age: number; // >= 1 means inactive
  position: THREE.Vector3;
  light: Ref<THREE.PointLight>;
  flash: Ref<THREE.Mesh>;
}

const BOUNDS_X = 6;
const BOUNDS_Y = 3.5;
const BOUNDS_Z = 2;
const REACTION_RADIUS = 1.2;
const IMPLOSION_TIME = 0.8;
const EXPLOSION_POOL = 5;

const rand = (scale: number) => (Math.random() - 0.5) * scale;
const randVec = (scale: number) => new THREE.Vector3(rand(scale), rand(scale), rand(scale));
const randEuler = () =>
  new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

// Particle budget scales down on small/low-power screens: fewer molecules means
// fewer draw calls and a lighter per-frame physics loop on mobile GPUs.
const makeInitialParticles = (small: boolean): Particle[] => {
  const list: Particle[] = [];
  let id = 0;
  const base = (
    type: MoleculeType,
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    spin: number,
  ): Particle => ({
    id: id++,
    type,
    position,
    velocity,
    rotation: randEuler(),
    rotationSpeed: randVec(spin),
    scale: 1,
    phase: 'idle',
    timer: 0,
    dead: false,
    groupRef: { current: null },
  });

  const counts = small ? { ch4: 2, o2: 3, n2: 4 } : { ch4: 4, o2: 6, n2: 8 };
  for (let i = 0; i < counts.ch4; i++)
    list.push(
      base(
        'CH4',
        new THREE.Vector3(-4 + Math.random(), rand(4), rand(2)),
        new THREE.Vector3(0.5, 0, 0).add(randVec(0.2)),
        0.5,
      ),
    );
  for (let i = 0; i < counts.o2; i++)
    list.push(
      base(
        'O2',
        new THREE.Vector3(4 - Math.random(), rand(4), rand(2)),
        new THREE.Vector3(-0.5, 0, 0).add(randVec(0.2)),
        0.5,
      ),
    );
  for (let i = 0; i < counts.n2; i++)
    list.push(base('N2', new THREE.Vector3(rand(8), rand(5), rand(3)), randVec(0.4), 0.2));

  return list;
};

const CombustionScene = ({
  showLabels,
  reducedMotion,
  small,
}: {
  showLabels: boolean;
  reducedMotion: boolean;
  small: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  // Particles live in state so the render list is React-driven, but their physics
  // fields are mutated in-place in useFrame WITHOUT setState. setParticles is only
  // called when the topology changes (a reaction spawns/removes molecules).
  const [particles, setParticles] = useState<Particle[]>(() => makeInitialParticles(small));
  const nextId = useRef(particles.length);
  // Fixed pool; never re-created, only mutated via refs in useFrame.
  const [explosions] = useState<ExplosionSlot[]>(() =>
    Array.from({ length: EXPLOSION_POOL }, () => ({
      age: 1,
      position: new THREE.Vector3(),
      light: { current: null },
      flash: { current: null },
    })),
  );

  const spawnTimer = useRef(0);

  const spawnExplosion = (position: THREE.Vector3) => {
    const slot = explosions.find((e) => e.age >= 1) ?? explosions[0];
    slot.age = 0;
    slot.position.copy(position);
  };

  // Fresh reactant entering from its side of the scene, moving inward.
  const makeReactant = (type: 'CH4' | 'O2'): Particle => {
    const fromLeft = type === 'CH4';
    const x = fromLeft ? -BOUNDS_X + 0.5 : BOUNDS_X - 0.5;
    const vx = fromLeft ? 0.5 : -0.5;
    return {
      id: nextId.current++,
      type,
      position: new THREE.Vector3(x, rand(4), rand(2)),
      velocity: new THREE.Vector3(vx, 0, 0).add(randVec(0.2)),
      rotation: randEuler(),
      rotationSpeed: randVec(0.5),
      scale: 1,
      phase: 'idle',
      timer: 0,
      dead: false,
      groupRef: { current: null },
    };
  };

  useFrame((_, rawDelta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const delta = Math.min(rawDelta, 0.05); // clamp large frame gaps
    const motion = reducedMotion ? 0.25 : 1;

    // --- Explosions (pooled, ref-animated) ---
    for (const e of explosions) {
      const light = e.light.current;
      const flash = e.flash.current;
      if (e.age >= 1) {
        if (light) light.intensity = 0;
        if (flash) flash.scale.setScalar(0.001);
        continue;
      }
      e.age = Math.min(1, e.age + delta);
      const fade = 1 - e.age;
      if (light) {
        light.position.copy(e.position);
        light.intensity = 9 * fade;
      }
      if (flash) {
        flash.position.copy(e.position);
        flash.scale.setScalar(0.2 + e.age * 2.2);
        (flash.material as THREE.MeshBasicMaterial).opacity = fade * 0.6;
      }
    }

    const toAdd: Particle[] = [];
    const reactingNow = new Set<number>();

    for (const p of particles) {
      // --- Movement by phase ---
      if (p.phase === 'idle') {
        p.position.addScaledVector(p.velocity, delta * motion);
        if (Math.abs(p.position.x) > BOUNDS_X) {
          p.velocity.x *= -1;
          p.position.x = Math.sign(p.position.x) * BOUNDS_X;
        }
        if (Math.abs(p.position.y) > BOUNDS_Y) {
          p.velocity.y *= -1;
          p.position.y = Math.sign(p.position.y) * BOUNDS_Y;
        }
        if (Math.abs(p.position.z) > BOUNDS_Z) {
          p.velocity.z *= -1;
          p.position.z = Math.sign(p.position.z) * BOUNDS_Z;
        }
      } else if (p.phase === 'reacting_implode') {
        if (p.reactionTarget) p.position.lerp(p.reactionTarget, delta * 5);
        p.scale = Math.max(0.1, 1 - p.timer / IMPLOSION_TIME);
        p.timer += delta;
        if (p.timer > IMPLOSION_TIME) {
          p.dead = true; // remove reactant below
          // Only the CH4 spawns products + explosion (once per pair)
          if (p.type === 'CH4' && p.reactionTarget) {
            const c = p.reactionTarget;
            spawnExplosion(c);
            const mkProduct = (type: MoleculeType, offset: THREE.Vector3): Particle => ({
              id: nextId.current++,
              type,
              position: c.clone().add(offset),
              velocity: randVec(1.5),
              rotation: new THREE.Euler(),
              rotationSpeed: randVec(0.3),
              scale: 0.1,
              phase: 'reacting_explode',
              timer: 0,
              dead: false,
              groupRef: { current: null },
            });
            toAdd.push(mkProduct('CO2', new THREE.Vector3(0, 0, 0)));
            toAdd.push(mkProduct('H2O', new THREE.Vector3(0.5, 0, 0)));
            toAdd.push(mkProduct('H2O', new THREE.Vector3(-0.5, 0, 0)));
          }
        }
      } else if (p.phase === 'reacting_explode') {
        p.position.addScaledVector(p.velocity, delta * motion);
        p.scale = Math.min(1, p.scale + delta * 2);
        if (p.scale >= 1) p.phase = 'idle';
      }

      // Rotation
      p.rotation.x += p.rotationSpeed.x * delta * motion;
      p.rotation.y += p.rotationSpeed.y * delta * motion;
      p.rotation.z += p.rotationSpeed.z * delta * motion;

      // Apply transform to the mounted group (if present)
      const g = p.groupRef.current;
      if (g) {
        g.position.copy(p.position);
        g.rotation.copy(p.rotation);
        g.scale.setScalar(p.scale);
      }

      // --- Collision -> start reaction (idle CH4 vs idle O2) ---
      if (!reducedMotion && p.phase === 'idle' && p.type === 'CH4' && !reactingNow.has(p.id)) {
        for (const other of particles) {
          if (
            other.id === p.id ||
            other.phase !== 'idle' ||
            other.type !== 'O2' ||
            reactingNow.has(other.id)
          )
            continue;
          if (p.position.distanceTo(other.position) < REACTION_RADIUS) {
            const mid = p.position.clone().lerp(other.position, 0.5);
            p.phase = 'reacting_implode';
            p.reactionTarget = mid;
            p.timer = 0;
            other.phase = 'reacting_implode';
            other.reactionTarget = mid;
            other.timer = 0;
            reactingNow.add(p.id);
            reactingNow.add(other.id);
            break;
          }
        }
      }
    }

    // Keep the reaction alive: replenish spent reactants and cap products so the
    // background loops indefinitely without unbounded particle growth.
    spawnTimer.current += delta;
    if (!reducedMotion && spawnTimer.current > 1.8) {
      spawnTimer.current = 0;
      const alive = particles.filter((p) => !p.dead);
      const count = (t: MoleculeType) =>
        alive.filter((p) => p.type === t).length + toAdd.filter((p) => p.type === t).length;
      if (count('CH4') < (small ? 2 : 3)) toAdd.push(makeReactant('CH4'));
      if (count('O2') < (small ? 2 : 4)) toAdd.push(makeReactant('O2'));

      const MAX_PRODUCTS = small ? 8 : 16;
      const products = alive.filter((p) => p.type === 'CO2' || p.type === 'H2O');
      if (products.length > MAX_PRODUCTS) {
        products.slice(0, products.length - MAX_PRODUCTS).forEach((p) => {
          p.dead = true;
        });
      }
    }

    if (groupRef.current) groupRef.current.rotation.y = Math.sin(Date.now() * 0.00005) * 0.12;

    // Commit topology change (reaction fired) — this is the ONLY per-reaction setState.
    const survivors = particles.filter((p) => !p.dead);
    if (survivors.length !== particles.length || toAdd.length) {
      setParticles([...survivors, ...toAdd]);
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p) => (
        <Molecule
          key={p.id}
          type={p.type}
          showLabels={showLabels}
          groupRef={p.groupRef}
          initialPosition={[p.position.x, p.position.y, p.position.z]}
          initialScale={p.scale}
        />
      ))}

      {/* Pooled explosion flashes + lights */}
      {explosions.map((e, i) => (
        <group key={`ex${i}`}>
          <pointLight ref={e.light} color="#ffaa33" distance={10} decay={2} intensity={0} />
          <mesh ref={e.flash} geometry={FLASH_GEO} scale={0.001}>
            <meshBasicMaterial color="#ffdd88" transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const CombustionReaction = () => {
  // Decide feature level once (labels off on small screens / reduced motion).
  const { showLabels, reducedMotion, small } = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia)
      return { showLabels: true, reducedMotion: false, small: false };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.matchMedia('(max-width: 768px)').matches;
    return { showLabels: !reduced && !isSmall, reducedMotion: reduced, small: isSmall };
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={45} />
      <color attach="background" args={['#050505']} />

      {/* Two directional key/fill lights instead of point+spot: cheaper shader
                variants (no per-fragment attenuation, no shadow-cone math) and no
                perceptible change to the flat, emissive-driven look. */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} color="#4444ff" />
      <directionalLight position={[-10, -10, -10]} intensity={1.2} color="#ff44ff" />

      <CombustionScene showLabels={showLabels} reducedMotion={reducedMotion} small={small} />

      <Sparkles
        count={small ? 12 : 30}
        scale={20}
        size={1}
        opacity={0.18}
        speed={reducedMotion ? 0 : 0.2}
        color="#ffffff"
      />
      <fog attach="fog" args={['#050505', 12, 35]} />
    </>
  );
};

export default CombustionReaction;
