<template>
	<div class="inline-block min-w-full py-4 align-middle sm:px-6 lg:px-8 overflow-visible sm:rounded-lg bg-accent rounded-md border border-default">
		<div class="button-group-row">
			<button id="createFS" class="btn btn-primary object-left justify-start" @click="showNewFSWizard = true">Create File System</button>
			<button id="refreshFS" class="btn btn-secondary object-right justify-end" @click="refreshDatasets" ><ArrowPathIcon class="w-5 h-5"/></button>
		</div>

		<div class="mt-8 overflow-visible">
			<div class="inline-block min-w-full min-h-full align-middle rounded-md border border-default">

				<div class="overflow-visible ring-1 ring-black ring-opacity-5 shadow rounded-md sm:rounded-lg">
					<table class="min-w-full divide-y divide-default">
						<thead>
							<tr class="rounded-md bg-well">
								<th class="relative px-3 py-3.5">
									<span class="sr-only"></span>
								</th>
								<th class="px-3 py-3.5 font-semibold text-default">Name</th>
								<th class="px-3 py-3.5 font-semibold text-default">Available</th>
								<th class="px-3 py-3.5 font-semibold text-default">Used</th>
								<th class="px-3 py-3.5 font-semibold text-default">Refreservation</th>
								<th class="px-3 py-3.5 font-semibold text-default">Compression</th>
								<th class="px-3 py-3.5 font-semibold text-default">Deduplication</th>
								<th class="px-3 py-3.5 font-semibold text-default">Encryption</th>
								<th class="px-3 py-3.5 font-semibold text-default">Snapshots</th>
								<th class="px-3 py-3.5 font-semibold text-default">Read Only</th>
								<th class="relative px-3 py-3.5 sm:pr-6 lg:pr-8">
									<span class="sr-only"></span>
								</th>
							</tr>
						</thead>

						<tbody class="divide-y divide-x divide-default bg-default rounded-b-md ring-1 ring-black ring-opacity-5">
							
							<!-- FILE SYSTEMS BY POOLS -->
							<tr v-for="fileSystem, fsIdx in fileSystems" :key="fsIdx">
								<td class="py-4 pl-4 pr-5 text-sm font-medium text-default"> 
									<span class="sr-only"></span>
								</td>
								<td class="py-4 pl-4 pr-3 text-sm font-medium text-default"> {{ fileSystem.name }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ convertBytesToSize(fileSystem.properties.available) }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ fileSystem.properties.usedByDataset }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ fileSystem.properties.usedbyRefreservation }}</td>
								<td v-if="fileSystem.properties.compression == 'off' || fileSystem.properties.compression == 'on'" class="px-3 py-4 text-sm text-muted">{{ upperCaseWord(fileSystem.properties.compression) }}</td>
								<td v-else class="px-3 py-4 text-sm text-muted">{{ (fileSystem.properties.compression).toUpperCase() }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ upperCaseWord(fileSystem.properties.deduplication) }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ upperCaseWord(isBoolOnOff(fileSystem.encrypted)) }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ upperCaseWord(fileSystem.properties.snapshotCount) }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ upperCaseWord(fileSystem.properties.readOnly) }}</td>
								<td class="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
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
														<a href="#" @click="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Edit Permissions</a>
													</MenuItem>
													<MenuItem as="div" v-if="!findPoolDataset(fileSystems[fsIdx])" v-slot="{ active }">
														<a href="#" @click="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Rename File System</a>
													</MenuItem>
													<MenuItem as="div" v-if="fileSystems[fsIdx].properties.mounted == 'yes'" v-slot="{ active }">
														<a href="#" @click="unmountThisFileSystem(fileSystems[fsIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Unmount File System</a>
													</MenuItem>
													<MenuItem as="div" v-if="fileSystems[fsIdx].properties.mounted == 'no'" v-slot="{ active }">
														<a href="#" @click="mountThisFileSystem(fileSystems[fsIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Mount File System</a>
													</MenuItem>
													<MenuItem as="div" v-if="!findPoolDataset(fileSystems[fsIdx])" v-slot="{ active }">
														<a href="#" @click="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Configure Replication Task</a>
													</MenuItem>
													<MenuItem as="div" v-if="fileSystems[fsIdx].encrypted" v-slot="{ active }">
														<a href="#" @click="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Change Passphrase</a>
													</MenuItem>
													<MenuItem as="div" v-slot="{ active }">
														<a href="#" @click="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Create Snapshot</a>
													</MenuItem>
													<MenuItem as="div" v-if="!findPoolDataset(fileSystems[fsIdx])" v-slot="{ active }">
														<a href="#" @click="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Send File System</a>
													</MenuItem>
													<MenuItem as="div" v-if="!findPoolDataset(fileSystems[fsIdx])" v-slot="{ active }">
														<a href="#" @click="deleteFileSystem(fileSystems[fsIdx])" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy File System</a>
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

				<div v-if="fileSystemsLoaded == false" class="p-2 flex justify-center bg-default">
					<LoadingSpinner class="font-semibold text-lg my-0.5" baseColor="text-gray-200" fillColor="fill-slate-500"/>
				</div>
				<div v-if="fileSystems.length < 1 && fileSystemsLoaded == true" class="p-2 flex bg-default justify-center">
					<span class="font-semibold text-lg my-2">No File Systems Found</span>
				</div>

			</div>
		</div>
	</div>

	<div v-if="showNewFSWizard">
		<FileSystem :isStandalone="true" idKey="fs-wizard" @close="showNewFSWizard = false"/>
	</div>

	<div v-if="showFSConfig">
		<FSConfigModal ref="fileSystemConfiguration" :filesystem="selectedDataset!" idKey="fs-config" @close="showFSConfig = false"/>
	</div>

	<div v-if="showDeleteFileSystemConfirm">
		<UniversalConfirmation @close="showModalFlag = false" :idKey="'confirm-destroy-filesystem'" :item="'filesystem'" :operation="'destroy'" :filesystem="selectedDataset!" :confirmOperation="confirmThisDestroy" :firstOption="'force unmount'" :hasChildren="hasChildren"/>
	</div>

	<div v-if="showUnmountFileSystemConfirm">
		<ConfirmUnmountFileSystem :fileSystemName="selectedDataset!.name" :idKey="'unmount-filesystem'" @close="showUnmountFileSystemConfirm = false"/>
	</div>

	<div v-if="showMountFileSystemConfirm">
		<ConfirmMountFileSystem :fileSystemName="selectedDataset!.name" :idKey="'mount-filesystem'" @close="showMountFileSystemConfirm = false"/>
	</div>

