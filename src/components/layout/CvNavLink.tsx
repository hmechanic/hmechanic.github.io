import { Link } from 'react-router';
import { useI18n } from '@/hooks/useI18n';

type CvNavLinkProps = {
  isCvPage: boolean;
  onClick?: () => void;
  /** Extra classes for the outer wrapper (desktop adds `text-sm`). */
  wrapperClassName?: string;
  /** Extra classes for the link (desktop adds `transition-colors`, mobile `text-xl`). */
  linkClassName?: string;
};

/**
 * The pulsing `/cv` link with its `|` separators, shared between the desktop
 * navbar and the mobile menu. The pulse is a CSS animation (no JS per frame)
 * gated behind `motion-safe`, so it honours `prefers-reduced-motion`.
 */
const CvNavLink = ({
  isCvPage,
  onClick,
  wrapperClassName = '',
  linkClassName = '',
}: CvNavLinkProps) => {
  const { t } = useI18n();

  return (
    <div
      className={`flex items-center gap-3 font-mono uppercase tracking-wider ${wrapperClassName}`}
    >
      <span className="text-white/40" aria-hidden="true">
        |
      </span>
      <Link
        to="/cv"
        onClick={onClick}
        aria-current={isCvPage ? 'page' : undefined}
        className={`text-neon-cyan hover:text-white ${linkClassName}`}
      >
        <span className="motion-safe:animate-neon-pulse">{t.nav.cv}</span>
      </Link>
      <span className="text-white/40" aria-hidden="true">
        |
      </span>
    </div>
  );
};

export default CvNavLink;
