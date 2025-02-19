# import dbus
# import dbus.service
# import dbus.mainloop.glib
# import gi
# gi.require_version("GLib", "2.0")
# from gi.repository import GLib
# dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)
# class DBusService(dbus.service.Object):
#     def __init__(self, bus_name):
#         bus_path = "/org/_45drives/Houston"
#         dbus.service.Object.__init__(self, bus_name, bus_path)
#     @dbus.service.signal("org._45drives.Houston", signature="s")
#     def Message(self, message):
#         """Signal that an event has occurred."""
#         print(f"[D-Bus Signal Sent] {message}")
#     @dbus.service.method("org._45drives.Houston", in_signature="s")
#     def ForwardMessage(self, message):
#         print(f"[forwarding message] {message}")
#         self.Message(message)
# bus = dbus.SystemBus()
# bus_name = dbus.service.BusName("org._45drives.Houston", bus)
# service = DBusService(bus_name)
# loop = GLib.MainLoop()
# loop.run()
import dbus
import dbus.service
import dbus.mainloop.glib
import sqlite3
import gi

gi.require_version("GLib", "2.0")
from gi.repository import GLib

# Initialize DBus
dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)

# Define SQLite Database Path
DB_PATH = "/var/lib/sqlite/notifications.db"

# Function to Insert Notifications into SQLite
def store_notification(message):
    print(f"[DEBUG] Received Message: {message}")  # Debug print before storing
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
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
                received INTEGER DEFAULT 0  -- 0 = Not sent to UI, 1 = Sent
            )
        """)
        conn.commit()

        # Insert the notification
        cursor.execute("""
            INSERT INTO notifications (timestamp, event, pool, vdev, state, error, description, received)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0)
        """, (
            message.get("timestamp"),
            message.get("event"),
            message.get("pool"),
            message.get("vdev"),
            message.get("state"),
            message.get("error"),
            message.get("description")
        ))

        conn.commit()
        conn.close()
        print(f"[DB Inserted] {message}")

    except Exception as e:
        print(f"[DB Insert Error] {e}")

# Define DBus Service
class DBusService(dbus.service.Object):
    def __init__(self, bus_name):
        bus_path = "/org/_45drives/Houston"
        dbus.service.Object.__init__(self, bus_name, bus_path)

    @dbus.service.signal("org._45drives.Houston", signature="s")
    def Message(self, message):
        """Signal that an event has occurred."""
        print(f"[D-Bus Signal Sent] {message}")
        store_notification(eval(message))  # Convert string back to dict and store in DB

    @dbus.service.method("org._45drives.Houston", in_signature="s")
    def ForwardMessage(self, message):
        print(f"[Forwarding message] {message}")
        self.Message(message)  # Send Signal & Store in DB

# Setup DBus
bus = dbus.SystemBus()
bus_name = dbus.service.BusName("org._45drives.Houston", bus)
service = DBusService(bus_name)

# Start Main Loop
loop = GLib.MainLoop()
loop.run()
