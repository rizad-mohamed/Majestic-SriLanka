const hero = document.querySelector<HTMLElement>("[data-hero-carousel]");
if (hero) {
  const controls = hero.querySelector<HTMLElement>("[data-hero-controls]")!;
  const toggle = hero.querySelector<HTMLButtonElement>(
    "[data-slideshow-toggle]",
  )!;
  const buttons = [...hero.querySelectorAll<HTMLButtonElement>("[data-slide]")];
  const stage = hero.querySelector<HTMLElement>("[data-hero-image]")!;
  const video = hero.querySelector<HTMLVideoElement>("[data-hero-video]")!;
  const status = hero.querySelector<HTMLElement>("[data-hero-status]")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  // The poster is the initial hero on every device. Only an explicit Play
  // action may attach the film source and start its download.
  let playing = false;
  let visible = true;
  let hovering = false;
  let current = 0;
  let request = 0;
  let failedVideo = false;
  let timer: number | undefined;
  let watchdog: number | undefined;
  video.muted = true;
  video.loop = false;
  controls.hidden = false;

  function clearWatchdog() {
    clearTimeout(watchdog);
    watchdog = undefined;
  }
  function videoFallback() {
    if (current !== 0 || !playing || failedVideo || !visible || document.hidden)
      return;
    failedVideo = true;
    clearWatchdog();
    video.pause();
    status.textContent =
      "The film is unavailable. Showing a landscape instead.";
    void select(1);
  }
  function watchVideo() {
    clearWatchdog();
    if (current === 0 && playing && visible && !document.hidden)
      watchdog = window.setTimeout(videoFallback, 12000);
  }
  function synchronize() {
    clearTimeout(timer);
    toggle.textContent = playing ? "Pause hero playback" : "Play hero playback";
    if (
      !playing ||
      !visible ||
      (hovering && current !== 0) ||
      document.hidden
    ) {
      video.pause();
      clearWatchdog();
      return;
    }
    if (current === 0) {
      if (failedVideo) return;
      if (video.ended) {
        void select(1);
        return;
      }
      if (!video.getAttribute("src")) {
        video.src = video.dataset.src!;
        video.load();
      }
      if (video.paused) {
        watchVideo();
        void video.play().catch(videoFallback);
      }
    } else {
      // After explicit playback, the film plays once; image playback never loops back to it.
      timer = window.setTimeout(() => {
        void select(current === buttons.length - 1 ? 1 : current + 1);
      }, 7000);
    }
  }
  function pause() {
    playing = false;
    request++;
    synchronize();
  }
  function updateControls() {
    buttons.forEach((button, index) =>
      button.setAttribute("aria-pressed", String(index === current)),
    );
  }
  async function select(index: number, manual = false) {
    if (manual) pause();
    if (index === current) return;
    const ticket = ++request;
    const previous = stage.querySelector<HTMLElement>("[data-hero-current]");
    if (index === 0) {
      previous?.removeAttribute("data-hero-current");
      video.setAttribute("data-hero-current", "");
      video.classList.remove("is-hidden");
      if (video.readyState) video.currentTime = 0;
      failedVideo = false;
      previous?.closest("picture")?.remove();
      current = 0;
      status.textContent = "Sri Lanka film.";
    } else {
      const template = hero!.querySelector<HTMLTemplateElement>(
        `[data-hero-template="${buttons[index].dataset.slide}"]`,
      )!;
      const frame = document.importNode(
        template.content.querySelector("picture")!,
        true,
      );
      const image = frame.querySelector("img")!;
      image.loading = "eager";
      image.className = "hero-frame";
      frame.setAttribute("aria-hidden", "true");
      stage.append(frame);
      try {
        await image.decode();
      } catch {
        frame.remove();
        pause();
        status.textContent =
          "This landscape could not load. Please choose another slide.";
        return;
      }
      if (ticket !== request) {
        frame.remove();
        return;
      }
      previous?.removeAttribute("data-hero-current");
      image.setAttribute("data-hero-current", "");
      frame.removeAttribute("aria-hidden");
      if (reduced.matches) image.classList.add("is-visible");
      else
        requestAnimationFrame(() =>
          requestAnimationFrame(() => image.classList.add("is-visible")),
        );
      video.pause();
      clearWatchdog();
      const oldFrame = previous?.closest("picture");
      window.setTimeout(
        () => {
          oldFrame?.remove();
          if (current !== 0) video.classList.add("is-hidden");
        },
        reduced.matches ? 0 : 850,
      );
      current = index;
      if (manual) status.textContent = image.alt;
    }
    updateControls();
    synchronize();
  }
  video.addEventListener("ended", () => {
    if (current === 0 && playing) void select(1);
  });
  video.addEventListener("error", videoFallback);
  video.addEventListener("waiting", watchVideo);
  video.addEventListener("playing", clearWatchdog);
  buttons.forEach((button, index) =>
    button.addEventListener("click", () => {
      void select(index, true).then(() => {
        if (index === 0) {
          playing = true;
          failedVideo = false;
          if (video.ended) video.currentTime = 0;
          synchronize();
        }
      });
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
  toggle.addEventListener("click", async () => {
    if (playing) pause();
    else {
      if (current !== 0) await select(0);
      if (video.ended) video.currentTime = 0;
      playing = true;
      failedVideo = false;
      synchronize();
    }
  });
  hero.addEventListener("focusin", (event) => {
    if (event.target !== toggle) pause();
  });
  hero.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      hovering = true;
      synchronize();
    }
  });
  hero.addEventListener("pointerleave", () => {
    hovering = false;
    synchronize();
  });
  document.addEventListener("visibilitychange", synchronize);
  reduced.addEventListener("change", () => {
    if (reduced.matches) pause();
  });
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      synchronize();
    },
    { threshold: 0.1 },
  ).observe(hero);

  // The existing optional full-size story player remains independent of the hero.
  const film = document.querySelector<HTMLVideoElement>("[data-island-film]");
  const dialog = document.getElementById("story-dialog");
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
  synchronize();
}
