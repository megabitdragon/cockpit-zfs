#!/bin/bash

# Path to the D-Bus client script
DBUS_CLIENT="/opt/45drives/houston/houston-notify"
DEBUG_LOG="/tmp/zed_debug.log"

# Extract ZFS event details
EVENT_CLASS="${ZEVENT_SUBCLASS:-Unknown}"  # Expected to be 'statechange'
EVENT_POOL="${ZEVENT_POOL:-Unknown}"
EVENT_VDEV="${ZEVENT_VDEV_PATH:-Unknown}"
EVENT_STATE="${ZEVENT_VDEV_STATE_STR:-Unknown}"
EVENT_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')  # Human-readable timestamp
EVENT_HOST=$(hostname)
EVENT_VPHYS="${ZEVENT_VDEV_PHYSPATH:-Unknown}"
EVENT_VGUID="${ZEVENT_VDEV_GUID:-Unknown}"
EVENT_DEVID="${ZEVENT_VDEV_DEVID:-Unknown}"

# Ensure EVENT_POOL is set (required for valid notifications)
if [[ "$EVENT_POOL" == "Unknown" ]]; then
    echo "[ERROR] Missing EVENT_POOL - Notification aborted" >> "$DEBUG_LOG"
    exit 1
fi

# Generate a detailed impact statement and recommended actions based on the event state
case "$EVENT_STATE" in
  "FAULTED")
    IMPACT_MESSAGE="A disk in your ZFS pool has encountered multiple I/O errors and is now marked as FAULTED. Immediate action is required."
    RECOMMENDATION="Replace the affected drive as soon as possible to prevent data loss and restore pool redundancy."
    URGENCY="CRITICAL"
    ;;
  "DEGRADED")
    IMPACT_MESSAGE="A disk in your ZFS pool has reported too many checksum errors and is now DEGRADED. Pool redundancy may be compromised."
    RECOMMENDATION="Consider replacing the affected drive to restore redundancy and prevent potential data corruption."
    URGENCY="WARNING"
    ;;
  "REMOVED")
    IMPACT_MESSAGE="A disk has been REMOVED from your ZFS pool. If this was not intentional, immediate investigation is required."
    RECOMMENDATION="Verify the disk connection, check if it was manually removed, and ensure the pool remains functional."
    URGENCY="WARNING"
    ;;
  "UNAVAIL")
    IMPACT_MESSAGE="A disk in your ZFS pool is UNAVAILABLE. This could be due to hardware failure, a disconnected drive, or cabling issues."
    RECOMMENDATION="Ensure the disk is properly connected, check for hardware issues, and verify the pool status."
    URGENCY="ERROR"
    ;;
  *)
    IMPACT_MESSAGE="A state change was detected in your ZFS pool."
    RECOMMENDATION="Check the pool status for further details and investigate any potential issues."
    URGENCY="NOTICE"
    ;;
esac


# Construct Subject & User-Friendly Email Message
EMAIL_SUBJECT="ZFS ALERT: $EVENT_POOL - $EVENT_STATE ($URGENCY)"

EMAIL_MESSAGE=$(cat <<EOF
====================================================
ZFS ALERT - POOL: $EVENT_POOL
====================================================

$IMPACT_MESSAGE
This may impact the reliability of your storage pool. Please take immediate action to investigate and resolve the issue.

----------------------------------------------------
Affected Device Details
----------------------------------------------------
- Pool Name: $EVENT_POOL
- Device Path: $EVENT_VDEV
- Physical Location: $EVENT_VPHYS
- Device ID: $EVENT_DEVID
- Device GUID: $EVENT_VGUID

----------------------------------------------------
Recommended Actions
----------------------------------------------------
1. Check the ZFS pool status to assess the current condition of the affected device:
   
   zpool status $EVENT_POOL

2. If the device is faulted or degraded, consider replacing it:

   zpool offline $EVENT_POOL $EVENT_VDEV
   zpool replace $EVENT_POOL $EVENT_VDEV

3. Ensure all drives are properly connected if the device is marked as REMOVED or UNAVAILABLE.
   - Check the physical connection of the drive.
   - Re-seat the cable or move the drive to another port if needed.

4. If the drive has been removed manually, verify if it was intentional and take appropriate action.

5. Check recent system logs for additional information:

   journalctl -u zfs-zed -n 50 --no-pager

----------------------------------------------------
Additional Information
----------------------------------------------------
- Hostname: $EVENT_HOST
- Event Type: $EVENT_CLASS
- State Change Detected: $EVENT_STATE
- Timestamp: $EVENT_TIMESTAMP

For further troubleshooting and guidance, refer to ZFS documentation or your storage management team.
EOF
)


# Construct JSON message for forwarding to Houston UI
FORWARD_MESSAGE=$(jq -n \
  --arg timestamp "$EVENT_TIMESTAMP" \
  --arg event "$EVENT_CLASS" \
  --arg pool "$EVENT_POOL" \
  --arg vdev "$EVENT_VDEV" \
  --arg state "$EVENT_STATE" \
  --arg vphys "$EVENT_VPHYS" \
  --arg vguid "$EVENT_VGUID" \
  --arg devid "$EVENT_DEVID" \
  --arg subject "$EMAIL_SUBJECT" \
  --arg email_message "$EMAIL_MESSAGE" \
  '{timestamp: $timestamp, event: $event, pool: $pool, vdev: $vdev, state: $state, vphys: $vphys, vguid: $vguid, devid: $devid,subject: $subject, email_message: $email_message}')


# Logging event details for debugging
{
  echo "==== DEBUG START ===="
  echo "DEBUG: Timestamp = $EVENT_TIMESTAMP"
  echo "DEBUG: Event Class = $EVENT_CLASS"
  echo "DEBUG: Pool = $EVENT_POOL"
  echo "DEBUG: VDEV = $EVENT_VDEV"
  echo "DEBUG: State = $EVENT_STATE"
  echo "DEBUG: Device ID = $EVENT_DEVID"
  echo "DEBUG: Device GUID = $EVENT_VGUID"
  echo "DEBUG: Physical Path = $EVENT_VPHYS"
  echo "DEBUG: FORWARD_MESSAGE = $FORWARD_MESSAGE"
  echo "DEBUG: EMAIL_SUBJECT = $EMAIL_SUBJECT"
  echo "DEBUG: EMAIL_MESSAGE = $EMAIL_MESSAGE"
  echo "==== DEBUG END ===="
} >> "$DEBUG_LOG"

# Send event notification to Houston UI
python3 "$DBUS_CLIENT" forward "ZFS State Change" "$FORWARD_MESSAGE" >> "$DEBUG_LOG" 2>&1
FORWARD_STATUS=$?


# Log final result
if [ "$FORWARD_STATUS" -eq 0 ]; then
  echo "[SUCCESS] Event successfully forwarded to Houston UI" >> "$DEBUG_LOG"
else
  echo "[ERROR] Failed to forward event to Houston UI" >> "$DEBUG_LOG"
fi



exit 0
