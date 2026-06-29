import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Send, Instagram, Youtube } from 'lucide-react';
import Magnetic from '../components/common/Magnetic';
import SEO from '../components/SEO';

const Contact = () => {
    return (
        <div className="min-h-screen pt-40 pb-32 bg-dark-bg px-6 overflow-hidden relative">
            <SEO 
                title="Contact"
                description="Reach out to AdVision Studio for collaborations, licensing, and creative inquiries."
                url="/contact"
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": "AdVision Studio",
                    "image": "https://advisionstudio.com/vite.svg",
                    "email": "support@dharanixstudio.com",
                    "telephone": "+91 98765 43210",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Chennai",
                        "addressCountry": "IN"
                    },
                    "url": "https://advisionstudio.com/contact"
                }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),transparent_35%)] pointer-events-none" />
            <div className="container mx-auto max-w-6xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <span className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 text-neon-cyan text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                        <Send size={14} className="text-neon-cyan" /> Contact Gateway
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-tight">
                        Connect <span className="neon-text italic">with Us</span>
                    </h1>
                    <p className="mt-8 text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Need help with an idea or want to join the next creative wave? Reach out and we will respond with the same cinematic energy.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-modern rounded-[3rem] border border-white/10 p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
                    >
                        <div className="flex items-center gap-4 mb-8 text-neon-cyan">
                            <div className="w-14 h-14 rounded-3xl bg-neon-cyan/10 flex items-center justify-center">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Email</h2>
                                <p className="text-gray-400 text-sm">support@dharanixstudio.com</p>
                            </div>
                        </div>
                        <p className="text-gray-500 leading-relaxed">For collaborations, licensing, press, or general enquiries, message us anytime.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-modern rounded-[3rem] border border-white/10 p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
                    >
                        <div className="flex items-center gap-4 mb-8 text-neon-purple">
                            <div className="w-14 h-14 rounded-3xl bg-neon-purple/10 flex items-center justify-center">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Phone</h2>
                                <p className="text-gray-400 text-sm">+91 98765 43210</p>
                            </div>
                        </div>
                        <p className="text-gray-500 leading-relaxed">Available Monday through Saturday, 10AM to 8PM IST.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-modern rounded-[3rem] border border-white/10 p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
                    >
                        <div className="flex items-center gap-4 mb-8 text-neon-cyan">
                            <div className="w-14 h-14 rounded-3xl bg-neon-cyan/10 flex items-center justify-center">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Location</h2>
                                <p className="text-gray-400 text-sm">Dharanidharan Studio, Chennai, India</p>
                            </div>
                        </div>
                        <p className="text-gray-500 leading-relaxed">Schedule a studio visit or ask for a remote briefing call with our creative team.</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="glass-modern rounded-[3rem] border border-white/10 p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
                    >
                        <div className="space-y-6">
                            <h3 className="text-4xl font-black uppercase tracking-tighter">Drop a line</h3>
                            <p className="text-gray-400 leading-relaxed">Send us your vision. We'll answer with a plan and a timeline.</p>

                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="contact-email" className="block text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-2">Your Email</label>
                                    <input id="contact-email" aria-label="Your Email" className="w-full bg-white/[0.05] border border-white/10 rounded-3xl px-5 py-4 text-white outline-none focus:border-neon-cyan/40 focus:bg-white/10 transition" placeholder="hello@you.com" />
                                </div>
                                <div>
                                    <label htmlFor="contact-brief" className="block text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-2">Project Short Brief</label>
                                    <textarea id="contact-brief" aria-label="Project Short Brief" rows="4" className="w-full bg-white/[0.05] border border-white/10 rounded-3xl px-5 py-4 text-white outline-none focus:border-neon-cyan/40 focus:bg-white/10 transition" placeholder="Tell us about the project..." />
                                </div>
                                <button type="button" aria-label="Send Message" className="btn-primary w-full py-5 uppercase tracking-[0.4em] font-black flex items-center justify-center gap-3">
                                    <Send size={18} /> Send Message
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="glass-modern rounded-[3rem] border border-white/10 p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] flex flex-col justify-between"
                    >
                        <div className="space-y-6">
                            <h3 className="text-4xl font-black uppercase tracking-tighter">Social Pulse</h3>
                            <p className="text-gray-400 leading-relaxed">Follow us across channels for updates, behind-the-scenes and live drops.</p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Magnetic>
                                <a href="https://youtube.com/@dharanixstudio" aria-label="Visit YouTube Channel" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[160px] px-6 py-5 rounded-3xl bg-white/5 border border-white/10 text-white hover:bg-red-600/10 transition">
                                    <div className="flex items-center gap-3">
                                        <Youtube aria-hidden="true" /> YouTube
                                    </div>
                                </a>
                            </Magnetic>
                            <Magnetic>
                                <a href="https://www.instagram.com/visionofad" aria-label="Visit Instagram Profile" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[160px] px-6 py-5 rounded-3xl bg-white/5 border border-white/10 text-white hover:bg-pink-500/10 transition">
                                    <div className="flex items-center gap-3">
                                        <Instagram aria-hidden="true" /> Instagram
                                    </div>
                                </a>
                            </Magnetic>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-20 text-center text-sm uppercase tracking-[0.35em] text-gray-500">
                    <Link to="/" className="hover:text-white transition">Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Contact;
