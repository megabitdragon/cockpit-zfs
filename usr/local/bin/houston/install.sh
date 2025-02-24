#!/bin/bash

echo "[INFO] Starting Houston System Installation..."

# Ensure script is run as root
if [ "$(id -u)" -ne 0 ]; then
    echo "[ERROR] This script must be run as root. Use sudo."
    exit 1
fi

# Run setup scripts
bash ./setup_packages.sh
bash ./setup_python.sh
bash ./setup_services.sh
bash ./setup_zed.sh

echo "[SUCCESS] Installation complete!"