</template>

<script setup lang="ts">
import { ref, inject, Ref, provide, watch, computed } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { loadDatasets } from "../../composables/loadData";
import { isBoolOnOff, convertBytesToSize, upperCaseWord } from '../../composables/helpers';
import { destroyDataset, unmountFileSystem, mountFileSystem } from "../../composables/datasets";
import LoadingSpinner from "../common/LoadingSpinner.vue";
import FileSystem from "../wizard-components/FileSystem.vue";
import FSConfigModal from "./FSConfigModal.vue";
import UniversalConfirmation from "../common/UniversalConfirmation.vue";
import ConfirmUnmountFileSystem from "../common/confirmation/ConfirmUnmountFileSystem.vue";
import ConfirmMountFileSystem from '../common/confirmation/ConfirmMountFileSystem.vue';

const notifications = inject<Ref<any>>('notifications')!;

const pools = inject<Ref<PoolData[]>>('pools')!;
const fileSystems = inject<Ref<FileSystemData[]>>('datasets')!;
const selectedDataset = ref<FileSystemData>();

///////// Values for Confirmation Modals ////////////
/////////////////////////////////////////////////////
const showModalFlag = ref(false);
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

async function refreshDatasets() {
	fileSystemsLoaded.value = false;
	fileSystems.value = [];
	await loadDatasets(fileSystems);
	fileSystemsLoaded.value = true;
}

function loadFileSystemConfig(fileSystem) {
	selectedDataset.value = fileSystem;
	console.log('loading:', selectedDataset);
	showFSConfig.value = true
}

function findPoolDataset(fileSystem) {
	try {
		return pools.value.find(pool => pool.name == fileSystem.name);
	} catch {
		console.log('error finding pool');
	}
}

////////////// Destroy File System //////////////////
/////////////////////////////////////////////////////
const hasChildren = ref(false);
const forceDestroy = ref(false);
const destroyChildren = ref(false);
const destroyAllDependents = ref(false);
const showDeleteFileSystemConfirm = ref(false);
const confirmDelete = ref(false);
const isDeleting = ref(false);

