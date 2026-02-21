import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Mock data if API fails or is empty for demo purposes
                const res = await api.get('/public/projects');
                if (res.data && res.data.length > 0) {
                    setProjects(res.data);
                } else {
                    // Fallback mock data for visualization
                    setProjects([
                        { id: 1, title: 'AdVision Website', status: 'In Progress', description: 'Building the official portfolio site with React and Node.js.', imageUrl: '', createdAt: new Date().toISOString() },
                        { id: 2, title: 'YouTube Revamp', status: 'Completed', description: 'Complete channel rebranding with new intro and outro sequences.', imageUrl: '', createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
                        { id: 3, title: 'Project Neon', status: 'Planned', description: 'Upcoming short film project exploring cyberpunk themes.', imageUrl: '', createdAt: new Date(Date.now() - 86400000 * 60).toISOString() }
                    ]);
                }
            } catch (err) {
                console.error("Failed to fetch projects:", err);
                // Fallback mock data
                setProjects([
                    { id: 1, title: 'AdVision Website', status: 'In Progress', description: 'Building the official portfolio site with React and Node.js.', imageUrl: '', createdAt: new Date().toISOString() },
                    { id: 2, title: 'YouTube Revamp', status: 'Completed', description: 'Complete channel rebranding with new intro and outro sequences.', imageUrl: '', createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
                    { id: 3, title: 'Project Neon', status: 'Planned', description: 'Upcoming short film project exploring cyberpunk themes.', imageUrl: '', createdAt: new Date(Date.now() - 86400000 * 60).toISOString() }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) return <div className="text-white pt-32 text-center text-xl">Loading timeline...</div>;

    return (
        <div className="min-h-screen pt-24 px-6 bg-dark-bg pb-20 overflow-x-hidden">
            <div className="container mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-16 text-center"
                >
                    Future <span className="neon-text">Plans</span>
                </motion.h1>

                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-purple via-neon-cyan to-transparent opacity-30 transform md:-translate-x-1/2"></div>

                    {projects.map((project, index) => (
                        <TimelineItem key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const TimelineItem = ({ project, index }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`flex flex-col md:flex-row items-center justify-between mb-16 relative ${isEven ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Timeline Dot */}
            <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-dark-bg border-4 border-neon-cyan shadow-[0_0_15px_#00ffff] transform -translate-x-1/2 md:-translate-x-1/2 z-10 mt-[-150px] md:mt-0"></div>

            {/* Content Card */}
            <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${isEven ? 'md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'}`}>
                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-neon-cyan/50 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]">
                    <div className={`flex flex-col ${isEven ? 'md:items-end' : 'md:items-start'}`}>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full mb-3 w-fit border ${project.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                            project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                                'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            }`}>
                            {project.status}
                        </span>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">{project.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>
                        {project.imageUrl && (
                            <div className="overflow-hidden rounded-lg w-full h-48 relative border border-white/5 bg-black/40 group-hover:border-neon-cyan/30 transition-colors">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs uppercase tracking-widest z-0 animate-pulse">
                                    Loading Image
                                </div>
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-full h-full object-cover opacity-0 group-hover:scale-110 transition-all duration-700 relative z-10"
                                    onLoad={(e) => {
                                        e.target.style.opacity = '0.8';
                                        e.target.parentElement.querySelector('div').style.display = 'none';
                                        // add a group-hover class equivalent inline for when hovered
                                        e.target.addEventListener('mouseenter', () => e.target.style.opacity = '1');
                                        e.target.addEventListener('mouseleave', () => e.target.style.opacity = '0.8');
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.querySelector('div').innerText = 'Image Unavailable';
                                        e.target.parentElement.querySelector('div').className = "absolute inset-0 flex items-center justify-center text-red-500/50 text-xs tracking-widest z-0";
                                        e.target.parentElement.querySelector('div').style.display = 'flex';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-dark-bg/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Empty space for the other side */}
            <div className="w-full md:w-[45%] hidden md:block"></div>
        </motion.div>
    );
};

export default Projects;
