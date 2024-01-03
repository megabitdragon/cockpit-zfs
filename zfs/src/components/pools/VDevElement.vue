<template>
    <div>
		<div>
			<Disclosure v-slot="{ open }">
				<DisclosureButton class="bg-primary text-white grid grid-cols-7 grid-flow-cols w-full border border-t border-collapse border-default justify-center text-center">
					<div class="py-6 mt-1 mr-2 col-span-1 ml-8 flex flex-row justify-start justify-items-center text-center" :title="props.vDev.name">
						<ChevronUpIcon
							class="-mt-2 h-10 w-10 text-white transition-all duration-200 transform" :class="{ 'rotate-90': !open, 'rotate-180': open, }"
						/>
						<p class="ml-2 justify-center justify-items-center text-center">
							{{ props.vDev.name }}
						</p>
					</div>
					<div class="py-6 mt-1 col-span-1">{{ upperCaseWord(props.vDev.type) }} Device</div>
					<div class="py-6 mt-1 col-span-1">{{ props.vDev.disks.length }} Disks</div>
					<div class="py-6 mt-1 col-span-1">{{ props.vDev.stats.read_errors }} Read Errors</div>
					<div class="py-6 mt-1 col-span-1">{{ props.vDev.stats.write_errors }} Write Errors</div>
					<div class="py-6 mt-1 col-span-1">{{ props.vDev.stats.checksum_errors }} Checksum Errors</div>
					<div class="col-span-1 relative py-6 pl-3 pr-4 text-right font-medium sm:pr-6 lg:pr-8 justify-self-end justify-items-end">
						<Menu as="div" class="relative inline-block text-right">
							<div>
								<MenuButton class="flex items-center rounded-full bg-primary p-2 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
									<span class="sr-only">Open options</span>
									<EllipsisVerticalIcon class="w-5" aria-hidden="true" />
								</MenuButton>
							</div>

							<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
								<MenuItems class="absolute right-0 z-10 mt-2 w-max origin-top-left rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									<div class="py-1">												
										<MenuItem as="div" v-slot="{ active }">
											<a href="#" @click="clearVDevErrors(props.pool.name, props.vDev.name)" :class="[active ? 'bg-primary text-white' : 'text-white', 'block px-4 py-2 text-sm']">Clear Virtual Device Errors</a>
										</MenuItem>
										<MenuItem v-if="vDevIdx != 0" as="div" v-slot="{ active }">
											<a href="#" @click="removeVDev(props.pool, props.pool.vdevs[vDevIdx])" :class="[active ? 'bg-danger text-white' : 'text-white', 'block px-4 py-2 text-sm']">Remove Virtual Device</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
											<a href="#" @click="showAttachDisk(props.pool, props.vDev)" :class="[active ? 'bg-primary text-white' : 'text-white', 'block px-4 py-2 text-sm']">Attach Disk</a>
										</MenuItem>
									</div>
								</MenuItems>
							</transition>
						</Menu>
					</div>
				</DisclosureButton>
				<DisclosurePanel>
					<table class="min-w-full bg-secondary text-default border-l border-r border-collapse border-default">
						<thead>
							<tr :key="props.vDevIdx" class="rounded-md grid grid-cols-8">
								<th class="py-3.5 font-semibold text-white col-span-1">Name</th>
								<th class="py-3.5 font-semibold text-white col-span-1">Health</th>
								<th class="py-3.5 font-semibold text-white col-span-1">Type</th>
								<th class="py-3.5 font-semibold text-white col-span-1">Temperature</th>
								<th class="py-3.5 font-semibold text-white col-span-1">Capacity</th>
								<th class="py-3.5 font-semibold text-white col-span-2">Message</th>
								<th class="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8 col-span-1">
									<span class="sr-only"></span>
								</th>
							</tr>
						</thead>
					</table>
					<div v-for="disk, diskIdx in props.vDev.disks" :key="diskIdx" class="border border-l border-r border-collapse border-default">
						<DiskElement :pool="poolData[props.poolIdx]" :poolIdx="props.poolIdx" :vDev="props.vDev" :vDevIdx="props.vDevIdx" :disk="disk" :diskIdx="diskIdx" ref="diskElement"/>
					</div>
				</DisclosurePanel>
			</Disclosure>
		</div>
    </div>
	<div v-if="showAttachDiskModal">
		<!-- <AttachDiskModal :showFlag="showAttachDiskModal" @close="updateShowAttachDisk" :idKey="'show-attach-disk-modal'" :pool="selectedPool!" :vDev="selectedVDev!"/> -->
		<component :is="showAttachDiskComponent" :showFlag="showAttachDiskModal" @close="updateShowAttachDisk" :idKey="'show-attach-disk-modal'" :pool="selectedPool!" :vDev="selectedVDev!"/>
	</div>

	<div v-if="showRemoveVDevConfirm">
		<component :is="showRemoveVDevComponent" :showFlag="showRemoveVDevConfirm" @close="updateShowRemoveVDev" :idKey="'confirm-remove-vdev'" :item="'vdev'" :operation="'remove'" :pool="selectedPool!" :vdev="selectedVDev!" :confirmOperation="confirmThisRemove" :hasChildren="false"/>
	</div>

