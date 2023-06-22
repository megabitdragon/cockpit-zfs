<template>
  <Modal>
    <template v-slot:title>
      <WizardTabs :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
    </template>
    <template v-slot:content>
      <PoolConfig ref="poolConfiguration" :tag="navTag" idKey="pool-config"/>
    </template>
    <template v-slot:footer>
      <div class="button-group-row">
        <button id="back" class="btn btn-secondary object-left justify-start" @click="prev">Back</button>
        <button v-if="!end" :disabled="disableButton" id="next" class="btn btn-primary object-right justify-end" @click="next poolConfiguration.validateData()">Next</button>
        <button v-if="end" :disabled="disableButton"  id="finish" class="btn btn-primary object-right justify-end" @click="finishBtn(newPoolName, newVDevs)">Finish</button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';

import Modal from '../common/Modal.vue';
import WizardTabs from './WizardTabs.vue';
import PoolConfig from './PoolConfig.vue';
import { createPool } from "../../scripts/pools";

const show = ref(true);
const navTag = ref('name-entry');
const disableButton = ref(false);

const poolConfiguration = ref();

const disks = inject<Ref<DiskData[]>>('disks')!;

const poolConfig = ref<PoolData>({
  name: '',
  status: '',
  guid: '',
  properties: {
    rawsize: 0,
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
    refreservation: 10,
    autoExpand: true,
    autoReplace: false,
    autoTrim: false,
    forceCreate: false,
  },
  createFileSystem: false,
});

const fillDisks = () => {
  poolConfig.value.vdevs.forEach(vdev => {
    vdev.selectedDisks.forEach(selected => {
      const selectedDisk = disks.value.find(disk => disk.name === selected);
      vdev.disks.push(selectedDisk!);
    });
  });

  console.log("Pool Config:");
  console.log(poolConfig);
};

const newVDevs = computed(() => {
  fillDisks();
  return poolConfig.value.vdevs.map(vdev => {
    const devicePaths : string[] = [];
    vdev.disks.forEach(disk => {
      devicePaths.push(disk.vdev_path);
      console.log(disk.vdev_path);
    });
    
    const root = getRoot(vdev);
    const type = vdev.type.toUpperCase();

    const newVDev = {
      root: root,
      type: type,
      devices: devicePaths,
    }

    return newVDev;
  })
});

const newPoolName = computed(() => {
  return poolConfig.value.name;
})

function getRoot(vDev) {
  let root = '';
  if (vDev.type == 'mirror' || vDev.type == 'disk' || vDev.type == 'raidz1'|| vDev.type == 'raidz2'|| vDev.type == 'raidz3') {root = 'DATA';} 
  else if (vDev.type == 'log') { root = 'LOG' }
  else if (vDev.type == 'cache') { root = 'CACHE' }
  else if (vDev.type == 'dedup') { root = 'DEDUP' }
  else if (vDev.type == 'spare') { root = 'SPARE' }
  else if (vDev.type == 'special') { root = 'SPECIAL' }

  return root;
}

function finishBtn(newPoolName, newVDevs) {
  createPool(newPoolName, newVDevs);
}

const currentNavigationItem = computed<StepsNavigationItem | undefined>(() => navigation.find(item => item.current));

const navigationCallback: StepNavigationCallback = (item: StepsNavigationItem) => {
	navTag.value = item.tag;
};

const end = ref(false);

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
  end.value = false;
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

  if (navTag.value == 'review') {
    end.value = true;
  }
};

watch(navTag, updateStatus);

updateStatus();

provide('pool-config-data', poolConfig);
provide('disabled', disableButton);
</script>








