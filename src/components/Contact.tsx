import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Contact = () => {
    const phoneNumber = "573227325656";
    const message = encodeURIComponent("Hola Hernán, vi tu portafolio y me gustaría contactarte...");

    return (
        <section id="contact" className="py-24 px-6 text-center relative">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    <p className="text-neon-cyan font-mono mb-4">¿Que sigue?</p>
                    <h2 className="text-5xl font-bold text-white mb-6">Contáctame</h2>
                    <p className="text-gray-400 text-lg mb-12">
                        Actualmente estoy abierto a nuevas oportunidades. Ya sea que tengas una pregunta o simplemente quieras saludar, ¡haré todo lo posible por responderte!
                    </p>

                    <a
                        href={`https://wa.me/${phoneNumber}?text=${message}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-10 py-4 border-2 border-neon-cyan text-neon-cyan font-bold rounded hover:bg-neon-cyan/10 transition-all shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                    >
                        Conversar en WhatsApp
                    </a>

                    <div className="mt-16 flex justify-center gap-8 md:hidden">
                        {/* Only show on mobile as desktop has them in navbar */}
                        <a href="https://github.com/hmechanic" className="text-gray-400 hover:text-white"><FaGithub size={24} /></a>
                        <a href="https://linkedin.com/in/hmechanic" className="text-gray-400 hover:text-white"><FaLinkedin size={24} /></a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
