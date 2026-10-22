/*
 * Methane combustion in air, CH4 + 2 O2 -> CO2 + 2 H2O (with inert N2 drifting
 * around), rendered as the hero background.
 *
 * Performance design:
 * - The whole scene is 3-4 draw calls: one InstancedMesh for every atom, one for
 *   every bond, one THREE.Points for all glows (halos, flashes, shock rings,
 *   sparks, dust) and, on desktop, one THREE.Points for the formula labels.
 * - Every molecule, spark and flash lives in a fixed pool allocated up front.
 *   Nothing is created, destroyed or handed to React while it runs, and the
 *   frame loop does not allocate.
 * - No real lights: atoms use a cheap key-light + rim shader and the combustion
 *   glow is additive sprites, so fragment cost does not grow with explosions.
 *
 * It is plain three.js on purpose: CombustionReaction mounts `root` and calls
 * `update()` from useFrame, so React never re-renders during the animation.
 */
import * as THREE from 'three';
import {
  GLOW_FRAGMENT,
  GLOW_VERTEX,
  LABEL_FRAGMENT,
  LABEL_VERTEX,
  MOLECULE_FRAGMENT,
  MOLECULE_VERTEX,
} from './combustionShaders';

// --- Palette (aligned with the tailwind neon theme) ---
const BACKGROUND = '#050505';
const ELEMENT_COLOR = {
  H: '#00f3ff', // neon cyan
  C: '#9aa0aa', // light carbon, readable on the dark background
  O: '#ff00ff', // neon magenta
  N: '#00ff9f', // neon green
} as const;
const BOND_COLOR = '#4d525e';
const HOT = new THREE.Color('#ff8a2a');
const WHITE_HOT = new THREE.Color('#fff1c4');
const SPARK_END = new THREE.Color('#ff2d6f');
const FLASH_COLOR = new THREE.Color('#ffc46b');
const RING_COLOR = new THREE.Color('#ff9d4d');
const DUST_COLOR = new THREE.Color('#9fefff');

// --- Molecule recipes (local geometry; bonds reference atom indices) ---
type Element = keyof typeof ELEMENT_COLOR;
export type MoleculeType = 'CH4' | 'O2' | 'N2' | 'CO2' | 'H2O';
type Vec3 = [number, number, number];

interface Recipe {
  atoms: { el: Element; pos: Vec3; size: number }[];
  bonds: [number, number][];
  halo: string; // glow tint around the whole molecule
  label: string;
}

const HD = 0.4; // tetrahedral H offset for methane
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
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
    halo: '#00c8ff',
    label: 'CH₄',
  },
  O2: {
    atoms: [
      { el: 'O', pos: [-0.22, 0, 0], size: 0.22 },
      { el: 'O', pos: [0.22, 0, 0], size: 0.22 },
    ],
    bonds: [[0, 1]],
    halo: '#ff00ff',
    label: 'O₂',
  },
  N2: {
    atoms: [
      { el: 'N', pos: [-0.2, 0, 0], size: 0.2 },
      { el: 'N', pos: [0.2, 0, 0], size: 0.2 },
    ],
    bonds: [[0, 1]],
    halo: '#00ff9f',
    label: 'N₂',
  },
  CO2: {
    atoms: [
      { el: 'C', pos: [0, 0, 0], size: 0.28 },
      { el: 'O', pos: [-0.55, 0, 0], size: 0.22 },
      { el: 'O', pos: [0.55, 0, 0], size: 0.22 },
    ],
    bonds: [
      [0, 1],
      [0, 2],
    ],
    halo: '#bc13fe',
    label: 'CO₂',
  },
  H2O: {
    atoms: [
      { el: 'O', pos: [0, 0.08, 0], size: 0.24 },
      { el: 'H', pos: [-0.31, -0.2, 0], size: 0.16 },
      { el: 'H', pos: [0.31, -0.2, 0], size: 0.16 },
    ],
    bonds: [
      [0, 1],
      [0, 2],
    ],
    halo: '#00f3ff',
    label: 'H₂O',
  },
};
const TYPES = Object.keys(MOLECULES) as MoleculeType[];
const MAX_ATOMS = 5;
const MAX_BONDS = 4;

