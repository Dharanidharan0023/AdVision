import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

const CoverImage = ({ src, alt, className, fallbackText = "Image Unavailable" }) => {
    const [imgSrc, setImgSrc] = useState('');
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!src) {
            setHasError(true);
            return;
        }

        // Reset state when src changes
        setHasError(false);

        // Transform Google Drive links to direct image links
        let directUrl = src;
        try {
            if (src.includes('drive.google.com')) {
                // Handle different Google Drive formats
                const fileIdMatch = src.match(/[-\w]{25,}/);
                if (fileIdMatch && fileIdMatch[0]) {
                    directUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[0]}`;
                }
            }
        } catch (err) {
            console.error("Failed to parse image URL", err);
        }

        setImgSrc(directUrl);
    }, [src]);

    if (hasError || !imgSrc) {
        return (
            <div className={`flex flex-col items-center justify-center bg-white/5 border border-white/10 ${className}`}>
                <ImageOff className="text-white/20 mb-2" size={32} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{fallbackText}</span>
            </div>
        );
    }

    return (
        <img
            src={imgSrc}
            alt={alt || "Cover"}
            className={className}
            onError={() => setHasError(true)}
            loading="lazy"
        />
    );
};

export default CoverImage;
