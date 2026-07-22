import type { ReactNode } from 'react';
import { LanguageProvider } from '@/i18n';

/** Composes all app-wide context providers in one place. */
export const AppProviders = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);
