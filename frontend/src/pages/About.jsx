import { motion } from 'framer-motion';
import { Youtube, Instagram, Heart, Users, Video, Eye } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-dark-bg px-6">
            <div className="container mx-auto max-w-4xl">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        About <span className="neon-text">AdVision Studio</span>
                    </h1>
                    <p className="text-xl text-gray-400 italic">
                        "Ellam pugazhum iraivanukke" — All glory to God.
                    </p>
                </motion.div>

                {/* Main Content */}
                <div className="glass-panel p-8 md:p-12 rounded-3xl mb-16 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            Based in the vibrant heart of India, <span className="text-neon-cyan font-medium">AdVision Studio</span> is more than just a creative agency—we are a hub for visual storytelling. Since our inception on <span className="text-white">October 4, 2023</span>, we have been dedicated to crafting digital experiences that resonate, inspire, and engage. We believe that every frame has a story, and every story deserves to be heard.
                        </p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
                            <p className="text-gray-400">
                                To blend creativity with purpose. Whether it's through dynamic video content or immersive digital media, our goal is to bring visions to life with authenticity and modern flair.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-3">Our Values</h3>
                            <p className="text-gray-400">
                                Rooted in a strong ethical foundation, we operate with transparency, passion, and gratitude. Our journey is driven by the belief that creativity is a divine gift to be shared.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                >
                    {[
                        { icon: Users, label: 'Subscribers', value: '1.09K+' },
                        { icon: Video, label: 'Videos', value: '105+' },
                        { icon: Eye, label: 'Total Views', value: '274K+' },
                        { icon: Heart, label: 'Community', value: 'Growing' },
                    ].map((stat, index) => (
                        <div key={index} className="glass-panel p-6 rounded-2xl text-center hover:border-neon-purple/50 transition-colors">
                            <div className="inline-flex p-3 rounded-full bg-white/5 text-neon-purple mb-3">
                                <stat.icon size={24} />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-1">{stat.value}</h4>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Social Connect */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">Connect With Us</h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <a
                            href="https://youtube.com/@advisionstudio?si=dKUNy1q96t-2v8jY"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-[#FF0000] text-white px-8 py-4 rounded-full font-bold hover:bg-[#CC0000] transition-transform hover:scale-105 shadow-lg shadow-red-500/20"
                        >
                            <Youtube size={24} />
                            Subscribe on YouTube
                        </a>
                        <a
                            href="https://www.instagram.com/visionofad?igsh=YTJ1cjYxYjMxdXI5"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-transform hover:scale-105 shadow-lg shadow-pink-500/20"
                        >
                            <Instagram size={24} />
                            Follow on Instagram
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;
