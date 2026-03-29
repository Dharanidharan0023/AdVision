import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, BookOpen, Layers, Clock } from 'lucide-react';
import api from '../../api/axios';
import ChapterForm from './ChapterForm';
import { motion, AnimatePresence } from 'framer-motion';

const ChapterManager = ({ story, onBack }) => {
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);

    const fetchChapters = async () => {
        try {
            const res = await api.get(`/public/stories/${story.id}`);
            // The API for detail returns story with chapters ordered by chapterNo asc
            setChapters(res.data.chapters || []);
        } catch (err) {
            console.error("Error fetching chapters:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChapters();
    }, [story.id]);

    const handleCreate = () => {
        setEditingChapter(null);
        setIsFormOpen(true);
    };

    const handleEdit = (chapter) => {
        setEditingChapter(chapter);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this chapter? This cannot be undone.')) return;
        try {
            await api.delete(`/admin/chapters/${id}`);
            fetchChapters();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete chapter.");
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingChapter) {
                await api.put(`/admin/chapters/${editingChapter.id}`, formData);
            } else {
                await api.post(`/admin/stories/${story.id}/chapters`, formData);
            }
            setIsFormOpen(false);
            fetchChapters();
        } catch (err) {
            console.error("Operation failed:", err);
            alert("Failed to save chapter.");
        }
    };

    const nextChapterNo = chapters.length > 0 
        ? Math.max(...chapters.map(c => c.chapterNo)) + 1 
        : 1;

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-10 h-10 border-2 border-neon-purple border-t-transparent rounded-full"
            />
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2">
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors mb-2"
                    >
                        <ArrowLeft size={14} /> Back to Stories
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-neon-purple/20 flex items-center justify-center text-neon-purple border border-neon-purple/20">
                            <Layers size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">
                                {story.title} <span className="text-neon-purple">Chapters</span>
                            </h2>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'} published
                            </p>
                        </div>
                    </div>
                </div>

                {!isFormOpen && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-neon-cyan transition-all duration-300 transform hover:scale-105"
                    >
                        <Plus size={18} />
                        <span>Add New Chapter</span>
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isFormOpen ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-panel rounded-3xl p-8"
                    >
                        <ChapterForm 
                            storyId={story.id} 
                            initialData={editingChapter} 
                            nextChapterNo={nextChapterNo}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-modern rounded-[2.5rem] overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.02] border-b border-white/5">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">No.</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Title</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Words</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {chapters.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-12 text-center text-gray-600 font-bold italic">
                                                No chapters yet. Start writing your masterpiece!
                                            </td>
                                        </tr>
                                    ) : (
                                        chapters.map((chapter) => (
                                            <tr key={chapter.id} className="group hover:bg-white/[0.01] transition-colors">
                                                <td className="px-8 py-6">
                                                    <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-neon-purple group-hover:bg-neon-purple group-hover:text-white group-hover:border-neon-purple transition-all">
                                                        {chapter.chapterNo}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="font-bold text-white group-hover:text-neon-cyan transition-colors">{chapter.title}</p>
                                                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mt-1 flex items-center gap-1">
                                                        <Clock size={10} /> {new Date(chapter.createdAt).toLocaleDateString()}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className="text-xs font-bold text-gray-500">
                                                        {chapter.content.split(/\s+/).length} words
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleEdit(chapter)}
                                                            className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-xl hover:bg-neon-cyan transition-all duration-300"
                                                            title="Edit Chapter"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(chapter.id)}
                                                            className="p-3 bg-white/5 text-gray-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all duration-300"
                                                            title="Delete Chapter"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChapterManager;
