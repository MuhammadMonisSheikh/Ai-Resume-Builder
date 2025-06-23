const fs = require('fs');
const path = require('path');

// Base URL of your website
const BASE_URL = 'https://ai-resume-pro.com';

// Paths to your pages (add more as you create them)
const routes = [
  '/',
  '/resume-for-freshers',
  '/resume-for-gulf-jobs',
  '/cover-letter-for-teachers',
  '/signup',
  '/signin',
];

// Function to generate the sitemap
function generateSitemap() {
  const urls = routes.map(route => {
    const lastmod = new Date().toISOString();
    const priority = route === '/' ? '1.0' : '0.8';
    return `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

  const sitemapPath = path.resolve(__dirname, '../../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('✅ Sitemap generated successfully!');
}

generateSitemap(); 