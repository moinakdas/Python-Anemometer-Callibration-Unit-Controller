import subprocess
import eel
import os
import threading

# Initialize Eel
web_folder = os.path.abspath("web")
eel.init(web_folder)

# Start Eel in a background thread
def launch_eel():
    eel.start("index.html", mode='chrome', size=(700, 300), block=True)

eel_thread = threading.Thread(target=launch_eel)
eel_thread.daemon = True
eel_thread.start()

# Now the rest of your Python script can continue
# while the frontend stays alive

# Start MATLAB and run the script, capturing output as it comes
process = subprocess.Popen(
    ["matlab", "-batch", "run('main.m')"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1  # Line-buffered
)

print("Streaming MATLAB output:")

# Read and print output line by line as it appears
for line in process.stdout:
    line = line.strip()
    print("MATLAB:", line)

process.wait()
print("MATLAB script finished.")

# Optional: keep the program alive until frontend is closed
eel_thread.join()
