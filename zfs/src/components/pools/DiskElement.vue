<template>
    <div>
        <table class="table-auto min-w-full divide-y divide-default rounded-md bg-secondary text-default">
            <tr :key="props.vDevIdx" class="rounded-md">
                <td colspan="11" class="">
                    <table class="min-w-full divide-y divide-default ">
							<th class="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8 col-span-2">
                                <span class="sr-only"></span>
                            </th>
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
                            <tr v-for="disk, diskIdx in props.vDev.disks" :key="diskIdx" class="bg-default rounded-md">
								<td class="p-4 mt-1 col-span-2">
									<span class="sr-only"></span>
								</td>
                                <td class="p-4 mt-1 col-span-1">{{ disk.name }}</td>
                                <td class="p-4 mt-1 col-span-1">{{ disk.health }}</td>
                                <td class="p-4 mt-1 col-span-1">W</td>
                                <td class="p-4 mt-1 col-span-1">X</td>
                                <td class="p-4 mt-1 col-span-1">Y</td>
                                <td class="p-4 mt-1 col-span-1">{{ disk.capacity }}</td>
                                <td class="p-4 mt-1 col-span-2">
                                    <Status class="-mt-3" :isTrim="false" :disk="disk" :pool="props.pool" :isDisk="true" :isPoolList="true" :isPoolDetail="false" :idKey="'trim-status-box'" ref="trimStatusBox"/>
                                </td>
                                
                                <td class="p-4 mt-1 col-span-1">
                                    <div class="relative py-4 pl-3 pr-4 text-right font-medium sm:pr-6 lg:pr-8">
                                        <Menu as="div" class="relative inline-block text-right">
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
                                                            <a href="#" @click="clearDiskErrors(props.pool.name, disk.name)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Clear Disk Errors</a>
                                                        </MenuItem>
                                                        <MenuItem as="div" v-slot="{ active }">
                                                            <a v-if="props.vDev.disks.length > 1" href="#" @click="detachThisDisk(props.pool, disk)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Detach Disk</a>
                                                        </MenuItem>
                                                        <MenuItem as="div" v-slot="{ active }">
                                                            <a href="#" @click="offlineThisDisk(props.pool, disk)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Offline Disk</a>
                                                        </MenuItem>
                                                        <MenuItem as="div" v-slot="{ active }">
                                                            <a href="#" @click="onlineThisDisk(props.pool, disk)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Online Disk</a>
                                                        </MenuItem>
                                                        <MenuItem as="div" v-slot="{ active }">
                                                            <a href="#" @click="replaceThisDisk(props.pool, vDev, disk)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Replace Disk</a>
                                                        </MenuItem>
                                                        <MenuItem as="div" v-slot="{ active }">
                                                            <a href="#" @click="trimThisDisk(props.pool, disk)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">TRIM Disk</a>
                                                        </MenuItem>
                                                    </div>
                                                </MenuItems>
                                            </transition>
                                        </Menu>
                                    </div>
                                </td>
                            </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>


	<div v-if="showDetachDiskModal">
		<UniversalConfirmation :showFlag="showDetachDiskModal" @close="updateShowDetachDisk" :idKey="'confirm-detach-disk'" :item="'disk'" :operation="'detach'" :pool="selectedPool!" :disk="selectedDisk!" :confirmOperation="confirmThisDetach" :secondOption="'clear disk labels'" :hasChildren="false"/>
	</div>

	<div v-if="showOfflineDiskModal">
		<UniversalConfirmation :showFlag="showOfflineDiskModal" @close="updateShowOfflineDisk" :idKey="'confirm-offline-disk'" :item="'disk'" :operation="'offline'" :pool="selectedPool!" :disk="selectedDisk!" :confirmOperation="confirmThisOffline" :firstOption="'forcefully offline'" :secondOption="'temporarily offline until next reboot'" :hasChildren="false"/>
	</div>

	<div v-if="showOnlineDiskModal">
		<UniversalConfirmation :showFlag="showOnlineDiskModal" @close="updateShowOnlineDisk" :idKey="'confirm-online-disk'" :item="'disk'" :operation="'online'" :pool="selectedPool!" :disk="selectedDisk!" :confirmOperation="confirmThisOnline" :firstOption="'expand devices to use whole disk'" :secondOption="'scrub pool after coming online'" :hasChildren="false"/>
	</div>

	<div v-if="showTrimDiskModal">
		<UniversalConfirmation :showFlag="showTrimDiskModal" @close="updateShowTrimDisk" :idKey="'confirm-trim-disk'" :item="'disk'" :operation="'trim'" :pool="selectedPool!" :disk="selectedDisk!" :confirmOperation="confirmThisDiskTrim" :firstOption="'secure TRIM'" :hasChildren="false"/>
	</div>

	<div v-if="showReplaceDiskModal">
		<ReplaceDiskModal @close="showReplaceDiskModal = false" :idKey="'show-replace-modal'" :pool="selectedPool!" :vDev="selectedVDev!" :disk="selectedDisk!"/>
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
import Status from "../common/Status.vue";

