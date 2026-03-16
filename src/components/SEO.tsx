import { useEffect } from 'react';
import { portfolioData } from '../data';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
}

export const SEO = ({ title, description, keywords, image }: SEOProps) => {
    useEffect(() => {
        const defaultTitle = portfolioData.seo.title;
        const defaultDesc = portfolioData.seo.description;
        const defaultKeywords = portfolioData.seo.keywords;

        document.title = title ? `${title} | ${defaultTitle.split(' | ')[0]}` : defaultTitle;

        const updateMetaTag = (name: string, content: string, property = false) => {
            let element = document.querySelector(`meta[${property ? 'property' : 'name'}="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(property ? 'property' : 'name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        updateMetaTag('description', description || defaultDesc);
        updateMetaTag('keywords', keywords || defaultKeywords);

        // OpenGraph
        updateMetaTag('og:title', title || defaultTitle, true);
        updateMetaTag('og:description', description || defaultDesc, true);
        if (image) updateMetaTag('og:image', image, true);

    }, [title, description, keywords, image]);

    return null;
};
