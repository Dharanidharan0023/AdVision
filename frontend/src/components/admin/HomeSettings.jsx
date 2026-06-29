import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Save, RefreshCw, Plus, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const HomeSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [heroData, setHeroData] = useState({
        title: 'Dharanix <br /> <span class="neon-text italic">Studio</span>',
        subtitle: 'Creative storytelling through vision.'
    });
    const [statsData, setStatsData] = useState([
        { label: 'Subscribers', value: '1.09K+' },
        { label: 'Videos', value: '105' },
        { label: 'Views', value: '274K+' }
    ]);
    const [allPosts, setAllPosts] = useState([]);
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [updatingPostId, setUpdatingPostId] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const [heroRes, statsRes, postsRes, featuredRes] = await Promise.allSettled([
                api.get('/public/home-section/hero'),
                api.get('/public/home-section/stats'),
                api.get('/public/posts'),
                api.get('/public/featured-posts?limit=10')
            ]);

            if (heroRes.status === 'fulfilled' && heroRes.value.data) {
                const content = parseContent(heroRes.value.data.content);
                setHeroData(prev => ({ ...prev, ...content }));
            }

            if (statsRes.status === 'fulfilled' && statsRes.value.data) {
                const content = parseContent(statsRes.value.data.content);
                if (Array.isArray(content)) setStatsData(content);
            }

            if (postsRes.status === 'fulfilled' && Array.isArray(postsRes.value.data)) {
                setAllPosts(postsRes.value.data);
            }

            if (featuredRes.status === 'fulfilled' && Array.isArray(featuredRes.value.data)) {
                setFeaturedPosts(featuredRes.value.data);
            }

            setMessage({ type: '', text: '' });
        } catch (err) {
            console.error('Error fetching home settings:', err);
            setMessage({ type: 'error', text: 'Unable to load home content.' });
        } finally {
            setLoading(false);
        }
    };

    const parseContent = (content) => {
        try {
            return typeof content === 'string' ? JSON.parse(content) : content;
        } catch (err) {
            return content;
        }
    };

    const handleSaveSection = async (section, data, label) => {
        try {
            setSaving(true);
            setMessage({ type: '', text: '' });
            await api.post('/admin/home-section', {
                sectionName: section,
                content: JSON.stringify(data)
            });
            setMessage({ type: 'success', text: `${ label} updated successfully.` });
        } catch (err) {
            console.error(`Error saving ${section}:`, err);
            setMessage({ type: 'error', text: `Failed to update ${label}.` });
        } finally {
            setSaving(false);
        }
    };

    const updateHero = (field, value) => {
        setHeroData(prev => ({ ...prev, [field]: value }));
    };

    const updateStat = (index, field, value) => {
        const updated = [...statsData];
        updated[index] = { ...updated[index], [field]: value };
        setStatsData(updated);
    };

    const addStat = () => {
        setStatsData(prev => [...prev, { label: '', value: '' }]);
    };

    const removeStat = (index) => {
        setStatsData(prev => prev.filter((_, idx) => idx !== index));
    };

    const toggleFeaturedPost = async (postId, currentFeatured) => {
        try {
            setUpdatingPostId(postId);
            setMessage({ type: '', text: '' });
            const post = allPosts.find(p => p.id === postId);
            if (!post) return;

            const response = await api.put(`/admin/posts/${postId}`, {
                ...post,
                featured: !currentFeatured
            });

            setAllPosts(prev => prev.map(p => p.id === postId ? response.data : p));
            
            if (!currentFeatured) {
                setFeaturedPosts(prev => [response.data, ...prev].slice(0, 3));
            } else {
                setFeaturedPosts(prev => prev.filter(p => p.id !== postId));
            }

            setMessage({ 
                type: 'success', 
                text: `Post ${!currentFeatured ? 'marked as' : 'removed from'} featured.` 
            });
        } catch (err) {
            console.error('Error updating post featured status:', err);
            setMessage({ type: 'error', text: 'Failed to update post status.' });
        } finally {
            setUpdatingPostId(null);
        }
    };

    if (loading) return <div className="text-gray-400">Loading home settings...</div>;

    const nonFeaturedPosts = allPosts.filter(p => !p.featured);

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white">Home Page Management</h2>
                    <p className="text-gray-400 text-sm uppercase tracking-[0.35em] mt-2">Edit hero content, statistics, and featured videos.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => handleSaveSection('hero', heroData, 'Hero section')}
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-neon-purple px-4 py-3 rounded-3xl text-white uppercase tracking-[0.2em] font-black hover:bg-neon-purple/90 disabled:opacity-50"
                    >
                        <Save size={18} /> Save Hero
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSaveSection('stats', statsData, 'Stats section')}
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-neon-cyan px-4 py-3 rounded-3xl text-black uppercase tracking-[0.2em] font-black hover:bg-neon-cyan/90 disabled:opacity-50"
                    >
                        <Save size={18} /> Save Stats
                    </button>
                </div>
            </div>

            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-3xl p-4 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}
                >
                    {message.text}
                </motion.div>
            )}

            <section className="glass-panel p-8 rounded-3xl border border-white/10">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-white">Hero Section</h3>
                        <p className="text-gray-400 text-sm">Update the top-level homepage title and subtitle.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                        <label className="text-xs uppercase tracking-[0.35em] text-gray-500">Title (HTML allowed)</label>
                        <textarea
                            rows={3}
                            value={heroData.title}
                            onChange={(e) => updateHero('title', e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-3xl px-5 py-4 text-white outline-none focus:border-neon-purple/50"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs uppercase tracking-[0.35em] text-gray-500">Subtitle</label>
                        <textarea
                            rows={2}
                            value={heroData.subtitle}
                            onChange={(e) => updateHero('subtitle', e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-3xl px-5 py-4 text-white outline-none focus:border-neon-purple/50"
                        />
                    </div>
                </div>
            </section>

            <section className="glass-panel p-8 rounded-3xl border border-white/10">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-white">Stats Section</h3>
                        <p className="text-gray-400 text-sm">Manage dynamic metric cards shown on the homepage.</p>
                    </div>
                    <button
                        type="button"
                        onClick={addStat}
                        className="inline-flex items-center gap-2 bg-white text-black px-4 py-3 rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-white/90"
                    >
                        <Plus size={16} /> Add Stat
                    </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {statsData.map((stat, index) => (
                        <div key={index} className="bg-black/20 rounded-3xl p-6 border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs uppercase tracking-[0.35em] text-gray-400">Stat {index + 1}</span>
                                <button onClick={() => removeStat(index)} className="text-red-400 hover:text-red-300 text-sm uppercase tracking-[0.25em]">Remove</button>
                            </div>
                            <input
                                value={stat.label}
                                onChange={(e) => updateStat(index, 'label', e.target.value)}
                                placeholder="Label"
                                className="w-full bg-black/10 border border-white/10 rounded-3xl px-4 py-3 text-white outline-none focus:border-neon-cyan/50 mb-4"
                            />
                            <input
                                value={stat.value}
                                onChange={(e) => updateStat(index, 'value', e.target.value)}
                                placeholder="Value"
                                className="w-full bg-black/10 border border-white/10 rounded-3xl px-4 py-3 text-white outline-none focus:border-neon-cyan/50"
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className="glass-panel p-8 rounded-3xl border border-white/10">
                <div className="mb-8">
                    <h3 className="text-2xl font-black text-white mb-2">Featured Videos</h3>
                    <p className="text-gray-400 text-sm">Select which videos appear on the homepage. Only the first 3 featured videos display.</p>
                </div>

                <div className="space-y-8">
                    {featuredPosts.length > 0 && (
                        <div>
                            <h4 className="text-lg font-black text-neon-cyan mb-4 uppercase tracking-[0.2em]">Currently Featured ({featuredPosts.length}/3)</h4>
                            <div className="space-y-3">
                                {featuredPosts.map((post) => (
                                    <motion.div
                                        key={post.id}
                                        layout
                                        className="flex items-center justify-between gap-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-3xl p-5 hover:border-neon-cyan/50 transition-all"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-white font-black truncate">{post.title}</h5>
                                            <p className="text-gray-400 text-sm truncate">{post.content?.substring(0, 80)}...</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleFeaturedPost(post.id, true)}
                                            disabled={updatingPostId === post.id}
                                            className="flex-shrink-0 p-3 rounded-2xl bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                                        >
                                            <X size={18} />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {nonFeaturedPosts.length > 0 && (
                        <div>
                            <h4 className="text-lg font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">Available Posts ({nonFeaturedPosts.length})</h4>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {nonFeaturedPosts.map((post) => (
                                    <motion.div
                                        key={post.id}
                                        layout
                                        className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-3xl p-5 hover:border-neon-cyan/30 transition-all"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-white font-black truncate">{post.title}</h5>
                                            <p className="text-gray-400 text-sm truncate">{post.content?.substring(0, 80)}...</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleFeaturedPost(post.id, false)}
                                            disabled={updatingPostId === post.id || featuredPosts.length >= 3}
                                            className="flex-shrink-0 p-3 rounded-2xl bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={featuredPosts.length >= 3 ? 'Limit of 3 featured videos reached' : 'Mark as featured'}
                                        >
                                            <Check size={18} />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {allPosts.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-gray-400">
                            <p className="text-lg font-black mb-2">No posts available yet</p>
                            <p className="text-sm">Create videos in the Post Videos section to feature them on the homepage.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomeSettings;
