import { motion } from 'framer-motion';
import { Youtube, Instagram, Heart, Users, Video, Eye, Sparkles, Target, Globe, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Magnetic from '../components/common/Magnetic';
import BentoItem from '../components/common/BentoItem';

const About = () => {
    return (
        <div className="min-h-screen pt-40 pb-32 bg-dark-bg px-6 overflow-hidden relative">
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
                        Our Narrative Origin
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                        The <span className="neon-text italic">Studio</span>
                    </h1>
                    <p className="mt-12 text-xl md:text-3xl text-gray-500 italic font-light max-w-3xl mx-auto uppercase tracking-tighter leading-tight">
                        "Ellam pugazhum iraivanukke" <br />
                        <span className="text-white opacity-20">— All glory to God —</span>
                    </p>
                </motion.div>

                {/* Bento About Grid */}
                <div className="bento-grid mb-32">
                    {/* Story Tile */}
                    <BentoItem span="md:col-span-4 lg:col-span-8" className="min-h-[500px] p-16 flex flex-col justify-end group">
                        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
                            <img src="https://images.unsplash.com/photo-1492691523569-44058d45e3ea?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-10 grayscale group-hover:opacity-20 transition-all duration-1000" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                        </div>
                        <div className="space-y-8 relative">
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase">Our Story</h2>
                            <p className="text-gray-400 text-xl font-light leading-relaxed max-w-2xl">
                                Based in the vibrant heart of India, <span className="text-neon-cyan font-bold">AdVision Studio</span> is a hub for visual storytelling. Since <span className="text-white font-medium">October 4, 2023</span>, we have crafted digital experiences that resonate and inspire.
                            </p>
                        </div>
                    </BentoItem>

                    {/* Mission Tile */}
                    <BentoItem span="md:col-span-4 lg:col-span-4" className="bg-white p-12 flex flex-col justify-between group">
                        <div className="text-black space-y-6">
                            <Target size={32} className="text-neon-purple" />
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">The <br /> Mission</h3>
                            <p className="text-black/50 text-sm font-medium leading-relaxed">
                                To blend creativity with purpose. Bringing visions to life with authenticity and modern flair.
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black group-hover:bg-neon-purple group-hover:text-black transition-all">
                            <Globe size={24} />
                        </div>
                    </BentoItem>

                    {/* Stats Tiles */}
                    {[
                        { icon: Users, label: 'Subscribers', value: '1.09K+', color: 'text-neon-cyan' },
                        { icon: Video, label: 'Videos', value: '105+', color: 'text-white' },
                        { icon: Eye, label: 'Views', value: '274K+', color: 'text-neon-purple' },
                        { icon: Heart, label: 'Community', value: 'Rising', color: 'text-white' },
                    ].map((stat, idx) => (
                        <BentoItem key={idx} span="md:col-span-2 lg:col-span-3" className="p-10 flex flex-col items-center justify-center text-center group">
                            <stat.icon size={24} className="text-gray-600 mb-6 group-hover:scale-110 transition-transform" />
                            <h4 className={`text-4xl font-black mb-2 tracking-tighter ${stat.color}`}>{stat.value}</h4>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em]">{stat.label}</p>
                        </BentoItem>
                    ))}

                    {/* Values Tile */}
                    <BentoItem span="md:col-span-4 lg:col-span-12" className="p-16 flex flex-col md:flex-row items-center justify-between gap-12 bg-neon-cyan/5 border-neon-cyan/10">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Core Values</h3>
                            <p className="text-gray-500 text-lg font-light max-w-xl">
                                We operate with transparency, passion, and gratitude. We believe creativity is a divine gift to be shared with the world.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest">Transparency</div>
                            <div className="px-8 py-4 rounded-2xl bg-neon-purple/20 border border-neon-purple/30 text-neon-purple font-black uppercase text-[10px] tracking-widest">Passion</div>
                        </div>
                    </BentoItem>
                </div>

                {/* Social Connect */}
                <div className="text-center space-y-16">
                    <h2 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase">
                        Join the <span className="neon-text italic">Movement</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-8 max-w-3xl mx-auto">
                        <Magnetic>
                            <a
                                href="https://youtube.com/@advisionstudio"
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
                                href="https://www.instagram.com/visionofad"
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
        </div>
    );
};

export default About;
