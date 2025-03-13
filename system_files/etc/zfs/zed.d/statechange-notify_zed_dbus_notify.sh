#!/bin/bash

# Path to the D-Bus client script
DBUS_CLIENT="/opt/45drives/houston/houston-notify"

# Extract all event data
EVENT_CLASS="${ZEVENT_SUBCLASS:-Unknown}"
EVENT_POOL="${ZEVENT_POOL:-Unknown}"
EVENT_VDEV="${ZEVENT_VDEV_PATH:-Unknown}"
EVENT_STATE="${ZEVENT_VDEV_STATE_STR:-Unknown}"
EVENT_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')  # Human-readable timestamp

# Construct JSON message
MESSAGE=$(jq -n \
  --arg timestamp "$EVENT_TIMESTAMP" \
  --arg event "$EVENT_CLASS" \
  --arg pool "$EVENT_POOL" \
  --arg vdev "$EVENT_VDEV" \
  --arg state "$EVENT_STATE" \
  '{timestamp: $timestamp, event: $event, pool: $pool, vdev: $vdev, state: $state}')

# Send the message to D-Bus
python3 "$DBUS_CLIENT" forward "$FORWARD_MESSAGE"

python3 "$DBUS_CLIENT" email "$EMAIL_SUBJECT" "$EMAIL_MESSAGE"
