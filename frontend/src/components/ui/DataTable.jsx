import { Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DataTable = ({ columns, data, onEdit, onDelete }) => {
    return (
        <div className="w-full overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-separate border-spacing-y-4 px-4">
                <thead>
                    <tr className="text-gray-500">
                        {columns.map((col, index) => (
                            <th key={index} className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] font-heading">{col.header}</th>
                        ))}
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] font-heading text-right">Protocol</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item, idx) => (
                            <motion.tr 
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:translate-y-[-2px] border border-white/5"
                            >
                                {columns.map((col, index) => (
                                    <td key={index} className={`px-8 py-7 text-[11px] font-bold tracking-widest uppercase transition-colors duration-500 ${index === 0 ? 'rounded-l-[2rem]' : ''}`}>
                                        <span className="opacity-60 group-hover:opacity-100 group-hover:text-neon-cyan transition-all duration-500">
                                            {col.render ? col.render(item) : item[col.accessor]}
                                        </span>
                                    </td>
                                ))}
                                <td className="px-8 py-7 text-right rounded-r-[2rem]">
                                    <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="w-12 h-12 flex items-center justify-center text-neon-cyan bg-white/5 border border-white/5 rounded-2xl hover:bg-neon-cyan hover:text-black hover:rotate-12 transition-all duration-500 shadow-inner"
                                            title="Override Record"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className="w-12 h-12 flex items-center justify-center text-red-400 bg-white/5 border border-white/5 rounded-2xl hover:bg-red-500 hover:text-white hover:-rotate-12 transition-all duration-500 shadow-inner"
                                            title="Purge Node"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} className="px-8 py-32 text-center">
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.3 }}
                                    className="space-y-4"
                                >
                                    <p className="text-lg font-black uppercase tracking-[0.5em] text-gray-400">Void Detected</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 italic">No nodes present in this sector.</p>
                                </motion.div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
