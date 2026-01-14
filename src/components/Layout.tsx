import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-dark-bg text-white selection:bg-neon-cyan selection:text-black">
            <Navbar />
            <main className="relative z-10">
                {children}
            </main>
            <footer className="py-8 text-center text-gray-500 text-sm glass-panel border-t border-white/5 mt-20">
                <p>© {new Date().getFullYear()} Hernan Dario Mojica Diaz. Built with React & Three.js.</p>
            </footer>
        </div>
    );
};

export default Layout;
