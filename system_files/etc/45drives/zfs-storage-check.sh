#!/bin/bash

THRESHOLD=${THRESHOLD:-80}
DBUS_CLIENT="/opt/45drives/houston/houston-notify"
LOG_FILE="/tmp/zfs_storage_alert.log"
STATE_FILE="/var/lib/45drives/zfs_alert_state.json"

mkdir -p "$(dirname "$STATE_FILE")"
exec >> "$LOG_FILE" 2>&1

echo "---- $(date) ----"

# Load previous alert state
declare -A ALERTED
if [ -f "$STATE_FILE" ]; then
  while IFS= read -r line; do
    key=$(echo "$line" | cut -d= -f1)
    value=$(echo "$line" | cut -d= -f2)
    ALERTED["$key"]="$value"
  done < <(jq -r 'to_entries[] | "\(.key)=\(.value)"' "$STATE_FILE")
fi

# Use a process substitution to keep array scope valid
declare -A NEW_STATE
while read -r pool cap; do
    cap_val=${cap%%%}  # Remove trailing %
    echo "[INFO] Checking pool '$pool': $cap used (threshold: $THRESHOLD%)"

    was_alerted=${ALERTED[$pool]:-0}

    if [ "$cap_val" -ge "$THRESHOLD" ]; then
        if [ "$was_alerted" -eq 0 ]; then
            echo "[ALERT] Pool '$pool' crossed threshold and has not been alerted yet."

            EVENT_CLASS="storage_threshold"
            EVENT_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
            EVENT_UNIXTIME=$(date +%s)
            EVENT_HOST=$(hostname)
            EVENT_POOL="$pool"

            SUBJECT="ZFS Alert: Pool '$pool' Usage High"
            BODY="⚠️ ZFS pool '$pool' is $cap full."
            SEVERITY="warning"
            TYPE="storage"

            EMAIL_MESSAGE=$(cat <<EOF
====================================================
ZFS STORAGE USAGE ALERT - POOL: $EVENT_POOL
====================================================

$BODY

----------------------------------------------------
Pool Details
----------------------------------------------------
- Pool Name: $EVENT_POOL
- Usage: $cap
- Timestamp: $EVENT_TIMESTAMP
- Host: $EVENT_HOST

----------------------------------------------------
Recommended Actions
----------------------------------------------------
1. Run: zpool status $EVENT_POOL
2. Consider freeing space, expanding the pool, or enabling compression.
EOF
)

            FORWARD_MESSAGE=$(jq -n \
              --arg timestamp "$EVENT_TIMESTAMP" \
              --arg unixtime "$EVENT_UNIXTIME" \
              --arg event "$EVENT_CLASS" \
              --arg pool "$EVENT_POOL" \
              --arg usage "$cap" \
              --arg subject "$SUBJECT" \
              --arg email_message "$EMAIL_MESSAGE" \
              '{timestamp: $timestamp, unixtime: $unixtime, event: $event, pool: $pool, usage: $usage, subject: $subject, email_message: $email_message}')

            echo "[INFO] Sending notification to Houston DBus..."
            echo "$FORWARD_MESSAGE" | jq .

            python3 "$DBUS_CLIENT" "$FORWARD_MESSAGE"
        else
            echo "[SKIP] Pool '$pool' already alerted above threshold."
        fi
        NEW_STATE["$pool"]=1
    else
        echo "[INFO] Pool '$pool' is below threshold. Clearing alert flag."
        NEW_STATE["$pool"]=0
    fi

done < <(zpool list -H -o name,capacity)

# Save updated alert state
{
  echo "{"
  for key in "${!NEW_STATE[@]}"; do
    echo "  \"$key\": ${NEW_STATE[$key]},"
  done | sed '$s/,$//'
  echo "}"
} > "$STATE_FILE"
