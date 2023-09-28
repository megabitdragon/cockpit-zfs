<template>
	<button v-on:dblclick="showDetails(props.pool)" class="w-full h-full">
		<Card class="mt-2 mb-4 min-w-fit overflow-visible bg-plugin-header rounded-md border border-default">
			<template v-slot:title>
				<div class="flex flex-row justify-between">
					<div class="text-default">
						{{ props.pool.name }}
					</div>
					<Menu as="div" class="relative inline-block text-right">
						<div>
							<MenuButton class="rounded-full bg-accent text-muted hover:text-gray-600">
								<span class="sr-only">Open options</span>
								<EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
							</MenuButton>
						</div>
						<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
							<MenuItems class="absolute right-0 z-10 -mt-1 w-max origin-top-left rounded-md bg-accent shadow-lg">
								<div class="py-1">
									<MenuItem as="div" v-slot="{ active }">
										<a href="#" @click="showDetails(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pool Details</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a href="#" @click="clearPoolErrors(props.pool.name)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Pool Errors</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a href="#" @click="resilverThisPool(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resilver Pool</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a href="#" @click="scrubThisPool(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Scrub Pool</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a v-if="pool.diskType != 'HDD'" href="#" @click="trimThisPool(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">TRIM Pool</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a href="#" @click="showAddVDev(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Add Virtual Device</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a href="#" @click="exportThisPool(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Export Pool</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a href="#" @click="destroyPoolAndUpdate(props.pool)!" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy Pool</a>
									</MenuItem>
								</div>
							</MenuItems>
						</transition>
					</Menu>
				</div>
				<div class="flex flex-row justify-between">
					<div>
						<span class="text-success">{{props.pool.status}}</span>
					</div>
					<div>
						<img class="aspect-square w-4 h-4 min-w-4 min-h-4" src="../../../public/icons/success.svg">
					</div>					
				</div>

				<div v-if="props.pool.properties.capacity >= 1" class="w-full bg-well rounded-full mt-2 relative flex h-6 min-h-min max-h-max overflow-hidden">
					<div class="bg-green-600 h-6 min-h-min max-h-max" :style="{ width: `${props.pool.properties.capacity}%` }">
						<div class="absolute inset-0 flex items-center justify-center text-s font-medium text-default text-center p-0.5 leading-none">
							{{ props.pool.properties.capacity }}% Full
						</div>
					</div>
				</div>

				<div v-if="props.pool.properties.capacity! < 1" class="w-full bg-well rounded-full h-6 text-center mt-2 relative flex">
					<div class="absolute inset-0 flex items-center justify-center text-s font-medium text-default p-0.5 leading-none">
						{{ props.pool.properties.capacity }}% Full
					</div>
				</div>
				
			</template>
			<template v-slot:content>
				<div class="flex flex-row w-full h-max rounded-sm justify-center">
					<Status :idKey="'status-box'" :poolName="props.pool.name"/>
				</div>
			</template>
			<template v-slot:footer>
				<div class="grid grid-rows-3">
					<p class="row-start-1">Used {{ props.pool.properties.allocated }}</p>
					<p class="row-start-2">Free {{ props.pool.properties.free }}</p>
					<p class="row-start-3"><b>Total {{ props.pool.properties.size }}</b></p>
				</div>
			</template>
		</Card>
	</button>

	<div v-if="showPoolDetails">
		<PoolDetail :pool="selectedPool!" @close="showPoolDetails = false"/>
	</div>

	<div v-if="showAddVDevModal">
		<AddVDevModal @close="showAddVDevModal = false" :idKey="getIdKey(`show-vdev-modal`)" :pool="selectedPool!" :marginTop="'mt-28'"/>
	</div>

	<div v-if="showDeletePoolConfirm">
		<UniversalConfirmation :showFlag="showDeletePoolConfirm" @close="updateShowDestroyPool" :idKey="'confirm-destroy-pool'" :item="'pool'" :operation="'destroy'" :pool="selectedPool!" :confirmOperation="confirmThisDestroy" :firstOption="'force unmount'" :secondOption="'clear disk labels'" :hasChildren="false"/>
	</div>

	<div v-if="showResilverModal">
		<UniversalConfirmation :showFlag="showResilverModal" @close="updateShowResilverPool" :idKey="'confirm-resilver-pool'" :item="'pool'" :operation="'resilver'" :pool="selectedPool!" :confirmOperation="confirmThisResilver" :hasChildren="false"/>
	</div>

	<div v-if="showTrimModal">
		<UniversalConfirmation :showFlag="showTrimModal" @close="updateShowTrimPool" :idKey="'confirm-trim-pool'" :item="'pool'" :operation="'trim'" :pool="selectedPool!" :confirmOperation="confirmThisTrim" :firstOption="'secure TRIM'" :hasChildren="false"/>
	</div>

	<div v-if="showScrubModal">
		<UniversalConfirmation :showFlag="showScrubModal" @close="updateShowScrubPool" :idKey="'confirm-scrub-pool'" :item="'pool'" :operation="'scrub'" :pool="selectedPool!" :confirmOperation="confirmThisScrub" :hasChildren="false"/>
	</div>

	<div v-if="showExportModal">
		<UniversalConfirmation :showFlag="showExportModal" @close="updateShowExportPool" :idKey="'confirm-export-pool'" :item="'pool'" :operation="'export'" :pool="selectedPool!" :confirmOperation="confirmThisExport" :firstOption="'force unmount'" :hasChildren="false"/>
	</div>
