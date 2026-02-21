import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Play, TrendingUp, Users, Youtube, Star, ExternalLink, ChevronRight, Mail, ArrowRight, MessageSquare, Heart } from 'lucide-react';
import api from '../api/axios';

// Animated Counter Hook
const useCounter = (end, duration = 2) => {
    const [count, setCount] = useState(0);
    const nodeRef = useRef(null);
    const inView = useInView(nodeRef, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!inView) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(end); // Ensure exact finish
            }
        };
        window.requestAnimationFrame(step);
    }, [inView, end, duration]);

    return { count, nodeRef };
};

const StatItem = ({ label, value, suffix = "", delay = 0 }) => {
    const { count, nodeRef } = useCounter(value, 2.5);
    return (
        <motion.div
            ref={nodeRef}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6, type: "spring" }}
            className="flex flex-col items-center justify-center p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(176,38,255,0.1)] group hover:border-neon-purple/50 transition-colors"
        >
            <h3 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter group-hover:text-neon-cyan transition-colors duration-500">
                {count}{suffix}
            </h3>
            <p className="text-neon-purple uppercase tracking-widest text-sm font-bold">{label}</p>
        </motion.div>
    );
};

const Home = () => {
    const [latestVideos, setLatestVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/public/posts');
                // Assume they are videos or we just use posts as videos
                setLatestVideos(res.data.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch videos", error);
                // Mock data fallback
                setLatestVideos([
                    { id: 1, title: 'I Spent 50 Hours In VR', imageUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80', description: 'Can you survive a whole weekend in the Metaverse?' },
                    { id: 2, title: 'Tasting the World\'s SCARIEST Hot Sauce', imageUrl: 'https://images.unsplash.com/photo-1588046138717-d20a7b457fce?w=800&q=80', description: 'We instant regret this decision immediately.' },
                    { id: 3, title: 'Testing Viral TikTok Gadgets', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', description: 'Are these Amazon finds actually worth the money?' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Helper to get image or youtube thumbnail
    const getThumbnail = (video) => {
        if (video.imageUrl) return video.imageUrl;
        if (video.videoId) return `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
        return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'; // fallback
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-dark-bg selection:bg-neon-cyan selection:text-black font-sans overflow-hidden">

            {/* 1. HERO SECTION */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
                {/* Animated Background Gradients */}
                <motion.div style={{ y, opacity, scale }} className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neon-purple/20 via-dark-bg to-dark-bg" />
                    <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-neon-cyan/20 rounded-full blur-[150px] animate-pulse" />
                    <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBoNDBNNDAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-50 mask-image:linear-gradient(to_bottom,white,transparent)]" />
                </motion.div>

                <div className="container relative z-10 mx-auto text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-black/50 backdrop-blur-md"
                    >
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="text-neon-cyan text-xs font-bold tracking-[0.2em] uppercase">
                            New Video Just Dropped
                        </span>
                    </motion.div>

                    {/* Glitch Title Reveal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="relative"
                    >
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 leading-none">
                            UNLEASH THE<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan filter drop-shadow-[0_0_20px_rgba(176,38,255,0.8)]">MADNESS</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 font-medium"
                    >
                        Viral challenges, honest reviews, and pure entertainment. Join the fastest growing community on YouTube.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
                    >
                        <a href="/posts" className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-neon-purple text-white font-bold text-lg rounded-full overflow-hidden transition-transform active:scale-95 shadow-[0_0_40px_rgba(176,38,255,0.4)] hover:shadow-[0_0_60px_rgba(176,38,255,0.6)]">
                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <Play className="w-5 h-5 fill-white" />
                            <span className="relative z-10">Watch Latest</span>
                        </a>

                        <a href="/projects" className="group flex items-center justify-center gap-3 px-8 py-4 bg-black/50 border border-white/20 text-white font-bold text-lg rounded-full backdrop-blur-md hover:border-neon-cyan/50 hover:bg-white/5 transition-all duration-300 active:scale-95">
                            <TrendingUp className="w-5 h-5 group-hover:text-neon-cyan transition-colors" />
                            <span>Trending</span>
                        </a>
                    </motion.div>
                </div>

                {/* Animated Scroll Down Indicator */}
                <motion.div
                    animate={{ y: [0, 15, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500">Scroll Down</span>
                    <div className="w-px h-16 bg-gradient-to-b from-neon-purple to-transparent" />
                </motion.div>
            </section>

            {/* 2. CHANNEL STATS SECTION */}
            <section className="py-24 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatItem label="Subscribers" value={250} suffix="K+" delay={0.1} />
                        <StatItem label="Total Views" value={14} suffix="M+" delay={0.2} />
                        <StatItem label="Videos Uploaded" value={186} delay={0.3} />
                        <StatItem label="Years Active" value={3} delay={0.4} />
                    </div>
                </div>
            </section>

            {/* 3. LATEST VIDEOS SECTION */}
            <section className="py-24 bg-gradient-to-b from-dark-bg to-black relative z-10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
                                LATEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500">DROPS</span>
                            </h2>
                            <p className="text-gray-400 text-xl max-w-xl">Fresh content straight from the studio. You won't want to miss these.</p>
                        </motion.div>
                        <motion.a
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            href="/posts"
                            className="flex items-center gap-2 text-neon-cyan font-bold hover:text-white transition-colors group"
                        >
                            View All Videos
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </motion.a>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {latestVideos.map((video, idx) => (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: idx * 0.15, duration: 0.6 }}
                                    className="group relative rounded-3xl overflow-hidden bg-black border border-white/10 hover:border-neon-purple/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(176,38,255,0.2)] cursor-pointer"
                                >
                                    <div className="aspect-video overflow-hidden relative">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                                        <img
                                            src={getThumbnail(video)}
                                            alt={video.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-50 group-hover:scale-100">
                                            <div className="w-16 h-16 rounded-full bg-neon-purple/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(176,38,255,0.8)]">
                                                <Play className="w-8 h-8 fill-white translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-3 mb-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            <span className="flex items-center gap-1 text-neon-cyan"><Star className="w-4 h-4" /> Featured</span>
                                            <span>•</span>
                                            <span>{new Date(video.createdAt || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-neon-cyan transition-colors">{video.title}</h3>
                                        <p className="text-gray-400 line-clamp-2">{video.description || video.content || 'Check out our latest amazing video and hit that like button!'}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 4. TRENDING / MOST WATCHED (Slider format using flex-overflow) */}
            <section className="py-24 relative overflow-hidden z-10">
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10" />
                <div className="container mx-auto px-6 mb-12">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-center text-white uppercase tracking-wider"
                    >
                        Trending On <span className="text-neon-purple">YouTube</span>
                    </motion.h2>
                </div>

                {/* Horizontal Scrolling Track */}
                <div className="w-full overflow-x-auto pb-12 hide-scrollbar ps-6 lg:ps-[calc((100vw-1200px)/2)] pr-6">
                    <div className="flex gap-6 w-max">
                        {[1, 2, 3, 4, 5].map((item, idx) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, x: 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "0px -100px 0px 0px" }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                className="w-[300px] sm:w-[400px] shrink-0 group cursor-pointer"
                            >
                                <div className="relative rounded-2xl overflow-hidden aspect-[9/16] sm:aspect-video border border-white/10 group-hover:border-neon-cyan/50 transition-all duration-300">
                                    <img
                                        src={`https://images.unsplash.com/photo-${1500000000000 + item}?w=600&q=80`}
                                        alt={`Trending ${item}`}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs">#{item}</span>
                                            <span className="text-red-500 font-bold text-sm uppercase tracking-wider">Trending</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Viral Challenge Recap #{item}</h3>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                                        <Youtube className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. COMMUNITY SECTION */}
            <section className="py-24 bg-black relative z-10 border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase">
                                Our Mad <br /><span className="text-neon-cyan">Community</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                                Join hundreds of thousands of fans from around the globe. We read your comments, react to your wild ideas, and sometimes even fly you out to be in videos!
                            </p>

                            <div className="flex gap-4">
                                <a href="#" className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF0000]/20 hover:border-[#FF0000] hover:text-[#FF0000] transition-colors group">
                                    <Youtube className="w-6 h-6 text-gray-400 group-hover:text-[#FF0000]" />
                                </a>
                                <a href="#" className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-neon-purple/20 hover:border-neon-purple hover:text-neon-purple transition-colors group">
                                    <ExternalLink className="w-6 h-6 text-gray-400 group-hover:text-neon-purple" />
                                </a>
                            </div>
                        </motion.div>

                        {/* Floating Comments */}
                        <div className="relative h-[400px] w-full mt-10 lg:mt-0">
                            {[
                                { t: "Bro this video had me dead 💀💀", user: "@gamingninja", style: "top-0 left-0 lg:-left-10" },
                                { t: "I've been subbed since day 1. Best evolution ever.", user: "@og_fan_99", style: "top-1/4 right-0 lg:-right-10" },
                                { t: "Wait did he actually jump out of the plane?! 🔥", user: "@adrenalinejunkie", style: "bottom-1/3 left-10" },
                                { t: "Another banger alert 🚨", user: "@musicmaker", style: "bottom-0 right-10" }
                            ].map((comment, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.2, duration: 0.5 }}
                                    className={`absolute ${comment.style} p-4 md:p-6 rounded-2xl bg-dark-bg border border-white/10 shadow-xl max-w-xs backdrop-blur-md hover:border-neon-cyan/50 hover:z-10 transition-colors cursor-default`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-purple to-neon-cyan" />
                                        <span className="text-gray-300 font-bold text-sm">{comment.user}</span>
                                    </div>
                                    <p className="text-white font-medium text-sm md:text-base">{comment.t}</p>
                                    <div className="flex gap-4 mt-3 opacity-50">
                                        <Heart className="w-4 h-4 cursor-pointer hover:text-red-500" />
                                        <MessageSquare className="w-4 h-4 cursor-pointer" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. NEWSLETTER / JOIN THE FUN */}
            <section className="py-24 relative z-10">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="p-10 md:p-16 rounded-[40px] bg-gradient-to-br from-neon-purple/20 via-black to-neon-cyan/20 border border-white/10 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Never Miss A Beat</h2>
                            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">Get exclusive behind-the-scenes content, early access to merch drops, and updates on our wildest ideas straight to your inbox.</p>

                            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                                <div className="relative flex-1">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="w-full pl-12 pr-4 py-4 rounded-full bg-black/50 border border-white/20 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                                        required
                                    />
                                </div>
                                <button type="submit" className="px-8 py-4 bg-white text-black font-black uppercase tracking-wider rounded-full hover:bg-neon-cyan transition-colors duration-300 shadow-lg shadow-white/10 hover:shadow-neon-cyan/20 transform active:scale-95">
                                    Join the cult
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 7. STRONG FINAL CTA */}
            <section className="py-32 bg-neon-purple relative overflow-hidden z-10 flex items-center justify-center">
                {/* Background animations */}
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBoNDBNNDAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] animate-[pulse_4s_ease-in-out_infinite]" />
                <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-black opacity-30 rounded-full blur-[100px]" />
                <div className="absolute -right-32 -top-32 w-96 h-96 bg-white opacity-20 rounded-full blur-[100px]" />

                <div className="container relative z-10 mx-auto px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
                        className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-10 drop-shadow-2xl"
                    >
                        Are you not <br />
                        <span className="text-black italic bg-white px-4 py-0 leading-tight inline-block transform -rotate-2">ENTERTAINED?</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <a href="https://youtube.com/@advisionstudio" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center px-12 py-6 bg-black text-white text-xl md:text-2xl font-black uppercase tracking-widest rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95 shadow-2xl">
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                            <Youtube className="w-8 h-8 mr-4 text-red-600 group-hover:scale-125 transition-transform" />
                            SUBSCRIBE NOW
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Global style fixes for the hide-scrollbar utility */}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </div>
    );
};

export default Home;
