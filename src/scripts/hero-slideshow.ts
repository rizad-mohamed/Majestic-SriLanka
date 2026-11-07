import storyPlayerUrl from "./story-player.js?no-inline&url";
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
  const filmIndex = buttons.length - 1;
  const duration = 5500;
  let playing = !reduced.matches;
  let visible = true;
  let hovering = false;
  let suspended = false;
  let current = 0;
  let request = 0;
  let timer: number | undefined;
  let watchdog: number | undefined;
  let cleanup: number | undefined;
  let failedVideo = false;
  stage.querySelector("img")!.setAttribute("data-hero-current", "");
  video.muted = true;
  controls.hidden = false;

  function clearWatchdog() {
    clearTimeout(watchdog);
    watchdog = undefined;
  }
  function stopTimer() {
    clearTimeout(timer);
  }
  function videoFallback() {
    if (
      current !== filmIndex ||
      !playing ||
      failedVideo ||
      !visible ||
      document.hidden ||
      suspended
    )
      return;
    failedVideo = true;
    clearWatchdog();
    video.pause();
    status.textContent = "Film unavailable.";
    void select(0);
  }
  function watchVideo() {
    clearWatchdog();
    watchdog = window.setTimeout(videoFallback, 12000);
  }
  function synchronize() {
    stopTimer();
    toggle.textContent = playing ? "Pause hero playback" : "Play hero playback";
    if (
      !playing ||
      !visible ||
      suspended ||
      (hovering && current !== filmIndex) ||
      document.hidden
    ) {
      video.pause();
      clearWatchdog();
      return;
    }
    if (current === filmIndex) {
      if (failedVideo) return;
      if (video.ended) {
        void select(0);
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
      timer = window.setTimeout(() => {
        void select((current + 1) % buttons.length);
      }, duration);
    }
  }
  function pause() {
    playing = false;
    request++;
    stage
      .querySelectorAll("picture[aria-hidden]")
      .forEach((frame) => frame.remove());
    synchronize();
  }
  function updateControls() {
    buttons.forEach((button, index) =>
      button.setAttribute("aria-pressed", String(index === current)),
    );
  }
  function tidyFrames() {
    stage.querySelectorAll("picture:not([aria-hidden])").forEach((frame) => {
      if (!frame.querySelector("[data-hero-current]")) frame.remove();
    });
    if (current !== filmIndex) video.classList.remove("is-visible");
  }
  async function select(index: number, manual = false) {
    if (manual) {
      status.textContent = "";
      pause();
      if (index === filmIndex) {
        playing = true;
        failedVideo = false;
        if (video.ended) video.currentTime = 0;
      }
    }
    if (index === current) {
      synchronize();
      return;
    }
    stopTimer();
    const ticket = ++request;
    stage
      .querySelectorAll("picture[aria-hidden]")
      .forEach((frame) => frame.remove());
    const previous = stage.querySelector<HTMLElement>("[data-hero-current]");
    let image: HTMLImageElement | undefined;
    if (index !== filmIndex) {
      const template = hero!.querySelector<HTMLTemplateElement>(
        `[data-hero-template="${buttons[index].dataset.slide}"]`,
      )!;
      const frame = document.importNode(
        template.content.querySelector("picture")!,
        true,
      );
      image = frame.querySelector("img")!;
      image.loading = "eager";
      image.className = "hero-frame";
      frame.setAttribute("aria-hidden", "true");
      stage.append(frame);
      try {
        await image.decode();
      } catch {
        frame.remove();
        if (ticket === request) {
          pause();
          status.textContent = "Image unavailable.";
        }
        return;
      }
      if (ticket !== request) {
        frame.remove();
        return;
      }
      frame.removeAttribute("aria-hidden");
    }
    previous?.removeAttribute("data-hero-current");
    current = index;
    if (image) {
      image.setAttribute("data-hero-current", "");
      if (reduced.matches) image.classList.add("is-visible");
      else
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (image?.isConnected) image.classList.add("is-visible");
          }),
        );
      video.pause();
      clearWatchdog();
    } else {
      // Keep the outgoing photograph beneath the poster until the film fades in.
      stage.append(video);
      video.setAttribute("data-hero-current", "");
      video.currentTime = 0;
      video.classList.add("is-visible");
      failedVideo = false;
    }
    clearTimeout(cleanup);
    cleanup = window.setTimeout(tidyFrames, reduced.matches ? 0 : 700);
    updateControls();
    synchronize();
  }
  video.addEventListener("ended", () => {
    if (current === filmIndex && playing) void select(0);
  });
  video.addEventListener("error", videoFallback);
  video.addEventListener("waiting", watchVideo);
  video.addEventListener("playing", clearWatchdog);
  buttons.forEach((button, index) =>
    button.addEventListener("click", () => {
      void select(index, true);
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
      failedVideo = false;
      if (current === filmIndex && video.ended) video.currentTime = 0;
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
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      synchronize();
    },
    { threshold: 0.1 },
  );
  observer.observe(hero);
  window.addEventListener("pagehide", (event) => {
    suspended = true;
    synchronize();
    if (!event.persisted) {
      request++;
      clearTimeout(cleanup);
      observer.disconnect();
    }
  });
  window.addEventListener("pageshow", () => {
    suspended = false;
    synchronize();
  });

  hero
    .querySelector('[data-dialog="story-dialog"]')
    ?.addEventListener("click", () => {
      pause();
      void import(/* @vite-ignore */ storyPlayerUrl)
        .then(({ playStory }) => playStory())
        .catch(() => {
          document.querySelector<HTMLElement>("[data-film-error]")!.hidden =
            false;
        });
    });
  synchronize();
}
