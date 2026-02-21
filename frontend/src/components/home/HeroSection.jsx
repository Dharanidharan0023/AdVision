import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Gradient / Image Placeholder */}
            <div className="absolute inset-0 bg-dark-bg">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-transparent to-neon-cyan/20 opacity-30"></div>
                {/* Optional: Add a subtle video background or animated mesh here later */}
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">Digital Experiences</span> <br />
                        & Future-Ready Tech
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
                        Join AdVision Studio on a journey through coding, creativity, and cutting-edge software development.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <button className="group relative px-8 py-4 bg-neon-purple text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(176,38,255,0.5)]">
                            <span className="relative z-10 flex items-center gap-2">
                                <Play fill="currentColor" size={20} /> Watch Latest Video
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>

                        <Link to="/projects" className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
                            View Projects <ArrowRight size={20} />
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-1.5 h-1.5 bg-neon-cyan rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
