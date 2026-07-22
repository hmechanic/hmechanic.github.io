import React from 'react';
import Navbar from './Navbar';
import SectionProgress from './SectionProgress';
import { useI18n } from '@/hooks/useI18n';
import { useHashScroll } from '@/hooks/useHashScroll';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useI18n();
  useHashScroll();
  return (
    <div className="min-h-screen bg-dark-bg text-white selection:bg-neon-cyan selection:text-black">
      <Navbar />
      <SectionProgress />
      <main className="relative z-10">{children}</main>
      <footer className="py-8 text-center text-gray-500 text-sm glass-panel border-t border-white/5 mt-20">
        <p>
          © {new Date().getFullYear()} Hernan Dario Mojica Diaz. {t.footer}
        </p>
      </footer>
    </div>
  );
};

export default Layout;
