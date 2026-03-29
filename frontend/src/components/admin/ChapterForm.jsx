import { useState, useEffect } from 'react';
import { X, Save, Type, ListOrdered, FileText } from 'lucide-react';

const ChapterForm = ({ storyId, initialData, onSubmit, onCancel, nextChapterNo }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        chapterNo: nextChapterNo || 1
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                chapterNo: initialData.chapterNo || nextChapterNo || 1
            });
        }
    }, [initialData, nextChapterNo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'chapterNo' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-black text-white tracking-tight">
                    {initialData ? `Edit Chapter ${formData.chapterNo}` : `Add Chapter ${formData.chapterNo}`}
                </h3>
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="p-1 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <Type size={14} /> Chapter Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Chapter name (e.g., The Beginning)..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-all font-bold"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <ListOrdered size={14} /> Chapter No.
                    </label>
                    <input
                        type="number"
                        name="chapterNo"
                        value={formData.chapterNo}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-all font-bold"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <FileText size={14} /> Chapter Content
                </label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows="15"
                    placeholder="Write or paste your chapter content here..."
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-all font-medium leading-relaxed resize-none"
                    style={{ fontFamily: "'Georgia', serif" }}
                ></textarea>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold text-right pt-1">
                    {formData.content.split(/\s+/).filter(Boolean).length} words
                </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 bg-neon-purple text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-neon-purple/80 transition-all shadow-[0_0_20px_rgba(176,38,255,0.2)]"
                >
                    <Save size={16} />
                    <span>{initialData ? 'Update Chapter' : 'Save Chapter'}</span>
                </button>
            </div>
        </form>
    );
};

export default ChapterForm;
