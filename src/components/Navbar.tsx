import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Home, User, Briefcase, Mail, Sun, Moon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCursor } from '../context/CursorContext';
import { useModal } from '../context/ModalContext';
import { useTextScramble } from '../hooks/useTextScramble';

const ScrambleText = ({ text, isHovered }: { text: string; isHovered: boolean }) => {
    const scrambled = useTextScramble(text, isHovered, 300);
    return (
        <span className={`transition-colors duration-150 ${isHovered && scrambled !== text ? 'text-[#B200FF] font-mono tracking-tighter' : ''}`}>
            {scrambled}
        </span>
    );
};

interface NavbarProps {
    skipDelay?: boolean;
    isDarkMode?: boolean;
    toggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    skipDelay = false,
    isDarkMode = true,
    toggleDarkMode = () => { }
}) => {
    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'projects', icon: Briefcase, label: 'Featured Works' },
        { id: 'about', icon: User, label: 'About' },
        { id: 'contact', icon: Mail, label: 'Contact' },
    ];

    const location = useLocation();
    const navigate = useNavigate();
    const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isFlaring, setIsFlaring] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { setCursorVariant } = useCursor();
    const { openResume } = useModal();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        // Hide dock when scrolling down significantly, show when scrolling up
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else if (latest < previous - 10 || latest < 10) {
            setHidden(false);
        }

        // Keep the bottom check (optional, but good for footers if needed)
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        if (latest + clientHeight >= scrollHeight - 10) {
            setIsAtBottom(true);
        } else {
            setIsAtBottom(false);
        }
    });

    useEffect(() => {
        if (pendingScrollId && location.pathname === '/') {
            // Need a slight delay to allow the homepage DOM to render
            setTimeout(() => {
                const el = document.getElementById(pendingScrollId);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
                setPendingScrollId(null);
            }, 100);
        }
    }, [location.pathname, pendingScrollId]);

    const scrollTo = (id: string) => {
        if (location.pathname !== '/') {
            setPendingScrollId(id);
            navigate('/');
        } else {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const handleThemeToggle = () => {
        toggleDarkMode();
        if (isDarkMode) {
            // Switching to light mode triggers the flare
            setIsFlaring(true);
            setTimeout(() => setIsFlaring(false), 1000);
        }
    };

    return (
        <AnimatePresence>
            {!isAtBottom && (
                <motion.div
                    variants={{
                        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25, delay: skipDelay ? 0 : 2.5 } },
                        hidden: { y: "100%", opacity: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
                        initial: { y: skipDelay ? 20 : 100, opacity: 0 }
                    }}
                    initial="initial"
                    animate={hidden ? "hidden" : "visible"}
                    exit="hidden"
                    className="fixed bottom-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 w-full flex justify-center pointer-events-none"
                    onMouseLeave={() => {
                        setHoveredId(null);
                        setCursorVariant('default');
                    }}
                >
                    <nav className="relative px-3 sm:px-4 md:px-5 py-3 sm:py-3.5 rounded-full flex items-center justify-between md:justify-center gap-2 shadow-2xl shadow-black/5 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-neutral-200/50 dark:border-neutral-800/50 transition-colors duration-500 w-auto min-w-[300px] pointer-events-auto">

                        {/* Light Flare Overlay */}
                        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                            <AnimatePresence>
                                {isFlaring && (
                                    <motion.div
                                        initial={{ left: '-20%', opacity: 0 }}
                                        animate={{ left: '120%', opacity: [0, 1, 1, 0] }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                                        className="absolute top-0 bottom-0 w-32 bg-linear-to-r from-transparent via-white/40 dark:via-[#B200FF]/40 to-transparent skew-x-[-20deg]"
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isHovered = hoveredId === item.id;

                            return (
                                <motion.button
                                    key={item.id}
                                    onClick={() => scrollTo(item.id)}
                                    onMouseEnter={() => {
                                        setHoveredId(item.id);
                                        setCursorVariant('purple');
                                    }}
                                    whileTap={{ scale: 0.9, transition: { duration: 0.2 } }}
                                    className="relative flex items-center justify-center min-w-[48px] min-h-[48px] px-3 md:px-4 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-300 flex-col group z-10 w-full md:w-auto overflow-hidden"
                                    aria-label={item.label}
                                >
                                    <Icon size={24} className="relative z-10 group-hover:scale-110 active:scale-120 transition-transform duration-300 stroke-[1.5]" />
                                    <span className="text-[10px] font-medium tracking-wide uppercase opacity-0 lg:group-hover:opacity-100 absolute -top-10 transition-opacity text-zinc-900 dark:text-white whitespace-nowrap hidden lg:block">
                                        <ScrambleText text={item.label} isHovered={isHovered} />
                                    </span>
                                    {isHovered && (
                                        <motion.div
                                            layoutId="nav-hover-bg"
                                            className="absolute inset-0 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-full z-0 hidden md:block"
                                            transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.5 }}
                                            style={{ borderRadius: '24px' }}
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                        {/* Divider */}
                        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1 z-10 hidden md:block" />

                        {/* Premium Resume Pill */}
                        <motion.button
                            onClick={openResume}
                            onMouseEnter={() => setCursorVariant('purple')}
                            onMouseLeave={() => setCursorVariant('default')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative hidden md:flex items-center justify-center px-6 py-2.5 ml-2 text-sm font-semibold tracking-wide bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_6px_20px_rgba(255,255,255,0.15)] transition-shadow duration-300 z-10 group"
                        >
                            <span>Resume</span>
                            {/* Inner subtle glow/sheen on hover */}
                            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-transparent via-white/10 dark:via-black/5 to-transparent skew-x-[-20deg] pointer-events-none" />
                        </motion.button>

                        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-2 z-10 hidden md:block" />
                        <motion.button
                            onClick={handleThemeToggle}
                            onMouseEnter={() => {
                                setHoveredId('theme');
                                setCursorVariant('purple');
                            }}
                            onMouseLeave={() => setCursorVariant('default')}
                            whileTap={{ scale: 0.9, transition: { duration: 0.2 } }}
                            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors duration-300 overflow-hidden z-10 ml-1 md:ml-2 group"
                            aria-label="Toggle Theme"
                        >
                            {!mounted ? (
                                <div className="w-10 h-10" />
                            ) : (
                                <div className="relative w-full h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300">
                                    {/* Sun Icon (Light Mode) */}
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            y: isDarkMode ? -30 : 0,
                                            opacity: isDarkMode ? 0 : 1,
                                            scale: isDarkMode ? 0.5 : 1,
                                            rotate: isDarkMode ? 90 : 0,
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 1 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <Sun className="w-5 h-5 stroke-[1.5]" />
                                    </motion.div>

                                    {/* Moon Icon (Dark Mode) */}
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            y: isDarkMode ? 0 : 30,
                                            opacity: isDarkMode ? 1 : 0,
                                            scale: isDarkMode ? 1 : 0.5,
                                            rotate: isDarkMode ? 0 : -90,
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 1 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <Moon className="w-5 h-5 stroke-[1.5]" />
                                    </motion.div>
                                </div>
                            )}
                        </motion.button>
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
