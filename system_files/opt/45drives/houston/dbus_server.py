import dbus
import dbus.service
import dbus.mainloop.glib
import sqlite3
import gi
import json
from datetime import datetime

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

def store_notification(message):
    """Stores notifications in SQLite DB, updates statechange events if necessary, and returns the message with ID."""
    print(f"[DEBUG] Attempting to store: {message}")  

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        print(f"[DEBUG] Checking if {message.get('event')} already exists")

        # ✅ Check if a similar event exists (for statechange updates)
        cursor.execute("""
            SELECT id, state, health FROM notifications
            WHERE event = ? AND timestamp = ? AND vdev = ?;
        """, (message["event"], message["timestamp"], message.get("vdev", None)))

        existing_event = cursor.fetchone()

        if existing_event:
            existing_id, existing_state, existing_health = existing_event

            # ✅ If it's a statechange event and the state or health has changed, update it
            if message["event"] == "statechange" and (existing_state != message.get("state") or existing_health != message.get("health")):
                new_severity = determine_severity(message.get("event"), message)  # ✅ Recalculate severity
                
                cursor.execute("""
                    UPDATE notifications
                    SET state = ?, severity = ?, health = ?
                    WHERE id = ?;
                """, (
                    message.get("state"),
                    new_severity,
                    message.get("health", None),
                    existing_id
                ))
                conn.commit()
                print(f"✅ [UPDATE] Statechange event updated: {message}")  

                # ✅ Include `id` and `severity` in the returned message
                message["id"] = existing_id
                message["severity"] = new_severity
                return message  

            print(f"❌ Duplicate detected, skipping insert: {message}")
            return None  

        # ✅ Insert new notification if no matching event found
        severity = determine_severity(message.get("event"), message)  # ✅ Get severity for new events

        cursor.execute("""
            INSERT INTO notifications (timestamp, event, pool, vdev, state, severity, health, errors)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            message.get("timestamp"),
            message.get("event"),
            message.get("pool"),
            message.get("vdev", None),
            message.get("state", None),
            severity,
            message.get("health", None),
            message.get("errors", 0)  # ✅ Added errors field with a default of 0
        ))

        conn.commit()
        notification_id = cursor.lastrowid  # ✅ Get the new row ID
        print(f"✅ [INSERT] New event stored: {message}")  

        # ✅ Include `id` and `severity` in the returned message
        message["id"] = notification_id
        message["severity"] = severity
        return message  

    except Exception as e:
        print(f"❌ [DB Insert Error] {e}")
        return None  

    finally:
        conn.close()  

class DBusService(dbus.service.Object):
    """D-Bus Service to handle incoming messages and forward valid ones to the UI."""

    def __init__(self, bus_name):
        bus_path = "/org/_45drives/Houston"
        dbus.service.Object.__init__(self, bus_name, bus_path)

    @dbus.service.signal("org._45drives.Houston", signature="s")
    def Message(self, message):
        """Signal an event has occurred and notify the UI."""
        print(f"[D-Bus Signal Sent] {message}")

    @dbus.service.method("org._45drives.Houston", in_signature="s")
    def ForwardMessage(self, message):
        """Process message: Save to DB first, then send to UI only if stored or updated."""
        print(f"[Forwarding message] {message}")
        try:
            parsed_message = json.loads(message)  
            updated_message = store_notification(parsed_message)  # ✅ Save/update in DB

            if updated_message:
                print(f"✅ [FORWARD] Sending to UI: {updated_message}")  
                self.Message(json.dumps(updated_message))  # ✅ Forward message with correct ID
            else:
                print("❌ Duplicate event detected, not forwarding to UI.")

        except json.JSONDecodeError:
            print("❌ Error: Invalid JSON format received")

# Setup D-Bus
bus = dbus.SystemBus()
bus_name = dbus.service.BusName("org._45drives.Houston", bus)
service = DBusService(bus_name)

# Start Main Loop
loop = GLib.MainLoop()
loop.run()
