import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { Save, Info, Edit3, Trash2, Plus, Users, Video, Heart, Link as LinkIcon, Share2 } from 'lucide-react';
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
        imageUrl: '',
        metaTitle: '',
        metaDescription: '',
        keywords: ''
    });
    
    const [socialLinks, setSocialLinks] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const descriptionRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [aboutRes, socialRes] = await Promise.all([
                    api.get('/public/about'),
                    api.get('/admin/social-links')
                ]);
                
                if (aboutRes.data) {
                    let parsedBrands = [];
                    try {
                        parsedBrands = aboutRes.data.brandsList ? JSON.parse(aboutRes.data.brandsList) : [];
                    } catch (_err) {
                        parsedBrands = [];
                    }

                    setAbout({
                        id: aboutRes.data.id || null,
                        title: aboutRes.data.title || '',
                        subtitle: aboutRes.data.subtitle || '',
                        tagsLine: aboutRes.data.tagsLine || '',
                        ourStoryTitle: aboutRes.data.ourStoryTitle || '',
                        description: aboutRes.data.description || '',
                        subscribersCount: aboutRes.data.subscribersCount || '',
                        videosCount: aboutRes.data.videosCount || '',
                        viewsCount: aboutRes.data.viewsCount || '',
                        communityText: aboutRes.data.communityText || '',
                        brandsList: parsedBrands,
                        joinTitle: aboutRes.data.joinTitle || '',
                        imageUrl: aboutRes.data.imageUrl || '',
                        metaTitle: aboutRes.data.metaTitle || '',
                        metaDescription: aboutRes.data.metaDescription || '',
                        keywords: aboutRes.data.keywords || ''
                    });
                }
                
                if (socialRes.data) {
                    setSocialLinks(socialRes.data);
                }
                
            } catch (err) {
                console.error('Error fetching data:', err);
                setMessage({ type: 'error', text: 'Unable to load settings.' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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
    
    // Social Links Logic
    const handleSocialChange = (index, field, value) => {
        const newLinks = [...socialLinks];
        newLinks[index][field] = value;
        setSocialLinks(newLinks);
    };

    const addSocialLink = () => {
        setSocialLinks(prev => [...prev, { platform: 'youtube', type: 'secondary', url: '', label: '', isActive: true }]);
    };

    const removeSocialLink = (index) => {
        const newLinks = [...socialLinks];
        newLinks.splice(index, 1);
        setSocialLinks(newLinks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const payload = { ...about, brandsList: JSON.stringify(about.brandsList) };
            delete payload.id;

            if (about.id) {
                await api.put(`/admin/about/${about.id}`, payload);
            } else {
                const res = await api.post('/admin/about', payload);
                setAbout((prev) => ({ ...prev, id: res.data.id }));
            }
            
            // Save social links
            await api.post('/admin/social-links', socialLinks);

            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (err) {
            console.error('Error saving info:', err);
            setMessage({ type: 'error', text: 'Failed to update settings.' });
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

                {/* Social Connect Configuration */}
                <div className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl border-neon-cyan/30">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Share2 className="text-neon-cyan" size={20} /> Centralized Social Links
                        </h3>
                        <button type="button" onClick={addSocialLink} className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 border border-neon-cyan/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                            <Plus size={14} /> Add Platform
                        </button>
                    </div>

                    <div className="space-y-4">
                        {socialLinks.map((link, idx) => (
                            <div key={idx} className={`flex flex-col xl:flex-row items-center gap-4 bg-black/40 p-4 rounded-2xl border ${link.isActive ? 'border-white/10' : 'border-red-500/20 opacity-70'}`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 flex-1 w-full">
                                    <select value={link.platform} onChange={(e) => handleSocialChange(idx, 'platform', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-neon-purple outline-none appearance-none">
                                        <option value="youtube">YouTube</option>
                                        <option value="instagram">Instagram</option>
                                        <option value="twitter">Twitter / X</option>
                                        <option value="facebook">Facebook</option>
                                        <option value="linkedin">LinkedIn</option>
                                        <option value="website">Website</option>
                                    </select>
                                    
                                    <select value={link.type} onChange={(e) => handleSocialChange(idx, 'type', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-neon-purple outline-none appearance-none">
                                        <option value="primary">Primary (Global)</option>
                                        <option value="secondary">Secondary (About Page)</option>
                                        <option value="other">Other</option>
                                    </select>
                                    
                                    <input type="text" placeholder="Optional Label (e.g., Main Channel)" value={link.label || ''} onChange={(e) => handleSocialChange(idx, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-neon-purple outline-none" />
                                    
                                    <input type="url" placeholder="https://..." value={link.url} onChange={(e) => handleSocialChange(idx, 'url', e.target.value)} className="w-full xl:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-neon-purple outline-none" required />
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" className="sr-only" checked={link.isActive} onChange={(e) => handleSocialChange(idx, 'isActive', e.target.checked)} />
                                            <div className={`block w-10 h-6 rounded-full transition-colors ${link.isActive ? 'bg-neon-cyan' : 'bg-gray-600'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${link.isActive ? 'translate-x-4' : ''}`}></div>
                                        </div>
                                        <span className="ml-3 text-xs font-bold text-gray-400 uppercase tracking-widest">{link.isActive ? 'Active' : 'Hidden'}</span>
                                    </label>
                                    
                                    <button type="button" onClick={() => removeSocialLink(idx)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors ml-4">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {socialLinks.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-6">No social links added yet. Add primary links for them to appear globally.</p>
                        )}
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
