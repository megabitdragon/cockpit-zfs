from fastapi import FastAPI, HTTPException
import sqlite3
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

DB_PATH = "/var/lib/sqlite/notifications.db"

# Notification Schema
class Notification(BaseModel):
    id: Optional[int] = None
    timestamp: str
    event: str
    pool: Optional[str] = None
    vdev: Optional[str] = None
    state: Optional[str] = None
    error: Optional[str] = None
    description: Optional[str] = None
    scrub_details: Optional[str] = None
    errors: Optional[str] = None
    repaired: Optional[str] = None
    received: int = 0  # 0 = unread, 1 = read
    health: Optional[str] = None
    severity: Optional[str] = "info"

# 🟢 Create SQLite Table If Not ExistsERROR: Could not find a version that satisfies the requirement sqlite3 (from versions: none)
def setup_database():
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
        health TEXT,
        guid TEXT,
        scrub_details TEXT,
        errors TEXT,
        repaired TEXT,
        severity TEXT DEFAULT 'info' CHECK(severity IN ('info', 'warning', 'error')),
        received INTEGER DEFAULT 0  -- 0 = Not sent to UI, 1 = Sent
    )
    """)
    
    conn.commit()
    conn.close()

setup_database()

# 🟢 API Endpoint to Store Notifications
@app.post("/notifications/")
def store_notification(notification: Notification):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
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
        conn.close()
        return {"message": "Notification stored successfully"}
    except Exception as e:
        return {"error": str(e)}

# 🟢 API Endpoint to Fetch Unread Notifications
@app.get("/missed-notifications/", response_model=List[Notification])
def get_missed_notifications():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    print("[DEBUG] Executing SQL Query: SELECT id, timestamp, event, pool, vdev, state, error, description, health, scrub_details, errors, repaired,severity, received  FROM notifications WHERE received = 0;")
    cursor.execute("""
        SELECT id, timestamp, event, pool, vdev, state, error, description, scrub_details, errors, repaired, received, health, severity
        FROM notifications WHERE received = 0
    """)
    rows = cursor.fetchall()
    print(f"[DEBUG] Raw Rows from DB: {rows}")
    notifications = [
        Notification(
            id=row[0], timestamp=row[1], event=row[2], pool=row[3], vdev=row[4],
            state=row[5], error=row[6], description=row[7], scrub_details=row[8],
            errors=row[9], repaired=row[10], received=row[11], health=row[12], severity=row[13]
        )
        for row in rows
    ]

    conn.commit()
    conn.close()
    print(f"[DEBUG] Missed Notifications: {notifications}")
    return notifications

# 🟢 API Endpoint to Fetch All Notifications (History)
@app.get("/notifications/", response_model=List[Notification])
def get_all_notifications():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, timestamp, event, pool, vdev, state, error, description, health, scrub_details, errors, repaired, received
        FROM notifications ORDER BY timestamp DESC    """)
    notifications = [
        Notification(
            id=row[0], timestamp=row[1], event=row[2], pool=row[3], vdev=row[4],
            state=row[5], error=row[6], description=row[7], health=row[8],  # ✅ Include health
            scrub_details=row[9], errors=row[10], repaired=row[11], received=row[12]
        )
        for row in cursor.fetchall()
    ]
    conn.close()
    return notifications

@app.put("/markNotificationAsRead/{notification_id}")
def mark_notification_as_read(notification_id: int):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Update notification to mark as read
        cursor.execute("UPDATE notifications SET received = 1 WHERE id = ?", (notification_id,))
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Notification not found")

        conn.close()
        return {"message": f"Notification {notification_id} marked as read"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/mark-all-read/")
def mark_all_notifications_as_read():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check if any notifications are unread
        cursor.execute("SELECT COUNT(*) FROM notifications WHERE received = 0")
        unread_count = cursor.fetchone()[0]

        if unread_count == 0:
            conn.close()
            return {"message": "No unread notifications to mark as read."}

        # Update only if there are unread notifications
        cursor.execute("UPDATE notifications SET received = 1 WHERE received = 0")
        conn.commit()
        conn.close()

        return {"message": f"Marked {unread_count} notifications as read"}
    except Exception as e:
        return {"error": str(e)}
