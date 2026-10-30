import {
  validateBrief,
  formatBrief,
  createEmailLink,
} from "../lib/planner.mjs";

let lastDialogTrigger: HTMLElement | null = null;
document.querySelectorAll<HTMLElement>("[data-dialog]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const dialog = document.getElementById(trigger.dataset.dialog || "");
    if (!(dialog instanceof HTMLDialogElement)) return;
    lastDialogTrigger = trigger;
    dialog.showModal();
    document.body.classList.add("dialog-is-open");
    if (dialog.id === "search-dialog")
      dialog.querySelector<HTMLInputElement>("input")?.focus();
  });
});
document.querySelectorAll<HTMLDialogElement>("dialog").forEach((dialog) => {
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    }
  });
  dialog
    .querySelectorAll("[data-close]")
    .forEach((button) =>
      button.addEventListener("click", () => dialog.close()),
    );
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (!document.querySelector("dialog[open]"))
      document.body.classList.remove("dialog-is-open");
    lastDialogTrigger?.focus();
  });
});

const search = document.querySelector<HTMLInputElement>("#site-search");
search?.addEventListener("input", () => {
  const query = search.value.toLocaleLowerCase().trim();
  let count = 0;
  document.querySelectorAll<HTMLElement>("[data-search]").forEach((item) => {
    item.hidden = !item.dataset.search?.includes(query);
    if (!item.hidden) count++;
  });
  const status = document.getElementById("search-status");
  if (status)
    status.textContent = count
      ? `${count} ${count === 1 ? "result" : "results"}${query ? ` for “${search.value.trim()}”` : ""}`
      : "No matches. Try culture, tea, beaches or wildlife.";
});

const tourTrack = document.querySelector<HTMLElement>("[data-tour-track]");
document
  .querySelectorAll<HTMLElement>("[data-tour-direction]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      if (!tourTrack) return;
      if (button.dataset.tourDirection === "1" && tourTrack.firstElementChild)
        tourTrack.append(tourTrack.firstElementChild);
      else if (tourTrack.lastElementChild)
        tourTrack.prepend(tourTrack.lastElementChild);
      tourTrack.scrollTo({ left: 0, behavior: "instant" });
      const status = document.querySelector("[data-carousel-status]");
      if (status)
        status.textContent = `First journey: ${tourTrack.querySelector("h3")?.textContent}`;
    });
  });

document.querySelectorAll<HTMLButtonElement>("[data-slide]").forEach((button) =>
  button.addEventListener("click", () => {
    const photo = document.querySelector<HTMLImageElement>(
      "[data-hero-image] img",
    );
    if (!photo || !button.dataset.slide) return;
    const name = button.dataset.slide;
    const base = `/assets/majestic-sri-lanka/photography/${name}`;
    photo.srcset = `${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1600.webp 1600w`;
    photo.src = `${base}-1600.webp`;
    const alts: Record<string, string> = {
      "hero-sigiriya": "Sigiriya above a misty Sri Lankan jungle at sunrise",
      "hill-country": "Green tea terraces and distant Sri Lankan mountains",
      "southern-coast": "Palm-fringed Sri Lankan beach at sunset",
    };
    photo.alt = alts[name] || "Sri Lankan landscape";
    document
      .querySelectorAll("[data-slide]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
  }),
);

document
  .querySelectorAll<HTMLButtonElement>("[data-filter]")
  .forEach((button) =>
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      let count = 0;
      document
        .querySelectorAll<HTMLElement>("[data-category]")
        .forEach((card) => {
          card.hidden = filter !== "All" && card.dataset.category !== filter;
          if (!card.hidden) count++;
        });
      document
        .querySelectorAll("[data-filter]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      const status = document.querySelector("[data-filter-status]");
      if (status)
        status.textContent = `${count} ${count === 1 ? "journey" : "journeys"} to explore`;
    }),
  );

const form = document.querySelector<HTMLFormElement>("#trip-form");
if (form) {
  form
    .querySelector<HTMLButtonElement>("[data-brief-submit]")
    ?.removeAttribute("disabled");
  const dateInput = form.querySelector<HTMLInputElement>("[name=date]");
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  if (dateInput) dateInput.min = today;
  const journey = new URLSearchParams(location.search).get("journey");
  const journeySelect = form.querySelector<HTMLSelectElement>("[name=journey]");
  if (
    journeySelect &&
    journey &&
    Array.from(journeySelect.options).some((option) => option.value === journey)
  )
    journeySelect.value = journey;
  form.noValidate = true;
  form.addEventListener("input", (event) => {
    const input = event.target;
    if (!(
      input instanceof HTMLInputElement ||
      input instanceof HTMLTextAreaElement ||
      input instanceof HTMLSelectElement
    ))
      return;
    input.removeAttribute("aria-invalid");
    const field = input.closest(".field");
    field?.removeAttribute("data-invalid");
    const error = document.getElementById(`${input.name}-error`);
    if (error) error.textContent = "";
    const summary = document.querySelector<HTMLElement>("#brief-summary");
    if (summary) summary.hidden = true;
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const get = (name: string) => String(data.get(name) || "");
    const values = {
      name: get("name"),
      email: get("email"),
      date: get("date"),
      travellers: get("travellers"),
      duration: get("duration"),
      journey: journeySelect?.selectedOptions[0]?.textContent || "",
      interests: data.getAll("interests").map(String),
      notes: get("notes"),
      consent: data.has("consent"),
    };
    const errors = validateBrief(values, today);
    form
      .querySelectorAll("[aria-invalid]")
      .forEach((input) => input.removeAttribute("aria-invalid"));
    form
      .querySelectorAll("[data-invalid]")
      .forEach((field) => field.removeAttribute("data-invalid"));
    form.querySelectorAll(".field-error").forEach((error) => {
      error.textContent = "";
    });
    for (const [name, message] of Object.entries(errors)) {
      const input = form.elements.namedItem(name);
      if (input instanceof HTMLElement) {
        input.setAttribute("aria-invalid", "true");
        input.closest(".field")?.setAttribute("data-invalid", "");
      }
      const error = document.getElementById(`${name}-error`);
      if (error) error.textContent = message;
    }
    const status = document.getElementById("form-status");
    if (Object.keys(errors).length) {
      if (status) status.textContent = "Please check the highlighted fields.";
      const input = form.elements.namedItem(Object.keys(errors)[0]);
      if (input instanceof HTMLElement) input.focus();
      return;
    }
    const brief = formatBrief(values);
    const summary = document.querySelector<HTMLElement>("#brief-summary");
    const summaryText = document.getElementById("brief-text");
    if (summary) summary.hidden = false;
    if (summaryText) summaryText.textContent = brief;
    if (status)
      status.textContent =
        "Your brief is ready to review. It has not been sent.";
    const download =
      document.querySelector<HTMLButtonElement>("#download-brief");
    if (download)
      download.onclick = () => {
        const url = URL.createObjectURL(
          new Blob([brief], { type: "text/plain;charset=utf-8" }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = "my-majestic-sri-lanka-travel-brief.txt";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };
    const email = document.querySelector<HTMLAnchorElement>("#email-brief");
    const emailHref = createEmailLink(form.dataset.email || "", brief);
    if (email && emailHref) {
      email.href = emailHref;
      email.hidden = false;
    }
    const whatsapp =
      document.querySelector<HTMLAnchorElement>("#whatsapp-brief");
    if (whatsapp && form.dataset.whatsapp) {
      whatsapp.href = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(brief)}`;
      whatsapp.hidden = false;
    }
    summary?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "center",
    });
    summary?.focus({ preventScroll: true });
  });
}
