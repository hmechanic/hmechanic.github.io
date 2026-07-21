import type { ReactNode } from 'react';

export type Language = 'es' | 'en';

export const LANGUAGES: Language[] = ['es', 'en'];

/** UI strings that live in the components (everything that is not CV data). */
export interface Translation {
    nav: {
        items: { id: string; label: string }[];
        cv: string;
        home: string;
        openMenu: string;
        closeMenu: string;
        toggleLanguage: string;
    };
    /** Lateral section-progress indicator (scroll-spy pagination). */
    progress: {
        label: string;
        items: { id: string; label: string }[];
    };
    cvPage: {
        eyebrow: string;
        title: string;
        description: string;
        openPdf: string;
        fallback: string;
        loading: string;
        missingPdf: string;
    };
    hero: {
        greeting: string;
        namePrefix: string;
        tagline: ReactNode;
        viewProjects: string;
        contact: string;
    };
    about: {
        intro: ReactNode;
        areas: {
            number: string;
            title: string;
            content: ReactNode;
        }[];
        details: {
            eyebrow: string;
            title: string;
            content: ReactNode;
        }[];
        photo: {
            label: string;
        };
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
            cv: 'Hoja de vida',
            home: 'Volver al inicio',
            openMenu: 'Abrir menú',
            closeMenu: 'Cerrar menú',
            toggleLanguage: 'Ver en inglés',
        },
        progress: {
            label: 'Navegación de secciones',
            items: [
                { id: 'home', label: 'Inicio' },
                { id: 'about', label: 'Perfil' },
                { id: 'experience', label: 'Experiencia' },
                { id: 'skills', label: 'Habilidades' },
                { id: 'projects', label: 'Proyectos' },
                { id: 'contact', label: 'Contacto' },
            ],
        },
        cvPage: {
            eyebrow: 'Currículum',
            title: 'CV profesional',
            description: 'Este documento se actualiza automáticamente según el idioma seleccionado en el sitio.',
            openPdf: 'Abrir PDF',
            fallback: 'Si el visor no carga correctamente, abre el PDF en una nueva pestaña.',
            loading: 'Cargando PDF...',
            missingPdf: 'El PDF en español no está disponible todavía. Agrega el archivo public/cv/cv-es.pdf.',
        },
        hero: {
            greeting: 'Bienvenido a mi espacio.',
            namePrefix: 'Soy',
            tagline: (
                <>
                    <p>Ingeniero, Creativo, Autodidacto, explorador de ideas... <br /> y de frailejones 🌿.</p>
                    <p>Utilizo tecnología, creatividad, mis capacidades análiticas y la forma apasionada de
                    enfrentarme a los retos para aportar a crear y mantener un mundo con valores
                    y sueños y conciencia.</p>
                    <p>Me gustá apreciar, aportar e impulsar al límite poder del conocimiento y las capacidades de nuestra especie
                    para tranformar nuestra realidad.</p>
                </>
            ),
            viewProjects: 'VER PROYECTOS',
            contact: 'CONTACTAR',
        },
        about: {
            intro: <>
                Soy <span className="text-white font-bold">ingeniero mecánico</span> y he orientado mi carrera profesional hacia dos áreas principales.
            </>,
            areas: [
                {
                    number: '01',
                    title: 'Ingeniería e investigación aplicada',
                    content: <>La primera es la participación activa en <span className="text-neon-cyan">investigación aplicada</span>, especialmente en temas relacionados con energía, cambio climático, análisis de datos y modelación de sistemas.</>,
                },
                {
                    number: '02',
                    title: 'Software e inteligencia artificial',
                    content: <>La segunda es el desarrollo de software complejo para resolver problemas de ingeniería y construir productos tecnológicos. En esta área implemento tecnologías relacionadas con el análisis y la gestión de datos, el desarrollo de software y la creación de proyectos <span className="text-neon-magenta font-bold">AI First</span>, incluyendo programación de agentes, diseño de arquitecturas de machine learning, automatización de procesos e integración de sistemas.</>,
                },
            ],
            details: [
                {
                    eyebrow: 'Trabajo reciente',
                    title: 'Productos con aplicación real',
                    content: <>Mi formación complementaria incluye inteligencia artificial, machine learning, análisis de datos e ingeniería de software. Entre mis trabajos recientes se encuentran dos proyectos principales: <span className="text-white font-semibold">SatEmis</span>, una plataforma orientada a la investigación climática, el análisis de datos satelitales y la aplicación de modelos de machine learning a escala; y <span className="text-white font-semibold">OrionAtiende.com</span>, un SaaS para la implementación personalizada de agentes especializados en ventas y soporte al cliente, dirigido a empresas con necesidades intensivas de atención y gestión de usuarios. Ambos proyectos pueden explorarse con mayor detalle en la sección de proyectos.</>,
                },
                {
                    eyebrow: 'Consultoría',
                    title: 'Ingeniería mecánica',
                    content: <>Como profesional, también presto servicios de consultoría en ingeniería mecánica, con énfasis en las áreas térmica y de fluidos. Mi trabajo incluye energías renovables, modelación energética, dinámica de fluidos computacional (<span className="text-neon-green font-mono">CFD</span>), mitigación del cambio climático, elaboración de inventarios de emisiones y monitoreo remoto.</>,
                },
                {
                    eyebrow: 'Liderazgo técnico',
                    title: 'Soluciones integradas',
                    content: <>En el área de software, trabajo como ingeniero líder en el diseño y desarrollo de proyectos. Cuento con cerca de cuatro años de experiencia certificada y me especializo en la construcción de soluciones que integran datos, inteligencia artificial, software e ingeniería aplicada.</>,
                },
            ],
            photo: {
                label: 'Fotografía profesional',
            },
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
            cv: 'RESUME',
            home: 'Back to top',
            openMenu: 'Open menu',
            closeMenu: 'Close menu',
            toggleLanguage: 'View in Spanish',
        },
        progress: {
            label: 'Section navigation',
            items: [
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'Profile' },
                { id: 'experience', label: 'Experience' },
                { id: 'skills', label: 'Skills' },
                { id: 'projects', label: 'Projects' },
                { id: 'contact', label: 'Contact' },
            ],
        },
        cvPage: {
            eyebrow: 'Resume',
            title: 'Professional CV',
            description: 'This document updates automatically based on the selected site language.',
            openPdf: 'Open PDF',
            fallback: 'If the viewer does not load correctly, open the PDF in a new tab.',
            loading: 'Loading PDF...',
            missingPdf: 'The English PDF is not available yet. Add the public/cv/cv-en.pdf file.',
        },
        hero: {
            greeting: 'Hi,',
            namePrefix: "I'm",
            tagline: (
                <>
                    <p>Engineer, Creative, Self-taught, explorer of ideas... <br /> and frailejones 🌿.</p>
                    <p>I use technology, creativity, my analytical skills and a passionate approach to challenges to help create and sustain a world with values, dreams and awareness.</p>
                    <p>I enjoy appreciating, contributing to and advancing the power of knowledge and our species' capabilities to transform our reality.</p>
                </>
            ),
            viewProjects: 'VIEW PROJECTS',
            contact: 'GET IN TOUCH',
        },
        about: {
            intro: <>
                I am a <span className="text-white font-bold">Mechanical Engineer</span> and have directed my professional career toward two main areas.
            </>,
            areas: [
                {
                    number: '01',
                    title: 'Engineering and applied research',
                    content: <>The first is active involvement in <span className="text-neon-cyan">applied research</span>, particularly in energy, climate change, data analysis and systems modelling.</>,
                },
                {
                    number: '02',
                    title: 'Software and artificial intelligence',
                    content: <>The second is the development of complex software to solve engineering problems and build technology products. In this area, I implement technologies related to data analysis and management, software development and the creation of <span className="text-neon-magenta font-bold">AI First</span> projects, including agent programming, machine learning architecture design, process automation and systems integration.</>,
                },
            ],
            details: [
                {
                    eyebrow: 'Recent work',
                    title: 'Products with real-world application',
                    content: <>My complementary training includes artificial intelligence, machine learning, data analysis and software engineering. My recent work includes two main projects: <span className="text-white font-semibold">SatEmis</span>, a platform focused on climate research, satellite data analysis and the large-scale application of machine learning models; and <span className="text-white font-semibold">OrionAtiende.com</span>, a SaaS platform for the tailored implementation of specialised sales and customer support agents, aimed at companies with intensive customer service and user-management needs. Both projects can be explored in greater detail in the projects section.</>,
                },
                {
                    eyebrow: 'Consulting',
                    title: 'Mechanical engineering',
                    content: <>As a professional, I also provide mechanical engineering consulting services, with an emphasis on thermal and fluid-related fields. My work includes renewable energy, energy modelling, computational fluid dynamics (<span className="text-neon-green font-mono">CFD</span>), climate change mitigation, emissions inventory development and remote monitoring.</>,
                },
                {
                    eyebrow: 'Technical leadership',
                    title: 'Integrated solutions',
                    content: <>In software, I work as a lead engineer in the design and development of projects. I have nearly four years of certified experience and specialise in building solutions that integrate data, artificial intelligence, software and applied engineering.</>,
                },
            ],
            photo: {
                label: 'Professional portrait',
            },
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
