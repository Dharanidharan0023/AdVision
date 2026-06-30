import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const SocialContext = createContext();

export const useSocial = () => useContext(SocialContext);

export const SocialProvider = ({ children }) => {
    const [socialLinks, setSocialLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSocialLinks = async () => {
            try {
                const res = await api.get('/public/social-links');
                if (res.data) {
                    setSocialLinks(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch social links:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSocialLinks();
    }, []);

    // Helper functions
    const getPrimaryLink = (platform) => {
        const hasAnyLink = socialLinks.some(l => l.platform.toLowerCase() === platform.toLowerCase());
        
        if (hasAnyLink) {
            const activeLinks = socialLinks.filter(l => l.platform.toLowerCase() === platform.toLowerCase() && l.isActive);
            if (activeLinks.length === 0) return null;
            const primary = activeLinks.find(l => l.type === 'primary');
            return primary ? primary.url : activeLinks[0].url;
        }

        if (platform.toLowerCase() === 'youtube') return 'https://youtube.com/@dharanixstudio';
        if (platform.toLowerCase() === 'instagram') return 'https://www.instagram.com/visionofad';
        return null;
    };

    const getSecondaryLink = (platform) => {
        const hasAnyLink = socialLinks.some(l => l.platform.toLowerCase() === platform.toLowerCase());
        
        if (hasAnyLink) {
            const activeLinks = socialLinks.filter(l => l.platform.toLowerCase() === platform.toLowerCase() && l.isActive);
            if (activeLinks.length === 0) return null;
            const secondary = activeLinks.find(l => l.type === 'secondary');
            return secondary ? secondary.url : activeLinks[0].url;
        }

        if (platform.toLowerCase() === 'youtube') return 'https://youtube.com/@dharanixstudio';
        if (platform.toLowerCase() === 'instagram') return 'https://www.instagram.com/visionofad';
        return null;
    };

    const getAllActiveForPlatform = (platform) => {
        return socialLinks.filter(l => l.platform.toLowerCase() === platform.toLowerCase() && l.isActive);
    };

    const refreshLinks = async () => {
        try {
            const res = await api.get('/public/social-links');
            if (res.data) {
                setSocialLinks(res.data);
            }
        } catch (err) {
            console.error('Failed to refresh social links:', err);
        }
    };

    return (
        <SocialContext.Provider value={{ socialLinks, loading, getPrimaryLink, getSecondaryLink, getAllActiveForPlatform, refreshLinks }}>
            {children}
        </SocialContext.Provider>
    );
};
