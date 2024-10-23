<template>
	<div class="">
		<div class="">
			<Disclosure v-slot="{ open }" :defaultOpen="false">
				<DisclosureButton class="bg-default grid grid-cols-10 grid-flow-cols w-full justify-center text-center">
					<div class="py-1 mt-1 mr-2 col-span-1 ml-4 justify-self-start"
						:title="poolData[props.poolIdx].name">
						<ChevronUpIcon class="-mt-2 h-10 w-10 text-default transition-all duration-200 transform"
							:class="{ 'rotate-90': !open, 'rotate-180': open, }" />
					</div>
					<div class="py-1 mt-1 col-span-1 justify-start text-left flex flex-row" :class="truncateText"
						:title="poolData[props.poolIdx].name">
						{{ poolData[props.poolIdx].name}}
						<div v-if="upgradeablePool"
							title="Pool was made with a legacy version of ZFS. Upgrade available."
							class="flex flex-row justify-between w-fit bg-default rounded-full items-center">
							<ExclamationCircleIcon class="ml-2 w-5 text-orange-700" />
						</div>
					</div>
					<!-- 	<div class="py-1 mt-1 col-span-1 justify-between text-left flex flex-row"
						:title="poolData[props.poolIdx].name">
						<span class="justify-self-start text-left" :class="truncateText">
							{{ poolData[props.poolIdx].name }}
						</span>
						<div v-if="upgradeablePool"
							title="Pool was made with a legacy version of ZFS. Upgrade available."
							class="flex flex-row justify-between w-fit bg-default rounded-full items-center">
							<ExclamationCircleIcon class="ml-2 w-5 text-orange-700" />
						</div>
					</div> -->
					<div class="py-1 mt-1 col-span-1 font-semibold"
						:class="[formatStatus(poolData[props.poolIdx].status), truncateText]"
						:title="poolData[props.poolIdx].status">{{ poolData[props.poolIdx].status }}</div>
					<div class="py-1 mt-1 col-span-1">
						<div class="w-full bg-well rounded-full text-center"
							:title="poolData[props.poolIdx].properties.capacity + '%'">
							<div v-if="props.pool.properties.refreservationPercent!">
								<div v-if="Number(props.pool.properties.capacity) >= 1 && Number(props.pool.properties.capacity) < (100 - props.pool.properties.refreservationPercent) - 20"
									class="w-full bg-well rounded-full h-4 mt-1 text-center relative flex overflow-hidden">
									<div class="bg-green-600 h-4"
										:style="{ width: `${Number(props.pool.properties.capacity)}%` }">
										<div
											class="absolute inset-0 flex items-center justify-center text-sm font-medium text-default p-0.5 leading-none">
											{{ Number(props.pool.properties.capacity) }}%
										</div>
									</div>
								</div>

								<div v-else-if="Number(props.pool.properties.capacity) >= ((100 - props.pool.properties.refreservationPercent) - 19) && Number(props.pool.properties.capacity) <= ((100 - props.pool.properties.refreservationPercent) - 10)"
									class="w-full bg-well rounded-full h-4 mt-1 text-center relative flex overflow-hidden">
									<div class="bg-orange-600 h-4"
										:style="{ width: `${Number(props.pool.properties.capacity)}%` }">
										<div
											class="absolute inset-0 flex items-center justify-center text-sm font-medium text-default p-0.5 leading-none">
											{{ Number(props.pool.properties.capacity) }}%
										</div>
									</div>
								</div>

								<div v-else-if="Number(props.pool.properties.capacity) > ((100 - props.pool.properties.refreservationPercent) - 9) && Number(props.pool.properties.capacity) <= (100 - props.pool.properties.refreservationPercent)"
									class="w-full bg-well rounded-full h-4 mt-1 text-center relative flex overflow-hidden">
									<div class="bg-red-600 h-4"
										:style="{ width: `${Number(props.pool.properties.capacity)}%` }">
										<div
											class="absolute inset-0 flex items-center justify-center text-sm font-medium text-default p-0.5 leading-none">
											{{ Number(props.pool.properties.capacity) }}%
										</div>
									</div>
								</div>
								<div v-else
									class="w-full bg-well rounded-full h-4 text-center mt-1 relative flex overflow-hidden">
									<div
										class="absolute inset-0 flex items-center justify-center text-s font-medium text-default p-0.5 leading-none">
										Empty
									</div>
								</div>
							</div>
							<div v-else>
								<div v-if="Number(props.pool.properties.capacity) >= 1 && Number(props.pool.properties.capacity) < 80"
									class="w-full bg-well rounded-full h-4 mt-1 text-center relative flex overflow-hidden">
									<div class="bg-green-600 h-4"
										:style="{ width: `${Number(props.pool.properties.capacity)}%` }">
										<div
											class="absolute inset-0 flex items-center justify-center text-sm font-medium text-default p-0.5 leading-none">
											{{ Number(props.pool.properties.capacity) }}%
										</div>
									</div>
								</div>

								<div v-else-if="Number(props.pool.properties.capacity) >= 80 && Number(props.pool.properties.capacity) <= 90"
									class="w-full bg-well rounded-full h-4 mt-1 text-center relative flex overflow-hidden">
									<div class="bg-orange-600 h-4"
										:style="{ width: `${Number(props.pool.properties.capacity)}%` }">
										<div
											class="absolute inset-0 flex items-center justify-center text-sm font-medium text-default p-0.5 leading-none">
											{{ Number(props.pool.properties.capacity) }}%
										</div>
									</div>
								</div>

								<div v-else-if="Number(props.pool.properties.capacity) > 90 && Number(props.pool.properties.capacity) <= 100"
									class="w-full bg-well rounded-full h-4 mt-1 text-center relative flex overflow-hidden">
									<div class="bg-red-600 h-4"
										:style="{ width: `${Number(props.pool.properties.capacity)}%` }">
										<div
											class="absolute inset-0 flex items-center justify-center text-sm font-medium text-default p-0.5 leading-none">
											{{ Number(props.pool.properties.capacity) }}%
										</div>
									</div>
								</div>
								<div v-else class="w-full bg-well rounded-full h-4 text-center mt-1 relative flex">
									<div
										class="absolute inset-0 flex items-center justify-center text-s font-medium text-default p-0.5 leading-none">
										Empty
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="py-1 mt-1 col-span-1" :class="truncateText"
						:title="poolData[props.poolIdx].properties.allocated">{{
						poolData[props.poolIdx].properties.allocated }}</div>
					<div class="py-1 mt-1 col-span-1" :class="truncateText"
						:title="poolData[props.poolIdx].properties.free">{{ poolData[props.poolIdx].properties.free }}
					</div>
					<div class="py-1 mt-1 col-span-1" :class="truncateText"
						:title="poolData[props.poolIdx].properties.size">{{ poolData[props.poolIdx].properties.size }}
					</div>
					<div class="py-1 -mt-1 col-span-2">
						<Status :pool="poolData[props.poolIdx]" :isDisk="false" :isTrim="false" :isPoolList="true"
							:isPoolDetail="false" :idKey="'scan-status-box'" ref="scanStatusBox" />
					</div>
					<div class="relative py-1 mt-1 p-3 text-right font-medium sm:pr-6 lg:pr-8">
						<Menu as="div" class="relative inline-block text-right -mt-1">
							<div>
								<MenuButton @click.stop
									class="flex items-center rounded-full bg-default p-2 hover:text-default focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
									<span class="sr-only">Open options</span>
									<EllipsisVerticalIcon class="w-5" aria-hidden="true" />
								</MenuButton>
							</div>

							<transition enter-active-class="transition ease-out duration-100"
								enter-from-class="transform opacity-0 scale-95"
								enter-to-class="transform opacity-100 scale-100"
								leave-active-class="transition ease-in duration-75"
								leave-from-class="transform opacity-100 scale-100"
								leave-to-class="transform opacity-0 scale-95">
								<MenuItems @click.stop
									class="absolute right-0 z-10 w-max origin-top-right rounded-md bg-default shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									<div class="py-1">
										<MenuItem as="div" v-slot="{ active }">
										<a href="#" @click="showPoolModal(poolData[props.poolIdx])!"
											:class="[active ? 'bg-accent text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pool
											Details</a>
										</MenuItem>
										<!-- <MenuItem as="div" v-slot="{ active }">
											<a href="#" @click="clearPoolErrors(poolData[props.poolIdx].name)" :class="[active ? 'bg-accent text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Pool Errors</a>
										</MenuItem> -->
										<MenuItem as="div" v-slot="{ active }">
										<a v-if="upgradeablePool" href="#" @click="upgradeThisPool(props.pool)!"
											:class="[active ? 'bg-orange-700 text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Upgrade
											Pool</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
										<a v-if="!scanActivity!.isActive" href="#" @click="resilverThisPool(props.pool)"
											:class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resilver
											Pool</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
										<a v-if="!scanActivity!.isActive" href="#" @click="scrubThisPool(props.pool)"
											:class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Scrub
											Pool</a>
										<a v-if="scanActivity!.isActive && scanActivity!.isPaused && scanOperation == 'SCRUB'"
											href="#" @click="resumeScrub(props.pool)"
											:class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resume
											Scrub</a>
										<a v-if="scanActivity!.isActive && !scanActivity!.isPaused && scanOperation == 'SCRUB'"
											href="#" @click="pauseScrub(props.pool)"
											:class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pause
											Scrub</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
										<a v-if="scanActivity!.isActive && scanOperation == 'SCRUB'" href="#"
											@click="stopScrub(props.pool)"
											:class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Cancel
											Scrub</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
										<a v-if="!trimActivity!.isActive && !trimActivity!.isPaused && poolData[props.poolIdx].diskType != 'HDD' && getIsTrimmable()"
											href="#" @click="trimThisPool(poolData[props.poolIdx])"
											:class="[active ? 'bg-accent text-default' : 'text-muted', 'block px-4 py-2 text-sm']">TRIM
											Pool</a>
										<a v-if="trimActivity!.isPaused && poolData[props.poolIdx].diskType != 'HDD' && getIsTrimmable()"
											href="#" @click="resumeTrim(poolData[props.poolIdx])"
											:class="[active ? 'bg-accent text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resume
											TRIM (Pool)</a>
										<a v-if="trimActivity!.isActive && poolData[props.poolIdx].diskType != 'HDD' && getIsTrimmable()"
											href="#" @click="pauseTrim(poolData[props.poolIdx])"
											:class="[active ? 'bg-accent text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pause
											TRIM (Pool)</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
										<a v-if="trimActivity!.isActive || trimActivity!.isPaused && poolData[props.poolIdx].diskType != 'HDD' && getIsTrimmable()"
											href="#" @click="stopTrim(poolData[props.poolIdx])"
											:class="[active ? 'bg-accent text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Cancel
											TRIM (Pool)</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
										<a href="#" @click="showAddVDev(poolData[props.poolIdx])"
											:class="[active ? 'bg-accent text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Add
											Virtual Device</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
										<a href="#" @click="exportThisPool(poolData[props.poolIdx])"
											:class="[active ? 'bg-accent text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Export
											Pool</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
										<a href="#" @click="destroyPoolAndUpdate(poolData[props.poolIdx])"
											:class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy
											Pool</a>
										</MenuItem>
									</div>
								</MenuItems>
							</transition>
						</Menu>
					</div>
				</DisclosureButton>
				<DisclosurePanel class="">
					<div v-for="vDev, vDevIdx in poolData[props.poolIdx].vdevs" :key="vDevIdx" class="">
						<VDevElement :pool="poolData[props.poolIdx]" :poolIdx="props.poolIdx" :vDev="vDev"
							:vDevIdx="vDevIdx" ref="vDevElement" />
					</div>
				</DisclosurePanel>
			</Disclosure>
		</div>
	</div>

	<div v-if="showPoolDetails">
		<component :is="showPoolDetailsComponent" :showFlag="showPoolDetails" @close="updateShowPoolDetails"
			:confirm="confirmSavePoolDetails" :pool="selectedPool!" />
	</div>

	<div v-if="showDeletePoolConfirm">
		<component :is="confirmDeletePoolComponent" :showFlag="showDeletePoolConfirm" @close="updateShowDestroyPool"
			:idKey="'confirm-destroy-pool'" :item="'pool'" :operation="'destroy'" :pool="selectedPool!"
			:confirmOperation="confirmThisDestroy" :firstOption="'force unmount'" :secondOption="'clear disk labels'"
			:hasChildren="false" />
	</div>

	<div v-if="showResilverModal">
		<component :is="confirmResilverPoolComponent" :showFlag="showResilverModal" @close="updateShowResilverPool"
			:idKey="'confirm-resilver-pool'" :item="'pool'" :operation="'resilver'" :pool="selectedPool!"
			:confirmOperation="confirmThisResilver" :hasChildren="false" />
	</div>

	<div v-if="showScrubModal">
		<component :is="scrubConfirmComponent" :showFlag="showScrubModal" @close="updateShowScrubPool"
			:idKey="'confirm-scrub-pool'" :item="'pool'" :operation="'scrub'" :pool="selectedPool!"
			:confirmOperation="confirmThisScrub" :hasChildren="false" />
	</div>

	<div v-if="showPauseScrubConfirm">
		<component :is="scrubPauseConfirmComponent" :showFlag="showPauseScrubConfirm" @close="updateShowPauseScrub"
			:idKey="'confirm-pause-scrub'" :item="'pool'" :operation="'pause'" :operation2="'scrub'"
			:pool="selectedPool!" :confirmOperation="confirmPauseThisScrub" :hasChildren="false" />
	</div>

	<div v-if="showStopScrubConfirm">
		<component :is="scrubStopConfirmComponent" :showFlag="showStopScrubConfirm" @close="updateShowStopScrub"
			:idKey="'confirm-stop-scrub'" :item="'pool'" :operation="'stop'" :operation2="'scrub'" :pool="selectedPool!"
			:confirmOperation="confirmStopThisScrub" :hasChildren="false" />
	</div>

	<div v-if="showTrimModal">
		<component :is="trimConfirmComponent" :showFlag="showTrimModal" @close="updateShowTrimPool"
			:idKey="'confirm-trim-pool'" :item="'pool'" :operation="'trim'" :pool="selectedPool!"
			:confirmOperation="confirmThisTrim" :firstOption="'secure TRIM'" :hasChildren="false" />
	</div>

	<div v-if="showPauseTrimConfirm">
		<component :is="trimPauseConfirmComponent" :showFlag="showPauseTrimConfirm" @close="updateShowPauseTrim"
			:idKey="'confirm-pause-trim'" :item="'pool'" :operation="'pause'" :operation2="'trim'" :pool="selectedPool!"
			:confirmOperation="confirmPauseThisTrim" :hasChildren="false" />
	</div>

	<div v-if="showStopTrimConfirm">
		<component :is="trimStopConfirmComponent" :showFlag="showStopTrimConfirm" @close="updateShowStopTrim"
			:idKey="'confirm-stop-trim'" :item="'pool'" :operation="'stop'" :operation2="'trim'" :pool="selectedPool!"
			:confirmOperation="confirmStopThisTrim" :hasChildren="false" />
	</div>

	<div v-if="showExportModal">
		<component :is="exportConfirmComponent" :showFlag="showExportModal" @close="updateShowExportPool"
			:idKey="'confirm-export-pool'" :item="'pool'" :operation="'export'" :pool="selectedPool!"
			:confirmOperation="confirmThisExport" :firstOption="'force unmount'" :hasChildren="false" />
	</div>

	<div v-if="showAddVDevModal">
		<component :is="showAddVDevComponent" @close="showAddVDevModal = false" :idKey="'show-vdev-modal'"
			:pool="selectedPool!" :marginTop="'mt-28'" />
	</div>

	<div v-if="showUpgradeModal">
		<component :is="upgradeConfirmComponent" :showFlag="showUpgradeModal" @close="updateShowUpgradePool"
			:idKey="'confirm-upgrade-pool'" :item="'pool'" :operation="'upgrade'" :pool="selectedPool!"
			:confirmOperation="confirmThisUpgrade" :hasChildren="false" />
	</div>

