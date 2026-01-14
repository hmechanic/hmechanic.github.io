import { useState, useEffect } from 'react';
import { Menu, X, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { cvData } from '../utils/loadCv';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const socials = cvData.subheading.find(s => s.type === 'socials')?.content || [];
    const email = cvData.subheading.find(s => s.type === 'links')?.content[0]?.name;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <div className="text-2xl font-bold tracking-tighter text-neon-cyan cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                    H<span className="text-white">Mechanic</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {['About', 'Experience', 'Projects', 'Contact'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-neon-cyan transition-colors text-sm uppercase tracking-wider">
                            {item}
                        </a>
                    ))}

                    <div className="flex items-center space-x-4 ml-6 border-l border-white/20 pl-6">
                        {socials.map((social) => (
                            <a key={social.url} href={social.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-neon-magenta transition-colors">
                                {social.type === 'github' && <FaGithub size={20} />}
                                {social.type === 'linkedin' && <FaLinkedin size={20} />}
                            </a>
                        ))}
                        {email && (
                            <a href={`mailto:${email}`} className="text-white hover:text-neon-green transition-colors">
                                <Mail size={20} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col space-y-6"
                >
                    {['About', 'Experience', 'Projects', 'Contact'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-xl text-white hover:text-neon-cyan">
                            {item}
                        </a>
                    ))}
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
