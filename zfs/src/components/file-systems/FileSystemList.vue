<template>
	<div class="inline-block min-w-full py-4 align-middle sm:px-6 lg:px-8 overflow-visible sm:rounded-lg bg-accent rounded-md border border-default">
		<div class="button-group-row">
			<button id="createFS" class="btn btn-primary object-left justify-start" @click="showNewFSWizard = true">Create File System</button>
			<button id="refreshFS" class="btn btn-secondary object-right justify-end" @click="refreshData()"><ArrowPathIcon class="w-5 h-5"/></button>
		</div>

		<div class="mt-8 overflow-visible rounded-md max-w-7xl">
			<div class="inline-block min-w-full min-h-full shadow align-middle rounded-md border border-default">

				<div class="overflow-visible ring-1 ring-black ring-opacity-5 rounded-md sm:rounded-lg">

					<table class="min-w-full divide-y divide-default rounded-md">
						<thead class="rounded-md">
							<tr class="bg-well rounded-t-md grid grid-cols-12">

								<th class="relative py-3.5 rounded-tl-md col-span-1">
									<span class="sr-only"></span>
								</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Name</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Available</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Used</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Refreservation</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Compression</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Deduplication</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Encryption</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Mounted</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Snapshots</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Read Only</th>
								<th class="relative py-3.5 sm:pr-6 lg:pr-8 rounded-tr-md col-span-1">
									<span class="sr-only"></span>
								</th>
								
							</tr>
						</thead>
					</table>

					<div v-if="fileSystems.length > 0 && fileSystemsLoaded == true">
						<div v-for="fileSystem, fsIdx in fileSystems">
							<Accordion :btnColor="'btn-primary'" :gridSize="'grid-cols-12'" :btnColSpan="'col-span-1'" :titleColSpan="'col-span-11'" :contentColSpan="'col-span-12'" :isOpen="false" class="bg-default rounded-b-md border border-solid border-default" :key="fsIdx">
								<template v-slot:title>
									<div class="grid grid-cols-11 grid-flow-cols w-full justify-center text-center">
										<button @click="loadFileSystemConfig(fileSystems[fsIdx])" class="grid grid-cols-10 col-span-10 hover:bg-accent pt-1 rounded-r-lg">
											<div class="px-4 py-4 text-sm font-medium text-default"> {{ fileSystem.name }}</div>
											<div class="px-3 py-4 text-sm text-muted">{{ convertBytesToSize(fileSystem.properties.available) }}</div>
											<div class="px-3 py-4 text-sm text-muted">{{ fileSystem.properties.usedByDataset }}</div>
											<div class="px-3 py-4 text-sm text-muted">{{ fileSystem.properties.usedbyRefreservation }}</div>
											<div v-if="fileSystem.properties.compression == 'off' || fileSystem.properties.compression == 'on'" class="px-3 py-4 text-sm text-muted">{{ upperCaseWord(fileSystem.properties.compression) }}</div>
											<div v-else class="px-3 py-4 text-sm text-muted">{{ (fileSystem.properties.compression).toUpperCase() }}</div>
											<div class="px-3 py-4 text-sm text-muted">{{ upperCaseWord(fileSystem.properties.deduplication) }}</div>
											<div class="px-3 py-4 text-sm text-muted">{{ upperCaseWord(isBoolOnOff(fileSystem.encrypted)) }}</div>
											<div class="px-3 py-4 text-sm text-muted">{{ upperCaseWord(fileSystem.properties.mounted) }}</div>
											<div class="px-3 py-4 text-sm text-muted">{{ upperCaseWord(fileSystem.properties.snapshotCount) }}</div>
											<div class="px-3 py-4 text-sm text-muted">{{ upperCaseWord(fileSystem.properties.readOnly) }}</div>
										</button>
										<div class="relative py-4 pl-3 pr-4 text-right font-medium sm:pr-6 lg:pr-8">
											<Menu as="div" class="relative inline-block text-left">
												<div>
													<MenuButton class="flex items-center rounded-full bg-accent text-muted hover:text-default focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
														<span class="sr-only">Open options</span>
														<EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
													</MenuButton>
												</div>
												<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
													<MenuItems class="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-accent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
														<div class="py-1">
															<MenuItem as="div" v-slot="{ active }">
																<a href="#" @click="loadFileSystemConfig(fileSystems[fsIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Configure File System</a>
															</MenuItem>
														
															<MenuItem as="div" v-if="!findPoolDataset(fileSystems[fsIdx])" v-slot="{ active }">
																<a href="#" @click="renameThisDataset(fileSystems[fsIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Rename File System</a>
															</MenuItem>

															<MenuItem as="div" v-if="fileSystems[fsIdx].properties.mounted == 'yes'" v-slot="{ active }">
																<a href="#" @click="unmountThisFileSystem(fileSystems[fsIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Unmount File System</a>
															</MenuItem>
															
															<MenuItem as="div" v-if="fileSystems[fsIdx].properties.mounted == 'no' && !fileSystems[fsIdx].encrypted" v-slot="{ active }">
																<a href="#" @click="mountThisFileSystem(fileSystems[fsIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Mount File System</a>
															</MenuItem>
															<MenuItem as="div" v-if="fileSystems[fsIdx].properties.mounted == 'no' && fileSystems[fsIdx].encrypted && fileSystems[fsIdx].key_loaded" v-slot="{ active }">
																<a href="#" @click="mountThisFileSystem(fileSystems[fsIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Mount File System</a>
															</MenuItem>
															<MenuItem as="div" v-if="fileSystems[fsIdx].properties.mounted == 'no' && fileSystems[fsIdx].encrypted && !fileSystems[fsIdx].key_loaded" v-slot="{ active }">
																<a href="#" @click="handleFileSystemEncryption(fileSystems[fsIdx], 'unlock')" :class="[active ? 'bg-green-600 text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Unlock File System</a>
															</MenuItem>
															<MenuItem as="div" v-if="fileSystems[fsIdx].properties.mounted == 'no' && fileSystems[fsIdx].encrypted && fileSystems[fsIdx].key_loaded" v-slot="{ active }">
																<a href="#" @click="handleFileSystemEncryption(fileSystems[fsIdx], 'lock')" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Lock File System</a>
															</MenuItem>
															
															<MenuItem as="div" v-if="!findPoolDataset(fileSystems[fsIdx])" v-slot="{ active }">
																<a href="#" @click="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Configure Replication Task</a>
															</MenuItem>
															<MenuItem as="div" v-if="fileSystems[fsIdx].encrypted && fileSystems[fsIdx].key_loaded" v-slot="{ active }">
																<a href="#" @click="changeThisPassphrase(fileSystems[fsIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Change Passphrase</a>
															</MenuItem>
															<MenuItem as="div" v-slot="{ active }">
																<a href="#" @click="createSnapshotBtn(fileSystems[fsIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Create Snapshot</a>
															</MenuItem>
															<MenuItem as="div" v-if="!findPoolDataset(fileSystems[fsIdx])" v-slot="{ active }">
																<a href="#" @click="sendThisDataset(fileSystems[fsIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Send File System</a>
															</MenuItem>
															<MenuItem as="div" v-if="!findPoolDataset(fileSystems[fsIdx])" v-slot="{ active }">
																<a href="#" @click="deleteFileSystem(fileSystems[fsIdx])" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy File System</a>
															</MenuItem>											
														</div>
													</MenuItems>
												</transition>
											</Menu>
										</div>
									</div>
								</template>
								<template v-slot:content>
									<div>
										<SnapshotsList :filesystem="fileSystems[fsIdx]" :item="'filesystem'"/>
									</div>
								</template>
							</Accordion>
						</div>
					</div>

					<div v-if="fileSystemsLoaded == false" class="p-2 flex justify-center bg-default">
						<LoadingSpinner :width="'w-10'" :height="'h-10'" :baseColor="'text-gray-200'" :fillColor="'fill-slate-500'" class="font-semibold text-lg my-0.5"/>
					</div>
					<div v-if="fileSystems.length < 1 && fileSystemsLoaded == true" class="p-2 flex bg-default justify-center">
						<span class="font-semibold text-lg my-2">No File Systems Found</span>
					</div>
				</div>

			</div>
		</div>
	</div>

	<div v-if="showNewFSWizard">
		<FileSystem :isStandalone="true" idKey="fs-wizard" @close="showNewFSWizard = false"/>
	</div>

	<div v-if="showFSConfig">
		<FileSystemConfigModal ref="fileSystemConfiguration" :filesystem="selectedDataset!" idKey="fs-config" @close="showFSConfig = false"/>
	</div>

	<div v-if="showDeleteFileSystemConfirm">
		<UniversalConfirmation  :showFlag="showDeleteFileSystemConfirm" @close="updateShowDestroyFileSystem" :idKey="'confirm-destroy-filesystem'" :item="'filesystem'" :operation="'destroy'" :filesystem="selectedDataset!" :confirmOperation="confirmThisDestroy" :firstOption="'force unmount'" :hasChildren="hasChildren"/>
	</div>

	<div v-if="showUnmountFileSystemConfirm">
		<UniversalConfirmation v-if="selectedDataset!.encrypted" :showFlag="showUnmountFileSystemConfirm" @close="updateShowUnmountFileSystem" :idKey="'confirm-unmount-filesystem'" :item="'filesystem'" :operation="'unmount'" :filesystem="selectedDataset!" :confirmOperation="confirmThisUnmount" :firstOption="'force unmount'" :secondOption="'lock file system'" :hasChildren="hasChildren"/>
		<UniversalConfirmation v-else :showFlag="showUnmountFileSystemConfirm" @close="updateShowUnmountFileSystem" :idKey="'confirm-unmount-filesystem'" :item="'filesystem'" :operation="'unmount'" :filesystem="selectedDataset!" :confirmOperation="confirmThisUnmount" :firstOption="'force unmount'" :hasChildren="hasChildren"/>
	</div>

	<div v-if="showMountFileSystemConfirm">
		<UniversalConfirmation :showFlag="showMountFileSystemConfirm" @close="updateShowMountFileSystem" :idKey="'confirm-mount-filesystem'" :item="'filesystem'" :operation="'mount'" :filesystem="selectedDataset!" :confirmOperation="confirmThisMount" :firstOption="'force mount'" :hasChildren="hasChildren"/>
	</div>

	<div v-if="showLockUnlockModal">
		<LockUnlockFileSystem :showFlag="showLockUnlockModal" @close="showLockUnlockModal = false" :idKey="'confirm-lock-or-unlock'" :mode="modeSelected!" :filesystem="selectedDataset!"/>
	</div>

	<div v-if="showRenameModal">
		<RenameFileSystem :idKey="'show-rename-modal'" :filesystem="selectedDataset!" @close="showRenameModal = false" />
	</div>

	<div v-if="showSnapshotModal">
		<CreateSnapshotModal :idKey="'show-create-snap-modal'" @close="showSnapshotModal = false" :item="'filesystem'" />
	</div>

	<div v-if="showChangePassphrase">
		<ChangePassphrase :idKey="'show-change-passphrase-modal'" @close="showChangePassphrase = false" :filesystem="selectedDataset!"/>
	</div>

	<div v-if="showSendDataset">
		<SendDataset :idKey="'show-send-dataset-modal'" @close="showSendDataset = false" :dataset="selectedDataset!" :name="selectedDataset!.name" :dataType="'filesystem'"/>
	</div>

	
