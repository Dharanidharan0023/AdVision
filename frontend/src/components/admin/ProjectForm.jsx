import { useState, useEffect, useRef } from 'react';
import { Loader2, Upload } from 'lucide-react';
import api from '../../api/axios';

const ProjectForm = ({ initialData, onSubmit, onCancel }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        status: 'In Progress',
        category: 'AdVision',
        videoLink: '',
        websiteUrl: '',
        apkUrl: '',
        githubUrl: '',
        technologies: '',
        screenshots: '',
        plannedFeatures: '',
        releaseDate: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                imageUrl: initialData.image || initialData.imageUrl || '', 
                status: initialData.status || 'In Progress',
                category: initialData.category || 'AdVision',
                videoLink: initialData.videoLink || '',
                websiteUrl: initialData.websiteUrl || '',
                apkUrl: initialData.apkUrl || '',
                githubUrl: initialData.githubUrl || '',
                technologies: initialData.technologies || '',
                screenshots: initialData.screenshots || '',
                plannedFeatures: initialData.plannedFeatures || '',
                releaseDate: initialData.releaseDate ? new Date(initialData.releaseDate).toISOString().split('T')[0] : ''
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

    const [apkFile, setApkFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setApkFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let finalData = { ...formData };
            if (apkFile) {
                const uploadData = new FormData();
                uploadData.append('apk', apkFile);
                const uploadRes = await api.post('/admin/upload-apk', uploadData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                finalData.apkUrl = uploadRes.data.url;
            }
            await onSubmit(finalData);
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setIsSubmitting(false);
        }
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-purple/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                        >
                            <option value="AdVision">AdVision (Videos)</option>
                            <option value="Qubit">Qubit (Web/APK)</option>
                            <option value="Future Projects">Future Projects</option>
                        </select>
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

                {formData.category === 'AdVision' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Video Link (YouTube)</label>
                            <input
                                type="text"
                                name="videoLink"
                                value={formData.videoLink}
                                onChange={handleChange}
                                placeholder="https://youtube.com/..."
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Release Date</label>
                            <input
                                type="date"
                                name="releaseDate"
                                value={formData.releaseDate}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>
                )}

                {formData.category === 'Qubit' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Website URL</label>
                                <input
                                    type="text"
                                    name="websiteUrl"
                                    value={formData.websiteUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Upload APK</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept=".apk"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Upload size={16} /> 
                                        {apkFile ? apkFile.name : (formData.apkUrl ? "Replace Current APK" : "Select APK File")}
                                    </button>
                                </div>
                                {formData.apkUrl && !apkFile && (
                                    <p className="text-xs text-neon-cyan mt-2 truncate px-2">Current: {formData.apkUrl}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">GitHub URL</label>
                                <input
                                    type="text"
                                    name="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={handleChange}
                                    placeholder="https://github.com/..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Technologies (Comma separated)</label>
                                <input
                                    type="text"
                                    name="technologies"
                                    value={formData.technologies}
                                    onChange={handleChange}
                                    placeholder="React, Node.js, ..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Screenshots (Comma separated URLs)</label>
                                <input
                                    type="text"
                                    name="screenshots"
                                    value={formData.screenshots}
                                    onChange={handleChange}
                                    placeholder="https://img1.jpg, https://img2.jpg..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {formData.category === 'Future Projects' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Planned Features</label>
                            <textarea
                                name="plannedFeatures"
                                value={formData.plannedFeatures}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Feature 1, Feature 2..."
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-purple/50 focus:bg-white/10 transition-all resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Target Release Date</label>
                            <input
                                type="date"
                                name="releaseDate"
                                value={formData.releaseDate}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan/50 transition-all"
                            />
                        </div>
                    </div>
                )}

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

export default ProjectForm;