interface DiskListElementProps {
	pool: PoolData;
	poolIdx: number;
	vDev: vDevData;
	vDevIdx: number;
	// disk: DiskData;
    // diskIdx: number;
}

const props = defineProps<DiskListElementProps>();

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

/////////////////// Detach Disk /////////////////////
/////////////////////////////////////////////////////
const showDetachDiskModal = ref(false);
const confirmDetach = ref(false);
const detaching = ref(false);

async function detachThisDisk(pool : PoolData, disk: DiskData) {
	selectedPool.value = pool;
	selectedDisk.value = disk;
	showDetachDiskModal.value = true;
	console.log("Preparing to detach:", selectedDisk.value!.name, "from:", selectedPool.value!.name);
}

const confirmThisDetach : ConfirmationCallback = () => {
	confirmDetach.value = true;
}

const updateShowDetachDisk = (newVal) => {
	showDetachDiskModal.value = newVal;
}

watch(confirmDetach, async (newValue, oldValue) => {
	if (confirmDetach.value == true) {
		detaching.value = true;
		operationRunning.value = true;
		console.log("now detaching:", selectedDisk.value!.name, "from:", selectedPool.value!.name);

		if (secondOptionToggle.value == true) {
			await detachDisk(selectedPool.value!.name, selectedDisk.value!.name);
			await labelClear(selectedDisk.value!);
		} else {
			await detachDisk(selectedPool.value!.name, selectedDisk.value!.name);
		}
		refreshAllData();
		
		confirmDetach.value = false;
		showDetachDiskModal.value = false;
		detaching.value = false;
		operationRunning.value = false;

		notifications.value.constructNotification('Detach Completed', selectedDisk.value!.name + " was detached from " + selectedPool.value!.name + ".", 'success');
	}
});

////////////////// Offline Disk /////////////////////
/////////////////////////////////////////////////////
const showOfflineDiskModal = ref(false);
const confirmOffline = ref(false);
const offlining = ref(false);

async function offlineThisDisk(pool: PoolData, disk: DiskData) {
	selectedPool.value = pool;
	selectedDisk.value = disk;
	console.log('selected pool:', selectedPool.value, 'selected disk:', selectedDisk.value);
	showOfflineDiskModal.value = true;
}

const confirmThisOffline : ConfirmationCallback = () => {
	confirmOffline.value = true;
}

const updateShowOfflineDisk = (newVal) => {
	showOfflineDiskModal.value = newVal;
}

watch(confirmOffline, async (newVal, oldVal) => {
	if (confirmOffline.value == true) {
		offlining.value = true;
		operationRunning.value = true;
		console.log('now offlining:', selectedDisk.value);
		await offlineDisk(selectedPool.value!.name, selectedDisk.value!.name, firstOptionToggle.value, secondOptionToggle.value);

		notifications.value.constructNotification('Offline Completed', 'Offlining of disk ' + selectedDisk.value!.name + " completed.", 'success');
		refreshAllData();
		confirmOffline.value = false;
		showOfflineDiskModal.value = false;
		offlining.value = false;
		operationRunning.value = false;
	}
});

