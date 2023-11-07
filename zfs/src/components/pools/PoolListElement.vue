<template>
	<div>
		<Accordion :btnColor="'btn-primary'" :gridSize="'grid-cols-10'" :btnColSpan="'col-span-1'" :titleColSpan="'col-span-9'" :contentColSpan="'col-span-10'" :isOpen="false" class="bg-default rounded-b-md border border-solid border-default">
			<template v-slot:title>
				<div class="grid grid-cols-9 grid-flow-cols w-full justify-center text-center">
					<button @click="showPoolModal(poolData[props.poolIdx])!" class="grid grid-cols-8 col-span-8 hover:bg-accent pt-1 rounded-r-md">
						<div class="py-6 mt-1 col-span-1">{{ poolData[props.poolIdx].name }}</div>
						<div class="py-6 mt-1 col-span-1">{{ poolData[props.poolIdx].status }}</div>
						<div class="py-6 mt-1 col-span-1">
							<div class="w-full bg-well rounded-full text-center">
								<div v-if="poolData[props.poolIdx].properties.capacity! < 1" class="w-full bg-well rounded-full h-6 mt-0.5 text-center relative flex">
									<div class="absolute inset-0 flex items-center justify-center text-s font-medium text-default p-0.5 leading-none">
										{{ poolData[props.poolIdx].properties.capacity }}%
									</div>
								</div>
								<div v-if="poolData[props.poolIdx].properties.capacity >= 1" class="w-full bg-well rounded-full relative flex h-6 mt-0.5 min-h-min max-h-max overflow-hidden">
									<div class="bg-green-600 h-6 min-h-min max-h-max" :style="{ width: `${poolData[props.poolIdx].properties.capacity}%` }">
										<div class="absolute inset-0 flex items-center justify-center text-s font-medium text-default text-center p-0.5 leading-none">
											{{ poolData[props.poolIdx].properties.capacity }}%
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="py-6 mt-1 col-span-1">{{ poolData[props.poolIdx].properties.allocated }}</div>
						<div class="py-6 mt-1 col-span-1">{{ poolData[props.poolIdx].properties.free }}</div>
						<div class="py-6 mt-1 col-span-1">{{ poolData[props.poolIdx].properties.size }}</div>
						<div class="py-6 -mt-2 col-span-2">
							<Status :pool="poolData[props.poolIdx]" :isDisk="false" :isTrim="false" :isPoolList="true" :isPoolDetail="false" :idKey="'scan-status-box'" ref="scanStatusBox"/>
						</div>
					</button>
					<div class="relative py-6 mt-1 p-3 text-right font-medium sm:pr-6 lg:pr-8">
						<Menu as="div" class="relative inline-block text-right -mt-1">
							<div>
								<MenuButton class="flex items-center rounded-full bg-accent p-2 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
									<span class="sr-only">Open options</span>
									<EllipsisVerticalIcon class="w-5" aria-hidden="true" />
								</MenuButton>
							</div>

							<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
								<MenuItems class="absolute right-0 z-10 mt-2 w-max origin-top-left rounded-md bg-accent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									<div class="py-1">
										<MenuItem as="div" v-slot="{ active }">
											<a href="#" @click="showPoolModal(poolData[props.poolIdx])!" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pool Details</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
											<a href="#" @click="clearPoolErrors(poolData[props.poolIdx].name)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Pool Errors</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
											<a href="#" @click="resilverThisPool(poolData[props.poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resilver Pool</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
											<a v-if="!scanActivity!.isActive" href="#" @click="scrubThisPool(poolData[props.poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Scrub Pool</a>
											<a v-if="scanActivity!.isActive && scanActivity!.isPaused" href="#" @click="resumeScrub(poolData[props.poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resume Scrub</a>
											<a v-if="scanActivity!.isActive && !scanActivity!.isPaused" href="#" @click="pauseScrub(poolData[props.poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pause Scrub</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
											<a v-if="scanActivity!.isActive" href="#" @click="stopScrub(poolData[props.poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Cancel Scrub</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
											<a v-if="!trimActivity!.isActive && !trimActivity!.isPaused && poolData[props.poolIdx].diskType != 'HDD'" href="#" @click="trimThisPool(poolData[props.poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">TRIM Pool</a>
											<a v-if="trimActivity!.isPaused && poolData[props.poolIdx].diskType != 'HDD'" href="#" @click="resumeTrim(poolData[props.poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resume TRIM (Pool)</a>
											<a v-if="trimActivity!.isActive && poolData[props.poolIdx].diskType != 'HDD'" href="#" @click="pauseTrim(poolData[props.poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pause TRIM (Pool)</a>
										</MenuItem>									
										<MenuItem as="div" v-slot="{ active }">
											<a v-if="trimActivity!.isActive || trimActivity!.isPaused && poolData[props.poolIdx].diskType != 'HDD'" href="#" @click="stopTrim(poolData[props.poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Cancel TRIM (Pool)</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
											<a href="#" @click="showAddVDev(poolData[props.poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Add Virtual Device</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
											<a href="#" @click="exportThisPool(poolData[props.poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Export Pool</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
											<a href="#" @click="destroyPoolAndUpdate(poolData[props.poolIdx])" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy Pool</a>
										</MenuItem>
									</div>
								</MenuItems>
							</transition>
						</Menu>
					</div>
				</div>
				
			</template>
			<template v-slot:content>
				<div v-for="vDev, vDevIdx in poolData[props.poolIdx].vdevs" :key="vDevIdx">
					<VDevElement :pool="poolData[props.poolIdx]" :poolIdx="props.poolIdx" :vDev="vDev" :vDevIdx="vDevIdx" ref="vDevElement"/>
				</div>
			</template>
		</Accordion>
	</div>

	<div v-if="showPoolDetails">
		<PoolDetail :pool="selectedPool!" @close="showPoolDetails = false"/>
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

	<div v-if="showAddVDevModal">
		<AddVDevModal @close="showAddVDevModal = false" :idKey="'show-vdev-modal'" :pool="selectedPool!" :marginTop="'mt-28'"/>
	</div>


	<div v-if="showPauseScrubConfirm">
		<UniversalConfirmation :showFlag="showPauseScrubConfirm" @close="updateShowPauseScrub" :idKey="'confirm-pause-scrub'" :item="'pool'" :operation="'pause'" :operation2="'scrub'" :pool="selectedPool!" :confirmOperation="confirmPauseThisScrub" :hasChildren="false"/>
	</div>

	<div v-if="showStopScrubConfirm">
		<UniversalConfirmation :showFlag="showStopScrubConfirm" @close="updateShowStopScrub" :idKey="'confirm-stop-scrub'" :item="'pool'" :operation="'stop'" :operation2="'scrub'" :pool="selectedPool!" :confirmOperation="confirmStopThisScrub" :hasChildren="false"/>
	</div>

	<div v-if="showPauseTrimConfirm">
		<UniversalConfirmation :showFlag="showPauseTrimConfirm" @close="updateShowPauseTrim" :idKey="'confirm-pause-trim'" :item="'pool'" :operation="'pause'" :operation2="'trim'" :pool="selectedPool!" :confirmOperation="confirmPauseThisTrim" :hasChildren="false"/>
	</div>

	<div v-if="showStopTrimConfirm">
		<UniversalConfirmation :showFlag="showStopTrimConfirm" @close="updateShowStopTrim" :idKey="'confirm-stop-trim'" :item="'pool'" :operation="'stop'" :operation2="'trim'" :pool="selectedPool!" :confirmOperation="confirmStopThisTrim" :hasChildren="false"/>
	</div>
