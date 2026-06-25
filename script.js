const loadingText = document.querySelector(".loading-text");

loadingText.textContent =
  "DEAR DEMIS, DANIELA, DARIO, DOUGLAS, TREVOR, MILES, LEOPOLD, AVITAL, YOSHUA, GEOFFREY, STUART AND ANY OTHER GOOD HEARTED SOUL WHO GENUINELY CARES:";

const style = document.createElement("style");

style.textContent = `
  body {
    margin: 0;
    background: #000;
    color: #fff;
  }

  .loading-text {
    max-width: 1180px;
    margin: 3rem auto 2.5rem;
    padding: 0 1.25rem;
    text-align: center;
    line-height: 1.05;
    letter-spacing: -0.04em;
  }

  .paper-shell {
    width: min(1100px, calc(100vw - 2rem));
    margin: 0 auto 5rem;
    border: 1px solid #2a2a2a;
    background: #050505;
  }

  .paper-header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #2a2a2a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .paper-title {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .paper-meta {
    margin-top: 0.25rem;
    font-family: monospace;
    font-size: 0.82rem;
    opacity: 0.65;
  }

  .paper-actions {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .paper-actions a {
    color: #fff;
    text-decoration: none;
    border: 1px solid #fff;
    padding: 0.6rem 0.85rem;
    font-size: 0.85rem;
  }

  .paper-actions a:hover {
    background: #fff;
    color: #000;
  }

  .paper-frame-wrap {
    height: min(86vh, 980px);
    background: #111;
  }

  .paper-frame {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
    background: #111;
  }

  .paper-status {
    padding: 2rem;
    text-align: center;
    opacity: 0.7;
  }
`;

document.head.appendChild(style);

async function addPaperReader() {
  const recordId = "20873219";
  const doiUrl = "https://doi.org/10.5281/zenodo.20873219";
  const recordUrl = `https://zenodo.org/records/${recordId}`;
  const apiUrl = `https://zenodo.org/api/records/${recordId}`;

  const shell = document.createElement("section");
  shell.className = "paper-shell";

  shell.innerHTML = `
    <div class="paper-header">
      <div>
        <div class="paper-title">Full Paper Preview</div>
        <div class="paper-meta">DOI: 10.5281/zenodo.20873219</div>
      </div>

      <div class="paper-actions">
        <a href="${doiUrl}" target="_blank" rel="noopener noreferrer">Open DOI</a>
        <a href="${recordUrl}" target="_blank" rel="noopener noreferrer">Open Zenodo</a>
      </div>
    </div>

    <div class="paper-frame-wrap">
      <div class="paper-status">Loading paper…</div>
    </div>
  `;

  loadingText.insertAdjacentElement("afterend", shell);

  const frameWrap = shell.querySelector(".paper-frame-wrap");

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const pdf = data.files.find((file) =>
      file.key.toLowerCase().endsWith(".pdf")
    );

    if (!pdf) {
      frameWrap.innerHTML =
        `<div class="paper-status">PDF not found. Use the Zenodo link above.</div>`;
      return;
    }

    const pdfUrl = pdf.links.self;

    frameWrap.innerHTML = `
      <iframe
        class="paper-frame"
        src="${pdfUrl}#view=FitH"
        title="Full paper PDF preview"
        loading="lazy">
      </iframe>
    `;

    shell.querySelector(".paper-actions").insertAdjacentHTML(
      "afterbegin",
      `<a href="${pdfUrl}" target="_blank" rel="noopener noreferrer">Open PDF</a>`
    );
  } catch (error) {
    frameWrap.innerHTML =
      `<div class="paper-status">Could not load preview. Use the Zenodo link above.</div>`;
  }
}

addPaperReader();
