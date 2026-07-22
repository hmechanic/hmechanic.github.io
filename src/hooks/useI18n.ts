import { useContext } from 'react';
import { I18nContext, type I18nContextValue } from '@/i18n/context';

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within a LanguageProvider');
  return ctx;
};
