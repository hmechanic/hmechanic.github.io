import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import type { SubheadingItem } from '@/types/cv';

type SocialLinksProps = {
  socials: SubheadingItem[];
  email?: string;
  /** Icon size in px (desktop navbar uses 20, mobile menu uses 22). */
  size: number;
};

/**
 * The GitHub / LinkedIn / email icon links, shared between the desktop navbar
 * and the mobile menu. Rendered as a fragment so each caller supplies its own
 * layout wrapper.
 */
const SocialLinks = ({ socials, email, size }: SocialLinksProps) => (
  <>
    {socials.map((social) => (
      <a
        key={social.url}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-neon-magenta transition-colors"
      >
        {social.type === 'github' && <FaGithub size={size} />}
        {social.type === 'linkedin' && <FaLinkedin size={size} />}
      </a>
    ))}
    {email && (
      <a href={`mailto:${email}`} className="text-white hover:text-neon-green transition-colors">
        <Mail size={size} />
      </a>
    )}
  </>
);

export default SocialLinks;
