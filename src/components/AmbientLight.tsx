import { useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export const AmbientLight = () => {
    // Smoother springing for the background light vs the instant cursor
    const springConfig = { damping: 40, stiffness: 100, mass: 1 };
    const mouseX = useSpring(0, springConfig);
    const mouseY = useSpring(0, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
            style={{
                x: mouseX,
                y: mouseY,
                translateX: '-50%',
                translateY: '-50%',
                background: 'radial-gradient(circle, rgba(178, 0, 255, 0.05) 0%, rgba(178, 0, 255, 0) 70%)',
                filter: 'blur(40px)',
            }}
        />
    );
};
