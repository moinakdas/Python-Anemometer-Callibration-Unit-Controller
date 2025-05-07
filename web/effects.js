window.onload = () => {
    const mainBox = document.querySelector('.message-box');
    const pitch = document.getElementById('pitch-status');
    const yaw = document.getElementById('yaw-status');
    const gate = document.getElementById('gate-status');
    const limit = document.getElementById('limit-status');
  
    // Step 1: Animate main box after 1s
    setTimeout(() => {
      mainBox.classList.add('animate');
  
      // Step 2: Fade in status boxes after the top animation
      setTimeout(() => {
        yaw.classList.add('visible');
        setTimeout(() => gate.classList.add('visible'), 200);
        setTimeout(() => limit.classList.add('visible'), 400);
      }, 600); // Start fading in status boxes after .message-box finishes
    }, 1000);
  };
  
  eel.expose(updateStatus);
  function updateStatus(id) {
    const box = document.getElementById(id);
    if (box) {
      box.style.backgroundColor = "#32EC94"; // green
      box.querySelector('.right-label').innerText = "Connected";
    }
  }

  eel.expose(updateStatusFailure);
  function updateStatusFailure(id) {
    const box = document.getElementById(id);
    if (box) {
        box.querySelector('.right-label').innerText = "Connection Failed";
        // Don't change background color
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
    // Step 1: Update description text
    const description = document.getElementById("description");
    if (description) {
      description.innerText = "We're setting everything up for you. Don't worry, your program will start automatically.";
    }
  
    // Step 2: Fade in all .fade-target-2 elements
    const targets = document.querySelectorAll(".fade-target-2");
    targets.forEach(el => el.classList.add("visible"));
  
    // Step 3: Set all 3 motors to green + "Connected"
    const yawBox = document.getElementById("yaw-status");
    const pitchBox = document.getElementById("pitch-status");
    const gateBox = document.getElementById("gate-status");
  
    if (yawBox) {
      yawBox.style.backgroundColor = "#32EC94"; // green
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
  
    // Step 4: After 2s, start zeroing process (first motor)
    setTimeout(() => {
      if (yawBox) {
        yawBox.style.backgroundColor = "#FFF174"; // yellow
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
      box.style.backgroundColor = "#32EC94"; // green
      box.querySelector('.right-label').innerText = "Zeroed";
    }
  }

  eel.expose(markAsZeroing);
  function markAsZeroing(id) {
    const box = document.getElementById(id);
    if (box) {
      box.style.backgroundColor = "#FFF174"; // yellow
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
  
    // Animate each element out with staggered delay
    sequence.forEach((item, i) => {
      const el = document.getElementById(item.id) || document.querySelector(`.${item.id}`);
      if (el) {
        setTimeout(() => {
          if (item.mode === "x") {
            el.classList.add("fade-up-out-centered-x");
          } else if (item.mode === "xy") {
            el.classList.add("fade-up-out-centered-xy");
          } else {
            el.classList.add("fade-up-out");
          }
        }, i * 200);
      }
    });
  
    // Fade out the overlay after all elements begin animating
    const overlayElement = document.querySelector(".overlay");
    if (overlayElement) {
      const totalDelay = sequence.length * 200 + 200; // wait a bit more after last item
      setTimeout(() => {
        overlayElement.classList.add("fade-out");
        setTimeout(() => {
          overlayElement.style.display = "none";
        }, 600); // match fadeOutOverlay animation duration
      }, totalDelay);
    }
  }
  

  
  