#!/bin/bash

echo "[INFO] Installing required system packages..."

if command -v apt > /dev/null; then
    sudo apt update -y
    sudo apt install -y mailutils sendmail sqlite3 python3-pip python3-venv
elif command -v yum > /dev/null; then
    sudo yum install -y mailx sendmail sqlite python3-pip python3-virtualenv
elif command -v dnf > /dev/null; then
    sudo dnf install -y mailx sendmail sqlite python3-pip python3-virtualenv
elif command -v zypper > /dev/null; then
    sudo zypper install -y mailx sendmail sqlite3 python3-pip python3-virtualenv
else
    echo "[ERROR] Unsupported package manager. Install dependencies manually."
    exit 1
fi

echo "[INFO] System package installation complete!"
