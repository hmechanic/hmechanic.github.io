import cvEs from '@/content/cv/cv-es.yaml';
import cvEn from '@/content/cv/cv-en.yaml';

import type { CvData } from '@/types/cv';
import type { Language } from '@/i18n/types';

// One CV per supported language, parsed at build time (see the yaml plugin in
// vite.config.ts). Components pick the right one from the i18n context.
export const cvByLang: Record<Language, CvData> = {
  es: cvEs as CvData,
  en: cvEn as CvData,
};
