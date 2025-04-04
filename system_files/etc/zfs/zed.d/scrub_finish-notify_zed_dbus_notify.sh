#!/bin/bash

# Path to the D-Bus client script
DBUS_CLIENT="/opt/45drives/houston/houston-notify"
DEBUG_LOG="/tmp/zed_debug.log"

# Extract ZFS event details
EVENT_CLASS="scrub_finish"
EVENT_POOL="${ZEVENT_POOL:-Unknown}"
EVENT_STATE="${ZEVENT_POOL_HEALTH:-Unknown}"
EVENT_ERRORS="${ZEVENT_ERRORS:-0}"
EVENT_REPAIRED="${ZEVENT_REPAIRED:-0}"
EVENT_POOL_GUID="${ZEVENT_POOL_GUID:-Unknown}"
EVENT_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')  # Human-readable timestamp

# Determine message based on errors found during the scrub
if [[ "$EVENT_ERRORS" -gt 0 ]]; then
  IMPACT_MESSAGE="The ZFS scrub process has completed, but errors were detected. Some data may be corrupted or unrecoverable."
  RECOMMENDATION="Please check the pool status and take corrective actions as needed. If data corruption persists, consider restoring from backup."
  URGENCY="WARNING"
else
  IMPACT_MESSAGE="The ZFS scrub process has successfully completed with no errors detected."
  RECOMMENDATION="No immediate action required. Regular scrubs help maintain data integrity."
  URGENCY="SUCCESS"
fi

# Construct Subject & User-Friendly Email Message
EMAIL_SUBJECT="ZFS Scrub Completed: Pool $EVENT_POOL - $URGENCY"
EMAIL_MESSAGE=$(cat <<EOF
====================================================
ZFS SCRUB COMPLETION REPORT - POOL: $EVENT_POOL
====================================================

$IMPACT_MESSAGE

----------------------------------------------------
Scrub Details
----------------------------------------------------
- Pool Name: $EVENT_POOL
- Pool GUID: $EVENT_POOL_GUID
- Pool State: $EVENT_STATE
- Errors Found: $EVENT_ERRORS
- Errors Repaired: $EVENT_REPAIRED
- Timestamp: $EVENT_TIMESTAMP

----------------------------------------------------
Recommended Actions
----------------------------------------------------
1. Check the detailed scrub report using:

   zpool status $EVENT_POOL

2. If errors were found:
   - Investigate potential disk failures.
   - Consider replacing any degraded or failing drives.
   - Verify data integrity using backups if necessary.

3. If all is well:
   - No immediate action required.
   - Continue monitoring the pool for future issues.

For further details, refer to system logs or ZFS documentation.
EOF
)

# Construct JSON message for forwarding to Houston UI
FORWARD_MESSAGE=$(jq -n \
  --arg timestamp "$EVENT_TIMESTAMP" \
  --arg event "$EVENT_CLASS" \
  --arg pool "$EVENT_POOL" \
  --arg state "$EVENT_STATE" \
  --arg pool_guid "$EVENT_POOL_GUID" \
  --argjson errors "$EVENT_ERRORS" \
  --argjson repaired "$EVENT_REPAIRED" \
  --arg subject "$EMAIL_SUBJECT" \
  --arg email_message "$EMAIL_MESSAGE" \
  '{timestamp: $timestamp, event: $event, pool: $pool, state: $state, pool_guid: $pool_guid, errors: $errors, repaired: $repaired, subject: $subject, email_message: $email_message}')

# Log all the data (for debug)
{
  echo "==== DEBUG START ===="
  echo "DEBUG: Timestamp = $EVENT_TIMESTAMP"
  echo "DEBUG: Event Class = $EVENT_CLASS"
  echo "DEBUG: Pool = $EVENT_POOL"
  echo "DEBUG: State = $EVENT_STATE"
  echo "DEBUG: Pool GUID = $EVENT_POOL_GUID"
  echo "DEBUG: Errors Found = $EVENT_ERRORS"
  echo "DEBUG: Errors Repaired = $EVENT_REPAIRED"
  echo "DEBUG: FORWARD_MESSAGE = $FORWARD_MESSAGE"
  echo "DEBUG: EMAIL_SUBJECT = $EMAIL_SUBJECT"
  echo "DEBUG: EMAIL_MESSAGE = $EMAIL_MESSAGE"
  echo "==== DEBUG END ===="
} >> "$DEBUG_LOG"

# Send the message to Houston D-Bus listener
python3 "$DBUS_CLIENT" "$FORWARD_MESSAGE" >> "$DEBUG_LOG" 2>&1
STATUS=$?

# Final result
if [ "$STATUS" -eq 0 ]; then
  echo "[SUCCESS] Scrub event forwarded to Houston UI" >> "$DEBUG_LOG"
else
  echo "[ERROR] Failed to forward scrub event to Houston UI" >> "$DEBUG_LOG"
fi

exit 0
