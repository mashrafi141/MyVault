// ==========================================
// RENDER SINGLE MEDIA
// ==========================================

async function renderMediaInto(container, media) {
  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!media) {
    return;
  }

  const file = media.file;

  const url = media.url;

  if (media.type === "image") {
    container.innerHTML = `

            <img
                class="viewer-image"
                src="${url}"
            >

        `;
  } else {
    const video = document.createElement("video");

    video.className = "viewer-video";

    video.controls = true;

    video.playsInline = true;

    video.preload = "metadata";

    video.src = url;

    loadVideoProgress(video, media);

    video.addEventListener("timeupdate", () => {
      const key = `progress_${media.file.name}_${media.file.size}`;

      localStorage.setItem(key, video.currentTime);
    });

    container.appendChild(video);
  }
}

// ==========================================
// VIEWER STATE
// ==========================================

// ==========================================
// STOP ALL VIDEOS
// ==========================================

function stopAllVideos() {
  document.querySelectorAll("video").forEach((video) => {
    video.pause();

    video.muted = true;

    video.currentTime = 0;

    video.removeAttribute("src");

    video.load();
  });
}

// ==========================================
// SAVE VIDEO PROGRESS
// ==========================================

function saveVideoProgress() {
  const video = document.querySelector("#current-slide video");

  if (!video) return;

  const media = mediaList[currentMediaIndex];

  if (!media) return;

  const key = `progress_${media.file.name}_${media.file.size}`;

  localStorage.setItem(key, video.currentTime);
}

// ==========================================
// LOAD VIDEO PROGRESS
// ==========================================

function loadVideoProgress(video, media) {
  const key = `progress_${media.file.name}_${media.file.size}`;

  const saved = localStorage.getItem(key);

  if (!saved) return;

  video.addEventListener(
    "loadedmetadata",
    () => {
      video.currentTime = Number(saved);
    },
    {
      once: true,
    },
  );
}

let startX = 0;
let currentX = 0;
let isDragging = false;

// ==========================================
// RENDER SLIDES
// ==========================================

async function renderSlides() {
  const counter = document.getElementById("viewer-counter");

  if (counter) {
    counter.textContent = `${currentMediaIndex + 1} / ${mediaList.length}`;
  }

  const prevSlide = document.getElementById("prev-slide");

  const currentSlide = document.getElementById("current-slide");

  const nextSlide = document.getElementById("next-slide");

  await renderMediaInto(prevSlide, mediaList[currentMediaIndex - 1]);

  await renderMediaInto(currentSlide, mediaList[currentMediaIndex]);

  await renderMediaInto(nextSlide, mediaList[currentMediaIndex + 1]);
}

// ==========================================
// OPEN VIEWER
// ==========================================

async function openViewer() {
  await renderSlides();

  const track = document.getElementById("viewer-track");

  track.style.transition = "none";

  track.style.transform = "translate3d(-33.333%,0,0)";

  showScreen("viewer-screen");
}

// ==========================================
// NEXT
// ==========================================
/*
async function nextMedia() {
  if (currentMediaIndex >= mediaList.length - 1) {
    return;
  }

  stopAllVideos();

  currentMediaIndex++;

  await renderSlides();
}

// ==========================================
// PREVIOUS
// ==========================================

async function previousMedia() {
  if (currentMediaIndex <= 0) {
    return;
  }

  stopAllVideos();

  currentMediaIndex--;

  await renderSlides();
}

*/

// ==========================================
// EVENTS
// ==========================================

window.addEventListener("load", () => {
  const viewer = document.getElementById("viewer-screen");

  const track = document.getElementById("viewer-track");

  const closeBtn = document.getElementById("close-viewer");

  closeBtn?.addEventListener("click", () => {
    saveVideoProgress();

    stopAllVideos();

    showScreen("media-screen");
  });

  // ==========================
  // TOUCH START
  // ==========================

  viewer?.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;

    currentX = startX;

    isDragging = true;

    track.style.transition = "none";
  });

  // ==========================
  // TOUCH MOVE
  // ==========================

  viewer?.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    currentX = e.touches[0].clientX;

    const diff = currentX - startX;

    track.style.transform = `translate3d(calc(-33.333% + ${diff}px),0,0)`;
  });

  // ==========================
  // TOUCH END
  // ==========================

  viewer?.addEventListener("touchend", async () => {
    if (!isDragging) return;

    isDragging = false;

    const diff = currentX - startX;

    track.style.transition = "transform .25s cubic-bezier(.22,1,.36,1)";

    // NEXT

    if (diff < -80 && currentMediaIndex < mediaList.length - 1) {
      saveVideoProgress();
      stopAllVideos();

      track.style.transform = "translate3d(-66.666%,0,0)";

      setTimeout(async () => {
        track.style.transition = "none";

        currentMediaIndex++;

        await renderSlides();

        requestAnimationFrame(() => {
          track.style.transform = "translate3d(-33.333%,0,0)";
        });
      }, 250);
    }

    // PREVIOUS
    else if (diff > 80 && currentMediaIndex > 0) {
      saveVideoProgress();
      stopAllVideos();

      track.style.transform = "translate3d(0%,0,0)";

      setTimeout(async () => {
        track.style.transition = "none";

        currentMediaIndex--;

        await renderSlides();

        requestAnimationFrame(() => {
          track.style.transform = "translate3d(-33.333%,0,0)";
        });
      }, 250);
    }

    // SNAP BACK
    else {
      track.style.transform = "translate3d(-33.333%,0,0)";
    }
  });
});
