import test from "node:test";
import assert from "node:assert/strict";
import { getSiteConfig, serializeJsonLd } from "../../src/lib/site-config.mjs";

test("preview defaults cannot accidentally enable indexing", () => {
  assert.equal(getSiteConfig().indexable, false);
  assert.throws(
    () => getSiteConfig({ PUBLIC_ALLOW_INDEXING: "true" }),
    /production/,
  );
  assert.throws(
    () => getSiteConfig({ PUBLIC_DEPLOYMENT_ENV: "staging" }),
    /preview or production/,
  );
});

test("production requires an explicit public HTTPS origin", () => {
  const production = {
    PUBLIC_DEPLOYMENT_ENV: "production",
    PUBLIC_ALLOW_INDEXING: "true",
  };
  assert.throws(() => getSiteConfig(production), /explicit/);
  for (const PUBLIC_SITE_URL of [
    "http://travel.com",
    "https://travel.com/path",
    "https://travel.com/?x=1",
    "https://travel.com/#x",
    "https://user:pass@travel.com",
    "https://localhost",
    "https://127.0.0.1",
    "https://[::1]",
    "https://example.com",
    "https://travel.test",
    "https://preview.chatgpt.site",
    "https://travel.com:8443",
    "https://com",
    "https://bad_host.com",
    "https://travel.com.",
    "not-a-url",
  ])
    assert.throws(
      () => getSiteConfig({ ...production, PUBLIC_SITE_URL }),
      PUBLIC_SITE_URL,
    );
  const config = getSiteConfig({
    ...production,
    PUBLIC_SITE_URL: "https://seo-fixture.majesticsrilanka.com",
  });
  assert.equal(config.siteUrl, "https://seo-fixture.majesticsrilanka.com/");
  assert.equal(config.indexable, true);
});

test("JSON-LD serialization cannot close a script element", () => {
  const value = { text: "</script><script>alert(1)</script>\u2028\u2029" };
  const json = serializeJsonLd(value);
  assert.ok(!json.includes("<"));
  assert.ok(!json.includes("\u2028"));
  assert.deepEqual(JSON.parse(json), value);
});
