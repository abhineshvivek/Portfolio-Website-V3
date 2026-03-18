import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: '3jvc6i3y',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

const builder = imageUrlBuilder(sanityClient);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

// GROQ Queries
export const allProjectsQuery = `
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    tagline,
    impactStatement,
    "heroImageUrl": heroImage.asset->url,
    heroImage {
      ...,
      alt
    },
    seo,
    bentoStats
  }
`;

export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    tagline,
    impactStatement,
    heroImage {
        ...,
        alt
    },
    seo,
    bentoStats,
    body[] {
      ...,
      _type == "image" => {
        ...,
        "url": asset->url,
        "dimensions": asset->metadata.dimensions,
        alt
      },
      _type == "featureBlock" => {
        ...,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      }
    },
    takeaways
  }
`;
