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
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">
                {initialData ? 'Edit Post' : 'Create New Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-purple transition-colors"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">YouTube Video URL</label>
                    <input
                        type="text"
                        name="videoUrl"
                        value={formData.videoUrl || ''}
                        onChange={(e) => {
                            const url = e.target.value;
                            handleChange(e);
                            // Auto-fetch thumbnail
                            const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/)([\w-]{11}))/);
                            if (videoIdMatch && videoIdMatch[1]) {
                                setFormData(prev => ({
                                    ...prev,
                                    videoUrl: url,
                                    imageUrl: `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`
                                }));
                            }
                        }}
                        placeholder="e.g. https://youtu.be/..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-purple transition-colors mb-2"
                    />
                    <p className="text-xs text-gray-500">Paste a YouTube link to auto-generate the thumbnail.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                    <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-purple transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows={6}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-purple transition-colors"
                        required
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        id="featured"
                        className="w-4 h-4 rounded border-gray-600 bg-black/40 text-neon-purple focus:ring-neon-purple"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-400">Featured Post</label>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-neon-purple text-white font-medium hover:bg-neon-purple/80 transition-shadow shadow-lg shadow-neon-purple/20"
                    >
                        {initialData ? 'Update Post' : 'Create Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;
