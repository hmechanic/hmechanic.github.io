import type { ReactNode } from 'react';

export type Language = 'es' | 'en';

export const LANGUAGES: Language[] = ['es', 'en'];

/** UI strings that live in the components (everything that is not CV data). */
export interface Translation {
    nav: {
        items: { id: string; label: string }[];
        home: string;
        openMenu: string;
        closeMenu: string;
        toggleLanguage: string;
    };
    hero: {
        badge: string;
        greeting: string;
        role: string;
        tagline: ReactNode;
        viewProjects: string;
        contact: string;
    };
    about: {
        number: string;
        paragraphs: ReactNode[];
        stats: { value: string; label: string }[];
    };
    experience: {
        number: string;
        title: string;
        viewCertificate: string;
    };
    skills: {
        title: ReactNode;
    };
    projects: {
        number: string;
        title: string;
        /** Descriptions keyed by the (language-independent) project title. */
        descriptions: Record<string, string>;
    };
    contact: {
        eyebrow: string;
        title: string;
        body: string;
        cta: string;
        whatsappMessage: string;
    };
    footer: string;
}

export const translations: Record<Language, Translation> = {
    es: {
        nav: {
            items: [
                { id: 'about', label: 'Sobre mí' },
                { id: 'experience', label: 'Experiencia' },
                { id: 'projects', label: 'Proyectos' },
                { id: 'contact', label: 'Contacto' },
            ],
            home: 'Volver al inicio',
            openMenu: 'Abrir menú',
            closeMenu: 'Cerrar menú',
            toggleLanguage: 'Ver en inglés',
        },
        hero: {
            badge: 'PORTAFOLIO 2026',
            greeting: 'Hola, soy',
            role: 'Ingeniero Mecánico & Desarrollador de Software',
            tagline: (
                <>
                    Ingeniero Mecánico & Desarrollador de Software. Especializado en arquitecturas de microservicios, IA y análisis de datos. <br />
                    Modelador energético, especializado en transición energética y mitigación del cambio climático.
                </>
            ),
            viewProjects: 'VER PROYECTOS',
            contact: 'CONTACTAR',
        },
        about: {
            number: '01.',
            paragraphs: [
                <>
                    Soy <span className="text-white font-bold">Ingeniero Mecánico</span> y <span className="text-white font-bold">desarrollador de software</span> con más de tres años de experiencia impulsando la <span className="text-neon-cyan">transición energética</span> mediante ciencia de datos y tecnología moderna.
                </>,
                <>
                    Mi enfoque único combina el <span className="text-neon-purple">modelado matemático</span> de sistemas energéticos con arquitecturas de software robustas (<span className="text-neon-green font-mono">Python</span>, <span className="text-neon-green font-mono">SQL</span>, <span className="text-neon-green font-mono">Microservicios</span>) para resolver desafíos de descarbonización.
                </>,
                <>
                    He liderado hitos clave, como la construcción del <span className="text-white font-semibold">modelo energético nacional de Colombia</span> bajo el marco TIMES y el despliegue de infraestructuras en la nube para el procesamiento de datos satelitales y emisiones. Apasionado por la innovación, integro <span className="text-neon-magenta font-bold">Inteligencia Artificial</span> y <span className="text-neon-magenta font-bold">Big Data</span> para diseñar sistemas de Monitoreo, Reporte y Verificación (MRV) que transforman datos complejos en decisiones estratégicas.
                </>,
            ],
            stats: [
                { value: '3+', label: 'Años de experiencia' },
                { value: '10+', label: 'Proyectos de IA' },
                { value: '100%', label: 'Compromiso' },
            ],
        },
        experience: {
            number: '02.',
            title: 'Experiencia',
            viewCertificate: 'Ver certificado ↗',
        },
        skills: {
            title: (
                <>
                    <span className="text-neon-cyan">Stack</span> Tecnológico
                </>
            ),
        },
        projects: {
            number: '03.',
            title: 'Proyectos Destacados',
            descriptions: {
                'SatEmis Platform': 'Plataforma de procesamiento de datos satelitales. Arquitectura de microservicios con NestJS y Docker, optimizada para Google Cloud Platform.',
                'Frontend SatEmis': 'Interfaz de usuario para la visualización e interpretación de datos satelitales y gestión de la plataforma.',
                'Deep Learning Concepts': 'Implementación de modelos de Deep Learning y redes neuronales desde cero o utilizando frameworks modernos.',
            },
        },
        contact: {
            eyebrow: '¿Qué sigue?',
            title: 'Contáctame',
            body: 'Actualmente estoy abierto a nuevas oportunidades. Ya sea que tengas una pregunta o simplemente quieras saludar, ¡haré todo lo posible por responderte!',
            cta: 'Conversar en WhatsApp',
            whatsappMessage: 'Hola Hernán, vi tu portafolio y me gustaría contactarte...',
        },
        footer: 'Hecho con React & Three.js.',
    },
    en: {
        nav: {
            items: [
                { id: 'about', label: 'About' },
                { id: 'experience', label: 'Experience' },
                { id: 'projects', label: 'Projects' },
                { id: 'contact', label: 'Contact' },
            ],
            home: 'Back to top',
            openMenu: 'Open menu',
            closeMenu: 'Close menu',
            toggleLanguage: 'View in Spanish',
        },
        hero: {
            badge: 'PORTFOLIO 2026',
            greeting: "Hi, I'm",
            role: 'Mechanical Engineer & Software Developer',
            tagline: (
                <>
                    Mechanical Engineer & Software Developer. Specialized in microservice architectures, AI and data analysis. <br />
                    Energy modeler, focused on the energy transition and climate change mitigation.
                </>
            ),
            viewProjects: 'VIEW PROJECTS',
            contact: 'GET IN TOUCH',
        },
        about: {
            number: '01.',
            paragraphs: [
                <>
                    I am a <span className="text-white font-bold">Mechanical Engineer</span> and <span className="text-white font-bold">software developer</span> with more than three years of experience driving the <span className="text-neon-cyan">energy transition</span> through data science and modern technology.
                </>,
                <>
                    My unique approach combines the <span className="text-neon-purple">mathematical modeling</span> of energy systems with robust software architectures (<span className="text-neon-green font-mono">Python</span>, <span className="text-neon-green font-mono">SQL</span>, <span className="text-neon-green font-mono">Microservices</span>) to solve decarbonization challenges.
                </>,
                <>
                    I have led key milestones, such as building the <span className="text-white font-semibold">national energy model of Colombia</span> under the TIMES framework and deploying cloud infrastructure for satellite and emissions data processing. Passionate about innovation, I integrate <span className="text-neon-magenta font-bold">Artificial Intelligence</span> and <span className="text-neon-magenta font-bold">Big Data</span> to design Monitoring, Reporting and Verification (MRV) systems that turn complex data into strategic decisions.
                </>,
            ],
            stats: [
                { value: '3+', label: 'Years of experience' },
                { value: '10+', label: 'AI projects' },
                { value: '100%', label: 'Commitment' },
            ],
        },
        experience: {
            number: '02.',
            title: 'Experience',
            viewCertificate: 'View certificate ↗',
        },
        skills: {
            title: (
                <>
                    Tech <span className="text-neon-cyan">Stack</span>
                </>
            ),
        },
        projects: {
            number: '03.',
            title: 'Featured Projects',
            descriptions: {
                'SatEmis Platform': 'Satellite data processing platform. Microservice architecture with NestJS and Docker, optimized for Google Cloud Platform.',
                'Frontend SatEmis': 'User interface for the visualization and interpretation of satellite data and platform management.',
                'Deep Learning Concepts': 'Implementation of Deep Learning models and neural networks from scratch or using modern frameworks.',
            },
        },
        contact: {
            eyebrow: "What's next?",
            title: 'Get in touch',
            body: "I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll do my best to get back to you!",
            cta: 'Chat on WhatsApp',
            whatsappMessage: "Hi Hernán, I saw your portfolio and I'd like to get in touch...",
        },
        footer: 'Built with React & Three.js.',
    },
};
