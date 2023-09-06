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
										<a href="#" @click="clearThisPoolErrors(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Pool Errors</a>
									</MenuItem>
									<!-- <MenuItem as="div" v-slot="{ active }">
										<a href="#" @click="clearAlerts(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Alerts</a>
									</MenuItem> -->
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
										<a href="#" @click="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Add Virtual Device</a>
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
				<div class="flex flex-row w-full h-max border border-default rounded-sm bg-accent justify-center">
					<div v-if="!cleared && trimming " class="grid grid-cols-4 gap-0.5 justify-items-center">
						<h3 class="text-muted col-span-4 mt-2">Trimming...</h3>
						<LoadingSpinner baseColor="text-gray-200" fillColor="fill-slate-500" class="col-span-4 my-2"/>
					</div>
					<div v-else-if="!cleared && scrubbing " class="grid grid-cols-4 gap-0.5 justify-items-center">
						<h3 class="text-muted col-span-4 mt-2">Scrubbing...</h3>
						<LoadingSpinner baseColor="text-gray-200" fillColor="fill-slate-500" class="col-span-4 my-2"/>
					</div>
					<div v-else-if="!cleared && resilvering " class="grid grid-cols-4 gap-0.5 justify-items-center">
						<h3 class="text-muted col-span-4 mt-2">Resilvering...</h3>
						<LoadingSpinner baseColor="text-gray-200" fillColor="fill-slate-500" class="col-span-4 my-2"/>
					</div>
					<div v-else-if="!cleared && trimmed ">
						<span class="text-success">Trim completed at <br/> {{ messageTimestamp }}.</span>
					</div>
					<div v-else-if="!cleared && scrubbed ">
						<span class="text-success">Scrub completed at <br/> {{ messageTimestamp }}.</span>
					</div>
					<div v-else-if="!cleared && resilvered ">
						<span class="text-success">Resilver completed at <br/> {{ messageTimestamp }}.</span>
					</div>
					<div v-else-if="cleared == true || !trimming && !scrubbing && !resilvering && !trimmed && !scrubbed && !resilvered">
						<span class="text-muted">No Alerts</span>
					</div>

					<!-- <div v-if="runningOperation" class="grid grid-cols-4 gap-0.5 justify-items-center">
						<h3 class="text-muted col-span-4 mt-2">{{ props.pool.scan!.function }} in progress...</h3>
						<h3 class="text-muted col-span-4 mt-2">{{ props.pool.scan!.percentage }}%</h3>
						<LoadingSpinner baseColor="text-gray-200" fillColor="fill-slate-500" class="col-span-4 my-2"/>
					</div>
					<div v-else-if="!runningOperation && completedOperation">
						<span class="text-success">{{props.pool.scan!.function}} {{props.pool.scan!.state}} at <br/> {{ props.pool.scan!.end_time }}.</span>
					</div>
					<div v-else-if="!completedOperation && !runningOperation">
						<span class="text-muted">No Alerts</span>
					</div> -->

					<!-- <div v-if="runningOperation" class="grid grid-cols-4 gap-0.5 justify-items-center">
						<h3 class="text-muted col-span-4 mt-2">Scrubbing...</h3>
						<h3 class="text-muted col-span-4 mt-2">{{ progressPercentage }}%</h3>
						<h3 class="text-muted col-span-4 mt-2">{{ timeRemaining }}</h3>
						<LoadingSpinner baseColor="text-gray-200" fillColor="fill-slate-500" class="col-span-4 my-2"/>
					</div>
					<div v-else-if="!runningOperation && completedOperation">
						<span class="text-success">{{props.pool.scan!.function}} {{props.pool.scan!.state}} at <br/> {{ props.pool.scan!.end_time }}.</span>
					</div>
					<div v-else-if="!completedOperation && !runningOperation">
						<span class="text-muted">No Alerts</span>
					</div> -->

				</div>
			</template>
			<template v-slot:content>
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
							{{ props.pool.properties.capacity }}%
						</div>
					</div>
				</div>

				<div v-if="props.pool.properties.capacity! < 1" class="w-full bg-well rounded-full h-6 text-center mt-2 relative flex">
					<div class="absolute inset-0 flex items-center justify-center text-s font-medium text-default p-0.5 leading-none">
						{{ props.pool.properties.capacity }}%
					</div>
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

	<div v-if="showDeleteConfirm">
		<ConfirmDeleteModal item="pool" :name="selectedPool!.name" :idKey="getIdKey(`delete-pool-${selectedPool?.guid}`)" @close="showDeleteConfirm = false"/>
	</div>

	<div v-if="showResilverModal">
		<ConfirmResilverModal item="pool" :name="selectedPool!.name" :idKey="getIdKey(`resilver-pool-${selectedPool?.guid}`)" @close="showResilverModal = false"/>
	</div>

	<div v-if="showTrimModal">
		<ConfirmTrimModal item="pool" :name="selectedPool!.name" :idKey="getIdKey(`trim-pool-${selectedPool?.guid}`)" @close="showTrimModal = false"/>
	</div>

	<div v-if="showExportModal">
		<ConfirmExportModal item="pool" :name="selectedPool!.name" :idKey="getIdKey(`export-pool-${selectedPool?.guid}`)" @close="showExportModal = false"/>
	</div>
