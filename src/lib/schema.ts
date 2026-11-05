import { brand } from "../data/content";
import type { PageSeo } from "../data/seo";
import manifest from "../../public/assets/majestic-sri-lanka/manifest.json";
import homepage from "../../public/assets/majestic-sri-lanka/homepage/manifest.json";

export function socialImage(name: string, siteUrl: string, scope?: "homepage") {
  const asset = manifest.assets.find(
    (asset) => asset.name === name && "variants" in asset,
  );
  const variants =
    scope === "homepage"
      ? homepage.assets.find((item) => item.name === name)?.variants
      : asset && "variants" in asset
        ? asset.variants
        : [];
  const image = variants?.at(-1);
  if (!image) throw new Error(`Missing social image: ${name}`);
  return {
    url: new URL(`/assets/majestic-sri-lanka/${image.file}`, siteUrl).href,
    width: image.width,
    height: image.height,
  };
}

export function pageSchema(
  path: string,
  page: PageSeo,
  siteUrl: string,
  title: string,
) {
  const canonical = new URL(path, siteUrl).href;
  const organization = `${siteUrl}#organization`;
  const website = `${siteUrl}#website`;
  const image = socialImage(
    page.image,
    siteUrl,
    path === "/" ? "homepage" : undefined,
  );
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organization,
        name: brand.name,
        url: siteUrl,
        logo: new URL("/assets/majestic-sri-lanka/branding/logo.webp", siteUrl)
          .href,
        ...(brand.email ? { email: brand.email } : {}),
        ...(brand.whatsapp
          ? {
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Travel enquiries",
                url: `https://wa.me/${brand.whatsapp}`,
              },
            }
          : {}),
      },
      {
        "@type": "WebSite",
        "@id": website,
        name: brand.name,
        url: siteUrl,
        inLanguage: "en",
        publisher: { "@id": organization },
      },
      {
        "@type": "ImageObject",
        "@id": `${canonical}#primaryimage`,
        contentUrl: image.url,
        width: image.width,
        height: image.height,
        caption: page.imageAlt,
      },
      {
        "@type": page.type,
        "@id": `${canonical}#webpage`,
        name: title,
        description: page.description,
        url: canonical,
        inLanguage: "en",
        isPartOf: { "@id": website },
        publisher: { "@id": organization },
        primaryImageOfPage: { "@id": `${canonical}#primaryimage` },
        ...(path === "/"
          ? {}
          : { breadcrumb: { "@id": `${canonical}#breadcrumb` } }),
        ...(path === "/about-us/" || path === "/contact-us/"
          ? { about: { "@id": organization } }
          : {}),
      },
      ...(path === "/"
        ? []
        : [
            {
              "@type": "BreadcrumbList",
              "@id": `${canonical}#breadcrumb`,
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: page.label,
                  item: canonical,
                },
              ],
            },
          ]),
    ],
  };
}
