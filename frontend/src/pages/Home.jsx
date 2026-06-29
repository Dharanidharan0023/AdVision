import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import DOMPurify from 'dompurify';
import profileImg from "../assets/profile.webp";
import ytThumb from "../assets/YT1.webp";
import api from "../api/axios";
import Magnetic from "../components/common/Magnetic";


import {
    Play,
    Youtube,
    Instagram,
    Twitter,
    Sparkles,
    ArrowRight,
    ChevronDown,
} from "lucide-react";

const FeaturedVideoCard = ({ video, stripHtml }) => {
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
            }}
            whileHover={{ scale: 1.02 }}
            className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md hover:border-cyan-500/30 transition-colors duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(0,255,255,0.1)] relative"
        >
            {/* Glow Effect */}
            <motion.div
                className="absolute inset-0 z-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"
            />
            
            {/* Glossy Sweep Effect */}
            <div className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none z-20" />
            
            <div className="relative aspect-video overflow-hidden bg-gray-900 z-10" style={{ transform: "translateZ(30px)" }}>
                <img
                    src={video?.imageUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600'}
                    alt={video?.title ?? 'Featured video'}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                {video?.videoUrl && (
                    <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.5)]"
                        >
                            <Play fill="white" />
                        </motion.div>
                    </a>
                )}
            </div>
            <div className="p-6 relative z-10" style={{ transform: "translateZ(20px)" }}>
                <h3 className="text-2xl font-black mb-3 group-hover:text-cyan-400 transition line-clamp-2">
                    {video?.title ?? 'Loading...'}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-3">
                    {video?.content ? stripHtml(video.content) : 'Featured content from the studio.'}
                </p>
            </div>
        </motion.div>
    );
};