</template>

<script setup lang="ts">
import { ref, inject, Ref, computed, provide, watch, watchEffect } from "vue";
import { EllipsisVerticalIcon} from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { loadDatasets, loadDisksThenPools } from '../../composables/loadData';
import { destroyPool, trimPool, scrubPool, resilverPool, clearPoolErrors, exportPool } from "../../composables/pools";
import { getTimestampString } from "../../composables/helpers";
import Card from '../common/Card.vue';
import PoolDetail from "../pools/PoolDetail.vue";
import ConfirmDeleteModal from "../common/confirmation/ConfirmDeleteModal.vue";
import ConfirmResilverModal from "../common/confirmation/ConfirmResilverModal.vue";
import ConfirmTrimModal from "../common/confirmation/ConfirmTrimModal.vue";
import ConfirmExportModal from "../common/confirmation/ConfirmExportModal.vue";
import LoadingSpinner from "../common/LoadingSpinner.vue";
import { checkStatus } from '../../composables/pools';

interface DashPoolCardProps {
	pool: PoolData;
}

const props = defineProps<DashPoolCardProps>();

const showPoolDetails = ref(false);

const selectedPool = ref<PoolData>();

const poolData = inject<Ref<PoolData[]>>("pools")!;

const diskData = inject<Ref<DiskData[]>>("disks")!;

const disksLoaded = inject<Ref<boolean>>('disks-loaded')!;
const poolsLoaded = inject<Ref<boolean>>('pools-loaded')!;

const confirmDelete = inject<Ref<boolean>>('confirm-delete')!;
const showDeleteConfirm = inject<Ref<boolean>>('show-delete-modal')!;
const deleting = inject<Ref<boolean>>('deleting')!;

const confirmResilver = inject<Ref<boolean>>('confirm-resilver')!;
const showResilverModal = inject<Ref<boolean>>('show-resilver-modal')!;	

const showTrimModal = inject<Ref<boolean>>('show-trim-modal')!;
const confirmTrim = inject<Ref<boolean>>('confirm-trim')!;
const secureTRIM = inject<Ref<boolean>>('secure-trim')!;

const showExportModal = inject<Ref<boolean>>('show-export-modal')!;
const confirmExport = inject<Ref<boolean>>('confirm-export')!;
const forceUnmount = inject<Ref<boolean>>('force-unmount')!;

const exporting = ref(false);
const trimmed = ref(false);
const trimming = ref(false);
const resilvered = ref(false);
const resilvering = ref(false);
const scrubbed = ref(false);
const scrubbing = ref(false);
const cleared = ref(false);
const messageTimestamp = ref('');

const completedOperation = ref(false);
const runningOperation = ref(false);

// const progressPercentage = ref(null);
// const timeRemaining = ref(null);
// const updateInterval = 3000;
// const stopUpdatingProgress = ref(false);

// const updateProgress = async (poolName) => {
// 	try {
// 		const response = await checkStatus(poolName);
// 		progressPercentage.value = response.percentage_done;
// 		timeRemaining.value = response.time_remaining

// 		if (scrubbed) {
// 			stopUpdatingProgress.value = true; // Set the flag to stop updating
// 		}
// 	} catch (error) {
// 		console.error("Error:", error);
// 	}
// }

