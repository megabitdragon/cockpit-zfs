<template>
  <Modal>
    <template v-slot:title>
      <WizardTabs :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
    </template>
    <template v-slot:content>
      <PoolConfig :tag="navTag"/>
    </template>
    <template v-slot:footer>
      <WizardButtons :next="next" :prev="prev"/>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';

import Modal from '../common/Modal.vue';
import WizardTabs from './WizardTabs.vue';
import PoolConfig from './PoolConfig.vue';
import WizardButtons from './WizardButtons.vue';

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
	{ name: 'Name this pool', id: '01', tag: 'name-entry', current: computed(() => navTag.value == 'name-entry') as unknown as boolean, status: 'current', show: true, } ,
  { name: 'Select disks', id: '02', tag: 'disk-selection', current: computed(() => navTag.value == 'disk-selection') as unknown as boolean, status: 'upcoming', show: true,},
  { name: 'Configure pool settings', id: '03', tag: 'pool-settings', current: computed(() => navTag.value == 'pool-settings') as unknown as boolean, status: 'upcoming', show: true, },
  { name: 'Set up a file system', id: '04', tag: 'file-system', current: computed(() => navTag.value == 'file-system') as unknown as boolean, status: 'upcoming', show: true, },
  { name: 'Review configuration', id: '05',tag: 'review', current: computed(() => navTag.value == 'review') as unknown as boolean, status: 'upcoming', show: true, },
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

</script>








