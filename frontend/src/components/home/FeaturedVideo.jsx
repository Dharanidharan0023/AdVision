import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const FeaturedVideo = ({ videoUrl, title, description }) => {
    // Default video if none provided
    const videoId = videoUrl ? videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/)([\w-]{11}))/)?.[1] : 'dQw4w9WgXcQ'; // Replace with actual default later

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* Video Container */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-2/3 relative group"
                    >
                        {/* Neon Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple to-neon-cyan opacity-30 group-hover:opacity-60 blur-xl transition-opacity duration-500 rounded-2xl"></div>

                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="Featured Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-1/3"
                    >
                        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Play size={100} />
                            </div>

                            <h3 className="text-neon-cyan text-sm font-bold uppercase tracking-wider mb-2">Featured Content</h3>
                            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">{title || "Why You Should Watch This"}</h2>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                {description || "Dive into our latest deep dive on software architecture. We explore the nuances of modern web development and how to build scalable systems."}
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-white">10K+</span>
                                    <span className="text-xs text-gray-500 uppercase">Views</span>
                                </div>
                                <div className="w-px h-10 bg-white/10"></div>
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-white">500+</span>
                                    <span className="text-xs text-gray-500 uppercase">Likes</span>
                                </div>
                                <button className="ml-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedVideo;
