<template>
	<div>
		<!-- POOLS -->
		<div v-if="props.item == 'pool'" class="inline-block max-h-max align-middle border border-default border-collapse">
			<div class="">
				<table class="table-auto min-h-full divide-y divide-default bg-default">
					<thead class="bg-well">
						<tr v-if="snapshots.length < 1 && snapshotsLoaded" class="grid grid-cols-1 items-center justify-center">
							<p class="bg-accent text-defaulttext-center p-4 justify-self-center">No snapshots found.</p>
						</tr>
						<tr v-if="snapshots.length > 0 && snapshotsLoaded" class="rounded-md ">
							<th class="px-4 py-2 font-semibold text-default">Snapshot</th>
							<th class="px-4 py-2 font-semibold text-default">Created On</th>
							<th class="px-4 py-2 font-semibold text-default">Used</th>
							<th class="px-4 py-2 font-semibold text-default">Referenced</th>
							<th class="relative px-4 py-2 pl-3 pr-4 sm:pr-6 lg:pr-8">
								<span class="sr-only"></span>
							</th>
						</tr>
						<!-- <tr v-if="!snapshotsLoaded" class="rounded-md flex bg-well justify-center">
							<LoadingSpinner :width="'w-10'" :height="'h-10'" :baseColor="'text-gray-200'" :fillColor="'fill-slate-500'"/>
						</tr> -->
					</thead>
					<tbody class="divide-y divide-default bg-default">
						<tr v-if="snapshots.length > 0 && snapshotsLoaded" v-for="snapshot, snapshotIdx in snapshots" :key="snapshotIdx" class="text-default bg-default ">
							<td class="whitespace-nowrap py-1 px-4 text-sm font-medium text-default bg-default">
								{{ snapshot.name }}
							</td>
							<td class="whitespace-nowrap py-1 px-4 text-sm text-default bg-default">
								{{ snapshot.properties.creation.parsed }}
							</td>
							<td class="whitespace-nowrap py-1 px-4 text-sm text-default bg-default">
								{{ snapshot.properties.used.value }}
							</td>
							<td class="whitespace-nowrap py-1 px-4 text-sm text-default bg-default">
								{{ snapshot.properties.referenced.value }}
							</td>
							<td class="relative whitespace-nowrap mt-1 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8 bg-default">
								<Menu as="div" class="relative inline-block text-right">
									<div>
										<MenuButton class="flex items-center rounded-full bg-default p-2 text-muted hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
											<span class="sr-only">Open options</span>
											<EllipsisVerticalIcon class="w-5" aria-hidden="true" />
										</MenuButton>
									</div>

									<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
										<MenuItems class="absolute right-0 z-10 mt-2 w-max origin-top-left rounded-md bg-accent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											<div class="py-1">
												<MenuItem as="div" v-slot="{ active }">
													<a href="#" @click="cloneThisSnapshot(snapshot)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clone Snapshot</a>
												</MenuItem>
												<MenuItem as="div" v-slot="{ active }">
													<a href="#" @click="renameThisSnapshot(snapshot)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Rename Snapshot</a>
												</MenuItem>
												<MenuItem as="div" v-slot="{ active }">
													<a href="#" @click="rollbackThisSnapshot(snapshot)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Roll Back Snapshot</a>
												</MenuItem>
												<MenuItem as="div" v-slot="{ active }">
													<a href="#" @click="destroyThisSnapshot(snapshot)" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy Snapshot</a>
												</MenuItem>
												<MenuItem as="div" v-slot="{ active }">
													<a href="#" @click="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Send Snapshot</a>
												</MenuItem>
											</div>
										</MenuItems>
									</transition>
								</Menu>
							</td>
						</tr>
						<tr v-if="!snapshotsLoaded && snapshotsLoading" class="rounded-md flex bg-well justify-center">
							<LoadingSpinner :width="'w-10'" :height="'h-10'" :baseColor="'text-gray-200'" :fillColor="'fill-slate-500'"/>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- FILESYSTEMS -->
		<div v-if="props.item == 'filesystem'" class="inline-block min-w-full max-h-max align-middle border-collapse">
			<div class="">
				<table class="table-auto min-w-full min-h-full divide-y divide-default">
					<thead class="bg-secondary border-collapse">
						<tr v-if="snapshotsInFilesystem.length > 0 && snapshotsLoaded" class="rounded-md grid grid-cols-6 font-semibold text-white">
							<!-- <th class="relative py-2 rounded-tl-md col-span-1">
								<span class="sr-only"></span>
							</th> -->
							<th class="py-2 col-span-2">Snapshot</th>
							<th class="py-2 col-span-1">Created On</th>
							<th class="py-2 col-span-1">Used</th>
							<th class="py-2 col-span-1">Referenced</th>
							<th class="relative py-2 sm:pr-6 lg:pr-8 rounded-tr-md col-span-1">
								<span class="sr-only"></span>
							</th>
						</tr>
						<tr v-if="!snapshotsLoaded && snapshotsLoading" class="rounded-md flex bg-well justify-center">
							<LoadingSpinner :width="'w-10'" :height="'h-10'" :baseColor="'text-gray-200'" :fillColor="'fill-slate-500'"/>
						</tr>
					</thead>
					<tbody class="divide-y divide-default bg-accent border-collapse">
						<tr v-if="snapshotsInFilesystem.length < 1 && snapshotsLoaded" class="grid grid-cols-1 items-center justify-center">
							<p class="bg-well text-muted w-full text-center p-4 justify-self-center">No snapshots found.</p>
						</tr>
						<tr v-if="snapshotsInFilesystem.length > 0 && snapshotsLoaded" v-for="snapshot, snapshotIdx in snapshotsInFilesystem" :key="snapshotIdx" class="text-default grid grid-cols-6 justify-items-center items-center">
							<!-- <td class="relative py-2 col-span-1">
								<span class="sr-only"></span>
							</td> -->
							<td class="whitespace-nowrap py-1 text-sm font-medium text-default col-span-2"> 
								{{ snapshot.name }}
							</td>
							<td class="whitespace-nowrap py-1 text-sm text-default col-span-1"> 
								{{ snapshot.properties.creation.parsed }}
							</td>
							<td class="whitespace-nowrap py-1 text-sm text-default col-span-1"> 
								{{ snapshot.properties.used.value }}
							</td>
							<td class="whitespace-nowrap py-1 text-sm text-default col-span-1"> 
								{{ snapshot.properties.referenced.value }}
							</td>
							<td class="relative whitespace-nowrap py-1 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8 col-span-1 justify-self-end"> 
								<Menu as="div" class="relative inline-block text-right">
									<div>
										<MenuButton class="flex items-center rounded-full bg-accent p-2 text-muted hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
											<span class="sr-only">Open options</span>
											<EllipsisVerticalIcon class="w-5" aria-hidden="true" />
										</MenuButton>
									</div>

									<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
										<MenuItems class="absolute right-0 z-10 mt-2 w-max origin-top-left rounded-md bg-accent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											<div class="py-1">
												<MenuItem as="div" v-slot="{ active }">
													<a href="#" @click="cloneThisSnapshot(snapshot)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clone Snapshot</a>
												</MenuItem>
												<MenuItem as="div" v-slot="{ active }">
													<a href="#" @click="renameThisSnapshot(snapshot)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Rename Snapshot</a>
												</MenuItem>
												<MenuItem as="div" v-slot="{ active }">
													<a href="#" @click="rollbackThisSnapshot(snapshot)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Roll Back Snapshot</a>
												</MenuItem>
												<MenuItem as="div" v-slot="{ active }">
													<a href="#" @click="sendThisDataset(snapshot)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Send Snapshot</a>
												</MenuItem>
												<MenuItem as="div" v-slot="{ active }">
													<a href="#" @click="destroyThisSnapshot(snapshot)" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy Snapshot</a>
												</MenuItem>
											</div>
										</MenuItems>
									</transition>
								</Menu>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	
		<div v-if="showDestroySnapshotModal">
			<component :is="destroySnapshotComponent" :showFlag="showDestroySnapshotModal" @close="updateShowDestroySnapshot" :idKey="'confirm-destroy-snapshot'" :item="'snapshot'" :operation="'destroy'" :snapshot="selectedSnapshot!" :confirmOperation="confirmThisDestroy" :firstOption="'Destroy child snapshots with same name'" :secondOption="'Force Destroy ALL child datasets'" :hasChildren="hasChildren"/>
		</div>

		<div v-if="showCloneSnapshotModal">
			<component :is="cloneSnapshotComponent" @close="updateShowCloneSnapshot" :idKey="'clone-snapshot-modal'" :snapshot="selectedSnapshot!"/>
		</div>

		<div v-if="showRenameSnapshotModal">
			<component :is="renameSnapshotComponent" @close="updateShowRenameSnapshot" :idKey="'rename-snapshot-modal'" :snapshot="selectedSnapshot!"/>
		</div>

		<div v-if="showRollbackSnapshotModal">
			<component :is="rollbackSnapshotComponent" :showFlag="showRollbackSnapshotModal" @close="updateShowRollbackSnapshot" :idKey="'confirm-rollback-snapshot'" :item="'snapshot'" :operation="'rollback'" :snapshot="selectedSnapshot!" :confirmOperation="confirmThisRollback" :firstOption="'Destroy all newer snapshots of file system'" :secondOption="'Force Destroy ALL newer datasets'" :hasChildren="hasChildren"/>
		</div>

		<div v-if="showSendSnapshot">
			<component :is="sendSnapshotComponent" @close="updateShowSendSnapshot" idKey="'show-send-snapshot-modal'" :snapshot="selectedSnapshot!" :name="selectedSnapshot!.name" />
		</div>

	</div>

