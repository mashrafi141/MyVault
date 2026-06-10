// ==========================================
// VIEWER STATE
// ==========================================

let startX = 0;
let currentX = 0;
let isDragging = false;

// ==========================================
// RENDER CURRENT MEDIA
// ==========================================

async function renderCurrentMedia() {
  const counter = document.getElementById("viewer-counter");

  if (counter) {
    counter.textContent = `${currentMediaIndex + 1} / ${mediaList.length}`;
  }

  const content = document.getElementById("viewer-content");

  if (!content || !mediaList.length) return;

  const media = mediaList[currentMediaIndex];

  const file = await media.fileHandle.getFile();

  const url = URL.createObjectURL(file);

  content.style.transform = "translateX(0px)";

  if (media.type === "image") {
    content.innerHTML = `

            <img
                class="viewer-image"
                src="${url}"
            >

        `;
  } else {
    const blob = file.slice(0, file.size, "video/mp4");

    const videoUrl = URL.createObjectURL(blob);

    content.innerHTML = `

            <video
                class="viewer-video"
                controls
                autoplay
                playsinline
            >

                <source
                    src="${videoUrl}"
                    type="video/mp4"
                >

            </video>

        `;
  }
}

// ==========================================
// OPEN VIEWER
// ==========================================

async function openViewer() {
  await renderCurrentMedia();

  showScreen("viewer-screen");
}

// ==========================================
// NEXT
// ==========================================

async function nextMedia() {
  if (currentMediaIndex >= mediaList.length - 1) return;

  currentMediaIndex++;

  await renderCurrentMedia();
}

// ==========================================
// PREVIOUS
// ==========================================

async function previousMedia() {
  if (currentMediaIndex <= 0) return;

  currentMediaIndex--;

  await renderCurrentMedia();
}

// ==========================================
// EVENTS
// ==========================================

window.addEventListener("load", () => {
  const viewer = document.getElementById("viewer-screen");

  const content = document.getElementById("viewer-content");

  const closeBtn = document.getElementById("close-viewer");

  closeBtn?.addEventListener("click", () => {
    showScreen("media-screen");
  });

  viewer?.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;

    currentX = startX;

    isDragging = true;

    content.style.transition = "none";
  });

  viewer?.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    currentX = e.touches[0].clientX;

    const diff = currentX - startX;

    content.style.transform = `translateX(${diff}px)`;
  });

  viewer?.addEventListener("touchend", async () => {
    if (!isDragging) return;

    isDragging = false;

    const diff = currentX - startX;

    content.style.transition = "transform .25s cubic-bezier(.22,1,.36,1)";

    // NEXT

    if (diff < -80) {
      content.style.transform = "translateX(-100vw)";

      setTimeout(async () => {
        await nextMedia();
      }, 180);
    }

    // PREVIOUS
    else if (diff > 80) {
      content.style.transform = "translateX(100vw)";

      setTimeout(async () => {
        await previousMedia();
      }, 180);
    }

    // SNAP BACK
    else {
      content.style.transform = "translateX(0px)";
    }
  });
});
