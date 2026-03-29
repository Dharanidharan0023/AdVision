import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { Calendar, User, PlayCircle, X, ExternalLink, Flame, ArrowUpRight, Zap } from 'lucide-react';
import Magnetic from '../components/common/Magnetic';
import BentoItem from '../components/common/BentoItem';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/public/posts');
                setPosts(res.data);
            } catch (err) {
                console.error("Failed to fetch posts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
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

    if (loading) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full"
            />
        </div>
    );

    return (
        <div className="min-h-screen pt-40 px-6 bg-dark-bg pb-32 overflow-hidden">
            {/* Background Texture */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_50%_0%,rgba(176,38,255,0.05)_0%,transparent_70%)] -z-10" />
            
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-32"
                >
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl text-neon-cyan text-[10px] font-black tracking-[0.4em] uppercase mb-10">
                        <Flame size={14} className="text-neon-cyan animate-pulse" />
                        The Narrative Stream
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                        Studio <span className="neon-text italic">Feed</span>
                    </h1>
                </motion.div>

                {posts.length === 0 ? (
                    <div className="text-center py-40 border border-dashed border-white/5 rounded-[4rem]">
                        <p className="text-gray-600 text-2xl font-light italic uppercase tracking-tighter">Awaiting new transmissions...</p>
                    </div>
                ) : (
                    <div className="bento-grid">
                        {posts.map((post, index) => (
                            <BentoPostCard key={post.id} post={post} index={index} onVideoClick={handleVideoClick} />
                        ))}
                        
                        {/* Static Exploration Bento Item */}
                        <BentoItem span="md:col-span-4 lg:col-span-4" className="bg-neon-purple/5 p-12 flex flex-col justify-between overflow-hidden relative group">
                            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-neon-purple/10 rounded-full blur-[80px] group-hover:bg-neon-purple/20 transition-all duration-1000" />
                            <div className="space-y-6 relative">
                                <Zap size={32} className="text-neon-purple" />
                                <h3 className="text-3xl font-black text-white leading-none uppercase tracking-tighter">Beyond the <br /> Screen</h3>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[200px]">
                                    Discover the process behind our most complex visual narratives.
                                </p>
                            </div>
                            <Magnetic>
                                <button className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-neon-purple hover:text-black hover:border-neon-purple transition-all duration-500">
                                    <ArrowUpRight size={24} />
                                </button>
                            </Magnetic>
                        </BentoItem>
                    </div>
                )}
            </div>

            {/* High-Fidelity Video Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 backdrop-blur-[100px] p-6 md:p-12"
                        onClick={() => setActiveVideo(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 40 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-7xl aspect-video glass-modern p-1 rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="absolute top-10 right-10 w-16 h-16 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all z-20"
                            >
                                <X size={32} />
                            </button>
                            <iframe
                                className="w-full h-full rounded-[3.8rem]"
                                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&vq=hd1080`}
                                title="Visual Transmission"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const BentoPostCard = ({ post, index, onVideoClick }) => {
    // Dynamic spanning based on index for architectural rhythm
    const span = (index % 4 === 0) ? "md:col-span-4 lg:col-span-8" : "md:col-span-4 lg:col-span-4";
    
    return (
        <BentoItem span={span} className="group min-h-[500px] overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
                {post.imageUrl ? (
                    <img 
                        src={post.imageUrl} 
                        className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000" 
                        alt="" 
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neon-cyan/5 via-transparent to-transparent" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="relative h-full p-12 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <span className="text-neon-cyan text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                            <Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tighter uppercase group-hover:text-neon-cyan transition-colors duration-500">
                            {post.title}
                        </h2>
                    </div>
                    {post.videoUrl && (
                        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-white hover:text-black">
                            <PlayCircle size={28} />
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <p className="text-gray-400 text-lg font-light leading-relaxed max-w-xl line-clamp-3">
                        {post.content}
                    </p>
                    <div className="flex items-center justify-between pt-8 border-t border-white/5">
                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white/30">
                            <User size={14} className="text-neon-purple" /> Production Admin
                        </div>
                        <Magnetic>
                            <button 
                                onClick={() => post.videoUrl ? onVideoClick(post.videoUrl) : null}
                                className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-neon-cyan transition-colors"
                            >
                                {post.videoUrl ? 'Launch Visual' : 'View Detail'} <ArrowUpRight size={18} />
                            </button>
                        </Magnetic>
                    </div>
                </div>
            </div>
            
            {/* Click functionality layer */}
            <div 
                className="absolute inset-0 z-10 cursor-pointer" 
                onClick={() => post.videoUrl && onVideoClick(post.videoUrl)}
            />
        </BentoItem>
    );
}

export default Posts;
