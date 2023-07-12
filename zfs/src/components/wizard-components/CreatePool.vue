<template>
	<Modal>
		<template v-slot:title>
			<!-- navigation tabs for create pool wizard -->
			<WizardTabs :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
		</template>
		<template v-slot:content>
			<!-- actual content for create pool wizard -->
			<PoolConfig ref="poolConfiguration" :tag="navTag" idKey="pool-config"/>
			<div v-if="tabError" class="text-danger">Cannot skip tabs.</div>
		</template>
		<template v-slot:footer>
			<!-- buttons for next, back & also finish (if at last tab) -->
			<div class="button-group-row">
				<button id="back" class="btn btn-secondary object-left justify-start" @click="prev">Back</button>
				<button v-if="!end" id="next" class="btn btn-primary object-right justify-end" @click="next">Next</button>
				<!-- only show finish button if currently on the final tab -->
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

//reference to poolConfiguration component to use its methods
const poolConfiguration = ref();

//injecting provided disk array
const disks = inject<Ref<DiskData[]>>('disks')!;

//setting default values for file system object
const fileSystemConfig = ref<FileSystemData>({
  	name: '',
	id: '',
	mountpoint: '',
	pool: '',
	encrypted: '',
	isEncrypted: false,
	cipher: '',
	passphrase: '',
	key_loaded: '',
	type: '',
	inherit: false,
	properties: {
		accessTime: '',
		caseSensitivity: '',
		compression: '',
		deduplication: '',
		dNodeSize: '',
		extendedAttributes: '',
		recordSize: '',
		quota: {
		raw: 0,
		value: '',
		size: '',
		},
		readOnly: '',
		available: '',
		creation: '',
		snapshotCount: '',
		used: '',
		mounted: '',
	},

});

//setting defaults for pool object
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

//getting the name of the disks that belong to VDevs and comparing those names against the entire disk array, in order to get the full data of the disk 
//(VDev disks only stores name) and adding the actual full disk object instead of just the name
const fillDisks = () => {
	poolConfig.value.vdevs.forEach(vdev => {
		vdev.selectedDisks.forEach(selected => {
			const selectedDisk = disks.value.find(disk => disk.name === selected);
			vdev.disks.push(selectedDisk!);
		});
	});

  //console.log("Pool Config:");
  //console.log(poolConfig);
};

//getting the array of VDevs (with proper data structure) to use as argument for create-pool python script
const newVDevs = computed(() => {
	//calling fillDisks so disk/vdev path is accessible
	fillDisks();
	return poolConfig.value.vdevs.map(vdev => {

		const devicePaths : string[] = [];
		vdev.disks.forEach(disk => {
			devicePaths.push(disk.vdev_path);
			//console.log(disk.vdev_path);
		});
		
		//calling get root method to determine the root used in creation script execution
		const root = getRoot(vdev);
		const type = vdev.type.toUpperCase();

		//data object used to execute creation script
		const newVDev = {
			root: root,
			type: type,
			devices: devicePaths,
		}
		console.log("newVDev: ");
		console.log(newVDev);
		return newVDev;
	})
});

//computing the name of the pool (computed as it can change during wizard use)
const newPoolName = computed(() => {
  	return poolConfig.value.name;
});

//method to check the type of VDev, compare against the root values and outputting the correct one
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

//finish button method for executing create pool script
function finishBtn(newPoolName, newVDevs) {
  	createPool(newPoolName, newVDevs);
}

const currentNavigationItem = computed<StepsNavigationItem | undefined>(() => navigation.find(item => item.current));

