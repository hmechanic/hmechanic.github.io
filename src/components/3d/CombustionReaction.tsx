import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// --- Theme Colors (Enhanced) ---
const THEME = {
    H: "#00f3ff",   // Neon Cyan
    C: "#222222",   // Dark Carbon
    O: "#ff00ff",   // Neon Magenta
    N: "#00ff88",   // Neon Green
    Bond: "#555555",
};

// --- High-Fidelity Atom Component ---
const Atom = ({ position, color, size = 0.3, label }: {
    position: [number, number, number],
    color: string,
    size?: number,
    label: string
}) => {
    return (
        <group position={position}>
            {/* Core Atom */}
            <Sphere args={[size, 32, 32]}>
                <meshPhysicalMaterial
                    color={color}
                    roughness={0.2}
                    metalness={0.7}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    emissive={color}
                    emissiveIntensity={0.3}
                />
            </Sphere>

            {/* Glossy Overlay (Fake Rim Light) */}
            <Sphere args={[size * 1.05, 32, 32]}>
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.1}
                    roughness={0}
                    side={THREE.BackSide}
                />
            </Sphere>

            {/* Label */}
            <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
                <div style={{
                    color: '#ffffff',
                    fontSize: '11px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: '800',
                    textShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
                    userSelect: 'none',
                    opacity: 0.9
                }}>
                    {label}
                </div>
            </Html>
        </group>
    );
};

// --- Bond Component ---
const Bond = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(endVec, startVec);
    const length = direction.length();
    const position = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);

    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    const rotation = new THREE.Euler().setFromQuaternion(quaternion);

    return (
        <group position={position} rotation={rotation}>
            <Cylinder args={[0.03, 0.03, length, 12]}>
                <meshPhysicalMaterial
                    color={THEME.Bond}
                    metalness={0.5}
                    roughness={0.3}
                    transparent
                    opacity={0.8}
                />
            </Cylinder>
        </group>
    );
};

// --- Molecule Structure Definitions ---

const Methane = ({ position, rotation, scale = 1 }: { position: THREE.Vector3, rotation?: THREE.Euler, scale?: number }) => {
    const hDist = 0.4;
    return (
        <group position={[position.x, position.y, position.z]} rotation={rotation} scale={scale}>
            <Atom position={[0, 0, 0]} color={THEME.C} size={0.28} label="C" />
            <Atom position={[hDist, hDist, hDist]} color={THEME.H} size={0.18} label="H" />
            <Atom position={[-hDist, -hDist, hDist]} color={THEME.H} size={0.18} label="H" />
            <Atom position={[-hDist, hDist, -hDist]} color={THEME.H} size={0.18} label="H" />
            <Atom position={[hDist, -hDist, -hDist]} color={THEME.H} size={0.18} label="H" />

            <Bond start={[0, 0, 0]} end={[hDist, hDist, hDist]} />
            <Bond start={[0, 0, 0]} end={[-hDist, -hDist, hDist]} />
            <Bond start={[0, 0, 0]} end={[-hDist, hDist, -hDist]} />
            <Bond start={[0, 0, 0]} end={[hDist, -hDist, -hDist]} />
        </group>
    );
};

const Oxygen = ({ position, rotation, scale = 1 }: { position: THREE.Vector3, rotation?: THREE.Euler, scale?: number }) => (
    <group position={[position.x, position.y, position.z]} rotation={rotation} scale={scale}>
        <Atom position={[-0.22, 0, 0]} color={THEME.O} size={0.22} label="O" />
        <Atom position={[0.22, 0, 0]} color={THEME.O} size={0.22} label="O" />
        <Bond start={[-0.22, 0, 0]} end={[0.22, 0, 0]} />
    </group>
);

const Nitrogen = ({ position, rotation }: { position: THREE.Vector3, rotation?: THREE.Euler }) => (
    <group position={[position.x, position.y, position.z]} rotation={rotation}>
        <Atom position={[-0.2, 0, 0]} color={THEME.N} size={0.2} label="N" />
        <Atom position={[0.2, 0, 0]} color={THEME.N} size={0.2} label="N" />
        <Bond start={[-0.2, 0, 0]} end={[0.2, 0, 0]} />
    </group>
);

const CarbonDioxide = ({ position, rotation, scale = 1 }: { position: THREE.Vector3, rotation?: THREE.Euler, scale?: number }) => (
    <group position={[position.x, position.y, position.z]} rotation={rotation} scale={scale}>
        <Atom position={[0, 0, 0]} color={THEME.C} size={0.28} label="C" />
        <Atom position={[-0.55, 0, 0]} color={THEME.O} size={0.22} label="O" />
        <Atom position={[0.55, 0, 0]} color={THEME.O} size={0.22} label="O" />
        <Bond start={[0, 0, 0]} end={[-0.55, 0, 0]} />
        <Bond start={[0, 0, 0]} end={[0.55, 0, 0]} />
    </group>
);