</template>
<script setup lang="ts">
import { ref, inject, Ref, provide, watch, onMounted } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline';
import { loadSnapshots, loadSnapshotsInPool, loadSnapshotsInDataset, loadDatasets } from '../../composables/loadData';
import { destroySnapshot, rollbackSnapshot } from '../../composables/snapshots';
import LoadingSpinner from '../common/LoadingSpinner.vue';

const notifications = inject<Ref<any>>('notifications')!;

interface SnapshotsListProps {
	pool?: PoolData;
	filesystem?: FileSystemData;
	item: 'pool' | 'filesystem';
}

const props = defineProps<SnapshotsListProps>();

////////////////// Loading Data /////////////////////
/////////////////////////////////////////////////////
const datasets = inject<Ref<FileSystemData[]>>('datasets')!;
const datasetsLoaded = inject<Ref<boolean>>('datasets-loaded')!;

// const snapshotsLoaded = inject<Ref<boolean>>('snapshots-loaded')!;
const snapshotsLoaded = ref(false);
const snapshotsLoading = ref(false);
const snapshots = inject<Ref<Snapshot[]>>('snapshots')!;

const snapshotsInFilesystem = ref<Snapshot[]>([]);
const selectedSnapshot = ref<Snapshot>();

// loadTheseSnapshots();
onMounted(() => {
	refreshSnaps();
});