</template>

<script setup lang="ts">
import { ref, inject, Ref, computed, provide, watch, watchEffect } from "vue";
import { EllipsisVerticalIcon} from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { loadDatasets, loadDisksThenPools } from '../../composables/loadData';
import { destroyPool, trimPool, scrubPool, resilverPool, clearErrors, exportPool } from "../../composables/pools";
import { labelClear } from "../../composables/disks";
import { getTimestampString } from "../../composables/helpers";
import Card from '../common/Card.vue';
import UniversalConfirmation from "../common/UniversalConfirmation.vue";
import PoolDetail from "../pools/PoolDetail.vue";
import LoadingSpinner from "../common/LoadingSpinner.vue";
import Status from '../common/Status.vue';
import AddVDevModal from "../pools/AddVDevModal.vue";

interface DashPoolCardProps {
	pool: PoolData;
}

const notifications = inject<Ref<any>>('notifications')!;
	
const messageTimestamp = ref('');
const props = defineProps<DashPoolCardProps>();
const selectedPool = ref<PoolData>();

const poolConfig = ref<PoolData>({
	name: props.pool.name,
	status: props.pool.status,
	guid: props.pool.guid,
	properties: {
		rawsize: props.pool.properties.rawsize,
		size: props.pool.properties.size,
		allocated: props.pool.properties.allocated,
		capacity: props.pool.properties.capacity,
		free: props.pool.properties.free,
		sector: props.pool.properties.sector,
		record: props.pool.properties.record,
		compression: props.pool.properties.compression,
		deduplication: props.pool.properties.deduplication,
		refreservationPercent: props.pool.properties.refreservationPercent,
		autoExpand: props.pool.properties.autoExpand,
		autoReplace: props.pool.properties.autoReplace,
		autoTrim: props.pool.properties.autoTrim,
		forceCreate: props.pool.properties.forceCreate,
		delegation: props.pool.properties.delegation,
		listSnapshots: props.pool.properties.listSnapshots,
		readOnly: props.pool.properties.readOnly,
	},
	vdevs: props.pool.vdevs,
	failMode: props.pool.failMode,
	comment: props.pool.comment,
});

///////// Values for Confirmation Modals ////////////
/////////////////////////////////////////////////////
const operationRunning = ref(false);
const operationCompleted = ref(false);
const firstOptionToggle = ref(false);
const secondOptionToggle = ref(false);
const thirdOptionToggle = ref(false);
const fourthOptionToggle = ref(false);

////////////// Show Pool/Disk Details ///////////////
/////////////////////////////////////////////////////
const showPoolDetails = ref(false);

function showDetails(pool) {
	selectedPool.value = pool;
	console.log('loading:', selectedPool);
	showPoolDetails.value = true;
}

/////////////// Loading/Refreshing //////////////////
/////////////////////////////////////////////////////
const poolData = inject<Ref<PoolData[]>>("pools")!;
const diskData = inject<Ref<DiskData[]>>("disks")!;
const disksLoaded = inject<Ref<boolean>>('disks-loaded')!;
const poolsLoaded = inject<Ref<boolean>>('pools-loaded')!;

