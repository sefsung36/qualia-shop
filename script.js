const loadingText = document.querySelector(".loading-text");
loadingText.textContent = "DEAR DEMIS, DANIELA, DARIO, TREVOR, MILES, LEOPOLD, AVITAL, YOSHUA, GEOFFREY, STUART AND ANY OTHER GOOD HEARTED SOUL WHO GENUINELY CARES:";

document.querySelectorAll(".yt-embed").forEach((el) => {
  const id = el.dataset.id;

  // gap between the heading and the video (raise/lower the value to taste)
  el.style.marginTop = "5rem";

  // play button only — no thumbnail, so the box stays plain black
  const btn = document.createElement("button");
  btn.className = "yt-embed__btn";
  btn.setAttribute("aria-label", `Play${el.dataset.title ? ": " + el.dataset.title : " video"}`);
  el.appendChild(btn);

  // load the YouTube player only when the user clicks
  el.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = el.dataset.title || "YouTube video player";
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    el.innerHTML = "";
    el.style.cursor = "default";
    el.appendChild(iframe);
  }, { once: true });
});
