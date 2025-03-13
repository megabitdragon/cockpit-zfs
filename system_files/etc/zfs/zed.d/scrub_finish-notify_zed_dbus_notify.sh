#!/bin/bash

# Path to the D-Bus client script
DBUS_CLIENT="/opt/45drives/houston/houston-notify"

# Extract ZFS event details
EVENT_CLASS="${ZEVENT_SUBCLASS:-Unknown}"  # Expected to be 'data_notify'
EVENT_POOL="${ZEVENT_POOL:-Unknown}"
EVENT_STATE="${ZEVENT_POOL_HEALTH:-Unknown}"  # Pool-wide health
EVENT_ERRORS="${ZEVENT_ERRORS:-0}"  # Number of errors detected
EVENT_POOL_GUID="${ZEVENT_POOL_GUID:-Unknown}"
EVENT_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')  # Use current time

# Construct JSON message for forwarding to Houston UI
FORWARD_MESSAGE=$(jq -n \
  --arg timestamp "$EVENT_TIMESTAMP" \
  --arg event "$EVENT_CLASS" \
  --arg pool "$EVENT_POOL" \
  --arg state "$EVENT_STATE" \
  --arg pool_guid "$EVENT_POOL_GUID" \
  --argjson errors "$EVENT_ERRORS" \
  '{timestamp: $timestamp, event: $event, pool: $pool, state: $state, pool_guid: $pool_guid, errors: $errors}')

# Construct Subject & Message for Email Notification
EMAIL_SUBJECT="ZFS Alert: $EVENT_POOL - $EVENT_CLASS"
EMAIL_MESSAGE="Timestamp: $EVENT_TIMESTAMP\nPool: $EVENT_POOL\nState: $EVENT_STATE\nErrors: $EVENT_ERRORS\nGUID: $EVENT_POOL_GUID"


# ✅ Step 1: Forward Message to Houston D-Bus
python3 "$DBUS_CLIENT" forward "$FORWARD_MESSAGE"

# ✅ Step 2: Send Email Notification via D-Bus
python3 "$DBUS_CLIENT" email "$EMAIL_SUBJECT" "$EMAIL_MESSAGE"
