import { useState, useEffect } from 'react';
import { Save, Loader } from 'lucide-react';
import api from '../../api/axios';

const ProjectsSettings = () => {
    const [settings, setSettings] = useState({
        title: "",
        subtitle: "",
        futureProjectsTitle: "",
        futureProjectsDesc: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/public/home-section/projects-page');
            if (res.data && res.data.content) {
                const parsed = JSON.parse(res.data.content);
                setSettings(parsed);
            }
        } catch (err) {
            console.error('Failed to fetch projects settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.post('/admin/home-section', {
                sectionName: 'projects-page',
                content: settings
            });
            setMessage({ type: 'success', text: 'Projects settings updated successfully.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update settings.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-neon-cyan animate-spin" />
        </div>
    );

    return (
        <div className="max-w-4xl">
            <div className="mb-10">
                <h2 className="text-3xl font-black text-white tracking-tighter">Projects Page Setup</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">
                    Manage the static content of the projects portfolio
                </p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${
                    message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Main Page Settings */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Main Portfolio Headers</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Main Title</label>
                            <input
                                type="text"
                                name="title"
                                value={settings.title || ''}
                                onChange={handleChange}
                                placeholder="Project Portfolio"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Subtitle / Eyebrow</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={settings.subtitle || ''}
                                onChange={handleChange}
                                placeholder="Architectural Roadmap"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Future Projects Settings */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Future Projects Tile</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Tile Title</label>
                            <input
                                type="text"
                                name="futureProjectsTitle"
                                value={settings.futureProjectsTitle || ''}
                                onChange={handleChange}
                                placeholder="Future Projects"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-purple/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Tile Description</label>
                            <textarea
                                name="futureProjectsDesc"
                                value={settings.futureProjectsDesc || ''}
                                onChange={handleChange}
                                rows={4}
                                placeholder="A sneak peek into our upcoming endeavors..."
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-purple/50 focus:bg-white/10 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2"
                    >
                        {saving ? (
                            <><Loader size={16} className="animate-spin" /> Saving...</>
                        ) : (
                            <><Save size={16} /> Save Settings</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectsSettings;