</template>

<script setup lang="ts">
import { ref, inject, Ref, provide, watch, computed, onMounted } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { loadDatasets, loadSnapshots, loadSnapshotsInDataset } from "../../composables/loadData";
import { isBoolOnOff, convertBytesToSize, upperCaseWord } from '../../composables/helpers';
import { destroyDataset, unmountFileSystem, mountFileSystem, lockFileSystem } from "../../composables/datasets";
import LoadingSpinner from "../common/LoadingSpinner.vue";
import Accordion from "../common/Accordion.vue";
import FileSystem from "../wizard-components/FileSystem.vue";
import FileSystemConfigModal from "./FileSystemConfigModal.vue";
import CreateSnapshotModal from '../snapshots/CreateSnapshotModal.vue';
import RenameFileSystem from "./RenameFileSystem.vue";
import UniversalConfirmation from "../common/UniversalConfirmation.vue";
import SnapshotsList from "../snapshots/SnapshotsList.vue";
import SendDataset from './SendDataset.vue';
import ChangePassphrase from "./ChangePassphrase.vue";
import LockUnlockFileSystem from "./LockUnlockFileSystem.vue";

const notifications = inject<Ref<any>>('notifications')!;

///////// Values for Confirmation Modals ////////////
/////////////////////////////////////////////////////
const operationRunning = ref(false);
const firstOptionToggle = ref(false);
const secondOptionToggle = ref(false);
const thirdOptionToggle = ref(false);
const fourthOptionToggle = ref(false);