async function refreshData() {
	datasetsLoaded.value = false;
	snapshotsLoaded.value = false;
	datasets.value = [];
	snapshots.value = [];
	snapshotsLoading.value = true;
	await loadDatasets(datasets);
	await loadSnapshots(snapshots);
	snapshotsLoading.value = false;
	datasetsLoaded.value = true;
	snapshotsLoaded.value = true;
}

// async function refreshDatasets() {
// 	datasetsLoaded.value = false;
// 	datasets.value = [];
// 	await loadDatasets(datasets);
// 	datasetsLoaded.value = true;
// }

async function refreshSnaps() {
	snapshotsLoaded.value = false;
	snapshotsLoading.value = true;
	if (props.item == 'pool') {
		snapshots.value = [];
		await loadSnapshotsInPool(snapshots, props.pool!.name);
	} else if (props.item == 'filesystem') {
		snapshotsInFilesystem.value = [];
		await loadSnapshotsInDataset(snapshotsInFilesystem, props.filesystem!.name);
	}
	snapshotsLoaded.value = true;
	snapshotsLoading.value = false;
}

///////// Values for Confirmation Modals ////////////
/////////////////////////////////////////////////////
const operationRunning = ref(false);
const firstOptionToggle = ref(false);
const secondOptionToggle = ref(false);
const thirdOptionToggle = ref(false);
const fourthOptionToggle = ref(false);

