import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Clock, ChevronRight, Sparkles, Filter, Star, Zap, Globe } from 'lucide-react';
import api from '../api/axios';
import Magnetic from '../components/common/Magnetic';
import BentoItem from '../components/common/BentoItem';

const GENRES = ['All', 'Fantasy', 'Romance', 'Thriller', 'Mystery', 'Sci-Fi', 'Horror', 'Drama', 'Adventure'];

const StoryLibrary = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeGenre, setActiveGenre] = useState('All');
    const [activeStatus, setActiveStatus] = useState('All');

    useEffect(() => {
        api.get('/public/stories')
            .then(res => setStories(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const featured = stories.find(s => s.featured) || stories[0];

    const filtered = stories.filter(s => {
        const matchGenre = activeGenre === 'All' || s.genre === activeGenre;
        const matchStatus = activeStatus === 'All' || s.status === activeStatus;
        const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.summary.toLowerCase().includes(search.toLowerCase());
        return matchGenre && matchStatus && matchSearch;
    });

    if (loading) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-10 h-10 border-2 border-neon-cyan border-t-transparent rounded-full"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg text-white pb-32">
            {/* Immersive Header */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,255,0.05)_0%,transparent_70%)] -z-10" />
                
                <div className="container mx-auto max-w-6xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <span className="text-neon-cyan text-[10px] font-black tracking-[0.5em] uppercase">The Narrative Vault</span>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
                            Story <span className="neon-text italic">Library</span>
                        </h1>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            Discover cinematic narratives crafted with precision and visual depth.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Featured Bento Section */}
            {featured && (
                <section className="container mx-auto px-6 max-w-6xl mb-24">
                    <div className="bento-grid">
                        <BentoItem span="md:col-span-4 lg:col-span-8" className="min-h-[500px] p-0 group">
                            <div className="relative w-full h-full overflow-hidden">
                                {featured.coverUrl ? (
                                    <img src={featured.coverUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" alt="" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-transparent to-neon-cyan/20" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                
                                <div className="absolute bottom-0 left-0 p-12 w-full">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="px-4 py-1.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest">
                                            Featured Story
                                        </div>
                                        <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-neon-cyan text-[10px] font-black uppercase tracking-widest border border-white/10">
                                            {featured.genre}
                                        </div>
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
                                        {featured.title}
                                    </h2>
                                    <p className="text-gray-400 text-lg mb-8 max-w-xl font-light line-clamp-2">
                                        {featured.summary}
                                    </p>
                                    <Magnetic>
                                        <Link 
                                            to={`/stories/${featured.id}`} 
                                            className="btn-primary inline-flex items-center gap-3"
                                        >
                                            Begin Journey <ChevronRight size={18} />
                                        </Link>
                                    </Magnetic>
                                </div>
                            </div>
                        </BentoItem>

                        <BentoItem span="md:col-span-4 lg:col-span-4" className="p-10 flex flex-col justify-between bg-white overflow-hidden">
                            <div className="text-black space-y-4">
                                <Star size={32} className="text-neon-purple mb-4" />
                                <h3 className="text-3xl font-black tracking-tight leading-none uppercase">Editor's Choice</h3>
                                <p className="text-black/60 text-sm font-medium leading-relaxed">
                                    Hand-picked narratives that redefine cinematic boundaries.
                                </p>
                            </div>
                            <div className="pt-8 border-t border-black/5">
                                <div className="flex -space-x-4 mb-6">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-white bg-neon-cyan flex items-center justify-center text-[10px] font-black text-black">
                                        +12
                                    </div>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Active Readers</p>
                            </div>
                        </BentoItem>
                    </div>
                </section>
            )}

            {/* Filter & Search Bar */}
            <section className="container mx-auto px-6 max-w-6xl mb-12">
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                    <div className="relative w-full lg:max-w-md group">
                        <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-cyan transition-colors" />
                        <input
                            type="text"
                            placeholder="Search Narratives..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-full pl-14 pr-8 py-5 text-sm font-bold placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30 focus:bg-white/[0.08] transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        <Filter size={16} className="text-white/20 mr-2" />
                        {GENRES.map(genre => (
                            <button
                                key={genre}
                                onClick={() => setActiveGenre(genre)}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                    activeGenre === genre 
                                    ? 'bg-neon-cyan text-black shadow-[0_0_20px_rgba(0,255,255,0.3)]' 
                                    : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Grid (Bento Style) */}
            <section className="container mx-auto px-6 max-w-6xl">
                <div className="bento-grid">
                    <AnimatePresence>
                        {filtered.map((story, idx) => (
                            <BentoStoryCard key={story.id} story={story} idx={idx} />
                        ))}
                    </AnimatePresence>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-40 border border-dashed border-white/10 rounded-[3rem]">
                        <Globe size={48} className="text-white/10 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-white/40 uppercase tracking-tighter">No Stories Found</h3>
                    </div>
                )}
            </section>
        </div>
    );
};

const BentoStoryCard = ({ story, idx }) => {
    // Alternate span lengths for bento effect
    const span = (idx % 5 === 0) ? "md:col-span-4 lg:col-span-6" : "md:col-span-4 lg:col-span-3";
    
    return (
        <BentoItem span={span} className="group min-h-[450px]">
            <Link to={`/stories/${story.id}`} className="absolute inset-0 w-full h-full p-8 flex flex-col justify-between">
                <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
                    {story.coverUrl ? (
                        <img 
                            src={story.coverUrl} 
                            alt={story.title}
                            className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neon-purple/5 to-transparent" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black uppercase text-neon-purple tracking-widest">
                        {story.genre}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-neon-cyan group-hover:bg-neon-cyan/10 transition-all">
                        <ArrowRight size={18} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-black text-white leading-[1.1] tracking-tighter uppercase group-hover:text-neon-cyan transition-colors">
                        {story.title}
                    </h3>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                        <BookOpen size={14} className="text-neon-purple" /> {story._count?.chapters ?? 0} Chapters
                    </p>
                </div>
            </Link>
        </BentoItem>
    );
};

// Simple ArrowRight since lucide-react doesn't have it by default in my import? Oh wait, it does.
// But some versions don't. Let me re-import or use a similar one.
import { ArrowRight } from 'lucide-react';

export default StoryLibrary;
