<template>
	<div>
		<div v-if="snapshotsInPool.length < 1" class="flex items-center justify-center">
			<p class="text-default">No snapshots found.</p>
		</div>
		<div v-else class="inline-block min-w-full max-h-max align-middle rounded-md border border-default ">
			<div class="ring-1 ring-black ring-opacity-5 sm:rounded-lg">
				<table class="table-fixed min-w-full min-h-full divide-y divide-default bg-well">
					<thead>
						<tr class="rounded-md">
							<th class="px-3 py-3.5 text-left text-sm font-semibold text-default">Name</th>
							<th class="px-3 py-3.5 text-left text-sm font-semibold text-default">Created</th>
							<th class="px-3 py-3.5 text-left text-sm font-semibold text-default">Used</th>
							<th class="px-3 py-3.5 text-left text-sm font-semibold text-default">Referenced</th>
							<th class="relative px-3 py-3.5 sm:pr-6 lg:pr-8">
								<span class="sr-only"></span>
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-x divide-default bg-default">
						<tr v-if="!snapshotsLoaded" class="bg-well justify-center">
							<LoadingSpinner baseColor="text-gray-200" fillColor="fill-slate-500"/>
						</tr>
						<tr v-if="snapshotsLoaded" v-for="snapshot, snapshotIdx in snapshotsInPool" :key="snapshotIdx" class="text-default ml-4">
							<td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-default">
								{{ snapshot.name }}
							</td>
							<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">
								{{ snapshot.properties.creation.parsed }}
							</td>
							<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">
								{{ snapshot.properties.used.value }}
							</td>
							<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">
								{{ snapshot.properties.referenced.value }}
							</td>
							<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
								<Menu as="div" class="relative inline-block text-right">
									<div>
										<MenuButton class="flex items-center rounded-full bg-accent text-muted hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
											<span class="sr-only">Open options</span>
											<EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
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
			<UniversalConfirmation  :showFlag="showDestroySnapshotModal" @close="updateShowDestroySnapshot" :idKey="'confirm-destroy-snapshot'" :item="'snapshot'" :operation="'destroy'" :snapshot="selectedSnapshot!" :confirmOperation="confirmThisDestroy" :firstOption="'Destroy child snapshots with same name'" :secondOption="'Force Destroy ALL child datasets'" :hasChildren="hasChildren"/>
		</div>

		<div v-if="showCloneSnapshotModal">
			<CloneSnapshot @close="showCloneSnapshotModal = false" :idKey="'clone-snapshot-modal'" :snapshot="selectedSnapshot!"/>
		</div>

		<div v-if="showRenameSnapshotModal">
			<RenameSnapshot @close="showRenameSnapshotModal = false" :idKey="'rename-snapshot-modal'" :snapshot="selectedSnapshot!"/>
		</div>

		<div v-if="showRollbackSnapshotModal">
			<UniversalConfirmation :showFlag="showRollbackSnapshotModal" @close="updateShowRollbackSnapshot" :idKey="'confirm-rollback-snapshot'" :item="'snapshot'" :operation="'rollback'" :snapshot="selectedSnapshot!" :confirmOperation="confirmThisRollback" :firstOption="'Destroy all newer snapshots of file system'" :secondOption="'Force Destroy ALL newer datasets'" :hasChildren="hasChildren"/>
		</div>

		<CreateSnapshotModal @close="showSnapshotModal = false" :poolName="props.pool!.name"/>
	</div>

</template>
<script setup lang="ts">
import { reactive, ref, inject, Ref, computed, provide, watch } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems, Switch } from '@headlessui/vue';
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { getTimestampString, upperCaseWord, isBoolOnOff } from '../../composables/helpers';
import { loadDisksThenPools, loadSnapshots, loadSnapshotsInPool } from '../../composables/loadData';
import { destroySnapshot, rollbackSnapshot, cloneSnapshot, renameSnapshot } from '../../composables/snapshots';
import CreateSnapshotModal from '../snapshots/CreateSnapshotModal.vue';
import CloneSnapshot from '../snapshots/CloneSnapshot.vue';
import RenameSnapshot from '../snapshots/RenameSnapshot.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue';
import UniversalConfirmation from '../common/UniversalConfirmation.vue';

const notifications = inject<Ref<any>>('notifications')!;

interface SnapshotsListProps {
	pool?: PoolData;
	filesystem?: FileSystemData;
	snapshots: Snapshot[];
}

const props = defineProps<SnapshotsListProps>();

