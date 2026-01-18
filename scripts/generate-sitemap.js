const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const admin = require("firebase-admin");

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

const baseUrl = process.env.SITEMAP_BASE_URL || "https://urbanfit.com";

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/shop", priority: "0.9", changefreq: "daily" },
  { path: "/category", priority: "0.8", changefreq: "weekly" },
  { path: "/category/tops", priority: "0.8", changefreq: "weekly" },
  { path: "/category/bottoms", priority: "0.8", changefreq: "weekly" },
  { path: "/category/hoodies-sweats", priority: "0.8", changefreq: "weekly" },
  { path: "/category/jackets", priority: "0.8", changefreq: "weekly" },
  { path: "/category/sets", priority: "0.8", changefreq: "weekly" },
  { path: "/men", priority: "0.9", changefreq: "daily" },
  { path: "/women", priority: "0.9", changefreq: "daily" },
  { path: "/wish-list", priority: "0.6", changefreq: "monthly" },
  { path: "/seasonal", priority: "0.8", changefreq: "weekly" },
  { path: "/essential", priority: "0.8", changefreq: "weekly" },
  { path: "/faqs", priority: "0.7", changefreq: "monthly" },
  { path: "/about-us", priority: "0.7", changefreq: "monthly" },
  { path: "/privacy", priority: "0.5", changefreq: "yearly" },
  { path: "/contact-us", priority: "0.7", changefreq: "monthly" },
  { path: "/terms-conditions", priority: "0.5", changefreq: "yearly" },
];

const fetchAllProducts = async () => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    const db = admin.firestore();

    console.log("Fetching products from Firebase...");
    const snapshot = await db.collection("products").get();

    const products = [];
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(`Fetched ${products.length} products`);

    await admin.app().delete();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }
};

const generateSitemap = async () => {
  console.log("Starting sitemap generation...");

  const products = await fetchAllProducts();

  const productRoutes = products.map((product) => ({
    path: `/product/${product.id}`,
    priority: "0.9",
    changefreq: "daily",
    lastmod: product.dateUpdated
      ? new Date(product.dateUpdated).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  }));

  const allRoutes = [...staticRoutes, ...productRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>${route.lastmod ? `\n    <lastmod>${route.lastmod}</lastmod>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>`;

  const distPath = path.join(__dirname, "..", "dist");

  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  const outputPath = path.join(distPath, "sitemap.xml");

  fs.writeFileSync(outputPath, sitemap);
  console.log("Sitemap generated at:", outputPath);
  console.log(
    `Total URLs: ${allRoutes.length} (static: ${staticRoutes.length}, products: ${productRoutes.length})`,
  );
};

generateSitemap();
