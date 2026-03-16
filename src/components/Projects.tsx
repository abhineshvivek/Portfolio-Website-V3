import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import { sanityClient, urlFor } from '../lib/sanity';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityProject = any;

const homepageProjectsQuery = `
  *[_type == "project" && isFeatured == true] | order(coalesce(priority, 99) asc, _createdAt desc)[0...2] {
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

const ProjectCard = ({ project }: { project: SanityProject }) => {
    const { setCursorVariant } = useCursor();
    const slug = project.slug?.current || project._id;
    const imageUrl = project.heroImage ? urlFor(project.heroImage).width(800).height(600).auto('format').url() : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="group flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24 items-center"
        >
            {/* Cinematic Image Container - Takes 55% width */}
            <div className="w-full md:w-[55%] relative group/image">
                <Link
                    to={`/work/${slug}`}
                    onMouseEnter={() => setCursorVariant('view')}
                    onMouseLeave={() => setCursorVariant('default')}
                    onClick={() => setCursorVariant('default')}
                    className="block relative overflow-hidden rounded-3xl aspect-4/3 bg-neutral-200 dark:bg-neutral-900 z-10 shadow-2xl"
                >
                    {imageUrl && (
                        <motion.img
                            src={imageUrl}
                            alt={`${project.title} cover`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/image:scale-105"
                        />
                    )}

                    {/* Hover Overlay Darken */}
                    <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-700 pointer-events-none" />

                    {/* Top Overlay Elements */}
                    <div className="absolute top-4 left-4 z-20">
                        {project.isFeatured && (
                            <div className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-white bg-white/10 border border-white/20 backdrop-blur-md uppercase shadow-lg">
                                Featured
                            </div>
                        )}
                    </div>

                    {/* Stats overlay top right */}
                    {project.bentoStats && (
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                            {[project.bentoStats.role, project.bentoStats.platform].filter(Boolean).map((tag: string) => (
                                <div
                                    key={tag}
                                    className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest text-[#B200FF] bg-white/90 dark:bg-black/80 backdrop-blur-md uppercase transform -translate-y-2 opacity-0 group-hover/image:translate-y-0 group-hover/image:opacity-100 transition-all duration-500 ease-out"
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    )}
                </Link>
            </div>

            {/* Typography & Content Layout - Takes 45% width */}
            <div className="w-full md:w-[45%] flex flex-col z-10">
                <div className="flex items-center gap-4 mb-6">
                    <span className="w-12 h-px bg-neutral-300 dark:bg-neutral-700" />
                    <span className="text-xs font-semibold tracking-[0.2em] text-[#B200FF] uppercase">
                        Case Study
                    </span>
                </div>

                <Link to={`/work/${slug}`} className="inline-block group/title">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light tracking-tighter mb-6 md:mb-8 text-neutral-900 dark:text-white group-hover/title:text-[#B200FF] transition-colors duration-500 leading-tight md:leading-none wrap-break-word">
                        {project.title}
                    </h3>
                </Link>

                <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-light max-w-lg mb-12">
                    {project.impactStatement || project.tagline || ''}
                </p>

                <Link
                    to={`/work/${slug}`}
                    className="inline-flex items-center gap-4 text-sm font-semibold tracking-wider text-neutral-900 dark:text-white group/link uppercase overflow-hidden w-fit"
                >
                    <span className="relative z-10">View Project</span>
                    <div className="relative w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center group-hover/link:bg-[#B200FF] group-hover/link:border-[#B200FF] transition-all duration-300">
                        <ArrowRight
                            size={14}
                            className="text-neutral-500 dark:text-neutral-400 group-hover/link:text-white group-hover/link:-rotate-45 transition-all duration-300"
                        />
                    </div>
                </Link>
            </div>
        </motion.div>
    );
};

export const Projects: React.FC = () => {
    const [projects, setProjects] = useState<SanityProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sanityClient
            .fetch(homepageProjectsQuery)
            .then((data) => {
                setProjects(data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch projects from Sanity:', err);
                setLoading(false);
            });

        // Cleanup: reset cursor when leaving the homepage
        return () => {
            // Cleanup handled by route Link onClick handlers
        };
    }, []);

    return (
        <section id="projects" className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-white dark:bg-dark-bg transition-colors duration-500">
            <div className="max-w-[1600px] mx-auto w-full">

                <div className="mb-32 md:flex items-end justify-between gap-12">
                    <div className="max-w-4xl">
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter mb-8 text-neutral-900 dark:text-white leading-none">
                            Selected <span className="text-[#B200FF] font-serif italic pr-4">Works.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-3xl">
                            Solving complex user challenges through deep research, strategic wireframing, and extreme technical precision.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="flex items-center gap-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#B200FF] animate-ping" />
                            <span className="text-sm text-neutral-400 tracking-widest font-medium uppercase font-sans">Locating Projects...</span>
                        </div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-32 text-neutral-400 text-sm tracking-widest uppercase font-medium">
                        No projects published yet. Sequence initiated.
                    </div>
                ) : (
                    <div className="flex flex-col gap-y-32 md:gap-y-48">
                        {projects.map((project: SanityProject) => (
                            <div key={project._id}>
                                <ProjectCard project={project} />
                            </div>
                        ))}
                    </div>
                )}

                {/* View All Projects Button (Awwwards Style) */}
                <div className="mt-24 md:mt-32 flex justify-center">
                    <Link
                        to="/projects"
                        className="group inline-flex items-center gap-4 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors duration-500"
                    >
                        <span className="text-sm md:text-base font-medium tracking-widest uppercase">
                            View All Projects
                        </span>
                        <div className="relative w-10 h-10 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center overflow-hidden">
                            {/* Hover background fill */}
                            <div className="absolute inset-0 bg-[#B200FF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />

                            <ArrowRight
                                size={16}
                                className="relative z-10 text-neutral-500 dark:text-neutral-400 group-hover:text-white group-hover:-rotate-45 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};
