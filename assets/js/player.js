// ==========================================
// VIEWER STATE
// ==========================================

let touchStartX = 0;
let touchEndX = 0;

let isAnimating = false;

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
// ANIMATION
// ==========================================

async function animateViewer(direction) {
  if (isAnimating) return false;

  isAnimating = true;

  const content = document.getElementById("viewer-content");

  if (direction === "next") {
    content.classList.add("viewer-exit-left");
  } else {
    content.classList.add("viewer-exit-right");
  }

  await new Promise((resolve) => setTimeout(resolve, 160));

  return true;
}

function finishAnimation(direction) {
  const content = document.getElementById("viewer-content");

  content.classList.remove("viewer-exit-left", "viewer-exit-right");

  if (direction === "next") {
    content.classList.add("viewer-enter-left");
  } else {
    content.classList.add("viewer-enter-right");
  }

  requestAnimationFrame(() => {
    content.classList.remove("viewer-enter-left", "viewer-enter-right");
  });

  setTimeout(() => {
    isAnimating = false;
  }, 220);
}

// ==========================================
// NEXT MEDIA
// ==========================================

async function nextMedia() {
  if (currentMediaIndex >= mediaList.length - 1) return;

  const allowed = await animateViewer("next");

  if (!allowed) return;

  currentMediaIndex++;

  await renderCurrentMedia();

  finishAnimation("next");
}

// ==========================================
// PREVIOUS MEDIA
// ==========================================

async function previousMedia() {
  if (currentMediaIndex <= 0) return;

  const allowed = await animateViewer("prev");

  if (!allowed) return;

  currentMediaIndex--;

  await renderCurrentMedia();

  finishAnimation("prev");
}

// ==========================================
// SWIPE HANDLER
// ==========================================

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

    if (Math.abs(diff) < 50) {
      return;
    }

    if (diff < 0) {
      await nextMedia();
    } else {
      await previousMedia();
    }
  });
});
