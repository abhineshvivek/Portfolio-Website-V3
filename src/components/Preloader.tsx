import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/*
 * Figma-Workspace Preloader — Purple Brand Edition
 * ─────────────────────────────────────────────────
 * 0.0s   Grid + wireframe draws in
 * 0.1s   Measurement lines animate in (draw effect)
 * 0.4s   Cursor swoops in from bottom-right
 * 0.85s  Cursor clicks → wireframe scatters → hi-fi blooms
 * 1.5s   Hold the resolved card
 * 2.0s   Full canvas slides away
 * ~2.5s  onComplete
 */

const BRAND = '#B200FF';
const BRAND_DIM = 'rgba(178,0,255,';

export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [phase, setPhase] = useState<'wire' | 'resolve' | 'exit'>('wire');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('resolve'), 850);
        const t2 = setTimeout(() => setPhase('exit'), 2000);
        const t3 = setTimeout(onComplete, 2500);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [onComplete]);

    const hifi = phase === 'resolve' || phase === 'exit';

    return (
        <AnimatePresence>
            {phase !== 'exit' ? (
                <motion.div
                    key="preloader"
                    exit={{ y: '-100%' }}
                    transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden select-none"
                    style={{
                        background: '#09090B',
                        backgroundImage: `radial-gradient(${BRAND_DIM}0.06) 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                    }}
                >
                    {/* Vignette edges */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />

                    {/* Ambient purple glow — intensifies on resolve */}
                    <motion.div
                        animate={{ opacity: hifi ? 0.35 : 0.08, scale: hifi ? 1.2 : 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
                        style={{ background: `radial-gradient(circle, ${BRAND_DIM}0.5) 0%, transparent 70%)` }}
                    />

                    {/* ── Fixed-size card container ── */}
                    <div className="relative w-[300px] sm:w-[340px] h-[340px] sm:h-[370px]">

                        {/* ═══════════════════════════════════ */}
                        {/* ═══ WIREFRAME LAYER ═══            */}
                        {/* ═══════════════════════════════════ */}
                        <motion.div
                            animate={{
                                opacity: hifi ? 0 : 1,
                                scale: hifi ? 1.04 : 1,
                                filter: hifi ? 'blur(6px)' : 'blur(0px)',
                            }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="absolute inset-0 pointer-events-none"
                        >
                            {/* Purple bounding box — draws in */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 370" preserveAspectRatio="none">
                                    <motion.rect
                                        x="1" y="1" width="338" height="368" rx="24"
                                        fill="none"
                                        stroke={BRAND}
                                        strokeWidth="1"
                                        strokeDasharray="1440"
                                        initial={{ strokeDashoffset: 1440 }}
                                        animate={{ strokeDashoffset: 0 }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                </svg>
                            </motion.div>

                            {/* Corner resize nodes — pulse in */}
                            {[
                                { pos: '-top-1 -left-1', delay: 0.3 },
                                { pos: '-top-1 -right-1', delay: 0.35 },
                                { pos: '-bottom-1 -right-1', delay: 0.4 },
                                { pos: '-bottom-1 -left-1', delay: 0.45 },
                            ].map(({ pos, delay }, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.2, delay, type: 'spring', stiffness: 500, damping: 20 }}
                                    className={`absolute ${pos} w-2 h-2 rounded-sm border-2 bg-[#09090B]`}
                                    style={{ borderColor: BRAND }}
                                />
                            ))}

                            {/* ── Measurement Line: Top — "Auto Layout" ── */}
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center"
                            >
                                <span
                                    className="text-[9px] font-mono font-semibold text-white px-2 py-[2px] rounded-[3px] tracking-wider"
                                    style={{ background: BRAND, boxShadow: `0 2px 12px ${BRAND_DIM}0.4)` }}
                                >
                                    Auto Layout
                                </span>
                                <motion.div
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ duration: 0.2, delay: 0.35 }}
                                    className="w-px h-3 origin-top"
                                    style={{ background: `${BRAND_DIM}0.5)` }}
                                />
                            </motion.div>

                            {/* ── Measurement Line: Right — "Spacing: 32" ── */}
                            <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                                className="absolute top-1/2 -translate-y-1/2 left-full ml-3 flex items-center"
                            >
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.2, delay: 0.45 }}
                                    className="w-4 h-px origin-left"
                                    style={{ background: `${BRAND_DIM}0.4)` }}
                                />
                                <span
                                    className="text-[9px] font-mono font-semibold text-white px-2 py-[2px] rounded-[3px] tracking-wider whitespace-nowrap ml-1"
                                    style={{ background: BRAND, boxShadow: `0 2px 12px ${BRAND_DIM}0.4)` }}
                                >
                                    Spacing: 32
                                </span>
                            </motion.div>

                            {/* ── Measurement Line: Left — "padding: 32" ── */}
                            <motion.div
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.25 }}
                                className="absolute top-8 right-full mr-3 flex items-center"
                            >
                                <span
                                    className="text-[9px] font-mono font-semibold text-white px-2 py-[2px] rounded-[3px] tracking-wider whitespace-nowrap mr-1"
                                    style={{ background: BRAND, boxShadow: `0 2px 12px ${BRAND_DIM}0.4)` }}
                                >
                                    p: 32
                                </span>
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.2, delay: 0.4 }}
                                    className="w-4 h-px origin-right"
                                    style={{ background: `${BRAND_DIM}0.4)` }}
                                />
                            </motion.div>

                            {/* ── Inner wireframe skeleton ── */}
                            <div className="absolute inset-0 p-8 flex flex-col items-center justify-center gap-5">
                                {/* Avatar placeholder — double ring */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.15 }}
                                    className="relative"
                                >
                                    <div className="w-20 h-20 rounded-full" style={{ border: `1px solid ${BRAND_DIM}0.25)` }}>
                                        <div className="absolute inset-[6px] rounded-full" style={{ border: `1px dashed ${BRAND_DIM}0.12)` }} />
                                    </div>
                                    {/* Tiny dimension label on avatar */}
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.6 }}
                                        transition={{ delay: 0.5 }}
                                        className="absolute -right-8 top-1/2 -translate-y-1/2 text-[8px] font-mono"
                                        style={{ color: `${BRAND_DIM}0.5)` }}
                                    >
                                        80×80
                                    </motion.span>
                                </motion.div>

                                {/* Text skeleton bars with shimmer */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-col items-center gap-3 w-full"
                                >
                                    <div className="relative overflow-hidden w-28 h-4 rounded" style={{ background: `${BRAND_DIM}0.08)` }}>
                                        <motion.div
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                            className="absolute inset-y-0 w-1/2"
                                            style={{ background: `linear-gradient(90deg, transparent, ${BRAND_DIM}0.08), transparent)` }}
                                        />
                                    </div>
                                    <div className="relative overflow-hidden w-40 h-2.5 rounded" style={{ background: `${BRAND_DIM}0.05)` }}>
                                        <motion.div
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.2 }}
                                            className="absolute inset-y-0 w-1/2"
                                            style={{ background: `linear-gradient(90deg, transparent, ${BRAND_DIM}0.06), transparent)` }}
                                        />
                                    </div>
                                </motion.div>

                                {/* Bottom bar wireframe */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="w-3/4 h-1 rounded-full origin-left mt-2"
                                    style={{ background: `${BRAND_DIM}0.1)` }}
                                />
                            </div>

                            {/* Frame name badge — bottom left */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.7 }}
                                transition={{ delay: 0.4 }}
                                className="absolute -bottom-7 left-0 flex items-center gap-1.5"
                            >
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ border: `1px solid ${BRAND_DIM}0.5)` }} />
                                <span className="text-[10px] font-mono" style={{ color: `${BRAND_DIM}0.5)` }}>ProfileCard</span>
                            </motion.div>
                        </motion.div>

                        {/* ═══════════════════════════════════ */}
                        {/* ═══ HIGH-FIDELITY LAYER ═══        */}
                        {/* ═══════════════════════════════════ */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{
                                opacity: hifi ? 1 : 0,
                                scale: hifi ? 1 : 0.94,
                            }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 rounded-3xl overflow-hidden"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                backdropFilter: 'blur(40px)',
                                WebkitBackdropFilter: 'blur(40px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 60px ${BRAND_DIM}0.08), inset 0 1px 0 rgba(255,255,255,0.06)`,
                            }}
                        >
                            {/* Inner gradient highlight */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

                            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-5 p-8">
                                {/* Avatar */}
                                <motion.div
                                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                                    animate={{ opacity: hifi ? 1 : 0, y: hifi ? 0 : 12, scale: hifi ? 1 : 0.9 }}
                                    transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative"
                                >
                                    <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/10 shadow-2xl">
                                        <img src="/images/avatar.png" alt="Abhinesh" className="w-full h-full object-cover" />
                                    </div>
                                    {/* Subtle avatar glow */}
                                    <div
                                        className="absolute -inset-2 rounded-full blur-xl opacity-20 pointer-events-none -z-10"
                                        style={{ background: BRAND }}
                                    />
                                </motion.div>

                                {/* Name + Title */}
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: hifi ? 1 : 0, y: hifi ? 0 : 8 }}
                                    transition={{ duration: 0.35, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-center"
                                >
                                    <h1 className="text-2xl font-bold text-white tracking-tight leading-none">Abhinesh</h1>
                                    <p className="text-[11px] text-white/35 font-medium tracking-[0.2em] uppercase mt-2.5">Product Designer</p>
                                </motion.div>

                                {/* Progress bar */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: hifi ? 1 : 0 }}
                                    transition={{ duration: 0.2, delay: 0.15 }}
                                    className="w-3/4 mt-2"
                                >
                                    <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: `${BRAND_DIM}0.12)` }}>
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: hifi ? 1 : 0 }}
                                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                                            className="h-full rounded-full origin-left"
                                            style={{ background: `linear-gradient(90deg, ${BRAND}, rgba(255,255,255,0.8))` }}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ── CURSOR ── */}
                    <AnimatePresence>
                        {!hifi && (
                            <motion.div
                                key="cursor"
                                initial={{ x: 260, y: 240, opacity: 0 }}
                                animate={{ x: 30, y: 55, opacity: 1 }}
                                exit={{
                                    scale: [1, 0.8, 1.05, 0],
                                    opacity: [1, 1, 0.8, 0],
                                    transition: { duration: 0.2, times: [0, 0.3, 0.6, 1] },
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 350,
                                    damping: 22,
                                    delay: 0.35,
                                    opacity: { duration: 0.12, delay: 0.3 },
                                }}
                                className="absolute z-50 pointer-events-none"
                            >
                                {/* Pointer */}
                                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="drop-shadow-lg">
                                    <path
                                        d="M1 1L14.5 9.5L8 10.5L5 18.5L1 1Z"
                                        fill={BRAND}
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth="0.5"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                {/* Name badge */}
                                <div
                                    className="absolute top-4 left-2.5 text-[10px] font-semibold text-white px-2.5 py-0.5 rounded-full whitespace-nowrap"
                                    style={{ background: BRAND, boxShadow: `0 2px 12px ${BRAND_DIM}0.5)` }}
                                >
                                    Abhinesh
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};