</template>
<script setup lang="ts">
import { ref, inject, Ref, provide, watch, computed, ComputedRef, onMounted, nextTick } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { destroyPool, trimPool, scrubPool, resilverPool, clearErrors, exportPool, removeVDevFromPool } from "../../composables/pools";
import { labelClear, detachDisk, offlineDisk, onlineDisk, trimDisk } from "../../composables/disks";
import { loadDatasets, loadDisksThenPools, loadScanObjectGroup, loadDiskStats } from '../../composables/loadData';
import { removeActivity, loadScanActivities, loadTrimActivities } from '../../composables/helpers';
import VDevElement from "./VDevElement.vue";
import PoolDetail from "./PoolDetail.vue";
import AddVDevModal from "../pools/AddVDevModal.vue";
import Accordion from '../common/Accordion.vue';
import UniversalConfirmation from "../common/UniversalConfirmation.vue";
import Status from "../common/Status.vue";

interface PoolListElementProps {
    poolIdx: number;
	pool: PoolData;
}

const props = defineProps<PoolListElementProps>();

const notifications = inject<Ref<any>>('notifications')!;

const selectedPool = ref<PoolData>();
const selectedDisk = ref<DiskData>();
const selectedVDev = ref<vDevData>();

const scanObjectGroup = inject<Ref<PoolScanObjectGroup>>('scan-object-group')!;
const poolDiskStats = inject<Ref<PoolDiskStats>>('pool-disk-stats')!;

