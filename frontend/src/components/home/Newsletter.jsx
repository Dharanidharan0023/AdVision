import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useState } from 'react';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('loading');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1500);
    };

    return (
        <section className="py-20 relative overflow-hidden bg-dark-bg">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto glass-panel p-12 rounded-3xl text-center relative overflow-hidden"
                >
                    {/* Decorative Blobs */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-neon-purple/10 blur-[100px]"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-neon-cyan/10 blur-[100px]"></div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Never Miss <span className="neon-text">an Update</span></h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                        Get early access to my projects, behind-the-scenes content, and web development tips delivered straight to your inbox.
                    </p>

                    {status === 'success' ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded-xl inline-block"
                        >
                            Thanks for subscribing! Check your inbox soon. 🚀
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-neon-purple transition-all"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full md:w-auto px-8 py-4 bg-neon-purple text-white font-bold rounded-xl hover:bg-neon-purple/80 transition-shadow shadow-lg shadow-neon-purple/20 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Joining...' : <><Send size={18} /> Join Now</>}
                            </button>
                        </form>
                    )}

                    <p className="mt-6 text-xs text-gray-500">
                        Join 5,000+ creators. No spam, just pure value. Unsubscribe anytime.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Newsletter;
