import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
    const [cursorType, setCursorType] = useState('default');
    const [cursorText, setCursorText] = useState('');
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 30, stiffness: 200, mass: 0.6 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleHover = (e) => {
            const target = e.target.closest('[data-cursor], button, a, input, textarea, [role="button"]');
            
            if (target) {
                const customText = target.getAttribute('data-cursor');
                if (customText) {
                    setCursorType('custom');
                    setCursorText(customText);
                } else {
                    setCursorType('pointer');
                    setCursorText('');
                }
            } else {
                setCursorType('default');
                setCursorText('');
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleHover);
        
        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHover);
        };
    }, [cursorX, cursorY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] md:block hidden" style={{ position: 'fixed' }}>
            <motion.div
                className="fixed top-0 left-0 flex items-center justify-center rounded-full border border-neon-cyan/50 mix-blend-difference backdrop-blur-[2px] transition-all duration-300"
                style={{
                    position: 'fixed',
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: cursorType === 'custom' ? 80 : cursorType === 'pointer' ? 60 : 20,
                    height: cursorType === 'custom' ? 80 : cursorType === 'pointer' ? 60 : 20,
                    backgroundColor: cursorType === 'custom' ? 'rgba(0, 255, 255, 0.1)' : cursorType === 'pointer' ? 'rgba(255,255,255,0.05)' : 'transparent',
                    scale: cursorType === 'pointer' ? 1.5 : 1
                }}
            >
                <AnimatePresence>
                    {cursorText && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="text-[10px] font-black text-neon-cyan uppercase tracking-widest"
                        >
                            {cursorText}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
            
            <motion.div 
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-neon-cyan rounded-full shadow-[0_0_15px_rgba(0,255,255,1)]"
                style={{
                    position: 'fixed',
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />
        </div>
    );
};

export default CustomCursor;
