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
