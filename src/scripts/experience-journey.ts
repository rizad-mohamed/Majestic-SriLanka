const navigation = document.querySelector<HTMLElement>("[data-journey-nav]");
if (navigation) {
  const links = [
    ...navigation.querySelectorAll<HTMLAnchorElement>("[data-journey-link]"),
  ];
  const sections = links.map((link) =>
    document.getElementById(link.dataset.journeyLink || "")!,
  );
  const allLinks = [
    ...document.querySelectorAll<HTMLAnchorElement>("[data-journey-link]"),
  ];
  const spine = document.querySelector<HTMLElement>(".journey-spine")!;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compact = window.matchMedia("(max-width: 1100px)");
  let positions: number[] = [];
  let stops: number[] = [];
  let frame = 0;
  let active = -1;
  const update = () => {
    frame = 0;
    const anchor = window.scrollY + window.innerHeight * 0.36;
    let index = 0;
    while (index < positions.length - 1 && anchor >= positions[index + 1])
      index++;
    const fraction =
      index === positions.length - 1
        ? 0
        : Math.min(
            1,
            Math.max(
              0,
              (anchor - positions[index]) /
                (positions[index + 1] - positions[index]),
            ),
          );
    const progress =
      (index + (reduced.matches ? 0 : fraction)) / (positions.length - 1);
    navigation.style.setProperty("--journey-progress", String(progress));
    const physicalProgress = Math.min(
      1,
      Math.max(0, (anchor - stops[0]) / (stops.at(-1)! - stops[0])),
    );
    spine.style.setProperty(
      "--journey-progress",
      String(
        reduced.matches
          ? (stops[index] - stops[0]) / (stops.at(-1)! - stops[0])
          : physicalProgress,
      ),
    );
    if (index !== active) {
      active = index;
      allLinks.forEach((link) => {
        const i = sections.findIndex(
          (section) => section.id === link.dataset.journeyLink,
        );
        if (i === active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
        link.dataset.complete = String(i < active);
      });
    }
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const measure = () => {
    positions = sections.map(
      (section) => section.getBoundingClientRect().top + window.scrollY,
    );
    navigation.style.setProperty("--journey-distance", "256px");
    if (compact.matches) {
      const origin =
        spine.parentElement!.getBoundingClientRect().top + window.scrollY;
      stops = sections.map((section) => {
        const marker = section.querySelector<HTMLElement>(".journey-marker")!;
        const box = marker.getBoundingClientRect();
        return box.top + window.scrollY + box.height / 2;
      });
      spine.style.setProperty("--journey-start", `${stops[0] - origin}px`);
      spine.style.setProperty(
        "--journey-distance",
        `${stops.at(-1)! - stops[0]}px`,
      );
    } else stops = positions;
    schedule();
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  reduced.addEventListener("change", schedule);
  const observer = new ResizeObserver(measure);
  sections.forEach((section) => observer.observe(section));
  document.fonts.ready.then(measure);
  measure();
}
