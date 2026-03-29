import { useState, useEffect } from 'react';

const PostForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        videoUrl: '',
        featured: false,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                imageUrl: initialData.imageUrl || '',
                videoUrl: initialData.videoUrl || '',
                featured: initialData.featured || false,
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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
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
                            onChange={handleChange}
                            placeholder="Descriptive title..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                            required
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Narrative</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows={8}
                        placeholder="Share the vision..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-purple/50 focus:bg-white/10 transition-all placeholder:text-gray-600 resize-none"
                        required
                    />
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
                        className="btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest"
                    >
                        {initialData ? 'Update Entity' : 'Finalize Broadcast'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;
