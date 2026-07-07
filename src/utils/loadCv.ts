import yaml from 'js-yaml';
import cvEsRaw from '../assets/cv_es.yaml?raw';
import cvEnRaw from '../assets/cv_en.yaml?raw';

import { CvData } from '../types';
import type { Language } from '../i18n/translations';

// One parsed CV per supported language. Components pick the right one based on
// the active language from the i18n context.
export const cvByLang: Record<Language, CvData> = {
    es: yaml.load(cvEsRaw) as CvData,
    en: yaml.load(cvEnRaw) as CvData,
};

// Backwards-compatible default (Spanish) for any non-localized usage.
export const cvData = cvByLang.es;
