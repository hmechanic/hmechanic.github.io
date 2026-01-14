import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { cvData } from '../utils/loadCv';
import CombustionReaction from './3d/CombustionReaction';

const Hero = () => {
    const { name } = cvData.heading;
    const role = "Ingeniero Mecánico & Desarrollador de Software";

    return (
        <section id="home" className="h-screen w-full flex flex-col md:flex-row items-center justify-center relative overflow-hidden pt-20">
            {/* Text Content */}
            <div className="md:w-1/2 flex flex-col justify-center items-start px-8 md:pl-20 z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-neon-magenta font-mono text-lg mb-4 tracking-widest">
                        PORTAFOLIO 2026
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Hola, soy <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple filter drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                            {name.split(' ')[0]}
                        </span>
                    </h1>
                    <div className="relative mb-8 max-w-lg group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-20 blur transition duration-1000 group-hover:opacity-40"></div>
                        <div className="relative bg-black/40 backdrop-blur-sm border-l-4 border-neon-cyan p-6 rounded-r-xl">
                            <p className="text-gray-300 text-lg leading-relaxed">
                                {role}. Especializado en arquitecturas de microservicios, IA y análisis de datos. <br />
                                Modelador energético, especializado transición energética y mitigación del cambio climático.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <a href="#projects" className="px-8 py-3 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all font-bold tracking-wider rounded">
                            VER PROYECTOS
                        </a>
                        <a href="#contact" className="px-8 py-3 border border-white/20 text-white hover:border-white transition-all font-bold tracking-wider rounded">
                            CONTACTAR
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* 3D Scene */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-full relative z-0">
                <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-transparent z-10 pointer-events-none" />
                <Canvas className="w-full h-full">
                    <Suspense fallback={null}>
                        <CombustionReaction />
                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                    </Suspense>
                </Canvas>
            </div>
        </section>
    );
};

export default Hero;
