const PIN_KEY = "vault_pin";

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
      document.getElementById("changePinModal").classList.add("show");

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
      console.warn("Unknown setting action:", action);
  }
}

// ==========================================
// CARD EVENTS
// ==========================================

document.querySelectorAll(".setting-card").forEach((card) => {
  card.addEventListener("click", () => {
    const action = card.dataset.action;

    handleSettingAction(action);
  });
});

// ==========================================
// CHANGE PIN MODAL
// ==========================================

const cancelPinBtn = document.getElementById("cancelPinBtn");

if (cancelPinBtn) {
  cancelPinBtn.addEventListener("click", () => {
    document.getElementById("currentPin").value = "";
    document.getElementById("newPin").value = "";
    document.getElementById("confirmNewPin").value = "";

    document.getElementById("changePinModal").classList.remove("show");
  });
}

const savePinBtn = document.getElementById("savePinBtn");

if (savePinBtn) {
  savePinBtn.addEventListener("click", () => {
    const currentPin = document.getElementById("currentPin").value.trim();

    const newPin = document.getElementById("newPin").value.trim();

    const confirmPin = document.getElementById("confirmNewPin").value.trim();

    const savedPin = localStorage.getItem(PIN_KEY);

    if (currentPin !== savedPin) {
      alert("Current PIN is incorrect");

      return;
    }

    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      alert("PIN must be 4 digits");

      return;
    }

    if (newPin === savedPin) {
      alert("New PIN must be different");

      return;
    }

    if (newPin !== confirmPin) {
      alert("PIN does not match");

      return;
    }

    localStorage.setItem(PIN_KEY, newPin);

    document.getElementById("currentPin").value = "";
    document.getElementById("newPin").value = "";
    document.getElementById("confirmNewPin").value = "";

    alert("PIN changed successfully");

    document.getElementById("changePinModal").classList.remove("show");
  });
}
