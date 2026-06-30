import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const SiteContext = createContext();

export const useSite = () => useContext(SiteContext);

export const SiteProvider = ({ children }) => {
    const [siteSettings, setSiteSettings] = useState({
        websiteName: 'AdVision',
        footerDescription: 'Creating immersive neuro-cinematic digital experiences.',
        footerCopyright: '© 2026 AdVision Studio. All rights reserved.'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSiteSettings();
    }, []);

    const fetchSiteSettings = async () => {
        try {
            const res = await api.get('/public/home-section/site_settings');
            if (res.data && res.data.content) {
                let parsed;
                try {
                    parsed = JSON.parse(res.data.content);
                } catch (e) {
                    parsed = res.data.content;
                }
                setSiteSettings(prev => ({ ...prev, ...parsed }));
            }
        } catch (err) {
            console.error('Failed to fetch site settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateSiteSettings = async (newSettings) => {
        try {
            const res = await api.post('/admin/home-section', {
                sectionName: 'site_settings',
                content: JSON.stringify(newSettings)
            });
            if (res.data && res.data.content) {
                setSiteSettings(newSettings);
            }
        } catch (err) {
            console.error('Failed to update site settings:', err);
            throw err;
        }
    };

    return (
        <SiteContext.Provider value={{ siteSettings, loading, updateSiteSettings, fetchSiteSettings }}>
            {children}
        </SiteContext.Provider>
    );
};
