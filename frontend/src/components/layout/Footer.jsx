import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Youtube, Instagram, Twitter } from 'lucide-react';
import Magnetic from '../common/Magnetic';
import { useSocial } from '../../context/SocialContext';
import { useSite } from '../../context/SiteContext';

const Footer = () => {
    const { getPrimaryLink, loading: socialLoading } = useSocial();
    const { siteSettings } = useSite();
    const primaryYoutube = getPrimaryLink('youtube');
    const primaryInstagram = getPrimaryLink('instagram');
    const primaryTwitter = getPrimaryLink('twitter');

    return (
        <footer className="relative border-t border-white/10 bg-gradient-to-b from-transparent to-white/[0.02]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                    {(!socialLoading && primaryYoutube) && (
                        <Magnetic>
                            <motion.a
                                whileHover={{ scale: 1.2, rotate: 5, backgroundColor: 'rgba(255,0,0,0.2)' }}
                                href={primaryYoutube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-red-500 transition-colors"
                            >
                                <Youtube size={22} />
                            </motion.a>
                        </Magnetic>
                    )}
                    {(!socialLoading && primaryInstagram) && (
                        <Magnetic>
                            <motion.a
                                whileHover={{ scale: 1.2, rotate: -5, backgroundColor: 'rgba(236,72,153,0.2)' }}
                                href={primaryInstagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-pink-500 transition-colors"
                            >
                                <Instagram size={22} />
                            </motion.a>
                        </Magnetic>
                    )}
                    {(!socialLoading && primaryTwitter) && (
                        <Magnetic>
                            <motion.a
                                whileHover={{ scale: 1.2, backgroundColor: 'rgba(0,255,255,0.2)' }}
                                href={primaryTwitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-cyan-400 transition-colors"
                            >
                                <Twitter size={22} />
                            </motion.a>
                        </Magnetic>
                    )}
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-xl font-black uppercase tracking-tighter mb-2">
                        {siteSettings?.websiteName || 'Nexus AV'}
                    </div>
                    {siteSettings?.footerDescription && (
                        <div className="text-gray-400 text-sm font-medium text-center max-w-md mb-2">
                            {siteSettings.footerDescription}
                        </div>
                    )}
                    <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase text-center">
                        {siteSettings?.footerCopyright || '© 2026 AdVision Studio.'}
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-6 uppercase font-black tracking-widest text-xs text-gray-500">
                    <Link to="/about" className="hover:text-cyan-400 transition-colors">About</Link>
                    <Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
                    <Link to="/projects" className="hover:text-cyan-400 transition-colors">Projects</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
