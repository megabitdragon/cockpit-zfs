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

    if event == "statechange" and state == "DEGRADED":
        return "warning"  
        
    if event == "statechange" and state == "FAULTED":
        return "error"  

    return "info"  # ℹ️ Default for general notifications

# Function to Insert Notifications into SQLite
import sqlite3

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
                scrub_details TEXT,  -- ✅ Fixed misplaced column
                errors TEXT,
                repaired TEXT,
                severity TEXT CHECK(severity IN ('info', 'warning', 'error')) DEFAULT 'info',
                received INTEGER DEFAULT 0  -- 0 = Not sent to UI, 1 = Sent
            );
        """)
        conn.commit()  # ✅ Ensure table creation is saved
        
        # ✅ Determine severity before inserting
        severity = determine_severity(message.get("event"), message)

        # ✅ Insert notification into database (handling missing fields)
        cursor.execute("""
            INSERT INTO notifications (timestamp, event, pool, vdev, state, error, description, health, guid, scrub_details, errors, repaired, received, severity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            message.get("timestamp"),
            message.get("event"),
            message.get("pool"),
            message.get("vdev", None),  # Default to None if missing
            message.get("state", None),
            message.get("error", None),
            message.get("description", None),
            message.get("health"),
            message.get("guid", None),
            message.get("scrub_details", None),
            message.get("errors", None),
            message.get("repaired", None),
            0,  # Default value for received
            severity  # ✅ Now correctly included in the column list
        ))

        conn.commit()  # ✅ Save the inserted data
        notification_id = cursor.lastrowid  # Get the generated ID
        
        # ✅ Add ID and severity to message before returning
        message["id"] = notification_id
        message["severity"] = severity
        
        conn.close()  # ✅ Close the connection
        
        print(f"[DB Inserted] {message}")
        return message  # ✅ Return updated message

    except Exception as e:
        print(f"[DB Insert Error] {e}")
        return None  # Return None if there was an error

# Define DBus Service
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
        """Process message: Save to DB first, then send to UI"""
        print(f"[Forwarding message] {message}")
        try:
            parsed_message = json.loads(message)  # ✅ Use json.loads() instead of eval()
            updated_message = store_notification(parsed_message)  # ✅ Save to DB first

            if updated_message:
                self.Message(json.dumps(updated_message))  # ✅ Send with correct ID
            else:
                print("❌ Error: Could not store notification in database.")

        except json.JSONDecodeError:
            print("❌ Error: Invalid JSON format received")


# Setup DBus
bus = dbus.SystemBus()
bus_name = dbus.service.BusName("org._45drives.Houston", bus)
service = DBusService(bus_name)

# Start Main Loop
loop = GLib.MainLoop()
loop.run()