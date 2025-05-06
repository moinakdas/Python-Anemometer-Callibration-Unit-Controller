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