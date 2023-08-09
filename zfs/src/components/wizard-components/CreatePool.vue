<template>
	<Modal :isOpen="showWizard" :marginTop="'mt-28'" :width="'w-5/6'" :minWidth="'min-w-5/6'">
		<template v-slot:title>
			<!-- navigation tabs for create pool wizard -->
			<WizardTabs :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
		</template>
		<template v-slot:content>
			<!-- actual content for create pool wizard -->
			<PoolConfig ref="poolConfiguration" :tag="navTag" idKey="pool-config" class="mx-4"/>
		</template>
		<template v-slot:footer>
			<!-- buttons for next, back & also finish (if at last tab) -->
			<div class="button-group-row w-full justify-between mx-4">
				<div class="button-group-row mt-2">
					<div v-if="navTag == 'virtual-devices'" class="justify-self-start flex flex-row">
						<div class="button-group-row">
							<button v-if="poolConfig.vdevs.length > 0" id="add-vdev-btn" class="btn btn-primary object-left justify-start mr-4 h-fit w-full" @click="poolConfiguration.addVDev()">Add VDev</button>
						</div>

						<div class="flex flex-row">
							<label :for="'forcefully-create-pool'" class="mt-2 mr-2 block text-sm font-medium leading-6 text-default">Forcefully Create</label>
							<Switch v-model="poolConfig.settings!.forceCreate" :class="[poolConfig.settings!.forceCreate ? 'bg-primary' : 'bg-accent', 'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
								<span class="sr-only">Use setting</span>
								<span :class="[poolConfig.settings!.forceCreate ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
									<span :class="[poolConfig.settings!.forceCreate ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
										<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
											<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
										</svg>
									</span>
									<span :class="[poolConfig.settings!.forceCreate ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
										<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
											<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
										</svg>
									</span>
								</span>
							</Switch>
						</div>
					</div>

					<div v-if="navTag == 'name-entry'" class="justify-self-center mt-2">
						<p class="text-danger" v-if="nameFeedback">{{ nameFeedback }}</p>
					</div>

					<div v-if="navTag == 'virtual-devices'" class="justify-self-center mt-2">
						<p class="text-danger" v-if="diskFeedback">{{ diskFeedback }}</p>
						<p class="text-danger" v-if="diskSizeFeedback">{{ diskSizeFeedback }}</p>
						<p class="text-danger" v-if="isProperReplicationFeedback">{{ isProperReplicationFeedback }}</p>
						<p class="text-danger" v-if="vDevFeedback">{{ vDevFeedback }}</p>
					</div>
				</div>			
				<div class="button-group-row mt-2">
					<button id="back" class="btn btn-secondary object-left justify-start h-fit" @click="prev">Back</button>
					<button v-if="!end" id="next" class="btn btn-primary object-right justify-end h-fit" @click="next">Next</button>
					<!-- only show finish button if currently on the final tab -->
					<button v-if="end && !finishPressed" id="finish" class="btn btn-primary object-right justify-end" @click="finishBtn(newPoolData)">Finish</button>
					<button disabled v-if="end && finishPressed" id="finish" type="button" class="btn btn-primary object-right justify-end">
						<svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin text-default" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="text-success"/>
						</svg>
						Creating Pool...
					</button>
				</div>
			</div>
		</template>
	</Modal>
</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
import { Switch } from '@headlessui/vue';
import Modal from '../common/Modal.vue';
import WizardTabs from './WizardTabs.vue';
import PoolConfig from './PoolConfig.vue';
import { newPool } from "../../composables/pools";
import { loadDisksThenPools, loadDatasets } from '../../composables/loadData';

const show = ref(true);
const navTag = ref('name-entry');
const tabError = ref(false);

const finishPressed =ref(false);

const showWizard = inject<Ref<boolean>>('show-wizard')!;

//reference to poolConfiguration component to use its methods
const poolConfiguration = ref();

const nameFeedback = ref('');
const vDevFeedback = ref('');
const diskFeedback = ref('');
const diskSizeFeedback = ref('');
const isProperReplicationFeedback = ref('');

//injecting provided disk and pools rray
const disks = inject<Ref<DiskData[]>>('disks')!;
const pools = inject<Ref<PoolData[]>>('pools')!;
const datasets = inject<Ref<FileSystemData[]>>('datasets')!;

//setting default values for file system object
const fileSystemConfig = ref<FileSystemData>({
	parentFS: '',
    name: '',
    id: '',
    mountpoint: '',
    pool: '',
    encrypted: false,
    key_loaded: '',
    type: '',
    inherit: true,
    properties: {
		guid: '',
		encryption: 'aes-256-gcm',
        accessTime: 'inherited',
        caseSensitivity: 'inherited',
        compression: 'inherited',
        deduplication: 'inherited',
        dNodeSize: 'inherited',
        extendedAttributes: 'inherited',
        recordSize: 'inherited',
        quota: {
            raw: 0,
            value: '',
            size: 'kib',
        },
		usedByDataset: '',
		usedbyRefreservation: '',
        readOnly: '',
        available: '',
        creation: '',
        snapshotCount: '',
        mounted: '',
		refreservation: {
            raw: 0,
            value: '',
            size: 'kib',
        }
    },
    children: [],
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

const newPoolData = ref<newPoolData>({
	name: '',
	vdevs : [],
	autoexpand: '',
	autoreplace: '',
	autotrim: '',
	compression: '',
	recordsize: 0,
	dedup: '',
	refreservation: 0,
});

const disksLoaded = inject<Ref<boolean>>('disks-loaded')!;
const poolsLoaded = inject<Ref<boolean>>('pools-loaded')!;

//finish button method for creating pool
function finishBtn(newPoolData) {
  	finishPressed.value = true;
	poolConfiguration.value.fillNewPoolData();
	console.log(newPoolData);
	newPool(newPoolData).then(() => {
		showWizard.value = false;
		refreshAllData();
	});
}

async function refreshAllData() {
	disksLoaded.value = false;
	poolsLoaded.value = false;
	disks.value = [];
	pools.value = [];
	await loadDisksThenPools(disks, pools);
	await loadDatasets(datasets);
	disksLoaded.value = true;
	poolsLoaded.value = true;
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
		} else if (poolConfiguration.value.validateAndProceed(currentTag) && poolConfiguration.value.validateAndProceed('virtual-devices')) {
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
		} else if (poolConfiguration.value.validateAndProceed(currentTag)) {
			navTag.value = item.tag;
		} else {
			tabError.value = true;
			console.log(`Validation failed for ${currentTag} tab. Cannot proceed to the ${item.tag} tab.`);
		}
	} else if (currentTag === 'pool-settings') {
		if(item.tag === 'name-entry' || item.tag === 'virtual-devices') {
			navTag.value = item.tag;
			tabError.value = false;
		} else if (poolConfiguration.value.validateAndProceed(currentTag)) {
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

provide('new-pool-data', newPoolData);
provide('pool-config-data', poolConfig);
provide('file-system-data', fileSystemConfig);
provide('feedback-name', nameFeedback);
provide('feedback-vdev', vDevFeedback);
provide('feedback-disk', diskFeedback);
provide('feedback-disk-size', diskSizeFeedback);
provide('feedback-replication-level', isProperReplicationFeedback);
</script>