import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Save, RefreshCw } from 'lucide-react';

const HomeSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [heroData, setHeroData] = useState({
        title: 'AdVision <br /> <span className="neon-text italic">Studio</span>',
        subtitle: 'Creative storytelling through vision.'
    });
    const [statsData, setStatsData] = useState([
        { label: 'Subscribers', value: '1.09K+' },
        { label: 'Videos', value: '105' },
        { label: 'Views', value: '274K+' }
    ]);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const [heroRes, statsRes] = await Promise.allSettled([
                api.get('/public/home-section/hero'),
                api.get('/public/home-section/stats')
            ]);

            if (heroRes.status === 'fulfilled' && heroRes.value.data) {
                try {
                    const content = typeof heroRes.value.data.content === 'string'
                        ? JSON.parse(heroRes.value.data.content)
                        : heroRes.value.data.content;
                    setHeroData(prev => ({ ...prev, ...content }));
                } catch (e) { console.error("Admin hero parse error:", e); }
            }
            if (statsRes.status === 'fulfilled' && statsRes.value.data) {
                try {
                    const content = typeof statsRes.value.data.content === 'string'
                        ? JSON.parse(statsRes.value.data.content)
                        : statsRes.value.data.content;
                    if (Array.isArray(content)) setStatsData(content);
                } catch (e) { console.error("Admin stats parse error:", e); }
            }
        } catch (err) {
            console.error("Error fetching home settings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (section, data) => {
        try {
            setSaving(true);
            await api.post('/admin/home-section', {
                sectionName: section,
                content: JSON.stringify(data)
            });
            alert(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved!`);
        } catch (err) {
            console.error(`Error saving ${section} settings:`, err);
            alert(`Failed to save ${section} settings.`);
        } finally {
            setSaving(false);
        }
    };

    const updateHero = (field, value) => {
        setHeroData(prev => ({ ...prev, [field]: value }));
    };

    const updateStat = (index, field, value) => {
        const newStats = [...statsData];
        newStats[index] = { ...newStats[index], [field]: value };
        setStatsData(newStats);
    };

    if (loading) return <div className="text-gray-400">Loading home settings...</div>;

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Settings */}
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Hero Section</h3>
                    <button 
                        onClick={() => handleSave('hero', heroData)}
                        disabled={saving}
                        className="flex items-center gap-2 bg-neon-purple text-white px-4 py-2 rounded-lg hover:bg-neon-purple/80 disabled:opacity-50"
                    >
                        <Save size={18} />
                        <span>{saving ? 'Saving...' : 'Save Hero'}</span>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Title (supports HTML)</label>
                        <input 
                            type="text"
                            value={heroData.title}
                            onChange={(e) => updateHero('title', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-purple/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Subtitle</label>
                        <textarea 
                            rows="3"
                            value={heroData.subtitle}
                            onChange={(e) => updateHero('subtitle', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-purple/50"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Settings */}
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Stats Section</h3>
                    <button 
                        onClick={() => handleSave('stats', statsData)}
                        disabled={saving}
                        className="flex items-center gap-2 bg-neon-cyan text-black px-4 py-2 rounded-lg hover:bg-neon-cyan/80 font-bold disabled:opacity-50"
                    >
                        <Save size={18} />
                        <span>{saving ? 'Saving...' : 'Save Stats'}</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statsData.map((stat, index) => (
                        <div key={index} className="bg-black/20 p-4 rounded-xl border border-white/5">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Stat {index + 1}</label>
                            <div className="space-y-3">
                                <input 
                                    type="text"
                                    placeholder="Label (e.g. Subscribers)"
                                    value={stat.label}
                                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-neon-cyan/50"
                                />
                                <input 
                                    type="text"
                                    placeholder="Value (e.g. 1.09K+)"
                                    value={stat.value}
                                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-neon-cyan focus:outline-none focus:border-neon-cyan"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeSettings;
