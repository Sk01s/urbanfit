const fs = require('fs');
const path = require('path');

const baseUrl = 'https://urbanfit.com';

const routes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/shop', priority: '0.9', changefreq: 'daily' },
  { path: '/category', priority: '0.8', changefreq: 'weekly' },
  { path: '/category/tops', priority: '0.8', changefreq: 'weekly' },
  { path: '/category/bottoms', priority: '0.8', changefreq: 'weekly' },
  { path: '/category/hoodies-sweats', priority: '0.8', changefreq: 'weekly' },
  { path: '/category/jackets', priority: '0.8', changefreq: 'weekly' },
  { path: '/category/sets', priority: '0.8', changefreq: 'weekly' },
  { path: '/men', priority: '0.9', changefreq: 'daily' },
  { path: '/women', priority: '0.9', changefreq: 'daily' },
  { path: '/wish-list', priority: '0.6', changefreq: 'monthly' },
  { path: '/seasonal', priority: '0.8', changefreq: 'weekly' },
  { path: '/essential', priority: '0.8', changefreq: 'weekly' },
  { path: '/faqs', priority: '0.7', changefreq: 'monthly' },
  { path: '/about-us', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
  { path: '/contact-us', priority: '0.7', changefreq: 'monthly' },
  { path: '/terms-conditions', priority: '0.5', changefreq: 'yearly' },
];

const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const distPath = path.join(__dirname, '..', 'dist');
  
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }
  
  const outputPath = path.join(distPath, 'sitemap.xml');
  
  fs.writeFileSync(outputPath, sitemap);
  console.log('Sitemap generated at:', outputPath);
};

generateSitemap();