const Home = () => {
    const containerRef = useRef(null);
    const [heroData, setHeroData] = useState({
        title: 'DHARANIX <span class="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">Beyond Your vision</span>',
        subtitle: 'Creative storytelling through vision.'
    });
    const [branding] = useState('DHARANIDHARAN\'S UNIVERSE');
    const [statsData, setStatsData] = useState([
        { label: 'Subscribers', value: '1.09K+' },
        { label: 'Videos', value: '105' },
        { label: 'Views', value: '274K+' }
    ]);
    const [featuredVideos, setFeaturedVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    useEffect(() => {
        const fetchHomeContent = async () => {
            setLoading(true);
            try {
                const [heroRes, statsRes, videosRes] = await Promise.allSettled([
                    api.get('/public/home-section/hero'),
                    api.get('/public/home-section/stats'),
                    api.get('/public/featured-posts?limit=3')
                ]);

                if (heroRes.status === 'fulfilled' && heroRes.value.data) {
                    setHeroData(parseContent(heroRes.value.data.content, heroData));
                }

                if (statsRes.status === 'fulfilled' && statsRes.value.data) {
                    const statsContent = parseContent(statsRes.value.data.content, []);
                    if (Array.isArray(statsContent)) {
                        setStatsData(statsContent);
                    }
                }

                if (videosRes.status === 'fulfilled' && Array.isArray(videosRes.value.data)) {
                    setFeaturedVideos(videosRes.value.data);
                }
            } catch (err) {
                console.error('Error loading homepage content:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const parseContent = (content, fallback) => {
        if (content === undefined || content === null) return fallback;
        if (typeof content === 'string') {
            try {
                return JSON.parse(content);
            } catch {
                return content;
            }
        }
        return content;
    };

    const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const heroTitleMarkup = { __html: DOMPurify.sanitize(heroData.title || '') };

    return (
        <div
            ref={containerRef}
            className="bg-[#050816] min-h-screen text-white overflow-hidden relative"
        >
            <SEO 
                title="Home"
                description={heroData.subtitle || "Premium video production and digital experiences"}
                url="/"
                structuredData={{
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "WebSite",
                            "name": "AdVision Studio",
                            "url": "https://advisionstudio.com/",
                            "description": "Premium video production and digital experiences."
                        },
                        {
                            "@type": "Organization",
                            "name": "AdVision Studio",
                            "url": "https://advisionstudio.com/",
                            "logo": "https://advisionstudio.com/vite.svg"
                        }
                    ]
                }}
            />
            {/* Base ambient lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#050816] to-[#050816] pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse -z-10" />

            <div className="absolute inset-0 opacity-20 -z-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="absolute inset-0 overflow-hidden -z-10">
                {Array.from({ length: 25 }).map((_, index) => (
                    <motion.div
                        key={index}
                        animate={{
                            y: [0, -50, 0],
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.8, 1],
                        }}
                        transition={{
                            duration: 4 + index,
                            repeat: Infinity,
                        }}
                        className="absolute w-1 h-1 bg-cyan-300 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            <section className="relative min-h-screen flex items-center px-6 lg:px-12 max-w-7xl mx-auto pt-24 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full mt-10 lg:mt-0">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                        }}
                    >
                        <motion.h1 variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight uppercase mb-6 mt-5" dangerouslySetInnerHTML={heroTitleMarkup} />

                        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-lg md:text-xl text-cyan-400 tracking-[0.3em] uppercase font-black mb-6">
                            {branding}
                        </motion.p>

                        <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-xl md:text-2xl text-gray-300 tracking-[0.3em] uppercase mb-6">
                            {heroData.subtitle}
                        </motion.h2>

                        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-gray-400 text-lg leading-relaxed max-w-xl mb-10">
                            Discover cinematic storytelling, video craftsmanship, and immersive creative experiences built for modern audiences.
                        </motion.p>

                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                            {statsData.map((item, index) => (
                                <motion.div 
                                    whileHover={{ y: -5 }} 
                                    key={index} 
                                    className="relative overflow-hidden bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur-md shadow-lg group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <p className="text-3xl font-black text-white mb-2 relative z-10">{item.value}</p>
                                    <p className="text-sm uppercase tracking-[0.25em] text-gray-400 relative z-10">{item.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-wrap gap-5">
                            <Magnetic>
                                <motion.a
                                    href="https://youtube.com/@dharanixstudio?si=YuoczrWD_6GTHqPo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,255,255,0.5)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-cyan-400 text-black font-bold py-4 px-8 rounded-full uppercase tracking-widest flex items-center gap-3"
                                >
                                    <Youtube size={20} /> Watch Videos
                                </motion.a>
                            </Magnetic>
                            <Magnetic>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="border border-white/20 backdrop-blur-md py-4 px-8 rounded-full uppercase tracking-widest flex items-center gap-3 relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center gap-3">Explore More <ArrowRight size={18} /></span>
                                    <div className="absolute inset-0 bg-white/10 -translate-x-[150%] skew-x-12 group-hover:translate-x-[150%] transition-transform duration-700 ease-out" />
                                </motion.button>
                            </Magnetic>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        style={{ y: heroY }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative flex items-center justify-center h-[650px] perspective-1000"
                    >
                        <motion.div
                            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                            className="absolute w-[280px] sm:w-[340px] h-[400px] sm:h-[470px] rounded-[2.5rem] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-[50px] mix-blend-screen"
                        />
                        <motion.div
                            whileHover={{ scale: 1.03, rotate: 1 }}
                            className="relative z-20 w-[260px] sm:w-[320px] h-[380px] sm:h-[460px] rounded-[2.5rem] overflow-hidden border border-cyan-400/30 backdrop-blur-md shadow-[0_0_60px_rgba(0,255,255,0.25)]"
                        >
                            <img src={profileImg} alt="Dharanidharan" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                            <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
                            >
                                <p className="text-cyan-300 uppercase tracking-[0.3em] text-xs mb-2">Creative Director</p>
                                <h3 className="text-2xl font-black">Dharanidharan</h3>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            animate={{ y: [20, -20, 20] }}
                            transition={{ repeat: Infinity, duration: 5 }}
                            className="absolute -left-4 sm:-left-2 bottom-10 sm:bottom-16 w-32 sm:w-44 aspect-video rounded-2xl overflow-hidden border border-cyan-400/40 shadow-[0_0_25px_rgba(0,255,255,0.35)]"
                        >
                            <img src={ytThumb} alt="Video Preview" className="w-full h-full object-cover opacity-90" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center">
                                    <Play fill="white" size={20} />
                                </div>
                            </div>
                        </motion.div>
                        <motion.a
                            href="https://youtube.com/@dharanixstudio"
                            target="_blank"
                            rel="noopener noreferrer"
                            animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute top-10 right-6 z-30"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-red-600 flex items-center justify-center shadow-[0_0_40px_rgba(255,0,0,0.5)]">
                                <Youtube size={36} />
                            </div>
                        </motion.a>
                        <motion.a
                            href="https://www.instagram.com/visionofad?igsh=YTJ1cjYxYjMxdXI5"
                            target="_blank"
                            rel="noopener noreferrer"
                            animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
                            transition={{ repeat: Infinity, duration: 5 }}
                            className="absolute top-36 right-9 z-30"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                                <Instagram size={24} />
                            </div>
                        </motion.a>
                    </motion.div>
                </div>
                
                {/* Scroll Down Indicator */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
                >
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Discover</span>
                    <motion.div 
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="text-cyan-400"
                    >
                        <ChevronDown size={20} strokeWidth={2.5} />
                    </motion.div>
                </motion.div>

            </section>



            <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl font-black uppercase tracking-[0.3em] mb-14 text-center md:text-left"
                >
                    Featured Videos
                </motion.h2>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {(loading ? Array.from({ length: 3 }) : featuredVideos).map((video, i) => (
                        <FeaturedVideoCard key={video?.id ?? i} video={video} stripHtml={stripHtml} />
                    ))}
                </motion.div>
            </section>

            <footer className="relative mt-20 border-t border-white/10 bg-gradient-to-b from-transparent to-white/[0.02]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-5">
                        <Magnetic>
                            <motion.a
                                whileHover={{ scale: 1.2, rotate: 5, backgroundColor: 'rgba(255,0,0,0.2)' }}
                                href="https://youtube.com/@dharanixstudio?si=YuoczrWD_6GTHqPo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-red-500 transition-colors"
                            >
                                <Youtube size={22} />
                            </motion.a>
                        </Magnetic>
                        <Magnetic>
                            <motion.a
                                whileHover={{ scale: 1.2, rotate: -5, backgroundColor: 'rgba(236,72,153,0.2)' }}
                                href="https://www.instagram.com/visionofad?igsh=YTJ1cjYxYjMxdXI5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-pink-500 transition-colors"
                            >
                                <Instagram size={22} />
                            </motion.a>
                        </Magnetic>
                        <Magnetic>
                            <motion.a
                                whileHover={{ scale: 1.2, backgroundColor: 'rgba(0,255,255,0.2)' }}
                                href="#"
                                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-cyan-400 transition-colors"
                            >
                                <Twitter size={22} />
                            </motion.a>
                        </Magnetic>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-xl font-black uppercase tracking-tighter mb-2">Nexus <span className="text-cyan-400">AV</span></div>
                        <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase text-center">
                            © 2026 DHARANIX STUDIO • Dharanidharan
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 uppercase font-black tracking-widest text-xs text-gray-500">
                        <Link to="/about" className="hover:text-cyan-400 transition-colors">About</Link>
                        <Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
                        <Link to="/projects" className="hover:text-cyan-400 transition-colors">Projects</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
