import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { DynamicScrollDirector } from './DynamicScrollDirector';

const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
};
import { sanityClient, urlFor, projectBySlugQuery } from '../lib/sanity';
import { SEO } from './SEO';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityProject = any;

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

// Custom Portable Text Components
const portableTextComponents: PortableTextComponents = {
    types: {
        image: ({ value }) => {
            if (!value?.asset) return null;
            return (
                <motion.figure {...fadeInUp} className="my-16 md:my-24 w-full max-w-6xl">
                    <img
                        src={urlFor(value).width(1600).auto('format').url()}
                        alt={value.alt || ''}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                    />
                    {value.caption && (
                        <figcaption className="text-left text-sm text-neutral-500 mt-5 font-sans tracking-wide">
                            {value.caption}
                        </figcaption>
                    )}
                </motion.figure>
            );
        },
        designSystem: ({ value }) => (
            <motion.div {...fadeInUp} className="my-16 md:my-24 w-full max-w-5xl">
                <div className="p-8 md:p-12 lg:p-16 rounded-3xl md:rounded-4xl bg-neutral-50/80 dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 shadow-lg">
                    <h3 className="text-2xl font-light text-neutral-900 dark:text-white mb-10 tracking-tight">Design System</h3>

                    {/* Color Swatches */}
                    {value.colorSwatches && value.colorSwatches.length > 0 && (
                        <div className="mb-12">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#B200FF] mb-6 font-bold">Colors</p>
                            <div className="flex flex-wrap gap-6">
                                {value.colorSwatches.map((hex: string, i: number) => (
                                    <div key={i} className="flex flex-col items-center gap-4">
                                        <div
                                            className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-neutral-200/50 dark:border-white/10 shadow-md"
                                            style={{ backgroundColor: hex }}
                                        />
                                        <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">{hex}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Typography */}
                    {value.typography && value.typography.length > 0 && (
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#B200FF] mb-6 font-bold">Typography</p>
                            <div className="flex flex-wrap gap-4">
                                {value.typography.map((font: string, i: number) => (
                                    <div key={i} className="px-5 py-3 rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 shadow-sm">
                                        <span className="text-lg md:text-xl text-neutral-800 dark:text-neutral-200" style={{ fontFamily: font }}>{font}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        ),
        featureBlock: ({ value }) => (
            <motion.div
                {...fadeInUp}
                className={`my-20 md:my-28 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center ${value.imageLeft ? '' : 'md:[&>*:first-child]:order-2'}`}
            >
                {/* Image */}
                <div className="w-full">
                    {value.imageUrl ? (
                        <img
                            src={value.imageUrl}
                            alt={value.heading || ''}
                            className="w-full h-auto object-cover rounded-2xl md:rounded-3xl shadow-sm"
                            loading="lazy"
                        />
                    ) : value.image ? (
                        <img
                            src={urlFor(value.image).width(1200).auto('format').url()}
                            alt={value.heading || ''}
                            className="w-full h-auto object-cover rounded-2xl md:rounded-3xl shadow-sm"
                            loading="lazy"
                        />
                    ) : null}
                </div>

                {/* Text */}
                <div className="flex flex-col justify-center w-full max-w-xl">
                    {value.heading && (
                        <h3 className="text-3xl md:text-5xl font-light tracking-tight text-neutral-900 dark:text-white mb-6 leading-[1.1]">
                            {value.heading}
                        </h3>
                    )}
                    {value.description && (
                        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 leading-[1.8] font-light">
                            {value.description}
                        </p>
                    )}
                </div>
            </motion.div>
        ),
    },
    block: {
        h2: ({ children, value }) => {
            const text = value?.children?.map((c: any) => c.text).join('') || '';
            const id = generateSlug(text);
            return <h2 id={id} className="w-full max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter text-neutral-900 dark:text-white mt-14 mb-3 leading-tight wrap-break-word">{children}</h2>
        },
        h3: ({ children, value }) => {
            const text = value?.children?.map((c: any) => c.text).join('') || '';
            const id = generateSlug(text);
            return <h3 id={id} className="w-full max-w-4xl text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-neutral-900 dark:text-white mt-14 mb-3 leading-snug wrap-break-word">{children}</h3>
        },
        h4: ({ children }) => (
            <h4 className="w-full max-w-3xl text-2xl font-medium text-neutral-900 dark:text-white mt-14 mb-3">{children}</h4>
        ),
        normal: ({ children }) => (
            <p className="w-full max-w-3xl text-lg md:text-xl text-neutral-700 dark:text-neutral-300 leading-[1.8] font-light mb-5 wrap-break-word">{children}</p>
        ),
        blockquote: ({ children }) => (
            <div className="w-full max-w-4xl">
                <blockquote className="relative my-16 px-10 py-12 md:px-14 md:py-14 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#B200FF]" />
                    <p className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-white leading-[1.6] italic tracking-tight">
                        {children}
                    </p>
                </blockquote>
            </div>
        ),
    },
    list: {
        bullet: ({ children }) => (
            <ul className="w-full max-w-3xl mt-3 mb-8 flex flex-col space-y-3">
                {children}
            </ul>
        ),
        number: ({ children }) => (
            <ol className="w-full max-w-3xl mt-3 mb-8 flex flex-col space-y-3 [counter-reset:custom-counter]">
                {children}
            </ol>
        ),
    },
    listItem: {
        bullet: ({ children }) => (
            <li className="flex items-start gap-5 text-lg md:text-xl text-neutral-700 dark:text-neutral-300 leading-[1.8] font-light">
                <span className="mt-1.5 shrink-0 text-[#B200FF] bg-[#B200FF]/10 p-1 rounded-full">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </span>
                <span className="pt-0.5">{children}</span>
            </li>
        ),
        number: ({ children }) => (
            <li className="flex items-start gap-6 text-lg md:text-xl text-neutral-700 dark:text-neutral-300 leading-[1.8] font-light [counter-increment:custom-counter]">
                <span className="mt-1 shrink-0 w-8 h-8 rounded-full border border-neutral-300 dark:border-white/20 bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-sm font-bold text-neutral-900 dark:text-white shadow-sm before:content-[counter(custom-counter)]" />
                <span className="pt-0.5">{children}</span>
            </li>
        ),
    },
    marks: {
        strong: ({ children }) => <strong className="text-neutral-900 dark:text-white font-medium">{children}</strong>,
        em: ({ children }) => <em className="italic text-neutral-800 dark:text-neutral-200">{children}</em>,
        code: ({ children }) => (
            <code className="bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-neutral-200 px-2 py-1 rounded-lg text-[0.9em] font-mono mx-1 shadow-sm wrap-break-word whitespace-pre-wrap">{children}</code>
        ),
        link: ({ children, value }) => (
            <a
                href={value?.href}
                target="_blank"
                rel="noreferrer"
                className="text-neutral-900 dark:text-white underline decoration-[#B200FF]/40 hover:decoration-[#B200FF] hover:text-[#B200FF] transition-colors decoration-2 underline-offset-4 font-medium"
            >
                {children}
            </a>
        ),
    },
};

export const CaseStudy: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [project, setProject] = useState<SanityProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeId, setActiveId] = useState<string>('');
    const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

    useEffect(() => {
        if (!slug) return;

        sanityClient
            .fetch(projectBySlugQuery, { slug })
            .then((data) => {
                if (data) {
                    setProject(data);
                } else {
                    setError(true);
                }
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [slug]);

    const toc = useMemo(() => {
        if (!project?.body) return [];
        return project.body
            .filter((block: any) => block._type === 'block' && (block.style === 'h2' || block.style === 'h3'))
            .map((block: any) => {
                const text = block.children?.map((c: any) => c.text).join('') || '';
                return {
                    id: generateSlug(text),
                    text,
                    level: block.style,
                };
            });
    }, [project]);

    useEffect(() => {
        if (toc.length === 0) return;

        // Use IntersectionObserver specifically configured for scroll-spying
        const observer = new IntersectionObserver(
            (entries) => {
                // Find all intersecting entries
                const visibleEntries = entries.filter(entry => entry.isIntersecting);
                if (visibleEntries.length > 0) {
                    // Update active ID to the first visible heading
                    setActiveId(visibleEntries[0].target.id);
                }
            },
            { rootMargin: '-100px 0px -70% 0px', threshold: 0 }
        );

        toc.forEach((item: any) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        // Set smooth scroll behavior on html element
        document.documentElement.style.scrollBehavior = 'smooth';

        return () => {
            observer.disconnect();
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, [toc, project]); // Ensure this re-runs if DOM updates

    const scrollToId = (id: string) => {
        setIsMobileTocOpen(false);
        const el = document.getElementById(id);
        if (el) {
            const yOffset = -120; // Exact padding to account for fixed navbar/spacing
            const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveId(id);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-4"
                >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#B200FF] animate-ping" />
                    <span className="text-sm font-medium tracking-widest uppercase text-neutral-500 dark:text-white/50 font-sans">Locating case study...</span>
                </motion.div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-dark-bg gap-6">
                <SEO title="Project Not Found" />
                <h1 className="text-3xl font-light text-neutral-900 dark:text-white">Case study not found</h1>
                <Link to="/" className="text-[#B200FF] underline underline-offset-4 text-sm font-semibold uppercase tracking-wider hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Return Home
                </Link>
            </div>
        );
    }

    const heroUrl = project.heroImage
        ? urlFor(project.heroImage).width(1920).auto('format').url()
        : null;

    const stats = project.bentoStats || {};
    const topStats = [
        { label: 'Role', value: stats.role },
        { label: 'Timeline', value: stats.timeline },
        { label: 'Platform & Deliverables', value: stats.platform },
    ].filter((s) => s.value);

    return (
        <article className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-500 overflow-x-hidden">
            <SEO
                title={`${project.title} — Case Study`}
                description={project.tagline}
                image={heroUrl || undefined}
            />

            {/* Immersive Editorial Hero */}
            <div className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden">
                {heroUrl && (
                    <img
                        src={heroUrl}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 dark:from-dark-bg dark:via-dark-bg/80 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-16 md:pb-24 max-w-[1600px] mx-auto w-full">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 text-neutral-500 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white transition-colors mb-12 text-sm font-semibold tracking-widest uppercase w-fit"
                    >
                        <ArrowLeft size={16} />
                        Back to Works
                    </Link>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl sm:text-6xl md:text-[8rem] font-light tracking-tighter text-neutral-900 dark:text-white leading-[0.9] max-w-6xl wrap-break-word"
                    >
                        {project.title}
                    </motion.h1>
                    {project.tagline && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                            className="text-xl md:text-2xl lg:text-3xl text-neutral-600 dark:text-white/70 max-w-3xl mt-6 md:mt-10 leading-relaxed font-light"
                        >
                            {project.tagline}
                        </motion.p>
                    )}
                </div>
            </div>

            {/* Context Bento Box */}
            {(topStats.length > 0 || stats.coreImpact) && (
                <motion.div
                    {...fadeInUp}
                    className="px-6 md:px-12 lg:px-24 mt-12 md:mt-20 relative z-10 w-full"
                >
                    <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Top row: 3 equal columns for Role, Timeline, Platform */}
                        {topStats.map((stat: any, i: number) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-neutral-200/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl rounded-3xl p-8 md:p-10 flex flex-col justify-center"
                            >
                                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#B200FF] mb-4 font-bold">
                                    {stat.label}
                                </p>
                                <p className="text-xl md:text-2xl text-neutral-900 dark:text-white font-medium">
                                    {stat.value}
                                </p>
                            </motion.div>
                        ))}

                        {/* Bottom row: Full width column for Core Impact */}
                        {stats.coreImpact && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="md:col-span-3 bg-[#B200FF]/5 dark:bg-[#B200FF]/10 backdrop-blur-2xl border border-[#B200FF]/20 rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col justify-center"
                            >
                                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#B200FF] mb-6 font-bold">
                                    Core Impact
                                </p>
                                <p className="text-2xl md:text-3xl lg:text-4xl text-neutral-900 dark:text-white font-light leading-snug tracking-tight max-w-5xl">
                                    {stats.coreImpact}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Main Content Layout with Native Left-Aligned Grid */}
            <div className="relative max-w-[1700px] mx-auto w-full flex flex-col lg:flex-row mt-24 md:mt-40 gap-12 lg:gap-24 xl:gap-32 px-6 md:px-12 lg:px-16 xl:px-24">

                {/* Desktop Sticky Table of Contents Native Flex Sidebar */}
                {toc.length > 0 && (
                    <aside className="hidden lg:block w-[18rem] xl:w-88 2xl:w-104 shrink-0">
                        <div className="sticky top-32 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl border border-neutral-200/60 dark:border-white/5 shadow-xl rounded-3xl p-8 xl:p-10 transition-colors">
                            <h4 className="text-xs uppercase tracking-[0.2em] text-[#B200FF] mb-6 font-bold flex items-center gap-3">
                                <span className="w-8 h-px bg-[#B200FF] opacity-50"></span>
                                Contents
                            </h4>
                            <nav className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                                {toc.map((item: any) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToId(item.id)}
                                        className={`text-left transition-all duration-300 ease-out hover:-translate-y-0.5 ${item.level === 'h3' ? 'ml-4 text-sm opacity-80' : 'text-base font-medium'
                                            } ${activeId === item.id
                                                ? 'text-[#B200FF] font-bold tracking-wide'
                                                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                                            }`}
                                    >
                                        {item.text}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>
                )}

                {/* Body & Takeaways - Shared Left Flush Edge */}
                <div className="flex-1 w-full min-w-0 overflow-visible pb-32">
                    {project.body && (
                        <div className="w-full flex flex-col gap-2">
                            <PortableText value={project.body} components={portableTextComponents} />
                        </div>
                    )}

                    {/* Takeaways Block - Massive Editiorial Style */}
                    {project.takeaways && (
                        <motion.div
                            {...fadeInUp}
                            className="mt-28 md:mt-36 w-full max-w-6xl"
                        >
                            <div className="w-full relative overflow-hidden bg-neutral-50 dark:bg-[#B200FF]/5 border border-neutral-200 dark:border-[#B200FF]/20 p-10 md:p-14 lg:p-16 xl:p-20 rounded-4xl shadow-md">
                                <div className="max-w-4xl pt-16 md:pt-24 pb-32 opacity-[0.03] dark:opacity-20 text-neutral-900 dark:text-[#B200FF]">
                                    <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xs uppercase tracking-[0.3em] text-[#B200FF] mb-6 font-bold flex items-center gap-4">
                                    <span className="w-10 h-px bg-[#B200FF] opacity-50"></span>
                                    Key Takeaways
                                </h3>
                                <p className="text-xl md:text-2xl lg:text-3xl text-neutral-900 dark:text-white leading-[1.6] font-light whitespace-pre-line tracking-tight relative z-10">
                                    {project.takeaways}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Mobile Floating ToC Pill & Bottom Sheet */}
            {toc.length > 0 && (
                <div className="lg:hidden">
                    <AnimatePresence>
                        {isMobileTocOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => setIsMobileTocOpen(false)}
                                    className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm"
                                />
                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "100%" }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="fixed bottom-0 left-0 right-0 z-101 bg-white dark:bg-dark-surface border-t border-neutral-200 dark:border-white/10 rounded-t-4xl p-6 pb-12 max-h-[75vh] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_40px_rgba(0,0,0,0.5)]"
                                >
                                    <div className="flex justify-between items-center mb-6 shrink-0">
                                        <h4 className="text-xs uppercase tracking-[0.2em] text-[#B200FF] font-bold">Index</h4>
                                        <button onClick={() => setIsMobileTocOpen(false)} className="p-2 bg-neutral-100 dark:bg-white/5 rounded-full hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors">
                                            <X size={16} className="text-neutral-500 dark:text-neutral-400" />
                                        </button>
                                    </div>
                                    <nav className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4 touch-pan-y custom-scrollbar">
                                        {toc.map((item: any) => (
                                            <button
                                                key={item.id}
                                                onClick={() => scrollToId(item.id)}
                                                className={`text-left text-base transition-colors ${item.level === 'h3' ? 'ml-4 text-sm opacity-80' : 'font-medium'
                                                    } ${activeId === item.id
                                                        ? 'text-[#B200FF] font-bold'
                                                        : 'text-neutral-600 dark:text-neutral-400'
                                                    }`}
                                            >
                                                {item.text}
                                            </button>
                                        ))}
                                    </nav>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                </div>
            )}

            {/* Unified Reading Tools Container */}
            <div className="fixed bottom-6 inset-x-0 w-full px-6 flex justify-between items-end pointer-events-none z-[40] md:bottom-8 md:inset-x-auto md:w-auto md:px-0 md:right-8 md:items-center md:gap-3">
                {toc.length > 0 && (
                    <button
                        onClick={() => setIsMobileTocOpen(true)}
                        className="lg:hidden pointer-events-auto px-6 py-3.5 bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-full shadow-2xl flex items-center gap-2.5 text-sm font-semibold tracking-wide text-neutral-900 dark:text-white active:scale-95 transition-transform"
                    >
                        <Menu size={16} className="text-[#B200FF]" />
                        Index
                    </button>
                )}
                <div className="pointer-events-auto ml-auto md:ml-0">
                    <DynamicScrollDirector />
                </div>
            </div>
        </article>
    );
};
