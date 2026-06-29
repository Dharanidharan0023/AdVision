import { motion } from 'framer-motion';
import { Youtube, Instagram, Heart, Users, Video, Eye, Sparkles, Target, Globe, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Magnetic from '../components/common/Magnetic';
import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import DOMPurify from 'dompurify';
import BentoItem from '../components/common/BentoItem';
import api from '../api/axios';

const About = () => {
    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/public/about');
                if (res.data) {
                    let parsedBrands = [];
                    if (res.data.brandsList) {
                        try {
                            parsedBrands = JSON.parse(res.data.brandsList);
                        } catch (_err) {
                            parsedBrands = [];
                        }
                    }
                    setAbout({ ...res.data, brandsList: parsedBrands });
                }
            } catch (err) {
                console.error("Failed to fetch about settings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        // We will use Helmet for this instead
    }, [about]);

    if (loading || !about) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-10 h-10 border-2 border-neon-cyan border-t-transparent rounded-full shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            />
        </div>
    );

    const renderBrandIcon = (type) => {
        switch (type) {
            case 'youtube': return <Youtube size={20} />;
            case 'video': return <Video size={20} />;
            case 'users': return <Users size={20} />;
            default: return <Target size={20} />;
        }
    };

    const getBrandColors = (type) => {
        switch (type) {
            case 'youtube': return 'bg-red-600/20 text-red-500 border-red-500/30 group-hover/link:bg-red-600 group-hover/link:text-white';
            case 'video': return 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30 group-hover/link:bg-neon-cyan group-hover/link:text-black';
            case 'users': return 'bg-purple-500/20 text-purple-400 border-purple-500/30 group-hover/link:bg-purple-600 group-hover/link:text-white';
            default: return 'bg-white/20 text-white border-white/30 group-hover/link:bg-white group-hover/link:text-black';
        }
    };

    return (
        <div className="min-h-screen pt-40 pb-32 bg-dark-bg px-6 overflow-hidden relative">
            <SEO 
                title={about.metaTitle || about.title}
                description={about.metaDescription || about.subtitle}
                url="/about"
            />
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_50%_0%,rgba(176,38,255,0.08)_0%,transparent_70%)] -z-10" />
            
            <div className="container mx-auto max-w-6xl">
                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-32"
                >
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl text-neon-purple text-[10px] font-black uppercase tracking-[0.4em] mb-10">
                        <Sparkles size={14} className="text-neon-purple animate-pulse" />
                        {about.subtitle}
                    </div>
                    <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                        {about.title}
                    </h1>
                    <p className="mt-12 text-xl md:text-3xl text-gray-500 italic font-light max-w-3xl mx-auto uppercase tracking-tighter leading-tight">
                        "{about.tagsLine}" <br />
                    </p>
                </motion.div>

                {/* Bento About Grid */}
                <div className="bento-grid mb-32">
                    {/* Story Tile */}
                    <BentoItem span="md:col-span-4 lg:col-span-8" className="min-h-[400px] sm:min-h-[500px] p-8 sm:p-16 flex flex-col justify-end group">
                        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
                            <img src={about.imageUrl || "https://images.unsplash.com/photo-1492691523569-44058d45e3ea?auto=format&fit=crop&q=80"} className="w-full h-full object-cover opacity-10 grayscale group-hover:opacity-20 transition-all duration-1000" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                        </div>
                        <div className="space-y-8 relative">
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase">{about.ourStoryTitle}</h2>
                            <div 
                                className="text-gray-400 text-xl font-light leading-relaxed max-w-2xl whitespace-pre-wrap quill-content"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about.description) }}
                            />
                        </div>
                    </BentoItem>

                    {/* Mission Tile */}
                    <BentoItem span="md:col-span-4 lg:col-span-4" className="bg-white p-8 sm:p-12 flex flex-col justify-between group">
                        <div className="text-black space-y-6">
                            <Target size={32} className="text-neon-purple" />
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">The Mission</h3>
                            <p className="text-black/50 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                                To blend creativity with purpose.
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black group-hover:bg-neon-purple group-hover:text-black transition-all">
                            <Globe size={24} />
                        </div>
                    </BentoItem>

                    {/* Stats Tiles */}
                    {[
                        { icon: Users, label: 'Subscribers', value: about.subscribersCount, color: 'text-neon-cyan' },
                        { icon: Video, label: 'Videos', value: about.videosCount, color: 'text-white' },
                        { icon: Eye, label: 'Views', value: about.viewsCount, color: 'text-neon-purple' },
                        { icon: Heart, label: 'Community', value: about.communityText, color: 'text-white' },
                    ].map((stat, idx) => (
                        <BentoItem key={idx} span="md:col-span-2 lg:col-span-3" className="p-6 sm:p-10 flex flex-col items-center justify-center text-center group">
                            <stat.icon size={24} className="text-gray-600 mb-6 group-hover:scale-110 transition-transform" />
                            <h4 className={`text-4xl font-black mb-2 tracking-tighter ${stat.color}`}>{stat.value}</h4>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em]">{stat.label}</p>
                        </BentoItem>
                    ))}

                    {/* Values Tile */}
                    <BentoItem span="md:col-span-4 lg:col-span-6" className="p-8 sm:p-16 flex flex-col justify-center gap-8 bg-neon-cyan/5 border-neon-cyan/10">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Core Values</h3>
                            <p className="text-gray-500 text-lg font-light whitespace-pre-wrap">
                                We operate with transparency, passion, and gratitude.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest">Transparency</div>
                            <div className="px-8 py-4 rounded-2xl bg-neon-purple/20 border border-neon-purple/30 text-neon-purple font-black uppercase text-[10px] tracking-widest">Passion</div>
                        </div>
                    </BentoItem>

                    {/* Brands & Collaborations */}
                    <BentoItem span="md:col-span-4 lg:col-span-6" className="p-8 sm:p-12 flex flex-col justify-center gap-8 bg-white/5 border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/20 blur-[100px] -z-10 group-hover:bg-neon-cyan/20 transition-all duration-700" />
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Brands & Collaborations</h3>
                        <div className="space-y-6">
                            {about.brandsList && about.brandsList.map((brand, idx) => {
                                const hasValidUrl = brand.url && brand.url.trim() !== '' && brand.url !== '#';
                                return (
                                <a key={idx} href={hasValidUrl ? brand.url : undefined} target={hasValidUrl ? "_blank" : undefined} rel="noopener noreferrer" className={`flex items-center gap-4 ${hasValidUrl ? 'group/link cursor-pointer' : ''}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${getBrandColors(brand.type)}`}>
                                        {renderBrandIcon(brand.type)}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase tracking-widest text-sm">{brand.name}</h4>
                                        <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">{brand.role}</p>
                                    </div>
                                </a>
                                );
                            })}
                        </div>
                    </BentoItem>
                </div>

                {/* Social Connect */}
                <div className="text-center space-y-16">
                    <h2 
                        className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter uppercase"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(about.joinTitle?.replace(
                                /(Movement)/i,
                                '<span class="neon-text italic">$1</span>'
                            ) || 'Join the <span class="neon-text italic">Movement</span>')
                        }}
                    />
                    <div className="flex flex-col sm:flex-row justify-center gap-8 max-w-3xl mx-auto">
                        <Magnetic>
                            <a
                                href={about.joinYoutubeLink || "https://youtube.com/@dharanixstudio"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex items-center justify-center gap-4 w-full sm:w-80 group"
                            >
                                <Youtube size={22} />
                                YouTube <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                        </Magnetic>
                        <Magnetic>
                            <a
                                href={about.joinInstagramLink || "https://www.instagram.com/visionofad"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary flex items-center justify-center gap-4 w-full sm:w-80 group"
                            >
                                <Instagram size={22} />
                                Instagram <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                        </Magnetic>
                    </div>
                </div>
            </div>

            <footer className="border-t border-white/10 py-10 mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <p className="text-gray-400 text-sm">© 2026 Dharanix Studio — built for cinematic stories.</p>
                    <div className="flex flex-wrap justify-center gap-6 uppercase tracking-widest text-sm text-gray-400">
                        <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
                        <Link to="/contact" className="hover:text-cyan-400 transition">Contact</Link>
                        <Link to="/projects" className="hover:text-cyan-400 transition">Projects</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;
