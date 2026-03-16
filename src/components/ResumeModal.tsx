import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Copy, Check } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { useCursor } from '../context/CursorContext';
import confetti from 'canvas-confetti';

export const ResumeModal = () => {
    const { isResumeOpen, closeResume } = useModal();
    const { setCursorVariant } = useCursor();
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
        navigator.clipboard.writeText("hello@abhineshvivek.com");
        setCopied(true);

        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 50,
            spread: 60,
            origin: { x, y },
            colors: ['#B200FF', '#ffffff']
        });

        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <AnimatePresence>
            {isResumeOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        onClick={closeResume}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
                        onMouseEnter={() => setCursorVariant('default')}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ y: 50, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="relative w-full max-w-3xl bg-[#111]/90 border border-white/10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(178,0,255,0.15)] overflow-hidden flex flex-col md:flex-row z-10"
                        onMouseEnter={() => setCursorVariant('default')}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeResume}
                            onMouseEnter={() => setCursorVariant('purple')}
                            onMouseLeave={() => setCursorVariant('default')}
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        {/* Left Column (TL;DR) */}
                        <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10">
                            <h2 className="text-3xl font-medium tracking-tight text-white mb-2">Abhinesh</h2>
                            <p className="text-[#B200FF] font-serif italic text-lg mb-8">Product Designer</p>

                            <ul className="space-y-4 text-zinc-400 font-light leading-relaxed">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                                    <span>Focus: UX & Product Design, Graphic Design, Communication Design</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                                    <span>Background: Computer Science Engineering</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                                    <span>Base: Chennai, India</span>
                                </li>
                            </ul>
                        </div>

                        {/* Right Column (Actions) */}
                        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center gap-4 bg-white/5">
                            <a
                                href="/Abhinesh-V-Resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={() => setCursorVariant('purple')}
                                onMouseLeave={() => setCursorVariant('default')}
                                className="group w-full flex items-center justify-between px-6 py-4 bg-white text-black rounded-xl font-medium transition-transform hover:scale-[1.02]"
                            >
                                <span>Download Full PDF</span>
                                <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                            </a>

                            <button
                                onClick={handleCopy}
                                onMouseEnter={() => setCursorVariant('purple')}
                                onMouseLeave={() => setCursorVariant('default')}
                                className="group w-full flex items-center justify-between px-6 py-4 bg-transparent border border-white/20 text-white rounded-xl font-medium transition-all hover:bg-white/5 hover:border-white/40"
                            >
                                <span>{copied ? "Copied!" : "Copy Email Address"}</span>
                                {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="group-hover:scale-110 transition-transform" />}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
