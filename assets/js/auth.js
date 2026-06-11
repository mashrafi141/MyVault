// ==========================================
// ELEMENTS
// ==========================================

const splashScreen = document.getElementById("splash-screen");

const createPinScreen = document.getElementById("create-pin-screen");

const loginScreen = document.getElementById("login-screen");

const dashboardScreen = document.getElementById("dashboard-screen");

const createPinBtn = document.getElementById("create-pin-btn");

const loginBtn = document.getElementById("login-btn");

// ==========================================
// STORAGE KEY
// ==========================================

const PIN_KEY = "vault_pin";
const AUTO_LOCK_KEY = "vault_auto_lock";

let autoLockTimer;

// ==========================================
// SCREEN CONTROL
// ==========================================

function hideAllScreens() {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
}

function showScreen(id) {
  hideAllScreens();

  document.getElementById(id).classList.add("active");
}

// ==========================================
// AUTO LOCK
// ==========================================

function startAutoLock() {
  clearTimeout(autoLockTimer);

  const setting = localStorage.getItem(AUTO_LOCK_KEY);

  if (!setting || setting === "off") {
    return;
  }

  autoLockTimer = setTimeout(
    () => {
      document.getElementById("login-pin").value = "";

      showScreen("login-screen");

      alert("Vault locked");
    },
    Number(setting) * 60 * 1000,
  );
}

// ==========================================
// CHECK AUTH
// ==========================================

function checkAuth() {
  const savedPin = localStorage.getItem(PIN_KEY);

  if (savedPin) {
    showScreen("login-screen");
  } else {
    showScreen("create-pin-screen");
  }
}

// ==========================================
// CREATE PIN
// ==========================================

function createPin() {
  const pin = document.getElementById("create-pin").value.trim();

  const confirm = document.getElementById("confirm-pin").value.trim();

  if (pin.length !== 4) {
    alert("PIN must be 4 digits");

    return;
  }

  if (!/^\d+$/.test(pin)) {
    alert("PIN must contain numbers only");

    return;
  }

  if (pin !== confirm) {
    alert("PIN does not match");

    return;
  }

  localStorage.setItem(PIN_KEY, pin);

  startAutoLock();

  showScreen("dashboard-screen");
}

// ==========================================
// LOGIN
// ==========================================

function unlockVault() {
  const pin = document.getElementById("login-pin").value.trim();

  const savedPin = localStorage.getItem(PIN_KEY);

  if (pin === savedPin) {
    startAutoLock();

    showScreen("dashboard-screen");

    return;
  }

  alert("Wrong PIN");
}

// ==========================================
// EVENTS
// ==========================================

createPinBtn?.addEventListener("click", createPin);

loginBtn?.addEventListener("click", unlockVault);

// ==========================================
// ENTER KEY SUPPORT
// ==========================================

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  if (createPinScreen.classList.contains("active")) {
    createPin();
  }

  if (loginScreen.classList.contains("active")) {
    unlockVault();
  }
});

// ==========================================
// START APP
// ==========================================

window.addEventListener("load", () => {
  setTimeout(() => {
    checkAuth();
  }, 1800);
});
