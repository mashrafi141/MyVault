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


const settingsBtn =
document.getElementById("settings-btn");

if(settingsBtn){

    settingsBtn.addEventListener("click",()=>{

        window.location.href =
        "settings.html";

    });

}

// ==========================================
// SERVICE WORKER
// ==========================================

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker.register(
                "./service-worker.js"
            );

        }
    );

}
