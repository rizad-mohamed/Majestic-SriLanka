const preferenceName = "majestic_consent";
const banner = document.querySelector<HTMLElement>("[data-cookie-banner]");
const settings = document.querySelector<HTMLDialogElement>("#cookie-dialog");
const analyticsChoice = document.querySelector<HTMLInputElement>(
  "[data-cookie-analytics]",
);
let allowed = false;

function clearAnalyticsCookies() {
  const domains = location.hostname.split(".");
  for (const entry of document.cookie.split(";")) {
    const name = entry.trim().split("=")[0];
    if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) continue;
    const expired = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = expired;
    for (let i = 0; i < domains.length - 1; i++) {
      document.cookie = `${expired}; Domain=${domains.slice(i).join(".")}`;
    }
  }
}

function apply(value: boolean) {
  allowed = value;
  if (analyticsChoice) analyticsChoice.checked = value;
  window.dispatchEvent(
    new CustomEvent("majestic:analytics-consent", { detail: value }),
  );
  if (!value) clearAnalyticsCookies();
}

function save(value: boolean) {
  apply(value);
  const record = encodeURIComponent(
    JSON.stringify({ version: 1, analytics: value }),
  );
  document.cookie = `${preferenceName}=${record}; Max-Age=15552000; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  const stored = document.cookie
    .split("; ")
    .some((item) => item === `${preferenceName}=${record}`);
  if (banner) banner.hidden = true;
  const status = document.querySelector<HTMLElement>("[data-cookie-status]");
  if (status)
    status.textContent = stored
      ? "Preferences saved."
      : "Preferences apply for this page. Your browser prevented saving them for future visits.";
  settings?.close();
}

let remembered = false;
try {
  const raw = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${preferenceName}=`));
  if (raw) {
    const value = JSON.parse(
      decodeURIComponent(raw.slice(preferenceName.length + 1)),
    );
    if (value.version === 1 && typeof value.analytics === "boolean") {
      apply(value.analytics);
      remembered = true;
    }
  }
} catch {
  /* Invalid preferences are treated as no consent. */
}
if (!remembered) apply(false);
if (banner) banner.hidden = remembered;
document
  .querySelectorAll<HTMLElement>("[data-cookie-choice]")
  .forEach((button) => {
    button.addEventListener("click", () =>
      save(button.dataset.cookieChoice === "accept"),
    );
  });
document
  .querySelector("[data-cookie-save]")
  ?.addEventListener("click", () => save(analyticsChoice?.checked === true));
settings?.addEventListener("close", () => {
  if (analyticsChoice) analyticsChoice.checked = allowed;
});
