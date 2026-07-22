import type { Translation } from '@/i18n/types';

export const es: Translation = {
  nav: {
    items: [
      { id: 'about', label: 'Sobre mí' },
      { id: 'projects', label: 'Proyectos' },
      { id: 'experience', label: 'Experiencia' },
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
      { id: 'projects', label: 'Proyectos' },
      { id: 'experience', label: 'Experiencia' },
      { id: 'skills', label: 'Habilidades' },
      { id: 'contact', label: 'Contacto' },
    ],
  },
  cvPage: {
    eyebrow: 'Currículum',
    title: 'CV profesional',
    description:
      'Este documento se actualiza automáticamente según el idioma seleccionado en el sitio.',
    openPdf: 'Abrir PDF',
    fallback: 'Si el visor no carga correctamente, abre el PDF en una nueva pestaña.',
    loading: 'Cargando PDF...',
    missingPdf:
      'El PDF en español no está disponible todavía. Agrega el archivo public/cv/cv-es.pdf.',
  },
  hero: {
    greeting: 'Bienvenido a mi espacio.',
    namePrefix: 'Soy',
    tagline: (
      <>
        <p>
          Ingeniero, Creativo, Autodidacto, explorador de ideas... <br /> y de frailejones 🌿.
        </p>
        <p>
          Utilizo tecnología, creatividad, mis capacidades análiticas y la forma apasionada de
          enfrentarme a los retos para aportar a crear y mantener un mundo con valores y sueños y
          conciencia.
        </p>
        <p>
          Me gustá apreciar, aportar e impulsar al límite poder del conocimiento y las capacidades
          de nuestra especie para tranformar nuestra realidad.
        </p>
      </>
    ),
    viewProjects: 'VER PROYECTOS',
    contact: 'CONTACTAR',
  },
  about: {
    intro: (
      <>
        Soy <span className="text-white font-bold">ingeniero mecánico</span> y he orientado mi
        carrera profesional hacia dos áreas principales.
      </>
    ),
    areas: [
      {
        number: '01',
        title: 'Ingeniería e investigación aplicada',
        content: (
          <>
            La primera es la participación activa en{' '}
            <span className="text-neon-cyan">investigación aplicada</span>, especialmente en temas
            relacionados con energía, cambio climático, análisis de datos y modelación de sistemas.
          </>
        ),
      },
      {
        number: '02',
        title: 'Software e inteligencia artificial',
        content: (
          <>
            La segunda es el desarrollo de software complejo para resolver problemas de ingeniería y
            construir productos tecnológicos. En esta área implemento tecnologías relacionadas con
            el análisis y la gestión de datos, el desarrollo de software y la creación de proyectos{' '}
            <span className="text-neon-magenta font-bold">AI First</span>, incluyendo programación
            de agentes, diseño de arquitecturas de machine learning, automatización de procesos e
            integración de sistemas.
          </>
        ),
      },
    ],
    details: [
      {
        eyebrow: 'Trabajo reciente',
        title: 'Productos con aplicación real',
        content: (
          <>
            Mi formación complementaria incluye inteligencia artificial, machine learning, análisis
            de datos e ingeniería de software. Entre mis trabajos recientes se encuentran dos
            proyectos principales: <span className="text-white font-semibold">SatEmis</span>, una
            plataforma orientada a la investigación climática, el análisis de datos satelitales y la
            aplicación de modelos de machine learning a escala; y{' '}
            <span className="text-white font-semibold">OrionAtiende.com</span>, un SaaS para la
            implementación personalizada de agentes especializados en ventas y soporte al cliente,
            dirigido a empresas con necesidades intensivas de atención y gestión de usuarios. Ambos
            proyectos pueden explorarse con mayor detalle en la sección de proyectos.
          </>
        ),
      },
      {
        eyebrow: 'Consultoría',
        title: 'Ingeniería mecánica',
        content: (
          <>
            Como profesional, también presto servicios de consultoría en ingeniería mecánica, con
            énfasis en las áreas térmica y de fluidos. Mi trabajo incluye energías renovables,
            modelación energética, dinámica de fluidos computacional (
            <span className="text-neon-green font-mono">CFD</span>), mitigación del cambio
            climático, elaboración de inventarios de emisiones y monitoreo remoto.
          </>
        ),
      },
      {
        eyebrow: 'Liderazgo técnico',
        title: 'Soluciones integradas',
        content: (
          <>
            En el área de software, trabajo como ingeniero líder en el diseño y desarrollo de
            proyectos. Cuento con cerca de cuatro años de experiencia certificada y me especializo
            en la construcción de soluciones que integran datos, inteligencia artificial, software e
            ingeniería aplicada.
          </>
        ),
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
    title: 'Proyectos Destacados',
    descriptions: {
      'SatEmis Platform':
        'Plataforma de procesamiento de datos satelitales. Arquitectura de microservicios con NestJS y Docker, optimizada para Google Cloud Platform.',
      'Frontend SatEmis':
        'Interfaz de usuario para la visualización e interpretación de datos satelitales y gestión de la plataforma.',
      'Deep Learning Concepts':
        'Implementación de modelos de Deep Learning y redes neuronales desde cero o utilizando frameworks modernos.',
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
};
