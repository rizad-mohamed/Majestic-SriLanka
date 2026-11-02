import type { APIRoute } from "astro";
import { getSiteConfig } from '../lib/site-config.mjs';
import { pageSeo } from '../data/seo';
export const GET: APIRoute = ({ site }) => {
  const pages = getSiteConfig(import.meta.env).indexable ? Object.keys(pageSeo) : [];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