async function deleteFileSystem(fileSystem) {
	operationRunning.value = false;
	selectedDataset.value = fileSystem;
	if (!findPoolDataset(selectedDataset.value) && selectedDataset.value!.children!.length > 0) {
		hasChildren.value = true;
	} else { 
		hasChildren.value = false;
	}

	showDeleteFileSystemConfirm.value = true;
	showModalFlag.value = showDeleteFileSystemConfirm.value;
	console.log('selected for deletion:', selectedDataset.value);
}

const confirmThisDestroy : ConfirmationCallback = () => {
	confirmDelete.value = true;
}

watch(confirmDelete, async (newValue, oldValue) => {
	if (confirmDelete.value == true) {
		//isDeleting.value = true;
		
		console.log('now deleting:', newValue);
		operationRunning.value = true;
		await destroyDataset(selectedDataset.value!, firstOptionToggle.value, thirdOptionToggle.value, fourthOptionToggle.value);
		operationRunning.value = false;
		refreshDatasets();
		showDeleteFileSystemConfirm.value = false;
		showModalFlag.value = showDeleteFileSystemConfirm.value;

		confirmDelete.value = false;
		hasChildren.value = false;
		forceDestroy.value = false;
		console.log('deleted:', selectedDataset.value!);
		//isDeleting.value = false;
		notifications.value.constructNotification('File System Destroyed', selectedDataset.value!.name + " destroyed.", 'success');
	}
});

//////////// Unmount/Mount File System //////////////
/////////////////////////////////////////////////////
const showUnmountFileSystemConfirm = ref(false);
const forceUnmount = ref(false);
const unmounting = ref(false);
const confirmUnmount = ref(false);

const showMountFileSystemConfirm = ref(false);
const forceMount = ref(true);
const mounting = ref(false);
const confirmMount = ref(false);

function unmountThisFileSystem(fileSystem) {
	showUnmountFileSystemConfirm.value = true;
	selectedDataset.value = fileSystem;
	console.log('selected to be unmounted:', selectedDataset.value);

	watch(confirmUnmount, async (newValue, oldValue) => {
		console.log('confirmUnmount changed:', newValue);
		
		if (confirmUnmount.value == true) {
			unmounting.value = true;
			await unmountFileSystem(fileSystem, forceUnmount.value);
			console.log('unmounted:', fileSystem);
			showUnmountFileSystemConfirm.value = false;
			
			confirmUnmount.value = false;
			forceUnmount.value = false;
			await refreshDatasets();
			unmounting.value = false;
		}
	});
}

function mountThisFileSystem(fileSystem) {
	showMountFileSystemConfirm.value = true;
	selectedDataset.value = fileSystem;
	console.log('selected to be mounted:', selectedDataset.value);

	watch(confirmMount, async (newValue, oldValue) => {
		console.log('confirmMount changed:', newValue);
		
		if (confirmMount.value == true) {
			mounting.value = true;
			await mountFileSystem(fileSystem, forceMount.value);
			console.log('mounted:', fileSystem);
			showMountFileSystemConfirm.value = false;
			
			confirmMount.value = false;
			forceMount.value = false;
			await refreshDatasets();
			mounting.value = false;
		}
	});
}

provide('show-fs-wizard', showNewFSWizard);
provide('show-fs-config', showFSConfig);

provide('show-delete-filesystem-confirm', showDeleteFileSystemConfirm);
provide('confirm-delete-filesystem', confirmDelete);
provide('destroy-children', destroyChildren);
provide('destroy-dependents', destroyAllDependents);
provide('force-destroy', forceDestroy);
provide('has-children', hasChildren);

provide('show-mount-filesystem-confirm', showMountFileSystemConfirm);
provide('confirm-mount-filesystem', confirmMount);
provide('mounting', mounting);
provide('force-mount', forceMount);

provide('show-unmount-filesystem-confirm', showUnmountFileSystemConfirm);
provide('confirm-unmount-filesystem', confirmUnmount);
provide('unmounting', unmounting);
provide('force-unmount', forceUnmount);

provide('modal-confirm-show', showModalFlag);
provide('modal-confirm-running', operationRunning);
provide('modal-option-one-toggle', firstOptionToggle);
provide('modal-option-two-toggle', secondOptionToggle);
provide('modal-option-three-toggle', thirdOptionToggle);
provide('modal-option-four-toggle', fourthOptionToggle);
</script>