const Water = ({ position, rotation, scale = 1 }: { position: THREE.Vector3, rotation?: THREE.Euler, scale?: number }) => (
    <group position={[position.x, position.y, position.z]} rotation={rotation} scale={scale}>
        <Atom position={[0, 0, 0]} color={THEME.O} size={0.24} label="O" />
        <Atom position={[-0.3, -0.25, 0]} color={THEME.H} size={0.16} label="H" />
        <Atom position={[0.3, -0.25, 0]} color={THEME.H} size={0.16} label="H" />
        <Bond start={[0, 0, 0]} end={[-0.3, -0.25, 0]} />
        <Bond start={[0, 0, 0]} end={[0.3, -0.25, 0]} />
    </group>
);

// --- Particle Logic ---

type MoleculeType = 'CH4' | 'O2' | 'N2' | 'CO2' | 'H2O';
type Phase = 'idle' | 'reacting_implode' | 'reacting_explode' | 'dead';

interface Particle {
    id: number;
    type: MoleculeType;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    rotation: THREE.Euler;
    rotationSpeed: THREE.Vector3;
    scale: number;

    // Logic State
    phase: Phase;
    reactionTarget?: THREE.Vector3;
    timer: number;
}

interface Explosion {
    id: number;
    position: THREE.Vector3;
    age: number;
}

const BOUNDS_X = 6;
const BOUNDS_Y = 3.5;
const BOUNDS_Z = 2;
const REACTION_RADIUS = 1.2;
const IMPLOSION_TIME = 0.8; // Time to merge before explosion

