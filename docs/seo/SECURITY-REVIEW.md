# Security and privacy review

This is a bounded implementation review of source, dependencies and configuration, not a penetration test, ASVS certification or proof of every hosting control. No live attack, spam, customer enquiry or production infrastructure change was performed. The security skill supplies source-first trust-boundary guidance; this report follows the user's required docs/seo delivery location.

## Boundaries reviewed

- Browser input → brief text/download: existing textContent, percent-encoded URL bodies and Base64 MIME parts avoid HTML execution and mail-header injection. New regression tests cover literal markup and impossible dates. Input remains in memory, with no server submission, database or automatic delivery. Server-side rate limiting is not applicable to this static local builder; a future submission API requires server validation, abuse controls, retention and monitoring.
- Build environment → public metadata: HTTPS origin validation rejects paths, credentials, queries, fragments, ports, preview/placeholder production hosts and accidental preview indexing. This validates configuration structure, not domain ownership.
- JSON-LD → HTML: centralized escaping prevents script termination; generated graph values are controlled content.
- Analytics → third party: absent Measurement ID and denied-by-default consent prevent transport. A valid configured ID alone does not load Google. Consent must come from an approved consent manager; the module handles grant/revocation and strips query strings, referrers and form contents from explicit events. No generate_lead is emitted for a brief or click. Disable GA4 enhanced measurement/automatic form collection in the property before enablement. Production-fixture tests mock Google; no real analytics property is tested.
- Source/build → hosting: static headers retain MIME sniffing protection, frame denial, referrer and feature restrictions. CSP permits only the exact optional Google analytics transport hosts in addition to local assets; inline style allowance is retained for existing design. upgrade-insecure-requests is added. HSTS/TLS, CDN compression, header application and primary-host redirects require host verification. HSTS preload is not guessed before domain/subdomain ownership is established.
- CI → repository: read-only workflow permissions, immutable verified official action SHAs, no deployment secrets, no privileged pull_request_target workflow. Dependabot checks npm/actions weekly. No production deployment step is introduced.

## Dependency findings and repair

Initial full npm advisory audit reported 19 moderate findings and zero high/critical. They originated in development tooling's minimatch/glob dependency chains. `npm audit fix --force` suggested unrelated major downgrades and was not used. All installed minimatch consumers in this lockfile used the modern API; targeted overrides to minimatch 11.0.4 and glob 14.0.3 resolve the advisories while retaining direct tool versions. These are cross-major transitive overrides and therefore require lint/type/build, archive generation and Lighthouse regression validation. Keep them until upstream tools support patched versions, then remove only after a full audit and checks.

The updated lockfile audit and clean npm ci reported **0 vulnerabilities** on 2 November 2026. CI audits development and production dependencies at moderate severity. Registry data is time-sensitive; rerun before launch. A clean advisory report does not prove absence of vulnerabilities. Source patterns were reviewed without dumping .env files, ambient environment values or credential stores. Repository credentials used for authorized GitHub actions remain in process memory and are never saved or logged.

Reference: [minimatch advisory GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). Production artifacts contain static HTML/CSS/JS and public media; dependency tooling is not shipped as an application server.
