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
                imageUrl: initialData.imageUrl || '',
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

        if (name === 'imageUrl') setError('');
    };

    const extractDriveId = (url) => {
        // Drive IDs are typically ~33 alphanumeric characters, hyphens, and underscores.
        const match = url.match(/[-\w]{25,}/);
        return match ? match[0] : null;
    };

    const convertDriveLink = (url) => {
        const id = extractDriveId(url);
        if (id) {
            // Using the Google Drive thumbnail endpoint which is often more reliable
            // for public images than other endpoints.
            return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
        }
        return url;
    };

    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        let finalImageUrl = formData.imageUrl;

        if (formData.imageUrl) {
            const isDriveLink = formData.imageUrl.includes('drive.google.com');
            const driveId = extractDriveId(formData.imageUrl);

            if (isDriveLink && !driveId) {
                setError('Could not extract a valid Google Drive file ID from the link.');
                return;
            } else if (!isDriveLink && formData.imageUrl.trim() !== '') {
                // Warn them but maybe they want a standard URL?
                // The requirement said "accept a Google Drive share link"
                setError('Please provide a Google Drive share link.');
                return;
            }

            if (driveId) {
                finalImageUrl = convertDriveLink(formData.imageUrl);
            }
        }

        onSubmit({
            ...formData,
            imageUrl: finalImageUrl
        });
    };

    // Calculate preview URL
    const previewUrl = formData.imageUrl ? convertDriveLink(formData.imageUrl) : '';

    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">
                {initialData ? 'Edit Project' : 'Create New Project'}
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
                    <label className="block text-sm font-medium text-gray-400 mb-1">Project Image URL (Google Drive Share Link)</label>
                    <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className={`w-full bg-black/40 border ${error ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-purple transition-colors`}
                        placeholder="https://drive.google.com/file/d/..."
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    {previewUrl && !error && (
                        <div className="mt-3 w-full h-48 rounded-xl overflow-hidden relative border border-white/20 bg-dark-bg/50 shadow-lg shadow-black/50 group">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm italic z-0 animate-pulse">
                                Loading preview...
                            </div>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover relative z-10 transition-opacity duration-300"
                                onError={(e) => {
                                    e.target.style.opacity = '0';
                                    e.target.parentElement.querySelector('div').innerText = 'Preview not available for this link.';
                                    e.target.parentElement.querySelector('div').className = "absolute inset-0 flex items-center justify-center text-red-400/80 text-sm z-0";
                                }}
                                onLoad={(e) => {
                                    e.target.style.opacity = '1';
                                }}
                            />
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-purple transition-colors"
                    >
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Planned">Planned</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-purple transition-colors"
                        required
                    />
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
                        {initialData ? 'Update Project' : 'Create Project'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;
