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
    try {
      const blob = file.slice(0, file.size, "video/mp4");

      const url = URL.createObjectURL(blob);

      const video = document.createElement("video");

      video.preload = "metadata";

      video.muted = true;

      video.playsInline = true;

      video.src = url;

      video.onloadedmetadata = () => {
        const seekTime = Math.min(0.1, Math.max(0, video.duration / 4));

        video.currentTime = seekTime;
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");

          canvas.width = video.videoWidth || 320;

          canvas.height = video.videoHeight || 180;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const thumb = canvas.toDataURL("image/jpeg", 0.8);

          URL.revokeObjectURL(url);

          resolve(thumb);
        } catch {
          URL.revokeObjectURL(url);

          resolve(null);
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);

        resolve(null);
      };
    } catch {
      resolve(null);
    }
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
