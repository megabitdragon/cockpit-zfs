<template>
    <div>
		<Accordion :btnColor="'btn-secondary'" :gridSize="'grid-cols-10'" :btnColSpan="'col-span-1'" :titleColSpan="'col-span-9'" :contentColSpan="'col-span-10'" :isOpen="false" class="btn-secondary rounded-md border border-solid border-default">
			<template v-slot:title>
				<div class="grid grid-cols-8 grid-flow-cols justify-center text-center btn-secondary w-full rounded-md mt-1">
					<div class="col-span-7 text-center py-4 mt-1">
						{{ props.vDev.name }} ({{ props.vDev.type }})
					</div>
					<div class="relative py-4 pl-3 pr-4 text-right font-medium sm:pr-6 lg:pr-8">
						<Menu as="div" class="relative inline-block text-right">
							<div>
								<MenuButton class="flex items-center rounded-full btn-primary p-2 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
									<span class="sr-only">Open options</span>
									<EllipsisVerticalIcon class="w-5" aria-hidden="true" />
								</MenuButton>
							</div>

							<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
								<MenuItems class="absolute right-0 z-10 mt-2 w-max origin-top-left rounded-md bg-accent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									<div class="py-1">												
										<MenuItem as="div" v-slot="{ active }">
											<a href="#" @click="clearVDevErrors(poolData[props.poolIdx].name, props.vDev.name)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Virtual Device Errors</a>
										</MenuItem>
										<MenuItem v-if="vDevIdx != 0" as="div" v-slot="{ active }">
											<a href="#" @click="removeVDev(poolData[props.poolIdx], poolData[props.poolIdx].vdevs[vDevIdx])" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Remove Virtual Device</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
											<a href="#" @click="showAttachDisk(poolData[props.poolIdx], props.vDev)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Attach Disk</a>
										</MenuItem>
									</div>
								</MenuItems>
							</transition>
						</Menu>
					</div>
				</div>
			</template>
			<template v-slot:content>
				<table class="table-auto min-w-full divide-y divide-default rounded-md bg-secondary text-default">
					<tr :key="props.vDevIdx" class="rounded-md">
						<td colspan="9" class="">
							<table class="min-w-full divide-y divide-default ">
									<th class="py-3.5 font-semibold text-default col-span-1">Name</th>
									<th class="py-3.5 font-semibold text-default col-span-1">State</th>
									<th class="py-3.5 font-semibold text-default col-span-1">Reads</th>
									<th class="py-3.5 font-semibold text-default col-span-1">Writes</th>
									<th class="py-3.5 font-semibold text-default col-span-1">Checksum</th>
									<th class="py-3.5 font-semibold text-default col-span-1">Capacity</th>
									<th class="py-3.5 font-semibold text-default col-span-2">Message</th>
									<th class="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8 col-span-1">
										<span class="sr-only"></span>
									</th>
							</table>
						</td>
					</tr>
				</table>
				<div v-for="disk, diskIdx in props.vDev.disks" :key="diskIdx">
					<DiskElement :pool="poolData[props.poolIdx]" :poolIdx="props.poolIdx" :vDev="props.vDev" :vDevIdx="props.vDevIdx" :disk="disk" :diskIdx="diskIdx" ref="diskElement"/>
				</div>
			</template>
		</Accordion>

    </div>
	<div v-if="showAttachDiskModal">
		<AttachDiskModal @close="showAttachDiskModal = false" :idKey="'show-attach-disk-modal'" :pool="selectedPool!" :vDev="selectedVDev!"/>
	</div>
</template>
<script setup lang="ts">
import { ref, inject, Ref, provide, watch, computed, ComputedRef, onMounted, nextTick } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { destroyPool, trimPool, scrubPool, resilverPool, clearErrors, exportPool, removeVDevFromPool } from "../../composables/pools";
import { labelClear, detachDisk, offlineDisk, onlineDisk, trimDisk } from "../../composables/disks";
import { loadDatasets, loadDisksThenPools, loadScanObjectGroup, loadDiskStats } from '../../composables/loadData';
import UniversalConfirmation from "../common/UniversalConfirmation.vue";
import ReplaceDiskModal from "../disks/ReplaceDiskModal.vue";
import Accordion from "../common/Accordion.vue";
import Status from "../common/Status.vue";
import AttachDiskModal from "../disks/AttachDiskModal.vue";
import DiskElement from '../pools/DiskElement.vue';

