import { useState } from 'react';
import { LayoutDashboard, FileText, Briefcase, Home, LogOut, Menu, X, ShieldAlert, BookOpen, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navItems = [
        { id: 'overview', label: 'Systems', icon: LayoutDashboard },
        { id: 'home', label: 'Primary', icon: Home },
        { id: 'about', label: 'Identity', icon: ShieldAlert },
        { id: 'posts', label: 'Records', icon: FileText },
        { id: 'projects', label: 'Vision', icon: Briefcase },
        { id: 'stories', label: 'Narrative', icon: BookOpen },
    ];

    const handleTabChange = (id) => {
        setActiveTab(id);
        setIsMobileOpen(false);
    };

    const sidebarContent = (
        <div className="flex flex-col h-full py-10 px-4">
            {/* Admin Header */}
            <div className="px-6 mb-16 flex items-center gap-4">
                <motion.div 
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.8, ease: "anticipate" }}
                    className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-black shadow-[0_0_20px_rgba(176,38,255,0.4)]"
                >
                    <ShieldAlert size={22} strokeWidth={2.5} />
                </motion.div>
                <div>
                    <h2 className="text-xl font-black text-white leading-none tracking-tighter uppercase">Nexus <span className="text-neon-cyan">AV</span></h2>
                    <div className="flex items-center gap-2 mt-1.5 font-bold text-[8px] uppercase tracking-[0.4em] text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Live Auth
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all duration-500 group relative ${
                                isActive
                                    ? 'bg-white text-black shadow-[0_15px_30px_rgba(255,255,255,0.1)]'
                                    : 'text-gray-400 hover:bg-white/[0.03] hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <Icon 
                                    size={18} 
                                    className={`transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover:text-neon-cyan group-hover:scale-110'}`} 
                                />
                                <span className={`font-black text-[10px] uppercase tracking-[0.25em] ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                                    {item.label}
                                </span>
                            </div>
                            {isActive && (
                                <motion.div 
                                    layoutId="activeTabIndicator"
                                    className="w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_10px_#b026ff]"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="pt-8 mt-auto border-t border-white/5 space-y-4">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 text-red-400/60 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all duration-300 group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">Purge Session</span>
                </button>
                
                <div className="px-6 py-4 bg-white/5 rounded-[1.5rem] border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 border border-white/10" />
                    <div>
                        <p className="text-[9px] font-black text-white/50 uppercase leading-none">Access Level</p>
                        <p className="text-[10px] font-black text-neon-cyan uppercase tracking-widest mt-1">Superuser</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-y-0 left-0 w-72 lg:flex hidden flex-col z-[100] p-6">
            <aside className="h-full bg-dark-bg/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                {sidebarContent}
            </aside>
            
            {/* Mobile Header Toggle */}
            <div className="lg:hidden fixed top-0 left-0 w-full h-20 bg-dark-bg/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-[100]">
                <span className="text-xl font-black neon-text uppercase tracking-tighter">AdVision Control</span>
                <button 
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-3 bg-white/5 rounded-2xl text-white border border-white/10"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] lg:hidden"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 w-[85%] max-w-sm h-screen bg-dark-bg z-[120] lg:hidden border-r border-white/5"
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Sidebar;
