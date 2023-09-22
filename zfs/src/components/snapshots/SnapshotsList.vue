<template>
	<Modal @close="showPoolDetails = false" :isOpen="showPoolDetails" :marginTop="'mt-28'" :width="'w-8/12'" :minWidth="'min-w-8/12'">
		<template v-slot:title>
			<Navigation :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
		</template>
		<template v-slot:content>
			
			<div class="">
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
															<a href="#" @click="cloneSnapshotBtn()" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clone Snapshot</a>
														</MenuItem>
														<MenuItem as="div" v-slot="{ active }">
															<a href="#" @click="renameSnapshotBtn()" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Rename Snapshot</a>
														</MenuItem>
														<MenuItem as="div" v-slot="{ active }">
															<a href="#" @click="rollbackSnapshotBtn()" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Roll Back Snapshot</a>
														</MenuItem>
														<MenuItem as="div" v-slot="{ active }">
															<a href="#" @click="destroySnapshotBtn(snapshot)" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy Snapshot</a>
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
			</div>

			
		</template>
		<template v-slot:footer>
	
		</template>
	</Modal>

	<div v-if="showDestroySnapshotModal">
		<UniversalConfirmation  :showFlag="showDestroySnapshotModal" @close="updateShowDestroySnapshot" :idKey="'confirm-destroy-snapshot'" :item="'snapshot'" :operation="'destroy'" :snapshot="selectedSnapshot!" :confirmOperation="confirmThisDestroy" :firstOption="'Destroy child snapshots with same name'" :secondOption="'Destroy ALL child snapshots, clones and file systems'" :hasChildren="hasChildren"/>
	</div>

	<CreateSnapshotModal @close="showSnapshotModal = false" :poolName="props.pool.name"/>

	
</template>

<script setup lang="ts">
import { reactive, ref, inject, Ref, computed, provide, watch } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems, Switch } from '@headlessui/vue';
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { configurePool } from '../../composables/pools';
import { getTimestampString, upperCaseWord, isBoolOnOff } from '../../composables/helpers';
import { loadDisksThenPools, loadSnapshots, loadSnapshotsInPool } from '../../composables/loadData';
import { destroySnapshot } from '../../composables/snapshots';
import Modal from '../common/Modal.vue';
import CircleProgress from '../common/CircleProgress.vue';
import Navigation from '../common/Navigation.vue';
import CreateSnapshotModal from '../snapshots/CreateSnapshotModal.vue';
import PoolDetailDiskCard from '../disks/PoolDetailDiskCard.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue';
import UniversalConfirmation from '../common/UniversalConfirmation.vue';

const notifications = inject<Ref<any>>('notifications')!;

interface PoolDetailsProps {
	pool: PoolData;
}

const props = defineProps<PoolDetailsProps>();


////////////////// Loading Data /////////////////////
/////////////////////////////////////////////////////
const pools = inject<Ref<PoolData[]>>('pools')!;

const datasets = inject<Ref<FileSystemData[]>>('datasets')!;


const snapshotsLoaded = ref(true);

const snapshotsInPool = ref<Snapshot[]>([]);
const selectedSnapshot = ref<Snapshot>();

// loadSnapshots(snapshots);
loadSnapshotsInPool(snapshotsInPool, props.pool.name);


async function refreshSnaps() {
		// disksLoaded.value = false;
		// poolsLoaded.value = false;
		snapshotsLoaded.value = false;
		// pools.value = [];
		// disks.value = [];
		snapshotsInPool.value = [];
		// await loadDisksThenPools(disks, pools);
		await loadSnapshotsInPool(snapshotsInPool, props.pool.name);
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

function createSnapshotBtn() {
	showSnapshotModal.value = true;
	console.log('create snapshot modal triggered');
}

///////////////// Destroy Snapshot //////////////////
/////////////////////////////////////////////////////
const showDestroySnapshotModal = ref(false);
const hasChildren = ref(false);
const confirmDestroy = ref(false);

function destroySnapshotBtn(snapshot) {
	destroyThisSnapshot(snapshot);
}

function destroyThisSnapshot(snapshot) {
	operationRunning.value = false;
	selectedSnapshot.value = snapshot;
	//check if has children then set hasChildren

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
		notifications.value.constructNotification('Snapshot Destroyed', selectedSnapshot.value!.name + " destroyed.", 'success');
	}
});

////////////////// Clone Snapshot ///////////////////
/////////////////////////////////////////////////////
function cloneSnapshotBtn() {

}

/////////////// Rollback Snapshot ///////////////////
/////////////////////////////////////////////////////
function rollbackSnapshotBtn() {
	
}

///////////////// Rename Snapshot ///////////////////
/////////////////////////////////////////////////////
function renameSnapshotBtn() {
	
}


const getIdKey = (name: string) => `${name}`;

provide('create-snap-modal', showSnapshotModal);
provide('snapshots-loaded', snapshotsLoaded)!;
provide("snapshots-in-pool", snapshotsInPool);
provide('creating', creating);

provide('modal-confirm-running', operationRunning);
provide('modal-option-one-toggle', firstOptionToggle);
provide('modal-option-two-toggle', secondOptionToggle);
provide('modal-option-three-toggle', thirdOptionToggle);
provide('modal-option-four-toggle', fourthOptionToggle);
</script>
