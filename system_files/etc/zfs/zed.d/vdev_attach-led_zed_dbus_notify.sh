#!/bin/bash

# Path to the D-Bus client script
DBUS_CLIENT="/opt/45drives/houston/houston-notify"

# Extract event data (Relevant for vdev attach events)
EVENT_CLASS="${ZEVENT_SUBCLASS:-Unknown}"
EVENT_POOL="${ZEVENT_POOL:-Unknown}"
EVENT_VDEV="${ZEVENT_VDEV_PATH:-Unknown}"
EVENT_STATE="${ZEVENT_VDEV_STATE_STR:-Unknown}"
EVENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')  # Use current timestamp
EVENT_POOL_GUID="${ZEVENT_POOL_GUID:-Unknown}"
EVENT_VDEV_GUID="${ZEVENT_VDEV_GUID:-Unknown}"

# Construct JSON message (Ensuring correct formatting)
MESSAGE=$(jq -n \
  --arg timestamp "$EVENT_TIME" \
  --arg event "$EVENT_CLASS" \
  --arg pool "$EVENT_POOL" \
  --arg vdev "$EVENT_VDEV" \
  --arg state "$EVENT_STATE" \
  --arg pool_guid "$EVENT_POOL_GUID" \
  --arg vdev_guid "$EVENT_VDEV_GUID" \
  '{timestamp: $timestamp, event: $event, pool: $pool, vdev: $vdev, state: $state, pool_guid: $pool_guid, vdev_guid: $vdev_guid}')

# Print for debugging (Optional: Remove once confirmed working)
echo "Sending JSON: $MESSAGE"

# Send the message to Houston D-Bus service
python3 "$DBUS_CLIENT" "$MESSAGE"
