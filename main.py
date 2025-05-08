import subprocess
import eel
import os
import threading
import time

# Initialize Eel with the 'web' folder
web_folder = os.path.abspath("web")
eel.init(web_folder)
scale = 0.8
width,height = 1920*scale,1080*scale

# Start Eel frontend in fullscreen Chrome app mode
def launch_eel():
    eel.start(
        "index.html",
        mode='chrome',
        size=(width,height),
        block=True
    )

# Run Eel in a separate thread so Python can keep working
eel_thread = threading.Thread(target=launch_eel)
eel_thread.daemon = True
eel_thread.start()

# Define matching logic from MATLAB output to HTML element IDs
def match_line_to_status_id(line):
    if "Yaw motor initialization SUCCESS" in line:
        return "yaw-status"
    elif "Pitch motor initialization SUCCESS" in line:
        return "pitch-status"
    elif "Gate motor initialization SUCCESS" in line:
        return "gate-status"
    elif "Interface initialization SUCCESS" in line:
        return "limit-status"
    return None

def match_line_to_failure_id(line):
    if "Yaw motor initialization FAILED" in line:
        return "yaw-status"
    elif "Pitch motor initialization FAILED" in line:
        return "pitch-status"
    elif "Gate motor initialization FAILED" in line:
        return "gate-status"
    elif "Interface initialization FAILED" in line:
        return "limit-status"
    return None

def extract_zeroed_component(line):
    if "Yaw motor zeroed" in line:
        return "yaw-status"
    elif "Pitch motor zeroed" in line:
        return "pitch-status"
    elif "Gate motor zeroed" in line:
        return "gate-status"
    return None


zeroing_order = ["pitch-status", "yaw-status", "gate-status"]
zeroing_index = 0

# Start MATLAB and stream its output line by line
process = subprocess.Popen(
    ["matlab", "-batch", "run('main.m')"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1
)

@eel.expose
def send_start_command(val):
    with open("start_flag.txt", "w") as f:
        f.write(str(val))

for line in process.stdout:
    line = line.strip()
    print("MATLAB:", line)

    # Handle success case
    status_id = match_line_to_status_id(line)
    if status_id:
        eel.updateStatus(status_id)

    # Handle failure case
    failure_id = match_line_to_failure_id(line)
    if failure_id:
        eel.updateStatusFailure(failure_id)

    if "[INIT FAIL]" in line:
        eel.showInitFailureUI()

    if "[INIT SUCCESS]" in line:
        eel.showInitSuccessUI()

    zeroed_id = extract_zeroed_component(line)
    if zeroed_id:
        eel.markAsZeroed(zeroed_id)

        # Determine next motor in the sequence
        zeroing_index += 1
        if zeroing_index < len(zeroing_order):
            next_id = zeroing_order[zeroing_index]
            eel.markAsZeroing(next_id)
    
    if "[LOCALIZATION SUCCESS]" in line:
        eel.fadeAllOut()
        time.sleep(2)
        eel.showMainUI()

process.wait()
print("MATLAB script finished.")

# Keep the app alive until the frontend is closed
eel_thread.join()
