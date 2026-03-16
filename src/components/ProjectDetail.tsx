import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ArrowRight } from 'lucide-react';
import { portfolioData } from '../data';
import { SEO } from './SEO';

export const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const project = portfolioData.projects.find(p => p.id === id);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
                <SEO title="Project Not Found" />
                <h1 className="text-2xl text-zinc-900 dark:text-white">Project not found</h1>
                <Link to="/" className="ml-4 text-brand underline font-medium">Return Home</Link>
            </div>
        );
    }

    const mockScreenshots = [
        "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=2000",
        "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&q=80&w=2000",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000"
    ];

    const displayImages = project.screenshots && project.screenshots.length > 0 ? project.screenshots : mockScreenshots;
    const otherProjects = portfolioData.projects.filter(p => p.id !== id);

    return (
        <article className="min-h-screen pt-32 pb-32 px-6 md:px-20 bg-white dark:bg-[#050505] transition-colors duration-300">
            <SEO
                title={`${project.title} - Case Study`}
                description={project.description}
                image={project.image}
            />

            <div className="max-w-6xl mx-auto w-full">
                <Link
                    to="/#projects"
                    className="inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-brand transition-colors mb-12"
                >
                    <ArrowLeft size={20} />
                    Return to Homepage
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="flex flex-wrap gap-3 mb-6">
                        {project.tags.map(tag => (
                            <span key={tag} className="px-4 py-1.5 rounded-full border border-brand/30 text-sm font-medium text-brand bg-brand/5">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 text-zinc-900 dark:text-white">
                        {project.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed mb-16">
                        {project.description}
                    </p>
                </motion.div>

                {/* Detailed Mockups / Screenshots Section */}
                <div className="w-full flex flex-col rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-black">
                    {displayImages.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
                            className="w-full relative leading-none cursor-zoom-in group"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={img}
                                alt={`${project.title} ${project.tags?.join(' ') || 'Project'} Showcase Screen ${i + 1}`}
                                loading={i < 2 ? undefined : "lazy"}
                                className="w-full h-auto object-cover block transition-opacity duration-300 group-hover:opacity-90"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Other Works Footer Row */}
                {otherProjects.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mt-32 pt-16 border-t border-zinc-200 dark:border-zinc-800"
                    >
                        <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-900 dark:text-white mb-12 text-center md:text-left">
                            More Selected Works
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {otherProjects.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                                    className="group h-full"
                                >
                                    <Link
                                        to={`/project/${p.id}`}
                                        className="block relative overflow-hidden rounded-2xl aspect-16/10 mb-6 shadow-lg dark:shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                                    >
                                        <img
                                            src={p.image}
                                            alt={p.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
                                    </Link>
                                    <div className="flex flex-col px-1">
                                        <h4 className="text-2xl font-medium text-zinc-900 dark:text-white flex items-center gap-3 group-hover:text-brand transition-colors">
                                            <Link to={`/project/${p.id}`}>{p.title}</Link>
                                            <ArrowRight size={20} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand" />
                                        </h4>
                                        <p className="text-zinc-500 dark:text-zinc-400 mt-3 line-clamp-2 text-base leading-relaxed">{p.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-12 cursor-zoom-out backdrop-blur-md"
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                            className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 p-3 rounded-full backdrop-blur-md transition-all z-50"
                        >
                            <X size={28} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-[90vw] max-h-[90vh] rounded-xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Prevent close when clicking the image itself
                        >
                            <img
                                src={selectedImage}
                                alt="Expanded View"
                                className="w-full h-full object-contain max-h-[90vh]"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </article>
    );
};
