import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Loader2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ScrollSequence = ({
    frameCount = 150,
    basePath = '/assets/sequence/',
    filenamePrefix = 'frame',
    filenamePadding = 4,
    filenameExtension = 'jpg'
}) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    // 1. Preload Images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray = [];
        let hasError = false;

        const loadImages = async () => {
            const promises = [];
            for (let i = 1; i <= frameCount; i++) {
                const promise = new Promise((resolve, reject) => {
                    const img = new Image();
                    const paddedNum = i.toString().padStart(filenamePadding, '0');
                    const src = `${basePath}${filenamePrefix}${paddedNum}.${filenameExtension}`;
                    
                    img.onload = () => {
                        loadedCount++;
                        setLoadingProgress(Math.round((loadedCount / frameCount) * 100));
                        imgArray[i - 1] = img; // Ensure correct order even if they load out of order
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image: ${src}`);
                        hasError = true;
                        setError(`Failed to load frame ${i}.`);
                        resolve(); // Resolve anyway so Promise.all finishes, but we handle error via state
                    };
                    img.src = src;
                });
                promises.push(promise);
            }

            await Promise.all(promises);

            if (!hasError) {
                setImages(imgArray);
                setIsLoaded(true);
            }
        };

        loadImages();
    }, [frameCount, basePath, filenamePrefix, filenamePadding, filenameExtension]);

    // 2. Render frame to canvas (Object Fit: Cover logic)
    const renderFrame = (index) => {
        const frameIndex = Math.round(index);
        if (!canvasRef.current || !images[frameIndex]) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no transparency
        const img = images[frameIndex];

        // Only calculate ratios, canvas dimensions should be handled separately
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        // Cover logic
        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // 3. Setup GSAP Animation
    useGSAP(() => {
        if (!isLoaded || !containerRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        
        // Initial canvas sizing
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();

        const playhead = { frame: 0 };

        // Draw initial frame
        renderFrame(playhead.frame);

        const animation = gsap.to(playhead, {
            frame: frameCount - 1,
            snap: "frame", // We can add this back now that canvas resize isn't killing performance
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=300%", // The animation takes 3 viewport heights to complete
                pin: true,
                scrub: 0.5, // Smooth scrubbing
            },
            onUpdate: () => renderFrame(playhead.frame)
        });

        // Handle Window Resize
        const handleResize = () => {
            resizeCanvas();
            renderFrame(playhead.frame);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animation.scrollTrigger) animation.scrollTrigger.kill();
        };
    }, [isLoaded, frameCount]); // Depend on isLoaded to ensure images are ready

    return (
        <section ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
            {!isLoaded && !error && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                    <Loader2 size={48} className="text-neon-cyan animate-spin mb-6" />
                    <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-neon-cyan transition-all duration-300"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-white/50">
                        Initializing Sequence {loadingProgress}%
                    </p>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="text-center space-y-4 max-w-md px-6">
                        <div className="inline-flex w-16 h-16 rounded-2xl bg-red-500/10 items-center justify-center text-red-500 border border-red-500/20 mb-4">
                            !
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-widest text-white">Sequence Error</h3>
                        <p className="text-xs text-gray-400 font-bold leading-relaxed">{error}</p>
                    </div>
                </div>
            )}

            <canvas 
                ref={canvasRef}
                className="w-full h-full block"
            />
            
            {/* Optional Overlay / Vignette */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-10" />
        </section>
    );
};

export default ScrollSequence;
