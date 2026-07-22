import yaml from 'js-yaml';
import cvEsRaw from '@/content/cv/cv-es.yaml?raw';
import cvEnRaw from '@/content/cv/cv-en.yaml?raw';

import { CvData } from '@/types/cv';
import type { Language } from '@/i18n/types';

// One parsed CV per supported language. Components pick the right one based on
// the active language from the i18n context.
export const cvByLang: Record<Language, CvData> = {
  es: yaml.load(cvEsRaw) as CvData,
  en: yaml.load(cvEnRaw) as CvData,
};

// Backwards-compatible default (Spanish) for any non-localized usage.
export const cvData = cvByLang.es;