async function refreshAllData() {
	disksLoaded.value = false;
	poolsLoaded.value = false;
	diskData.value = [];
	poolData.value = [];
	await loadDisksThenPools(diskData, poolData);
	disksLoaded.value = true;
	poolsLoaded.value = true;
}

////////////////// Destroy Pool /////////////////////
/////////////////////////////////////////////////////
const confirmDelete = ref(false);
const showDeletePoolConfirm = ref(false);
const deleting = ref(false);
const clearLabels = inject<Ref<boolean>>('clear-labels')!;
const selectedDisk = ref<DiskData>();

async function destroyPoolAndUpdate(pool) {
	operationRunning.value = false;
	selectedPool.value = pool;
	clearLabels.value = false;
	showDeletePoolConfirm.value = true;

	console.log('preparing to delete:', selectedPool.value);
}

const confirmThisDestroy : ConfirmationCallback = () => {
	confirmDelete.value = true;
}

const updateShowDestroyPool = (newVal) => {
	showDeletePoolConfirm.value = newVal;
}

watch(confirmDelete, async (newValue, oldValue) => {
	
	if (confirmDelete.value == true) {	
		operationRunning.value = true;
		console.log('now deleting:', selectedPool.value);

		if (secondOptionToggle.value == true) {
			await destroyPool(selectedPool.value!, firstOptionToggle.value);
			selectedPool.value!.vdevs.forEach(vDev => {
				vDev.disks.forEach(async disk => {
					selectedDisk.value = disk;
					await labelClear(selectedDisk.value!);
				});
			});
		} else {
			await destroyPool(selectedPool.value!);
		}

		refreshAllData();
		confirmDelete.value = false;
		showDeletePoolConfirm.value = false;
		operationRunning.value = false;
		notifications.value.constructNotification('Pool Destroyed', selectedPool.value!.name + " destroyed.", 'success');
	}
});

////////////////// Resilver Pool ////////////////////
/////////////////////////////////////////////////////
const confirmResilver = ref(false);
const showResilverModal = ref(false);
const resilvered = ref(false);
const resilvering = ref(false);

async function resilverThisPool(pool) {
	selectedPool.value = pool;
	showResilverModal.value = true;

	console.log('preparing to resilver:', selectedPool.value);
}

const confirmThisResilver : ConfirmationCallback = () => {
	confirmResilver.value = true;
}

const updateShowResilverPool = (newVal) => {
	showResilverModal.value = newVal;
}

watch(confirmResilver, async (newValue, oldValue) => {
	if (confirmResilver.value == true) {
		resilvering.value = true;
		operationRunning.value = true;
		resilvered.value = false;
		console.log('now resilvering:', selectedPool.value);

		showResilverModal.value = false;
		await resilverPool(selectedPool.value);

		confirmResilver.value = false;
		resilvered.value = true;
		resilvering.value = false;
		operationRunning.value = false;
		messageTimestamp.value = getTimestampString();
		notifications.value.constructNotification('Resilver Completed', 'Resilver on ' + selectedPool.value!.name + " completed.", 'success');
	}
});

//////////////////// TRIM Pool //////////////////////
/////////////////////////////////////////////////////
const showTrimModal = ref(false);
const confirmTrim = ref(false);
const secureTRIM = ref(false);
const trimmed = ref(false);
const trimming = ref(false);

async function trimThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;
	showTrimModal.value = true;

	console.log("preparing to trim:", selectedPool.value);
}

const confirmThisTrim : ConfirmationCallback = () => {
	confirmTrim.value = true;
}

const updateShowTrimPool = (newVal) => {
	showTrimModal.value = newVal;
}

watch(confirmTrim, async (newValue, oldValue) => {
	if (confirmTrim.value == true) {
		trimming.value = true;
		operationRunning.value = true;
		trimmed.value = false;
		console.log('now trimming:', selectedPool.value);

		if (firstOptionToggle.value) {
			confirmTrim.value = false;	
			showTrimModal.value = false;
			await trimPool(selectedPool.value, firstOptionToggle.value);
		} else {
			confirmTrim.value = false;
			showTrimModal.value = false;
			await trimPool(selectedPool.value);
		}
		trimming.value = false;
		operationRunning.value = false;
		trimmed.value = true;
		messageTimestamp.value = getTimestampString();
		notifications.value.constructNotification('Trim Completed', 'Trim on ' + selectedPool.value!.name + " completed.", 'success');
	}
});