///////////////// Destroy Snapshot //////////////////
/////////////////////////////////////////////////////
const showDestroySnapshotModal = ref(false);
const hasChildren = ref(false);
const confirmDestroy = ref(false);

const destroySnapshotComponent = ref();
const loadDestroySnapshotComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	destroySnapshotComponent.value = module.default;
}

async function destroyThisSnapshot(snapshot) {
	operationRunning.value = false;
	selectedSnapshot.value = snapshot;
	
	if (selectedSnapshot.value!.properties.clones.length > 0) {
		hasChildren.value = true;
	}

	await loadDestroySnapshotComponent();
	showDestroySnapshotModal.value = true;
	console.log('selected for destroy:', selectedSnapshot.value);
}

const confirmThisDestroy : ConfirmationCallback = () => {
	confirmDestroy.value = true;
}

const updateShowDestroySnapshot = (newVal) => {
	showDestroySnapshotModal.value = newVal;
}

watch (confirmDestroy, async (newVal, oldVal) => {
	if (confirmDestroy.value == true) {

		console.log('now destroying:', newVal);
		operationRunning.value = true;
		await destroySnapshot(selectedSnapshot.value, firstOptionToggle.value, secondOptionToggle.value);
		operationRunning.value = false;
		await refreshSnaps();
		showDestroySnapshotModal.value = false;
		
		confirmDestroy.value = false;
		hasChildren.value = false;
		console.log('destroyed:', selectedSnapshot.value);
		firstOptionToggle.value = false;
		secondOptionToggle.value = false;
		notifications.value.constructNotification('Snapshot Destroyed', `${selectedSnapshot.value!.name} destroyed.`, 'success');
	}
});

////////////////// Clone Snapshot ///////////////////
/////////////////////////////////////////////////////
const showCloneSnapshotModal = ref(false);
const cloning = ref(false);
const confirmClone = ref(false);

const cloneSnapshotComponent = ref();
const loadCloneSnapshotComponent = async () => {
	const module = await import('./CloneSnapshot.vue');
	cloneSnapshotComponent.value = module.default;
}

async function cloneThisSnapshot(snapshot) {
	selectedSnapshot.value = snapshot;
	console.log('clone snapshot modal triggered');
	await loadCloneSnapshotComponent();
	showCloneSnapshotModal.value = true;
}

const updateShowCloneSnapshot = (newVal) => {
	showCloneSnapshotModal.value = newVal;
}

watch(confirmClone, async (newVal, oldVal) => {
	if (confirmClone.value == true) {
		operationRunning.value = true;
		await refreshSnaps();
		confirmClone.value = false;
		operationRunning.value = false;
		notifications.value.constructNotification('Snapshot Cloned', `Cloned snapshot ${selectedSnapshot.value!.name} .`, 'success');
	}
});

/////////////// Rollback Snapshot ///////////////////
/////////////////////////////////////////////////////
const showRollbackSnapshotModal = ref(false);
const confirmRollback = ref(false);

const rollbackSnapshotComponent = ref();
const loadRollbackSnapshotComponent = async () => {
	const module = await import('../common/UniversalConfirmation.vue');
	rollbackSnapshotComponent.value = module.default;
}

