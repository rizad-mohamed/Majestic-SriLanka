export const previewSiteUrl: string;
export function getSiteConfig(env?: Record<string, unknown>): {
  siteUrl: string;
  environment: string;
  indexable: boolean;
};
export function serializeJsonLd(value: unknown): string;
