import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Web3Landing = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black font-['General_Sans'] text-white">
            {/* Fullscreen Video Background */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
            >
                <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4" type="video/mp4" />
            </video>

            {/* readable overlay */}
            <div className="absolute inset-0 bg-black/50 z-10" />

            {/* Content Layer */}
            <div className="relative z-20 flex flex-col min-h-screen">
                
                {/* Navbar */}
                <nav className="flex w-full items-center justify-between px-6 md:px-[120px] py-[20px]">
                    <div className="flex items-center gap-[30px]">
                        {/* Logo Placeholder - 187x25 as specified */}
                        <div className="w-[187px] h-[25px] flex items-center">
                            <span className="font-bold text-lg tracking-tighter text-white uppercase italic">Logoipsum</span>
                        </div>

                        {/* Nav Links - 30px gap, hidden on mobile */}
                        <div className="hidden md:flex items-center gap-[30px]">
                            {["Get Started", "Developers", "Features", "Resources"].map((item) => (
                                <button key={item} className="flex items-center gap-[14px] text-[14px] font-medium text-white hover:text-white/80 transition-colors group">
                                    {item}
                                    <ChevronDown size={14} className="text-white" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navbar CTA */}
                    <LayeredPill variant="black">
                        Join Waitlist
                    </LayeredPill>
                </nav>

                {/* Hero Content */}
                <main className="flex-1 flex flex-col items-center pt-[200px] md:pt-[280px] pb-[102px] text-center px-6">
                    <div className="flex flex-col items-center gap-[40px] max-w-4xl mx-auto">
                        
                        {/* Badge Pill */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20"
                        >
                            <div className="w-1 h-1 rounded-full bg-white" />
                            <span className="text-[13px] font-medium leading-none">
                                <span className="text-white/60">Early access available from</span>{" "}
                                <span className="text-white">May 1, 2026</span>
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <div className="space-y-6 flex flex-col items-center">
                            <motion.h1 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="max-w-[613px] text-[36px] md:text-[56px] font-medium leading-[1.28] tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-black/0"
                                style={{ 
                                    backgroundImage: 'linear-gradient(144.5deg, #ffffff 28%, rgba(0,0,0,0) 115%)' 
                                }}
                            >
                                Web3 at the Speed of Experience
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="max-w-[680px] text-[15px] leading-relaxed text-white/70 font-normal"
                            >
                                Powering seamless experiences and real-time connections, EOS is the base for creators who move with purpose, leveraging resilience, speed, and scale to shape the future.
                            </motion.p>
                        </div>

                        {/* Hero CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <LayeredPill variant="white">
                                Join Waitlist
                            </LayeredPill>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

/* 
  Layered Pill Button Component
*/
const LayeredPill = ({ children, variant = "black" }) => {
    const isBlack = variant === "black";

    return (
        <div className="relative group cursor-pointer inline-block">
            {/* Outer Layer with 0.6px border */}
            <div className={`relative rounded-full border-[0.6px] border-white transition-all duration-500 overflow-hidden ${isBlack ? 'p-[0px]' : 'p-[0px]'}`}>
                
                {/* Glow Streak (Top Edge) - Specified subtle white glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[8px] bg-white opacity-20 blur-[5px] z-30 pointer-events-none" />
                
                {/* Inner Pill */}
                <div 
                    className={`
                        rounded-full px-[29px] py-[11px] font-medium text-[14px] flex items-center justify-center relative z-20 transition-all duration-300
                        ${isBlack ? 'bg-black text-white hover:bg-white/5' : 'bg-white text-black hover:bg-white/90'}
                    `}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Web3Landing;
