#!/bin/bash

# Path to the D-Bus client script
DBUS_CLIENT="/opt/45drives/houston/houston-notify"

# Extract relevant resilver event data
EVENT_CLASS="${ZEVENT_SUBCLASS:-Unknown}"
EVENT_POOL="${ZEVENT_POOL:-Unknown}"
EVENT_STATE="${ZEVENT_POOL_HEALTH:-Unknown}"  # Pool-wide health
EVENT_ERRORS="${ZEVENT_ERRORS:-0}"
EVENT_POOL_GUID="${ZEVENT_POOL_GUID:-Unknown}"
EVENT_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')  # Always use current time

# Construct JSON message
MESSAGE=$(jq -n \
  --arg timestamp "$EVENT_TIMESTAMP" \
  --arg event "$EVENT_CLASS" \
  --arg pool "$EVENT_POOL" \
  --arg state "$EVENT_STATE" \
  --arg pool_guid "$EVENT_POOL_GUID" \
  --argjson errors "$EVENT_ERRORS" \
  '{timestamp: $timestamp, event: $event, pool: $pool, state: $state, pool_guid: $pool_guid, errors: $errors}')

# Print for debugging (Optional)
echo "Sending JSON: $MESSAGE"

# Send the message to Houston D-Bus service
python3 "$DBUS_CLIENT" "$MESSAGE"
