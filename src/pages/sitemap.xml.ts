import type { APIRoute } from "astro";
export const GET: APIRoute = ({ site }) => {
  const pages = [
    "/",
    "/tours/",
    "/tailor-made/",
    "/experiences/",
    "/about-us/",
    "/plan-your-trip/",
    "/contact-us/",
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