</template>
<script setup lang="ts">
import { ref, inject, Ref, provide, watch, computed, onMounted} from "vue";
import { EllipsisVerticalIcon, ChevronUpIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { destroyPool, trimPool, scrubPool, resilverPool, clearErrors, exportPool, upgradePool } from "../../composables/pools";
import { labelClear } from "../../composables/disks";
import { loadDatasets, loadDisksThenPools, loadScanObjectGroup, loadDiskStats } from '../../composables/loadData';
import { loadScanActivities, loadTrimActivities, formatStatus, isPoolUpgradable  } from '../../composables/helpers';
import VDevElement from "./VDevElement.vue";
import Status from "../common/Status.vue";

interface PoolListElementProps {
    poolIdx: number;
	pool: PoolData;
}

const props = defineProps<PoolListElementProps>();
const truncateText = inject<Ref<string>>('style-truncate-text')!;

const notifications = inject<Ref<any>>('notifications')!;

const selectedPool = ref<PoolData>();
const selectedDisk = ref<DiskData>();

const scanObjectGroup = inject<Ref<PoolScanObjectGroup>>('scan-object-group')!;
const poolDiskStats = inject<Ref<PoolDiskStats>>('pool-disk-stats')!;

const clearLabels = inject<Ref<boolean>>('clear-labels')!;

function getIsTrimmable() {
	selectedPool.value = props.pool;
	//poolData[props.poolIdx].diskType != 'HDD'
	if (selectedPool.value.diskType! != 'HDD') {
		if (selectedPool.value.vdevs.some(vdev => vdev.type == 'data' || vdev.type == 'log' || vdev.type == 'special' || vdev.type == 'dedup')) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

onMounted(() => {
	getIsTrimmable();
	canUpgradePool(props.pool.name);
});

///////// Values for Confirmation Modals ////////////
/////////////////////////////////////////////////////
const operationRunning = ref(false);
const firstOptionToggle = ref(false);
const secondOptionToggle = ref(false);
const thirdOptionToggle = ref(false);
const fourthOptionToggle = ref(false);

///////////////// Show Pool Details /////////////////
/////////////////////////////////////////////////////
const showPoolDetails = ref(false);
const confirmSavePool = ref(false);

const showPoolDetailsComponent = ref();
const loadShowPoolDetailsComponent = async () => {
	const module = await import('./PoolDetail.vue');
	showPoolDetailsComponent.value = module.default;
}

async function showPoolModal(pool) {
	selectedPool.value = pool;
	console.log('loading:', selectedPool.value);
	await loadShowPoolDetailsComponent();
	showPoolDetails.value = true;
}

const confirmSavePoolDetails : ConfirmationCallback = () => {
	confirmSavePool.value = true;
}

const updateShowPoolDetails = (newVal) => {
	showPoolDetails.value = newVal;
}

watch(confirmSavePool, async (newVal, oldVal) => {
	if (confirmSavePool.value == true) {
		notifications.value.constructNotification('Pool Config Saved', "Successfully saved this pool's configuration.", 'success');
		await refreshAllData();
		// showPoolDetails.value = false;
	} else {
		notifications.value.constructNotification('Save Pool Config Failed', 'There was an error saving this pool.', 'error');
	}
});


/////////////// Loading/Refreshing //////////////////
/////////////////////////////////////////////////////
const poolData = inject<Ref<PoolData[]>>("pools")!;
const diskData = inject<Ref<DiskData[]>>("disks")!;
const filesystemData = inject<Ref<FileSystemData[]>>('datasets')!;
const disksLoaded = inject<Ref<boolean>>('disks-loaded')!;
const poolsLoaded = inject<Ref<boolean>>('pools-loaded')!;
const fileSystemsLoaded = inject<Ref<boolean>>('datasets-loaded')!;

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
	console.log('PoolListElement trimActivities', trimActivities.value);
}

////////////////// Destroy Pool /////////////////////
/////////////////////////////////////////////////////
const confirmDelete = ref(false);
const showDeletePoolConfirm = ref(false);
const hasChildren = ref(false);
const forceDestroy = ref(false);

const confirmDeletePoolComponent = ref();
const loadConfirmDeletePoolComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	confirmDeletePoolComponent.value = module.default;
}

async function destroyPoolAndUpdate(pool) {
	operationRunning.value = false;
	selectedPool.value = pool;
	clearLabels.value = false;
	await loadConfirmDeletePoolComponent();
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

		try {
			const output = await destroyPool(selectedPool.value!, firstOptionToggle.value);

			if (output == null || output.error) {
				const errorMessage = output?.error || 'Unknown error';
				operationRunning.value = false;
				confirmDelete.value = false;
				notifications.value.constructNotification('Destroy Pool Failed', selectedPool.value!.name + " was not destroyed:${errorMessage}.", 'error');
			} else {
				if (secondOptionToggle.value == true) {
					selectedPool.value!.vdevs.forEach(vDev => {
						vDev.disks.forEach(async disk => {
							selectedDisk.value = disk;
							await labelClear(selectedDisk.value!);
						});
					});
				}

				await refreshAllData();
				confirmDelete.value = false;
				operationRunning.value = false;
				notifications.value.constructNotification('Pool Destroyed', selectedPool.value!.name + " destroyed.", 'success');
				showDeletePoolConfirm.value = false;
			}

		} catch (error) {
			console.error(error);
		}
	}
});

