// Transport stays disabled until a consent manager explicitly grants consent.
const measurementId = import.meta.env.PUBLIC_GA4_MEASUREMENT_ID || "";
const enabled = /^G-[A-Z0-9]+$/.test(measurementId);
let consent = false;
let started = false;
let formStarted = false;
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [key: `ga-disable-${string}`]: boolean;
};
const analyticsWindow = window as unknown as AnalyticsWindow;

function track(name: string, params: Record<string, string> = {}) {
  if (!consent || !enabled) return;
  analyticsWindow.gtag?.("event", name, {
    page_location: `${location.origin}${location.pathname}`,
    page_path: location.pathname,
    page_referrer: "",
    ...params,
  });
}

window.addEventListener("majestic:analytics-consent", (event) => {
  const granted = (event as CustomEvent).detail === true;
  if (granted === consent) return;
  consent = granted;
  if (!enabled) return;
  analyticsWindow[`ga-disable-${measurementId}`] = !consent;
  if (!consent) {
    analyticsWindow.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    return;
  }
  if (!started) {
    started = true;
    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    analyticsWindow.gtag = function () {
      // eslint-disable-next-line prefer-rest-params -- Google command queue expects an Arguments object.
      analyticsWindow.dataLayer!.push(arguments);
    };
    analyticsWindow.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    analyticsWindow.gtag("js", new Date());
    analyticsWindow.gtag("config", measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: `${location.origin}${location.pathname}`,
      page_referrer: "",
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
  }
  analyticsWindow.gtag?.("consent", "update", { analytics_storage: "granted" });
  track("page_view");
});

document.addEventListener("click", (event) => {
  const element = event.target instanceof Element ? event.target : null;
  const link = element?.closest<HTMLAnchorElement>("a[href]");
  if (link) {
    const url = new URL(link.href, location.origin);
    if (url.hostname === "wa.me") track("click_whatsapp");
    else if (url.protocol === "mailto:") track("click_email");
    else if (url.protocol === "tel:") track("click_phone");
    else if (
      url.origin === location.origin &&
      url.pathname === "/plan-your-trip/"
    )
      track("plan_trip_start");
  }
  const dialog = element?.closest<HTMLElement>("[data-dialog]")?.dataset.dialog;
  if (dialog?.startsWith("tour-"))
    track("tour_view", { journey_id: dialog.slice(5) });
});
document.querySelector("#trip-form")?.addEventListener("input", () => {
  if (consent && !formStarted) {
    formStarted = true;
    track("form_start");
  }
});
document.addEventListener("majestic:brief-created", () =>
  track("travel_brief_created"),
);
// generate_lead is absent: creating a local brief is not confirmed delivery.
