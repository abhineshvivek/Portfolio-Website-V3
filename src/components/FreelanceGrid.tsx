import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const mediaImports = import.meta.glob('../assets/freelance/*.{png,jpg,jpeg,webp,mp4,gif}', { eager: true, import: 'default' });
const freelanceItems = Object.entries(mediaImports).map(([path, mod]: [string, any], idx) => {
    const isVideo = path.endsWith('.mp4');
    return {
        id: `freelance-${idx}`,
        type: isVideo ? 'video' : 'image',
        src: mod as string,
        alt: `Freelance visual ${idx + 1}`
    };
});

export const FreelanceGrid: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<{ id: string; src: string; type: string; alt: string } | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <section id="freelance" className="py-24 md:py-40 px-6 md:px-20 bg-zinc-50 dark:bg-dark-bg transition-colors duration-300">
            <div className="max-w-[1400px] mx-auto w-full">
                <div className="mb-24 md:flex flex-col items-start text-left">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 text-zinc-900 dark:text-white">
                        Selected <span className="text-[#B200FF] font-serif italic">Visuals</span> & Freelance Projects.
                    </h2>
                    <p className="text-lg md:text-xl text-zinc-600 dark:text-white/80 font-light leading-relaxed max-w-3xl">
                        A collection of high-fidelity graphic design, brand assets, and visual experiments for international clients and independent projects.
                    </p>
                </div>

                {/* Auto-fill responsive masonry-style grid for visual assets (Carousel on Mobile, Masonry on Tablet/Desktop) */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar sm:block sm:columns-2 md:columns-3 sm:space-y-6 sm:pb-0 sm:gap-6">
                    {freelanceItems.map((item, idx) => {
                        const isHovered = hoveredId === item.id;
                        const isSomethingHovered = hoveredId !== null;

                        // Calculate target values for the depth-of-field effect
                        const targetOpacity = isSomethingHovered ? (isHovered ? 1 : 0.3) : 1;
                        const targetScale = isHovered ? 1.02 : 1;
                        const targetFilter = isSomethingHovered ? (isHovered ? 'blur(0px)' : 'blur(3px)') : 'blur(0px)';

                        return (
                            <motion.div
                                layoutId={`media-${item.id}`}
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                animate={{
                                    opacity: targetOpacity,
                                    scale: targetScale,
                                    filter: targetFilter,
                                }}
                                transition={{
                                    opacity: { duration: 0.4 },
                                    scale: { duration: 0.4, type: "spring", stiffness: 300, damping: 20 },
                                    filter: { duration: 0.4 },
                                    default: { duration: 0.6, delay: idx * 0.1, ease: "easeOut" }
                                }}
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => setSelectedItem({ id: item.id, src: item.src, type: item.type, alt: item.alt })}
                                className="relative w-full rounded-3xl overflow-hidden cursor-zoom-in group bg-zinc-200 dark:bg-zinc-900 shadow-xl dark:shadow-2xl break-inside-avoid mb-0 sm:mb-6 md:mb-8 min-w-[85vw] snap-center shrink-0 sm:min-w-0 sm:shrink"
                            >
                                {item.type === 'video' ? (
                                    <video
                                        src={item.src}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out"
                                    />
                                ) : (
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out"
                                    />
                                )}
                                {/* Subtle inner shadow for depth on all thumbnails */}
                                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_40px_rgba(0,0,0,0.4)] pointer-events-none mix-blend-overlay" />

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-[#B200FF]/10 transition-colors duration-500 flex items-center justify-center pointer-events-none">
                                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                        View Fullscreen
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        onClick={() => setSelectedItem(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 md:p-12 cursor-zoom-out backdrop-blur-lg"
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
                            className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-4 rounded-full backdrop-blur-md transition-all z-50 group border border-white/10"
                        >
                            <X size={28} className="group-hover:scale-110 transition-transform" />
                        </button>

                        <motion.div
                            layoutId={`media-${selectedItem.id}`}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            className="relative max-w-[95vw] md:max-w-[90vw] max-h-[90vh] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Prevent close when clicking the media itself
                        >
                            {selectedItem.type === 'video' ? (
                                <video
                                    src={selectedItem.src}
                                    autoPlay
                                    controls
                                    loop
                                    className="w-full h-full object-contain bg-zinc-900 max-h-[90vh]"
                                />
                            ) : (
                                <img
                                    src={selectedItem.src}
                                    alt={selectedItem.alt}
                                    className="w-full h-full object-contain max-h-[90vh]"
                                />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
