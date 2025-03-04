import dbus
import dbus.service
import dbus.mainloop.glib
import sqlite3
import gi
import json  # ✅ Import JSON properly

gi.require_version("GLib", "2.0")
from gi.repository import GLib

# Initialize DBus
dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)

# Define SQLite Database Path
DB_PATH = "/var/lib/sqlite/notifications.db"
def determine_severity(event, message):
    """Determine the severity of the notification based on event type."""
    
    health = message.get("health")
    state = message.get("state")
    errors = message.get("errors")

    if event in ["pool_fail", "pool_faulted"] or health == "FAULTED":
        return "error"  # ❌ Critical failure

    if event in ["scrub_finish", "scrub_warning"] and errors and errors.lower() != "no":
        return "warning"  # ⚠️ Scrub completed with errors

    if event in ["pool_import", "pool_degraded"] and health == "DEGRADED":
        return "warning"  # ⚠️ Pool degraded
        
    if event == "statechange" and (state == "FAULTED" or state == "DEGRADED"):
        return "error"  

    return "info"  # ℹ️ Default for general notifications

import sqlite3
import json
from datetime import datetime

DB_PATH = "/var/lib/sqlite/notifications.db"

import sqlite3
import json
from datetime import datetime

DB_PATH = "/var/lib/sqlite/notifications.db"

def store_notification(message):
    print(f"[DEBUG] Received Message: {message}")  # Debug print before storing

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # ✅ Ensure the table exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                event TEXT NOT NULL,
                pool TEXT,
                vdev TEXT,
                state TEXT,
                error TEXT,
                description TEXT,
                health TEXT,
                guid TEXT,
                scrub_details TEXT,
                errors TEXT,
                repaired TEXT,
                severity TEXT CHECK(severity IN ('info', 'warning', 'error')) DEFAULT 'info',
                received INTEGER DEFAULT 0
            );
        """)
        conn.commit()
        
        # ✅ Determine severity before inserting
        severity = determine_severity(message.get("event"), message)

        # ✅ Convert timestamp to datetime object
        message_timestamp = datetime.strptime(message["timestamp"], "%Y-%m-%d %H:%M:%S")

        vdev_key = message.get("vdev", "unknown")

        # 🚀 **Step 1: Check if a recent event for the same VDEV exists**
        cursor.execute("""
            SELECT id, state, timestamp FROM notifications
            WHERE vdev = ? AND event = ?
            ORDER BY timestamp DESC
            LIMIT 1;
        """, (vdev_key, message["event"]))

        existing_event = cursor.fetchone()

        if existing_event:
            existing_id, existing_state, existing_timestamp = existing_event
            existing_timestamp = datetime.strptime(existing_timestamp, "%Y-%m-%d %H:%M:%S")

            # ✅ If the last event is `DEGRADED` and now it's `FAULTED`, **update instead of inserting**
            if existing_state == "DEGRADED" and message["state"] == "FAULTED":
                print(f"⚠️ Updating `DEGRADED` → `FAULTED` for {vdev_key}")
                cursor.execute("""
                    UPDATE notifications
                    SET state = ?, timestamp = ?
                    WHERE id = ?;
                """, (message["state"], message["timestamp"], existing_id))
                conn.commit()
                conn.close()
                return message  # ✅ Return updated message

            # ✅ If `FAULTED` already exists, ignore `DEGRADED`
            if existing_state == "FAULTED" and message["state"] == "DEGRADED":
                print(f"❌ Ignoring `DEGRADED` since `FAULTED` already exists for {vdev_key}")
                conn.close()
                return None  # ✅ Ignore duplicate downgrade

            # ✅ If the last event is the same as the new event, ignore it (duplicate)
            if existing_state == message["state"]:
                print(f"❌ Ignoring duplicate `{message['state']}` event for {vdev_key}")
                conn.close()
                return None  # ✅ Ignore duplicate event
        
        # ✅ Insert new notification if no duplicate found
        cursor.execute("""
            INSERT INTO notifications (timestamp, event, pool, vdev, state, error, description, health, guid, scrub_details, errors, repaired, received, severity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            message.get("timestamp"),
            message.get("event"),
            message.get("pool"),
            message.get("vdev", None),
            message.get("state", None),
            message.get("error", None),
            message.get("description", None),
            message.get("health"),
            message.get("guid", None),
            message.get("scrub_details", None),
            message.get("errors", None),
            message.get("repaired", None),
            0,  # Default value for received
            severity
        ))

        conn.commit()
        notification_id = cursor.lastrowid  # Get the generated ID
        
        # ✅ Add ID and severity to message before returning
        message["id"] = notification_id
        message["severity"] = severity
        
        conn.close()
        
        print(f"[DB Inserted] {message}")
        return message  # ✅ Return updated message

    except Exception as e:
        print(f"[DB Insert Error] {e}")
        return None  # Return None if there was an error

        
      class DBusService(dbus.service.Object):
    def __init__(self, bus_name):
        bus_path = "/org/_45drives/Houston"
        dbus.service.Object.__init__(self, bus_name, bus_path)

    @dbus.service.signal("org._45drives.Houston", signature="s")
    def Message(self, message):
        """Signal that an event has occurred."""
        print(f"[D-Bus Signal Sent] {message}")

    @dbus.service.method("org._45drives.Houston", in_signature="s")
    def ForwardMessage(self, message):
        """Process message: Save to DB first, then send to UI only if stored."""
        print(f"[Forwarding message] {message}")
        try:
            parsed_message = json.loads(message)  # ✅ Parse JSON safely
            updated_message = store_notification(parsed_message)  # ✅ Save to DB first

            if updated_message:
                print(f"✅ Notification stored, forwarding to UI: {updated_message}")
                self.Message(json.dumps(updated_message))  # ✅ Send with correct ID
            else:
                print("❌ Duplicate event detected, not forwarding to UI.")

        except json.JSONDecodeError:
            print("❌ Error: Invalid JSON format received")



# Setup DBus
bus = dbus.SystemBus()
bus_name = dbus.service.BusName("org._45drives.Houston", bus)
service = DBusService(bus_name)

# Start Main Loop
loop = GLib.MainLoop()
loop.run()