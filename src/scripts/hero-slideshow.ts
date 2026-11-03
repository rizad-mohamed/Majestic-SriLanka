const hero = document.querySelector<HTMLElement>("[data-hero-carousel]");
if (hero) {
  const controls = hero.querySelector<HTMLElement>("[data-hero-controls]")!;
  const toggle = hero.querySelector<HTMLButtonElement>(
    "[data-slideshow-toggle]",
  )!;
  const buttons = [...hero.querySelectorAll<HTMLButtonElement>("[data-slide]")];
  const stage = hero.querySelector<HTMLElement>("[data-hero-image]")!;
  const status = hero.querySelector<HTMLElement>("[data-hero-status]")!;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  let playing = !reduced.matches && !connection?.saveData;
  let visible = true;
  let hovering = false;
  let current = 0;
  let request = 0;
  let timer: number | undefined;
  stage.querySelector("img")?.setAttribute("data-hero-current", "");
  controls.hidden = false;
  const schedule = () => {
    window.clearTimeout(timer);
    toggle.textContent = playing ? "Pause slideshow" : "Play slideshow";
    if (playing && visible && !hovering && !document.hidden)
      timer = window.setTimeout(() => {
        void select((current + 1) % buttons.length);
      }, 7000);
  };
  const pause = () => {
    playing = false;
    request++;
    schedule();
  };
  const select = async (index: number, manual = false) => {
    if (manual) {
      pause();
      request++;
    }
    if (index === current) return;
    const template = hero.querySelector<HTMLTemplateElement>(
      `[data-hero-template="${buttons[index].dataset.slide}"]`,
    )!;
    // Adopt into the live document so responsive sources can load before decode.
    // A clone alone retains the template's inert owner document.
    const frame = document.importNode(
      template.content.querySelector("picture")!,
      true,
    );
    const image = frame.querySelector("img")!;
    const ticket = ++request;
    image.loading = "eager";
    image.className = "hero-frame";
    frame.setAttribute("aria-hidden", "true");
    // Attach the invisible frame so native picture media selection precedes decode.
    stage.append(frame);
    try {
      await image.decode();
    } catch {
      frame.remove();
      schedule();
      return;
    }
    if (ticket !== request) {
      frame.remove();
      return;
    }
    const previous = stage.querySelector<HTMLImageElement>(
      "[data-hero-current]",
    );
    previous?.removeAttribute("data-hero-current");
    image.setAttribute("data-hero-current", "");
    frame.removeAttribute("aria-hidden");
    if (reduced.matches) image.classList.add("is-visible");
    else
      requestAnimationFrame(() =>
        requestAnimationFrame(() => image.classList.add("is-visible")),
      );
    const previousFrame = previous?.closest("picture") || previous;
    if (previousFrame)
      window.setTimeout(
        () => previousFrame.remove(),
        reduced.matches ? 0 : 850,
      );
    current = index;
    buttons.forEach((button, i) =>
      button.setAttribute("aria-pressed", String(i === current)),
    );
    if (manual) status.textContent = image.alt;
    schedule();
  };
  buttons.forEach((button, i) =>
    button.addEventListener("click", () => {
      void select(i, true);
    }),
  );
  controls.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next =
      (current + (event.key === "ArrowRight" ? 1 : buttons.length - 1)) %
      buttons.length;
    buttons[next].focus();
    void select(next, true);
  });
  toggle.addEventListener("click", () => {
    if (playing) pause();
    else {
      playing = true;
      schedule();
    }
  });
  hero.addEventListener("focusin", (event) => {
    if (event.target !== toggle) pause();
  });
  hero.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      hovering = true;
      schedule();
    }
  });
  hero.addEventListener("pointerleave", () => {
    hovering = false;
    schedule();
  });
  document.addEventListener("visibilitychange", schedule);
  reduced.addEventListener("change", () => {
    if (reduced.matches) pause();
  });
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      schedule();
    },
    { threshold: 0.1 },
  );
  observer.observe(hero);
  const film = document.querySelector<HTMLVideoElement>("[data-island-film]");
  const dialog = document.getElementById(
    "story-dialog",
  ) as HTMLDialogElement | null;
  hero
    .querySelector('[data-dialog="story-dialog"]')
    ?.addEventListener("click", () => {
      pause();
      if (!film) return;
      if (!film.getAttribute("src")) {
        film.src = film.dataset.src!;
        film.poster = film.dataset.poster!;
        film.load();
      }
      void film.play().catch(() => {
        /* Native controls remain available. */
      });
    });
  dialog?.addEventListener("close", () => film?.pause());
  film?.addEventListener("error", () => {
    const message = dialog?.querySelector<HTMLElement>("[data-film-error]");
    if (message) message.hidden = false;
  });
  schedule();
}
