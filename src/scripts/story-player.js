// @ts-check
// Dependency-free native ES module, fetched only when the story dialog opens.
const film = document.querySelector("[data-island-film]");
const dialog = document.getElementById("story-dialog");
dialog?.addEventListener("close", () => {
  if (film instanceof HTMLVideoElement) film.pause();
});
film?.addEventListener("error", () => {
  const message = dialog?.querySelector("[data-film-error]");
  if (message instanceof HTMLElement) message.hidden = false;
});
export function playStory() {
  if (
    !(film instanceof HTMLVideoElement) ||
    !(dialog instanceof HTMLDialogElement) ||
    !dialog.open
  )
    return;
  if (!film.getAttribute("src")) {
    film.src = film.dataset.src || "";
    film.poster = film.dataset.poster || "";
    film.load();
  }
  void film.play().catch(() => {
    /* Native controls remain available. */
  });
}
