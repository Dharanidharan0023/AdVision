import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { PlayCircle, X, ChevronRight, Calendar, ArrowUpRight, Youtube, Star, Zap, Globe } from 'lucide-react';
import Magnetic from '../components/common/Magnetic';
import BentoItem from '../components/common/BentoItem';

const Home = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    // Dynamic Content State
    const [hero, setHero] = useState({
        title: 'AdVision <br /> <span className="neon-text italic">Studio</span>',
        subtitle: 'Creative storytelling through vision.'
    });
    const [stats, setStats] = useState([
        { label: 'Subscribers', value: '1.09K+' },
        { label: 'Videos', value: '105' },
        { label: 'Views', value: '274K+' }
    ]);
    const [latestPosts, setLatestPosts] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);

    useEffect(() => {
        const fetchHomeContent = async () => {
            try {
                const [heroRes, statsRes, postsRes] = await Promise.allSettled([
                    api.get('/public/home-section/hero'),
                    api.get('/public/home-section/stats'),
                    api.get('/public/posts')
                ]);

                if (heroRes.status === 'fulfilled' && heroRes.value.data) {
                    try {
                        const parsed = typeof heroRes.value.data.content === 'string'
                            ? JSON.parse(heroRes.value.data.content)
                            : heroRes.value.data.content;
                        setHero(prev => ({ ...prev, ...parsed }));
                    } catch (e) {
                        console.error("Hero parse error:", e);
                    }
                }
                if (statsRes.status === 'fulfilled' && statsRes.value.data) {
                    try {
                        const parsed = typeof statsRes.value.data.content === 'string'
                            ? JSON.parse(statsRes.value.data.content)
                            : statsRes.value.data.content;
                        if (Array.isArray(parsed)) setStats(parsed);
                    } catch (e) {
                        console.error("Stats parse error:", e);
                    }
                }
                if (postsRes.status === 'fulfilled' && postsRes.value.data) {
                    setLatestPosts(postsRes.value.data.slice(0, 4));
                }
            } catch (err) {
                console.error("Error fetching home content:", err);
            }
        };
        fetchHomeContent();
    }, []);

    const handleVideoClick = (videoUrl) => {
        if (!videoUrl) return;
        const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/)([\w-]{11}))/);
        if (videoIdMatch && videoIdMatch[1]) {
            setActiveVideo(videoIdMatch[1]);
        } else {
            window.open(videoUrl, '_blank');
        }
    };

    return (
        <div ref={containerRef} className="bg-dark-bg relative">
            <motion.div className="scroll-progress" style={{ scaleX }} />
            <div className="aurora-bg" />

            {/* Hero Section */}
            <section className="relative h-screen flex items-center overflow-hidden px-6">
                <motion.div 
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute top-[10%] left-[10%] w-[40rem] h-[40rem] bg-neon-purple/10 rounded-full blur-[160px] animate-pulse" />
                    <div className="absolute bottom-[10%] right-[10%] w-[40rem] h-[40rem] bg-neon-cyan/10 rounded-full blur-[160px] animate-pulse" />
                </motion.div>

                <div className="container relative z-30 mx-auto max-w-6xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-5 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl text-neon-cyan text-[10px] font-black tracking-[0.4em] uppercase mb-12"
                        >
                            The Future of Visual Storytelling
                        </motion.span>
                        <h1
                            className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black mb-12 leading-[0.9] tracking-tighter text-white mx-auto uppercase"
                            dangerouslySetInnerHTML={{ __html: hero.title }}
                        />
                        <p className="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto mb-16 font-light leading-relaxed">
                            {hero.subtitle}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-8 items-center">
                            <Magnetic>
                                <a 
                                    href="https://www.youtube.com/@advisionstudio" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn-primary group flex items-center gap-3"
                                    data-cursor="WATCH"
                                >
                                    <Youtube size={18} /> Watch Channel
                                </a>
                            </Magnetic>
                            <Magnetic>
                                <a 
                                    href="/projects" 
                                    className="btn-secondary group flex items-center gap-3"
                                    data-cursor="PROJECTS"
                                >
                                    Our Portfolio <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </a>
                            </Magnetic>
                        </div>
                    </motion.div>
                </div>
                
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-20 hidden md:block">
                    <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
                </div>
            </section>

            {/* Bento Experience Section */}
            <section className="py-32 px-6 relative z-10">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="space-y-4">
                            <span className="text-neon-cyan text-[10px] font-black tracking-[0.4em] uppercase">The Visionary Grid</span>
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                                Crafted <span className="neon-text">Precision</span>
                            </h2>
                        </div>
                    </div>

                    <div className="bento-grid">
                        {/* Featured High-Level Stat */}
                        <BentoItem span="md:col-span-2 lg:col-span-4" className="min-h-[300px] p-10 flex flex-col justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 flex items-center justify-center text-neon-purple mb-8">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-5xl font-black text-white mb-2">{stats[0]?.value}</h3>
                                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">{stats[0]?.label}</p>
                            </div>
                        </BentoItem>

                        {/* Recent Stories Bento Tiles */}
                        {latestPosts.map((post, idx) => (
                            <BentoItem 
                                key={post.id} 
                                span={idx === 0 ? "md:col-span-2 lg:col-span-8" : "md:col-span-2 lg:col-span-4"} 
                                className="min-h-[400px] group cursor-pointer"
                                data-cursor="PLAY"
                            >
                                <div className="absolute inset-0 w-full h-full overflow-hidden" onClick={() => handleVideoClick(post.videoUrl)}>
                                    <img 
                                        src={post.imageUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80"} 
                                        alt={post.title}
                                        className="w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <PlayCircle size={40} />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-10 w-full pointer-events-none">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-neon-cyan uppercase tracking-widest mb-3">
                                        <Star size={12} /> Featured
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4 group-hover:text-neon-cyan transition-colors">
                                        {post.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                        <Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </BentoItem>
                        ))}

                        {/* Additional Stats Tiles */}
                        <BentoItem span="md:col-span-2 lg:col-span-4" className="p-10 flex flex-col justify-center text-center">
                            <h3 className="text-5xl font-black text-white mb-2">{stats[1]?.value}</h3>
                            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">{stats[1]?.label}</p>
                        </BentoItem>

                        <BentoItem span="md:col-span-2 lg:col-span-4" className="p-10 flex flex-col justify-center text-center border-neon-cyan/20">
                            <h3 className="text-5xl font-black text-neon-cyan mb-2">{stats[2]?.value}</h3>
                            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">{stats[2]?.label}</p>
                        </BentoItem>

                        <BentoItem span="md:col-span-2 lg:col-span-4" className="p-10 flex items-center justify-center bg-white group hover:bg-neon-cyan transition-colors duration-500">
                            <Link 
                                to="/posts" 
                                className="flex items-center gap-4 text-black font-black uppercase tracking-[0.3em] text-xs"
                                data-cursor="EXPLORE"
                            >
                                Global Stories <Globe size={18} />
                            </Link>
                        </BentoItem>
                    </div>
                </div>
            </section>

            {/* About Section - Redesigned */}
            <AboutSection />

            {/* Video Modal Overlay */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6 md:p-12"
                        onClick={() => setActiveVideo(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-6xl aspect-video glass-modern p-1 rounded-[3rem] overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="absolute top-8 right-8 w-14 h-14 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all z-20"
                            >
                                <X size={32} />
                            </button>
                            <iframe
                                className="w-full h-full rounded-[2.8rem]"
                                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                                title="Visual Experience"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AboutSection = () => {
    const [about, setAbout] = useState(null);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await api.get('/public/about');
                setAbout(res.data);
            } catch (err) {
                console.error("About fetch error:", err);
            }
        };
        fetchAbout();
    }, []);

    if (!about) return null;

    return (
        <section className="relative py-32 overflow-hidden z-10">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-col lg:flex-row items-center gap-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="lg:w-1/2 relative"
                    >
                        <div 
                            className="relative z-10 rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-1000 group"
                            data-cursor="STUDIO"
                        >
                            <img
                                src={about.imageUrl || "https://images.unsplash.com/photo-1492691523569-44058d45e3ea?auto=format&fit=crop&q=80"}
                                alt="Studio"
                                className="w-full h-[600px] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                            />
                        </div>
                        <div className="absolute -top-20 -left-20 w-[30rem] h-[30rem] bg-neon-purple/20 rounded-full blur-[120px] -z-10" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="lg:w-1/2 space-y-12"
                    >
                        <div className="space-y-6">
                            <span className="text-neon-cyan text-[10px] font-black tracking-[0.5em] uppercase">The Architect</span>
                            <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                                {about.title} <span className="text-neon-purple">_</span>
                            </h2>
                            <p className="text-neon-purple text-2xl font-bold italic tracking-tight">{about.subtitle}</p>
                        </div>
                        <p className="text-gray-400 text-xl font-light leading-relaxed">
                            {about.description}
                        </p>
                        <div className="flex items-center gap-12">
                            <div className="space-y-2">
                                <p className="text-6xl font-black text-white">{about.experienceYears}+</p>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Years Crafting</p>
                            </div>
                            <div className="w-px h-16 bg-white/10" />
                            <div className="space-y-2">
                                <p className="text-6xl font-black text-neon-cyan">100%</p>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Infinite Vision</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Home;

