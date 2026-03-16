import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import { Hand } from 'lucide-react';

export const CustomCursor = () => {
    const { cursorVariant } = useCursor();
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 200, mass: 0.2 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
        if (isMobile) return;

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', moveCursor);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [cursorX, cursorY, isVisible]);

    const variants = {
        default: {
            width: 30,
            height: 30,
            x: '-50%',
            y: '-50%',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            mixBlendMode: 'difference' as any,
        },
        view: {
            width: 80,
            height: 80,
            x: '-50%',
            y: '-50%',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            border: 'none',
            mixBlendMode: 'normal' as any,
        },
        grab: {
            width: 60,
            height: 60,
            x: '-50%',
            y: '-50%',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            border: 'none',
            mixBlendMode: 'normal' as any,
        },
        purple: {
            width: 20,
            height: 20,
            x: '-50%',
            y: '-50%',
            backgroundColor: 'transparent',
            border: '2px solid #B200FF',
            mixBlendMode: 'normal' as any,
        }
    };

    if (!isVisible) return null;

    return (
        <>
            {/* The primary 8px dot */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />

            {/* The follower ring / morphing element */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] flex items-center justify-center overflow-hidden"
                style={{
                    x: springX,
                    y: springY,
                }}
                variants={variants}
                animate={cursorVariant}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                {cursorVariant === 'view' && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-black font-sans font-bold text-sm tracking-widest pointer-events-none"
                    >
                        VIEW
                    </motion.span>
                )}
                {cursorVariant === 'grab' && (
                    <motion.div
                        initial={{ opacity: 0, rotate: -45 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -45 }}
                        className="text-black pointer-events-none flex items-center justify-center w-full h-full"
                    >
                        <Hand size={24} className="pointer-events-none" />
                    </motion.div>
                )}
            </motion.div>
        </>
    );
};
