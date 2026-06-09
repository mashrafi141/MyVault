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
// GENERATE VIDEO THUMBNAIL
// ==========================================

async function generateVideoThumbnail(file) {
  return new Promise((resolve) => {
    const blob = new Blob([file], {
      type: "video/mp4",
    });

    const url = URL.createObjectURL(blob);

    const video = document.createElement("video");

    video.src = url;

    video.muted = true;

    video.playsInline = true;

    video.addEventListener("loadeddata", () => {
      video.currentTime = 1;
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth;

      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(video, 0, 0);

      resolve(canvas.toDataURL("image/jpeg"));

      URL.revokeObjectURL(url);
    });
  });
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

        <div
            class="play-overlay"
        >

            <i
            class="
            fa-solid
            fa-play
            "
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

  for await (const item of folderHandle.values()) {
    if (item.kind !== "file") continue;

    const lower = item.name.toLowerCase();

    let card;

    if (lower.endsWith(".hid")) {
      card = await createVideoCard(item);
    } else {
      card = await createImageCard(item);
    }

    mediaGrid.appendChild(card);
  }
}
