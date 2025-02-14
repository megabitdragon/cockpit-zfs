// src/stores/notificationStore.ts
import { reactive } from "vue";

// Define the Notification type
interface Notification {
  id: number;
  timestamp: string;
  event: string;
  pool?: string;
  text: string;
}

// Define the reactive notification store
export const notificationStore = reactive<{
  notifications: Notification[];
  addNotification: (message: string) => void;
  removeNotification: (id: number) => void;
}>({
  notifications: [],

  // Add notification to the list
  addNotification(message: string) {
    try {
      const parsedMessage = JSON.parse(message) as { timestamp: string; event: string; pool?: string };

      notificationStore.notifications.unshift({
        id: Date.now(),
        timestamp: parsedMessage.timestamp,
        event: parsedMessage.event,
        pool: parsedMessage.pool,
        text: `Event: ${parsedMessage.event}, Pool: ${parsedMessage.pool ?? "N/A"}`,
      });
    } catch (error) {
      console.error("Invalid JSON format received:", message);
    }
  },

  // Remove notification by ID
  removeNotification(id: number) {
    notificationStore.notifications = notificationStore.notifications.filter((n) => n.id !== id);
  },
});
