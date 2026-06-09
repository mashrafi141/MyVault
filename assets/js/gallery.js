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
// CREATE VIDEO CARD
// ==========================================

async function createVideoCard(fileHandle) {
  const file = await fileHandle.getFile();

  const card = document.createElement("div");

  card.className = "media-card";

  card.innerHTML = `

    <div class="video-thumb">

        <i
        class="fa-solid fa-circle-play"
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
