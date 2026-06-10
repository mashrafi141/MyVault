// ==========================================
// RENDER SINGLE MEDIA
// ==========================================

async function renderMediaInto(
    container,
    media
){

    if(
        !container ||
        !media
    ){
        container.innerHTML = "";
        return;
    }

    const file =
    await media.fileHandle.getFile();

    const url =
    URL.createObjectURL(
        file
    );

    if(
        media.type ===
        "image"
    ){

        container.innerHTML = `

            <img
                class="viewer-image"
                src="${url}"
            >

        `;

    }

    else{

        const blob =
        file.slice(
            0,
            file.size,
            "video/mp4"
        );

        const videoUrl =
        URL.createObjectURL(
            blob
        );

        container.innerHTML = `

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
// VIEWER STATE
// ==========================================

let startX = 0;
let currentX = 0;
let isDragging = false;

// ==========================================
// RENDER SLIDES
// ==========================================

async function renderSlides(){

    const counter =
    document.getElementById(
        "viewer-counter"
    );

    if(counter){

        counter.textContent =
        `${currentMediaIndex + 1} / ${mediaList.length}`;

    }

    const prevSlide =
    document.getElementById(
        "prev-slide"
    );

    const currentSlide =
    document.getElementById(
        "current-slide"
    );

    const nextSlide =
    document.getElementById(
        "next-slide"
    );

    await renderMediaInto(
        prevSlide,
        mediaList[
            currentMediaIndex - 1
        ]
    );

    await renderMediaInto(
        currentSlide,
        mediaList[
            currentMediaIndex
        ]
    );

    await renderMediaInto(
        nextSlide,
        mediaList[
            currentMediaIndex + 1
        ]
    );

}

// ==========================================
// OPEN VIEWER
// ==========================================

async function openViewer() {

    await renderSlides();

    const track =
    document.getElementById(
        "viewer-track"
    );

    track.style.transition =
    "none";

    track.style.transform =
    "translateX(-100vw)";

    showScreen(
        "viewer-screen"
    );

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
