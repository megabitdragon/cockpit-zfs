<template>
	<button v-on:dblclick="showDetails(props.pool)" class="min-w-96 w-full min-h-96 h-full">
		<Card :bgColor="'bg-default'" :titleSection="true" :contentSection="true" :footerSection="true" class="mt-2 mb-4 min-w-96 w-full min-h-96 h-full overflow-visible bg-plugin-header rounded-md border border-default">
			<template v-slot:title>
				<div class="flex flex-row justify-between">
					<div class="text-default">
						{{ props.pool.name }}
					</div>
					<Menu as="div" class="relative inline-block text-right">
						<div>
							<MenuButton class="rounded-full p-1 bg-default text-default hover:text-gray-600">
								<span class="sr-only">Open options</span>
								<EllipsisVerticalIcon class="w-5" aria-hidden="true" />
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
										<a v-if="!scanActivity!.isActive" href="#" @click="resilverThisPool(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resilver Pool</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a v-if="!scanActivity!.isActive" href="#" @click="scrubThisPool(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Scrub Pool</a>
										<a v-if="scanActivity!.isActive && scanActivity!.isPaused && scanOperation == 'SCRUB'" href="#" @click="resumeScrub(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resume Scrub</a>
										<a v-if="scanActivity!.isActive && !scanActivity!.isPaused && scanOperation == 'SCRUB'" href="#" @click="pauseScrub(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pause Scrub</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a v-if="scanActivity!.isActive && scanOperation == 'SCRUB'" href="#" @click="stopScrub(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Cancel Scrub</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a v-if="!trimActivity!.isActive && !trimActivity!.isPaused && pool.diskType != 'HDD'" href="#" @click="trimThisPool(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">TRIM Pool</a>
										<a v-if="trimActivity!.isPaused && pool.diskType != 'HDD'" href="#" @click="resumeTrim(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resume TRIM (Pool)</a>
										<a v-if="trimActivity!.isActive && pool.diskType != 'HDD'" href="#" @click="pauseTrim(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pause TRIM (Pool)</a>
									</MenuItem>									
									<MenuItem as="div" v-slot="{ active }">
										<a v-if="trimActivity!.isActive || trimActivity!.isPaused && pool.diskType != 'HDD'" href="#" @click="stopTrim(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Cancel TRIM (Pool)</a>
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
						<span class="font-semibold" :class="formatStatus(props.pool.status)">{{props.pool.status}}</span>
					</div>
					<div v-if="props.pool.status == 'ONLINE'">
						<CheckCircleIcon class="aspect-square w-5 text-green-400"/>
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
						Empty
					</div>
				</div>
				
			</template>
			<template v-slot:content>
				<div class="grid grid-rows-3">
					<p class="row-start-1">Used {{ props.pool.properties.allocated }}</p>
					<p class="row-start-2">Free {{ props.pool.properties.free }}</p>
					<p class="row-start-3"><b>Total {{ props.pool.properties.size }}</b></p>
				</div>
			</template>
			<template v-slot:footer>
				<div class="grid grid-cols-4 gap-1 min-h-full w-full h-max rounded-sm justify-center">
					<Status :pool="props.pool" :isTrim="false" :isDisk="false" :isPoolList="false" :isPoolDetail="false" class="col-span-4" :idKey="'scrub-status-box'" ref="scanStatus"/>
				</div>
				<div class="grid grid-cols-4 gap-1 min-h-full w-full h-max rounded-sm justify-center">
					<Status :pool="props.pool" :isTrim="true" :isDisk="false" :isPoolList="false" :isPoolDetail="false" class="col-span-4" :idKey="'stats-status-box'" ref="trimStatus"/>
				</div>
			</template>
		</Card>
	</button>

	<div v-if="showPoolDetails">	
		<component :is="poolDetailsComponent" :pool="selectedPool!" @close="showPoolDetails = false"/>
	</div>

	<div v-if="showAddVDevModal">	
		<component :is="showAddVDevComponent" @close="showAddVDevModal = false" :idKey="getIdKey(`show-vdev-modal`)" :pool="selectedPool!" :marginTop="'mt-28'"/>
	</div>

	<div v-if="showDeletePoolConfirm">
		<component :is="deleteConfirmComponent" :showFlag="showDeletePoolConfirm" @close="updateShowDestroyPool" :idKey="'confirm-destroy-pool'" :item="'pool'" :operation="'destroy'" :pool="selectedPool!" :confirmOperation="confirmThisDestroy" :firstOption="'force unmount'" :secondOption="'clear disk labels'" :hasChildren="false"/>
	</div>

	<div v-if="showResilverModal">
		<component :is="resilverConfirmComponent" :showFlag="showResilverModal" @close="updateShowResilverPool" :idKey="'confirm-resilver-pool'" :item="'pool'" :operation="'resilver'" :pool="selectedPool!" :confirmOperation="confirmThisResilver" :hasChildren="false"/>
	</div>

	<div v-if="showTrimModal">
		<component :is="trimConfirmComponent" :showFlag="showTrimModal" @close="updateShowTrimPool" :idKey="'confirm-trim-pool'" :item="'pool'" :operation="'trim'" :pool="selectedPool!" :confirmOperation="confirmThisTrim" :firstOption="'secure TRIM'" :hasChildren="false"/>
	</div>

	<div v-if="showPauseTrimConfirm">
		<component :is="trimPauseConfirmComponent" :showFlag="showPauseTrimConfirm" @close="updateShowPauseTrim" :idKey="'confirm-pause-trim'" :item="'pool'" :operation="'pause'" :operation2="'trim'" :pool="selectedPool!" :confirmOperation="confirmPauseThisTrim" :hasChildren="false"/>
	</div>

	<div v-if="showStopTrimConfirm">
		<component :is="trimStopConfirmComponent" :showFlag="showStopTrimConfirm" @close="updateShowStopTrim" :idKey="'confirm-stop-trim'" :item="'pool'" :operation="'stop'" :operation2="'trim'" :pool="selectedPool!" :confirmOperation="confirmStopThisTrim" :hasChildren="false"/>
	</div>
	
	<div v-if="showScrubModal">
		<component :is="scrubConfirmComponent" :showFlag="showScrubModal" @close="updateShowScrubPool" :idKey="'confirm-scrub-pool'" :item="'pool'" :operation="'scrub'" :pool="selectedPool!" :confirmOperation="confirmThisScrub" :hasChildren="false"/>
	</div>

	<div v-if="showPauseScrubConfirm">
		<component :is="scrubPauseConfirmComponent" :showFlag="showPauseScrubConfirm" @close="updateShowPauseScrub" :idKey="'confirm-pause-scrub'" :item="'pool'" :operation="'pause'" :operation2="'scrub'" :pool="selectedPool!" :confirmOperation="confirmPauseThisScrub" :hasChildren="false"/>
	</div>

	<div v-if="showStopScrubConfirm">
		<component :is="scrubStopConfirmComponent" :showFlag="showStopScrubConfirm" @close="updateShowStopScrub" :idKey="'confirm-stop-scrub'" :item="'pool'" :operation="'stop'" :operation2="'scrub'" :pool="selectedPool!" :confirmOperation="confirmStopThisScrub" :hasChildren="false"/>
	</div>

	<div v-if="showExportModal">
		<component :is="exportConfirmComponent" :showFlag="showExportModal" @close="updateShowExportPool" :idKey="'confirm-export-pool'" :item="'pool'" :operation="'export'" :pool="selectedPool!" :confirmOperation="confirmThisExport" :firstOption="'force unmount'" :hasChildren="false"/>
	</div>