// watchEffect(() => {
// 	const interval = setInterval(updateProgress, updateInterval);

// 	return () => {
// 		clearInterval(interval);
// 	};
// });

//method to show pool details when button is clicked
function showDetails(pool) {
	selectedPool.value = pool;
	console.log('loading:', selectedPool);
	showPoolDetails.value = true;
}

async function destroyPoolAndUpdate(pool) {
	selectedPool.value = pool;
	showDeleteConfirm.value = true;
	
	watch(confirmDelete, async (newValue, oldValue) => {
	
		if (confirmDelete.value == true) {	
			deleting.value = true;
			console.log('now deleting:', selectedPool.value);
			await destroyPool(selectedPool.value!);
			disksLoaded.value = false;
			poolsLoaded.value = false;
			poolData.value = [];
			diskData.value = [];
			await loadDisksThenPools(diskData, poolData);
			disksLoaded.value = true;
			poolsLoaded.value = true;
			confirmDelete.value = false;
			showDeleteConfirm.value = false;
			deleting.value = false;
		}
	});

	console.log('preparing to delete:', selectedPool.value);
}

async function exportThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;
	showExportModal.value = true;
	watch(confirmExport, async (newValue, oldValue) => {
		if (confirmExport.value == true) {
			exporting.value = true;
			console.log('now exporting:', selectedPool.value);
			if (forceUnmount.value) {
				await exportPool(pool, forceUnmount.value);
			} else {
				await exportPool(pool);
			}

			disksLoaded.value = false;
			poolsLoaded.value = false;
			poolData.value = [];
			diskData.value = [];
			await loadDisksThenPools(diskData, poolData);
			disksLoaded.value = true;
			poolsLoaded.value = true;
			confirmExport.value = false;
			showExportModal.value = false;
			exporting.value = false;

		}
	});

	console.log('preparing to export:', selectedPool.value);
}

async function resilverThisPool(pool) {
	scrubbed.value = false;
	trimmed.value = false;
	cleared.value = false;
	selectedPool.value = pool;
	showResilverModal.value = true;
	
	watch(confirmResilver, async (newValue, oldValue) => {

		if (confirmResilver.value == true) {
			resilvering.value = true;
			resilvered.value = false;
			console.log('now resilvering:', selectedPool.value);
			showResilverModal.value = false;
		 	await resilverPool(pool);
			confirmResilver.value = false;
			resilvered.value = true;
			resilvering.value = false;
			messageTimestamp.value = getTimestampString();

		}
	});

	console.log('preparing to resilver:', selectedPool.value);
}

async function trimThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;
	showTrimModal.value = true;

	watch(confirmTrim, async (newValue, oldValue) => {
		if (confirmTrim.value == true) {
			trimming.value = true;
			trimmed.value = false;
			console.log('now trimming:', selectedPool.value);
			if (secureTRIM.value) {
				confirmTrim.value = false;
				showTrimModal.value = false;
				await trimPool(pool, secureTRIM.value);
			} else {
				confirmTrim.value = false;
				showTrimModal.value = false;
				await trimPool(pool);
			}
			
			trimming.value = false;
			trimmed.value = true;
			messageTimestamp.value = getTimestampString();
		}
	});

	console.log("preparing to trim:", selectedPool.value);
}

async function scrubThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;
	console.log('preparing to scrub:', selectedPool.value);
	scrubbed.value = false;
	scrubbing.value = true;
	console.log('now scrubbing:', selectedPool.value);
	await scrubPool(pool);
	scrubbing.value = false;
	scrubbed.value = true;
	messageTimestamp.value = getTimestampString();

	// completedOperation.value = false;
	// runningOperation.value = true;
	// console.log('now scrubbing:', selectedPool.value);
	// await scrubPool(pool);
	// runningOperation.value = false;
	// completedOperation.value = true;

}

async function clearThisPoolErrors(pool) {
	cleared.value = false;
	await clearPoolErrors(pool);
	cleared.value = true;
}

async function clearAlerts(pool) {
	cleared.value = true;
}

async function addNewVDev(pool) {

}

const getIdKey = (name: string) => `${selectedPool.value}-${name}`;

provide('show-pool-deets', showPoolDetails);
</script>