interface VDevElementProps {
	pool: PoolData;
	poolIdx: number;
	vDev: vDevData;
	vDevIdx: number;
	// disk: DiskData;
    // diskIdx: number;
}

const props = defineProps<VDevElementProps>();

const notifications = inject<Ref<any>>('notifications')!;

const selectedPool = ref<PoolData>();
const selectedDisk = ref<DiskData>();
const selectedVDev = ref<vDevData>();

const operationRunning = ref(false);
const firstOptionToggle = ref(false);
const secondOptionToggle = ref(false);
const thirdOptionToggle = ref(false);
const fourthOptionToggle = ref(false);

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
	disksLoaded.value = true;
	poolsLoaded.value = true;
	fileSystemsLoaded.value = true;
}

const starting = ref(false);

async function scrubAndScan() {
	starting.value = true;
	await scrubPool(selectedPool.value!);
	getScanStatus();
	starting.value = false;
}

const scanStatusBox = ref();

async function getScanStatus() {
	console.log('scanStatusBox', scanStatusBox.value);

	// Needed to specify index to work properly (treating as an array due to multiple pools error)
	await scanStatusBox.value.pollScanStatus();
}


/////////////////// Clear Errors ////////////////////
/////////////////////////////////////////////////////
// const cleared = ref(false);

async function clearVDevErrors(poolName, vDevName) {
	// cleared.value = false;
	await clearErrors(poolName, vDevName);
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

async function removeVDev(pool : PoolData, vDev : vDevData) {
	selectedPool.value = pool;
	selectedVDev.value = vDev;
	showRemoveVDevConfirm.value = true;

	console.log('premaring to remove:', selectedVDev.value, 'from pool:', selectedPool.value);
}

const confirmThisRemove : ConfirmationCallback = () => {
	confirmRemove.value = true;
}

const updateShowRemoveVDev = (newVal) => {
	showRemoveVDevConfirm.value = newVal;
}

watch(confirmRemove, async (newValue, oldValue) => {
	if (confirmRemove.value == true) {
		operationRunning.value = true;
		console.log('now removing:', selectedVDev.value, 'from pool:', selectedPool.value);

		await removeVDevFromPool(selectedVDev.value, selectedPool.value);

		refreshAllData();
		confirmRemove.value = false;
		showRemoveVDevConfirm.value = false;
		operationRunning.value = false;

		notifications.value.constructNotification('Remove Completed', 'Removal of VDev '+ selectedVDev.value!.name + " from " + selectedVDev.value!.name + " completed.", 'success');
	}
});

/////////////////// Attach Disk /////////////////////
/////////////////////////////////////////////////////
const showAttachDiskModal = ref(false);


function showAttachDisk(pool: PoolData, vdev: vDevData) {
	selectedPool.value = pool;
	selectedVDev.value = vdev;
	console.log('selectedPool:', selectedPool, 'selectedVDev:', selectedVDev)
	showAttachDiskModal.value = true;
}

//////////// Checking Disk Stats (Trim) /////////////
/////////////////////////////////////////////////////
const diskElement = ref();

async function getDiskStatus() {
	console.log('diskElement', diskElement.value);

	// Needed to specify index to work properly (treating as an array due to multiple pools error)
	await diskElement.value[0].getDiskTrimStatus();
}

/////////////////////////////////////////////////////
// const trimActivities = inject<Ref<Map<string, Activity>>>('trim-activities')!;

// const poolID = ref(props.pool.name);
// const trimActivity = computed(() => {
// 	return trimActivities.value.get(poolID.value);
// });


defineExpose({
    getDiskStatus,
});

</script>