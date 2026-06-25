const loadingText = document.querySelector(".loading-text");

loadingText.textContent =
  "DEAR DEMIS, DANIELA, DARIO, DOUGLAS, TREVOR, MILES, LEOPOLD, AVITAL, YOSHUA, GEOFFREY, STUART AND ANY OTHER GOOD HEARTED SOUL WHO GENUINELY CARES:";

// Zenodo embed
const zenodo = document.createElement("section");
zenodo.className = "zenodo-embed";
zenodo.style.marginTop = "4rem";
zenodo.style.width = "100%";
zenodo.style.minHeight = "80vh";

zenodo.innerHTML = `
  <iframe
    src="https://zenodo.org/records/20873219"
    title="Zenodo record 10.5281/zenodo.20873219"
    style="width:100%; height:80vh; border:1px solid #222; background:#000;"
    loading="lazy">
  </iframe>

  <p style="margin-top:1rem;">
    <a
      href="https://doi.org/10.5281/zenodo.20873219"
      target="_blank"
      rel="noopener noreferrer">
      Open the Zenodo file
    </a>
  </p>
`;

loadingText.insertAdjacentElement("afterend", zenodo);

// YouTube embeds
document.querySelectorAll(".yt-embed").forEach((el) => {
  const id = el.dataset.id;

  el.style.marginTop = "4rem";

  const btn = document.createElement("button");
  btn.className = "yt-embed__btn";
  btn.setAttribute(
    "aria-label",
    `Play${el.dataset.title ? ": " + el.dataset.title : " video"}`
  );
  el.appendChild(btn);

  el.addEventListener(
    "click",
    () => {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      iframe.title = el.dataset.title || "YouTube video player";
      iframe.allow =
        "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;

      el.innerHTML = "";
      el.style.cursor = "default";
      el.appendChild(iframe);
    },
    { once: true }
  );
});
