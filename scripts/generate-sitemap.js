import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
  projectId: '3jvc6i3y',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function generateSitemap() {
  console.log('Generating sitemap...');
  try {
    const projects = await client.fetch(`*[_type == "project"]{ slug, _updatedAt }`);
    
    // As per user requirement: priority 1.0 for homepage, 0.8 for projects
    const baseUrl = 'https://abhineshvivek.com';
    const staticRoutes = [
      { url: '/', priority: 1.0 }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static routes
    for (const route of staticRoutes) {
      xml += `
  <url>
    <loc>${baseUrl}${route.url}</loc>
    <priority>${route.priority}</priority>
  </url>`;
    }

    // Add dynamic projects
    for (const project of projects) {
      if (project.slug?.current) {
        xml += `
  <url>
    <loc>${baseUrl}/work/${project.slug.current}</loc>
    <lastmod>${project._updatedAt}</lastmod>
    <priority>0.8</priority>
  </url>`;
      }
    }

    xml += `
</urlset>`;

    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
    console.log('sitemap.xml generated successfully.');

    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
    console.log('robots.txt generated successfully.');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
