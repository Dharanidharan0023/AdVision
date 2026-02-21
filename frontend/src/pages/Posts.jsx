import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { Calendar, User, PlayCircle, X } from 'lucide-react';

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
        // Extract ID
        const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/)([\w-]{11}))/);
        if (videoIdMatch && videoIdMatch[1]) {
            setActiveVideo(videoIdMatch[1]);
        } else {
            window.open(videoUrl, '_blank');
        }
    };

    if (loading) return <div className="text-white pt-32 text-center text-xl">Loading posts...</div>;

    return (
        <div className="min-h-screen pt-24 px-6 bg-dark-bg pb-20">
            <div className="container mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
                >
                    Latest <span className="neon-text">Updates</span>
                </motion.h1>

                {posts.length === 0 ? (
                    <div className="text-center text-gray-500 text-xl mt-12">
                        No posts available yet. Stay tuned!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-panel rounded-2xl overflow-hidden hover:border-neon-purple/50 transition-all duration-300 group relative"
                            >
                                {post.imageUrl && (
                                    <div
                                        className="h-48 overflow-hidden relative cursor-pointer"
                                        onClick={() => post.videoUrl && handleVideoClick(post.videoUrl)}
                                    >
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {post.videoUrl && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                                <PlayCircle size={48} className="text-white drop-shadow-lg opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors">
                                        {post.title}
                                    </h2>
                                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User size={14} />
                                            <span>Admin</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 line-clamp-3 mb-4">
                                        {post.content}
                                    </p>
                                    <button
                                        onClick={() => post.videoUrl ? handleVideoClick(post.videoUrl) : null}
                                        className="text-neon-purple font-medium hover:text-neon-cyan transition-colors flex items-center gap-2"
                                    >
                                        {post.videoUrl ? 'Watch Video' : 'Read More'} {post.videoUrl && <PlayCircle size={16} />}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setActiveVideo(null)}
                    >
                        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-neon-purple/20">
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="absolute top-4 right-4 text-white/50 hover:text-white z-10"
                            >
                                <X size={32} />
                            </button>
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                                title="YouTube Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Posts;
