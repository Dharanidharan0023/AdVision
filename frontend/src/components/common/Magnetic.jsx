import { useRef, useState } from 'react'
import { motion } from 'framer-motion';

export default function Magnetic({ children }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2)
        const middleY = clientY - (top + height / 2)
        setPosition({ x: middleX * 0.3, y: middleY * 0.3 })
    }

    const reset = () => {
        setPosition({ x: 0, y: 0 })
    }

    const { x, y } = position;

    return (
        <div className="relative group">
            <motion.div
                style={{ position: "relative", zIndex: 10 }}
                ref={ref}
                onMouseMove={handleMouse}
                onMouseLeave={reset}
                animate={{ x, y }}
                transition={{ type: "spring", stiffness: 180, damping: 20, mass: 0.1 }}
            >
                {children}
            </motion.div>
            
            {/* Ghost Element for extra depth */}
            <motion.div
                className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-20 blur-xl bg-neon-cyan rounded-full transition-opacity duration-500"
                animate={{ x: x * 0.5, y: y * 0.5 }}
                transition={{ type: "spring", stiffness: 100, damping: 30, mass: 0.5 }}
            />
        </div>
    )
}
