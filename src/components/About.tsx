import React, { useState, useEffect } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Magnetic Pill Button Component
const MagneticPill = ({ children, to }: { children: React.ReactNode, to: string }) => {
    const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
    const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * 0.2);
        y.set((e.clientY - centerY) * 0.2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <Link
            to={to}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative group inline-block z-10"
        >
            <motion.div
                style={{ x, y }}
                className="relative flex items-center justify-center px-10 py-5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden transition-colors duration-500 hover:border-[#B200FF]/50"
            >
                {/* Background color shift */}
                <div className="absolute inset-0 bg-[#B200FF] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                <span className="relative z-10 text-zinc-900 dark:text-white font-medium tracking-wide">
                    {children}
                </span>

                {/* Polaroids (Fanning out) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    {/* Left Polaroid */}
                    <motion.div
                        className="w-24 h-28 bg-white p-1 pb-6 shadow-xl absolute rounded border border-zinc-200"
                        initial={{ opacity: 0, rotate: 0, x: 0, y: 0, scale: 0.8 }}
                        variants={{ hover: { opacity: 1, rotate: -20, x: -80, y: -40, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } } }}
                    >
                        <div className="w-full h-full bg-zinc-200" />
                    </motion.div>

                    {/* Center Polaroid */}
                    <motion.div
                        className="w-24 h-28 bg-white p-1 pb-6 shadow-xl absolute rounded border border-zinc-200"
                        initial={{ opacity: 0, rotate: 0, x: 0, y: 0, scale: 0.8 }}
                        variants={{ hover: { opacity: 1, rotate: 5, x: 0, y: -60, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.05 } } }}
                    >
                        <div className="w-full h-full bg-zinc-300" />
                    </motion.div>

                    {/* Right Polaroid */}
                    <motion.div
                        className="w-24 h-28 bg-white p-1 pb-6 shadow-xl absolute rounded border border-zinc-200"
                        initial={{ opacity: 0, rotate: 0, x: 0, y: 0, scale: 0.8 }}
                        variants={{ hover: { opacity: 1, rotate: 25, x: 80, y: -30, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.1 } } }}
                    >
                        <div className="w-full h-full bg-zinc-200" />
                    </motion.div>
                </div>
            </motion.div>
        </Link>
    );
};

const LiveEnvironmentWidget = () => {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const options: Intl.DateTimeFormatOptions = {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            setTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 rounded-2xl bg-black/5 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-none mb-8 w-max overflow-hidden group scale-90 sm:scale-100 origin-left"
        >
            {/* Animated Radial Pulse (Heartbeat) */}
            <motion.div
                className="absolute -left-10 -top-10 w-32 h-32 bg-[#B200FF]/20 dark:bg-[#B200FF]/30 rounded-full blur-2xl z-0"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Left Box: Monospace Clock */}
            <div className="relative z-10 flex flex-col items-start justify-center bg-white/50 dark:bg-black/20 rounded-lg px-3 py-1.5 border border-zinc-200 dark:border-white/5 font-mono text-sm tracking-widest text-[#B200FF] font-medium w-[125px]">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={time} // Re-animate slightly on change (optional, but keep it simple if ticking is enough)
                        className="tabular-nums"
                    >
                        {time}
                    </motion.span>
                </AnimatePresence>
            </div>

            <div className="w-px h-6 bg-zinc-200 dark:bg-white/10 relative z-10" />

            {/* Right Box: Sans-Serif Location */}
            <div className="relative z-10 flex items-center gap-2">
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-2.5 h-2.5 rounded-full bg-[#B200FF]"
                />
                <span className="font-sans text-sm font-medium text-zinc-700 dark:text-white/80 pr-1">
                    Chennai, India
                </span>
            </div>

            {/* Faint subtle border glow */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-[#B200FF]/0 transition-all duration-500 pointer-events-none z-10" />
        </motion.div>
    );
};

export const About: React.FC = () => {
    return (
        <section id="about" className="py-24 md:py-40 px-6 md:px-20 bg-zinc-50 dark:bg-dark-bg selection:bg-[#B200FF]/30 transition-colors duration-300 overflow-hidden">
            <div className="max-w-[1200px] mx-auto w-full">

                <div className="mb-24">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white">
                        About <span className="text-[#B200FF] font-serif italic">Me.</span>
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">

                    {/* Left Column: The Portrait */}
                    <div className="w-full md:w-5/12 relative perspective-1000">
                        <motion.div
                            className="group relative aspect-4/5 w-full max-w-[400px] overflow-hidden rounded-4xl shadow-2xl bg-zinc-200 dark:bg-zinc-800"
                        >
                            {/* Cinematic Lens Focus */}
                            <motion.img
                                initial={{ opacity: 0, scale: 1.15, filter: "blur(20px)" }}
                                whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    type: "spring",
                                    mass: 1,
                                    stiffness: 80,
                                    damping: 20
                                }}
                                src="/images/avatar.png"
                                alt="Abhinesh V Profile"
                                className="w-full h-full object-cover relative z-0 origin-center"
                            />

                            {/* Hover Overlay Gradient */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
                        </motion.div>
                    </div>

                    {/* Right Column: Bio Text & Actions */}
                    <div className="w-full md:w-7/12 flex flex-col items-start text-left">

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-start w-full"
                        >
                            <LiveEnvironmentWidget />

                            <p className="text-2xl md:text-3xl lg:text-4xl text-zinc-900 dark:text-white font-medium tracking-tight leading-[1.35] mb-8">
                                I don’t just design for the screen. I design for the <span className="text-[#B200FF] font-serif italic">build</span>.
                            </p>

                            <div className="space-y-6 mb-12">
                                <p className="text-lg md:text-xl text-zinc-600 dark:text-white/80 leading-relaxed font-light">
                                    I leverage my Computer Science Engineering background to bring a truly 'Full-Stack' perspective to product design. From mapping out intricate user journeys in Figma to navigating the complexities of Framer, I ensure that every pixel I push is structurally sound and ready for deployment.
                                </p>
                                <p className="text-lg md:text-xl text-zinc-600 dark:text-white/80 leading-relaxed font-light">
                                    Off-screen, I'm usually exploring new digital and natural worlds. Whether I'm building self-sustaining ecosystems in my planted aquariums or testing out the latest PC multiplayer releases alongside staples like League of Legends and Overwatch, I love figuring out how things work beneath the surface.
                                </p>
                            </div>
                        </motion.div>

                        {/* P.S. Magnetic Check Camera Roll Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="mt-2 w-full flex justify-start"
                        >
                            <MagneticPill to="/photobook">
                                P.S. check out my camera roll
                            </MagneticPill>
                        </motion.div>

                    </div>

                </div>
            </div>
        </section>
    );
};
