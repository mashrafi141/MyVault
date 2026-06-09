// ==========================================
// SUPPORTED EXTENSIONS
// ==========================================

const PHOTO_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".heic",
  ".dat",
];

const VIDEO_EXTENSIONS = [
  ".mp4",
  ".mkv",
  ".avi",
  ".mov",
  ".webm",
  ".3gp",
  ".hid",
];

// ==========================================
// SCAN VAULT
// ==========================================

async function scanVault() {
  if (!vaultFolderHandle) {
    const folderName = document.getElementById("vault-folder-name");

    const folderInfo = document.getElementById("vault-folder-info");

    if (folderName) {
      folderName.textContent = "No Folder Connected";
    }

    if (folderInfo) {
      folderInfo.textContent = "Select your vault folder";
    }

    return;
  }

  const folders = [];

  try {
    for await (const entry of vaultFolderHandle.values()) {
      if (entry.kind !== "directory") continue;

      if (!entry.name.startsWith(".")) continue;

      const stats = await scanFolder(entry);

      folders.push({
        name: entry.name,

        photos: stats.photos,

        videos: stats.videos,

        totalSize: stats.totalSize,
      });
    }

    renderVaultFolders(folders);

    await updateVaultInfo();
  } catch (error) {
    console.error(error);
  }
}

// ==========================================
// SCAN SINGLE FOLDER
// ==========================================

async function scanFolder(folderHandle) {
  let photos = 0;
  let videos = 0;
  let totalSize = 0;

  try {
    for await (const item of folderHandle.values()) {
      if (item.kind !== "file") continue;

      const file = await item.getFile();

      totalSize += file.size;

      const name = item.name.toLowerCase();

      if (PHOTO_EXTENSIONS.some((ext) => name.endsWith(ext))) {
        photos++;
      } else if (VIDEO_EXTENSIONS.some((ext) => name.endsWith(ext))) {
        videos++;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return {
    photos,
    videos,
    totalSize,
  };
}

// ==========================================
// FORMAT SIZE
// ==========================================

function formatSize(bytes) {
  if (bytes < 1024) {
    return bytes + " B";
  }

  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
  }

  if (bytes < 1024 * 1024 * 1024) {
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  }

  return (bytes / 1024 / 1024 / 1024).toFixed(1) + " GB";
}

// ==========================================
// RECURSIVE SIZE
// ==========================================

async function getFolderSize(folderHandle) {
  let size = 0;

  for await (const item of folderHandle.values()) {
    if (item.kind === "file") {
      const file = await item.getFile();

      size += file.size;
    } else if (item.kind === "directory") {
      size += await getFolderSize(item);
    }
  }

  return size;
}

// ==========================================
// RENDER FOLDERS
// ==========================================

function renderVaultFolders(folders) {
  const grid = document.getElementById("folder-grid");

  if (!grid) return;

  grid.innerHTML = "";

  if (folders.length === 0) {
    grid.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-folder-open"></i>

            <h3>
                No Hidden Folder
            </h3>

            <p>
                Hide a folder first
            </p>

        </div>

        `;

    return;
  }

  folders.forEach((folder) => {
    const card = document.createElement("div");

    card.className = "folder-card";

    card.innerHTML = `

            <i class="fa-solid fa-folder"></i>

            <h4>
                ${folder.name}
            </h4>

            <div class="folder-meta">

                <span>

                    <i class="fa-solid fa-image"></i>

                    ${folder.photos}

                </span>

                <span>

                    <i class="fa-solid fa-video"></i>

                    ${folder.videos}

                </span>

            </div>

            <div class="folder-size">

                ${formatSize(folder.totalSize)}

            </div>

        `;

    card.addEventListener("click", () => {
      openFolder(folder.name);
    });

    grid.appendChild(card);
  });

  updateDashboardStats(folders);
}

// ==========================================
// UPDATE STATS
// ==========================================

function updateDashboardStats(folders) {
  const folderCount = document.getElementById("folder-count");

  const photoCount = document.getElementById("photo-count");

  const videoCount = document.getElementById("video-count");

  let totalPhotos = 0;
  let totalVideos = 0;

  folders.forEach((folder) => {
    totalPhotos += folder.photos;

    totalVideos += folder.videos;
  });

  if (folderCount) {
    folderCount.textContent = folders.length;
  }

  if (photoCount) {
    photoCount.textContent = totalPhotos;
  }

  if (videoCount) {
    videoCount.textContent = totalVideos;
  }
}

// ==========================================
// OPEN FOLDER
// ==========================================

async function openFolder(folderName) {
  if (!vaultFolderHandle) return;

  let targetFolder = null;

  for await (const entry of vaultFolderHandle.values()) {
    if (entry.kind === "directory" && entry.name === folderName) {
      targetFolder = entry;

      break;
    }
  }

  if (!targetFolder) return;

  document.getElementById("media-title").textContent = folderName;

  const mediaGrid = document.getElementById("media-grid");

  mediaGrid.innerHTML = "";

  for await (const item of targetFolder.values()) {
    if (item.kind !== "file") continue;

    const isVideo = item.name.toLowerCase().endsWith(".hid");

    const card = document.createElement("div");

    card.className = "media-card";

    card.innerHTML = `

            <i class="fa-solid ${isVideo ? "fa-video" : "fa-image"}"></i>

            <span>

                ${item.name}

            </span>

        `;

    mediaGrid.appendChild(card);
  }

  showScreen("media-screen");
}

// ==========================================
// UPDATE VAULT INFO
// ==========================================

async function updateVaultInfo() {
  if (!vaultFolderHandle) return;

  let folderCount = 0;
  let totalSize = 0;

  for await (const entry of vaultFolderHandle.values()) {
    if (entry.kind === "directory") {
      folderCount++;

      totalSize += await getFolderSize(entry);
    }
  }

  const folderName = document.getElementById("vault-folder-name");

  const folderInfo = document.getElementById("vault-folder-info");

  const vaultStatus = document.getElementById("vault-status");

  if (folderName) {
    folderName.textContent = vaultFolderHandle.name;
  }

  if (folderInfo) {
    folderInfo.textContent = `${folderCount} folders • ${formatSize(totalSize)}`;
  }

  if (vaultStatus) {
    vaultStatus.textContent = "Connected";
  }

  if (vaultBadge) {
    vaultBadge.classList.remove("disconnected");

    vaultBadge.classList.add("connected");

    vaultBadge.innerHTML = `

        <span
            class="status-dot"
        ></span>

        Connected

    `;
  }
}
