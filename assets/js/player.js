// ==========================================
// RENDER CURRENT MEDIA
// ==========================================

async function renderCurrentMedia() {
  const content = document.getElementById("viewer-content");

  if (!content || !mediaList.length) return;

  const media = mediaList[currentMediaIndex];

  const file = await media.fileHandle.getFile();

  const url = URL.createObjectURL(file);

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
// TOUCH SWIPE
// ==========================================

let touchStartX = 0;

let touchEndX = 0;

window.addEventListener("load", () => {
  const viewer = document.getElementById("viewer-screen");

  const closeBtn = document.getElementById("close-viewer");

  closeBtn?.addEventListener("click", () => {
    showScreen("media-screen");
  });

  viewer?.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  viewer?.addEventListener("touchend", async (e) => {
    touchEndX = e.changedTouches[0].screenX;

    const diff = touchEndX - touchStartX;

    if (diff < -50) {
      await nextMedia();
    } else if (diff > 50) {
      await previousMedia();
    }
  });
});
