import { useState, useEffect } from 'react';

const ProjectForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        status: 'In Progress',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                imageUrl: initialData.image || '', 
                status: initialData.status || 'In Progress',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
                        {initialData ? 'Edit Schema' : 'New Blueprint'}
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">Project configuration</p>
                </div>
                <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors">
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Project Identity</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Title..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Phase Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-purple/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                        >
                            <option value="In Progress">Active (In Progress)</option>
                            <option value="Completed">Finalized (Completed)</option>
                            <option value="Planned">Scheduled (Planned)</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Cover Asset (URL)</label>
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Objectives & Scope</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Brief overview..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-purple/50 focus:bg-white/10 transition-all placeholder:text-gray-600 resize-none"
                        required
                    />
                </div>

                <div className="flex justify-end pt-8 border-t border-white/5">
                    <button
                        type="submit"
                        className="btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest"
                    >
                        {initialData ? 'Update Record' : 'Deploy Project'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;
