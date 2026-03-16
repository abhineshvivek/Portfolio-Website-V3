import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { portfolioData } from '../data';
import { useModal } from '../context/ModalContext';

// --- Magnetic Button Component ---
const MagneticButton = ({ children, onClick, href, className }: { children: React.ReactNode, onClick?: () => void, href?: string, className?: string }) => {
    const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
    const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;

            // Interaction radius: 50px beyond the button's exact dimensions
            const padding = 50;
            if (
                e.clientX >= rect.left - padding && e.clientX <= rect.right + padding &&
                e.clientY >= rect.top - padding && e.clientY <= rect.bottom + padding
            ) {
                // Softly pull toward the mouse
                x.set(distanceX * 0.2);
                y.set(distanceY * 0.2);
            } else {
                x.set(0);
                y.set(0);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [x, y]);

    if (href) {
        return (
            <a href={href} className={className} target="_blank" rel="noopener noreferrer">
                <motion.div ref={ref} style={{ x, y }} className="flex items-center justify-center w-full h-full gap-2 group">
                    {children}
                </motion.div>
            </a>
        );
    }
    return (
        <button onClick={onClick} className={className}>
            <motion.div ref={ref} style={{ x, y }} className="flex items-center justify-center w-full h-full gap-2 group cursor-pointer">
                {children}
            </motion.div>
        </button>
    );
};

