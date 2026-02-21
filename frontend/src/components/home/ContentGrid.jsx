import { motion } from 'framer-motion';
import { ArrowRight, Calendar, ExternalLink, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContentGrid = ({ items = [] }) => {

    const getCardContent = (item) => {
        switch (item.type) {
            case 'project':
                return (
                    <div className="h-full flex flex-col">
                        <div className="relative h-48 overflow-hidden rounded-t-xl group">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white uppercase font-bold border border-white/10">
                                {item.status || 'Project'}
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col bg-dark-card rounded-b-xl border border-t-0 border-white/10">
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">{item.description}</p>
                            <Link to={`/projects/${item.id}`} className="text-neon-cyan text-sm font-bold flex items-center gap-2 hover:underline">
                                View Details <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                );
            case 'post':
                return (
                    <div className="h-full bg-dark-card p-6 rounded-xl border border-white/10 hover:border-neon-purple/50 transition-colors flex flex-col">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 uppercase tracking-wider">
                            <Calendar size={12} />
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently'}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-3 hover:text-neon-purple transition-colors">
                            <Link to={`/posts/${item.id}`}>{item.title}</Link>
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">{item.content}</p>
                        <Link to={`/posts/${item.id}`} className="text-neon-purple text-sm font-bold flex items-center gap-2 hover:underline mt-auto">
                            Read Article <ArrowRight size={16} />
                        </Link>
                    </div>
                );
            case 'announcement':
                return (
                    <div className="h-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 p-6 rounded-xl border border-white/10 flex flex-col justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-neon-cyan blur-[60px] opacity-20"></div>
                        <Zap className="mx-auto text-neon-cyan mb-4" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-300 text-sm">{item.description}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <section className="py-20 bg-dark-bg">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Latest <span className="neon-text">Updates</span></h2>
                        <p className="text-gray-400">Fresh from the studio.</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="h-full"
                        >
                            {getCardContent(item)}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContentGrid;
