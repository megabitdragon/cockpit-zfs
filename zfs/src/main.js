import { createApp, VueElement } from 'vue';

import App from './App.vue';
import Accordion from './components/common/Accordion.vue';
import Card from './components/common/Card.vue';
import DiskSummary from './components/disk/DiskSummary.vue';
import PoolSummary from './components/pool/PoolSummary.vue';

createApp(App).mount('#app');

App.component('Accordion', Accordion);
App.component('Card', Card);
App.component('DiskSummary', DiskSummary);
App.component('PoolSummary', PoolSummary);