/////////////// Loading/Refreshing //////////////////
/////////////////////////////////////////////////////
const fileSystemsLoaded = inject<Ref<boolean>>('datasets-loaded')!;
const fileSystemConfiguration = ref();
const showNewFSWizard = ref(false);
const showFSConfig = ref(false);

const pools = inject<Ref<PoolData[]>>('pools')!;
const fileSystems = inject<Ref<FileSystemData[]>>('datasets')!;
const selectedDataset = ref<FileSystemData>();
const snapshots = inject<Ref<Snapshot[]>>('snapshots')!;
const snapshotsLoaded = inject<Ref<boolean>>('snapshots-loaded')!;

async function refreshData() {
	fileSystemsLoaded.value = false;
	snapshotsLoaded.value = false;
	fileSystems.value = [];
	snapshots.value = [];
	await loadDatasets(fileSystems);
	await loadSnapshots(snapshots);
	fileSystemsLoaded.value = true;
	snapshotsLoaded.value = true;
}

refreshData();

function loadFileSystemConfig(fileSystem) {
	selectedDataset.value = fileSystem;
	console.log('loading:', selectedDataset);
	showFSConfig.value = true
}

function findPoolDataset(fileSystem) {
	try {
		return pools.value.find(pool => pool.name == fileSystem.name);
	} catch (error) {
		console.log('error finding pool:', error);
	}
}

