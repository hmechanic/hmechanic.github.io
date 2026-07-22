import { useI18n } from '@/hooks/useI18n';

const LanguageToggle = ({ className = '' }: { className?: string }) => {
  const { t, lang, toggleLang } = useI18n();
  return (
    <button
      type="button"
      aria-label={t.nav.toggleLanguage}
      onClick={toggleLang}
      className={`font-mono text-sm uppercase tracking-wider text-gray-300 hover:text-neon-cyan transition-colors bg-transparent border border-white/20 rounded px-2 py-1 ${className}`}
    >
      {lang === 'es' ? 'EN' : 'ES'}
    </button>
  );
};

export default LanguageToggle;
