import sqlite3
from pydantic import BaseModel
from typing import List, Optional
from pathlib import Path

DB_PATH = "/var/lib/sqlite/45Drives/notifications.db"

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
    Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)  # ✅ Prevents FileExistsError
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
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS warning_levels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL UNIQUE,
        severity TEXT NOT NULL CHECK(severity IN ('info', 'warning', 'critical'))
    )
    """)

    # Insert default values
    defaults = {
        "scrubFinish": "info",
        "vdevCleared": "info",
        "resilverFinish": "info",
        "clearPoolErrors": "info",
        "snapshotCreation": "info",
        "stateChange": "critical",
        "storage_threshold": "warning",
        "poolImport": "info"
    }

    for event_type, severity in defaults.items():
        cursor.execute("""
            INSERT OR IGNORE INTO warning_levels (event_type, severity)
            VALUES (?, ?)
        """, (event_type, severity))
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS smtp_settings (
        id INTEGER PRIMARY KEY,
        send_info INTEGER DEFAULT 0,
        send_warning INTEGER DEFAULT 1,
        send_critical INTEGER DEFAULT 1
    );    
        """)
    cursor.execute("""
    INSERT OR IGNORE INTO smtp_settings (id, send_info, send_warning, send_critical)
    VALUES (1, 0, 1, 1);
        """)
    conn.commit()
    conn.close()

setup_database()