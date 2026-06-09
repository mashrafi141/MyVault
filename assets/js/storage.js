// ==========================================
// DATABASE
// ==========================================

function openDB() {

    return new Promise((resolve, reject) => {

        const request =
        indexedDB.open(
            "VaultDB",
            1
        );

        request.onupgradeneeded = () => {

            const db =
            request.result;

            if (
                !db.objectStoreNames.contains(
                    "handles"
                )
            ) {

                db.createObjectStore(
                    "handles"
                );

            }

        };

        request.onsuccess = () => {

            resolve(
                request.result
            );

        };

        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}

// ==========================================
// GLOBAL HANDLE
// ==========================================

let vaultFolderHandle = null;

// ==========================================
// SAVE HANDLE
// ==========================================

async function saveFolderHandle(
    handle
) {

    const db =
    await openDB();

    return new Promise(
        (resolve, reject) => {

            const tx =
            db.transaction(
                "handles",
                "readwrite"
            );

            const store =
            tx.objectStore(
                "handles"
            );

            const request =
            store.put(
                handle,
                "vault-folder"
            );

            request.onsuccess =
            () => resolve();

            request.onerror =
            () => reject();

        }
    );

}

// ==========================================
// LOAD HANDLE
// ==========================================

async function loadFolderHandle() {

    const db =
    await openDB();

    return new Promise(
        (resolve, reject) => {

            const tx =
            db.transaction(
                "handles",
                "readonly"
            );

            const store =
            tx.objectStore(
                "handles"
            );

            const request =
            store.get(
                "vault-folder"
            );

            request.onsuccess =
            () => {

                resolve(
                    request.result
                );

            };

            request.onerror =
            () => reject();

        }
    );

}

// ==========================================
// CONNECT FOLDER
// ==========================================

async function selectVaultFolder() {

    try {

        const handle =
        await window.showDirectoryPicker();

        vaultFolderHandle =
        handle;

        await saveFolderHandle(
            handle
        );

        alert(
            "Vault folder connected"
        );

        // AUTO SCAN

        if (
            typeof scanVault ===
            "function"
        ) {

            await scanVault();

        }

    }
    catch (error) {

        console.error(
            error
        );

    }

}

// ==========================================
// RESTORE ACCESS
// ==========================================

async function restoreFolderAccess() {

    try {

        const handle =
        await loadFolderHandle();

        if (!handle) {

            return false;

        }

        const permission =
        await handle.queryPermission({
            mode: "read"
        });

        if (
            permission ===
            "granted"
        ) {

            vaultFolderHandle =
            handle;

            return true;

        }

        const newPermission =
        await handle.requestPermission({
            mode: "read"
        });

        if (
            newPermission ===
            "granted"
        ) {

            vaultFolderHandle =
            handle;

            return true;

        }

        return false;

    }
    catch (error) {

        console.error(
            error
        );

        return false;

    }

}