const clearLabels = inject<Ref<boolean>>('clear-labels')!;

///////// Values for Confirmation Modals ////////////
/////////////////////////////////////////////////////
const operationRunning = ref(false);
const firstOptionToggle = ref(false);
const secondOptionToggle = ref(false);
const thirdOptionToggle = ref(false);
const fourthOptionToggle = ref(false);

////////////// Show Pool/Disk Details ///////////////
/////////////////////////////////////////////////////
const showPoolDetails = ref(false);
//const showDiskDetails = ref(false);

function showPoolModal(pool) {
	selectedPool.value = pool;
	console.log(selectedPool);
	showPoolDetails.value = true;
}

/////////////// Loading/Refreshing //////////////////
/////////////////////////////////////////////////////
const poolData = inject<Ref<PoolData[]>>("pools")!;
const diskData = inject<Ref<DiskData[]>>("disks")!;
const filesystemData = inject<Ref<FileSystemData[]>>('datasets')!;
const disksLoaded = inject<Ref<boolean>>('disks-loaded')!;
const poolsLoaded = inject<Ref<boolean>>('pools-loaded')!;
const fileSystemsLoaded = inject<Ref<boolean>>('datasets-loaded')!;

async function refreshAllData() {
	disksLoaded.value = false;
	poolsLoaded.value = false;
	fileSystemsLoaded.value = false;
	diskData.value = [];
	poolData.value = [];
	filesystemData.value = [];
	await loadDisksThenPools(diskData, poolData);
	await loadDatasets(filesystemData);
	await loadScanObjectGroup(scanObjectGroup);
	await loadScanActivities(poolData, scanActivities);
	await loadDiskStats(poolDiskStats);
	await loadTrimActivities(poolData, trimActivities);
	disksLoaded.value = true;
	poolsLoaded.value = true;
	fileSystemsLoaded.value = true;
}

////////////////// Destroy Pool /////////////////////
/////////////////////////////////////////////////////
const confirmDelete = ref(false);
const showDeletePoolConfirm = ref(false);
const hasChildren = ref(false);
const forceDestroy = ref(false);

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
			removeActivity(selectedPool.value!.name, scanActivities.value[selectedPool.value!.name]);
			removeActivity(selectedPool.value!.name, trimActivities.value[selectedPool.value!.name]);
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

async function resilverAndScan() {
	await resilverPool(selectedPool.value!);
	getScanStatus();
}

watch(confirmResilver, async (newValue, oldValue) => {
	if (confirmResilver.value == true) {
		operationRunning.value = true;
		resilvered.value = false;
		console.log('now resilvering:', selectedPool.value);

		showResilverModal.value = false;
		await resilverAndScan();

		confirmResilver.value = false;
		resilvered.value = true;
		operationRunning.value = false;

		notifications.value.constructNotification('Resilver Started', 'Resilver on ' + selectedPool.value!.name + " started.", 'success');
	}
});

/////////////////// Scrub Pool //////////////////////
/////////////////////////////////////////////////////
const showScrubModal = ref(false);
const confirmScrub = ref(false);
const starting = ref(false);
const pausing = ref(false);
const stopping = ref(false);
const resuming = ref(false);