</template>

<script setup lang="ts">
import { ref, inject, Ref, computed, provide, watch} from "vue";
import { EllipsisVerticalIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { loadDatasets, loadDisksThenPools, loadScanObjectGroup, loadDiskStats } from '../../composables/loadData';
import { destroyPool, trimPool, scrubPool, resilverPool, clearErrors, exportPool } from "../../composables/pools";
import { labelClear } from "../../composables/disks";
import { loadScanActivities, loadTrimActivities, formatStatus } from '../../composables/helpers'
import Card from '../common/Card.vue';
import Status from '../common/Status.vue';

interface DashPoolCardProps {
	pool: PoolData;
}

const notifications = inject<Ref<any>>('notifications')!;
	
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
const firstOptionToggle = ref(false);
const secondOptionToggle = ref(false);
const thirdOptionToggle = ref(false);
const fourthOptionToggle = ref(false);

////////////// Show Pool/Disk Details ///////////////
/////////////////////////////////////////////////////
const showPoolDetails = ref(false);

const poolDetailsComponent = ref();
const loadShowPoolComponent = async () => {
	const module = await import('../pools/PoolDetail.vue');
	poolDetailsComponent.value = module.default;
}

async function showDetails(pool) {
	selectedPool.value = pool;
	console.log('loading:', selectedPool);
	await loadShowPoolComponent();
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
const scanObjectGroup = inject<Ref<PoolScanObjectGroup>>('scan-object-group')!;
const poolDiskStats = inject<Ref<PoolDiskStats>>('pool-disk-stats')!;

const scanOperation = computed(() => {
	// console.log('scanOperation changed:', scanObjectGroup.value[props.pool.name].function);
	return scanObjectGroup.value[props.pool.name].function;
});

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
const clearLabels = inject<Ref<boolean>>('clear-labels')!;
const selectedDisk = ref<DiskData>();

const deleteConfirmComponent = ref();
const loadDeleteConfirmComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	deleteConfirmComponent.value = module.default;
}

async function destroyPoolAndUpdate(pool) {
	operationRunning.value = false;
	selectedPool.value = pool;
	clearLabels.value = false;
	await loadDeleteConfirmComponent();
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

const resilverConfirmComponent = ref();
const loadResilverConfirmComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	resilverConfirmComponent.value = module.default;
}

async function resilverThisPool(pool) {
	selectedPool.value = pool;
	await loadResilverConfirmComponent();
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
		resilvered.value = false;
		resilvering.value = true;
		operationRunning.value = resilvering.value;
		
		console.log('now resilvering:', selectedPool.value);
		showResilverModal.value = false;
		resilverAndScan();

		confirmResilver.value = false;
		resilvered.value = true;
		resilvering.value = false;
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

const scrubConfirmComponent = ref();
const loadScrubConfirmComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	scrubConfirmComponent.value = module.default;
}

const scrubPauseConfirmComponent = ref();
const loadScrubPauseConfirmComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	scrubPauseConfirmComponent.value = module.default;
}

