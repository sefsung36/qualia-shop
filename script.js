const loadingText = document.querySelector(".loading-text");

loadingText.textContent =
  "DEAR DEMIS, DANIELA, DARIO, DOUGLAS, TREVOR, MILES, LEOPOLD, AVITAL, YOSHUA, GEOFFREY, STUART AND ANY OTHER GOOD HEARTED SOUL WHO GENUINELY CARES:";

// Page styling
const style = document.createElement("style");
style.textContent = `
  body {
    background: #000;
    color: #fff;
  }

  .loading-text {
    max-width: 1200px;
    margin: 3rem auto 2rem;
    padding: 0 1.5rem;
    text-align: center;
    line-height: 1.05;
  }

  .yt-embed {
    max-width: 960px;
    aspect-ratio: 16 / 9;
    margin: 3rem auto 0;
    border: 1px solid #222;
    background: #000;
    position: relative;
    cursor: pointer;
  }

  .yt-embed iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }

  .yt-embed__btn {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 86px;
    height: 86px;
    border-radius: 50%;
    border: 1px solid #fff;
    background: transparent;
    cursor: pointer;
  }

  .yt-embed__btn::before {
    content: "";
    position: absolute;
    left: 34px;
    top: 25px;
    border-left: 24px solid #fff;
    border-top: 17px solid transparent;
    border-bottom: 17px solid transparent;
  }

  .paper-card {
    max-width: 720px;
    margin: 4rem auto 5rem;
    padding: 2rem;
    border: 1px solid #222;
    text-align: center;
    background: #050505;
  }

  .paper-card__kicker {
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    opacity: 0.6;
    margin-bottom: 1rem;
  }

  .paper-card__title {
    font-size: clamp(1.4rem, 3vw, 2.4rem);
    line-height: 1.05;
    margin: 0 0 1rem;
  }

  .paper-card__doi {
    font-family: monospace;
    font-size: 0.95rem;
    opacity: 0.75;
    margin-bottom: 1.5rem;
  }

  .paper-card__links {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .paper-card__links a {
    color: #fff;
    border: 1px solid #fff;
    padding: 0.75rem 1rem;
    text-decoration: none;
  }

  .paper-card__links a:hover {
    background: #fff;
    color: #000;
  }
`;
document.head.appendChild(style);

// YouTube embeds first
document.querySelectorAll(".yt-embed").forEach((el) => {
  const id = el.dataset.id;

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

// Paper card after the video
const lastVideo = document.querySelector(".yt-embed:last-of-type");

const paper = document.createElement("section");
paper.className = "paper-card";
paper.innerHTML = `
  <div class="paper-card__kicker">Paper / Research File</div>
  <h2 class="paper-card__title">Read the full paper on Zenodo</h2>
  <div class="paper-card__doi">DOI: 10.5281/zenodo.20873219</div>

  <div class="paper-card__links">
    <a
      href="https://doi.org/10.5281/zenodo.20873219"
      target="_blank"
      rel="noopener noreferrer">
      Open DOI
    </a>

    <a
      href="https://zenodo.org/records/20873219"
      target="_blank"
      rel="noopener noreferrer">
      Open Zenodo Record
    </a>
  </div>
`;

if (lastVideo) {
  lastVideo.insertAdjacentElement("afterend", paper);
} else {
  loadingText.insertAdjacentElement("afterend", paper);
}
