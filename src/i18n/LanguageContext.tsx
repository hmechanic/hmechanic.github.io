import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { LANGUAGES, translations, type Language, type Translation } from './translations';
import { cvByLang } from '../utils/loadCv';
import type { CvData } from '../types';

interface I18nContextValue {
    lang: Language;
    setLang: (lang: Language) => void;
    toggleLang: () => void;
    /** UI strings for the active language. */
    t: Translation;
    /** Parsed CV data for the active language. */
    cv: CvData;
}

const STORAGE_KEY = 'lang';

const I18nContext = createContext<I18nContextValue | null>(null);

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

    const value = useMemo<I18nContextValue>(() => ({
        lang,
        setLang: setLangState,
        toggleLang: () => setLangState(prev => (prev === 'es' ? 'en' : 'es')),
        t: translations[lang],
        cv: cvByLang[lang],
    }), [lang]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = (): I18nContextValue => {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used within a LanguageProvider');
    return ctx;
};