const CombustionScene = () => {
    const groupRef = useRef<THREE.Group>(null);
    const [explosions, setExplosions] = useState<Explosion[]>([]);

    const [particles, setParticles] = useState<Particle[]>(() => {
        const initial: Particle[] = [];
        let id = 0;

        const randomVec = (scale: number) => new THREE.Vector3((Math.random() - 0.5) * scale, (Math.random() - 0.5) * scale, (Math.random() - 0.5) * scale);
        const randomEuler = () => new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

        // Reactants
        for (let i = 0; i < 4; i++) initial.push({ id: id++, type: 'CH4', position: new THREE.Vector3(-4 + Math.random(), (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2), velocity: new THREE.Vector3(0.5, 0, 0).add(randomVec(0.2)), rotation: randomEuler(), rotationSpeed: randomVec(0.5), scale: 1, phase: 'idle', timer: 0 });
        for (let i = 0; i < 6; i++) initial.push({ id: id++, type: 'O2', position: new THREE.Vector3(4 - Math.random(), (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2), velocity: new THREE.Vector3(-0.5, 0, 0).add(randomVec(0.2)), rotation: randomEuler(), rotationSpeed: randomVec(0.5), scale: 1, phase: 'idle', timer: 0 });
        // Inert N2
        for (let i = 0; i < 8; i++) initial.push({ id: id++, type: 'N2', position: new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3), velocity: randomVec(0.4), rotation: randomEuler(), rotationSpeed: randomVec(0.2), scale: 1, phase: 'idle', timer: 0 });

        return initial;
    });

    const nextId = useRef(particles.length);
    const explosionId = useRef(0);

    useFrame((_, delta) => {
        // Update Explosions
        setExplosions(prev => prev.map(e => ({ ...e, age: e.age + delta })).filter(e => e.age < 1.0));

        setParticles(prev => {
            const next = [...prev];
            const toAdd: Particle[] = [];
            const currentlyReacting = new Set<number>(); // Prevent double-trigger in same frame

            for (let i = 0; i < next.length; i++) {
                const p = next[i];
                if (p.phase === 'dead') continue;

                // --- 1. Movement Logic based on Phase ---

                if (p.phase === 'idle') {
                    // Normal Physics
                    p.position.add(p.velocity.clone().multiplyScalar(delta));

                    // Bounce off Walls
                    if (Math.abs(p.position.x) > BOUNDS_X) { p.velocity.x *= -1; p.position.x = Math.sign(p.position.x) * BOUNDS_X; }
                    if (Math.abs(p.position.y) > BOUNDS_Y) { p.velocity.y *= -1; p.position.y = Math.sign(p.position.y) * BOUNDS_Y; }
                    if (Math.abs(p.position.z) > BOUNDS_Z) { p.velocity.z *= -1; p.position.z = Math.sign(p.position.z) * BOUNDS_Z; }

                } else if (p.phase === 'reacting_implode') {
                    // Implosion: Move quickly towards reaction center
                    if (p.reactionTarget) {
                        p.position.lerp(p.reactionTarget, delta * 5); // Smooth slide to center
                        p.rotationSpeed.multiplyScalar(1.05); // Spin faster
                    }
                    p.scale = Math.max(0.1, 1 - (p.timer / IMPLOSION_TIME)); // Shrink effect
                    p.timer += delta;

                    if (p.timer > IMPLOSION_TIME) {
                        p.phase = 'dead';
                        // Trigger EXPLOSION (Product Spawn) only once per interacting pair
                        // We handle this by checking type to avoid double spawn
                        if (p.type === 'CH4') {
                            const center = p.reactionTarget!.clone();
                            setExplosions(exps => [...exps, { id: explosionId.current++, position: center, age: 0 }]);

                            // Spawn Products (CO2 + 2 H2O)
                            // Start them small and expanding
                            const randomVel = () => (Math.random() - 0.5) * 1.5;

                            toAdd.push({
                                id: nextId.current++, type: 'CO2',
                                position: center.clone(), velocity: new THREE.Vector3(randomVel(), randomVel(), randomVel()),
                                rotation: new THREE.Euler(), rotationSpeed: new THREE.Vector3(0.1, 0.1, 0.1),
                                scale: 0.1, phase: 'reacting_explode', timer: 0
                            });
                            toAdd.push({
                                id: nextId.current++, type: 'H2O',
                                position: center.clone().add(new THREE.Vector3(0.5, 0, 0)), velocity: new THREE.Vector3(randomVel(), randomVel(), randomVel()),
                                rotation: new THREE.Euler(), rotationSpeed: new THREE.Vector3(0.1, 0.1, 0.1),
                                scale: 0.1, phase: 'reacting_explode', timer: 0
                            });
                            toAdd.push({
                                id: nextId.current++, type: 'H2O',
                                position: center.clone().add(new THREE.Vector3(-0.5, 0, 0)), velocity: new THREE.Vector3(randomVel(), randomVel(), randomVel()),
                                rotation: new THREE.Euler(), rotationSpeed: new THREE.Vector3(0.1, 0.1, 0.1),
                                scale: 0.1, phase: 'reacting_explode', timer: 0
                            });
                        }
                    }
                } else if (p.phase === 'reacting_explode') {
                    // Expansion: Grow back to full size
                    p.position.add(p.velocity.clone().multiplyScalar(delta));
                    p.scale = Math.min(1, p.scale + delta * 2);
                    p.timer += delta;
                    if (p.scale >= 1) {
                        p.phase = 'idle'; // Stabilize
                    }
                }

                // Generic Rotation Update
                p.rotation.x += p.rotationSpeed.x * delta;
                p.rotation.y += p.rotationSpeed.y * delta;
                p.rotation.z += p.rotationSpeed.z * delta;


                // --- 2. Collision Detection (Only for Idle Reactants) ---
                if (p.phase === 'idle' && p.type === 'CH4' && !currentlyReacting.has(p.id)) {
                    for (let j = 0; j < next.length; j++) {
                        const other = next[j];
                        if (p.id === other.id || other.phase !== 'idle' || currentlyReacting.has(other.id)) continue;

                        if (other.type === 'O2') {
                            const dist = p.position.distanceTo(other.position);
                            if (dist < REACTION_RADIUS) {
                                // START REACTION SEQUENCE
                                const midPoint = p.position.clone().lerp(other.position, 0.5);

                                // Mark both as imploding
                                p.phase = 'reacting_implode';
                                p.reactionTarget = midPoint;
                                p.timer = 0;

                                other.phase = 'reacting_implode';
                                other.reactionTarget = midPoint;
                                other.timer = 0;

                                currentlyReacting.add(p.id);
                                currentlyReacting.add(other.id);
                                break;
                            }
                        }
                    }
                }
            }

            return [...next.filter(p => p.phase !== 'dead'), ...toAdd];
        });

        if (groupRef.current) groupRef.current.rotation.y = Math.sin(Date.now() * 0.00005) * 0.1;
    });

    const renderMolecule = (p: Particle) => {
        let component;
        switch (p.type) {
            case 'CH4': component = <Methane position={p.position} rotation={p.rotation} scale={p.scale} />; break;
            case 'O2': component = <Oxygen position={p.position} rotation={p.rotation} scale={p.scale} />; break;
            case 'N2': component = <Nitrogen position={p.position} rotation={p.rotation} />; break; // N2 no scale effect needed usually
            case 'CO2': component = <CarbonDioxide position={p.position} rotation={p.rotation} scale={p.scale} />; break;
            case 'H2O': component = <Water position={p.position} rotation={p.rotation} scale={p.scale} />; break;
            default: return null;
        }
        return <group key={p.id}>{component}</group>;
    };

    return (
        <group ref={groupRef}>
            {particles.map(renderMolecule)}

            {explosions.map(e => (
                <group key={e.id} position={e.position}>
                    <pointLight
                        color="#ffaa00"
                        intensity={8 * (1 - e.age)}
                        distance={10}
                        decay={2}
                    />
                    <Sparkles
                        count={20}
                        scale={3 * (e.age * 3 + 1)}
                        size={8}
                        speed={1.5}
                        opacity={1 - e.age}
                        color="#ffdd88"
                    />
                </group>
            ))}
        </group>
    );
};

const CombustionReaction = () => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={45} />
            <color attach="background" args={['#050505']} />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#4444ff" />
            <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ff44ff" />
            <spotLight position={[0, 10, 0]} intensity={1} angle={0.6} penumbra={1} color="#ffffff" />

            <CombustionScene />

            <Sparkles count={50} scale={20} size={1} opacity={0.2} speed={0.2} color="#ffffff" />
            <fog attach="fog" args={['#050505', 12, 35]} />
        </>
    );
};

export default CombustionReaction;
