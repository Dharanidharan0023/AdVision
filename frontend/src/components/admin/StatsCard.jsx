import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color = "text-neon-purple" }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="glass-modern p-6 sm:p-10 rounded-[2.5rem] border border-white/5 group transition-all duration-500 relative overflow-hidden h-full flex flex-col justify-between shadow-2xl"
        >
            <div className={`absolute top-0 right-0 w-40 h-40 bg-current opacity-[0.02] blur-[80px] transform translate-x-10 -translate-y-10 group-hover:opacity-[0.08] transition-opacity duration-700 ${color}`} />
            
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500/80">{title}</p>
                    <motion.h3 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none font-heading"
                    >
                        {typeof value === 'number' ? (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {value}
                            </motion.span>
                        ) : value}
                    </motion.h3>
                </div>
                {Icon && (
                    <div className={`p-5 rounded-3xl bg-white/[0.03] ${color} border border-white/5 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500 shadow-inner`}>
                        <Icon size={28} strokeWidth={1.5} />
                    </div>
                )}
            </div>
            
            <div className="mt-10 space-y-3">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Active Node</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${color} opacity-60 animate-pulse`}>Operational</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '70%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-current opacity-40" 
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;