async function rollbackThisSnapshot(snapshot) {
	selectedSnapshot.value = snapshot;
	console.log('selected to be rolled back:', selectedSnapshot.value);
	await loadRollbackSnapshotComponent();
	showRollbackSnapshotModal.value = true;
}

const confirmThisRollback : ConfirmationCallback = () => {
	confirmRollback.value = true;
}

const updateShowRollbackSnapshot = (newVal) => {
	showRollbackSnapshotModal.value = newVal;
}

watch(confirmRollback, async (newVal, oldVal) => {
	if (confirmRollback.value == true) {
		operationRunning.value = true;
		await rollbackSnapshot(selectedSnapshot.value, firstOptionToggle.value, secondOptionToggle.value);
		console.log('rolled back:', selectedSnapshot.value);
		showRollbackSnapshotModal.value = false;

		confirmRollback.value = false;
		await refreshSnaps();
		operationRunning.value = false;
		notifications.value.constructNotification('Snapshot Rolled Back', `Rolled back to snapshot ${selectedSnapshot.value!.name} .`, 'success');
	}
});

///////////////// Rename Snapshot ///////////////////
/////////////////////////////////////////////////////
const showRenameSnapshotModal = ref(false);
const renaming = ref(false);
const confirmRename = ref(false);

const renameSnapshotComponent = ref();
const loadRenameSnapshotComponent = async () => {
	const module = await import('./RenameSnapshot.vue');
	renameSnapshotComponent.value = module.default;
}

async function renameThisSnapshot(snapshot) {
	selectedSnapshot.value = snapshot;
	console.log('rename snapshot modal triggered');
	await loadRenameSnapshotComponent();
	showRenameSnapshotModal.value = true;
}

const updateShowRenameSnapshot = (newVal) => {
	showRenameSnapshotModal.value = newVal;
}

watch(confirmRename, async (newVal, oldVal) => {
	if (confirmRename.value == true) {
		operationRunning.value = true;
		await refreshSnaps();
		confirmRename.value = false;
		operationRunning.value = false;
		notifications.value.constructNotification('Snapshot Renamed', `Renamed snapshot ${selectedSnapshot.value!.name} .`, 'success');
	}
});


/////////////////// Send Snapshot ///////////////////
/////////////////////////////////////////////////////
const showSendSnapshot = ref(false);
const sendingSnap = ref(false);
const confirmSendSnap = ref(false);

const sendSnapshotComponent = ref();
const loadSendSnapshotComponent = async () => {
	const module = await import('./SendSnapshot.vue');
	sendSnapshotComponent.value = module.default;
}

async function sendThisDataset(snapshot) {
	selectedSnapshot.value = snapshot;
	confirmSendSnap.value = false;
	console.log('selected to send:', selectedSnapshot.value);
	await loadSendSnapshotComponent();
	showSendSnapshot.value = true;
}

const updateShowSendSnapshot = (newVal) => {
	showSendSnapshot.value = newVal;
}

watch(confirmSendSnap, async (newVal, oldVal) => {
	if (confirmSendSnap.value == true) {
		await refreshData();
		await refreshSnaps();
		notifications.value.constructNotification('Snapshot Sent', `Sent snapshot ${selectedSnapshot.value!.name}.`, 'success');
	}
});

// provide('snapshots-loaded', snapshotsLoaded)!;
provide('cloning', cloning);
provide('confirm-clone', confirmClone);
provide('show-clone-modal', showCloneSnapshotModal);
provide('renaming', renaming);
provide('confirm-rename', confirmRename);
provide('show-rename-modal', showRenameSnapshotModal);

provide('show-send-dataset', showSendSnapshot);
provide('sending', sendingSnap);
provide('confirm-send', confirmSendSnap);

provide('modal-confirm-running', operationRunning);
provide('modal-option-one-toggle', firstOptionToggle);
provide('modal-option-two-toggle', secondOptionToggle);
provide('modal-option-three-toggle', thirdOptionToggle);
provide('modal-option-four-toggle', fourthOptionToggle);
</script>