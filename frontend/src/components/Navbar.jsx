import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo
} from 'react';

import { Link, useLocation } from 'react-router-dom';

import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
    useSpring
} from 'framer-motion';

import {
    Menu,
    X,
    Sparkles,
    Youtube
} from 'lucide-react';

import Magnetic from './common/Magnetic';
import { useSocial } from '../context/SocialContext';
import { useSite } from '../context/SiteContext';

/* =========================================================
   KEYBOARD NAVIGATION
========================================================= */

const useKeyboardNavigation = (itemsCount, isOpen, toggleMenu) => {
    const [focusIndex, setFocusIndex] = useState(-1);

    useEffect(() => {
        if (!isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFocusIndex(-1);
            return;
        }

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setFocusIndex((prev) =>
                        prev < itemsCount - 1 ? prev + 1 : 0
                    );
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    setFocusIndex((prev) =>
                        prev > 0 ? prev - 1 : itemsCount - 1
                    );
                    break;

                case 'Escape':
                    toggleMenu(false);
                    break;

                case 'Enter':
                case ' ':
                    if (focusIndex >= 0) {
                        e.preventDefault();
                        const element = document.querySelector(
                            `[data-nav-index="${focusIndex}"]`
                        );
                        element?.click();
                    }
                    break;

                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () =>
            document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, itemsCount, focusIndex, toggleMenu]);

    return focusIndex;
};

/* =========================================================
   SCROLL ANIMATION
========================================================= */

const useScrollAnimation = () => {
    const { scrollY } = useScroll();

    const springConfig = useMemo(
        () => ({
            stiffness: 120,
            damping: 28,
            mass: 0.4
        }),
        []
    );

    const scrollYSpring = useSpring(scrollY, springConfig);

    const width = useTransform(scrollYSpring, [0, 120], ['100%', '92%']);
    const top = useTransform(scrollYSpring, [0, 120], ['0px', '18px']);
    const borderRadius = useTransform(scrollYSpring, [0, 120], ['0px', '40px']);
    const backdropBlur = useTransform(scrollYSpring, [0, 120], ['0px', '24px']);
    const scale = useTransform(scrollYSpring, [0, 120], [1, 0.985]);
    const shadow = useTransform(
        scrollYSpring,
        [0, 120],
        ['0 0 0 rgba(0,0,0,0)', '0 20px 80px rgba(0,0,0,0.55)']
    );

    return { width, top, borderRadius, backdropBlur, scale, shadow };
};

/* =========================================================
   NAV LINK
========================================================= */

const NavLink = ({ to, children, isActive, onHover, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const linkRef = useRef(null);

    return (
        <Link
            ref={linkRef}
            to={to}
            data-nav-index={index}
            className="relative px-6 py-3 rounded-full overflow-hidden group"
            onMouseEnter={() => {
                setIsHovered(true);
                onHover?.(to, linkRef);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                onHover?.(null, null);
            }}
        >
            {/* Active background */}
            {isActive && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-400/20 rounded-full backdrop-blur-md"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
            )}

            {/* Glow */}
            <motion.div
                className="absolute inset-0 rounded-full bg-white/5"
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.25 }}
            />

            {/* Text */}
            <motion.span
                className={`relative z-10 text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-extrabold transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/45 group-hover:text-white'
                    }`}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
            >
                {children}
            </motion.span>
        </Link>
    );
};

/* =========================================================
   FLOATING PARTICLE
========================================================= */

const FloatingParticle = ({ delay, duration, x, y }) => (
    <motion.div
        className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0, 0.7, 0],
            scale: [0, 1, 0],
            x: [0, x],
            y: [0, y]
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
        }}
    />
);