/////////////////// Scrub Pool //////////////////////
/////////////////////////////////////////////////////
const showScrubModal = ref(false);
const confirmScrub = ref(false);
const scrubbed = ref(false);
const scrubbing = ref(false);

async function scrubThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;
	showScrubModal.value = true;

	console.log('preparing to scrub:', selectedPool.value);
}

const confirmThisScrub : ConfirmationCallback = () => {
	confirmScrub.value = true;
}

const updateShowScrubPool = (newVal) => {
	showScrubModal.value = newVal;
}

watch(confirmScrub, async (newVal, oldVal) => {
	if (confirmScrub.value == true) {
		scrubbed.value = false;
		scrubbing.value = true;
		operationRunning.value = scrubbing.value;
		console.log('now scrubbing:', selectedPool.value);
		showScrubModal.value = false;
		await scrubPool(selectedPool.value!);

		scrubbing.value = false;
		operationRunning.value = scrubbing.value;
		scrubbed.value = true;
		
		messageTimestamp.value = getTimestampString();
		notifications.value.constructNotification('Scrub Completed', 'Scrub on ' + selectedPool.value!.name + " completed.", 'success');
	}
});

/////////////////// Export Pool /////////////////////
/////////////////////////////////////////////////////
const showExportModal = ref(false);
const confirmExport = ref(false);
const forceUnmount = ref(false);
const exporting = ref(false);

async function exportThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;
	showExportModal.value = true;

	console.log('preparing to export:', selectedPool.value);
}

const confirmThisExport : ConfirmationCallback = () => {
	confirmExport.value = true;
}

const updateShowExportPool = (newVal) => {
	showExportModal.value = newVal;
}

watch(confirmExport, async (newVal, oldVal) => {
	if (confirmExport.value == true) {
		exporting.value = true;
		operationRunning.value = true;
		console.log('now exporting:', selectedPool.value);
		if (firstOptionToggle.value) {
			exportPool(selectedPool.value!, firstOptionToggle.value);
		} else {
			exportPool(selectedPool.value!);
		}
		notifications.value.constructNotification('Export Completed', 'Export of pool ' + selectedPool.value!.name + " completed.", 'success');
		refreshAllData();
		confirmExport.value = false;
		showExportModal.value = false;
		exporting.value = false;
		operationRunning.value = false;
	}
});


/////////////////// Clear Errors ////////////////////
/////////////////////////////////////////////////////
const cleared = ref(false);

async function clearPoolErrors(poolName) {
	cleared.value = false;
	await clearErrors(poolName);
	cleared.value = true;
}

///////////////////// Add VDev //////////////////////
/////////////////////////////////////////////////////
const showAddVDevModal = ref(false);

function showAddVDev(pool) {
	selectedPool.value = pool;
	console.log(selectedPool);
	showAddVDevModal.value = true;
}

const getIdKey = (name: string) => `${selectedPool.value}-${name}`;

provide('show-pool-deets', showPoolDetails);
provide('current-pool-config', poolConfig);
provide("show-vdev-modal", showAddVDevModal);

provide('show-delete-pool-confirm', showDeletePoolConfirm);
provide('confirm-delete-pool', confirmDelete);

provide("show-resilver-modal", showResilverModal);
provide("confirm-resilver", confirmResilver);

provide("show-trim-modal", showTrimModal);
provide("secure-trim", secureTRIM);
provide("confirm-trim", confirmTrim);

provide("show-export-modal", showExportModal);
provide("force-unmount", forceUnmount);
provide("confirm-export", confirmExport);

provide('show-vdev-modal', showAddVDevModal);
provide('show-pool-deets', showPoolDetails);

provide('modal-confirm-running', operationRunning);
provide('modal-option-one-toggle', firstOptionToggle);
provide('modal-option-two-toggle', secondOptionToggle);
provide('modal-option-three-toggle', thirdOptionToggle);
provide('modal-option-four-toggle', fourthOptionToggle);
</script>