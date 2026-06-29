import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, Navigate } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, Target, CheckCircle2, Rocket, ArrowUpRight, X, ExternalLink, Github } from 'lucide-react';
import Magnetic from '../components/common/Magnetic';
import BentoItem from '../components/common/BentoItem';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const getSpan = (index) => {
    const spans = [
        "md:col-span-8 lg:col-span-8",
        "md:col-span-4 lg:col-span-4",
        "md:col-span-4 lg:col-span-4",
        "md:col-span-8 lg:col-span-8",
    ];
    return spans[index % spans.length];
};

const ProjectCategory = () => {
    const { category } = useParams();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);

    const validCategories = {
        'advision': 'AdVision',
        'qubit': 'Qubit',
        'future': 'Future Projects'
    };

    const actualCategory = validCategories[category?.toLowerCase()];

    useEffect(() => {
        if (!actualCategory) return;
        
        const fetchProjects = async () => {
            try {
                const projRes = await api.get(`/public/projects?category=${actualCategory}`);
                setProjects(projRes.data || []);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [actualCategory]);

    if (!actualCategory) {
        return <Navigate to="/projects" replace />;
    }

    const filteredProjects = projects.filter(p => activeFilter === 'All' || p.status === activeFilter);

    if (loading) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-10 h-10 border-2 border-neon-cyan border-t-transparent rounded-full shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            />
        </div>
    );

    return (
        <div className="min-h-screen pt-40 px-6 bg-dark-bg pb-32 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-0 mb-10">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/projects" className="text-sm uppercase tracking-[0.35em] text-neon-cyan font-black hover:text-white transition">
                        ← Back to Projects
                    </Link>
                </div>
            </div>
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="aurora-bg opacity-30" />
                <div className="mesh-overlay opacity-50" />
            </div>
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-16"
                >
                    <span className="text-neon-cyan text-[10px] font-black uppercase tracking-[0.5em] mb-10 block">
                        Category Archive
                    </span>
                    <h1 className="text-6xl md:text-[8rem] font-black text-white leading-[0.9] tracking-tighter uppercase relative inline-block mb-16">
                        {actualCategory}
                    </h1>

                    <div className="flex flex-wrap justify-center gap-4">
                        {['All', 'Completed', 'In Progress', 'Planned'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeFilter === filter ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'border border-white/10 text-white/50 hover:text-white hover:border-white/30 backdrop-blur-md'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {projects.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-gray-500 text-xl font-medium tracking-widest uppercase">No projects deployed in this category yet.</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="bento-grid"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project, index) => (
                                <motion.div 
                                    key={project.id} 
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4 }}
                                    className={getSpan(index)}
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <div data-cursor="EXPLORE" className="h-full cursor-pointer">
                                        <BentoProjectItem project={project} index={index} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Quick View Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-dark-card border border-white/10 p-8 md:p-12 rounded-[3rem] w-full max-w-4xl relative overflow-hidden glass-modern shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                        >
                            <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-colors z-20">
                                <X size={24} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="h-64 md:h-full rounded-3xl overflow-hidden relative">
                                    {selectedProject.imageUrl ? (
                                        <img src={selectedProject.imageUrl} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full bg-neon-purple/20" />
                                    )}
                                </div>
                                <div className="flex flex-col justify-center space-y-6 py-6">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">{selectedProject.title}</h2>
                                    <div className="flex gap-4">
                                        <span className="px-4 py-1.5 rounded-full bg-neon-cyan/10 text-neon-cyan text-[10px] font-black uppercase tracking-widest border border-neon-cyan/20">
                                            {selectedProject.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 leading-relaxed text-sm">{selectedProject.description}</p>
                                    
                                    <div className="pt-6 flex flex-wrap gap-4">
                                        {selectedProject.websiteUrl && (
                                            <a href={selectedProject.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2">
                                                Live Site <ExternalLink size={16} />
                                            </a>
                                        )}
                                        {selectedProject.githubUrl && (
                                            <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-2">
                                                Github <Github size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const BentoProjectItem = ({ project, index }) => {
    const isCompleted = project.status === 'Completed';

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Completed': return <CheckCircle2 size={16} strokeWidth={2.5} />;
            case 'In Progress': return <Target size={16} strokeWidth={2.5} />;
            default: return <Rocket size={16} strokeWidth={2.5} />;
        }
    };

    return (
        <BentoItem span="" className="glass-modern neon-glow-border group min-h-[500px] md:min-h-[600px] p-0 overflow-hidden h-full">
            <div className="absolute inset-0 w-full h-full z-0">
                {project.imageUrl ? (
                    <img src={project.imageUrl} className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-105" alt="" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neon-purple/10 to-neon-cyan/5 group-hover:opacity-50 transition-opacity duration-1000" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-dark-bg/30 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 h-full p-10 md:p-14 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 backdrop-blur-md shadow-lg ${
                        isCompleted ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-pulse' : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                    }`}>
                        {getStatusIcon(project.status)}
                        {project.status}
                    </div>
                    <div className="text-white/20 text-xs font-black uppercase tracking-widest group-hover:text-white transition-colors">
                        / 0{index + 1}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-neon-purple text-[10px] font-black uppercase tracking-[0.4em]">
                        <Calendar size={14} className="opacity-80" /> 
                        {project.createdAt && !isNaN(new Date(project.createdAt)) 
                            ? new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                            : 'Nov 2024'}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase group-hover:text-neon-cyan transition-colors duration-700 blur-[0.5px] group-hover:blur-0">
                        {project.title}
                    </h2>
                    <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-lg line-clamp-3 group-hover:text-white transition-colors duration-500">
                        {project.description}
                    </p>
                </div>
            </div>
            
            {/* Minimal Hover Indicator */}
            <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 z-20">
                <Magnetic>
                    <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform">
                        <ArrowUpRight size={28} />
                    </div>
                </Magnetic>
            </div>
        </BentoItem>
    );
};

export default ProjectCategory;
