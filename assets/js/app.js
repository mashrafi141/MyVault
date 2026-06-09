// ==========================================
// APP START
// ==========================================

window.addEventListener("load", async () => {
  setTimeout(async () => {
    // ==========================
    // CONNECT BUTTON
    // ==========================

    const connectBtn = document.getElementById("connect-folder-btn");

    if (connectBtn) {
      connectBtn.addEventListener("click", async () => {
        await selectVaultFolder();
      });
    }

    // ==========================
    // BACK BUTTON
    // ==========================

    const backBtn = document.getElementById("back-to-dashboard");

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        showScreen("dashboard-screen");
      });
    }

    // ==========================
    // RESTORE SAVED FOLDER
    // ==========================

    const restored = await restoreFolderAccess();

    if (restored) {
      console.log("Vault folder restored");

      await scanVault();
    } else {
      console.log("No saved vault folder");
    }
  }, 100);
});