/* =========================================================
   NAVBAR
========================================================= */

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const location = useLocation();
    
    const { getPrimaryLink, loading } = useSocial();
    const { siteSettings } = useSite();
    const primaryYoutube = getPrimaryLink('youtube');

    const { width, top, borderRadius, backdropBlur, scale, shadow } =
        useScrollAnimation();

    const navLinks = useMemo(
        () => [
            { name: 'Home', path: '/' },
            { name: 'Posts', path: '/posts' },
            { name: 'Projects', path: '/projects' },
            { name: 'Contact', path: '/contact' },
            { name: 'About', path: '/about' }
        ],
        []
    );

    useKeyboardNavigation(navLinks.length, isOpen, setIsOpen);

    /* =========================================================
       SCROLL STATE
    ========================================================= */

    const handleScroll = useCallback(() => {
        requestAnimationFrame(() => {
            setScrolled(window.scrollY > 40);
        });
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    /* =========================================================
       CLOSE MENU ON ROUTE CHANGE
    ========================================================= */

    useEffect(() => {
        // eslint-disable-next-line
        setIsOpen(false);
    }, [location.pathname]);

    /* =========================================================
       BODY LOCK
    ========================================================= */

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);



    /* =========================================================
       PARTICLES
    ========================================================= */

    const [particles] = useState(() =>
        Array.from({ length: 7 }, (_, i) => ({
            id: i,
            delay: Math.random() * 2,
            duration: Math.random() * 3 + 3,
            x: (Math.random() - 0.5) * 140,
            y: (Math.random() - 0.5) * 140
        }))
    );

    return (
        <>
            {/* =========================================================
                NAVBAR
            ========================================================= */}

            <motion.nav
                style={{
                    width,
                    top,
                    scale,
                    boxShadow: shadow,
                    borderRadius
                }}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className="fixed inset-x-0 z-[100] mx-auto max-w-7xl"
            >
                <motion.div
                    className={`relative px-6 md:px-8 py-4 transition-all duration-700 ${scrolled
                            ? 'bg-[#050816]/70 border border-white/[0.08]'
                            : 'bg-transparent'
                        }`}
                    style={{
                        backdropFilter: `blur(${backdropBlur})`,
                        borderRadius
                    }}
                >
                    {/* Background glow */}
                    <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-cyan-500/[0.03] via-indigo-500/[0.03] to-purple-500/[0.03]" />

                    {/* Particles */}
                    {scrolled &&
                        particles.map((particle) => (
                            <FloatingParticle key={particle.id} {...particle} />
                        ))}

                    <div className="relative z-10 flex items-center justify-between">
                        {/* =========================================================
                            LOGO
                        ========================================================= */}

                        <Link
                            to="/admin"
                            className="group relative flex items-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                className="relative"
                            >
                                {/* Glow */}
                                <div className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-cyan-400/20" />

                                {/* Brand */}
                                <motion.h1
                                    animate={{
                                        textShadow: [
                                            '0 0 10px rgba(34,211,238,0.3)',
                                            '0 0 30px rgba(34,211,238,0.8)',
                                            '0 0 10px rgba(34,211,238,0.3)'
                                        ]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="relative text-[26px] md:text-[30px] font-black tracking-[0.2em] uppercase leading-none text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                                    style={{ fontFamily: "'Oxanium', sans-serif" }}
                                >
                                    {siteSettings?.websiteName || 'Nexus AV'}
                                </motion.h1>

                                {/* Animated underline */}
                                <motion.div
                                    className="h-[2px] mt-1 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"
                                    initial={{ width: '0%' }}
                                    whileHover={{ width: '100%' }}
                                    transition={{ duration: 0.4 }}
                                />
                            </motion.div>

                            {/* Sparkle */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                className="absolute -right-5 -top-1"
                            >
                                <Sparkles size={14} className="text-cyan-300" />
                            </motion.div>
                        </Link>

                        {/* =========================================================
                            DESKTOP NAV
                        ========================================================= */}

                        <div className="hidden md:flex items-center gap-2">
                            {navLinks.map((link, index) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    index={index}
                                    isActive={location.pathname === link.path}
                                >
                                    {link.name}
                                </NavLink>
                            ))}

                            {/* Divider */}
                            <div className="mx-4 h-7 w-px bg-white/10" />

                            {/* YouTube */}
                            {(!loading && primaryYoutube) && (
                                <Magnetic>
                                    <motion.a
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.92 }}
                                        href={primaryYoutube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Visit YouTube Channel"
                                        className="p-3 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-red-500/10 hover:text-[#ff0000] hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all text-white/70 flex items-center justify-center"
                                    >
                                        <Youtube size={16} />
                                    </motion.a>
                                </Magnetic>
                            )}

                        </div>

                        {/* =========================================================
                            MOBILE BUTTON
                        ========================================================= */}

                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle Menu"
                            className="md:hidden p-3 rounded-full bg-white/[0.04] border border-white/[0.08] text-white relative z-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                    >
                                        <X size={24} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                    >
                                        <Menu size={24} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </motion.div>
            </motion.nav>

            {/* =========================================================
                MOBILE MENU
            ========================================================= */}

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-md md:hidden z-40"
                            onClick={() => setIsOpen(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 100,
                                    damping: 18
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="
                                    absolute
                                    inset-4
                                    top-20
                                    bottom-4
                                    rounded-[2rem]
                                    sm:rounded-[3rem]
                                    overflow-y-auto
                                    border
                                    border-white/[0.08]
                                    bg-[#050816]/95
                                    backdrop-blur-3xl
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-6
                                    sm:gap-10
                                    py-10
                                "
                            >
                                {/* Background glow */}
                                <motion.div
                                    animate={{
                                        background: [
                                            'radial-gradient(circle at 20% 20%, rgba(34,211,238,0.2), transparent 40%)',
                                            'radial-gradient(circle at 80% 40%, rgba(99,102,241,0.2), transparent 40%)',
                                            'radial-gradient(circle at 50% 80%, rgba(168,85,247,0.2), transparent 40%)'
                                        ]
                                    }}
                                    transition={{ duration: 8, repeat: Infinity }}
                                    className="absolute inset-0"
                                />

                                {/* Menu Links */}
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.path}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                    >
                                        <Link
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`
                                                relative
                                                text-4xl
                                                sm:text-5xl
                                                font-black
                                                tracking-tight
                                                transition-all
                                                duration-300
                                                ${location.pathname === link.path
                                                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300'
                                                    : 'text-white/35 hover:text-white'
                                                }
                                            `}
                                            style={{ fontFamily: "'Orbitron', sans-serif" }}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
        </>
    );
};

export default React.memo(Navbar);