async function scrubThisPool(pool) {
	// cleared.value = false;
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

async function scrubAndScan() {
	starting.value = true;
	await scrubPool(selectedPool.value!);
	getScanStatus();
	starting.value = false;
}

watch(confirmScrub, async (newVal, oldVal) => {
	if (confirmScrub.value == true) {
		operationRunning.value = true;

		console.log('now scrubbing:', selectedPool.value);
		showScrubModal.value = false;

		await scrubAndScan();

		confirmScrub.value = false;
		operationRunning.value = false;
		
		notifications.value.constructNotification('Scrub Started', 'Scrub on ' + selectedPool.value!.name + " started.", 'success');
	}
});

function pauseScrub(pool) {
	selectedPool.value = pool;
	showPauseScrubConfirm.value = true;
	console.log('scrub to pause:', selectedPool.value);
}

async function pauseScrubAndScan() {
	pausing.value = true;
	await scrubPool(selectedPool.value, 'pause');
	getScanStatus();
	pausing.value = false;
}

async function resumeScrub(pool) {
	resuming.value = true;
	await scrubPool(pool);
	getScanStatus();
	resuming.value = false
}

function stopScrub(pool) {
	selectedPool.value = pool;
	showStopScrubConfirm.value = true;
	console.log('scrub to pause:', selectedPool.value);
}

async function stopScrubAndScan() {
	stopping.value = true;
	await scrubPool(selectedPool.value, 'stop');
	getScanStatus();
	stopping.value = false;
}

const showPauseScrubConfirm = ref(false);
const confirmPauseScrub = ref(false);

const confirmPauseThisScrub : ConfirmationCallback = () => {
	confirmPauseScrub.value = true;
}

const updateShowPauseScrub = (newVal) => {
	showPauseScrubConfirm.value = newVal;
}

watch(confirmPauseScrub, async (newVal, oldVal) => {
	if (confirmPauseScrub.value == true) {
		console.log('now pausing scrub:', selectedPool.value);
		showPauseScrubConfirm.value = false;
		await pauseScrubAndScan();
		confirmPauseScrub.value = false;
		notifications.value.constructNotification('Scrub Paused', 'Scrub on ' + selectedPool.value!.name + " paused.", 'success');
	}
});

const showStopScrubConfirm = ref(false);
const confirmStopScrub = ref(false);

const confirmStopThisScrub : ConfirmationCallback = () => {
	confirmStopScrub.value = true;
}

const updateShowStopScrub = (newVal) => {
	showStopScrubConfirm.value = newVal;
}

watch(confirmStopScrub, async (newVal, oldVal) => {
	if (confirmStopScrub.value == true) {
		console.log('now stopping scrub:', selectedPool.value);
		showStopScrubConfirm.value = false;
		await stopScrubAndScan();
		confirmStopScrub.value = false;
		notifications.value.constructNotification('Scrub Stopped', 'Scrub on ' + selectedPool.value!.name + " stopped.", 'success');
	}
});

//////////////////// TRIM Pool //////////////////////
/////////////////////////////////////////////////////
const showTrimModal = ref(false);
const confirmTrim = ref(false);
const secureTRIM = ref(false);
const startingTrim = ref(false);
const pausingTrim = ref(false);
const stoppingTrim = ref(false);
const resumingTrim = ref(false);

async function trimThisPool(pool) {
	// cleared.value = false;
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

async function trimAndScan() {
	startingTrim.value = true;
	if (firstOptionToggle.value) {
		await trimPool(selectedPool.value!, firstOptionToggle.value);
		getTrimStatus();
	} else {
		await trimPool(selectedPool.value!);
		getTrimStatus();
	}
	startingTrim.value = false;
}

watch(confirmTrim, async (newValue, oldValue) => {
	if (confirmTrim.value == true) {
		operationRunning.value = true;
		console.log('now trimming:', selectedPool.value);

		if (firstOptionToggle.value) {
			confirmTrim.value = false;	
			showTrimModal.value = false;
			await trimAndScan();
		} else {
			confirmTrim.value = false;
			showTrimModal.value = false;
			await trimAndScan();
		}
		operationRunning.value = false;

		notifications.value.constructNotification('Trim Started', 'Trim on ' + selectedPool.value!.name + " started.", 'success');
	}
});

function pauseTrim(pool) {
	selectedPool.value = pool;
	showPauseTrimConfirm.value = true;
	console.log('trim to pause:', selectedPool.value);
}

async function pauseTrimAndScan() {
	pausingTrim.value = true;
	await trimPool(selectedPool.value!, false, 'pause');
	getTrimStatus();
	pausingTrim.value = false;
}

async function resumeTrim(pool) {
	resumingTrim.value = true;
	// checkingDiskStats.value = true;
	await trimPool(pool);
	getTrimStatus();
	// pollTrim();
	resumingTrim.value = false
}

function stopTrim(pool) {
	selectedPool.value = pool;
	showStopTrimConfirm.value = true;
	console.log('trim to stop:', selectedPool.value);
}

async function stopTrimAndScan() {
	stoppingTrim.value = true;
	await trimPool(selectedPool.value!, false, 'stop');
	getTrimStatus();
	stoppingTrim.value = false;
}

const showPauseTrimConfirm = ref(false);
const confirmPauseTrim = ref(false);

const confirmPauseThisTrim : ConfirmationCallback = () => {
	confirmPauseTrim.value = true;
}

const updateShowPauseTrim = (newVal) => {
	showPauseTrimConfirm.value = newVal;
}

watch(confirmPauseTrim, async (newVal, oldVal) => {
	if (confirmPauseTrim.value == true) {
		console.log('now pausing trim:', selectedPool.value);
		showPauseTrimConfirm.value = false;
		await pauseTrimAndScan();
		confirmPauseTrim.value = false;
		notifications.value.constructNotification('Trim Paused', 'Trim on ' + selectedPool.value!.name + " paused.", 'success');
	}
});

const showStopTrimConfirm = ref(false);
const confirmStopTrim = ref(false);

const confirmStopThisTrim : ConfirmationCallback = () => {
	confirmStopTrim.value = true;
}

const updateShowStopTrim = (newVal) => {
	showStopTrimConfirm.value = newVal;
}

watch(confirmStopTrim, async (newVal, oldVal) => {
	if (confirmStopTrim.value == true) {
		console.log('now stopping trim:', selectedPool.value);
		showStopTrimConfirm.value = false;
		await stopTrimAndScan();
		confirmStopTrim.value = false;
		notifications.value.constructNotification('Trim Stopped', 'Trim on ' + selectedPool.value!.name + " stopped.", 'success');
	}
});

/////////////////// Export Pool /////////////////////
/////////////////////////////////////////////////////
const showExportModal = ref(false);
const confirmExport = ref(false);
const forceUnmount = ref(false);
const exporting = ref(false);

async function exportThisPool(pool) {
	// cleared.value = false;
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
// const cleared = ref(false);

async function clearPoolErrors(poolName) {
	// cleared.value = false;
	await clearErrors(poolName);
	// cleared.value = true;
}

///////////////// Add/Remove VDev ///////////////////
/////////////////////////////////////////////////////
const showAddVDevModal = ref(false);

const showRemoveVDevConfirm = ref(false);
const confirmRemove = ref(false);

function showAddVDev(pool) {
	selectedPool.value = pool;
	console.log(selectedPool);
	showAddVDevModal.value = true;
}

/////////////////////////////////////////////////////


///////////////////// Scanning //////////////////////
/////////////////////////////////////////////////////
// const scanObjectGroup = inject<Ref<PoolScanObjectGroup>>('scan-object-group')!;
const scanStatusBox = ref();
// const scanActivity = inject<Ref<Activity>>('scan-activity')!;
const scanActivities = inject<Ref<Map<string, Activity>>>('scan-activities')!;
	
async function getScanStatus() {
	console.log('scanStatusBox', scanStatusBox.value);

	await scanStatusBox.value.pollScanStatus();
}

//////////// Checking Disk Stats (Trim) /////////////
/////////////////////////////////////////////////////
// const poolDiskStats = inject<Ref<PoolDiskStats>>('pool-disk-stats')!;
const vDevElement = ref();
// const trimActivity = inject<Ref<Activity>>('trim-activity')!;
const trimActivities = inject<Ref<Map<string, Activity>>>('trim-activities')!;
	
async function getTrimStatus() {
	console.log('vDevElement', vDevElement.value);

	await vDevElement.value[0].getDiskStatus();
}

/////////////////////////////////////////////////////

const poolID = ref(props.pool.name);
const scanActivity = computed(() => {
	return scanActivities.value.get(poolID.value);
});
const trimActivity = computed(() => {
	return trimActivities.value.get(poolID.value);
});


// provide('show-wizard', showWizard);
provide('show-pool-deets', showPoolDetails);

provide('show-delete-pool-confirm', showDeletePoolConfirm);
provide('confirm-delete-pool', confirmDelete);
provide('has-children', hasChildren);
provide('force-destroy', forceDestroy);

provide("show-resilver-modal", showResilverModal);
provide("confirm-resilver", confirmResilver);

provide("show-trim-modal", showTrimModal);
provide("secure-trim", secureTRIM);
provide("confirm-trim", confirmTrim);

provide("show-export-modal", showExportModal);
provide("confirm-export", confirmExport);
provide("force-unmount", forceUnmount);

provide('show-remove-modal', showRemoveVDevConfirm);
provide('confirm-remove', confirmRemove);

// provide("show-import-modal", showImportModal);
provide("show-vdev-modal", showAddVDevModal);
// provide('show-attach-modal', showAttachDiskModal);
// provide('show-detach-modal', showDetachDiskModal);
// provide('confirm-detach', confirmDetach);
// provide('show-replace-modal', showReplaceDiskModal);

provide('modal-confirm-running', operationRunning);
provide('modal-option-one-toggle', firstOptionToggle);
provide('modal-option-two-toggle', secondOptionToggle);
provide('modal-option-three-toggle', thirdOptionToggle);
provide('modal-option-four-toggle', fourthOptionToggle);

</script>