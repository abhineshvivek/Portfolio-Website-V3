import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../data';
import { Navbar } from './Navbar';
import { useCursor } from '../context/CursorContext';
import { X } from 'lucide-react';

const imageImports = import.meta.glob('../assets/photobook/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' });
const rawImagePaths = Object.values(imageImports) as string[];

const getCaption = (path: string) => {
    const filename = path.split('/').pop() || '';
    return portfolioData.photobookCaptions[filename] || '';
};

const FullScreenModal = ({ src, onClose, caption }: any) => {
    const { setCursorVariant } = useCursor();

    useEffect(() => {
        if (!src) return;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, [src]);

    return (
        <AnimatePresence>
            {src && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-10000 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-8 cursor-pointer"
                    onClick={onClose}
                    onMouseEnter={() => setCursorVariant('default')}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 lg:top-10 lg:right-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors z-50 cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                    
                    <div className="flex flex-col items-center justify-center max-w-full h-full max-h-[90vh]">
                        <motion.img
                            layoutId={`image-${src}`}
                            src={src}
                            alt="Polaroid Full"
                            className="max-h-[75vh] md:max-h-[85vh] max-w-full object-contain shadow-2xl rounded-sm"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent close when clicking image
                            draggable="false"
                        />
                        {caption && caption.trim() !== '' && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="mt-6 md:mt-8 w-full flex justify-center px-4"
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            >
                                <span className="text-white/80 text-center leading-tight block wrap-break-word whitespace-normal text-2xl md:text-3xl max-w-2xl font-handwriting">
                                    {caption}
                                </span>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const PolaroidCard = ({ src, index, caption, onSelect }: any) => {
    const { setCursorVariant } = useCursor();
    const rotateVal = index % 2 === 0 ? 2 : -3;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, rotate: rotateVal }}
            animate={{ 
                opacity: 1, 
                y: 0, 
                rotate: [rotateVal, rotateVal + 1, rotateVal - 1, rotateVal] 
            }}
            transition={{
                opacity: { duration: 0.6 },
                y: { type: "spring", damping: 20, stiffness: 100 },
                rotate: { 
                    repeat: Infinity, 
                    duration: 5 + Math.random() * 3, 
                    ease: "easeInOut",
                    delay: 0.5 // Start swaying shortly after dropping in
                }
            }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            whileHover={{ 
                rotate: 0, 
                scale: 1.05, 
                zIndex: 50, 
                transition: { type: 'spring', stiffness: 400, damping: 25 } 
            }}
            onClick={() => onSelect(src)}
            onMouseEnter={() => setCursorVariant('view')}
            onMouseLeave={() => setCursorVariant('default')}
            className="bg-white p-4 md:p-5 pb-6 md:pb-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-2xl border border-neutral-200 flex flex-col relative cursor-pointer w-full mx-auto max-w-[400px] md:max-w-none origin-top transition-shadow duration-500"
        >
            {/* Ultra-Realistic 3D Push-Pin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-linear-to-br from-red-400 to-red-700 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.5),0_5px_8px_rgba(0,0,0,0.5)] relative">
                    {/* Specular Highlight */}
                    <div className="absolute top-0.5 left-1 w-1.5 h-1.5 rounded-full bg-white/70 blur-[0.5px]" />
                </div>
            </div>

            <div className="w-full aspect-4/5 bg-zinc-200 overflow-hidden relative rounded-sm shrink-0">
                <motion.img
                    layoutId={`image-${src}`}
                    src={src}
                    alt="Polaroid"
                    loading="lazy"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable="false"
                />
                {/* Vintage inner border effect */}
                <div className="absolute inset-0 shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)] ring-1 ring-black/5 inset pointer-events-none rounded-sm" />
            </div>

            {caption && caption.trim() !== '' && (
                <div className="w-full text-center flex items-center justify-center pt-4 md:pt-5 min-h-12">
                    <span className="text-neutral-600 leading-tight block wrap-break-word whitespace-normal px-2 text-2xl md:text-3xl font-handwriting">
                        {caption}
                    </span>
                </div>
            )}
        </motion.div>
    );
};

export const Photobook = () => {
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        setImages(rawImagePaths.length > 0 ? rawImagePaths : []);
        window.scrollTo(0, 0);
    }, []);

    if (images.length === 0) {
        return (
            <div className="w-screen h-screen bg-[#fcfcfc] dark:bg-dark-surface pt-24 text-center">
                <Navbar skipDelay={true} />
                <h1 className="text-3xl text-zinc-500 font-[family-name:var(--font-handwriting)] mt-24">No photos found yet.</h1>
                <p className="text-xl mt-2 font-sans text-zinc-500">Drop some images into <code className="text-sm bg-black/10 px-2 py-1 rounded">src/assets/photobook/</code></p>
                <button
                    onClick={() => { window.location.href = '/' }}
                    className="mt-8 mx-auto flex items-center justify-center px-6 py-3 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
                >
                    <span className="text-zinc-900 dark:text-white">← Back to portfolio</span>
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] dark:bg-dark-surface text-zinc-900 dark:text-white relative transition-colors duration-300 overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none dark:hidden block" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '16px 16px', backgroundAttachment: 'fixed' }} />
            <div className="fixed inset-0 pointer-events-none hidden dark:block" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '16px 16px', backgroundAttachment: 'fixed' }} />

            <Navbar skipDelay={true} />

            {/* Fixed Header */}
            <div className="fixed top-8 left-6 sm:left-8 md:top-12 md:left-12 z-100 pointer-events-none">
                <div className="bg-[#fcfcfc]/90 dark:bg-dark-surface/90 backdrop-blur-md rounded-2xl px-2 py-1 -ml-2 w-max">
                    <h1 className="text-4xl md:text-6xl font-sans tracking-tight text-zinc-900 dark:text-white font-medium drop-shadow-sm dark:drop-shadow-none">
                        My Camera <span className="text-[#B200FF] font-serif italic">Roll.</span>
                    </h1>
                </div>
                
                <div className="bg-[#fcfcfc]/90 dark:bg-dark-surface/90 backdrop-blur-md rounded-xl px-2 py-1 -ml-2 mt-2 w-max">
                    <p className="text-zinc-600 dark:text-zinc-400 font-sans max-w-sm text-base md:text-lg leading-relaxed">
                        A collection of moments and memories.
                    </p>
                </div>
                
                <button
                    onClick={() => { window.location.href = '/' }}
                    className="mt-6 flex items-center justify-center px-6 py-3 rounded-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/50 backdrop-blur-md hover:border-[#B200FF]/50 transition-colors pointer-events-auto w-max cursor-pointer text-sm font-medium shadow-sm"
                >
                    <span className="text-zinc-900 dark:text-white flex items-center gap-2">
                        ← Back to portfolio
                    </span>
                </button>
            </div>

            {/* Pinboard Grid */}
            <div className="pt-64 md:pt-48 pb-32 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                {images.map((src, index) => (
                    <PolaroidCard
                        key={src}
                        src={src}
                        index={index}
                        caption={getCaption(src)}
                        onSelect={setSelectedImage}
                    />
                ))}
            </div>

            <FullScreenModal 
                src={selectedImage} 
                caption={selectedImage ? getCaption(selectedImage) : ''} 
                onClose={() => setSelectedImage(null)} 
            />
        </div>
    );
};
