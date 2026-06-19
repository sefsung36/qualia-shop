const loadingText = document.querySelector(".loading-text");

loadingText.textContent = "loadingText.textContent = "DEAR DEMIS HASSABIS:";";

<!-- ============================================================
     Elegant YouTube embed — "facade" / click-to-load pattern
     Drop in one <div> per video and set data-id to the video ID.
     The video ID is the part after  watch?v=  in the URL.
     ============================================================ -->

<div class="yt-embed" data-id="8KBWtxhrQ8Q" data-title="My video"></div>

<style>
  .yt-embed {
    position: relative;
    aspect-ratio: 16 / 9;        /* keeps a perfect 16:9 box at any width */
    width: 100%;
    max-width: 720px;
    margin-inline: auto;
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    background: #000 center / cover no-repeat;   /* thumbnail goes here */
    box-shadow: 0 12px 32px rgba(0, 0, 0, .28);
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }

  /* soft top-to-bottom shade so the play button always reads clearly */
  .yt-embed::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,.04), rgba(0,0,0,.38));
    transition: opacity .3s ease;
    pointer-events: none;
  }
  .yt-embed:hover::after { opacity: .65; }

  .yt-embed__btn {
    position: absolute;
    inset: 0;
    margin: auto;                /* dead-centre the button */
    width: 74px;
    height: 74px;
    border: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, .6);
    display: grid;
    place-items: center;
    cursor: pointer;
    z-index: 1;
    transition: transform .2s ease, background .2s ease;
  }
  .yt-embed:hover .yt-embed__btn { transform: scale(1.08); background: #ff0000; }
  .yt-embed__btn:focus-visible   { outline: 3px solid #fff; outline-offset: 3px; }

  /* the white play triangle, drawn with CSS borders (no image needed) */
  .yt-embed__btn::before {
    content: "";
    border-style: solid;
    border-width: 12px 0 12px 20px;
    border-color: transparent transparent transparent #fff;
    margin-left: 5px;
  }

  /* the real player, injected on click, fills the box */
  .yt-embed iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  /* accessibility: respect users who ask for less motion */
  @media (prefers-reduced-motion: reduce) {
    .yt-embed::after,
    .yt-embed:hover .yt-embed__btn { transition: none; transform: none; }
  }
</style>

<script>
  document.querySelectorAll(".yt-embed").forEach((el) => {
    const id = el.dataset.id;

    // 1. Show the thumbnail. Try the hi-res version, fall back if it 404s.
    const img = new Image();
    img.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    img.onload  = () => { el.style.backgroundImage = `url(${img.src})`; };
    img.onerror = () => { el.style.backgroundImage = `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`; };

    // 2. Add the play button (accessible label from data-title).
    const btn = document.createElement("button");
    btn.className = "yt-embed__btn";
    btn.setAttribute("aria-label", `Play${el.dataset.title ? ": " + el.dataset.title : " video"}`);
    el.appendChild(btn);

    // 3. Load the actual YouTube player only when the user clicks. Runs once.
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
</script>