////////////////// Loading Data /////////////////////
/////////////////////////////////////////////////////
const pools = inject<Ref<PoolData[]>>('pools')!;
const poolsLoaded = inject<Ref<boolean>>('pools-loaded')!;
const disks = inject<Ref<DiskData[]>>('disks')!;
const disksLoaded = inject<Ref<boolean>>('disks-loaded')!;

const datasets = inject<Ref<FileSystemData[]>>('datasets')!;

// const snapshots = ref<Snapshot[]>([]);
const snapshotsLoaded = ref(true);
// const snapshots = inject<Ref<Snapshot[]>>('snapshots')!;
// const snapshotsLoaded = inject<Ref<boolean>>('snapshots-loaded')!;
const snapshotsInPool = ref<Snapshot[]>([]);
const selectedSnapshot = ref<Snapshot>();

// loadSnapshots(snapshots);
loadSnapshotsInPool(snapshotsInPool, props.pool!.name);

async function refreshSnaps() {
	// disksLoaded.value = false;
	// poolsLoaded.value = false;
	snapshotsLoaded.value = false;
	// pools.value = [];
	// disks.value = [];
	snapshotsInPool.value = [];
	// await loadDisksThenPools(disks, pools);
	await loadSnapshotsInPool(snapshotsInPool, props.pool!.name);
	// disksLoaded.value = true;
	// poolsLoaded.value = true;
	snapshotsLoaded.value = true;
}

///////// Values for Confirmation Modals ////////////
/////////////////////////////////////////////////////
const operationRunning = ref(false);
const firstOptionToggle = ref(false);
const secondOptionToggle = ref(false);
const thirdOptionToggle = ref(false);
const fourthOptionToggle = ref(false);


///////////////// Create Snapshots //////////////////
/////////////////////////////////////////////////////
const showSnapshotModal = ref(false);
const creating = ref(false);
const confirmCreate = ref(false);

function createSnapshotBtn() {
	showSnapshotModal.value = true;
	console.log('create snapshot modal triggered');
}

watch(confirmCreate, async (newVal, oldVal) => {
	if (confirmCreate.value == true) {
		operationRunning.value = true;
		await refreshSnaps();
		confirmCreate.value = false;
		operationRunning.value = false;
		notifications.value.constructNotification('Snapshot Created', `Created new snapshot.`, 'success');
	}
});

///////////////// Destroy Snapshot //////////////////
/////////////////////////////////////////////////////
const showDestroySnapshotModal = ref(false);
const hasChildren = ref(false);
const confirmDestroy = ref(false);

function destroyThisSnapshot(snapshot) {
	operationRunning.value = false;
	selectedSnapshot.value = snapshot;
	
	if (selectedSnapshot.value!.properties.clones.length > 0) {
		hasChildren.value = true;
	}

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
		refreshSnaps();
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

function cloneThisSnapshot(snapshot) {
	showCloneSnapshotModal.value = true;
	selectedSnapshot.value = snapshot;
	console.log('clone snapshot modal triggered');
}


/////////////// Rollback Snapshot ///////////////////
/////////////////////////////////////////////////////
const showRollbackSnapshotModal = ref(false);
const confirmRollback = ref(false);

function rollbackThisSnapshot(snapshot) {
	showRollbackSnapshotModal.value = true;
	selectedSnapshot.value = snapshot;
	console.log('selected to be rolled back:', selectedSnapshot.value);
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

function renameThisSnapshot(snapshot) {
	showRenameSnapshotModal.value = true;
	selectedSnapshot.value = snapshot;
	console.log('rename snapshot modal triggered');
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

const getIdKey = (name: string) => `${name}`;

provide('create-snap-modal', showSnapshotModal);
provide('create-snap-modal', showSnapshotModal);
provide('snapshots-loaded', snapshotsLoaded)!;
provide("snapshots-in-pool", snapshotsInPool);
provide('confirm-create', confirmCreate);
provide('creating', creating);
provide('cloning', cloning);
provide('confirm-clone', confirmClone);
provide('show-clone-modal', showCloneSnapshotModal);
provide('renaming', renaming);
provide('confirm-rename', confirmRename);
provide('show-rename-modal', showRenameSnapshotModal);
provide('modal-confirm-running', operationRunning);
provide('modal-option-one-toggle', firstOptionToggle);
provide('modal-option-two-toggle', secondOptionToggle);
provide('modal-option-three-toggle', thirdOptionToggle);
provide('modal-option-four-toggle', fourthOptionToggle);
</script>