// Precomputed, render-ready recipe data (vectors/colours instead of tuples).
const _up = new THREE.Vector3(0, 1, 0);
const COMPILED = Object.fromEntries(
  TYPES.map((type, glyph) => {
    const r = MOLECULES[type];
    const atoms = r.atoms.map((a) => ({
      pos: new THREE.Vector3(...a.pos),
      size: a.size,
      color: new THREE.Color(ELEMENT_COLOR[a.el]),
    }));
    const bonds = r.bonds.map(([i, j]) => {
      const s = atoms[i].pos;
      const e = atoms[j].pos;
      const dir = new THREE.Vector3().subVectors(e, s);
      return {
        mid: new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5),
        quat: new THREE.Quaternion().setFromUnitVectors(_up, dir.clone().normalize()),
        length: dir.length(),
      };
    });
    return [type, { atoms, bonds, halo: new THREE.Color(r.halo), glyph }];
  }),
) as Record<
  MoleculeType,
  {
    atoms: { pos: THREE.Vector3; size: number; color: THREE.Color }[];
    bonds: { mid: THREE.Vector3; quat: THREE.Quaternion; length: number }[];
    halo: THREE.Color;
    glyph: number;
  }
>;

// --- Tuning ---
const FOG_NEAR = 13;
const FOG_FAR = 24;
const SEEK_RADIUS = 3.4; // CH4 starts pulling in an O2 within this distance...
const SEEK_GROWTH = 1.2; // ...and widens its search every second it finds none
const CONTACT_RADIUS = 0.9; // visible overlap: an O2 this close is captured
const IGNITE_RADIUS = 0.95; // both O2 this close to the CH4 -> ignition
const DOCK_DISTANCE = 0.6; // where an incoming O2 settles next to its CH4
const SEEK_TIMEOUT = 2.5; // burn with a single docked O2 if the second is this late
const PREHEAT = 0.22; // warm tint while a CH4 and its O2 are docked, before ignition
const BURN_TIME = 0.55; // reactants collapse + heat up before the flash
const FLASH_TIME = 0.5;
const RING_TIME = 1.1;
const HEAT_DECAY = 2.4; // seconds for products to cool (e-folding)

// --- Small helpers (no allocation) ---
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeOutCubic = (x: number) => 1 - (1 - x) ** 3;
const easeOutBack = (x: number) => {
  const c = 1.9;
  return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2;
};
const randomUnit = (out: THREE.Vector3) => {
  const z = rand(-1, 1);
  const a = rand(0, Math.PI * 2);
  const r = Math.sqrt(1 - z * z);
  return out.set(r * Math.cos(a), r * Math.sin(a), z);
};

type State = 'drift' | 'seek' | 'burn';

interface Molecule {
  active: boolean;
  type: MoleculeType;
  state: State;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  quat: THREE.Quaternion;
  spinAxis: THREE.Vector3;
  spinSpeed: number;
  seed: number;
  age: number; // negative = appears after a delay
  life: number; // products cool down, then fade out once age > life
  heat: number; // 0 = native colours, 1 = glowing orange-white
  claimedBy: number; // O2: index of the CH4 pulling it in
  partners: [number, number]; // CH4: claimed O2 indices
  seekTime: number; // CH4: searching (< 0 = warm-up after spawn) or waiting for partners
  burnT: number;
  burnCenter: THREE.Vector3;
  scale: number; // derived each frame
}

interface Spark {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  age: number;
  life: number; // age >= life -> inactive
  size: number;
}

interface Flash {
  pos: THREE.Vector3;
  age: number;
  scale: number;
}

interface Zone {
  cx: number;
  cy: number;
  hw: number;
  hh: number;
}

export interface CombustionOptions {
  small: boolean;
  labels: boolean;
  reducedMotion: boolean;
}

// The bit of r3f's per-frame state this scene needs.
export interface FrameState {
  camera: THREE.Camera;
  pointer: THREE.Vector2;
  size: { width: number; height: number };
  viewport: { width: number; height: number; dpr: number };
  clock: THREE.Clock;
}

