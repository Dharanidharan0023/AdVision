import { useState, useMemo } from 'react';
import { Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DataTable = ({ columns, data, onEdit, onDelete, itemsPerPage = 10 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Handle Sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Sorted and Paginated Data
    const processedData = useMemo(() => {
        let sortableItems = [...data];
        
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortableItems.slice(startIndex, startIndex + itemsPerPage);
    }, [data, sortConfig, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
        <div className="w-full flex flex-col">
            <div className="w-full overflow-x-auto no-scrollbar pb-4">
                <table className="w-full text-left border-separate border-spacing-y-4 px-4">
                    <thead>
                        <tr className="text-gray-500">
                            {columns.map((col, index) => (
                                <th 
                                    key={index} 
                                    className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-[0.3em] font-heading cursor-pointer hover:text-white transition-colors select-none"
                                    onClick={() => handleSort(col.accessor)}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.header}
                                        {sortConfig.key === col.accessor ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-neon-cyan" /> : <ArrowDown size={12} className="text-neon-cyan" />
                                        ) : (
                                            <ArrowUpDown size={12} className="opacity-30" />
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-[0.3em] font-heading text-right select-none">Protocol</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {processedData.length > 0 ? (
                                processedData.map((item, idx) => (
                                    <motion.tr 
                                        key={item.id || idx}
                                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300, damping: 24 }}
                                        className="group bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:translate-y-[-2px] border border-white/5"
                                    >
                                        {columns.map((col, index) => (
                                            <td key={index} className={`px-4 sm:px-8 py-4 sm:py-7 text-[11px] font-bold tracking-widest uppercase transition-colors duration-500 ${index === 0 ? 'rounded-l-[2rem]' : ''}`}>
                                                <span className="opacity-60 group-hover:opacity-100 group-hover:text-neon-cyan transition-all duration-500">
                                                    {col.render ? col.render(item) : item[col.accessor]}
                                                </span>
                                            </td>
                                        ))}
                                        <td className="px-4 sm:px-8 py-4 sm:py-7 text-right rounded-r-[2rem]">
                                            <div className="flex justify-end gap-2 sm:gap-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500 sm:translate-x-4 sm:group-hover:translate-x-0">
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-neon-cyan bg-white/5 border border-white/5 rounded-2xl hover:bg-neon-cyan hover:text-black hover:rotate-12 transition-all duration-500 shadow-inner"
                                                    title="Override Record"
                                                >
                                                    <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-red-400 bg-white/5 border border-white/5 rounded-2xl hover:bg-red-500 hover:text-white hover:-rotate-12 transition-all duration-500 shadow-inner"
                                                    title="Purge Node"
                                                >
                                                    <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-8 py-32 text-center">
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex flex-col items-center justify-center space-y-6"
                                        >
                                            <motion.div 
                                                animate={{ 
                                                    y: [0, -10, 0],
                                                    rotate: [0, 5, -5, 0] 
                                                }}
                                                transition={{ 
                                                    repeat: Infinity, 
                                                    duration: 4,
                                                    ease: "easeInOut" 
                                                }}
                                                className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 shadow-inner"
                                            >
                                                <Database size={40} strokeWidth={1} />
                                            </motion.div>
                                            <div className="space-y-2">
                                                <p className="text-xl font-black uppercase tracking-[0.5em] text-white">Void Detected</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 italic">No nodes present in this sector.</p>
                                            </div>
                                        </motion.div>
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-8 py-4 border-t border-white/5 mt-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-3 rounded-xl bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-3 rounded-xl bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
