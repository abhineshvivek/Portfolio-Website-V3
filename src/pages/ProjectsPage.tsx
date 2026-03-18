import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import { sanityClient, urlFor } from '../lib/sanity';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityProject = any;

const allProjectsQuery = `
  *[_type == "project"] | order(coalesce(priority, 99) asc, _createdAt desc) {
    _id,
    title,
    slug,
    tagline,
    impactStatement,
    heroImage,
    bentoStats,
    isFeatured
  }
`;

export const ProjectsPage: React.FC = () => {
    const { setCursorVariant } = useCursor();
    const [projects, setProjects] = useState<SanityProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        sanityClient
            .fetch(allProjectsQuery)
            .then((data) => {
                setProjects(data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch all projects:', err);
                setLoading(false);
            });

        // Cleanup: reset cursor when leaving the projects page
        return () => setCursorVariant('default');
    }, [setCursorVariant]);

    return (
        <main className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-500 pt-24 md:pt-48 pb-16 md:pb-32">
            <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-24">

                {/* Minimal Editorial Header */}
                <div className="mb-24 md:mb-32">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-12 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium tracking-wider uppercase">Back to Home</span>
                    </Link>

                    <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-tighter mb-6 md:mb-8 text-neutral-900 dark:text-white leading-none wrap-break-word">
                        All <span className="text-[#B200FF] font-serif italic pr-2 md:pr-4">Work.</span>
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 font-light max-w-2xl leading-relaxed">
                        A complete archive of selected case studies, experiments, and professional design deliverables.
                    </p>
                </div>

                <div className="w-full h-px bg-neutral-200 dark:bg-white/10 mb-24" />

                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-[#B200FF] animate-pulse" />
                            <div className="w-2 h-2 rounded-full bg-[#B200FF] animate-pulse delay-75" />
                            <div className="w-2 h-2 rounded-full bg-[#B200FF] animate-pulse delay-150" />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-8 lg:gap-x-12 gap-y-12 sm:gap-y-16 lg:gap-y-24">
                        {projects.map((project, index) => {
                            const slug = project.slug?.current || project._id;
                            const imageUrl = project.heroImage ? urlFor(project.heroImage).width(800).height(800).auto('format').url() : '';

                            return (
                                <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                                    className="group flex flex-col gap-6"
                                >
                                    <Link
                                        to={`/work/${slug}`}
                                        onMouseEnter={() => setCursorVariant('view')}
                                        onMouseLeave={() => setCursorVariant('default')}
                                        onClick={() => setCursorVariant('default')}
                                        className="block relative overflow-hidden rounded-3xl aspect-4/3 bg-neutral-100 dark:bg-neutral-900 shadow-xl"
                                    >
                                        {imageUrl && (
                                            <motion.img
                                                src={imageUrl}
                                                alt={project.heroImage?.alt || project.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700 pointer-events-none" />

                                        {/* Featured Badge */}
                                        {project.isFeatured && (
                                            <div className="absolute top-4 left-4 z-20">
                                                <div className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-white bg-white/10 border border-white/20 backdrop-blur-md uppercase shadow-lg">
                                                    Featured
                                                </div>
                                            </div>
                                        )}
                                    </Link>

                                    <div className="flex flex-col gap-3 px-2">
                                        <div className="flex items-center justify-between gap-4">
                                            <Link to={`/work/${slug}`} onClick={() => setCursorVariant('default')} className="flex-1">
                                                <h3 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-neutral-900 dark:text-white group-hover:text-[#B200FF] transition-colors duration-300 wrap-break-word leading-tight">
                                                    {project.title}
                                                </h3>
                                            </Link>
                                            <ArrowRight size={20} className="shrink-0 text-neutral-400 -rotate-45 opacity-0 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                                        </div>
                                        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light line-clamp-2 leading-relaxed max-w-[90%]">
                                            {project.impactStatement || project.tagline}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
};