const makeLabelAtlas = () => {
  const cell = 128;
  const canvas = document.createElement('canvas');
  canvas.width = cell * TYPES.length;
  canvas.height = cell;
  const ctx = canvas.getContext('2d')!;
  ctx.font = '600 40px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  TYPES.forEach((type, i) => {
    ctx.shadowColor = MOLECULES[type].halo;
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(235, 250, 255, 0.95)';
    ctx.fillText(MOLECULES[type].label, cell * i + cell / 2, cell / 2);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

const fogUniforms = () => ({
  uFogColor: { value: new THREE.Color(BACKGROUND) },
  uFogNear: { value: FOG_NEAR },
  uFogFar: { value: FOG_FAR },
});

const pointsAttribute = (count: number, itemSize: number) => {
  const attr = new THREE.BufferAttribute(new Float32Array(count * itemSize), itemSize);
  attr.setUsage(THREE.DynamicDrawUsage);
  return attr;
};

export const createCombustionScene = ({ small, labels, reducedMotion }: CombustionOptions) => {
  // Budgets: phones get fewer molecules and sparks (fewer instances, lighter loop).
  const POOL = small ? 18 : 30;
  const TARGET = small ? { CH4: 2, O2: 4, N2: 4 } : { CH4: 3, O2: 7, N2: 7 };
  const SPARKS_PER_FLASH = small ? 10 : 18;
  const SPARK_POOL = SPARKS_PER_FLASH * (small ? 4 : 6);
  const FLASH_POOL = small ? 4 : 6;
  const DUST = small ? 16 : 40;
  const GLOW_CAPACITY = POOL + SPARK_POOL + FLASH_POOL * 2 + DUST;

  // --- GPU objects ---
  const root = new THREE.Group();

  const moleculeMaterial = new THREE.ShaderMaterial({
    vertexShader: MOLECULE_VERTEX,
    fragmentShader: MOLECULE_FRAGMENT,
    uniforms: fogUniforms(),
  });
  const sphere = new THREE.SphereGeometry(1, small ? 14 : 20, small ? 10 : 14);
  const cylinder = new THREE.CylinderGeometry(0.04, 0.04, 1, 8, 1, true);
  const atoms = new THREE.InstancedMesh(sphere, moleculeMaterial, POOL * MAX_ATOMS);
  const bonds = new THREE.InstancedMesh(cylinder, moleculeMaterial, POOL * MAX_BONDS);
  for (const mesh of [atoms, bonds]) {
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // Allocate instanceColor before the first compile so the shader gets USE_INSTANCING_COLOR.
    for (let i = 0; i < mesh.count; i++) mesh.setColorAt(i, HOT);
    mesh.instanceColor!.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false; // instances move every frame; the cached bounds would be stale
    mesh.count = 0;
    root.add(mesh);
  }

  const glowGeometry = new THREE.BufferGeometry();
  glowGeometry.setAttribute('position', pointsAttribute(GLOW_CAPACITY, 3));
  glowGeometry.setAttribute('aColor', pointsAttribute(GLOW_CAPACITY, 3));
  glowGeometry.setAttribute('aSize', pointsAttribute(GLOW_CAPACITY, 1));
  glowGeometry.setAttribute('aAlpha', pointsAttribute(GLOW_CAPACITY, 1));
  glowGeometry.setAttribute('aKind', pointsAttribute(GLOW_CAPACITY, 1));
  const glowMaterial = new THREE.ShaderMaterial({
    vertexShader: GLOW_VERTEX,
    fragmentShader: GLOW_FRAGMENT,
    uniforms: { uScale: { value: 1 }, ...fogUniforms() },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Points(glowGeometry, glowMaterial);
  glow.frustumCulled = false;
  glow.renderOrder = 1;
  root.add(glow);

  let labelAtlas: THREE.CanvasTexture | null = null;
  let labelGeometry: THREE.BufferGeometry | null = null;
  let labelMaterial: THREE.ShaderMaterial | null = null;
  if (labels) {
    labelAtlas = makeLabelAtlas();
    labelGeometry = new THREE.BufferGeometry();
    labelGeometry.setAttribute('position', pointsAttribute(POOL, 3));
    labelGeometry.setAttribute('aGlyph', pointsAttribute(POOL, 1));
    labelGeometry.setAttribute('aAlpha', pointsAttribute(POOL, 1));
    labelGeometry.setAttribute('aSize', pointsAttribute(POOL, 1));
    labelMaterial = new THREE.ShaderMaterial({
      vertexShader: LABEL_VERTEX,
      fragmentShader: LABEL_FRAGMENT,
      uniforms: {
        uScale: { value: 1 },
        uAtlas: { value: labelAtlas },
        uCells: { value: TYPES.length },
        ...fogUniforms(),
      },
      transparent: true,
      depthWrite: false,
    });
    const labelPoints = new THREE.Points(labelGeometry, labelMaterial);
    labelPoints.frustumCulled = false;
    labelPoints.renderOrder = 2;
    root.add(labelPoints);
  }

  // --- Simulation pools ---
  const molecules: Molecule[] = Array.from({ length: POOL }, () => ({
    active: false,
    type: 'N2',
    state: 'drift',
    pos: new THREE.Vector3(),
    vel: new THREE.Vector3(),
    quat: new THREE.Quaternion(),
    spinAxis: new THREE.Vector3(0, 1, 0),
    spinSpeed: 0,
    seed: 0,
    age: 0,
    life: Infinity,
    heat: 0,
    claimedBy: -1,
    partners: [-1, -1],
    seekTime: 0,
    burnT: 0,
    burnCenter: new THREE.Vector3(),
    scale: 0,
  }));
  const sparks: Spark[] = Array.from({ length: SPARK_POOL }, () => ({
    pos: new THREE.Vector3(),
    vel: new THREE.Vector3(),
    age: 0,
    life: 0,
    size: 0,
  }));
  const flashes: Flash[] = Array.from({ length: FLASH_POOL }, () => ({
    pos: new THREE.Vector3(),
    age: RING_TIME,
    scale: 1,
  }));
  // Dust lives in viewport-normalised coordinates so it always fills the screen.
  const dust = Array.from({ length: DUST }, () => ({
    x: rand(-0.55, 0.55),
    y: rand(-0.55, 0.55),
    z: rand(-5, 3),
    speed: rand(0.004, 0.012),
    phase: rand(0, Math.PI * 2),
    size: rand(0.03, 0.07),
  }));
  let sparkCursor = 0;
  let flashCursor = 0;

  // Where the action happens. Recomputed from the viewport every frame so
  // resizes / rotations re-frame the scene smoothly.
  const zone: Zone = { cx: 0, cy: 0, hw: 1, hh: 1 };
  let molScale = 1;
  let initialised = false;
  let populationTimer = 0;

  const updateZone = (vw: number, vh: number) => {
    if (vw >= vh) {
      // Landscape: the copy sits on the left, so the reaction is weighted right.
      zone.cx = vw * 0.13;
      zone.cy = -vh * 0.03;
      zone.hw = vw * 0.26;
      zone.hh = vh * 0.33;
      molScale = 1;
    } else {
      // Portrait: the copy sits at the bottom, so the reaction owns the top.
      zone.cx = 0;
      zone.cy = vh * 0.21;
      zone.hw = vw * 0.34;
      zone.hh = vh * 0.15;
      molScale = 0.68;
    }
  };

  // --- Spawning ---
  const spawn = (type: MoleculeType, x: number, y: number, z: number, delay = 0) => {
    const m = molecules.find((p) => !p.active);
    if (!m) return null;
    m.active = true;
    m.type = type;
    m.state = 'drift';
    m.pos.set(x, y, z);
    m.vel.set(0, 0, 0);
    randomUnit(m.spinAxis);
    m.quat.setFromAxisAngle(m.spinAxis, rand(0, Math.PI * 2));
    randomUnit(m.spinAxis);
    m.spinSpeed = rand(0.15, 0.55);
    m.seed = rand(0, 100);
    m.age = -delay;
    m.life = Infinity;
    m.heat = 0;
    m.claimedBy = -1;
    m.partners[0] = m.partners[1] = -1;
    // Fresh fuel drifts for a moment before it starts looking for oxygen.
    m.seekTime = type === 'CH4' ? -rand(2.5, 6) : 0;
    m.burnT = 0;
    m.scale = 0;
    return m;
  };

  const randomInZone = (type: MoleculeType, delay: number) =>
    spawn(
      type,
      zone.cx + rand(-zone.hw, zone.hw),
      zone.cy + rand(-zone.hh, zone.hh),
      rand(-2, 2),
      delay,
    );

  // New reactants drift in from the edge of the zone: fuel from one side, air from the other.
  const spawnReactant = (type: MoleculeType) => {
    const side = type === 'CH4' ? -1 : 1;
    const m = spawn(
      type,
      zone.cx + side * zone.hw * rand(0.7, 1),
      zone.cy + rand(-zone.hh, zone.hh),
      rand(-2, 1.5),
    );
    if (m) m.vel.set(-side * rand(0.2, 0.4), 0, 0);
  };

  const populate = () => {
    for (const type of ['CH4', 'O2', 'N2'] as const) {
      for (let i = 0; i < TARGET[type]; i++) randomInZone(type, reducedMotion ? -10 : rand(0, 2));
    }
  };

  const ignite = (center: THREE.Vector3) => {
    const flash = flashes[flashCursor];
    flashCursor = (flashCursor + 1) % FLASH_POOL;
    flash.pos.copy(center);
    flash.age = 0;
    flash.scale = molScale;

    for (let i = 0; i < SPARKS_PER_FLASH; i++) {
      const s = sparks[sparkCursor];
      sparkCursor = (sparkCursor + 1) % SPARK_POOL;
      randomUnit(s.vel).multiplyScalar(rand(1.4, 4) * molScale);
      s.pos.copy(center).addScaledVector(s.vel, 0.05);
      s.age = 0;
      s.life = rand(0.5, 1.15);
      s.size = rand(0.09, 0.2) * molScale;
    }

    // Products are born hot, burst outwards and then rise like exhaust gas.
    const products: [MoleculeType, number][] = [
      ['CO2', 0],
      ['H2O', Math.PI * 0.7],
      ['H2O', -Math.PI * 0.7],
    ];
    const base = rand(0, Math.PI * 2);
    for (const [type, angle] of products) {
      const m = spawn(type, center.x, center.y, center.z);
      if (!m) continue;
      const a = base + angle;
      m.vel.set(Math.cos(a), Math.sin(a), rand(-0.4, 0.4)).multiplyScalar(1.3 * molScale);
      m.pos.addScaledVector(m.vel, 0.15);
      m.heat = 1;
      m.life = rand(7, 10);
      m.spinSpeed = rand(0.8, 1.4);
    }
  };

  // --- Per-molecule behaviour ---
  const _steer = new THREE.Vector3();
  const _tmp = new THREE.Vector3();
  const _spin = new THREE.Quaternion();

  const flowInto = (m: Molecule, t: number, out: THREE.Vector3) => {
    // Cheap, smooth pseudo-curl flow: molecules wander instead of bouncing.
    const p = m.pos;
    out.set(
      Math.sin(p.y * 0.55 + t * 0.21 + m.seed) * 0.24 + Math.sin(p.z * 0.8 + t * 0.13) * 0.08,
      Math.cos(p.x * 0.45 - t * 0.17 + m.seed * 1.7) * 0.18,
      Math.sin((p.x - p.y) * 0.35 + t * 0.11 + m.seed) * 0.12,
    );
    // Soft walls: steer back into the zone instead of a hard reflection.
    const dx = p.x - zone.cx;
    const dy = p.y - zone.cy;
    if (Math.abs(dx) > zone.hw) out.x -= Math.sign(dx) * (Math.abs(dx) - zone.hw) * 0.7;
    if (Math.abs(dy) > zone.hh) out.y -= Math.sign(dy) * (Math.abs(dy) - zone.hh) * 0.7;
    if (Math.abs(p.z) > 2) out.z -= Math.sign(p.z) * (Math.abs(p.z) - 2) * 0.7;
    return out;
  };

  const release = (i: number, ch4: Molecule) => {
    for (let k = 0; k < 2; k++) {
      const j = ch4.partners[k];
      if (j >= 0 && molecules[j].claimedBy === i) {
        molecules[j].claimedBy = -1;
        molecules[j].state = 'drift';
      }
      ch4.partners[k] = -1;
    }
    ch4.state = 'drift';
    ch4.seekTime = 0;
  };

  // Distance as seen on screen: depth differences count less, so molecules that
  // visibly overlap are treated as touching (and then converge in z as they dock).
  const screenDistance = (a: THREE.Vector3, b: THREE.Vector3) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = (a.z - b.z) * 0.35;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  const preheat = (m: Molecule, dt: number) => {
    m.heat += (PREHEAT - m.heat) * (1 - Math.exp(-dt * 3));
  };

  const burn = (m: Molecule) => {
    _tmp.copy(m.pos);
    let n = 1;
    for (const j of m.partners) {
      if (j < 0) continue;
      _tmp.add(molecules[j].pos);
      n++;
    }
    _tmp.divideScalar(n);
    for (const r of [m, ...m.partners.filter((j) => j >= 0).map((j) => molecules[j])]) {
      r.state = 'burn';
      r.burnT = 0;
      r.burnCenter.copy(_tmp);
    }
  };

  const stepFuel = (i: number, m: Molecule, dt: number) => {
    // Drop partners whose slot was freed or reused meanwhile.
    for (let k = 0; k < 2; k++) {
      const j = m.partners[k];
      if (j >= 0 && (!molecules[j].active || molecules[j].claimedBy !== i)) m.partners[k] = -1;
    }
    if (m.age < 0.8) return;

    const contact = CONTACT_RADIUS * molScale;
    const searching = m.partners[0] < 0 && m.partners[1] < 0;
    if (searching) m.seekTime += dt;
    for (let k = 0; k < 2; k++) {
      if (m.partners[k] >= 0) continue;
      const other = m.partners[1 - k];
      // Touching O2 is always captured. Otherwise the search radius grows until
      // something is found, and once one O2 is on its way the second one is
      // pulled in from anywhere.
      let bestDist =
        other >= 0
          ? Infinity
          : m.seekTime < 0
            ? contact
            : (SEEK_RADIUS + m.seekTime * SEEK_GROWTH) * molScale;
      let best = -1;
      for (let j = 0; j < POOL; j++) {
        const o = molecules[j];
        if (!o.active || o.type !== 'O2' || o.state === 'burn' || o.age < 0.8 || j === other)
          continue;
        const d = screenDistance(o.pos, m.pos);
        if (o.claimedBy !== -1) {
          // An O2 touching this fuel is taken over, unless it already sits on its own CH4.
          const owner = molecules[o.claimedBy];
          if (d >= contact || screenDistance(o.pos, owner.pos) < contact) continue;
        }
        if (d < bestDist) {
          bestDist = d;
          best = j;
        }
      }
      if (best < 0) break;
      m.partners[k] = best;
      molecules[best].claimedBy = i;
      molecules[best].state = 'seek';
    }

    const a = m.partners[0];
    const b = m.partners[1];
    if (a < 0 && b < 0) {
      m.state = 'drift';
      return;
    }
    if (searching) m.seekTime = 0; // first partner found: now time the wait
    m.state = 'seek';
    m.seekTime += dt;

    // Ignite once both oxygen molecules have docked.
    const reach = IGNITE_RADIUS * molScale;
    const docked = (j: number) => j >= 0 && screenDistance(molecules[j].pos, m.pos) < reach;
    if (docked(a) || docked(b)) preheat(m, dt);
    if (docked(a) && docked(b)) burn(m);
    // Fallback so a visible contact never stalls: if the second O2 never shows up,
    // burn with the one that is already docked.
    else if (m.seekTime > SEEK_TIMEOUT && (docked(a) || docked(b))) burn(m);
    else if (m.seekTime > SEEK_TIMEOUT * 1.5) release(i, m);
  };

  const stepMolecule = (i: number, m: Molecule, dt: number, t: number) => {
    m.age += dt;
    if (m.age < 0) return;

    if (m.state === 'burn') {
      // Reactants collapse into the reaction centre while heating up.
      m.burnT += dt;
      m.pos.lerp(m.burnCenter, 1 - Math.exp(-dt * 7));
      m.heat = clamp01(m.burnT / BURN_TIME);
      m.spinSpeed += dt * 6;
      if (m.burnT >= BURN_TIME) {
        if (m.type === 'CH4') {
          _tmp.copy(m.burnCenter);
          for (const j of m.partners) if (j >= 0) molecules[j].active = false;
          m.active = false;
          ignite(_tmp);
        }
        return;
      }
    } else if (m.claimedBy >= 0) {
      // O2 being pulled toward its CH4: glide to a docking point on the side it
      // approaches from, slowing down on arrival instead of overshooting.
      const fuel = molecules[m.claimedBy];
      if (!fuel.active || (fuel.partners[0] !== i && fuel.partners[1] !== i)) {
        m.claimedBy = -1;
        m.state = 'drift';
      }
      _steer.subVectors(m.pos, fuel.pos);
      const d = _steer.length();
      _steer
        .multiplyScalar(d > 1e-3 ? (DOCK_DISTANCE * molScale) / d : 0)
        .add(fuel.pos)
        .sub(m.pos)
        .multiplyScalar(1.6);
      if (_steer.length() > 2.4 * molScale) _steer.setLength(2.4 * molScale);
      m.vel.lerp(_steer, 1 - Math.exp(-dt * 3));
      if (screenDistance(m.pos, fuel.pos) < IGNITE_RADIUS * molScale) preheat(m, dt);
    } else {
      const isProduct = m.type === 'CO2' || m.type === 'H2O';
      flowInto(m, t, _steer);
      if (isProduct) _steer.y += 0.06 + m.heat * 0.3; // hot gas rises (the zone's top wall holds it)
      if (m.state === 'seek') _steer.multiplyScalar(0.35); // fuel waits for its oxygen
      m.vel.lerp(_steer, 1 - Math.exp(-dt * 0.9));
    }

    if (m.type === 'CH4' && m.state !== 'burn') stepFuel(i, m, dt);

    if (m.state !== 'burn') {
      m.pos.addScaledVector(m.vel, dt);
      if (m.heat > PREHEAT || m.state !== 'seek') m.heat *= Math.exp(-dt / HEAT_DECAY);
    }
    _spin.setFromAxisAngle(m.spinAxis, m.spinSpeed * dt);
    m.quat.multiply(_spin);
    if (m.state !== 'burn') m.spinSpeed += (0.35 - m.spinSpeed) * (1 - Math.exp(-dt * 0.5));

    // Products fade out once they have cooled down.
    if (m.age > m.life + 1.2) m.active = false;
  };

  const moleculeScale = (m: Molecule) => {
    if (m.age <= 0) return 0;
    const isProduct = m.type === 'CO2' || m.type === 'H2O';
    let s = isProduct ? easeOutBack(clamp01(m.age / 0.45)) : easeOutCubic(clamp01(m.age / 1.2));
    if (m.age > m.life) s *= 1 - easeOutCubic(clamp01((m.age - m.life) / 1.2));
    if (m.state === 'burn') s *= 1 - 0.55 * easeOutCubic(clamp01(m.burnT / BURN_TIME));
    return s * molScale;
  };

  // --- Rendering (write pools into GPU buffers) ---
  const _matrix = new THREE.Matrix4();
  const _pos = new THREE.Vector3();
  const _quat = new THREE.Quaternion();
  const _scale = new THREE.Vector3();
  const _color = new THREE.Color();
  const _bondColor = new THREE.Color(BOND_COLOR);
  const _identity = new THREE.Quaternion();

  // Values above 1 are intentional: hot atoms read as self-lit (incandescent).
  const heatColor = (base: THREE.Color, heat: number, out: THREE.Color) => {
    out.copy(base).lerp(HOT, Math.min(1, heat * 1.4));
    return out.lerp(WHITE_HOT, heat ** 3 * 0.7).multiplyScalar(1 + heat * 1.6);
  };

  const glowPos = glowGeometry.getAttribute('position') as THREE.BufferAttribute;
  const glowColor = glowGeometry.getAttribute('aColor') as THREE.BufferAttribute;
  const glowSize = glowGeometry.getAttribute('aSize') as THREE.BufferAttribute;
  const glowAlpha = glowGeometry.getAttribute('aAlpha') as THREE.BufferAttribute;
  const glowKind = glowGeometry.getAttribute('aKind') as THREE.BufferAttribute;
  const labelPos = labelGeometry?.getAttribute('position') as THREE.BufferAttribute | undefined;
  const labelGlyph = labelGeometry?.getAttribute('aGlyph') as THREE.BufferAttribute | undefined;
  const labelAlpha = labelGeometry?.getAttribute('aAlpha') as THREE.BufferAttribute | undefined;
  const labelSize = labelGeometry?.getAttribute('aSize') as THREE.BufferAttribute | undefined;
  let glowCount = 0;
  const pushGlow = (
    x: number,
    y: number,
    z: number,
    color: THREE.Color,
    size: number,
    alpha: number,
    kind: number,
  ) => {
    if (alpha <= 0.002 || glowCount >= GLOW_CAPACITY) return;
    const i = glowCount++;
    glowPos.setXYZ(i, x, y, z);
    glowColor.setXYZ(i, color.r, color.g, color.b);
    glowSize.setX(i, size);
    glowAlpha.setX(i, alpha);
    glowKind.setX(i, kind);
  };

  const writeBuffers = (t: number, vw: number, vh: number) => {
    let atomCount = 0;
    let bondCount = 0;
    let labelCount = 0;
    glowCount = 0;

    for (const m of molecules) {
      if (!m.active) continue;
      const s = (m.scale = moleculeScale(m));
      if (s <= 0.001) continue;
      const recipe = COMPILED[m.type];

      for (const a of recipe.atoms) {
        _pos.copy(a.pos).multiplyScalar(s).applyQuaternion(m.quat).add(m.pos);
        _scale.setScalar(a.size * s);
        atoms.setMatrixAt(atomCount, _matrix.compose(_pos, _identity, _scale));
        atoms.setColorAt(atomCount, heatColor(a.color, m.heat, _color));
        atomCount++;
      }
      for (const b of recipe.bonds) {
        _pos.copy(b.mid).multiplyScalar(s).applyQuaternion(m.quat).add(m.pos);
        _quat.multiplyQuaternions(m.quat, b.quat);
        _scale.set(s, b.length * s, s);
        bonds.setMatrixAt(bondCount, _matrix.compose(_pos, _quat, _scale));
        bonds.setColorAt(bondCount, heatColor(_bondColor, m.heat, _color));
        bondCount++;
      }

      // Neon halo; flares up while burning and fades as products cool.
      _color.copy(recipe.halo).lerp(HOT, m.heat);
      pushGlow(m.pos.x, m.pos.y, m.pos.z, _color, 2.3 * s, 0.07 + m.heat * 0.5, 0);

      if (labelPos && labelGlyph && labelAlpha && labelSize && m.state !== 'burn') {
        const alpha = 0.6 * (s / molScale) * (1 - m.heat);
        if (alpha > 0.01) {
          labelPos.setXYZ(labelCount, m.pos.x + 0.55 * s, m.pos.y - 0.62 * s, m.pos.z + 0.4);
          labelGlyph.setX(labelCount, recipe.glyph);
          labelAlpha.setX(labelCount, alpha);
          labelSize.setX(labelCount, 0.95);
          labelCount++;
        }
      }
    }

    for (const f of flashes) {
      if (f.age >= RING_TIME) continue;
      const fp = clamp01(f.age / FLASH_TIME);
      const rp = clamp01(f.age / RING_TIME);
      const { x, y, z } = f.pos;
      pushGlow(x, y, z, FLASH_COLOR, (1.6 + 4 * easeOutCubic(fp)) * f.scale, (1 - fp) ** 1.5, 0);
      pushGlow(x, y, z, WHITE_HOT, 1.4 * f.scale, (1 - fp) ** 2.5, 2);
      pushGlow(x, y, z, RING_COLOR, (0.6 + 7 * easeOutCubic(rp)) * f.scale, (1 - rp) ** 1.6, 1);
    }

    for (const s of sparks) {
      if (s.age >= s.life) continue;
      const p = s.age / s.life;
      _color.copy(WHITE_HOT).lerp(HOT, clamp01(p * 2.5));
      if (p > 0.55) _color.lerp(SPARK_END, (p - 0.55) / 0.45);
      pushGlow(s.pos.x, s.pos.y, s.pos.z, _color, s.size, (1 - p) ** 1.4, 2);
    }

    for (const d of dust) {
      const twinkle = 0.2 + 0.18 * Math.sin(t * 0.9 + d.phase * 3);
      pushGlow(d.x * vw, d.y * vh, d.z, DUST_COLOR, d.size, twinkle, 2);
    }

    atoms.count = atomCount;
    bonds.count = bondCount;
    atoms.instanceMatrix.needsUpdate = bonds.instanceMatrix.needsUpdate = true;
    atoms.instanceColor!.needsUpdate = bonds.instanceColor!.needsUpdate = true;

    glowGeometry.setDrawRange(0, glowCount);
    for (const attr of [glowPos, glowColor, glowSize, glowAlpha, glowKind]) attr.needsUpdate = true;

    if (labelGeometry && labelPos && labelGlyph && labelAlpha && labelSize) {
      labelGeometry.setDrawRange(0, labelCount);
      for (const attr of [labelPos, labelGlyph, labelAlpha, labelSize]) attr.needsUpdate = true;
    }
  };

  // --- Frame update ---
  const update = (state: FrameState, dt: number) => {
    const { viewport, size, camera, pointer, clock } = state;
    const t = clock.elapsedTime;
    updateZone(viewport.width, viewport.height);

    if (!initialised) {
      populate();
      initialised = true;
    }

    // World units -> drawing-buffer pixels, for point sprite sizes.
    const fov = (camera as THREE.PerspectiveCamera).fov;
    const pxScale = (size.height * viewport.dpr) / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)));
    glowMaterial.uniforms.uScale.value = pxScale;
    if (labelMaterial) labelMaterial.uniforms.uScale.value = pxScale;

    if (dt > 0) {
      // Subtle parallax that follows the pointer (pointer stays at 0 on touch).
      const k = 1 - Math.exp(-dt * 1.5);
      camera.position.x += (pointer.x * 0.6 - camera.position.x) * k;
      camera.position.y += (pointer.y * 0.35 - camera.position.y) * k;
      camera.lookAt(0, 0, 0);

      for (let i = 0; i < POOL; i++) {
        const m = molecules[i];
        if (m.active) stepMolecule(i, m, dt, t);
      }

      for (const f of flashes) if (f.age < RING_TIME) f.age += dt;
      const drag = Math.exp(-dt * 2.2);
      for (const s of sparks) {
        if (s.age >= s.life) continue;
        s.age += dt;
        s.vel.multiplyScalar(drag);
        s.vel.y += 0.7 * dt * molScale; // embers float up
        s.pos.addScaledVector(s.vel, dt);
      }
      for (const d of dust) {
        d.y += d.speed * dt;
        d.x += Math.sin(t * 0.2 + d.phase) * 0.002 * dt;
        if (d.y > 0.55) d.y -= 1.1;
      }

      // Keep the reaction going: top up reactants, one molecule per tick.
      populationTimer += dt;
      if (populationTimer > 0.6) {
        populationTimer = 0;
        const counts = { CH4: 0, O2: 0, N2: 0, CO2: 0, H2O: 0 };
        for (const m of molecules) if (m.active && m.state !== 'burn') counts[m.type]++;
        if (counts.CH4 < TARGET.CH4) spawnReactant('CH4');
        else if (counts.O2 < TARGET.O2) spawnReactant('O2');
        else if (counts.N2 < TARGET.N2) randomInZone('N2', 0);
      }
    }

    writeBuffers(t, viewport.width, viewport.height);
  };

  const dispose = () => {
    sphere.dispose();
    cylinder.dispose();
    moleculeMaterial.dispose();
    atoms.dispose();
    bonds.dispose();
    glowGeometry.dispose();
    glowMaterial.dispose();
    labelGeometry?.dispose();
    labelMaterial?.dispose();
    labelAtlas?.dispose();
  };

  return { root, update, dispose, background: BACKGROUND };
};
