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
        const baseTitle = 'Abhinesh - UI/UX Designer Chennai';
        const defaultTitle = 'Abhinesh | Product Designer & UX Designer based in Chennai';
        const defaultDesc = portfolioData.seo.description || 'Versatile UI/UX and Graphic Designer in Chennai specializing in solving complex user challenges through research, wireframing, and technical implementation.';
        const defaultKeywords = portfolioData.seo.keywords || 'UI/UX Designer Chennai, Product Designer Chennai, Graphic Designer Chennai, Communication Designer, Abhinesh V';

        const finalTitle = title ? `${title} | ${baseTitle}` : defaultTitle;
        document.title = finalTitle;

        const updateMetaTag = (name: string, content: string, property = false) => {
            let element = document.querySelector(`meta[${property ? 'property' : 'name'}="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(property ? 'property' : 'name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        const finalDesc = description || defaultDesc;
        const finalImage = image || 'https://abhineshvivek.com/images/Frame 1.webp';

        updateMetaTag('description', finalDesc);
        updateMetaTag('keywords', keywords || defaultKeywords);

        // OpenGraph
        updateMetaTag('og:title', finalTitle, true);
        updateMetaTag('og:description', finalDesc, true);
        updateMetaTag('og:image', finalImage, true);
        updateMetaTag('og:type', 'website', true);
        updateMetaTag('og:locale', 'en_IN', true);
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', finalTitle);
        updateMetaTag('twitter:description', finalDesc);
        updateMetaTag('twitter:image', finalImage);

    }, [title, description, keywords, image]);

    return null;
};
