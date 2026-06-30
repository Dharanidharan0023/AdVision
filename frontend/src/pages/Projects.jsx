import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import api from '../api/axios';
import { Calendar, Target, CheckCircle2, Rocket, ArrowUpRight, Zap, Eye, Globe, Download } from 'lucide-react';
import Magnetic from '../components/common/Magnetic';
import BentoItem from '../components/common/BentoItem';
import CoverImage from '../components/CoverImage';

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

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/public/projects');
                if (res.data && res.data.length > 0) {
                    setProjects(res.data);
                } else {
                    setProjects([
                        { id: 1, title: 'AdVision Global', status: 'In Progress', description: 'Expanding our reach with a new digital ecosystem.', imageUrl: '', createdAt: new Date().toISOString() },
                        { id: 2, title: 'Cinematic Redefined', status: 'Completed', description: 'A breakthrough in high-fidelity storytelling.', imageUrl: '', createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
                        { id: 3, title: 'Project Zenith', status: 'Planned', description: 'The next frontier of interactive visual media.', imageUrl: '', createdAt: new Date(Date.now() - 86400000 * 60).toISOString() }
                    ]);
                }
            } catch (err) {
                console.error("Failed to fetch projects:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

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
            <SEO 
                title="Projects"
                description="Explore the architectural roadmap and vision timeline of AdVision Studio."
                url="/projects"
            />
            {/* Cinematic Backgrounds */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div 
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] aurora-bg opacity-20" 
                />
                <div className="mesh-overlay opacity-50" />
            </div>
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-32"
                >
                    <span className="text-neon-cyan text-[10px] font-black uppercase tracking-[0.5em] mb-10 block">Architectural Roadmap</span>
                    <h1 className="text-6xl md:text-[8rem] font-black text-white leading-[0.9] tracking-tighter uppercase relative inline-block">
                        Vision <span className="neon-text italic relative z-10">Timeline</span>
                    </h1>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="bento-grid"
                >
                    {projects.map((project, index) => (
                        <motion.div key={project.id} variants={itemVariants} className={getSpan(index)}>
                            <Link to={`/projects/${(project.category || 'advision').toLowerCase()}`} className="block h-full cursor-none">
                                <div data-cursor="EXPLORE" className="h-full">
                                    <BentoProjectItem project={project} index={index} />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                    
                    {/* Future Vision Tile (Full Width) */}
                    <motion.div variants={itemVariants} className="md:col-span-12 lg:col-span-12">
                        <BentoItem className="glass-modern neon-glow-border p-12 md:p-20 flex flex-col md:flex-row justify-between items-center group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-transparent pointer-events-none" />
                            <div className="relative text-white space-y-8 max-w-2xl text-center md:text-left mb-10 md:mb-0 z-10">
                                <div className="inline-flex items-center justify-center p-5 rounded-3xl bg-neon-purple/10 text-neon-purple border border-neon-purple/20 shadow-inner group-hover:bg-neon-purple/20 transition-colors duration-500">
                                    <Rocket size={36} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">The Next Phase</h3>
                                    <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                                        Strategic exploration into neuro-cinematic experiences and hyper-premium immersive interfaces.
                                    </p>
                                </div>
                            </div>
                            <div className="relative z-10" data-cursor="INITIALIZE">
                                <Magnetic>
                                    <button className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white text-black flex items-center justify-center hover:bg-neon-cyan transition-all duration-700 hover:scale-110 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(0,255,255,0.5)] border border-transparent hover:border-white">
                                        <ArrowUpRight size={48} strokeWidth={1.5} className="group-hover:rotate-45 transition-transform duration-700" />
                                    </button>
                                </Magnetic>
                            </div>
                        </BentoItem>
                    </motion.div>
                </motion.div>
            </div>
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
                {project.imageUrl && (
                    <CoverImage 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
                    />
                )}
                {!project.imageUrl && (
                    <div className="w-full h-full bg-gradient-to-br from-neon-purple/10 to-neon-cyan/5 group-hover:opacity-50 transition-opacity duration-1000" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-dark-bg/30 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 h-full p-10 md:p-14 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 backdrop-blur-md shadow-lg ${
                        isCompleted ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
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
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase group-hover:text-neon-cyan transition-colors duration-700 blur-[0.5px] group-hover:blur-0 translate-y-8 group-hover:translate-y-0 transition-all">
                        {project.title}
                    </h2>
                    <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 h-0 group-hover:h-auto overflow-hidden">
                        <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-lg line-clamp-3 group-hover:text-white transition-colors duration-500 mb-4">
                            {project.description}
                        </p>
                        {project.apkUrl && (
                            <div className="pt-2">
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.open(project.apkUrl, '_blank');
                                    }}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neon-cyan/10 text-neon-cyan text-[10px] font-black uppercase tracking-[0.2em] border border-neon-cyan/20 hover:bg-neon-cyan/20 transition-colors z-30 relative cursor-pointer"
                                >
                                    <Download size={14} /> Download APK
                                </button>
                            </div>
                        )}
                    </div>
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

export default Projects;
