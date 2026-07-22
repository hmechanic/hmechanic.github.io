import type { Translation } from '@/i18n/types';

export const en: Translation = {
  nav: {
    items: [
      { id: 'about', label: 'About' },
      { id: 'projects', label: 'Projects' },
      { id: 'experience', label: 'Experience' },
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
      { id: 'projects', label: 'Projects' },
      { id: 'experience', label: 'Experience' },
      { id: 'skills', label: 'Skills' },
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
        <p>
          Engineer, Creative, Self-taught, explorer of ideas... <br /> and frailejones 🌿.
        </p>
        <p>
          I use technology, creativity, my analytical skills and a passionate approach to challenges
          to help create and sustain a world with values, dreams and awareness.
        </p>
        <p>
          I enjoy appreciating, contributing to and advancing the power of knowledge and our
          species' capabilities to transform our reality.
        </p>
      </>
    ),
    viewProjects: 'VIEW PROJECTS',
    contact: 'GET IN TOUCH',
  },
  about: {
    intro: (
      <>
        I am a <span className="text-white font-bold">Mechanical Engineer</span> and have directed
        my professional career toward two main areas.
      </>
    ),
    areas: [
      {
        number: '01',
        title: 'Engineering and applied research',
        content: (
          <>
            The first is active involvement in{' '}
            <span className="text-neon-cyan">applied research</span>, particularly in energy,
            climate change, data analysis and systems modelling.
          </>
        ),
      },
      {
        number: '02',
        title: 'Software and artificial intelligence',
        content: (
          <>
            The second is the development of complex software to solve engineering problems and
            build technology products. In this area, I implement technologies related to data
            analysis and management, software development and the creation of{' '}
            <span className="text-neon-magenta font-bold">AI First</span> projects, including agent
            programming, machine learning architecture design, process automation and systems
            integration.
          </>
        ),
      },
    ],
    details: [
      {
        eyebrow: 'Recent work',
        title: 'Products with real-world application',
        content: (
          <>
            My complementary training includes artificial intelligence, machine learning, data
            analysis and software engineering. My recent work includes two main projects:{' '}
            <span className="text-white font-semibold">SatEmis</span>, a platform focused on climate
            research, satellite data analysis and the large-scale application of machine learning
            models; and <span className="text-white font-semibold">OrionAtiende.com</span>, a SaaS
            platform for the tailored implementation of specialised sales and customer support
            agents, aimed at companies with intensive customer service and user-management needs.
            Both projects can be explored in greater detail in the projects section.
          </>
        ),
      },
      {
        eyebrow: 'Consulting',
        title: 'Mechanical engineering',
        content: (
          <>
            As a professional, I also provide mechanical engineering consulting services, with an
            emphasis on thermal and fluid-related fields. My work includes renewable energy, energy
            modelling, computational fluid dynamics (
            <span className="text-neon-green font-mono">CFD</span>), climate change mitigation,
            emissions inventory development and remote monitoring.
          </>
        ),
      },
      {
        eyebrow: 'Technical leadership',
        title: 'Integrated solutions',
        content: (
          <>
            In software, I work as a lead engineer in the design and development of projects. I have
            nearly four years of certified experience and specialise in building solutions that
            integrate data, artificial intelligence, software and applied engineering.
          </>
        ),
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
    title: 'Featured Projects',
    descriptions: {
      'SatEmis Platform':
        'Satellite data processing platform. Microservice architecture with NestJS and Docker, optimized for Google Cloud Platform.',
      'Frontend SatEmis':
        'User interface for the visualization and interpretation of satellite data and platform management.',
      'Deep Learning Concepts':
        'Implementation of Deep Learning models and neural networks from scratch or using modern frameworks.',
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
};
