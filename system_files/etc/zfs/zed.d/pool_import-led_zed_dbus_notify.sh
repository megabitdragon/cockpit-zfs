#!/bin/bash

# Path to the D-Bus client script
DBUS_CLIENT="/opt/45drives/houston/houston-notify"

# Extract event data
EVENT_CLASS="${ZEVENT_SUBCLASS:-Unknown}"  # Should be 'pool_import'
EVENT_POOL="${ZEVENT_POOL:-Unknown}"
EVENT_POOL_GUID="${ZEVENT_POOL_GUID:-Unknown}"
EVENT_STATE="${ZEVENT_POOL_HEALTH:-Unknown}"  # Pool-wide health state
EVENT_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')  # Always use current time

# Construct JSON message
MESSAGE=$(jq -n \
  --arg timestamp "$EVENT_TIMESTAMP" \
  --arg event "$EVENT_CLASS" \
  --arg pool "$EVENT_POOL" \
  --arg state "$EVENT_STATE" \
  --arg pool_guid "$EVENT_POOL_GUID" \
  '{timestamp: $timestamp, event: $event, pool: $pool, state: $state, pool_guid: $pool_guid}')

# Print for debugging (Optional, remove in production)
echo "Sending JSON: $MESSAGE"

# Send the message to Houston D-Bus service
python3 "$DBUS_CLIENT" "$MESSAGE"
