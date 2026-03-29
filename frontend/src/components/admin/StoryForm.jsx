import { useState, useEffect } from 'react';
import { X, Upload, Save, Type, FileSearch, Tag, Layers, User } from 'lucide-react';

const GENRES = ['Fantasy', 'Romance', 'Thriller', 'Mystery', 'Sci-Fi', 'Horror', 'Drama', 'Adventure'];
const STATUSES = ['Ongoing', 'Completed'];

const StoryForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        genre: 'Fantasy',
        status: 'Ongoing',
        author: 'Anonymous',
        coverUrl: '',
        featured: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                summary: initialData.summary || '',
                genre: initialData.genre || 'Fantasy',
                status: initialData.status || 'Ongoing',
                author: initialData.author || 'Anonymous',
                coverUrl: initialData.coverUrl || '',
                featured: initialData.featured || false
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
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black text-white tracking-tight">
                    {initialData ? 'Edit Story' : 'Create New Story'}
                </h2>
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Basic Info */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <Type size={14} /> Story Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter a compelling title..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-all font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <User size={14} /> Author Name
                        </label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="Your name or pen name..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-all font-bold"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <Tag size={14} /> Genre
                            </label>
                            <select
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-purple/50 transition-all font-bold appearance-none cursor-pointer"
                            >
                                {GENRES.map(g => <option key={g} value={g} className="bg-dark-bg">{g}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <Layers size={14} /> Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-purple/50 transition-all font-bold appearance-none cursor-pointer"
                            >
                                {STATUSES.map(s => <option key={s} value={s} className="bg-dark-bg">{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <input
                            type="checkbox"
                            name="featured"
                            id="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-gray-300 text-neon-purple focus:ring-neon-purple cursor-pointer"
                        />
                        <label htmlFor="featured" className="text-sm font-bold text-gray-300 cursor-pointer">
                            Feature this story on the home page / library hero
                        </label>
                    </div>
                </div>

                {/* Right Side: Media & Summary */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <Upload size={14} /> Cover Image URL
                        </label>
                        <input
                            type="text"
                            name="coverUrl"
                            value={formData.coverUrl}
                            onChange={handleChange}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-all font-bold"
                        />
                        {formData.coverUrl && (
                            <div className="mt-4 relative rounded-2xl overflow-hidden aspect-video border border-white/10">
                                <img src={formData.coverUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <FileSearch size={14} /> Summary
                        </label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            required
                            rows="4"
                            placeholder="Write a brief overview of the story..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-all font-bold resize-none"
                        ></textarea>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-3 bg-neon-purple text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-neon-purple/80 transition-all shadow-[0_0_30px_rgba(176,38,255,0.3)] hover:scale-105 active:scale-95"
                >
                    <Save size={18} />
                    <span>{initialData ? 'Update Story' : 'Create Story'}</span>
                </button>
            </div>
        </form>
    );
};

export default StoryForm;
