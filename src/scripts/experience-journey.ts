const navigation = document.querySelector<HTMLElement>("[data-journey-nav]");
if (navigation) {
  const links = [
    ...navigation.querySelectorAll<HTMLAnchorElement>("[data-journey-link]"),
  ];
  const sections = links.map((link) =>
    document.getElementById(link.dataset.journeyLink || "")!,
  );
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compact = window.matchMedia("(max-width: 1100px)");
  let positions: number[] = [];
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
    if (index !== active) {
      active = index;
      links.forEach((link, i) => {
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
    navigation.style.setProperty(
      "--journey-distance",
      compact.matches ? `${navigation.clientWidth * 0.8}px` : "256px",
    );
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