const scrubStopConfirmComponent = ref();
const loadScrubStopConfirmComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	scrubStopConfirmComponent.value = module.default;
}

async function scrubThisPool(pool) {
	// cleared.value = false;
	selectedPool.value = pool;
	await loadScrubConfirmComponent();
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

async function pauseScrub(pool) {
	selectedPool.value = pool;
	await loadScrubPauseConfirmComponent();
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

async function stopScrub(pool) {
	selectedPool.value = pool;
	await loadScrubStopConfirmComponent();
	showStopScrubConfirm.value = true;
	console.log('scrub to stop:', selectedPool.value);
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

const trimConfirmComponent = ref();
const loadTrimConfirmComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	trimConfirmComponent.value = module.default;
}

const trimPauseConfirmComponent = ref();
const loadTrimPauseConfirmComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	trimPauseConfirmComponent.value = module.default;
}

const trimStopConfirmComponent = ref();
const loadTrimStopConfirmComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	trimStopConfirmComponent.value = module.default;
}

async function trimThisPool(pool) {
	// cleared.value = false;
	selectedPool.value = pool;
	await loadTrimConfirmComponent();
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

async function pauseTrim(pool) {
	selectedPool.value = pool;
	await loadTrimPauseConfirmComponent();
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

async function stopTrim(pool) {
	selectedPool.value = pool;
	await loadTrimStopConfirmComponent();
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

const exportConfirmComponent = ref();
const loadExportConfirmComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	exportConfirmComponent.value = module.default;
}

async function exportThisPool(pool) {
	// cleared.value = false;
	selectedPool.value = pool;
	await loadExportConfirmComponent();
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

///////////////////// Add VDev //////////////////////
/////////////////////////////////////////////////////
const showAddVDevModal = ref(false);
const showAddVDevComponent = ref();
const loadShowAddVDevComponent = async () => {
	const module = await import('../pools/AddVDevModal.vue');
	showAddVDevComponent.value = module.default;
}

async function showAddVDev(pool) {
	selectedPool.value = pool;
	console.log(selectedPool);
	await loadShowAddVDevComponent();
	showAddVDevModal.value = true;
}

///////////////////// Scanning //////////////////////
/////////////////////////////////////////////////////
// const scanObjectGroup = inject<Ref<PoolScanObjectGroup>>('scan-object-group')!;
const scanStatus = ref();
// const scanActivity = inject<Ref<Activity>>('scan-activity')!;

async function getScanStatus() {
	await scanStatus.value.pollScanStatus();
	// console.log(`Dashboard scan values for ${props.pool.name}: \n 
    //     isActive:${scanActivity.value.isActive}\n
    //     isPaused:${scanActivity.value.isPaused}\n
    //     isFinished:${scanActivity.value.isFinished}\n
    //     isCanceled:${scanActivity.value.isCanceled}\n
    //     ------`);
}

//////////// Checking Disk Stats (Trim) /////////////
/////////////////////////////////////////////////////
// const poolDiskStats = inject<Ref<PoolDiskStats>>('pool-disk-stats')!;
const trimStatus = ref();
// const trimActivity = inject<Ref<Activity>>('trim-activity')!;

async function getTrimStatus() {
	await trimStatus.value.pollTrimStatus();
	// console.log(`Dashboard trim values for ${props.pool.name}: \n 
    //     isActive:${trimActivity.value.isActive}\n
    //     isPaused:${trimActivity.value.isPaused}\n
    //     isFinished:${trimActivity.value.isFinished}\n
    //     isCanceled:${trimActivity.value.isCanceled}\n
    //     ******`);
}

/////////////////////////////////////////////////////
// const scanActivities = ref<Map<string, Activity>>(new Map());
// const trimActivities = ref<Map<string, Activity>>(new Map());
const scanActivities = inject<Ref<Map<string, Activity>>>('scan-activities')!;
const trimActivities = inject<Ref<Map<string, Activity>>>('trim-activities')!;

const poolID = ref(props.pool.name);
const scanActivity = computed(() => {
	return scanActivities.value.get(poolID.value);
});
const trimActivity = computed(() => {
	return trimActivities.value.get(poolID.value);
});


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