</template>
<script setup lang="ts">
import { ref, inject, Ref, watch } from "vue";
import { EllipsisVerticalIcon, ChevronUpIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { clearErrors, removeVDevFromPool } from "../../composables/pools";
import { loadDatasets, loadDisksThenPools, loadScanObjectGroup, loadDiskStats } from '../../composables/loadData';
import { loadScanActivities, loadTrimActivities, upperCaseWord } from '../../composables/helpers';
import DiskElement from '../pools/DiskElement.vue';

interface VDevElementProps {
	pool: PoolData;
	poolIdx: number;
	vDev: vDevData;
	vDevIdx: number;
}

const props = defineProps<VDevElementProps>();

const notifications = inject<Ref<any>>('notifications')!;

const selectedPool = ref<PoolData>();
const selectedVDev = ref<vDevData>();

const operationRunning = ref(false);

/////////////// Loading/Refreshing //////////////////
/////////////////////////////////////////////////////
const poolData = inject<Ref<PoolData[]>>("pools")!;
const diskData = inject<Ref<DiskData[]>>("disks")!;
const filesystemData = inject<Ref<FileSystemData[]>>('datasets')!;
const disksLoaded = inject<Ref<boolean>>('disks-loaded')!;
const poolsLoaded = inject<Ref<boolean>>('pools-loaded')!;
const fileSystemsLoaded = inject<Ref<boolean>>('datasets-loaded')!;
const scanActivities = inject<Ref<Map<string, Activity>>>('scan-activities')!;
const trimActivities = inject<Ref<Map<string, Activity>>>('trim-activities')!;
const scanObjectGroup = inject<Ref<PoolScanObjectGroup>>('scan-object-group')!;
const poolDiskStats = inject<Ref<PoolDiskStats>>('pool-disk-stats')!;

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

/////////////////// Clear Errors ////////////////////
/////////////////////////////////////////////////////
// const cleared = ref(false);

async function clearVDevErrors(poolName, vDevName) {
	// cleared.value = false;
	await clearErrors(poolName, vDevName);
	// cleared.value = true;
}


/////////////////// Remove VDev /////////////////////
/////////////////////////////////////////////////////
const showRemoveVDevConfirm = ref(false);
const confirmRemove = ref(false);

const showRemoveVDevComponent = ref();
const loadShowRemoveVDevComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	showRemoveVDevComponent.value = module.default;
}

async function removeVDev(pool : PoolData, vDev : vDevData) {
	selectedPool.value = pool;
	selectedVDev.value = vDev;
	await loadShowRemoveVDevComponent();
	showRemoveVDevConfirm.value = true;

	console.log('preparing to remove:', selectedVDev.value, 'from pool:', selectedPool.value);
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

		notifications.value.constructNotification('Remove Completed', 'Removal of VDev '+ selectedVDev.value!.name + " from " + selectedPool.value!.name + " completed.", 'success');
	}
});

/////////////////// Attach Disk /////////////////////
/////////////////////////////////////////////////////
const showAttachDiskModal = ref(false);

const showAttachDiskComponent = ref();
const loadShowAttachDiskComponent = async () => {
	const module = await import('../disks/AttachDiskModal.vue');
	showAttachDiskComponent.value = module.default;
}

const updateShowAttachDisk = (newVal) => {
	showAttachDiskModal.value = newVal;
}

async function showAttachDisk(pool: PoolData, vdev: vDevData) {
	selectedPool.value = pool;
	selectedVDev.value = vdev;
	console.log('selectedPool:', selectedPool, 'selectedVDev:', selectedVDev)
	await loadShowAttachDiskComponent();
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