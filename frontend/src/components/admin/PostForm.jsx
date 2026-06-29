import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Loader2 } from 'lucide-react';

const PostForm = ({ initialData, onSubmit, onCancel }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: '',
        tags: '',
        content: '',
        imageUrl: '',
        videoUrl: '',
        featured: false,
        status: 'Published',
        publishDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                slug: initialData.slug || '',
                category: initialData.category || '',
                tags: initialData.tags || '',
                content: initialData.content || '',
                imageUrl: initialData.imageUrl || '',
                videoUrl: initialData.videoUrl || '',
                featured: initialData.featured || false,
                status: initialData.status || 'Published',
                publishDate: initialData.publishDate ? new Date(initialData.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleContentChange = (value) => {
        setFormData(prev => ({ ...prev, content: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">
                        {initialData ? 'Refine Post' : 'New Creation'}
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">Content Specification</p>
                </div>
                <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors">
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Headline</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={(e) => {
                                handleChange(e);
                                if (!initialData) {
                                    setFormData(prev => ({
                                        ...prev,
                                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                                    }));
                                }
                            }}
                            placeholder="Descriptive title..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="post-url-slug"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-purple/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Technology, Art..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Tags (comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="react, web, ui"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-purple/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Publish Date</label>
                        <input
                            type="date"
                            name="publishDate"
                            value={formData.publishDate}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Legacy Video Link (Optional)</label>
                        <input
                            type="text"
                            name="videoUrl"
                            value={formData.videoUrl || ''}
                            onChange={(e) => {
                                const url = e.target.value;
                                handleChange(e);
                                const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/)([\w-]{11}))/);
                                if (videoIdMatch && videoIdMatch[1]) {
                                    setFormData(prev => ({
                                        ...prev,
                                        videoUrl: url,
                                        imageUrl: `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`
                                    }));
                                }
                            }}
                            placeholder="YouTube URL..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-purple/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Visual Source (URL)</label>
                    <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="Image URL..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 mb-2 block">Narrative</label>
                    <div className="rounded-2xl overflow-hidden border border-white/5 bg-white/5 text-white">
                        <ReactQuill
                            theme="snow"
                            value={formData.content}
                            onChange={handleContentChange}
                            className="quill-editor"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl w-fit">
                    <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        id="featured"
                        className="w-5 h-5 rounded-lg border-white/10 bg-dark-bg text-neon-purple focus:ring-neon-purple transition-all"
                    />
                    <label htmlFor="featured" className="text-xs font-black uppercase tracking-widest text-gray-400 cursor-pointer select-none">Mark as Featured Highlight</label>
                </div>

                <div className="flex justify-end pt-8 border-t border-white/5">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                        {isSubmitting ? 'Processing...' : (initialData ? 'Update Entity' : 'Finalize Broadcast')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;
