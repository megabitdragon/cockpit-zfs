#!/bin/bash

echo "[INFO] Installing Python dependencies..."

pip3 install --upgrade pip
pip3 install uvicorn fastapi sqlite3

echo "[INFO] Verifying installations..."
pip3 --version
sqlite3 --version
uvicorn --version

echo "[SUCCESS] Python dependencies installed!"
