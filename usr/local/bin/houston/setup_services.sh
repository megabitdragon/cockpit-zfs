#!/bin/bash

echo "[INFO] Setting up system services..."

# Enable and start Sendmail
echo "[INFO] Enabling sendmail..."
sudo systemctl enable sendmail
sudo systemctl start sendmail

# Enable and start Houston-DBus
if [ -f "/etc/systemd/system/houston-dbus.service" ]; then
    echo "[INFO] Enabling and starting Houston-DBus..."
    sudo systemctl enable houston-dbus
    sudo systemctl restart houston-dbus
else
    echo "[WARNING] Houston-DBus service file not found!"
fi

# Enable and start FastAPI if it exists
if [ -f "/etc/systemd/system/fastapi.service" ]; then
    echo "[INFO] Enabling and starting FastAPI..."
    sudo systemctl enable fastapi
    sudo systemctl restart fastapi
else
    echo "[WARNING] FastAPI service file not found!"
fi

echo "[INFO] Service setup complete!"
