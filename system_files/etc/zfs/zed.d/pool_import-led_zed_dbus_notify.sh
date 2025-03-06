#!/bin/bash

# ✅ Log that the script was triggered
echo "ZED TRIGGERED: $(date)"

# ✅ Log all environment variables passed by ZED
env | sort

# Path to the D-Bus client script
DBUS_CLIENT="/opt/45drives/houston/houston-notify"

# Extract available event data
EVENT_CLASS="${ZEVENT_CLASS:-Unknown}"       # Top-level event category (e.g., EC_pool, EC_dev)
EVENT_SUBCLASS="${ZEVENT_SUBCLASS:-Unknown}" # More specific event type (e.g., pool_import, dev_fault)
EVENT_POOL="${ZEVENT_POOL:-Unknown}"         # Pool name
EVENT_POOL_GUID="${ZEVENT_POOL_GUID:-Unknown}" # Unique pool identifier

# ✅ Fix: Use `ZEVENT_POOL_STATE_STR` instead of `ZEVENT_POOL_STATE`
EVENT_HEALTH="${ZEVENT_POOL_STATE_STR:-Unknown}"

EVENT_VDEV="${ZEVENT_VDEV_PATH:-Unknown}"  # VDEV path (if applicable)
EVENT_VDEV_GUID="${ZEVENT_VDEV_GUID:-Unknown}"  # VDEV unique identifier
EVENT_VDEV_STATE="${ZEVENT_VDEV_STATE:-Unknown}"  # VDEV state (e.g., DEGRADED, FAULTED)

EVENT_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')  # Capture timestamp

# ✅ Log extracted values
echo "Extracted Data: CLASS=$EVENT_CLASS, SUBCLASS=$EVENT_SUBCLASS, POOL=$EVENT_POOL, HEALTH=$EVENT_HEALTH, VDEV=$EVENT_VDEV, VDEV_STATE=$EVENT_VDEV_STATE"

# ✅ Construct JSON message
MESSAGE=$(echo '{}' | jq --compact-output \
  --arg timestamp "$EVENT_TIMESTAMP" \
  --arg class "$EVENT_CLASS" \
  --arg subclass "$EVENT_SUBCLASS" \
  --arg event "$EVENT_SUBCLASS" \
  --arg pool "$EVENT_POOL" \
  --arg health "$EVENT_HEALTH" \
  --arg pool_guid "$EVENT_POOL_GUID" \
  --arg vdev "$EVENT_VDEV" \
  --arg vdev_guid "$EVENT_VDEV_GUID" \
  --arg vdev_state "$EVENT_VDEV_STATE" \
  '.timestamp=$timestamp | .class=$class | .subclass=$subclass | .event=$event | .pool=$pool | .health=$health | .pool_guid=$pool_guid | .vdev=$vdev | .vdev_guid=$vdev_guid | .vdev_state=$vdev_state')

# ✅ Check if MESSAGE is valid
if [ -z "$MESSAGE" ] || [ "$MESSAGE" == "null" ]; then
  echo "❌ Error: Failed to construct JSON message"
  exit 1
fi

# ✅ Debugging: Log the JSON message before sending
echo "Generated JSON: $MESSAGE"

# ✅ Send to Houston DBus
python3 "$DBUS_CLIENT" "$MESSAGE"
