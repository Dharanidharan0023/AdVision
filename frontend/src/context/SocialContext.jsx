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
        const link = socialLinks.find(l => l.platform.toLowerCase() === platform.toLowerCase() && l.type === 'primary' && l.isActive);
        return link ? link.url : null;
    };

    const getSecondaryLink = (platform) => {
        const link = socialLinks.find(l => l.platform.toLowerCase() === platform.toLowerCase() && l.type === 'secondary' && l.isActive);
        return link ? link.url : null;
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
