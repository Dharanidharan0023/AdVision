import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/admin/Sidebar';
import StatsCard from '../components/admin/StatsCard';
import DataTable from '../components/admin/DataTable';
import PostForm from '../components/admin/PostForm';
import ProjectForm from '../components/admin/ProjectForm';
import { FileText, Briefcase, Plus } from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState('overview');
    const [items, setItems] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [stats, setStats] = useState({ posts: 0, projects: 0 });

    useEffect(() => {
        if (!loading && !user) navigate('/admin');
    }, [user, loading, navigate]);

    // Fetch Data
    const fetchData = async () => {
        if (!user) return;
        try {
            if (activeTab === 'overview') {
                const [postsRes, projectsRes] = await Promise.all([
                    api.get('/public/posts'),
                    api.get('/public/projects')
                ]);
                setStats({
                    posts: postsRes.data.length,
                    projects: projectsRes.data.length
                });
            } else if (activeTab === 'posts') {
                const res = await api.get('/public/posts');
                setItems(res.data);
            } else if (activeTab === 'projects') {
                const res = await api.get('/public/projects');
                setItems(res.data);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchData();
        // Reset form state when tab changes
        setIsFormOpen(false);
        setEditingItem(null);
    }, [activeTab, user]);

    // Handlers
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            const endpoint = activeTab === 'posts' ? `/admin/posts/${id}` : `/admin/projects/${id}`;
            await api.delete(endpoint);
            fetchData(); // Refresh list
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete item.");
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
            const endpoint = activeTab === 'posts' ? '/admin/posts' : '/admin/projects';

            if (editingItem) {
                // Update
                await api.put(`${endpoint}/${editingItem.id}`, formData);
            } else {
                // Create
                await api.post(endpoint, formData);
            }

            setIsFormOpen(false);
            fetchData(); // Refresh list
        } catch (err) {
            console.error("Operation failed:", err);
            alert("Failed to save item. Check console for details.");
        }
    };

    // Columns Configuration
    const postColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Title', accessor: 'title' },
        { header: 'Featured', accessor: 'featured', render: (item) => item.featured ? <span className="text-neon-cyan">Yes</span> : 'No' },
        { header: 'Created At', accessor: 'createdAt', render: (item) => new Date(item.createdAt).toLocaleDateString() } // Assuming createdAt exists
    ];

    const projectColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Title', accessor: 'title' },
        {
            header: 'Status', accessor: 'status', render: (item) => (
                <span className={`px-2 py-1 rounded text-xs ${item.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                    {item.status}
                </span>
            )
        },
    ];

    if (loading || !user) return <div className="text-white pt-24 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-dark-bg text-gray-200 font-sans flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />

            <div className="flex-1 ml-64 p-8 pt-24">
                <div className="max-w-6xl mx-auto">

                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white capitalize">{activeTab}</h1>
                        {(activeTab === 'posts' || activeTab === 'projects') && !isFormOpen && (
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 bg-neon-purple text-white px-4 py-2 rounded-lg hover:bg-neon-purple/80 transition-shadow shadow-lg shadow-neon-purple/20"
                            >
                                <Plus size={18} />
                                <span>Create New</span>
                            </button>
                        )}
                    </div>

                    {/* Content Section */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatsCard title="Total Posts" value={stats.posts} icon={FileText} color="text-neon-purple" />
                            <StatsCard title="Total Projects" value={stats.projects} icon={Briefcase} color="text-neon-cyan" />
                        </div>
                    )}

                    {(activeTab === 'posts' || activeTab === 'projects') && (
                        isFormOpen ? (
                            activeTab === 'posts' ? (
                                <PostForm initialData={editingItem} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
                            ) : (
                                <ProjectForm initialData={editingItem} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
                            )
                        ) : (
                            <DataTable
                                columns={activeTab === 'posts' ? postColumns : projectColumns}
                                data={items}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
