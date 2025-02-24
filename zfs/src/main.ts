import { createApp} from 'vue';
import './assets/zfs.css';
import App from './App.vue';
import '@45drives/houston-common-css/src/index.css';
import "@45drives/houston-common-ui/style.css";
import { notificationStore } from './store/notification';

const app = createApp(App);

app.mount('#app');

cockpit.transport.control("notify", {
    page_status: {
        type: "info",
        title: cockpit.gettext(notificationStore.notifications.length + "Updates available"),
        details: { num_updates: 5 }
    }
});