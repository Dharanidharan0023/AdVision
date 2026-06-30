import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Youtube, Instagram, Twitter, Heart, Users, Video, Eye, Sparkles, Target, Globe, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Magnetic from '../components/common/Magnetic';
import { useState, useEffect, useRef } from 'react';
import SEO from '../components/SEO';
import DOMPurify from 'dompurify';
import BentoItem from '../components/common/BentoItem';
import api from '../api/axios';
import { useSocial } from '../context/SocialContext';
import CoverImage from '../components/CoverImage';

const AnimatedCounter = ({ value, className }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [count, setCount] = useState(0);

    // Parse the numeric part and the suffix
    const numericMatch = String(value).match(/[\d.]+/);
    const suffixMatch = String(value).match(/[^\d.]+/);
    const targetNumber = numericMatch ? parseFloat(numericMatch[0]) : 0;
    const suffix = suffixMatch ? suffixMatch[0] : '';
    const isFloat = String(targetNumber).includes('.');

    useEffect(() => {
        if (!isInView || targetNumber === 0) return;
        let start = 0;
        const duration = 2000;
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        const increment = targetNumber / totalFrames;

        const timer = setInterval(() => {
            start += increment;
            if (start >= targetNumber) {
                setCount(targetNumber);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, frameRate);
        return () => clearInterval(timer);
    }, [isInView, targetNumber]);

    const displayValue = targetNumber === 0 ? value : (isFloat ? count.toFixed(1) : Math.floor(count)) + suffix;

    return (
        <span ref={ref} className={className}>
            {displayValue}
        </span>
    );
};

const About = () => {
    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(true);

    const { socialLinks, loading: socialLoading } = useSocial();
    const { scrollYProgress } = useScroll();
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    const getPlatformIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case 'youtube': return <Youtube size={22} />;
            case 'instagram': return <Instagram size={22} />;
            case 'twitter': return <Twitter size={22} />;
            default: return <Globe size={22} />;
        }
    };

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
            <motion.div style={{ y: backgroundY }} className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_50%_0%,rgba(176,38,255,0.08)_0%,transparent_70%)] -z-10" />
            
            <div className="container mx-auto max-w-6xl">
                {/* Hero Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                    }}
                    className="text-center mb-32"
                >
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl text-neon-purple text-[10px] font-black uppercase tracking-[0.4em] mb-10">
                        <Sparkles size={14} className="text-neon-purple animate-pulse" />
                        {about.subtitle}
                    </motion.div>
                    <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-5xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                        {about.title}
                    </motion.h1>
                    <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mt-12 text-xl md:text-3xl text-gray-500 italic font-light max-w-3xl mx-auto uppercase tracking-tighter leading-tight">
                        "{about.tagsLine}" <br />
                    </motion.p>
                </motion.div>

                {/* Bento About Grid */}
                <div className="bento-grid mb-32">
                    {/* Story Tile */}
                    <BentoItem span="md:col-span-4 lg:col-span-8" className="min-h-[400px] sm:min-h-[500px] p-8 sm:p-16 flex flex-col justify-end group hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-700 hover:-translate-y-2">
                        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
                            <CoverImage src={about.imageUrl || "https://images.unsplash.com/photo-1492691523569-44058d45e3ea?auto=format&fit=crop&q=80"} className="w-full h-full object-cover opacity-10 grayscale group-hover:opacity-30 group-hover:scale-110 transition-all duration-[10000ms] ease-out" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                        </div>
                        <div className="space-y-8 relative transform transition-transform duration-700 group-hover:translate-x-2">
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase">{about.ourStoryTitle}</h2>
                            <div 
                                className="text-gray-400 text-xl font-light leading-relaxed max-w-2xl whitespace-pre-wrap quill-content group-hover:text-gray-300 transition-colors"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about.description) }}
                            />
                        </div>
                    </BentoItem>

                    {/* Mission Tile */}
                    <BentoItem span="md:col-span-4 lg:col-span-4" className="bg-white p-8 sm:p-12 flex flex-col justify-between group hover:shadow-[0_20px_60px_rgba(255,255,255,0.1)] transition-all duration-700 hover:-translate-y-2 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-neon-purple/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="text-black space-y-6 relative z-10 transform transition-transform duration-700 group-hover:translate-x-2">
                            <Target size={32} className="text-neon-purple" />
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">The Mission</h3>
                            <p className="text-black/50 text-sm font-medium leading-relaxed whitespace-pre-wrap group-hover:text-black/80 transition-colors">
                                To blend creativity with purpose.
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black group-hover:bg-neon-purple group-hover:text-black transition-all group-hover:scale-110 group-hover:rotate-12 duration-500 relative z-10">
                            <Globe size={24} />
                        </div>
                    </BentoItem>

                    {/* Stats Tiles */}
                    {[
                        { icon: Users, label: 'Subscribers', value: about.subscribersCount, color: 'text-neon-cyan', bgGlow: 'group-hover:bg-neon-cyan/5' },
                        { icon: Video, label: 'Videos', value: about.videosCount, color: 'text-white', bgGlow: 'group-hover:bg-white/5' },
                        { icon: Eye, label: 'Views', value: about.viewsCount, color: 'text-neon-purple', bgGlow: 'group-hover:bg-neon-purple/5' },
                        { icon: Heart, label: 'Community', value: about.communityText, color: 'text-white', bgGlow: 'group-hover:bg-white/5' },
                    ].map((stat, idx) => (
                        <BentoItem key={idx} span="md:col-span-2 lg:col-span-3" className={`p-6 sm:p-10 flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-all duration-500 overflow-hidden relative ${stat.bgGlow}`}>
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <stat.icon size={28} className="text-gray-600 mb-6 group-hover:text-white transition-colors duration-500 group-hover:-translate-y-2 relative z-10" />
                            <AnimatedCounter value={stat.value} className={`text-4xl font-black mb-2 tracking-tighter relative z-10 transition-transform duration-500 group-hover:scale-110 ${stat.color}`} />
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em] relative z-10">{stat.label}</p>
                        </BentoItem>
                    ))}

                    {/* Values Tile */}
                    <BentoItem span="md:col-span-4 lg:col-span-6" className="p-8 sm:p-16 flex flex-col justify-center gap-8 bg-neon-cyan/5 border-neon-cyan/10 group hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(34,211,238,0.15)] transition-all duration-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/20 blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-1000" />
                        <div className="space-y-4 relative z-10">
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Core Values</h3>
                            <p className="text-gray-400 text-lg font-light whitespace-pre-wrap group-hover:text-white transition-colors">
                                We operate with transparency, passion, and gratitude.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 relative z-10">
                            <div className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-colors cursor-default">Transparency</div>
                            <div className="px-8 py-4 rounded-full bg-neon-purple/20 border border-neon-purple/30 text-neon-purple font-black uppercase text-[10px] tracking-widest hover:bg-neon-purple hover:text-white transition-colors cursor-default">Passion</div>
                        </div>
                    </BentoItem>

                    {/* Brands & Collaborations */}
                    <BentoItem span="md:col-span-4 lg:col-span-6" className="p-8 sm:p-12 flex flex-col justify-center gap-8 bg-white/5 border-white/10 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)] transition-all duration-700">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/20 blur-[100px] -z-10 group-hover:bg-neon-cyan/20 group-hover:scale-150 transition-all duration-1000" />
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter relative z-10">Brands & Collaborations</h3>
                        <div className="space-y-4 relative z-10">
                            {about.brandsList && about.brandsList.map((brand, idx) => {
                                const hasValidUrl = brand.url && brand.url.trim() !== '' && brand.url !== '#';
                                return (
                                <a key={idx} href={hasValidUrl ? brand.url : undefined} target={hasValidUrl ? "_blank" : undefined} rel="noopener noreferrer" className={`flex items-center gap-4 p-4 rounded-2xl bg-black/20 hover:bg-black/50 border border-transparent hover:border-white/10 transition-all duration-300 ${hasValidUrl ? 'group/link cursor-pointer hover:translate-x-2' : ''}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${getBrandColors(brand.type)}`}>
                                        {renderBrandIcon(brand.type)}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase tracking-widest text-sm">{brand.name}</h4>
                                        <p className="text-gray-500 text-xs uppercase tracking-widest mt-1 group-hover/link:text-gray-400">{brand.role}</p>
                                    </div>
                                </a>
                                );
                            })}
                        </div>
                    </BentoItem>
                </div>

                {/* Social Connect */}
                <div className="relative text-center space-y-16 py-20 mt-20">
                    <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/5 to-transparent blur-[100px] pointer-events-none -z-10" />
                    <h2 
                        className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter uppercase relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(about.joinTitle?.replace(
                                /(Movement)/i,
                                '<span class="neon-text italic drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">$1</span>'
                            ) || 'Join the <span class="neon-text italic drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">Movement</span>')
                        }}
                    />
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 max-w-5xl mx-auto relative z-10">
                        {!socialLoading && socialLinks.filter(l => l.isActive).map(link => (
                            <Magnetic key={link.id}>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`relative group flex items-center justify-center gap-4 w-full sm:w-72 px-8 py-5 rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                                        link.type === 'primary' 
                                            ? 'bg-white/10 border-white/20 hover:border-neon-cyan hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]' 
                                            : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/10'
                                    }`}
                                >
                                    {link.type === 'primary' && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    )}
                                    <span className="relative z-10 text-white group-hover:scale-110 transition-transform duration-300">
                                        {getPlatformIcon(link.platform)}
                                    </span>
                                    <span className="relative z-10 font-black tracking-[0.2em] uppercase text-sm text-white">
                                        {link.platform} {link.type === 'secondary' ? ' (Alt)' : ''}
                                    </span>
                                    <ArrowUpRight size={18} className="relative z-10 text-white/50 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                                </a>
                            </Magnetic>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default About;
