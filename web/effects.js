window.onload = () => {
  const mainBox = document.querySelector('.message-box');
  const pitch = document.getElementById('pitch-status');
  const yaw = document.getElementById('yaw-status');
  const gate = document.getElementById('gate-status');
  const limit = document.getElementById('limit-status');

  setTimeout(() => {
    mainBox.classList.add('animate');
    setTimeout(() => {
      yaw.classList.add('visible');
      setTimeout(() => gate.classList.add('visible'), 200);
      setTimeout(() => limit.classList.add('visible'), 400);
    }, 600);
  }, 1000);
};

eel.expose(updateStatus);
function updateStatus(id) {
const box = document.getElementById(id);
if (box) {
  box.style.backgroundColor = "#32EC94";
  box.querySelector('.right-label').innerText = "Connected";
}
}

eel.expose(updateStatusFailure);
function updateStatusFailure(id) {
const box = document.getElementById(id);
if (box) {
  box.querySelector('.right-label').innerText = "Connection Failed";
}
}

eel.expose(showInitFailureUI);
function showInitFailureUI() {
document.getElementById("init-status")?.classList.add("visible");
document.getElementById("description")?.classList.add("visible");
document.getElementById("button-cluster")?.classList.add("visible");
}

eel.expose(showInitSuccessUI);
function showInitSuccessUI() {
const description = document.getElementById("description");
if (description) {
  description.innerText = "We're setting everything up for you. Don't worry, your program will start automatically.";
}
document.querySelectorAll(".fade-target-2").forEach(el => el.classList.add("visible"));

const yawBox = document.getElementById("yaw-status");
const pitchBox = document.getElementById("pitch-status");
const gateBox = document.getElementById("gate-status");

if (yawBox) {
  yawBox.style.backgroundColor = "#32EC94";
  yawBox.querySelector('.right-label').innerText = "Connected";
}
if (pitchBox) {
  pitchBox.style.backgroundColor = "#32EC94";
  pitchBox.querySelector('.right-label').innerText = "Connected";
}
if (gateBox) {
  gateBox.style.backgroundColor = "#32EC94";
  gateBox.querySelector('.right-label').innerText = "Connected";
}

setTimeout(() => {
  if (yawBox) {
    yawBox.style.backgroundColor = "#FFF174";
    yawBox.querySelector('.right-label').innerText = "Zeroing";
  }
  if (pitchBox) {
    pitchBox.style.backgroundColor = "#FFF174";
    pitchBox.querySelector('.right-label').innerText = "Queued";
  }
  if (gateBox) {
    gateBox.style.backgroundColor = "#FFF174";
    gateBox.querySelector('.right-label').innerText = "Queued";
  }
}, 1000);
}

eel.expose(markAsZeroed);
function markAsZeroed(id) {
const box = document.getElementById(id);
if (box) {
  box.style.backgroundColor = "#32EC94";
  box.querySelector('.right-label').innerText = "Zeroed";
}
}

eel.expose(markAsZeroing);
function markAsZeroing(id) {
const box = document.getElementById(id);
if (box) {
  box.style.backgroundColor = "#FFF174";
  box.querySelector('.right-label').innerText = "Zeroing";
}
}

eel.expose(fadeAllOut);
function fadeAllOut() {
const sequence = [
  { id: "init-status", mode: "x" },
  { id: "pitch-status", mode: "x" },
  { id: "yaw-status", mode: "xy" },
  { id: "gate-status", mode: "xy" },
  { id: "limit-status", mode: "xy" },
  { id: "description", mode: "x" },
  { id: "loader", mode: "x" }
];

sequence.forEach((item, i) => {
  const el = document.getElementById(item.id) || document.querySelector(`.${item.id}`);
  if (el) {
    setTimeout(() => {
      if (item.mode === "x") el.classList.add("fade-up-out-centered-x");
      else if (item.mode === "xy") el.classList.add("fade-up-out-centered-xy");
      else el.classList.add("fade-up-out");
    }, i * 200);
  }
});

const overlayElement = document.querySelector(".overlay");
if (overlayElement) {
  const totalDelay = sequence.length * 200 + 200;
  setTimeout(() => {
    overlayElement.classList.add("fade-out");
    setTimeout(() => {
      overlayElement.style.display = "none";
      fadeInMainUI();
    }, 600);
  }, totalDelay);
}
}

eel.expose(showMainUI);

function showMainUI() {
  const elements = [
    "#graph-preview",
    "#diagnostic",
    "#settings",
    "#manual",
    ".configuration-container"
  ];

  elements.forEach((selector, i) => {
    const el = document.querySelector(selector);
    if (el) {
      setTimeout(() => {
        el.classList.add("visible");
      }, i * 200); // staggered delay
    }
  });
}


function fadeInMainUI() {
  const mainElements = [
    "graph-preview",
    "diagnostic",
    "settings",
    "manual",
    "configuration-container"
  ];
  mainElements.forEach((id, index) => {
    const el = document.getElementById(id) || document.querySelector(`.${id}`);
    if (el) {
      el.classList.add("fade-up-in");
      el.style.animationDelay = `${index * 200}ms`;
    }
  });
}

// Global variable to track current view mode
window.currentViewMode = 'free-look';

function initModeSelector() {
  const modeOptions = document.querySelectorAll('.mode-selector .mode-option');
  const slider = document.querySelector('.mode-selector .slider');
  
  modeOptions.forEach((option, index) => {
    option.addEventListener('click', () => {
      // Calculate the new slider position
      const sliderWidth = 100 / 3;
      slider.style.left = `${5 + index * sliderWidth}px`;
      
      // Update active class
      modeOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      
      // Update global variable
      window.currentViewMode = option.dataset.mode;
      
      // Optional: Trigger an event that other functions can listen for
      const event = new CustomEvent('viewModeChanged', { 
        detail: { mode: window.currentViewMode } 
      });
      document.dispatchEvent(event);
    });
  });
}

// Initialize the mode selector when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initModeSelector);

// Get current view mode (for other functions to use)
function getCurrentViewMode() {
  return window.currentViewMode;
}

document.querySelector('.action-button .create-icon')?.parentElement.addEventListener('click', () => {
  const spreadsheet = document.getElementById("config-spreadsheet");
  const placeholderText = document.querySelector(".no-config-text");

  // Hide old message, show table
  if (spreadsheet && placeholderText) {
    placeholderText.style.display = "none";
    spreadsheet.style.display = "block";

    // Optional: Change background to white
    document.querySelector(".configuration-placeholder").style.backgroundColor = "#ffffff";
  }
});

document.querySelector('.action-button .import-icon')?.parentElement.addEventListener('click', () => {
  const fileInput = document.getElementById('import-file-input');
  if (fileInput) {
    fileInput.click();
  }
});

document.getElementById('import-file-input')?.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  if (!file.name.endsWith('.csv')) {
    alert("Please select a .csv file.");
    return;
  }

  console.log("Selected CSV file:", file.name);

  // You can send it to Python here if needed:
  // eel.process_imported_file(file.name);
});

