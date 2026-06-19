const loadingText = document.querySelector(".loading-text");
loadingText.textContent = "DEAR DEMIS HASSABIS:";   // fixed the nested-quote typo — set whatever text you intended

document.querySelectorAll(".yt-embed").forEach((el) => {
  const id = el.dataset.id;

  const img = new Image();
  img.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  img.onload  = () => { el.style.backgroundImage = `url(${img.src})`; };
  img.onerror = () => { el.style.backgroundImage = `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`; };

  const btn = document.createElement("button");
  btn.className = "yt-embed__btn";
  btn.setAttribute("aria-label", `Play${el.dataset.title ? ": " + el.dataset.title : " video"}`);
  el.appendChild(btn);

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