function findSnapDataset(fileSystem) {
    try {
        return snapshots.value.some(snapshot => snapshot.dataset === fileSystem.name);
    } catch (error) {
        console.error('Error finding snapshot:', error);
    }
}

async function refreshDatasetSnaps(filesystem) {
	snapshots.value = [];
	await loadSnapshotsInDataset(snapshots, filesystem);
}

///////////////// Create Snapshots //////////////////
/////////////////////////////////////////////////////
const showSnapshotModal = ref(false);
const creating = ref(false);
const confirmCreate = ref(false);

function createSnapshotBtn(filesystem) {
	selectedDataset.value = filesystem;
	showSnapshotModal.value = true;
	console.log('create snapshot modal triggered');
}

watch(confirmCreate, async (newVal, oldVal) => {
	if (confirmCreate.value == true) {
		operationRunning.value = true;
		await refreshData();
		await refreshDatasetSnaps(selectedDataset.value);
		confirmCreate.value = false;
		operationRunning.value = false;
		notifications.value.constructNotification('Snapshot Created', `Created new snapshot.`, 'success');
	}
});

////////////// Destroy File System //////////////////
/////////////////////////////////////////////////////
const hasChildren = ref(false);
// const forceDestroy = ref(false);
const destroyChildren = ref(false);
const destroyAllDependents = ref(false);
const showDeleteFileSystemConfirm = ref(false);
const confirmDelete = ref(false);
const isDeleting = ref(false);

