import type { APIRoute } from "astro";
import { getSiteConfig } from '../lib/site-config.mjs';
export const GET: APIRoute = ({ site }) =>
  new Response(
    getSiteConfig(import.meta.env).indexable
      ? `User-agent: *\nAllow: /\nSitemap: ${new URL("/sitemap.xml", site)}\n`
      : "User-agent: *\nAllow: /\n# Preview HTML is noindex; crawling must remain possible to read that directive.\n",
    { headers: { "Content-Type": "text/plain" } },
  );
