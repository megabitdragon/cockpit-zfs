<template>
	<Card class="mt-2 mb-4 min-w-fit overflow-visible bg-plugin-header rounded-md border border-default">
		<template v-slot:title>
			<div class="flex flex-row justify-between">
				<div class="text-default">
					{{ props.pool.name }}
				</div>
				<div>
					<img class="aspect-square w-4 h-4 min-w-4 min-h-4" src="../../../public/icons/success.svg">
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
								<MenuItem v-slot="{ active }">
									<a href="#" @click="showDetails(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pool Details</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="#" @click="clearThisPoolErrors(pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Pool Errors</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="#" @click="resilverThisPool(pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resilver Pool</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="#" @click="scrubThisPool(pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Scrub Pool</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="#" @click="trimThisPool(pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">TRIM Pool</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="#" @click="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Add Virtual Device</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="#" @click="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Export Pool</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="#" @click="destroyPoolAndUpdate(pool)!" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy Pool</a>
								</MenuItem>
							</div>
						</MenuItems>
					</transition>
				</Menu>
			</div>
	
		<div>
			<span class="text-success">{{props.pool.status}}</span>
		</div>
		</template>
		<template v-slot:content>
			<div class="flex justify-between mb-1">
				<span class="text-base font-medium text-success ">Space&nbsp;</span>
				<span class="text-sm font-medium text-success ">{{props.pool.properties.capacity}}%</span>
			</div>
			<div class="w-full bg-well rounded-full h-2.5 ">
					<div v-if="props.pool.properties.capacity <= 85" class="bg-green-600 h-2.5 rounded-full" :style="{width: `${props.pool.properties.capacity}%`}"></div>
			</div>
		</template>
		<template v-slot:footer>
			<div>
				Used {{ props.pool.properties.allocated }}
			</div>
			<div>
				Free {{ props.pool.properties.free }}
			</div>
			<div>
				<b>Total {{ props.pool.properties.size }}</b>
			</div>
		</template>
	</Card>

	<div v-if="showPoolDetails">
		<PoolDetail :pool="selectedPool!" @close="showPoolDetails = false"/>
	</div>

	<div v-if="showDeleteConfirm">
		<ConfirmDeleteModal item="pool" :name="selectedPool!.name" :idKey="'delete-pool'" @close="showDeleteConfirm = false"/>
	</div>

	<div v-if="showResilverModal">
		<ConfirmResilverModal item="pool" :name="selectedPool!.name" :idKey="'resilver-pool'" @close="showResilverModal = false"/>
	</div>

	<div v-if="showTrimModal">
		<ConfirmTrimModal item="pool" :name="selectedPool!.name" :idKey="'trim-pool'" @close="showTrimModal = false"/>
	</div>
</template>

<script setup lang="ts">
import { ref, inject, Ref, computed, provide, watch } from "vue";
import { EllipsisVerticalIcon} from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { loadDatasets, loadDisksThenPools } from '../../composables/loadData';
import { destroyPool, trimPool, scrubPool, resilverPool, clearPoolErrors } from "../../composables/pools";
import Card from '../common/Card.vue';
import PoolDetail from "../pools/PoolDetail.vue";
import ConfirmDeleteModal from "../common/confirmation/ConfirmDeleteModal.vue";
import ConfirmResilverModal from "../common/confirmation/ConfirmResilverModal.vue";
import ConfirmTrimModal from "../common/confirmation/ConfirmTrimModal.vue";

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
const resilvering = inject<Ref<boolean>>('resilvering')!;

const showTrimModal = inject<Ref<boolean>>('show-trim-modal')!;
const confirmTrim = inject<Ref<boolean>>('confirm-trim')!;
const trimming = inject<Ref<boolean>>('triming')!;

async function destroyPoolAndUpdate(pool) {

	showDeleteConfirm.value = true;
	selectedPool.value = pool;

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

async function resilverThisPool(pool) {
	
	showResilverModal.value = true;
	selectedPool.value = pool;
	
	watch(confirmResilver, async (newValue, oldValue) => {

		if (confirmResilver.value == true) {
			resilvering.value = true;
			console.log('resilvering:', selectedPool.value);
		 	await resilverPool(pool);
			disksLoaded.value = false;
			poolsLoaded.value = false;
			poolData.value = [];
			diskData.value = [];
			await loadDisksThenPools(diskData, poolData);
			disksLoaded.value = true;
			poolsLoaded.value = true;
			confirmResilver.value = false;
			showResilverModal.value = false;
			resilvering.value = false;
		}
	});

	console.log('resilvered:', selectedPool.value);
}

async function clearThisPoolErrors(pool) {
	await clearPoolErrors(pool);
}

async function trimThisPool(pool) {
	// showResilverModal.value = true;
	// selectedPool.value = pool;
	
	// watch(confirmResilver, async (newValue, oldValue) => {

	// 	if (confirmResilver.value == true) {
	// 		resilvering.value = true;
	// 		console.log('resilvering:', selectedPool.value);
	// 	 	await resilverPool(pool);
	// 		disksLoaded.value = false;
	// 		poolsLoaded.value = false;
	// 		poolData.value = [];
	// 		diskData.value = [];
	// 		await loadDisksThenPools(diskData, poolData);
	// 		disksLoaded.value = true;
	// 		poolsLoaded.value = true;
	// 		confirmResilver.value = false;
	// 		showResilverModal.value = false;
	// 		resilvering.value = false;
	// 	}
	// });

	// console.log('resilvered:', selectedPool.value);
}

async function scrubThisPool(pool) {
	await scrubPool(pool);
}


async function addNewVDev(pool) {

}

async function exportThisPool(pool) {

}

//method to show pool details when button is clicked
function showDetails(pool) {
	selectedPool.value = pool;
	console.log('loading:', selectedPool);
	showPoolDetails.value = true;
}

provide('show-pool-deets', showPoolDetails);
</script>