////////////////// Resilver Pool ////////////////////
/////////////////////////////////////////////////////
const confirmResilver = ref(false);
const showResilverModal = ref(false);
const resilvered = ref(false);

const confirmResilverPoolComponent = ref();
const loadConfirmResilverPoolComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	confirmResilverPoolComponent.value = module.default;
}

async function resilverThisPool(pool) {
	selectedPool.value = pool;
	await loadConfirmResilverPoolComponent();
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
		resilvered.value = false;
		operationRunning.value = true;
		
		console.log('now resilvering:', selectedPool.value);
		try {
			const output = await resilverPool(selectedPool.value!);
			if (output == null || output.error) {
				const errorMessage = output?.error || 'Unknown error';
				confirmResilver.value = false;
				notifications.value.constructNotification('Resilver Failed', "Resilver failed to start:${errorMessage}.", 'error');
				// showResilverModal.value = false;
				operationRunning.value = false;
			} else {
				getScanStatus();

				confirmResilver.value = false;
				resilvered.value = true;
				operationRunning.value = false;
				showResilverModal.value = false;
				notifications.value.constructNotification('Resilver Started', 'Resilver on ' + selectedPool.value!.name + " started.", 'success');
			}
		} catch (error) { 
			console.error(error);
		}
	}
});


