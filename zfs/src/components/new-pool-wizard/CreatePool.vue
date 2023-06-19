<template>
  <Modal>
    <template v-slot:title>
      <WizardTabs :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
    </template>
    <template v-slot:content>
      <PoolConfig :tag="navTag" idKey="pool-config"/>
    </template>
    <template v-slot:footer>
      <WizardButtons :next="next" :prev="prev"/>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';

import Modal from '../common/Modal.vue';
import WizardTabs from './WizardTabs.vue';
import PoolConfig from './PoolConfig.vue';
import WizardButtons from './WizardButtons.vue';

// const poolConfig = ref<Pool>({
//   name: '',
//   vdevs: [],
//   settings: { 
//     sector: '4kib',
//     record: '128kib',
//     compression: true,
//     deduplication: false,
//     refreservation: 0.10,
//     autoExpand: true,
//     autoReplace: false,
//     autoTrim: false,
//     forceCreate: false,
//   },
//   createFileSystem: false,
//   usagePercent: 0,
//   status: 'ONLINE',
// });

const poolData = ref<PoolData>({
  name: '',
  status: '',
  guid: '',
  properties: {
    size: '',
    allocated: '',
    capacity: 0,
    free: '',
  },
  vdevs: [],
  settings: {
    sector: '4kib',
    record: '128kib',
    compression: true,
    deduplication: false,
    refreservation: 0.10,
    autoExpand: true,
    autoReplace: false,
    autoTrim: false,
    forceCreate: false,
  },
  createFileSystem: false,
});

const vDev = ref<vDevData>({
  name: '',
  type: '',
  status: '',
  guid: '',
  stats: {},
  disks: [],
  forceAdd: false,
});

const show = ref(true);
const navTag = ref('name-entry');

const currentNavigationItem = computed<StepsNavigationItem | undefined>(() => navigation.find(item => item.current));

const navigationCallback: StepNavigationCallback = (item: StepsNavigationItem) => {
	navTag.value = item.tag;
};

const next = () => {
	const currentTag = navTag.value;
	const currentItem = navigation.find(item => item.tag === currentTag);
	const currentIndex = navigation.indexOf(currentItem!);
	const nextIndex = currentIndex + 1;
	if (nextIndex >= navigation.length) return;
	const nextItem = navigation[nextIndex];
	navTag.value = nextItem.tag;
};

const prev = () => {
	const currentTag = navTag.value;
	const currentItem = navigation.find(item => item.tag === currentTag);
	const currentIndex = navigation.indexOf(currentItem!);
	const prevIndex = currentIndex - 1;
	if (prevIndex >= navigation.length) return;
	const prevItem = navigation[prevIndex];
	navTag.value = prevItem.tag;
};

const navigation = reactive<StepsNavigationItem[]>([
	{ name: 'Name', id: '01', tag: 'name-entry', current: computed(() => navTag.value == 'name-entry') as unknown as boolean, status: 'current', show: true, } ,
  { name: 'Virtual Devices', id: '02', tag: 'virtual-devices', current: computed(() => navTag.value == 'virtual-devices') as unknown as boolean, status: 'upcoming', show: true,},
  { name: 'Pool Settings', id: '03', tag: 'pool-settings', current: computed(() => navTag.value == 'pool-settings') as unknown as boolean, status: 'upcoming', show: true, },
  { name: 'File System', id: '04', tag: 'file-system', current: computed(() => navTag.value == 'file-system') as unknown as boolean, status: 'upcoming', show: true, },
  { name: 'Summary', id: '05',tag: 'review', current: computed(() => navTag.value == 'review') as unknown as boolean, status: 'upcoming', show: true, },
].filter(item => item.show));

const updateStatus = () => {
  const currentStep = navigation.findIndex(item => item.current);
  
  navigation.forEach((item, index) => {
    if (index < currentStep) {
      item.status = 'completed';
    } else if (index === currentStep) {
      item.status = 'current';
    } else {
      item.status = 'upcoming';
    }
  });
};

watch(navTag, updateStatus);

updateStatus();

//provide('pool-config', poolConfig);
provide('pool-config-data', poolData);
</script>








