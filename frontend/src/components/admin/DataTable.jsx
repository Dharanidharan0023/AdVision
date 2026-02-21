import { Edit, Trash2 } from 'lucide-react';

const DataTable = ({ columns, data, onEdit, onDelete }) => {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-white/10 glass-panel">
            <table className="w-full text-left">
                <thead className="bg-black/40 text-gray-400 uppercase text-xs font-semibold">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className="px-6 py-4">{col.header}</th>
                        ))}
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {data.length > 0 ? (
                        data.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                {columns.map((col, index) => (
                                    <td key={index} className="px-6 py-4 text-sm text-gray-300">
                                        {col.render ? col.render(item) : item[col.accessor]}
                                    </td>
                                ))}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                                No items found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
