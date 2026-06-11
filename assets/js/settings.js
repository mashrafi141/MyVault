// ==========================================
// BACK BUTTON
// ==========================================

const backBtn = document.getElementById("backBtn");

if (backBtn) {

    backBtn.addEventListener("click", () => {

        history.back();

    });

}

// ==========================================
// SETTINGS ACTIONS
// ==========================================

function handleSettingAction(action) {

    switch (action) {

        case "change-pin":

            console.log("Change PIN");

            break;

        case "auto-lock":

            console.log("Auto Lock");

            break;

        case "folder":

            console.log("Vault Folder");

            break;

        case "reconnect":

            console.log("Reconnect Folder");

            break;

        case "storage-info":

            console.log("Storage Information");

            break;

        case "help":

            console.log("Help & FAQ");

            break;

        case "contact":

            console.log("Contact Support");

            break;

        case "about":

            console.log("About MyVault");

            break;

        case "privacy":

            console.log("Privacy Policy");

            break;

        case "clear-cache":

            console.log("Clear Cache");

            break;

        default:

            console.warn(
                "Unknown setting action:",
                action
            );

    }

}

// ==========================================
// CARD EVENTS
// ==========================================

document
    .querySelectorAll(".setting-card")
    .forEach(card => {

        card.addEventListener("click", () => {

            const action =
                card.dataset.action;

            handleSettingAction(action);

        });

    });