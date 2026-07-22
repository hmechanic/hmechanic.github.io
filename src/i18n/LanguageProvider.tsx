import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { LANGUAGES, type Language } from './types';
import { translations } from './locales';
import { I18nContext, type I18nContextValue } from './context';
import { cvByLang } from '@/lib/cv';

const STORAGE_KEY = 'lang';

const isLanguage = (value: string | null): value is Language =>
  value != null && (LANGUAGES as string[]).includes(value);

/** Pick the initial language from a previous choice, then the browser, then Spanish. */
const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'es';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLanguage(stored)) return stored;
  return window.navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang: setLangState,
      toggleLang: () => setLangState((prev) => (prev === 'es' ? 'en' : 'es')),
      t: translations[lang],
      cv: cvByLang[lang],
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