async function deleteFileSystem(fileSystem) {
	operationRunning.value = false;
	selectedDataset.value = fileSystem;
	// await refreshDatasetSnaps(selectedDataset.value);
	// console.log('snapshots', snapshots.value);
	console.log('findSnapDataset', findSnapDataset(selectedDataset.value));
	if (selectedDataset.value) { 
		if ((!findPoolDataset(selectedDataset.value) && selectedDataset.value!.children!.length > 0) || findSnapDataset(selectedDataset.value)) {
			hasChildren.value = true;
		} else {
			hasChildren.value = false;
		}
	}

	showDeleteFileSystemConfirm.value = true;
	console.log('selected for deletion:', selectedDataset.value);
}

const confirmThisDestroy : ConfirmationCallback = () => {
	confirmDelete.value = true;
}

const updateShowDestroyFileSystem = (newVal) => {
	showDeleteFileSystemConfirm.value = newVal;
}

watch(confirmDelete, async (newValue, oldValue) => {
	if (confirmDelete.value == true) {
		
		console.log('now deleting:', newValue);
		operationRunning.value = true;
		await destroyDataset(selectedDataset.value!, firstOptionToggle.value, thirdOptionToggle.value, fourthOptionToggle.value);
		operationRunning.value = false;
		await refreshData();
		await refreshDatasetSnaps(selectedDataset.value);
		showDeleteFileSystemConfirm.value = false;
		confirmDelete.value = false;
		// hasChildren.value = false;
		console.log('deleted:', selectedDataset.value!);
		firstOptionToggle.value = false;
		thirdOptionToggle.value = false;
		fourthOptionToggle.value = false;
		notifications.value.constructNotification('File System Destroyed', selectedDataset.value!.name + " destroyed.", 'success');
	}
});

/////////////// Unmount File System /////////////////
/////////////////////////////////////////////////////
const showUnmountFileSystemConfirm = ref(false);
const forceUnmount = ref(false);
const lockThisFileSystem = ref(false);
const unmounting = ref(false);
const confirmUnmount = ref(false);

function unmountThisFileSystem(fileSystem) {
	showUnmountFileSystemConfirm.value = true;
	selectedDataset.value = fileSystem;
	console.log('selected to be unmounted:', selectedDataset.value);
}

const confirmThisUnmount : ConfirmationCallback = () => {
	confirmUnmount.value = true;
}

const updateShowUnmountFileSystem = (newVal) => {
	showUnmountFileSystemConfirm.value = newVal;
}

watch(confirmUnmount, async (newValue, oldValue) => {
	console.log('confirmUnmount changed:', newValue);
	
	if (confirmUnmount.value == true) {
		unmounting.value = true;
		operationRunning.value = true;
		await unmountFileSystem(selectedDataset.value!, forceUnmount.value);
		console.log('unmounted:', selectedDataset.value!);
		if (selectedDataset.value?.encrypted && lockThisFileSystem.value == true) {
			lockFileSystem(selectedDataset.value!);
		}
		showUnmountFileSystemConfirm.value = false;
		confirmUnmount.value = false;
		forceUnmount.value = false;
		await refreshData();
		await refreshDatasetSnaps(selectedDataset.value);
		unmounting.value = false;
		operationRunning.value = false;
		lockThisFileSystem.value = false;
	}
});

//////////////// Mount File System //////////////////
/////////////////////////////////////////////////////
const showMountFileSystemConfirm = ref(false);
const forceMount = ref(true);
const mounting = ref(false);
const confirmMount = ref(false);

function mountThisFileSystem(fileSystem) {
	showMountFileSystemConfirm.value = true;
	selectedDataset.value = fileSystem;
	console.log('selected to be mounted:', selectedDataset.value);
}

const confirmThisMount : ConfirmationCallback = () => {
	confirmMount.value = true;
}

const updateShowMountFileSystem = (newVal) => {
	showMountFileSystemConfirm.value = newVal;
}

watch(confirmMount, async (newValue, oldValue) => {
	console.log('confirmMount changed:', newValue);
	
	if (confirmMount.value == true) {
		mounting.value = true;
		operationRunning.value = true;
		await mountFileSystem(selectedDataset.value!, forceMount.value);
		console.log('mounted:', selectedDataset.value!);
		showMountFileSystemConfirm.value = false;
		confirmMount.value = false;
		forceMount.value = false;
		await refreshData();
		await refreshDatasetSnaps(selectedDataset.value);
		mounting.value = false;
		operationRunning.value = false;
	}
});

