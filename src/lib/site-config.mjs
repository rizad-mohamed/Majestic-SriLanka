export const previewSiteUrl =
  "https://majestic-sri-lanka-journeys.palecoati256.chatgpt.site/";

// Shared by Astro configuration, rendered SEO, and regression checks.
export function getSiteConfig(env = {}) {
  const environment = env.PUBLIC_DEPLOYMENT_ENV || "preview";
  if (!["preview", "production"].includes(environment))
    throw new Error("PUBLIC_DEPLOYMENT_ENV must be preview or production.");
  const requestedIndexing = env.PUBLIC_ALLOW_INDEXING === "true";
  if (requestedIndexing && environment !== "production")
    throw new Error("Indexing requires PUBLIC_DEPLOYMENT_ENV=production.");
  const raw = env.PUBLIC_SITE_URL || "";
  if (environment === "production" && !raw)
    throw new Error(
      "Production requires an explicit, verified PUBLIC_SITE_URL.",
    );
  let url;
  try {
    url = new URL(raw || previewSiteUrl);
  } catch {
    throw new Error("PUBLIC_SITE_URL must be a valid HTTPS origin.");
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error(
      "PUBLIC_SITE_URL must be an HTTPS origin without credentials, port, path, query or fragment.",
    );
  if (
    environment === "production" &&
    (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{1,62}$/i.test(
      url.hostname,
    ) ||
      url.hostname.endsWith(".chatgpt.site") ||
      url.hostname === "localhost" ||
      /^[\d.]+$/.test(url.hostname) ||
      url.hostname.includes(":") ||
      /(^|\.)(example\.(com|org|net)|invalid|test|example|localhost)$/.test(
        url.hostname,
      ))
  )
    throw new Error(
      "Production requires a verified public domain, not a preview or placeholder origin.",
    );
  return {
    siteUrl: url.href,
    environment,
    indexable: requestedIndexing && environment === "production",
  };
}

export function serializeJsonLd(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
