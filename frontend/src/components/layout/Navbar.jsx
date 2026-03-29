import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Magnetic from './common/Magnetic';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { scrollY } = useScroll();

    // Smooth transform springs
    const springConfig = { stiffness: 100, damping: 30 };
    const scrollYSpring = useSpring(scrollY, springConfig);

    const width = useTransform(scrollYSpring, [0, 100], ["100%", "90%"]);
    const top = useTransform(scrollYSpring, [0, 100], ["0px", "24px"]);
    const borderRadius = useTransform(scrollYSpring, [0, 100], ["0px", "100px"]);
    const backdropBlur = useTransform(scrollYSpring, [0, 100], ["0px", "40px"]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Posts', path: '/posts' },
        { name: 'Projects', path: '/projects' },
        { name: 'Stories', path: '/stories' },
        { name: 'About', path: '/about' },
    ];

    return (
        <motion.nav 
            style={{ 
                width, 
                top, 
                borderRadius,
                backdropFilter: scrolled ? `blur(${backdropBlur})` : 'none'
            }}
            className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 max-w-7xl px-10 ${
                scrolled ? 'glass-pill py-4 border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]' : 'bg-transparent py-10 border-transparent'
            }`}
        >
            <div className="mesh-overlay opacity-10 pointer-events-none" />
            <div className="flex justify-between items-center relative">
                <Link 
                    to="/" 
                    className="group flex items-center gap-3 z-50 text-white"
                    data-cursor="HOME"
                >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:bg-neon-indigo transition-all duration-500 group-hover:rotate-[360deg]">
                        <span className="text-black font-black text-sm">AV</span>
                    </div>
                    <div className="flex flex-col -gap-1 text-left">
                        <span className="text-xl font-black tracking-tighter uppercase leading-none">
                            Studio
                        </span>
                        <span className="text-[8px] font-bold text-neon-indigo uppercase tracking-[0.5em] opacity-0 group-hover:opacity-100 transition-opacity">
                            Visionary
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2">
                    {navLinks.map((link) => (
                        <NavLink key={link.path} to={link.path} active={location.pathname === link.path}>
                            {link.name}
                        </NavLink>
                    ))}
                    
                    <div className="w-px h-6 bg-white/10 mx-6" />
                    
                    <Magnetic>
                        <Link 
                            to="/admin" 
                            className="btn-primary !py-3 !px-6 flex items-center gap-2 text-[10px]"
                            data-cursor="ADMIN"
                        >
                            Admin <ArrowRight size={14} />
                        </Link>
                    </Magnetic>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden z-50 text-white p-3 hover:bg-white/5 rounded-full transition-colors"
                    data-cursor={isOpen ? "CLOSE" : "MENU"}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-4 top-24 bg-dark-bg/98 backdrop-blur-3xl md:hidden flex flex-col items-center justify-center gap-12 z-40 rounded-[4rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
                    >
                        <div className="mesh-overlay opacity-30" />
                        {navLinks.map((link, idx) => (
                            <motion.div
                                key={link.path}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                            >
                                <Link 
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-6xl font-black tracking-tighter transition-all hover:scale-110 active:scale-90 ${
                                        location.pathname === link.path ? 'text-neon-indigo' : 'text-white/20 hover:text-white'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link 
        to={to} 
        className={`relative px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 rounded-full group ${
            active ? 'text-white' : 'text-white/40 hover:text-white'
        }`}
        data-cursor={children.toUpperCase()}
    >
        <span className="relative z-10 group-hover:scale-110 inline-block transition-transform">{children}</span>
        {active && (
            <motion.div
                layoutId="nav-active"
                className="absolute inset-0 bg-neon-indigo/10 border border-neon-indigo/20 rounded-full -z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
        )}
    </Link>
);


export default Navbar;