/////////////////// Online Disk /////////////////////
/////////////////////////////////////////////////////
const showOnlineDiskModal = ref(false);
const confirmOnline = ref(false);
const onlining = ref(false);

async function onlineThisDisk(pool: PoolData, disk: DiskData) {
	selectedPool.value = pool;
	selectedDisk.value = disk;
	console.log('selected pool:', selectedPool.value, 'selected disk:', selectedDisk.value);
	showOnlineDiskModal.value = true;
}

const confirmThisOnline : ConfirmationCallback = () => {
	confirmOnline.value = true;
}

const updateShowOnlineDisk = (newVal) => {
	showOnlineDiskModal.value = newVal;
}

watch(confirmOnline, async (newVal, oldVal) => {
	if (confirmOnline.value == true) {
		onlining.value = true;
		operationRunning.value = true;
		console.log('now onlining:', selectedDisk.value);

		if (secondOptionToggle.value == true) {
			await onlineDisk(selectedPool.value!.name, selectedDisk.value!.name, firstOptionToggle.value);
			await scrubAndScan();
			notifications.value.constructNotification('Scrub Completed', 'Scrub on ' + selectedPool.value!.name + " completed.", 'success');
		} else {
			await onlineDisk(selectedPool.value!.name, selectedDisk.value!.name, firstOptionToggle.value);
		}
		refreshAllData();

		confirmOnline.value = false;
		showOnlineDiskModal.value = false;
		onlining.value = false;
		operationRunning.value = false;

		notifications.value.constructNotification('Online Completed', 'Onlining of disk ' + selectedDisk.value!.name + " completed.", 'success');
	}
});

///////////////////// TRIM Disk /////////////////////
/////////////////////////////////////////////////////
const showTrimDiskModal = ref(false);
const confirmTrimDisk = ref(false);
const trimmingDisk = ref(false);

async function trimThisDisk(pool: PoolData, disk: DiskData) {
	selectedPool.value = pool;
	selectedDisk.value = disk;
	console.log('selected pool:', selectedPool.value, 'selected disk:', selectedDisk.value);
	showTrimDiskModal.value = true;
}

const confirmThisDiskTrim : ConfirmationCallback = () => {
	confirmTrimDisk.value = true;
}

const updateShowTrimDisk = (newVal) => {
	showTrimDiskModal.value = newVal;
}

watch(confirmTrimDisk, async (newVal, oldVal) => {
	if (confirmTrimDisk.value == true) {
		trimmingDisk.value = true;
		operationRunning.value = true;
		console.log('now Trimming:', selectedDisk.value);

		if (firstOptionToggle.value) {
			confirmTrimDisk.value = false;	
			showTrimDiskModal.value = false;
			await trimDisk(selectedPool.value!.name, selectedDisk.value!.name, firstOptionToggle.value);
		} else {
			confirmTrimDisk.value = false;
			showTrimDiskModal.value = false;
			await trimDisk(selectedPool.value!.name, selectedDisk.value!.name);
		}

		notifications.value.constructNotification('Trim Started', 'Trimming of disk ' + selectedDisk.value!.name + " started.", 'success');
		// refreshAllData();
		confirmTrimDisk.value = false;
		showTrimDiskModal.value = false;
		trimmingDisk.value = false;
		operationRunning.value = false;
	}
});

/////////////////// Replace Disk ////////////////////
/////////////////////////////////////////////////////
const showReplaceDiskModal = ref(false);

function replaceThisDisk(pool: PoolData,  vdev: vDevData, disk: DiskData) {
	selectedPool.value = pool;
	selectedDisk.value = disk;
	selectedVDev.value = vdev;
	console.log('selected pool:', selectedPool.value, 'selectedVDev:', selectedVDev, 'selected disk:', selectedDisk.value);
	showReplaceDiskModal.value = true;
}

/////////////////// Clear Errors ////////////////////
/////////////////////////////////////////////////////
// const cleared = ref(false);

async function clearDiskErrors(poolName, diskName) {
	// cleared.value = false;
	await clearErrors(poolName, diskName);
	// cleared.value = true;
}


</script>