//navigation method for tabs, with error handling (cannot click on future tabs without having current tab complete + with valid data)
const navigationCallback: StepNavigationCallback = (item: StepsNavigationItem) => {
	const currentTag = navTag.value;
	tabError.value = false;

	//checks current tab and then validates data of current tab before allowing user to proceed
	if (currentTag === 'name-entry') {
		if(item.tag === 'virtual-devices' && poolConfiguration.value.validateAndProceed(currentTag)) {
			navTag.value = item.tag;
			tabError.value = false;
		} else {
			tabError.value = true;
			console.log(`Validation failed for ${currentTag} tab. Cannot proceed to the ${item.tag} tab.`);
		}
	} else if (currentTag === 'virtual-devices') {
		if(item.tag === 'name-entry') {
			navTag.value = item.tag;
			tabError.value = false;
		} else if (item.tag === 'pool-settings' && poolConfiguration.value.validateAndProceed(currentTag)) {
			navTag.value = item.tag;
		} else {
			tabError.value = true;
			console.log(`Validation failed for ${currentTag} tab. Cannot proceed to the ${item.tag} tab.`);
		}
	} else if (currentTag === 'pool-settings') {
		if(item.tag === 'name-entry' || item.tag === 'virtual-devices') {
			navTag.value = item.tag;
			tabError.value = false;
		} else if (item.tag === 'file-system' && poolConfiguration.value.validateAndProceed(currentTag)) {
			navTag.value = item.tag;
		} else {
			tabError.value = true;
			console.log(`Validation failed for ${currentTag} tab. Cannot proceed to the ${item.tag} tab.`);
		}
	} else if (currentTag === 'file-system') {
		if(item.tag === 'name-entry' || item.tag === 'virtual-devices' || item.tag === 'pool-settings') {
			navTag.value = item.tag;
			tabError.value = false;
		} else if (item.tag === 'review') {
			// } else if (item.tag === 'review' && poolConfiguration.value.validateAndProceed(currentTag)) {
			navTag.value = item.tag;
			tabError.value = false;
		} else {
			tabError.value = true;
			console.log(`Validation failed for ${currentTag} tab. Cannot proceed to the ${item.tag} tab.`);
		}
	}  else if (currentTag === 'review') {
			navTag.value = item.tag;
	} 
}

const end = ref(false);

//navigation for next button, with error handling/data validation so user cannot navigate to another tab without current one done
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

  //checks current tab and then validates data of current tab before allowing user to proceed
	if (currentItem!.tag === 'name-entry') {
		if (poolConfiguration.value.validateAndProceed('name-entry')) {
			navTag.value = nextItem.tag;
			tabError.value = false;
		} else {
			console.log(`Validation failed for ${navTag.value} tab. Cannot proceed to the ${nextItem.tag} tab.`);
		}
	} else if (currentItem!.tag === 'virtual-devices') {
		if (poolConfiguration.value.validateAndProceed('virtual-devices')) {
			navTag.value = nextItem.tag;
			tabError.value = false;
		} else {
			console.log(`Validation failed for ${navTag.value} tab. Cannot proceed to the ${nextItem.tag} tab.`);
		}
	} else if (currentItem!.tag === 'pool-settings') {
		// if (poolConfiguration.value.validateAndProceed('pool-settings')) {
		navTag.value = nextItem.tag;
		tabError.value = false;
		// } else {
		//   console.log(`Validation failed for ${navTag.value} tab. Cannot proceed to the ${nextItem.tag} tab.`);
		// }
	} else if (currentItem!.tag === 'file-system') {
		// if (poolConfiguration.value.validateAndProceed('file-system')) {
		navTag.value = nextItem.tag;
		tabError.value = false;
		// } else {
		//   console.log(`Validation failed for ${navTag.value} tab. Cannot proceed to the ${nextItem.tag} tab.`);
		// }
	} 
};

//navigation for prev button with error handling in case the user clicks prev on the first tab, also changes Finish button back to Next if navigating away from Review tab
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

//tabs for navigation
const navigation = reactive<StepsNavigationItem[]>([
	{ name: 'Name', id: '01', tag: 'name-entry', current: computed(() => navTag.value == 'name-entry') as unknown as boolean, status: 'current', show: true, } ,
	{ name: 'Virtual Devices', id: '02', tag: 'virtual-devices', current: computed(() => navTag.value == 'virtual-devices') as unknown as boolean, status: 'upcoming', show: true,},
	{ name: 'Pool Settings', id: '03', tag: 'pool-settings', current: computed(() => navTag.value == 'pool-settings') as unknown as boolean, status: 'upcoming', show: true, },
	{ name: 'File System', id: '04', tag: 'file-system', current: computed(() => navTag.value == 'file-system') as unknown as boolean, status: 'upcoming', show: true, },
	{ name: 'Summary', id: '05',tag: 'review', current: computed(() => navTag.value == 'review') as unknown as boolean, status: 'upcoming', show: true, },
].filter(item => item.show));

//method for updating tab appearance based on if current, completed, or upcoming step. 
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