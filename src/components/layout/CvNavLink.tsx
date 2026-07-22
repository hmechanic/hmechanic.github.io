import { motion, useReducedMotion } from 'framer-motion';
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
 * navbar and the mobile menu. The pulse honours `prefers-reduced-motion`.
 */
const CvNavLink = ({
  isCvPage,
  onClick,
  wrapperClassName = '',
  linkClassName = '',
}: CvNavLinkProps) => {
  const { t } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const animate = shouldReduceMotion
    ? {}
    : {
        scale: [1, 1.08, 1],
        textShadow: ['0 0 5px #00f3ff', '0 0 16px #00f3ff, 0 0 24px #ff00ff', '0 0 5px #00f3ff'],
      };

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
        <motion.span
          animate={animate}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {t.nav.cv}
        </motion.span>
      </Link>
      <span className="text-white/40" aria-hidden="true">
        |
      </span>
    </div>
  );
};

export default CvNavLink;
