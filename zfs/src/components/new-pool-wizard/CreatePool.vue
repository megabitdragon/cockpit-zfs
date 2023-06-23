<template>
  <Modal>
    <template v-slot:title>
      <WizardTabs :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
    </template>
    <template v-slot:content>
      <PoolConfig ref="poolConfiguration" :tag="navTag" idKey="pool-config"/>
      <div v-if="tabError" class="text-danger">Cannot skip tabs.</div>
    </template>
    <template v-slot:footer>
      <div class="button-group-row">
        <button id="back" class="btn btn-secondary object-left justify-start" @click="prev">Back</button>
        <button v-if="!end" id="next" class="btn btn-primary object-right justify-end" @click="next">Next</button>
        <button v-if="end" id="finish" class="btn btn-primary object-right justify-end" @click="finishBtn(newPoolName, newVDevs)">Finish</button>
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
const tabError = ref(false);

const poolConfiguration = ref();

const disks = inject<Ref<DiskData[]>>('disks')!;

const fileSystemConfig = ref<FileSystemData>({
    name: '',
    encryption: false,
    cipher: 'aes-256-gcm',
    passphrase: '',
    inherit: true,
    accessTime: 'inherited',
    caseSensitivity: 'inherited',
    compression: 'inherited',
    deduplication: 'inherited',
    dNodeSize: 'inherited',
    extendedAttributes: 'inherited',
    recordSize: 'inherited',
    quota: {
      amount: 0,
      size: 'kib',
    },
    readOnly: false,
})

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
  fileSystem: fileSystemConfig.value,

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
  const currentTag = navTag.value;
  tabError.value = false;

  if (currentTag === 'name-entry') {
    if(item.tag === 'virtual-devices' && poolConfiguration.value.validateAndProceed(currentTag)) {
      navTag.value = item.tag;
    } else {
      tabError.value = true;
      console.log(`Validation failed for ${currentTag} tab. Cannot proceed to the ${item.tag} tab.`);
    }
  } else if (currentTag === 'virtual-devices') {
    if(item.tag === 'name-entry') {
      navTag.value = item.tag;
    } else if (item.tag === 'pool-settings' && poolConfiguration.value.validateAndProceed(currentTag)) {
      navTag.value = item.tag;
    } else {
      tabError.value = true;
      console.log(`Validation failed for ${currentTag} tab. Cannot proceed to the ${item.tag} tab.`);
    }
  } else if (currentTag === 'pool-settings') {
    if(item.tag === 'name-entry' || item.tag === 'virtual-devices') {
      navTag.value = item.tag;
    } else if (item.tag === 'file-system' && poolConfiguration.value.validateAndProceed(currentTag)) {
      navTag.value = item.tag;
    } else {
      tabError.value = true;
      console.log(`Validation failed for ${currentTag} tab. Cannot proceed to the ${item.tag} tab.`);
    }
  } else if (currentTag === 'file-system') {
    if(item.tag === 'name-entry' || item.tag === 'virtual-devices' || item.tag === 'pool-settings') {
      navTag.value = item.tag;
    } else if (item.tag === 'review') {
      // } else if (item.tag === 'review' && poolConfiguration.value.validateAndProceed(currentTag)) {
      navTag.value = item.tag;
    } else {
      tabError.value = true;
      console.log(`Validation failed for ${currentTag} tab. Cannot proceed to the ${item.tag} tab.`);
    }
  }  else if (currentTag === 'review') {
    navTag.value = item.tag;
  } 
}
  
const end = ref(false);

const next = () => {
	const currentTag = navTag.value;
	const currentItem = navigation.find(item => item.tag === currentTag);
	const currentIndex = navigation.indexOf(currentItem!);
  if (currentIndex === navigation.length) {
    console.log('Last tab');
    return;
  }
	const nextIndex = currentIndex + 1;
	if (nextIndex >= navigation.length) return;
    
	const nextItem = navigation[nextIndex];

  if (currentItem!.tag === 'name-entry') {
    if (poolConfiguration.value.validateAndProceed('name-entry')) {
      navTag.value = nextItem.tag;
    } else {
      console.log(`Validation failed for ${navTag.value} tab. Cannot proceed to the ${nextItem.tag} tab.`);
    }
  } else if (currentItem!.tag === 'virtual-devices') {
    if (poolConfiguration.value.validateAndProceed('virtual-devices')) {
      navTag.value = nextItem.tag;
    } else {
      console.log(`Validation failed for ${navTag.value} tab. Cannot proceed to the ${nextItem.tag} tab.`);
    }
  } else if (currentItem!.tag === 'pool-settings') {
    // if (poolConfiguration.value.validateAndProceed('pool-settings')) {
      navTag.value = nextItem.tag;
    // } else {
    //   console.log(`Validation failed for ${navTag.value} tab. Cannot proceed to the ${nextItem.tag} tab.`);
    // }
  } else if (currentItem!.tag === 'file-system') {
    // if (poolConfiguration.value.validateAndProceed('file-system')) {
      navTag.value = nextItem.tag;
    // } else {
    //   console.log(`Validation failed for ${navTag.value} tab. Cannot proceed to the ${nextItem.tag} tab.`);
    // }
  } 
};

const prev = () => {
	const currentTag = navTag.value;
	const currentItem = navigation.find(item => item.tag === currentTag);
	const currentIndex = navigation.indexOf(currentItem!);
  if (currentIndex === 0) {
    console.log('First tab');
    return;
  }
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
  } else {
    end.value = false;
  }
};

watch(navTag, updateStatus);

updateStatus();

provide('pool-config-data', poolConfig);
provide('file-system-data', fileSystemConfig);
</script>