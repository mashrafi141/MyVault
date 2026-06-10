// ==========================================
// VIEWER DATA
// ==========================================

let mediaList = [];

let currentMediaIndex = 0;

// ==========================================
// CLEAN FILE NAME
// ==========================================

function getDisplayName(fileName) {
  if (fileName.endsWith(".dat")) {
    return fileName.slice(0, -4);
  }

  if (fileName.endsWith(".hid")) {
    return fileName.slice(0, -4);
  }

  return fileName;
}

async function generateVideoThumbnail(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");

    video.preload = "metadata";

    video.src = URL.createObjectURL(file);

    video.muted = true;

    video.addEventListener("loadedmetadata", () => {
      video.currentTime = Math.min(1, video.duration / 2);
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth;

      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(video, 0, 0);

      const thumb = canvas.toDataURL("image/jpeg");

      URL.revokeObjectURL(video.src);

      resolve(thumb);
    });
  });
}

// ==========================================
// CREATE IMAGE CARD
// ==========================================

async function createImageCard(fileHandle) {
  const file = await fileHandle.getFile();

  const url = URL.createObjectURL(file);

  const card = document.createElement("div");

  card.className = "media-card";

  card.innerHTML = `

    <img
        class="media-image"
        src="${url}"
        alt=""
    >

`;

  return card;
}

// ==========================================
// CREATE VIDEO CARD
// ==========================================

async function createVideoCard(fileHandle) {
  const file = await fileHandle.getFile();

  const thumb = await generateVideoThumbnail(file);

  const card = document.createElement("div");

  card.className = "media-card";

  card.innerHTML = `

        <img
            class="media-image"
            src="${thumb}"
        >

        <div class="play-overlay">

            <i
            class="fa-solid fa-play"
            ></i>

        </div>

    `;

  return card;
}

// ==========================================
// RENDER MEDIA
// ==========================================

async function renderMediaGrid(folderHandle) {
  const mediaGrid = document.getElementById("media-grid");

  if (!mediaGrid) return;

  mediaGrid.innerHTML = "";

  mediaList = [];

  let index = 0;

  for await (const item of folderHandle.values()) {
    if (item.kind !== "file") continue;

    const lower = item.name.toLowerCase();

    const isVideo = lower.endsWith(".hid");

    const file = await item.getFile();

    mediaList.push({
      fileHandle: item,

      file: file,

      url: URL.createObjectURL(file),

      type: isVideo ? "video" : "image",
    });

    let card;

    if (isVideo) {
      card = await createVideoCard(item);
    } else {
      card = await createImageCard(item);
    }

    const currentIndex = index;

    card.addEventListener("click", () => {
      currentMediaIndex = currentIndex;

      openViewer();
    });

    mediaGrid.appendChild(card);

    index++;
  }
}
