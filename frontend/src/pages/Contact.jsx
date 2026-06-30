import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Send, Instagram, Youtube, Twitter } from 'lucide-react';
import Magnetic from '../components/common/Magnetic';
import SEO from '../components/SEO';
import { useSocial } from "../context/SocialContext";
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const Contact = () => {
    const { getPrimaryLink, loading: socialLoading } = useSocial();
    const primaryYoutube = getPrimaryLink('youtube');
    const primaryInstagram = getPrimaryLink('instagram');
    const primaryTwitter = getPrimaryLink('twitter');

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            return toast.error("All fields are required");
        }
        setIsSubmitting(true);
        try {
            await api.post('/public/contact-messages', formData);
            toast.success("Message sent successfully!");
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            console.error(err);
            toast.error("Failed to send message. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
            {/* Ambient Background Orbs */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" 
            />
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
                    {[
                        { icon: Mail, title: "Email", value: "support@dharanixstudio.com", desc: "For collaborations, licensing, press, or general enquiries.", color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
                        { icon: Phone, title: "Phone", value: "+91 98765 43210", desc: "Available Monday through Saturday, 10AM to 8PM IST.", color: "text-neon-purple", bg: "bg-neon-purple/10" },
                        { icon: MapPin, title: "Location", value: "Chennai, India", desc: "Schedule a studio visit or ask for a remote briefing call.", color: "text-neon-cyan", bg: "bg-neon-cyan/10" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.15, duration: 0.6 }}
                            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
                            className="glass-modern rounded-[3rem] border border-white/5 hover:border-white/20 p-10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300 group"
                        >
                            <div className={`flex items-center gap-4 mb-8 ${item.color}`}>
                                <div className={`w-14 h-14 rounded-3xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter">{item.title}</h2>
                                    <p className="text-gray-400 text-sm">{item.value}</p>
                                </div>
                            </div>
                            <p className="text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{item.desc}</p>
                        </motion.div>
                    ))}
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

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="group relative">
                                    <label htmlFor="contact-name" className="block text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-2 group-focus-within:text-neon-cyan transition-colors">Your Name</label>
                                    <input id="contact-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} aria-label="Your Name" className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-5 py-4 text-white outline-none focus:border-neon-cyan focus:bg-white/5 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300" placeholder="John Doe" />
                                </div>
                                <div className="group relative">
                                    <label htmlFor="contact-email" className="block text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-2 group-focus-within:text-neon-cyan transition-colors">Your Email</label>
                                    <input id="contact-email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} aria-label="Your Email" className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-5 py-4 text-white outline-none focus:border-neon-cyan focus:bg-white/5 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300" placeholder="hello@you.com" />
                                </div>
                                <div className="group relative">
                                    <label htmlFor="contact-brief" className="block text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-2 group-focus-within:text-neon-purple transition-colors">Project Short Brief</label>
                                    <textarea id="contact-brief" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} aria-label="Project Short Brief" rows="4" className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-5 py-4 text-white outline-none focus:border-neon-purple focus:bg-white/5 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 resize-none" placeholder="Tell us about the project..." />
                                </div>
                                <Magnetic>
                                    <button type="submit" disabled={isSubmitting} aria-label="Send Message" className="btn-primary w-full py-5 uppercase tracking-[0.4em] font-black flex items-center justify-center gap-3 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed">
                                        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-indigo-500 to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <span className="relative z-10 flex items-center gap-3">
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Send Message
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </Magnetic>
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

                        <div className="flex flex-col gap-4 mt-8">
                            {(!socialLoading && primaryYoutube) && (
                                <Magnetic>
                                    <a href={primaryYoutube} aria-label="Visit YouTube Channel" target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/10 transition-all duration-300 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-red-600/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300">
                                                <Youtube size={24} />
                                            </div>
                                            <div className="font-black uppercase tracking-widest text-white">YouTube</div>
                                        </div>
                                        <div className="relative z-10 text-gray-500 group-hover:text-white transition-colors duration-300">→</div >
                                    </a>
                                </Magnetic>
                            )}
                            {(!socialLoading && primaryInstagram) && (
                                <Magnetic>
                                    <a href={primaryInstagram} aria-label="Visit Instagram Profile" target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-white/10 transition-all duration-300 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-pink-600/10 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform duration-300">
                                                <Instagram size={24} />
                                            </div>
                                            <div className="font-black uppercase tracking-widest text-white">Instagram</div>
                                        </div>
                                        <div className="relative z-10 text-gray-500 group-hover:text-white transition-colors duration-300">→</div >
                                    </a>
                                </Magnetic>
                            )}
                            {(!socialLoading && primaryTwitter) && (
                                <Magnetic>
                                    <a href={primaryTwitter} aria-label="Visit Twitter Profile" target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-cyan-600/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                                <Twitter size={24} />
                                            </div>
                                            <div className="font-black uppercase tracking-widest text-white">Twitter</div>
                                        </div>
                                        <div className="relative z-10 text-gray-500 group-hover:text-white transition-colors duration-300">→</div >
                                    </a>
                                </Magnetic>
                            )}
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
