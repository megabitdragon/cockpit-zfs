#!/bin/bash

# Path to the D-Bus client script
DBUS_CLIENT="/opt/45drives/houston/houston-notify"

# Extract ZFS event details
EVENT_CLASS="${ZEVENT_SUBCLASS:-Unknown}"  # Expected to be 'statechange'
EVENT_POOL="${ZEVENT_POOL:-Unknown}"
EVENT_VDEV="${ZEVENT_VDEV_PATH:-Unknown}"
EVENT_STATE="${ZEVENT_VDEV_STATE_STR:-Unknown}"
EVENT_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')  # Use current time

# Construct JSON message for forwarding to Houston UI
FORWARD_MESSAGE=$(jq -n \
  --arg timestamp "$EVENT_TIMESTAMP" \
  --arg event "$EVENT_CLASS" \
  --arg pool "$EVENT_POOL" \
  --arg vdev "$EVENT_VDEV" \
  --arg state "$EVENT_STATE" \
  '{timestamp: $timestamp, event: $event, pool: $pool, vdev: $vdev, state: $state}')

# Construct Subject & Message for Email Notification
EMAIL_SUBJECT="ZFS State Change Alert: $EVENT_POOL - $EVENT_STATE"
EMAIL_MESSAGE=$(cat <<EOF
Timestamp: $EVENT_TIMESTAMP
Event: $EVENT_CLASS
Pool: $EVENT_POOL
VDEV: $EVENT_VDEV
State: $EVENT_STATE
EOF
)

# 📝 Debugging Log (Save event details for troubleshooting)
DEBUG_LOG="/tmp/zed_debug.log"
{
  echo "==== DEBUG START ===="
  echo "DEBUG: Timestamp = $EVENT_TIMESTAMP"
  echo "DEBUG: Event Class = $EVENT_CLASS"
  echo "DEBUG: Pool = $EVENT_POOL"
  echo "DEBUG: VDEV = $EVENT_VDEV"
  echo "DEBUG: State = $EVENT_STATE"
  echo "DEBUG: FORWARD_MESSAGE = $FORWARD_MESSAGE"
  echo "DEBUG: EMAIL_SUBJECT = $EMAIL_SUBJECT"
  echo "DEBUG: EMAIL_MESSAGE = $EMAIL_MESSAGE"
  echo "==== DEBUG END ===="
} >> "$DEBUG_LOG"

# ✅ Send event notification to Houston UI (fixed argument structure)
python3 "$DBUS_CLIENT" forward "ZFS State Change" "$FORWARD_MESSAGE" >> "$DEBUG_LOG" 2>&1

# ✅ Send email notification
python3 "$DBUS_CLIENT" email "$EMAIL_SUBJECT" "$EMAIL_MESSAGE"