////////////////// Upgrade Pool /////////////////////
/////////////////////////////////////////////////////
const upgradeablePool = ref(false);
const showUpgradeModal = ref(false);
const confirmUpgrade = ref(false);
const upgrading = ref(false);

async function canUpgradePool(poolName) {
	return upgradeablePool.value = await isPoolUpgradable(props.pool.name);
}

const upgradeConfirmComponent = ref();
const loadUpgradeConfirmComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	upgradeConfirmComponent.value = module.default;
}

async function upgradeThisPool(pool) {
	selectedPool.value = pool;
	await loadUpgradeConfirmComponent();
	showUpgradeModal.value = true;
	console.log('preparing to upgrade:', selectedPool.value);
}

const confirmThisUpgrade: ConfirmationCallback = () => {
	confirmUpgrade.value = true;
}

const updateShowUpgradePool = (newVal) => {
	showUpgradeModal.value = newVal;
}

watch(confirmUpgrade, async (newVal, oldVal) => {
	if (confirmUpgrade.value == true) {
		operationRunning.value = true;
		console.log('now upgrading:', selectedPool.value);
		upgrading.value = true;
		try {
			const output = await upgradePool(selectedPool.value!);

			if (output == null || output.error) {
				const errorMessage = output?.error || 'Unknown error';
				notifications.value.constructNotification('Upgrade Failed', `Upgrade failed: ${errorMessage}.`, 'error');
				operationRunning.value = false;
				confirmUpgrade.value = false;
			} else {
				getScanStatus();
				confirmUpgrade.value = false;
				operationRunning.value = false;
				notifications.value.constructNotification('Upgrade Successful', 'Upgrade on ' + selectedPool.value!.name + " succeeded.", 'success');
				showUpgradeModal.value = false;
				canUpgradePool(selectedPool.value!.name);
			}
			upgrading.value = true;
		} catch (error) {
			console.error(error)
		}
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

watch(confirmScrub, async (newVal, oldVal) => {
	if (confirmScrub.value == true) {
		operationRunning.value = true;
		console.log('now scrubbing:', selectedPool.value);
		starting.value = true;
		try {
			const output = await scrubPool(selectedPool.value!);

			if (output == null || output.error) {
				const errorMessage = output?.error || 'Unknown error';
				notifications.value.constructNotification('Scrub Failed', "Scrub failed to start:${errorMessage}.", 'error');
				operationRunning.value = false;
				confirmScrub.value = false;
			} else {
				getScanStatus();
				confirmScrub.value = false;
				operationRunning.value = false;
				notifications.value.constructNotification('Scrub Started', 'Scrub on ' + selectedPool.value!.name + " started.", 'success');
				showScrubModal.value = false;
			}
		} catch (error) {
			console.error(error)
		}
	}
});

async function pauseScrub(pool) {
	selectedPool.value = pool;
	await loadScrubPauseConfirmComponent();
	showPauseScrubConfirm.value = true;
	console.log('scrub to pause:', selectedPool.value);
}

async function resumeScrub(pool) {
	resuming.value = true;
	// operationRunning.value = true;
	try {
		const output = await scrubPool(selectedPool.value!);

		if (output == null || output.error) {
				const errorMessage = output?.error || 'Unknown error';
			notifications.value.constructNotification('Scrub Resume Failed', "Scrub failed to resume:${errorMessage}.", 'error');
			// operationRunning.value = false;
			confirmScrub.value = false;
		} else {
			getScanStatus();
			confirmScrub.value = false;
			notifications.value.constructNotification('Scrub Resumed', 'Scrub on ' + selectedPool.value!.name + " resumed.", 'success');
			// operationRunning.value = false;
			showScrubModal.value = false;
		}
	} catch (error) {
		console.error(error)
	}
	resuming.value = false
}

async function stopScrub(pool) {
	selectedPool.value = pool;
	await loadScrubStopConfirmComponent();
	showStopScrubConfirm.value = true;
	console.log('scrub to pause:', selectedPool.value);
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
		pausing.value = true;
		try {
			const output = await scrubPool(selectedPool.value, 'pause');

			if (output == null || output.error) {
				const errorMessage = output?.error || 'Unknown error';
				notifications.value.constructNotification('Scrub Pause Failed', "Scrub failed to pause:${errorMessage}.", 'error');
				// operationRunning.value = false;
				confirmPauseScrub.value = false;
			} else {
				getScanStatus();
				confirmPauseScrub.value = false;
				notifications.value.constructNotification('Scrub Paused', 'Scrub on ' + selectedPool.value!.name + " paused.", 'success');
				showPauseScrubConfirm.value = false;
				// operationRunning.value = false;
			}
		} catch (error) {
			console.error(error)
		}
		pausing.value = false
	
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
		stopping.value = true;

		try {
			const output = await scrubPool(selectedPool.value, 'stop');

			if (output == null || output.error) {
				const errorMessage = output?.error || 'Unknown error';
				notifications.value.constructNotification('Scrub Stop Failed', "Scrub failed to stop:${errorMessage}.", 'error');
				// operationRunning.value = false;
				confirmStopScrub.value = false;
			} else {
				getScanStatus();
				confirmStopScrub.value = false;
				notifications.value.constructNotification('Scrub Stopped', 'Scrub on ' + selectedPool.value!.name + " stopped.", 'success');
				// operationRunning.value = false;
				showStopScrubConfirm.value = false;
			}
		} catch (error) {
			console.error(error)
		}
	
		stopping.value = false;
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

watch(confirmTrim, async (newValue, oldValue) => {
	if (confirmTrim.value == true) {
		startingTrim.value = true;
		// operationRunning.value = true;
		console.log('now trimming:', selectedPool.value);
		try {
			const output = await trimPool(selectedPool.value!, (firstOptionToggle.value ? firstOptionToggle.value : false));
			if (output == null || output.error) {
				const errorMessage = output?.error || 'Unknown error';
				notifications.value.constructNotification('Trim Failed', "Trim failed to start:${errorMessage}.", 'error');
				// operationRunning.value = false;
				confirmTrim.value = false
			} else {
				getTrimStatus();
				confirmTrim.value = false
				notifications.value.constructNotification('Trim Started', 'Trim on ' + selectedPool.value!.name + " started.", 'success');
				showTrimModal.value = false;
				// operationRunning.value = false;
			}
		} catch (error) {
			console.error(error);
		}
		startingTrim.value = false;
	}
});

async function pauseTrim(pool) {
	selectedPool.value = pool;
	await loadTrimPauseConfirmComponent();
	showPauseTrimConfirm.value = true;
	console.log('trim to pause:', selectedPool.value);
}

// async function resumeTrim(pool) {
// 	resumingTrim.value = true;
// 	// checkingDiskStats.value = true;
// 	await trimPool(pool);
// 	getTrimStatus();
// 	// pollTrim();
// 	resumingTrim.value = false
// 	await refreshAllData();
// }

async function resumeTrim(pool) {
	resumingTrim.value = true;
	try {
		const output = await trimPool(pool)

		if (output == null || output.error) {
				const errorMessage = output?.error || 'Unknown error';
			notifications.value.constructNotification('Trim Resume Failed', "Trim failed to resume:${errorMessage}.", 'error');
			// operationRunning.value = false;
			confirmTrim.value = false;
		} else {
			getTrimStatus();
			confirmTrim.value = false;
			notifications.value.constructNotification('Trim Resumed', 'Trim on ' + selectedPool.value!.name + " resumed.", 'success');
			// operationRunning.value = false;
		}
	} catch (error) {
		console.error(error)
	}
	resumingTrim.value = false
}

async function stopTrim(pool) {
	selectedPool.value = pool;
	await loadTrimStopConfirmComponent();
	showStopTrimConfirm.value = true;
	console.log('trim to stop:', selectedPool.value);
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
		pausingTrim.value = true;
		try {
			const output = 	await trimPool(selectedPool.value!, false, 'pause');
			if (output == null || output.error) {
				const errorMessage = output?.error || 'Unknown error';
				notifications.value.constructNotification('Trim Pause Failed', "Trim failed to pause:${errorMessage}.", 'error');
				// operationRunning.value = false;
				confirmPauseTrim.value = false;
			} else {
				getTrimStatus();
				confirmPauseTrim.value = false;
				notifications.value.constructNotification('Trim Paused', 'Trim on ' + selectedPool.value!.name + " paused.", 'success');
				// operationRunning.value = false;
				showPauseTrimConfirm.value = false;
			}
			
		} catch (error) {
			console.error(error);
		}
		
		pausingTrim.value = false;
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
		stoppingTrim.value = true;
		try {
			const output = await trimPool(selectedPool.value!, false, 'stop');
			if (output == null || output.error) {
				const errorMessage = output?.error || 'Unknown error';
				notifications.value.constructNotification('Trim Stop Failed', "Trim failed to stop:${errorMessage}.", 'error');
				// operationRunning.value = false;
				confirmStopTrim.value = false;
			} else {
				getTrimStatus();
				confirmStopTrim.value = false;
				notifications.value.constructNotification('Trim Stopped', 'Trim on ' + selectedPool.value!.name + " stopped.", 'success');
				showStopTrimConfirm.value = false;
			}
		} catch (error) {
			console.error(error);
		}

		stoppingTrim.value = false;
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

		try {
			const output = await exportPool(selectedPool.value!, (firstOptionToggle.value ? firstOptionToggle.value : false));
			if (output == null || output.error) {
				const errorMessage = output?.error || 'Unknown error';
				notifications.value.constructNotification('Export Failed', "Pool failed to export:${errorMessage}.", 'error');
				confirmExport.value = false;
			} else {
				notifications.value.constructNotification('Export Completed', 'Export of pool ' + selectedPool.value!.name + " completed.", 'success');
				await refreshAllData();
				confirmExport.value = false;
				showExportModal.value = false;
			}
		} catch (error) {
			console.error(error);
		}

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
	
// async function getTrimStatus() {
// 	console.log('vDevElement', vDevElement.value);

// 	await vDevElement.value[0].getDiskStatus();
// }

async function getTrimStatus() {
    // console.log('vDevElement', vDevElement.value);
	console.log('trimActivity:', trimActivity.value);
    // Check if vDevElement is defined and is an array
    if (vDevElement.value && Array.isArray(vDevElement.value) && vDevElement.value.length > 0) {
     	await vDevElement.value[0].getDiskStatus();
    } else {
        console.error('vDevElement is not defined or does not contain an array with elements.');
    }

	// await vDevElement.value[0].getDiskStatus();
}

/////////////////////////////////////////////////////

const poolID = ref(props.pool.name);
const scanActivity = computed(() => {
	return scanActivities.value.get(poolID.value);
});
const trimActivity = computed(() => {
	return trimActivities.value.get(poolID.value);
});


provide('show-pool-deets', showPoolDetails);
provide('confirm-save-pool', confirmSavePool);

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

provide("show-vdev-modal", showAddVDevModal);

provide('modal-confirm-running', operationRunning);
provide('modal-option-one-toggle', firstOptionToggle);
provide('modal-option-two-toggle', secondOptionToggle);
provide('modal-option-three-toggle', thirdOptionToggle);
provide('modal-option-four-toggle', fourthOptionToggle);

provide('scan-status-box', scanStatusBox);

</script>