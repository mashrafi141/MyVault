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
    ".dat"
];

const VIDEO_EXTENSIONS = [
    ".mp4",
    ".mkv",
    ".avi",
    ".mov",
    ".webm",
    ".3gp",
    ".hid"
];

// ==========================================
// SCAN VAULT
// ==========================================

async function scanVault() {

    if (!vaultFolderHandle) {
        console.log("No vault folder selected");
        return;
    }

    const folders = [];

    try {

        for await (
            const entry
            of vaultFolderHandle.values()
        ) {

            if (entry.kind !== "directory")
                continue;

            if (!entry.name.startsWith("."))
                continue;

            const stats =
            await scanFolder(entry);

            folders.push({

                name: entry.name,

                photos: stats.photos,

                videos: stats.videos,

                total:
                stats.photos +
                stats.videos

            });

        }

        renderVaultFolders(
            folders
        );

    }
    catch (error) {

        console.error(
            error
        );

    }

}

// ==========================================
// SCAN SINGLE FOLDER
// ==========================================

async function scanFolder(
    folderHandle
) {

    let photos = 0;
    let videos = 0;

    try {

        for await (
            const item
            of folderHandle.values()
        ) {

            if (
                item.kind !== "file"
            )
                continue;

            const name =
            item.name.toLowerCase();

            // PHOTO

            if (
                PHOTO_EXTENSIONS.some(
                    ext =>
                    name.endsWith(ext)
                )
            ) {

                photos++;

            }

            // VIDEO

            else if (
                VIDEO_EXTENSIONS.some(
                    ext =>
                    name.endsWith(ext)
                )
            ) {

                videos++;

            }

        }

    }
    catch (error) {

        console.error(
            error
        );

    }

    return {

        photos,
        videos

    };

}

// ==========================================
// RENDER FOLDERS
// ==========================================

function renderVaultFolders(
    folders
) {

    const grid =
    document.getElementById(
        "folder-grid"
    );

    if (!grid) return;

    grid.innerHTML = "";

    // EMPTY

    if (
        folders.length === 0
    ) {

        grid.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-folder-open"></i>

            <h3>No Hidden Folder</h3>

            <p>
                Hide a folder first
            </p>

        </div>

        `;

        return;

    }

    // RENDER

    folders.forEach(
        folder => {

            const card =
            document.createElement(
                "div"
            );

            card.className =
            "folder-card";

            card.innerHTML = `

                <i class="fa-solid fa-folder"></i>

                <h4>
                    ${folder.name}
                </h4>

                <p>
                    📸 ${folder.photos}
                    Photos
                </p>

                <p>
                    🎬 ${folder.videos}
                    Videos
                </p>

            `;

            grid.appendChild(
                card
            );

        }
    );

    updateDashboardStats(
        folders
    );

}

// ==========================================
// UPDATE STATS
// ==========================================

function updateDashboardStats(
    folders
) {

    const folderCount =
    document.getElementById(
        "folder-count"
    );

    const photoCount =
    document.getElementById(
        "photo-count"
    );

    const videoCount =
    document.getElementById(
        "video-count"
    );

    let totalPhotos = 0;
    let totalVideos = 0;

    folders.forEach(
        folder => {

            totalPhotos +=
            folder.photos;

            totalVideos +=
            folder.videos;

        }
    );

    if (folderCount) {

        folderCount.textContent =
        folders.length;

    }

    if (photoCount) {

        photoCount.textContent =
        totalPhotos;

    }

    if (videoCount) {

        videoCount.textContent =
        totalVideos;

    }

}