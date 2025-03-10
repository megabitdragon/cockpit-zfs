import { reactive } from "vue";

// Define the Notification type
interface Notification {
  id: number;
  timestamp: string;
  event: string;
  pool?: string;
  text: string;
  state?: string;
  vdev?: string;
  error?: string;
  description?: string;
  guid?: string;
  health?: string;
  errors?: string;
  severity?: string;
}

// Define the reactive notification store
export const notificationStore = reactive<{
  notifications: Notification[];
  addNotification: (message: string) => void;
  removeNotification: (id: number) => void;
  removeAllNotifications: () => void;
  fetchMissedNotifications: () => Promise<void>;
  markNotificationAsRead: (id: number) => Promise<void>;
  
  clearAllNotifications: () => Promise<void>;
}>({
  notifications: [],

  // Add notification to the list
  addNotification(message: string) {
    try {
      const parsedMessage = JSON.parse(message) as {
        id: number;
        timestamp: string;
        event: string;
        pool?: string;
        vdev?: string;
        state?: string;
        health?: string;
        errors?: string;
        severity?: string;
      };
      console.log("message id recieved in adddnotification: ", parsedMessage.id)

  
      // ✅ Find existing notification by ID
      const existingNotification = notificationStore.notifications.find(
        (notif) => notif.id === parsedMessage.id
      );
  
      if (existingNotification) {
        // ✅ If ID exists, update only the state field
        existingNotification.state = parsedMessage.state;
        console.log(`✅ Updated state of notification ID ${parsedMessage.id}`);
      } else {
        // ✅ If ID does not exist, add new notification
        notificationStore.notifications.unshift({
          id: parsedMessage.id,
          timestamp: parsedMessage.timestamp,
          event: parsedMessage.event,
          pool: parsedMessage.pool,
          text: `Event: ${parsedMessage.event}, Pool: ${parsedMessage.pool ?? "N/A"}`,
          state: parsedMessage.state,
          vdev: parsedMessage.vdev,
          health: parsedMessage.health,
          errors: parsedMessage.errors,
          severity: parsedMessage.severity,
        });
  
        console.log(`✅ Added new notification severity ${parsedMessage.severity}`);
      }
  
      // ✅ Trigger sidebar notification
      sideBarNotification();
    } catch (error) {
      console.error("❌ Invalid JSON format received:", message);
    }
  },


  // Remove notification by ID
  removeNotification(id: number) {
    console.log("remove Notivficatio id :", id )
    notificationStore.notifications = notificationStore.notifications.filter(
      (n) => n.id !== id
    );
    sideBarNotification();

    
  },
    // Remove notification by ID
  removeAllNotifications() {
    notificationStore.notifications = []
    sideBarNotification();

  },
  async fetchMissedNotifications() {
    try {
        console.log("🔄 Fetching missed notifications via D-Bus...");

        const dbus = cockpit.dbus("org._45drives.Houston");

        // ✅ Call GetMissedNotifications with correct object path & interface
        const response = await dbus.call(
          "/org/_45drives/Houston",  // ✅ Object path (MUST match service)
          "org._45drives.Houston",   // ✅ Interface name (MUST match service)
          "GetMissedNotifications"   // ✅ Method name (MUST match service)
      );
        if (!response) throw new Error("❌ No response received from Houston D-Bus.");

        console.log("📥 Raw response from D-Bus:", response);

        // ✅ Parse response JSON
        const missedNotifications = JSON.parse(response);

        // ✅ Add notifications to store
        missedNotifications.forEach((notification) => {
            notificationStore.notifications.unshift(notification);
        });

        // ✅ Update UI with new notifications
        sideBarNotification();

        console.log("✅ Missed notifications fetched successfully.");
    } catch (error) {
        console.error("❌ Error fetching missed notifications via D-Bus:", error);
    }
},


  // // Fetch missed notifications from FastAPI
  // async fetchMissedNotifications() {
  //   try {
  //     const http = (cockpit as any).http({
  //       address: "127.0.0.1",
  //       port: 8000, // FastAPI is running on this port
  //     });

  //     // Perform GET request to FastAPI
  //     const response = await http.get("/missed-notifications/");
      
  //     if (!response) {
  //       throw new Error("No response received from FastAPI.");
  //     }
  //     console.log("response " ,response)
  //     // Parse response
  //     const missedNotifications: Notification[] = JSON.parse(response);

  //     // Add notifications to store
  //     missedNotifications.forEach((notification) => {
  //       notificationStore.notifications.unshift(notification);
  //     });
  //     sideBarNotification();

  //     console.log("Missed notifications fetched successfully.");

  //   } catch (error) {
  //     console.error("Error fetching missed notifications:", error);
  //   }
  // },
  
  // async markNotificationAsRead(notificationId: number) {
  //   try {
  //     const http = (cockpit as any).http({
  //       address: "127.0.0.1",
  //       port: 8000, // FastAPI is running on this port
  //     });
  
  //     const response = await http.request({
  //       method: "PUT",
  //       path: `/markNotificationAsRead/${notificationId}`, // ✅ Correct API path
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ received: 1 }) // ✅ Mark as read
  //     });
  
  
  //     // ✅ Check if the response is valid
  //     if (!response) {
  //       throw new Error("❌ No response received from FastAPI.");
  //     }
  
  //   } catch (error) {
  //     console.error("❌ Error marking notification as read:", error);
  //   }
  // },  
  async markNotificationAsRead(notificationId: number) {
    try {
        console.log(`🔄 Marking notification ${notificationId} as read via D-Bus...`);

        const dbus = cockpit.dbus("org._45drives.Houston");

        // ✅ Call the D-Bus method instead of FastAPI
        const response = await dbus.call(
            "/org/_45drives/Houston",  // ✅ Object path
            "org._45drives.Houston",   // ✅ Interface
            "MarkNotificationAsRead",  // ✅ Method name
            [notificationId]           // ✅ Argument (notification ID)
        );

        console.log(`✅ D-Bus Response: ${response}`);

        // ✅ Remove from UI after marking as read
        notificationStore.notifications = notificationStore.notifications.filter(
            (n) => n.id !== notificationId
        );

        sideBarNotification();

    } catch (error) {
        console.error("❌ Error marking notification as read via D-Bus:", error);
    }
},

  async clearAllNotifications() {
    try {
        console.log("🔄 Marking all notifications as read via D-Bus...");

        const dbus = cockpit.dbus("org._45drives.Houston");

        // ✅ Call the new D-Bus method
        const response = await dbus.call(
            "/org/_45drives/Houston",  // ✅ Object path
            "org._45drives.Houston",   // ✅ Interface
            "MarkAllNotificationsAsRead"  // ✅ Method name
        );

        console.log(`✅ D-Bus Response: ${response}`);

        // ✅ Clear UI notifications
        notificationStore.notifications = [];

        sideBarNotification();
    } catch (error) {
        console.error("❌ Error clearing notifications via D-Bus:", error);
    }
}


  
  
});

function sideBarNotification(): void {
  const count: number = notificationStore.notifications.length;
    // 🔹 Find the highest severity among all notifications
    let highestSeverity: "info" | "warning" | "error" = "info";
    notificationStore.notifications.forEach((notification) => {
        if (notification.severity === "error") highestSeverity = "error";
        else if (notification.severity === "warning" && highestSeverity !== "error") highestSeverity = "warning";
    });

    const severityType = count > 0 ? highestSeverity : null;
    console.log("severityType ", severityType );
  (cockpit.transport as any).control("notify", {
      page_status: {
          type: severityType, // Remove notification if count is 0
          title: cockpit.gettext(`${count} Notifications available`),

      }
  });
}
