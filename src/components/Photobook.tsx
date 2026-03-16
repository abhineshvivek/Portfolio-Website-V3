import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { portfolioData } from '../data';
import { Navbar } from './Navbar';
import { useCursor } from '../context/CursorContext';

const imageImports = import.meta.glob('../assets/photobook/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' });
const rawImagePaths = Object.values(imageImports) as string[];

const getCaption = (path: string) => {
    const filename = path.split('/').pop() || '';
    return portfolioData.photobookCaptions[filename] || '';
};

const PolaroidCard = ({ src, i, windowSize, caption, bringToFront, containerRef }: any) => {
    const { setCursorVariant } = useCursor();
    const [zIndex, setZIndex] = useState(1);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useMotionValue(0);

    // Calculate initial random properties ONCE
    const [[randomX, randomY, randomRotation]] = useState(() => {
        const rx = (Math.random() - 0.5) * (windowSize.width * 0.5);
        const ry = (Math.random() - 0.5) * (windowSize.height * 0.5);
        const rrot = (Math.random() - 0.5) * 30;
        return [rx, ry, rrot];
    });

    useEffect(() => {
        // Entrance animation to scatter to random positions natively without causing drag snap-backs
        const transition = { type: "spring", damping: 14, stiffness: 120, mass: 0.8, delay: i * 0.04 };
        animate(x, randomX, transition as any);
        animate(y, randomY, transition as any);
        animate(rotate, randomRotation, transition as any);
    }, [i, randomX, randomY, randomRotation, x, y, rotate]);

    const handlePointerDown = () => {
        setZIndex(bringToFront());
    };

    return (
        <motion.div
            key={src}
            onMouseEnter={() => setCursorVariant('grab')}
            onMouseLeave={() => setCursorVariant('default')}
            onPointerDown={handlePointerDown}
            drag
            dragConstraints={containerRef}
            dragElastic={0.1}
            dragMomentum={true}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, cursor: 'grab', boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
            whileDrag={{ scale: 1.1, cursor: 'grabbing', boxShadow: "0 30px 60px -15px rgba(0,0,0,0.6)" }}
            whileTap={{ scale: 1.1 }}
            style={{ x, y, rotate, zIndex, width: 'min(300px, 70vw)' }}
            className="absolute bg-[#fcfcfc] p-3 md:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-black/5 dark:border-white/10 group flex flex-col pointer-events-auto touch-none"
        >
            <div className="w-full aspect-square bg-zinc-200 overflow-hidden relative pointer-events-none mb-4 shrink-0 rounded-sm">
                <img
                    src={src}
                    alt="Polaroid"
                    loading="lazy"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable="false"
                />
                <div className="absolute inset-0 shadow-[inset_0_4px_12px_rgba(0,0,0,0.3)] ring-1 ring-black/5 inset pointer-events-none rounded-sm" />
            </div>
            <div className="w-full text-center flex-1 flex items-center justify-center pt-2 pb-1 pointer-events-none opacity-90">
                <span className={`text-xl tracking-wide text-zinc-800 pointer-events-none px-2 block break-words whitespace-normal leading-relaxed capitalize min-h-[1.5rem] ${caption ? 'font-[family-name:var(--font-handwriting)]' : ''}`}>
                    {caption || ''}
                </span>
            </div>
        </motion.div>
    );
};

export const Photobook = () => {
    const [images, setImages] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    // Z-Index Management
    const [maxZIndex, setMaxZIndex] = useState(10);
    const bringToFront = () => {
        setMaxZIndex(prev => prev + 1);
        return maxZIndex + 1;
    };

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        setImages(rawImagePaths.length > 0 ? rawImagePaths : []);
        // Center the scroll on load assuming a larger container
        if (containerRef.current) {
            const container = containerRef.current;
            container.scrollLeft = (container.scrollWidth - window.innerWidth) / 2;
            container.scrollTop = (container.scrollHeight - window.innerHeight) / 2;
        } else {
            window.scrollTo(0, 0);
        }
    }, [containerRef]);

    return (
        <div className="w-screen h-screen overflow-auto bg-[#fcfcfc] dark:bg-dark-surface text-zinc-900 dark:text-white relative transition-colors duration-300" ref={containerRef}>
            <div className="absolute inset-0 w-[200vw] h-[200vh]">
                <div className="absolute inset-0 pointer-events-none dark:hidden" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                <div className="absolute inset-0 pointer-events-none hidden dark:block" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                <Navbar skipDelay={true} />

                <div className="fixed top-8 left-8 md:top-12 md:left-12 z-50 pointer-events-none">
                    <h1 className="text-5xl md:text-7xl font-sans tracking-tight text-zinc-900 dark:text-white font-medium">
                        My Camera <span className="text-[#B200FF] font-serif italic">Roll.</span>
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 font-sans mt-4 max-w-sm text-lg leading-relaxed">
                        Grab, drag, and throw these around. A messy collection of things I love.
                    </p>
                    <button
                        onClick={() => { window.location.href = '/' }}
                        className="mt-8 relative flex items-center justify-center px-6 py-3 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden transition-colors duration-500 hover:border-[#B200FF]/50 pointer-events-auto group cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-[#B200FF] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                        <span className="relative z-10 text-zinc-900 dark:text-white font-medium tracking-wide text-sm flex items-center gap-2">
                            ← Back to portfolio
                        </span>
                    </button>
                </div>

                <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                    {images.length === 0 ? (
                        <div className="text-center font-[family-name:var(--font-handwriting)] text-3xl text-zinc-500 z-10 pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <p>No photos found yet.</p>
                            <p className="text-xl mt-2 font-sans">Drop some images into <code className="text-sm bg-white px-2 py-1 rounded">src/assets/photobook/</code></p>
                        </div>
                    ) : windowSize.width > 0 ? (
                        images.map((src, i) => (
                            <PolaroidCard
                                key={src}
                                src={src}
                                i={i}
                                windowSize={windowSize}
                                caption={getCaption(src)}
                                bringToFront={bringToFront}
                                containerRef={containerRef}
                            />
                        ))
                    ) : null}
                </div>
            </div>
        </div>
    );
};
