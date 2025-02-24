#!/bin/bash

echo "[INFO] Making all 'dbus' ZED scripts executable and executing them..."

ZED_DIR="/etc/zfs/zed.d/"

# Ensure the directory exists
if [ ! -d "$ZED_DIR" ]; then
    echo "[ERROR] ZED actions directory does not exist! Exiting."
    exit 1
fi

# Set execute permissions and execute scripts with "dbus" in their name
for script in "$ZED_DIR"/*dbus*.sh; do
    if [ -f "$script" ]; then
        echo "[INFO] Found script: $script - setting execute permissions..."
        sudo chmod +x "$script"

        echo "[INFO] Executing: $script ..."
        sudo "$script"
    else
        echo "[WARNING] No matching 'dbus' scripts found in $ZED_DIR."
    fi
done

# Restart ZED service to apply changes
echo "[INFO] Restarting ZED service..."
sudo systemctl restart zfs-zed

echo "[SUCCESS] All 'dbus' ZED scripts have been executed and ZED service is restarted!"
