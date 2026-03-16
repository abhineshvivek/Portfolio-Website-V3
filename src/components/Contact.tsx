import React, { useRef, useState } from 'react';
import { ArrowUpRight, Copy, Check } from 'lucide-react';
import { portfolioData } from '../data';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import { useModal } from '../context/ModalContext';
import confetti from 'canvas-confetti';

// Modern Hover Link Component
const MagneticLink = ({ href, children, target = "_blank", onClick }: { href?: string, children: React.ReactNode, target?: string, onClick?: () => void }) => {
    const { setCursorVariant } = useCursor();
    const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
    const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Subtle 5-10px pull
        x.set((e.clientX - centerX) * 0.1);
        y.set((e.clientY - centerY) * 0.1);
    };

    const handleMouseLeave = () => {
        setCursorVariant('default');
        x.set(0);
        y.set(0);
    };

    const Component = onClick ? 'button' : 'a';
    const componentProps = onClick ? { onClick } : { href, target, rel: target === "_blank" ? "noreferrer noopener" : undefined };

    return (
        <Component
            {...componentProps}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setCursorVariant('purple')}
            onMouseLeave={handleMouseLeave}
            className="group relative flex items-center justify-between py-4 text-zinc-900 dark:text-white w-full text-left"
        >
            <motion.span
                style={{ x, y }}
                className="text-2xl font-light tracking-wide z-10"
            >
                {children}
            </motion.span>
            <motion.div style={{ x, y }} className="z-10">
                <ArrowUpRight
                    size={28}
                    className="text-zinc-300 dark:text-zinc-700 group-hover:text-[#B200FF] transition-colors duration-300"
                />
            </motion.div>

            {/* Minimalist Expanding Underline */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-zinc-200 dark:bg-zinc-800" />

            {/* White line that scales from center outward on hover */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-white origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 hidden dark:block" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-black origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 block dark:hidden" />
        </Component>
    );
};

export const Contact: React.FC = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [copied, setCopied] = useState(false);
    const { setCursorVariant } = useCursor();
    const { openResume } = useModal();

    // Scroll progress specifically for the footer section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    // Transform scroll progress to a clip-path percentage (from 100% down to 0%)
    // This creates a bottom-to-top reveal effect
    const clipPathPercentage = useTransform(scrollYProgress, [0.3, 1], [100, 0]);
    const clipPathStyle = useTransform(clipPathPercentage, val => `inset(${val}% 0 0 0)`);

    return (
        <section
            id="contact"
            ref={containerRef}
            className="relative min-h-screen bg-zinc-50 dark:bg-dark-bg transition-colors duration-300 flex flex-col justify-end py-24 md:py-40 pb-0 md:pb-0"
        >
            <div className="relative px-6 md:px-20 pb-12 w-full max-w-[1400px] mx-auto z-10 grow flex flex-col justify-end">

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-24 relative z-10 w-full grow">

                    {/* Left Side: Scroll-linked massive typography */}
                    <div className="flex-1 w-full mt-10 lg:mt-0 relative">
                        {/* The Stroke Text (Always Visible) */}
                        <div className="relative pointer-events-none mb-12 select-none">
                            <h2
                                className="text-5xl md:text-[12vw] font-bold leading-[1.1] md:leading-[0.85] tracking-tighter uppercase text-transparent"
                                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}
                            >
                                Let's<br />Work
                            </h2>
                            <div className="absolute -bottom-6 left-[2%] text-3xl md:text-[4vw] md:top-[85%] text-[#B200FF] italic font-serif lowercase">
                                together
                            </div>
                        </div>

                        {/* The Filled Text (Revealed on Scroll) */}
                        <motion.div
                            className="absolute top-0 left-0 pointer-events-none mb-12 select-none z-10"
                            style={{ clipPath: clipPathStyle }}
                        >
                            <h2 className="text-5xl md:text-[12vw] font-bold leading-[1.1] md:leading-[0.85] tracking-tighter uppercase text-zinc-900 dark:text-white">
                                Let's<br />Work
                            </h2>
                            <div className="absolute -bottom-6 left-[2%] text-3xl md:text-[4vw] md:top-[85%] text-[#B200FF] italic font-serif lowercase drop-shadow-[0_0_20px_rgba(178,0,255,0.4)]">
                                together
                            </div>
                        </motion.div>

                        <a
                            href="mailto:hello@abhineshvivek.com"
                            onClick={(e) => {
                                // Prevent default if we only want to copy, or let it open mail client.
                                // The user requested the href to open the mail client, so we won't strictly preventDefault unless we want to, 
                                // but standard behavior is fine. We will still copy to clipboard.
                                navigator.clipboard.writeText("hello@abhineshvivek.com");
                                setCopied(true);

                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = (rect.left + rect.width / 2) / window.innerWidth;
                                const y = (rect.top + rect.height / 2) / window.innerHeight;

                                confetti({
                                    particleCount: 100,
                                    spread: 70,
                                    origin: { x, y },
                                    colors: ['#B200FF', '#ffffff', '#000000']
                                });

                                setTimeout(() => setCopied(false), 3000);
                            }}
                            onMouseEnter={() => setCursorVariant('purple')}
                            onMouseLeave={() => setCursorVariant('default')}
                            className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-medium transition-transform hover:scale-105 group w-full sm:w-max max-w-full mt-8 relative z-20 cursor-pointer text-sm md:text-base"
                        >
                            {copied ? <Check size={20} className="text-green-400 dark:text-green-600 shrink-0" /> : <Copy size={20} className="shrink-0" />}
                            <span className="truncate">{copied ? "Copied!" : "hello@abhineshvivek.com"}</span>
                            <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-0 w-0 -ml-4" />
                        </a>
                    </div>

                    {/* Right Side: Links */}
                    <div className="flex flex-col gap-2 w-full lg:w-[400px] mb-8 lg:mb-20">
                        <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-xl font-light leading-relaxed">
                            Currently available for freelance projects and full-time opportunities.
                        </p>

                        <div className="flex flex-col gap-2">
                            <MagneticLink href={portfolioData.socials.linkedin}>LinkedIn</MagneticLink>
                            <MagneticLink href={portfolioData.socials.dribbble}>Dribbble</MagneticLink>
                            <MagneticLink href={portfolioData.socials.behance}>Behance</MagneticLink>
                            <MagneticLink onClick={openResume}>View Resume</MagneticLink>
                        </div>
                    </div>
                </div>

                {/* Ultra-Clean Bottom Bar */}
                <div className="relative z-10 w-full mt-24 text-[10px] md:text-xs text-zinc-500/60 dark:text-white/40 tracking-wider text-center uppercase pb-8">
                    ABHINESH &copy; {new Date().getFullYear()} &bull; Product & Communication Designer
                </div>
            </div>
        </section>
    );
};
