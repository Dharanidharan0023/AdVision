import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Save, Image as ImageIcon, Info, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutSettings = () => {
    const [about, setAbout] = useState({
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        experienceYears: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await api.get('/public/about');
                if (res.data) setAbout(res.data);
            } catch (err) {
                console.error("Error fetching about info:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAbout();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAbout(prev => ({ ...prev, [name]: name === 'experienceYears' ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            if (about.id) {
                await api.put(`/admin/about/${about.id}`, about);
            } else {
                const res = await api.post('/api/admin/about', about);
                setAbout(res.data);
            }
            setMessage({ type: 'success', text: 'About settings updated successfully!' });
        } catch (err) {
            console.error("Error saving about info:", err);
            setMessage({ type: 'error', text: 'Failed to update about settings.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-gray-400">Loading settings...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white">About Management</h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Configure your studio narrative</p>
                </div>
            </div>

            {message.text && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl text-sm font-bold ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                >
                    {message.text}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Info size={14} className="text-neon-purple" /> Main Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={about.title}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="e.g. About AdVision"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Info size={14} className="text-neon-cyan" /> Subtitle
                        </label>
                        <input
                            type="text"
                            name="subtitle"
                            value={about.subtitle}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                            placeholder="e.g. Crafting Cinematic Realities"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Info size={14} className="text-neon-purple" /> Description
                    </label>
                    <textarea
                        name="description"
                        value={about.description}
                        onChange={handleChange}
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-neon-purple transition-colors resize-none"
                        placeholder="Tell your story..."
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <ImageIcon size={14} className="text-neon-cyan" /> Image URL
                        </label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={about.imageUrl || ''}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Calendar size={14} className="text-neon-purple" /> Years of Experience
                        </label>
                        <input
                            type="number"
                            name="experienceYears"
                            value={about.experienceYears}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-neon-purple transition-colors"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-neon-purple hover:text-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </div>
    );
};

export default AboutSettings;