//////////////// Rename File System /////////////////
/////////////////////////////////////////////////////
const showRenameModal = ref(false);
const renaming = ref(false);
const confirmRename = ref(false);

function renameThisDataset(fileSystem) {
	showRenameModal.value = true;
	selectedDataset.value = fileSystem;
	console.log('selected to be renamed:', selectedDataset.value);
}

// watch(confirmRename, async (newVal, oldVal) => {
// 	if (confirmRename.value == true) {
// 		renaming.value = true;

// 	}
// });

//////////////////// Send Dataset ///////////////////
/////////////////////////////////////////////////////
const showSendDataset = ref(false);
const sending = ref(false);
const confirmSend = ref(false);

function sendThisDataset(fileSystem) {
	showSendDataset.value = true;
	selectedDataset.value = fileSystem;
	confirmSend.value = false;
	console.log('selected to send:', selectedDataset.value);
}

watch(confirmSend, async (newVal, oldVal) => {
	if (confirmSend.value == true) {
		await refreshData();
	}
});

/////////////// Change Passphrase ///////////////////
/////////////////////////////////////////////////////
const showChangePassphrase = ref(false);
const changing = ref(false);
const confirmChange = ref(false);

function changeThisPassphrase(fileSystem) {
	showChangePassphrase.value = true;
	selectedDataset.value = fileSystem;
	console.log('selected to change passphrase:', selectedDataset.value);
}

/////////// Locking/Unlocking File System ///////////
/////////////////////////////////////////////////////
const showLockUnlockModal = ref(false);
const confirmLockOrUnlock = ref(false);
const lockingOrUnlocking = ref(false);
const modeSelected = ref('');

function handleFileSystemEncryption(fileSystem : FileSystemData, mode : 'lock' | 'unlock') {
	showLockUnlockModal.value = true;
	selectedDataset.value = fileSystem;
	modeSelected.value = mode;
	console.log(`selected to be ${mode}ed: ${selectedDataset.value.name}`);
}

// onMounted(() => {
// 	refreshData();
// });

provide('show-fs-wizard', showNewFSWizard);
provide('show-fs-config', showFSConfig);

provide('show-delete-filesystem-confirm', showDeleteFileSystemConfirm);
provide('confirm-delete-filesystem', confirmDelete);
provide('destroy-children', destroyChildren);
provide('destroy-dependents', destroyAllDependents);

provide('has-children', hasChildren);
provide('selected-dataset', selectedDataset);

provide('show-mount-filesystem-confirm', showMountFileSystemConfirm);
provide('confirm-mount-filesystem', confirmMount);
provide('mounting', mounting);
provide('force-mount', forceMount);

provide('show-unmount-filesystem-confirm', showUnmountFileSystemConfirm);
provide('confirm-unmount-filesystem', confirmUnmount);
provide('unmounting', unmounting);
provide('force-unmount', forceUnmount);

provide('show-rename-modal', showRenameModal);
provide('renaming', renaming);
provide('confirm-rename', confirmRename);

provide('create-snap-modal', showSnapshotModal);
provide('creating', creating);
provide('confirm-create', confirmCreate);

provide('show-send-dataset', showSendDataset);
provide('sending', sending);
provide('confirm-send', confirmSend);

provide('show-change-passphrase', showChangePassphrase);
provide('changing', changing);
provide('confirm-change', confirmChange);

provide('show-lock-unlock-modal', showLockUnlockModal);
provide('locking-or-unlocking', lockingOrUnlocking);
provide('confirm-lock-or-unlock', confirmLockOrUnlock);
provide('mode-selected', modeSelected);

provide('modal-confirm-running', operationRunning);
provide('modal-option-one-toggle', firstOptionToggle);
provide('modal-option-two-toggle', secondOptionToggle);
provide('modal-option-three-toggle', thirdOptionToggle);
provide('modal-option-four-toggle', fourthOptionToggle);
</script>