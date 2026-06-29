const loadingText = document.querySelector(".loading-text");

loadingText.textContent =
  "DEAR DEMIS, DANIELA AMODEI, DARIO AMODEI, DOUGLAS HOFSTADTER, TREVOR BLACKWELL, MILES BRUNDAGE, LEOPOLD ASCHENBRENNER, AVITAL BALWIT, YOSHUA BENGIO, GEOFFREY HINTON, STUART RUSSELL AND ANY OTHER GOOD HEARTED SOUL WHO GENUINELY CARES:";

// remove old video blocks if they exist
document.querySelectorAll(".yt-embed").forEach((el) => el.remove());

const style = document.createElement("style");
style.textContent = `
  body {
    margin: 0;
    background: #000;
    color: #fff;
    font-family: Helvetica, Arial, sans-serif;
  }

  .loading-text {
    max-width: 1100px;
    margin: 3.5rem auto 2.5rem;
    padding: 0 1.25rem;
    text-align: center;
    line-height: 1.02;
    letter-spacing: -0.045em;
    font-weight: 900;
  }

  .paper-shell {
    width: min(1180px, calc(100vw - 2rem));
    margin: 0 auto 6rem;
    border: 1px solid #2a2a2a;
    background: #080808;
  }

  .paper-header {
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #2a2a2a;
    background: rgba(8, 8, 8, 0.96);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .paper-title {
    font-size: 1rem;
    font-weight: 800;
  }

  .paper-meta {
    margin-top: 0.25rem;
    font-family: monospace;
    font-size: 0.78rem;
    opacity: 0.65;
  }

  .paper-actions {
    display: flex;
    gap: 0.55rem;
    flex-wrap: wrap;
  }

  .paper-actions a,
  .paper-actions button {
    color: #fff;
    background: transparent;
    border: 1px solid #fff;
    padding: 0.55rem 0.8rem;
    font-size: 0.78rem;
    text-decoration: none;
    cursor: pointer;
  }

  .paper-actions a:hover,
  .paper-actions button:hover {
    background: #fff;
    color: #000;
  }

  .paper-status {
    padding: 3rem 1rem;
    text-align: center;
    opacity: 0.7;
  }

  .paper-pages {
    padding: 2rem 1rem 3rem;
    display: grid;
    gap: 2rem;
    justify-items: center;
    background: #111;
  }

  .paper-page {
    max-width: 100%;
    background: #fff;
    box-shadow: 0 18px 60px rgba(0, 0, 0, 0.55);
  }

  .paper-page canvas {
    display: block;
    max-width: 100%;
    height: auto;
  }
`;
document.head.appendChild(style);

async function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function addPaperReader() {
  const recordId = "20873219";
  const doi = "10.5281/zenodo.20873219";
  const doiUrl = `https://doi.org/${doi}`;
  const recordUrl = `https://zenodo.org/records/${recordId}`;
  const apiUrl = `https://zenodo.org/api/records/${recordId}`;

  const shell = document.createElement("section");
  shell.className = "paper-shell";

  shell.innerHTML = `
    <div class="paper-header">
      <div>
        <div class="paper-title">Full Paper</div>
        <div class="paper-meta">DOI: ${doi}</div>
      </div>

      <div class="paper-actions">
        <button type="button" id="zoomOut">−</button>
        <button type="button" id="zoomIn">+</button>
        <a href="${doiUrl}" target="_blank" rel="noopener noreferrer">DOI</a>
        <a href="${recordUrl}" target="_blank" rel="noopener noreferrer">Zenodo</a>
      </div>
    </div>

    <div class="paper-status">Loading paper…</div>
    <div class="paper-pages"></div>
  `;

  loadingText.insertAdjacentElement("afterend", shell);

  const status = shell.querySelector(".paper-status");
  const pages = shell.querySelector(".paper-pages");

  try {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    const res = await fetch(apiUrl);
    const data = await res.json();

    const pdfFile = data.files.find((file) =>
      file.key.toLowerCase().endsWith(".pdf")
    );

    if (!pdfFile) {
      status.textContent = "PDF not found. Open the Zenodo record instead.";
      return;
    }

    const pdfUrl =
      pdfFile.links.self ||
      `https://zenodo.org/records/${recordId}/files/${encodeURIComponent(pdfFile.key)}?download=1`;

    shell.querySelector(".paper-actions").insertAdjacentHTML(
      "beforeend",
      `<a href="${pdfUrl}" target="_blank" rel="noopener noreferrer">Open PDF</a>`
    );

    let zoom = 1.25;
    let pdfDoc = null;

    async function renderPDF() {
      pages.innerHTML = "";
      status.textContent = "Rendering paper…";

      const availableWidth = Math.min(shell.clientWidth - 80, 980);

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);

        const baseViewport = page.getViewport({ scale: 1 });
        const fitScale = availableWidth / baseViewport.width;
        const viewport = page.getViewport({ scale: fitScale * zoom });

        const pageWrap = document.createElement("div");
        pageWrap.className = "paper-page";

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const ratio = window.devicePixelRatio || 1;

        canvas.width = viewport.width * ratio;
        canvas.height = viewport.height * ratio;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        pageWrap.appendChild(canvas);
        pages.appendChild(pageWrap);

        await page.render({
          canvasContext: context,
          viewport
        }).promise;
      }

      status.remove();
    }

    pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
    await renderPDF();

    shell.querySelector("#zoomIn").addEventListener("click", async () => {
      zoom = Math.min(zoom + 0.15, 2.2);
      await renderPDF();
    });

    shell.querySelector("#zoomOut").addEventListener("click", async () => {
      zoom = Math.max(zoom - 0.15, 0.75);
      await renderPDF();
    });
  } catch (error) {
    status.innerHTML = `
      Could not render the PDF inside the page.<br>
      Use the Zenodo or DOI button above.
    `;
  }
}

addPaperReader();
