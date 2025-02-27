#!/bin/bash

# Path to the D-Bus client script
DBUS_CLIENT="/opt/45drives/houston/houston-notify"

# Extract event data
EVENT_CLASS="${ZEVENT_SUBCLASS:-Unknown}"
EVENT_POOL="${ZEVENT_POOL:-Unknown}"
EVENT_VDEV="${ZEVENT_VDEV_PATH:-Unknown}"

# Construct message
MESSAGE="ZFS Event: $EVENT_CLASS | Pool: $EVENT_POOL

# Send to Houston D-Bus service
python3 "$DBUS_CLIENT" "$MESSAGE"
