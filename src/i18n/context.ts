import { createContext } from 'react';
import type { Language, Translation } from './types';
import type { CvData } from '@/types/cv';

export interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  /** UI strings for the active language. */
  t: Translation;
  /** Parsed CV data for the active language. */
  cv: CvData;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
