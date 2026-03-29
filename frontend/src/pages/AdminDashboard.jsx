import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import Sidebar from '../components/admin/Sidebar';
import StatsCard from '../components/admin/StatsCard';
import DataTable from '../components/admin/DataTable';
import PostForm from '../components/admin/PostForm';
import ProjectForm from '../components/admin/ProjectForm';
import HomeSettings from '../components/admin/HomeSettings';
import AboutSettings from '../components/admin/AboutSettings';
import StoryForm from '../components/admin/StoryForm';
import ChapterManager from '../components/admin/ChapterManager';
import { FileText, Briefcase, Plus, BookOpen, Layers, Wifi, WifiOff, AlertCircle, RefreshCw, Activity, Terminal, Shield } from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState('overview');
    const [items, setItems] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [stats, setStats] = useState({ posts: 0, projects: 0, stories: 0 });
    const [activeStoryForChapters, setActiveStoryForChapters] = useState(null);
    
    // Connection State
    const [connectionStatus, setConnectionStatus] = useState('checking'); // checking | online | offline
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        if (!loading && !user) navigate('/admin');
    }, [user, loading, navigate]);

    // Check Backend Connection
    const checkConnection = async () => {
        try {
            const res = await api.get('/health');
            if (res.data.status === 'OK') {
                setConnectionStatus('online');
                setFetchError(null);
                return true;
            }
            throw new Error(res.data.database || 'Database connection issue');
        } catch (err) {
            setConnectionStatus('offline');
            setFetchError("Backend is unreachable. Please check if the server is running.");
            return false;
        }
    };

    // Fetch Data
    const fetchData = async () => {
        if (!user) return;
        setFetchError(null);
        
        const isOnline = await checkConnection();
        if (!isOnline) return;

        try {
            if (activeTab === 'overview') {
                const [postsRes, projectsRes, storiesRes] = await Promise.all([
                    api.get('/public/posts'),
                    api.get('/public/projects'),
                    api.get('/public/stories')
                ]);
                setStats({
                    posts: postsRes.data.length,
                    projects: projectsRes.data.length,
                    stories: storiesRes.data.length
                });
            } else {
                let res;
                if (activeTab === 'posts') res = await api.get('/public/posts');
                else if (activeTab === 'projects') res = await api.get('/public/projects');
                else if (activeTab === 'stories') res = await api.get('/public/stories');
                
                if (res) setItems(res.data);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setFetchError(`Failed to load ${activeTab} data. ${err.message}`);
        }
    };

    useEffect(() => {
        fetchData();
        setIsFormOpen(false);
        setEditingItem(null);
        setActiveStoryForChapters(null);
    }, [activeTab, user]);

    // Handlers
    const [deleteNode, setDeleteNode] = useState(null); // { id, title }

    const handleDelete = async () => {
        if (!deleteNode) return;
        try {
            let endpoint;
            if (activeTab === 'posts') endpoint = `/admin/posts/${deleteNode.id}`;
            else if (activeTab === 'projects') endpoint = `/admin/projects/${deleteNode.id}`;
            else if (activeTab === 'stories') endpoint = `/admin/stories/${deleteNode.id}`;
            
            await api.delete(endpoint);
            setDeleteNode(null);
            fetchData();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete item. " + (err.response?.data?.error || err.message));
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            let endpoint;
            if (activeTab === 'posts') endpoint = '/admin/posts';
            else if (activeTab === 'projects') endpoint = '/admin/projects';
            else if (activeTab === 'stories') endpoint = '/admin/stories';

            if (editingItem) {
                await api.put(`${endpoint}/${editingItem.id}`, formData);
            } else {
                await api.post(endpoint, formData);
            }

            setIsFormOpen(false);
            fetchData();
        } catch (err) {
            console.error("Operation failed:", err);
            alert("Failed to save item. " + (err.response?.data?.error || err.message));
        }
    };

    // Columns Configuration
    const postColumns = [
        { header: 'Title', accessor: 'title' },
        { header: 'Featured', accessor: 'featured', render: (item) => item.featured ? <span className="text-neon-purple shadow-[0_0_10px_rgba(176,38,255,0.4)]">Primary</span> : 'Standard' },
        { header: 'Timestamp', accessor: 'createdAt', render: (item) => new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }
    ];
    const projectColumns = [
        { header: 'Title', accessor: 'title' },
        {
            header: 'Status', accessor: 'status', render: (item) => (
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        item.status === 'In Progress' ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                    {item.status}
                </span>
            )
        },
    ];

    const storyColumns = [
        { header: 'Title', accessor: 'title' },
        { header: 'Genre', accessor: 'genre' },
        { header: 'Chapters', accessor: 'chapters', render: (item) => (
            <button 
                onClick={(e) => { e.stopPropagation(); setActiveStoryForChapters(item); }}
                className="flex items-center gap-2 bg-neon-purple/10 text-neon-purple px-4 py-2 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-neon-purple/20 transition-all border border-neon-purple/20"
            >
                <Layers size={14} /> Manage ({item._count?.chapters || 0})
            </button>
        )},
    ];

    if (loading || !user) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-10 h-10 border-2 border-neon-cyan border-t-transparent rounded-full shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg text-gray-200 font-sans flex flex-col lg:flex-row overflow-hidden">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />

            <main className="flex-1 lg:ml-72 p-6 md:p-10 pt-28 lg:pt-10 h-screen overflow-y-auto custom-scrollbar no-scrollbar">
                <div className="max-w-7xl mx-auto space-y-12 pb-20">

                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-white/5 pb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                                    <Shield size={18} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Workspace / {activeTab}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white capitalize tracking-tighter leading-none italic">
                                {activeTab === 'overview' ? 'Systems' : activeTab}
                                <span className="text-neon-cyan">.</span>
                            </h1>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            {/* Connection Badge */}
                            <div className="flex flex-col items-end gap-2">
                                <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-3 ${
                                    connectionStatus === 'online' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                    connectionStatus === 'offline' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-gray-500/10 text-gray-500 border border-white/5'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${connectionStatus === 'online' ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                                    {connectionStatus === 'online' ? 'Uplink Stable' : 'Link Failure'}
                                </div>
                                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-600">Local Auth Protocol 2.4</span>
                            </div>

                            {(activeTab === 'posts' || activeTab === 'projects' || activeTab === 'stories') && !isFormOpen && !activeStoryForChapters && (
                                <button
                                    onClick={handleCreate}
                                    className="group flex items-center gap-4 bg-white text-black px-8 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] hover:bg-neon-cyan transition-all duration-500 shadow-[0_20px_40px_rgba(255,255,255,0.05)] hover:shadow-[0_20px_40px_rgba(0,255,255,0.2)]"
                                >
                                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                                    <span>Initialize</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Error Banner */}
                    <AnimatePresence>
                        {fetchError && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-6 flex items-center justify-between gap-4 backdrop-blur-md"
                            >
                                <div className="flex items-center gap-4 text-red-500">
                                    <AlertCircle size={24} />
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black uppercase tracking-widest">Protocol Failure</p>
                                        <p className="text-[10px] font-bold text-red-400/60 uppercase">{fetchError}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={fetchData} 
                                    className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-red-400 transition-all flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em]"
                                >
                                    <RefreshCw size={14} /> Retry Uplink
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Content Section */}
                    <div className="relative z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab + isFormOpen}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="min-h-[500px]"
                            >
                                {activeTab === 'overview' && (
                                    <div className="bento-grid">
                                        <div className="md:col-span-4 lg:col-span-4 h-full">
                                            <StatsCard title="Primary Records" value={stats.posts} icon={FileText} color="text-neon-purple" />
                                        </div>
                                        <div className="md:col-span-4 lg:col-span-4 h-full">
                                            <StatsCard title="Vision Assets" value={stats.projects} icon={Briefcase} color="text-neon-cyan" />
                                        </div>
                                        <div className="md:col-span-4 lg:col-span-4 h-full">
                                            <StatsCard title="Narrative Streams" value={stats.stories} icon={BookOpen} color="text-white" />
                                        </div>
                                        
                                        {/* Dashboard Secondary Node */}
                                        <div className="md:col-span-8 lg:col-span-8 bento-item p-10 flex flex-col justify-between group">
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neon-cyan border border-white/5">
                                                        <Activity size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white">System Heartbeat</h3>
                                                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">Real-time resource allocation</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                                                    {[
                                                        { label: 'Uplink', val: '99.9%', color: 'text-green-500' },
                                                        { label: 'Storage', val: '2.4TB', color: 'text-white' },
                                                        { label: 'Latency', val: '12ms', color: 'text-neon-cyan' },
                                                        { label: 'Threats', val: '0', color: 'text-neon-purple' }
                                                    ].map((stat, i) => (
                                                        <div key={i} className="space-y-1">
                                                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{stat.label}</p>
                                                            <p className={`text-xl font-black ${stat.color}`}>{stat.val}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                                        <div key={i} className={`w-1 h-4 rounded-full ${i < 5 ? 'bg-neon-cyan opacity-40' : 'bg-white/5'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-neon-cyan animate-pulse">Encryption: AES-256</span>
                                            </div>
                                        </div>
                                        
                                        <div className="md:col-span-4 lg:col-span-4 bento-item bg-white p-10 flex flex-col justify-between overflow-hidden group">
                                            <div className="text-black space-y-4">
                                                <Terminal size={32} />
                                                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Console <br /> Overload</h3>
                                                <p className="text-[10px] font-bold text-black/40 uppercase leading-relaxed max-w-[120px]">Developer bypass enabled for root nodes.</p>
                                            </div>
                                            <button className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center hover:bg-neon-cyan hover:text-black transition-all duration-500 self-end">
                                               <Shield size={20} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'home' && (
                                    <div className="bento-item p-10">
                                        <HomeSettings />
                                    </div>
                                )}

                                {activeTab === 'about' && (
                                    <div className="bento-item p-10">
                                        <AboutSettings />
                                    </div>
                                )}

                                {activeTab === 'stories' && activeStoryForChapters ? (
                                    <div className="bento-item p-10">
                                        <ChapterManager story={activeStoryForChapters} onBack={() => { setActiveStoryForChapters(null); fetchData(); }} />
                                    </div>
                                ) : (activeTab === 'posts' || activeTab === 'projects' || activeTab === 'stories') && (
                                    <div className="bento-item overflow-hidden">
                                        {isFormOpen ? (
                                            <div className="p-10">
                                                <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-8">
                                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                                                        {editingItem ? 'Override' : 'Initialize'} Node
                                                    </h3>
                                                    <button onClick={() => setIsFormOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Abort Mission</button>
                                                </div>
                                                {activeTab === 'posts' ? (
                                                    <PostForm initialData={editingItem} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
                                                ) : activeTab === 'projects' ? (
                                                    <ProjectForm initialData={editingItem} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
                                                ) : (
                                                    <StoryForm initialData={editingItem} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
                                                )}
                                            </div>
                                        ) : (
                                            <DataTable
                                                columns={activeTab === 'posts' ? postColumns : activeTab === 'projects' ? projectColumns : storyColumns}
                                                data={items}
                                                onEdit={handleEdit}
                                                onDelete={(id) => setDeleteNode({ id })}
                                            />
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Custom Confirm Modal */}
            <AnimatePresence>
                {deleteNode && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0a0a0f] border border-white/5 p-12 rounded-[3.5rem] max-w-lg w-full shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500/20" />
                            
                            <div className="text-center space-y-8">
                                <div className="inline-flex p-6 rounded-3xl bg-red-500/5 text-red-500 border border-red-500/10">
                                    <AlertCircle size={40} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Confirm <span className="text-red-500">Purge</span></h3>
                                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 leading-relaxed mx-auto max-w-[300px]">
                                        This protocol will irreversibly destroy the selected data node. Proceed with caution.
                                    </p>
                                </div>
                                
                                <div className="flex flex-col gap-4 pt-4">
                                    <button 
                                        onClick={handleDelete}
                                        className="w-full bg-red-500 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.4em] hover:bg-red-600 transition-all shadow-[0_20px_40px_rgba(239,68,68,0.2)] focus:ring-4 ring-red-500/20"
                                    >
                                        Execute Purge
                                    </button>
                                    <button 
                                        onClick={() => setDeleteNode(null)}
                                        className="w-full bg-white/5 border border-white/5 text-gray-400 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.4em] hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        Abort Session
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
