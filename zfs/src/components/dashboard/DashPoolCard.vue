<template>
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
									<a href="#" @click="clearThisPoolErrors(pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Pool Errors</a>
								</MenuItem>
								<!-- <MenuItem as="div" v-slot="{ active }">
									<a href="#" @click="clearAlerts(pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Alerts</a>
								</MenuItem> -->
								<MenuItem as="div" v-slot="{ active }">
									<a href="#" @click="resilverThisPool(pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resilver Pool</a>
								</MenuItem>
								<MenuItem as="div" v-slot="{ active }">
									<a href="#" @click="scrubThisPool(pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Scrub Pool</a>
								</MenuItem>
								<MenuItem as="div" v-slot="{ active }">
									<a v-if="pool.diskType != 'HDD'" href="#" @click="trimThisPool(pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">TRIM Pool</a>
								</MenuItem>
								<MenuItem as="div" v-slot="{ active }">
									<a href="#" @click="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Add Virtual Device</a>
								</MenuItem>
								<MenuItem as="div" v-slot="{ active }">
									<a href="#" @click="exportThisPool(pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Export Pool</a>
								</MenuItem>
								<MenuItem as="div" v-slot="{ active }">
									<a href="#" @click="destroyPoolAndUpdate(pool)!" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy Pool</a>
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
			<div class="w-full bg-well rounded-full text-center mt-2 flex justify-center">
				<div v-if="props.pool.properties.capacity! < 1" class="text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${props.pool.properties.capacity}%`}">{{ props.pool.properties.capacity }}%</div>
				<div v-if="props.pool.properties.capacity! >=1 && props.pool.properties.capacity! <= 99" class="bg-green-600 text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${props.pool.properties.capacity}%`}">{{ props.pool.properties.capacity }}%</div>
				<div v-if="props.pool.properties.capacity! > 99" class="bg-danger text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${props.pool.properties.capacity}%`}">{{ props.pool.properties.capacity }}%</div>
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

	<div v-if="showPoolDetails">
		<PoolDetail :pool="selectedPool!" @close="showPoolDetails = false"/>
	</div>

	<div v-if="showDeleteConfirm">
		<!-- <ConfirmDeleteModal item="pool" :pool="selectedPool!" :idKey="'delete-pool'" @close="showDeleteConfirm = false"/> -->
		<ConfirmDeleteModal item="pool" :name="selectedPool!.name" :idKey="'delete-pool'" @close="showDeleteConfirm = false"/>
	</div>

	<div v-if="showResilverModal">
		<!-- <ConfirmResilverModal item="pool" :pool="selectedPool!" :idKey="'resilver-pool'" @close="showResilverModal = false"/> -->
		<ConfirmResilverModal item="pool" :name="selectedPool!.name" :idKey="'resilver-pool'" @close="showResilverModal = false"/>
	</div>

	<div v-if="showTrimModal">
		<!-- <ConfirmTrimModal item="pool" :pool="selectedPool!" :idKey="'trim-pool'" @close="showTrimModal = false"/> -->
		<ConfirmTrimModal item="pool" :name="selectedPool!.name" :idKey="'trim-pool'" @close="showTrimModal = false"/>
	</div>

	<div v-if="showExportModal">
		<!-- <ConfirmExportModal item="pool" :pool="selectedPool!" :idKey="'export-pool'" @close="showExportModal = false"/> -->
		<ConfirmExportModal item="pool" :name="selectedPool!.name" :idKey="'export-pool'" @close="showExportModal = false"/>
	</div>
</template>

<script setup lang="ts">
import { ref, inject, Ref, computed, provide, watch } from "vue";
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

// const exporting = inject<Ref<boolean>>('exporting')!;
// const trimmed = inject<Ref<boolean>>('trimmed')!;
// const trimming = inject<Ref<boolean>>('trimming')!;
// const resilvered = inject<Ref<boolean>>('resilvered')!;
// const resilvering = inject<Ref<boolean>>('resilvering')!;
// const scrubbed = inject<Ref<boolean>>('scrubbed')!;
// const scrubbing = inject<Ref<boolean>>('scrubbing')!;
// const cleared = inject<Ref<boolean>>('cleared')!
const exporting = ref(false);
const trimmed = ref(false);
const trimming = ref(false);
const resilvered = ref(false);
const resilvering = ref(false);
const scrubbed = ref(false);
const scrubbing = ref(false);
const cleared = ref(false);
const messageTimestamp = ref('');

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
			console.log('deleting:', selectedPool.value);
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

	console.log('deleted:', selectedPool.value);
}

async function exportThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;
	showExportModal.value = true;
	watch(confirmExport, async (newVal, oldVal) => {
		if (confirmExport.value == true) {
			exporting.value = true;
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
			console.log('exported:', selectedPool.value);
		}
	});

	console.log('exporting', selectedPool.value);
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

			showResilverModal.value = false;
		 	await resilverPool(pool);
			confirmResilver.value = false;
			resilvered.value = true;
			resilvering.value = false;
			messageTimestamp.value = getTimestampString();

			console.log('resilvered:', selectedPool.value);
		}
	});

	console.log('resilvering', selectedPool.value);
}

async function trimThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;
	showTrimModal.value = true;

	watch(confirmTrim, async (newValue, oldValue) => {
		if (confirmTrim.value == true) {
			trimming.value = true;
			trimmed.value = false;
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

			console.log('trimmed:', selectedPool.value);
		}
	});

	console.log("trimming:", selectedPool.value);
}

async function scrubThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;

	scrubbed.value = false;
	scrubbing.value = true;
	await scrubPool(pool);

	scrubbing.value = false;
	scrubbed.value = true;
	messageTimestamp.value = getTimestampString();
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

provide('show-pool-deets', showPoolDetails);
</script>