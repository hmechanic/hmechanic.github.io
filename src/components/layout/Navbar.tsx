import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router';
import { useI18n } from '@/hooks/useI18n';
import LanguageToggle from './LanguageToggle';
import SocialLinks from './SocialLinks';
import CvNavLink from './CvNavLink';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { t, cv } = useI18n();
  const isCvPage = pathname.replace(/\/$/, '') === '/cv';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu with Escape, and when the viewport grows past lg
  // (the menu is lg:hidden, so it would otherwise reopen stale on shrinking).
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    const lg = window.matchMedia('(min-width: 1024px)');
    const onResize = () => lg.matches && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    lg.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      lg.removeEventListener('change', onResize);
    };
  }, [isOpen]);

  const socials = cv.subheading.find((s) => s.type === 'socials')?.content || [];
  const email = cv.subheading.find((s) => s.type === 'links')?.content[0]?.name;
  const getSectionHref = (id: string) => `/#${id}`;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled || isOpen ? 'bg-dark-bg/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent border-b border-transparent py-6'}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))]">
        <Link
          to="/"
          aria-label={t.nav.home}
          className="text-2xl font-bold tracking-tighter text-neon-cyan"
        >
          H<span className="text-white">Mechanic</span>
        </Link>

        {/* Desktop Menu (from lg: the full menu does not fit on tablets / landscape phones) */}
        <div className="hidden lg:flex items-center space-x-8">
          {t.nav.items.map((item) => (
            <Link
              key={item.id}
              to={getSectionHref(item.id)}
              className="text-gray-300 hover:text-neon-cyan transition-colors text-sm uppercase tracking-wider"
            >
              {item.label}
            </Link>
          ))}

          <CvNavLink
            isCvPage={isCvPage}
            wrapperClassName="text-sm"
            linkClassName="transition-colors"
          />

          <div className="flex items-center space-x-4 ml-6 border-l border-white/20 pl-6">
            <SocialLinks socials={socials} email={email} size={20} />
            <LanguageToggle />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <LanguageToggle />
          <button
            type="button"
            aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="text-white bg-transparent border-0 p-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/10 py-6 pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] flex flex-col space-y-6"
        >
          {t.nav.items.map((item) => (
            <Link
              key={item.id}
              to={getSectionHref(item.id)}
              onClick={() => setIsOpen(false)}
              className="text-xl text-white hover:text-neon-cyan"
            >
              {item.label}
            </Link>
          ))}

          <CvNavLink isCvPage={isCvPage} onClick={() => setIsOpen(false)} linkClassName="text-xl" />

          <div className="flex items-center gap-6 pt-4 border-t border-white/10">
            <SocialLinks socials={socials} email={email} size={22} />
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
