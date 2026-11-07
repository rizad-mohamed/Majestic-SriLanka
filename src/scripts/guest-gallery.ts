document
  .querySelectorAll<HTMLElement>("[data-guest-gallery]")
  .forEach((gallery) => {
    const viewport = gallery.querySelector<HTMLElement>(
      ".guest-gallery-window",
    )!;
    const track = gallery.querySelector<HTMLElement>(".guest-gallery-track")!;
    const group = gallery.querySelector<HTMLElement>(".guest-gallery-group")!;
    const button = gallery.querySelector<HTMLButtonElement>(".gallery-pause")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const events = new AbortController();
    const { signal } = events;
    const copy = group.cloneNode(true) as HTMLElement;
    copy.setAttribute("aria-hidden", "true");
    copy.querySelectorAll("img").forEach((image) => {
      image.alt = "";
    });
    track.append(copy);
    const speed = 0.035; // Pixels per millisecond, matching the approved pace.
    let animation: Animation | undefined;
    let width = 0;
    let position = 0;
    let paused = false;
    let hovered = false;
    let focused = false;
    let touching = false;
    let visible = false;
    let suspended = false;
    let ready = false;
    let priming = false;
    let settling: number | undefined;

    function stopMotion() {
      if (!animation) return;
      position = (Number(animation.currentTime || 0) * speed) % width;
      animation.cancel();
      animation = undefined;
      track.removeAttribute("data-animated");
      // Bake the compositor position into native scrolling in the same paint.
      viewport.scrollLeft = position;
    }
    function synchronize() {
      copy.hidden = reduced.matches;
      button.hidden = reduced.matches;
      const running =
        width > 0 &&
        ready &&
        visible &&
        !document.hidden &&
        !suspended &&
        !reduced.matches &&
        !paused &&
        !hovered &&
        !focused &&
        !touching &&
        settling === undefined;
      if (!running) {
        stopMotion();
        return;
      }
      if (animation) return;
      position = viewport.scrollLeft % width;
      track.setAttribute("data-animated", "");
      animation = track.animate(
        [
          { transform: "translate3d(0,0,0)" },
          { transform: `translate3d(${-width}px,0,0)` },
        ],
        { duration: width / speed, iterations: Infinity, easing: "linear" },
      );
      animation.currentTime = position / speed;
      viewport.scrollLeft = 0;
    }
    function settle() {
      clearTimeout(settling);
      settling = window.setTimeout(() => {
        settling = undefined;
        synchronize();
      }, 180);
    }
    async function prime() {
      if (ready || priming) return;
      priming = true;
      // Decode only the first visible strip, once it approaches the viewport.
      const images = [...group.querySelectorAll("img")].slice(
        0,
        Math.ceil(viewport.clientWidth / 250) + 2,
      );
      images.forEach((image) => {
        image.loading = "eager";
      });
      await Promise.allSettled(images.map((image) => image.decode()));
      ready = true;
      if (!signal.aborted) synchronize();
    }
    button.addEventListener(
      "click",
      () => {
        paused = !paused;
        button.setAttribute("aria-pressed", String(paused));
        button.textContent = paused ? "Play gallery" : "Pause gallery";
        synchronize();
      },
      { signal },
    );
    viewport.addEventListener(
      "pointerenter",
      (event) => {
        if (event.pointerType === "mouse") {
          hovered = true;
          synchronize();
        }
      },
      { signal },
    );
    viewport.addEventListener(
      "pointerleave",
      () => {
        hovered = false;
        synchronize();
      },
      { signal },
    );
    viewport.addEventListener(
      "focusin",
      () => {
        focused = true;
        synchronize();
      },
      { signal },
    );
    viewport.addEventListener(
      "focusout",
      () => {
        focused = false;
        synchronize();
      },
      { signal },
    );
    viewport.addEventListener(
      "pointerdown",
      (event) => {
        if (event.pointerType !== "mouse") {
          touching = true;
          synchronize();
        }
      },
      { passive: true, signal },
    );
    window.addEventListener(
      "pointerup",
      () => {
        if (touching) {
          touching = false;
          settle();
        }
      },
      { passive: true, signal },
    );
    viewport.addEventListener(
      "pointercancel",
      () => {
        touching = false;
        settle();
      },
      { passive: true, signal },
    );
    viewport.addEventListener(
      "scroll",
      () => {
        if (animation) return;
        position = viewport.scrollLeft;
        if (!focused && !hovered && !paused && !reduced.matches) settle();
      },
      { passive: true, signal },
    );
    document.addEventListener("visibilitychange", synchronize, { signal });
    reduced.addEventListener("change", synchronize, { signal });
    const resize = new ResizeObserver(([entry]) => {
      stopMotion();
      const next =
        entry.borderBoxSize?.[0]?.inlineSize ||
        group.getBoundingClientRect().width;
      if (width) position = (position / width) * next;
      width = next;
      viewport.scrollLeft = position % width;
      synchronize();
    });
    resize.observe(group);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) void prime();
        synchronize();
      },
      { rootMargin: "100px" },
    );
    observer.observe(viewport);
    window.addEventListener(
      "pagehide",
      (event) => {
        suspended = true;
        clearTimeout(settling);
        settling = undefined;
        stopMotion();
        if (!event.persisted) {
          resize.disconnect();
          observer.disconnect();
          events.abort();
        }
      },
      { signal },
    );
    window.addEventListener(
      "pageshow",
      () => {
        suspended = false;
        synchronize();
      },
      { signal },
    );
    synchronize();
  });