const InteractiveProjectStack = ({ getDelay }: { getDelay: (baseDelay: number) => number }) => {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    // Physics configuration for premium motion
    const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };

    // Cursor tracking springs for 3D tilt
    const mouseX = useSpring(0, springConfig);
    const mouseY = useSpring(0, springConfig);

    // Get 3 project images
    const stackImages = portfolioData.projects
        .flatMap(p => p.screenshots && p.screenshots.length > 0 ? p.screenshots : [p.image])
        .slice(0, 3);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate normalized offset (-1 to 1) for 3D rotation
        const normalizedX = (e.clientX - rect.left - centerX) / centerX;
        const normalizedY = (e.clientY - rect.top - centerY) / centerY;

        // Limit tilt to max 15 degrees
        mouseX.set(normalizedX * 15);
        mouseY.set(normalizedY * -15); // Invert Y for natural tilt
    };

    const handleMouseLeave = () => {
        setHoveredIdx(null);
        mouseX.set(0);
        mouseY.set(0);
    };

    if (stackImages.length === 0) return null;

    return (
        <div
            className="relative w-[80%] md:w-full aspect-4/3 max-w-lg mx-auto lg:ml-auto group perspective-[2000px]"
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none transform-3d">
                {stackImages.map((img, idx) => {
                    const isHovered = hoveredIdx === idx;

                    // Static settled positions
                    const baseRotateZ = idx === 0 ? -4 : idx === 1 ? 2 : 6;
                    const baseZIndex = 30 - idx;
                    const baseXOffset = idx === 0 ? '-10%' : idx === 1 ? '5%' : '15%';
                    const baseYOffset = idx === 0 ? '5%' : idx === 1 ? '-5%' : '10%';

                    return (
                        <motion.div
                            key={idx}
                            onMouseEnter={() => setHoveredIdx(idx)}
                            initial={{
                                y: '100%',
                                x: 0,
                                opacity: 0,
                                rotateZ: baseRotateZ * 3, // Start with exaggerated rotation
                                scale: 0.8
                            }}
                            animate={{
                                y: isHovered ? `calc(${baseYOffset} - 20px)` : baseYOffset,
                                x: baseXOffset,
                                opacity: 1,
                                rotateZ: isHovered ? 0 : baseRotateZ,
                                scale: isHovered ? 1.05 : 1,
                                zIndex: isHovered ? 40 : baseZIndex
                            }}
                            transition={{
                                // Entrance animation vs Hover animation
                                opacity: { duration: 0.6, delay: getDelay(2.6) + (idx * 0.08) },
                                y: { type: "spring", damping: 18, stiffness: 120, mass: 1, delay: isHovered ? 0 : getDelay(2.6) + (idx * 0.08) },
                                x: { type: "spring", damping: 18, stiffness: 120, mass: 1, delay: isHovered ? 0 : getDelay(2.6) + (idx * 0.08) },
                                rotateZ: { type: "spring", damping: 18, stiffness: 120, mass: 1, delay: isHovered ? 0 : getDelay(2.6) + (idx * 0.08) },
                                scale: { duration: 0.3 }
                            }}
                            className="absolute w-[90vw] md:w-[80%] aspect-4/3 rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-zinc-100 dark:bg-zinc-900 origin-center pointer-events-auto cursor-grab active:cursor-grabbing"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }} // Snap back instantly
                            dragElastic={0.4} // Allowing the user to peek
                            whileDrag={{ scale: 1.05, rotateZ: 0, zIndex: 50, transition: { duration: 0.1 } }}
                            style={{
                                rotateX: mouseY,
                                rotateY: mouseX,
                                boxShadow: isHovered
                                    ? '0 30px 60px -15px rgba(178, 0, 255, 0.3), 0 0 20px rgba(178, 0, 255, 0.2)'
                                    : '0 20px 40px -10px rgba(0,0,0,0.3)'
                            }}
                        >
                            <img
                                src={img}
                                alt={`Project Slice ${idx + 1}`}
                                className="w-full h-full object-cover select-none"
                                draggable="false"
                                fetchPriority="high"
                            />

                            {/* Inner glass reflection */}
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none mix-blend-overlay" />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export const Hero: React.FC<{ skipDelay?: boolean }> = ({ skipDelay = false }) => {
    const delayOffset = skipDelay ? -2.7 : 0;
    const getDelay = (baseDelay: number) => Math.max(0, baseDelay + delayOffset);
    const { openResume } = useModal();

    // Split text logic for animated reveal

    return (
        <section id="home" className="min-h-screen flex flex-col justify-center px-6 md:px-20 py-24 md:py-40">
            <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-8 lg:flex-nowrap">
                <div className="lg:w-1/2 relative flex flex-col items-start z-10 w-full mb-16 md:mb-0 order-1 lg:order-0">
                    {/* 3D Presence Widget */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        transition={{ duration: 0.8, delay: getDelay(2.7), type: "spring", stiffness: 100 }}
                        className="inline-flex items-center bg-white shadow-sm border border-gray-200 dark:bg-zinc-800/30 dark:shadow-none dark:border-white/10 backdrop-blur-md rounded-full sm:rounded-3xl p-1.5 pr-4 md:p-2 md:pr-6 mb-8 mt-6 relative md:cursor-pointer transition-colors duration-300 hover:bg-white/10 dark:hover:bg-white/10 hover:border-black/10 dark:hover:border-white/20 hover:shadow-[0_0_30px_rgba(178,0,255,0.15)]"
                    >
                        {/* 3D WebM Avatar overlaying the box */}
                        <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 -mt-6 sm:-mt-8 md:-mt-10 mr-2 relative shrink-0 pointer-events-none flex items-end">
                            <video
                                src="/videos/abhinesh-3d.webm"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-auto object-contain rounded-full bg-transparent shadow-none outline-none"
                                style={{ mixBlendMode: 'normal', transform: 'translateZ(0)', filter: 'contrast(1.01)' }}
                            />
                        </div>

                        {/* Status & Identity Info */}
                        <div className="flex flex-col justify-center overflow-hidden">
                            <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 dark:text-white/60 tracking-wide uppercase font-medium">Chennai, India</span>
                            </div>
                            <span className="text-xs sm:text-sm md:text-base font-medium text-zinc-900 dark:text-white tracking-tight leading-none pt-0.5 truncate max-w-[200px] sm:max-w-none">
                                Abhinesh — Product & Comm Designer
                            </span>
                        </div>
                    </motion.div>

                    {/* Masked Text Reveal */}
                    <div className="flex flex-wrap items-baseline gap-x-[1vw] gap-y-2 text-4xl sm:text-5xl md:text-7xl lg:text-[5rem] font-medium tracking-tighter text-zinc-900 dark:text-white mb-8 leading-[1.1]">
                        {portfolioData.heroPitch.split(' ').map((word, index) => {
                            // "Designing the Logic." -> indices 0,1,2. "Crafting the Visual." -> 3,4,5
                            const isStyled = index > 2;
                            return (
                                <div key={index} className="overflow-hidden flex">
                                    <motion.span
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: getDelay(2.8) + index * 0.1,
                                            ease: [0.76, 0, 0.24, 1]
                                        }}
                                        className={`inline-block ${isStyled ? 'text-brand italic font-serif px-1' : ''}`}
                                    >
                                        {word}
                                    </motion.span>
                                </div>
                            );
                        })}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: getDelay(3.2), ease: "easeOut" }}
                        className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed mb-12"
                    >
                        <p>{portfolioData.heroDescription}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: getDelay(3.4), ease: "easeOut" }}
                        className="hidden lg:flex items-center gap-4"
                    >
                        <MagneticButton
                            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-medium transition-transform hover:scale-105 group"
                        >
                            Selected Works
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </MagneticButton>
                        <MagneticButton
                            onClick={openResume}
                            className="px-8 py-4 bg-transparent border border-zinc-200 dark:border-white/20 text-zinc-900 dark:text-white rounded-full font-medium transition-colors hover:border-[#B200FF] hover:bg-[#B200FF]/10 dark:hover:border-[#B200FF] dark:hover:bg-[#B200FF]/10 text-nowrap"
                        >
                            View Resume
                        </MagneticButton>
                    </motion.div>
                </div>

                {/* Mobile Actions - Moved under Hero Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: getDelay(3.4), ease: "easeOut" }}
                    className="w-full lg:hidden flex flex-col sm:flex-row justify-center md:justify-start gap-4 order-3 lg:order-0 mt-10 md:mt-10"
                >
                    <button
                        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-medium transition-transform active:scale-95 sm:hover:scale-105 group w-full sm:w-auto"
                    >
                        Selected Works
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={openResume}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-zinc-200 dark:border-white/20 text-zinc-900 dark:text-white rounded-full font-medium transition-colors active:bg-[#B200FF]/20 sm:hover:border-[#B200FF] sm:hover:bg-[#B200FF]/10 dark:sm:hover:border-[#B200FF] dark:sm:hover:bg-[#B200FF]/10 w-full sm:w-auto text-nowrap"
                    >
                        View Resume
                    </button>
                </motion.div>

                <div className="lg:w-1/2 w-full mt-10 md:mt-0 order-2 lg:order-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: getDelay(2.7), ease: "easeOut" }}
                        className="perspective-1000 w-full"
                    >
                        <InteractiveProjectStack getDelay={getDelay} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
