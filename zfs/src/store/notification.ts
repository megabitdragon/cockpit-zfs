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
        timestamp: string;
        event: string;
        pool?: string;
        vdev?: string;
        state?: string;
        health?: string;
        errors?: string;
      };

      notificationStore.notifications.unshift({
        id: Date.now(),
        timestamp: parsedMessage.timestamp,
        event: parsedMessage.event,
        pool: parsedMessage.pool,
        text: `Event: ${parsedMessage.event}, Pool: ${parsedMessage.pool ?? "N/A"}`,
        state: parsedMessage.state,
        vdev: parsedMessage.vdev,
        health: parsedMessage.health,
        errors: parsedMessage.errors,
      });
    } catch (error) {
      console.error("Invalid JSON format received:", message);
    }
  },

  // Remove notification by ID
  removeNotification(id: number) {
    notificationStore.notifications = notificationStore.notifications.filter(
      (n) => n.id !== id
    );
  },
    // Remove notification by ID
  removeAllNotifications() {
    notificationStore.notifications = []
  },

  // Fetch missed notifications from FastAPI
  async fetchMissedNotifications() {
    try {
      const http = cockpit.http({
        address: "127.0.0.1",
        port: 8000, // FastAPI is running on this port
      });

      // Perform GET request to FastAPI
      const response = await http.get("/missed-notifications/");
      
      if (!response) {
        throw new Error("No response received from FastAPI.");
      }
      console.log("response " ,response)
      // Parse response
      const missedNotifications: Notification[] = JSON.parse(response);

      // Add notifications to store
      missedNotifications.forEach((notification) => {
        notificationStore.notifications.unshift(notification);
      });

      console.log("Missed notifications fetched successfully.");

    } catch (error) {
      console.error("Error fetching missed notifications:", error);
    }
  },
  
  async markNotificationAsRead(notificationId: number) {
    try {
      const http = cockpit.http({
        address: "127.0.0.1",
        port: 8000, // FastAPI is running on this port
      });
  
      const response = await http.request({
        method: "PUT",
        path: `/markNotificationAsRead/${notificationId}`, // ✅ Correct API path
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ received: 1 }) // ✅ Mark as read
      });
  
  
      // ✅ Check if the response is valid
      if (!response) {
        throw new Error("❌ No response received from FastAPI.");
      }
  
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  },  
  async  clearAllNotifications() {
    console.log("🟠 Clearing all notifications...");
  
    try {
      const http = cockpit.http({
        address: "127.0.0.1",
        port: 8000, // FastAPI is running on this port
      });
  
      // Send a PUT request to mark all as read
      await http.request({
        method: "PUT",
        path: `/mark-all-read/`,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ received: 1 }) // Mark all as read
      });
  
      // Remove all notifications from the UI
      notificationStore.notifications = [];
  
      console.log("✅ All notifications dismissed.");
    } catch (error) {
      console.error("❌ Error dismissing all notifications:", error);
    }
  }
  
  
});
