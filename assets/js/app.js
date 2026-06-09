// ==========================================
// APP START
// ==========================================

window.addEventListener(
    "load",
    async () => {

        setTimeout(
            async () => {

                // ==========================
                // CONNECT BUTTON
                // ==========================

                const connectBtn =
                document.getElementById(
                    "connect-folder-btn"
                );

                if (connectBtn) {

                    connectBtn.addEventListener(
                        "click",
                        async () => {

                            await selectVaultFolder();

                        }
                    );

                }

                // ==========================
                // RESTORE SAVED FOLDER
                // ==========================

                const restored =
                await restoreFolderAccess();

                if (restored) {

                    console.log(
                        "Vault folder restored"
                    );

                    await scanVault();

                }
                else {

                    console.log(
                        "No saved vault folder"
                    );

                }

            },
            100
        );

    }
);