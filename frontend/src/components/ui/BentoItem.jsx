import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const BentoItem = ({ children, className = '', span = 'col-span-1', ...props }) => {
    const boxRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    // Smooth Tilt Physics
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        if (!boxRef.current) return;
        const rect = boxRef.current.getBoundingClientRect();
        
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);

        setMousePosition({ x: mouseX, y: mouseY });
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className={`gradient-border-mask ${span} h-full`}>
            <motion.div
                ref={boxRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.01 }}
                className={`bento-item h-full ${className} relative group perspective-1000`}
                style={{
                    '--mouse-x': `${mousePosition.x}px`,
                    '--mouse-y': `${mousePosition.y}px`,
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                {...props}
            >
                {/* Mesh Gradient Overlay */}
                <div className="mesh-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
                
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                
                {/* Inner Glow effect on hover */}
                <div 
                    className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-0 group-hover:opacity-100"
                    style={{
                        background: `radial-gradient(1000px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`
                    }}
                />
                
                <div className="relative z-10 w-full h-full" style={{ transform: "translateZ(60px)" }}>
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default BentoItem;


