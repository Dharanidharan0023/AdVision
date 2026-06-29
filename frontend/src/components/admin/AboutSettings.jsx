import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { Save, Info, Edit3, Trash2, Plus, Users, Video, Heart, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutSettings = () => {
    const [about, setAbout] = useState({
        id: null,
        title: '',
        subtitle: '',
        tagsLine: '',
        ourStoryTitle: '',
        description: '',
        subscribersCount: '',
        videosCount: '',
        viewsCount: '',
        communityText: '',
        brandsList: [],
        joinTitle: '',
        joinYoutubeLink: '',
        joinInstagramLink: '',
        imageUrl: '',
        metaTitle: '',
        metaDescription: '',
        keywords: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const descriptionRef = useRef(null);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await api.get('/public/about');
                if (res.data) {
                    let parsedBrands = [];
                    try {
                        parsedBrands = res.data.brandsList ? JSON.parse(res.data.brandsList) : [];
                    } catch (_err) {
                        parsedBrands = [];
                    }

                    setAbout({
                        id: res.data.id || null,
                        title: res.data.title || '',
                        subtitle: res.data.subtitle || '',
                        tagsLine: res.data.tagsLine || '',
                        ourStoryTitle: res.data.ourStoryTitle || '',
                        description: res.data.description || '',
                        subscribersCount: res.data.subscribersCount || '',
                        videosCount: res.data.videosCount || '',
                        viewsCount: res.data.viewsCount || '',
                        communityText: res.data.communityText || '',
                        brandsList: parsedBrands,
                        joinTitle: res.data.joinTitle || '',
                        joinYoutubeLink: res.data.joinYoutubeLink || '',
                        joinInstagramLink: res.data.joinInstagramLink || '',
                        imageUrl: res.data.imageUrl || '',
                        metaTitle: res.data.metaTitle || '',
                        metaDescription: res.data.metaDescription || '',
                        keywords: res.data.keywords || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching about info:', err);
                setMessage({ type: 'error', text: 'Unable to load about page content.' });
            } finally {
                setLoading(false);
            }
        };
        fetchAbout();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAbout(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDescriptionInput = () => {
        setAbout(prev => ({ ...prev, description: descriptionRef.current.innerHTML }));
    };

    const handleBrandChange = (index, field, value) => {
        const newBrands = [...about.brandsList];
        newBrands[index][field] = value;
        setAbout(prev => ({ ...prev, brandsList: newBrands }));
    };

    const addBrand = () => {
        setAbout(prev => ({
            ...prev,
            brandsList: [...prev.brandsList, { name: '', role: '', url: '', type: 'youtube' }]
        }));
    };

    const removeBrand = (index) => {
        const newBrands = [...about.brandsList];
        newBrands.splice(index, 1);
        setAbout(prev => ({ ...prev, brandsList: newBrands }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const payload = { ...about, brandsList: JSON.stringify(about.brandsList) };
            delete payload.id; // Not needed in payload if URL has it

            if (about.id) {
                await api.put(`/admin/about/${about.id}`, payload);
            } else {
                const res = await api.post('/admin/about', payload);
                setAbout((prev) => ({ ...prev, id: res.data.id }));
            }

            setMessage({ type: 'success', text: 'About settings updated successfully!' });
        } catch (err) {
            console.error('Error saving about info:', err);
            setMessage({ type: 'error', text: 'Failed to update about settings.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-gray-400">Loading settings...</div>;

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">About Content Management</h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Configure narrative, stats, and collaborations.</p>
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

            <form onSubmit={handleSubmit} className="space-y-12">
                {/* Hero Section Configuration */}
                <div className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6">Hero & Meta</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Main Title" icon={Info} name="title" value={about.title} onChange={handleChange} placeholder="e.g. The Studio" required />
                        <FormField label="Subtitle" icon={Info} name="subtitle" value={about.subtitle} onChange={handleChange} placeholder="e.g. Our Creative Journey" />
                        <FormField label="Tags Line" icon={Info} name="tagsLine" value={about.tagsLine} onChange={handleChange} placeholder="e.g. All glory to God" />
                        <FormField label="Cover Image URL" icon={LinkIcon} name="imageUrl" value={about.imageUrl} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
                    </div>
                </div>

                {/* Narrative Configuration */}
                <div className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6">Narrative</h3>
                    <FormField label="Story Title" icon={Info} name="ourStoryTitle" value={about.ourStoryTitle} onChange={handleChange} placeholder="e.g. Our Story" />
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Edit3 size={14} className="text-neon-purple" /> Our Story / Description
                        </label>
                        <div
                            ref={descriptionRef}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={handleDescriptionInput}
                            className="min-h-[200px] w-full rounded-3xl bg-black/20 border border-white/10 px-6 py-5 text-white outline-none focus:border-neon-purple/50"
                            dangerouslySetInnerHTML={{ __html: about.description || '<p>Type your studio story here...</p>' }}
                        />
                    </div>
                </div>

                {/* Stats Configuration */}
                <div className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6">Statistics Display</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <FormField label="Subscribers" icon={Users} name="subscribersCount" value={about.subscribersCount} onChange={handleChange} placeholder="1.09K+" />
                        <FormField label="Videos" icon={Video} name="videosCount" value={about.videosCount} onChange={handleChange} placeholder="105+" />
                        <FormField label="Views" icon={Heart} name="viewsCount" value={about.viewsCount} onChange={handleChange} placeholder="274K+" />
                        <FormField label="Community" icon={Heart} name="communityText" value={about.communityText} onChange={handleChange} placeholder="Rising" />
                    </div>
                </div>

                {/* Brands and Collaborations Configuration */}
                <div className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-white uppercase tracking-widest">Brands & Collaborations</h3>
                        <button type="button" onClick={addBrand} className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 border border-neon-cyan/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                            <Plus size={14} /> Add Entity
                        </button>
                    </div>

                    <div className="space-y-4">
                        {about.brandsList.map((brand, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 w-full">
                                    <input type="text" placeholder="Name" value={brand.name} onChange={(e) => handleBrandChange(idx, 'name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-neon-purple outline-none" required />
                                    <input type="text" placeholder="Role/Description" value={brand.role} onChange={(e) => handleBrandChange(idx, 'role', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-neon-purple outline-none" />
                                    <input type="text" placeholder="URL Link" value={brand.url} onChange={(e) => handleBrandChange(idx, 'url', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-neon-purple outline-none" />
                                    <select value={brand.type} onChange={(e) => handleBrandChange(idx, 'type', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-neon-purple outline-none appearance-none">
                                        <option value="youtube">YouTube</option>
                                        <option value="video">Video/Qubit</option>
                                        <option value="users">Collab/Users</option>
                                        <option value="brand">Brand</option>
                                    </select>
                                </div>
                                <button type="button" onClick={() => removeBrand(idx)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors shrink-0">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {about.brandsList.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-6">No brands or collaborations added yet.</p>
                        )}
                    </div>
                </div>

                {/* Social Connect Configuration */}
                <div className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6">Social Connect</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Join Title" icon={Info} name="joinTitle" value={about.joinTitle} onChange={handleChange} placeholder="e.g. Join the Movement" />
                        <div className="hidden md:block"></div>
                        <FormField label="YouTube Link" icon={LinkIcon} name="joinYoutubeLink" value={about.joinYoutubeLink} onChange={handleChange} placeholder="https://youtube.com/..." />
                        <FormField label="Instagram Link" icon={LinkIcon} name="joinInstagramLink" value={about.joinInstagramLink} onChange={handleChange} placeholder="https://instagram.com/..." />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-neon-purple hover:text-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Finalize Broadcast'}
                </button>
            </form>
        </div>
    );
};

const FormField = ({ label, icon: Icon, name, value, onChange, placeholder, type = 'text', required }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            {Icon && <Icon size={14} className="text-neon-cyan" />} {label}
        </label>
        <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-neon-purple transition-colors placeholder:text-gray-600"
        />
    </div>
);

export default AboutSettings;
