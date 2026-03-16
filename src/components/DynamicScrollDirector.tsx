import React, { useState, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const VISIBILITY_THRESHOLD = 400;
const BOTTOM_THRESHOLD = 0.95;
const RING_RADIUS = 22;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const DynamicScrollDirector: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [direction, setDirection] = useState<'down' | 'up'>('down');
    const prevScrollY = useRef(0);

    const { scrollY, scrollYProgress } = useScroll();

    // Progress ring offset driven by scroll progress
    const strokeDashoffset = useTransform(
        scrollYProgress,
        [0, 1],
        [RING_CIRCUMFERENCE, 0]
    );

    // Visibility + direction tracking
    useMotionValueEvent(scrollY, 'change', (latest) => {
        // Visibility
        setIsVisible(latest > VISIBILITY_THRESHOLD);

        // Direction
        if (latest < prevScrollY.current) {
            setDirection('up');
        } else if (latest > prevScrollY.current) {
            setDirection('down');
        }
        prevScrollY.current = latest;
    });

    // Bottom threshold override
    useMotionValueEvent(scrollYProgress, 'change', (latest) => {
        if (latest > BOTTOM_THRESHOLD) {
            setDirection('up');
        }
    });

    const handleClick = () => {
        if (direction === 'up') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        }
    };

    return (
        <motion.button
            onClick={handleClick}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.8,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`shrink-0 w-14 h-14 rounded-full backdrop-blur-xl bg-white/20 dark:bg-black/40 border border-black/10 dark:border-white/10 shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden group ${!isVisible ? 'pointer-events-none' : ''}`}
            aria-label={direction === 'up' ? 'Scroll to top' : 'Scroll down'}
        >
            {/* SVG Progress Ring */}
            <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 56 56"
            >
                {/* Track */}
                <circle
                    cx="28"
                    cy="28"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="currentColor"
                    className="text-neutral-200/30 dark:text-white/10"
                    strokeWidth="2.5"
                />
                {/* Progress */}
                <motion.circle
                    cx="28"
                    cy="28"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    style={{ strokeDashoffset }}
                />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#B200FF" />
                        <stop offset="100%" stopColor="#7B00CC" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Directional Arrow */}
            <motion.div
                animate={{ rotate: direction === 'up' ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative z-10"
            >
                <ChevronDown className="w-5 h-5 text-neutral-900 dark:text-white group-hover:translate-y-0.5 transition-transform" />
            </motion.div>
        </motion.button>
    );
};
