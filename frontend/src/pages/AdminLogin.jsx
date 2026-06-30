import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, Terminal } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { user, login, loading } = useAuth();
    const navigate = useNavigate();

    // Auto-redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard');
        }
    }, [user, loading, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await login(username.trim(), password.trim());
        if (success) {
            navigate('/dashboard');
        } else {
            alert('Invalid Credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg px-6 relative overflow-hidden font-sans">
            {/* Cinematic Scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            
            {/* Background Accents */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-purple/5 blur-[120px] rounded-full -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-cyan/5 blur-[120px] rounded-full -z-10 animate-pulse" />

            <div className="relative w-full max-w-lg">
                {/* Floating Tags */}
                <div className="absolute -top-12 left-6 flex items-center gap-3">
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-neon-cyan uppercase tracking-widest backdrop-blur-md">
                        Node: 0x82...
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="glass-modern p-10 md:p-16 rounded-[3.5rem] border border-white/5 relative z-10 shadow-2xl"
                >
                    <div className="text-center mb-16">
                        <motion.div 
                            initial={{ scale: 0.5, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", damping: 12 }}
                            className="inline-flex p-6 rounded-[2.5rem] bg-white/5 text-neon-cyan mb-10 border border-white/10 shadow-inner group"
                        >
                            <ShieldCheck size={48} className="group-hover:scale-110 transition-transform" />
                        </motion.div>
                        <h2 className="text-5xl font-black text-white tracking-tighter mb-3 uppercase italic">Secure <span className="neon-text">Access</span></h2>
                        <div className="flex items-center justify-center gap-2">
                             <div className="h-[1px] w-4 bg-neon-purple/40" />
                             <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[9px]">Vault Protocol Alpha</p>
                             <div className="h-[1px] w-4 bg-neon-purple/40" />
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-6">Identifier</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    autoComplete="username"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-16 py-5 text-white focus:outline-none focus:border-neon-cyan/40 focus:bg-white/5 transition-all placeholder:text-gray-700 font-bold tracking-wide"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-6">Credential</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-purple transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-16 py-5 text-white focus:outline-none focus:border-neon-purple/40 focus:bg-white/5 transition-all placeholder:text-gray-700 font-bold tracking-wide"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full py-6 text-xs uppercase tracking-[0.4em] font-black shadow-[0_30px_60px_rgba(0,0,0,0.5)] mt-4 flex items-center justify-center gap-4 group"
                        >
                            <Terminal size={18} className="group-hover:translate-x-1 transition-transform" />
                            <span>Initialize Link</span>
                        </button>
                    </form>
                </motion.div>
                
                {/* Footer Deco */}
                <div className="mt-8 flex justify-center gap-8 opacity-20 group">
                    <span className="text-[8px] font-bold text-white uppercase tracking-[0.5em]">Adv-Cipher-S1</span>
                    <span className="text-[8px] font-bold text-white uppercase tracking-[0.5em]">Terminal: 402</span>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
