<template>
	<div class="inline-block min-w-full py-4 align-middle sm:px-6 lg:px-8 overflow-visible sm:rounded-lg bg-accent rounded-md border border-default">
		<!-- buttons for creating/importing pools and refreshing list -->
		<div class="flex">
			<div class="button-group-row">
				<button id="createPool" class="btn btn-primary" @click="newPoolWizardBtn">Create Storage Pool</button>
				<button id="importPool" class="btn btn-secondary" @click="importNewPoolBtn">Import Storage Pool</button>
				<button id="refreshPools" class="btn btn-secondary" @click="refreshAllData"><ArrowPathIcon class="w-5 h-5"/></button>
			</div>
			<div class="ml-6">
				<div v-if="loading" class="text-muted mt-2 animate-pulse flex flex-row w-full h-max bg-accent justify-center">
					{{ loadingMessage }}
				</div>
				<div v-else class="text-success mt-2 flex flex-row w-full h-max bg-accent justify-center">
					{{ message }}
				</div>
			</div>
		</div>
		

		<div class="mt-8 overflow-visible rounded-md">
			<div class="inline-block min-w-full min-h-full shadow align-middle rounded-md border border-default">

				<div class="overflow-visible ring-1 ring-black ring-opacity-5 rounded-md sm:rounded-lg">
					<table class="min-w-full divide-y divide-default rounded-md">
						<thead class="rounded-md">
							<tr class="bg-well rounded-t-md">
								<th class="relative px-3 py-3.5">
									<span class="sr-only"></span>
								</th>
								<th class="px-3 py-3.5 font-semibold text-default">Name</th>
								<th class="px-3 py-3.5 font-semibold text-default">Status</th>
								<th class="px-3 py-3.5 font-semibold text-default">Used (%)</th>
								<th class="px-3 py-3.5 font-semibold text-default">Used</th>
								<th class="px-3 py-3.5 font-semibold text-default">Free</th>
								<th class="px-3 py-3.5 font-semibold text-default">Total</th>
								<th class="relative px-3 py-3.5 sm:pr-6 lg:pr-8">
									<span class="sr-only"></span>
								</th>
							</tr>
						</thead>
					</table>
					
					<div v-if="poolData.length > 0 && poolsLoaded == true">
						<Accordion :isOpen="false" class="divide-y divide-default bg-default rounded-b-md border border-solid border-spacing-1 border-default" v-for="pool, poolIdx in poolData" :key="poolIdx">
							<template v-slot:title>
								<div class="grid grid-cols-7 grid-flow-cols w-full rounded-md ml-5">
									<div class="px-3 py-4">{{ poolData[poolIdx].name }}</div>
									<div class="px-3 py-4">{{ poolData[poolIdx].status }}</div>
									<div class="px-3 py-4">
										<div class="w-full bg-well rounded-full text-center">
											<div v-if="poolData[poolIdx].properties.capacity! < 1" class="w-full bg-well rounded-full h-6 mt-0.5 text-center relative flex">
												<div class="absolute inset-0 flex items-center justify-center text-s font-medium text-default p-0.5 leading-none">
													{{ poolData[poolIdx].properties.capacity }}%
												</div>
											</div>
											<div v-if="poolData[poolIdx].properties.capacity >= 1" class="w-full bg-well rounded-full relative flex h-6 mt-0.5 min-h-min max-h-max overflow-hidden">
												<div class="bg-green-600 h-6 min-h-min max-h-max" :style="{ width: `${poolData[poolIdx].properties.capacity}%` }">
													<div class="absolute inset-0 flex items-center justify-center text-s font-medium text-default text-center p-0.5 leading-none">
														{{ poolData[poolIdx].properties.capacity }}%
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="px-3 py-4">{{ poolData[poolIdx].properties.allocated }}</div>
									<div class="px-3 py-4">{{ poolData[poolIdx].properties.free }}</div>
									<div class="px-3 py-4">{{ poolData[poolIdx].properties.size }}</div>
									<div class="relative py-4 pl-3 pr-4 text-right font-medium sm:pr-6 lg:pr-8">
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
															<a href="#" @click="showPoolModal(poolData[poolIdx])!" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pool Details</a>
														</MenuItem>
														<MenuItem as="div" v-slot="{ active }">
															<a href="#" @click="clearPoolErrors(poolData[poolIdx].name)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Pool Errors</a>
														</MenuItem>
														<MenuItem as="div" v-slot="{ active }">
															<a href="#" @click="resilverThisPool(poolData[poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resilver Pool</a>
														</MenuItem>
														<MenuItem as="div" v-slot="{ active }">
															<a href="#" @click="scrubThisPool(poolData[poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Scrub Pool</a>
														</MenuItem>
														<MenuItem v-if="pool.diskType != 'HDD'" as="div" v-slot="{ active }">
															<a href="#" @click="trimThisPool(poolData[poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">TRIM Pool</a>
														</MenuItem>
														<MenuItem as="div" v-slot="{ active }">
															<a href="#" @click="showAddVDev(poolData[poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Add Virtual Device</a>
														</MenuItem>
														<MenuItem as="div" v-slot="{ active }">
															<a href="#" @click="exportThisPool(poolData[poolIdx])" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Export Pool</a>
														</MenuItem>
														<MenuItem as="div" v-slot="{ active }">
															<a href="#" @click="destroyPoolAndUpdate(poolData[poolIdx])" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy Pool</a>
														</MenuItem>
													</div>
												</MenuItems>
											</transition>
										</Menu>
									</div>
								</div>
								
							</template>
							<template v-slot:content>
								<Accordion :isOpen="false" class="btn-secondary rounded-md border border-solid border-default p-2" v-for="vDev, vDevIdx in pool.vdevs" :key="vDevIdx">
									<template v-slot:title>
										<div class="grid grid-cols-3 grid-flow-cols btn-secondary w-full rounded-md">
											<div class="col-start-2 text-center -mx-4 py-4">
												{{ vDev.name }} ({{ vDev.type }})
											</div>
											<div class="relative py-4 pl-3 pr-4 text-right font-medium sm:pr-6 lg:pr-8">
												<Menu as="div" class="relative inline-block text-right">
													<div>
														<MenuButton class="flex items-center rounded-full btn-secondary hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
															<span class="sr-only">Open options</span>
															<EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
														</MenuButton>
													</div>

													<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
														<MenuItems class="absolute right-0 z-10 mt-2 w-max origin-top-left rounded-md bg-accent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
															<div class="py-1">												
																<MenuItem as="div" v-slot="{ active }">
																	<a href="#" @click="clearVDevErrors(pool.name, vDev.name)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Virtual Device Errors</a>
																</MenuItem>
																<MenuItem v-if="vDevIdx != 0" as="div" v-slot="{ active }">
																	<a href="#" @click="removeVDev(poolData[poolIdx], poolData[poolIdx].vdevs[vDevIdx])" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Remove Virtual Device</a>
																</MenuItem>
																<MenuItem as="div" v-slot="{ active }">
																	<a href="#" @click="showAttachDisk(pool, vDev)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Attach Disk</a>
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
											<tr :key="vDevIdx" class="rounded-md">
												<td colspan="8" class="ml-7">
													<table class="table-auto min-w-full divide-y divide-default ring-1 ring-black ring-opacity-5 indent-12 bg-well rounded-md">
														<th class="px-3 py-3.5 text-left text-sm font-semibold text-default">Name</th>
														<th class="px-3 py-3.5 text-left text-sm font-semibold text-default">State</th>
														<th class="px-3 py-3.5 text-left text-sm font-semibold text-default">Reads</th>
														<th class="px-3 py-3.5 text-left text-sm font-semibold text-default">Writes</th>
														<th class="px-3 py-3.5 text-left text-sm font-semibold text-default">Checksum</th>
														<th class="px-3 py-3.5 text-left text-sm font-semibold text-default">Message</th>
														<th class="px-3 py-3.5 text-left text-sm font-semibold text-default">Capacity</th>
														<th class="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
															<span class="sr-only"></span>
														</th>
														<tr v-for="disk, diskIdx in pool.vdevs[vDevIdx].disks" :key="diskIdx" class="indent-16 bg-default rounded-md">
															<td>{{ disk.name }}</td>
															<td>{{ disk.status }}</td>
															<td>W</td>
															<td>X</td>
															<td>Y</td>
															<td>Z</td>
															<td>{{ disk.capacity }}</td>
															<td>
																<div class="relative py-4 pl-3 pr-4 text-right font-medium sm:pr-6 lg:pr-8">
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
																					<!-- <MenuItem as="div" v-slot="{ active }">
																						<a href="#" @click="showDiskModal(disk)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Disk Details</a>
																					</MenuItem> -->
																					<MenuItem as="div" v-slot="{ active }">
																						<a href="#" @click="clearDiskErrors(pool.name, disk.name)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Clear Disk Errors</a>
																					</MenuItem>
																					<MenuItem as="div" v-slot="{ active }">
																						<a v-if="diskIdx != 0" href="#" @click="detachThisDisk(pool, disk)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Detach Disk</a>
																					</MenuItem>
																					<MenuItem as="div" v-slot="{ active }">
																						<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Offline Disk</a>
																					</MenuItem>
																					<MenuItem as="div" v-slot="{ active }">
																						<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Replace Disk</a>
																					</MenuItem>
																					<MenuItem as="div" v-slot="{ active }">
																						<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">TRIM Disk</a>
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
									</template>
								</Accordion>
							</template>
						</Accordion>
					</div>
					
					<div v-if="poolsLoaded == false" class="p-2 flex justify-center bg-default rounded-md">
						<LoadingSpinner class="font-semibold text-lg my-0.5" baseColor="text-gray-200" fillColor="fill-slate-500"/>
					</div>
					<div v-if="poolData.length < 1 && poolsLoaded == true" class="p-2 flex bg-default justify-center rounded-md">
						<span class="font-semibold text-lg my-2">No Pools Found</span>
					</div>
	
				</div>
			</div>
		</div>
	</div>

	<div v-if="showWizard">
		<CreatePool @close="showWizard = false"/>
	</div>

	<div v-if="showDiskDetails">
		<DiskDetail :disk="selectedDisk!" @close="showDiskDetails = false" :isModalChild="false"/>
	</div>

	<div v-if="showPoolDetails">
		<PoolDetail :pool="selectedPool!" @close="showPoolDetails = false"/>
	</div>

	<div v-if="showDeletePoolConfirm">
		<ConfirmDeletePoolModal :poolName="selectedPool!.name" :idKey="'delete-pool'" :confirmDestroy="confirmThisDestroy" @close="showDeletePoolConfirm = false"/>
	</div>

	<div v-if="showResilverModal">
		<ConfirmResilverModal item="pool" :name="selectedPool!.name" :idKey="'resilver-pool'" :confirmResilver="confirmThisResilver" @close="showResilverModal = false"/>
	</div>

	<div v-if="showTrimModal">
		<ConfirmTrimModal item="pool" :name="selectedPool!.name" :idKey="'trim-pool'" :confirmTrim="confirmThisTrim" @close="showTrimModal = false"/>
	</div>

	<div v-if="showExportModal">
		<ConfirmExportModal item="pool" :name="selectedPool!.name" :idKey="'export-pool'" :confirmExport="confirmThisExport" @close="showExportModal = false"/>
	</div>

	<div v-if="showImportModal">
		<ImportPool :idKey="'import-pool'"/>
	</div>

	<div v-if="showAddVDevModal">
		<AddVDevModal @close="showAddVDevModal = false" :idKey="'show-vdev-modal'" :pool="selectedPool!" :marginTop="'mt-28'"/>
	</div>

	<div v-if="showRemoveVDevConfirm">
		<ConfirmRemoveVDev @close="showRemoveVDevConfirm = false" :idKey="'show-remove-modal'" :confirmRemove="confirmThisRemove" :poolName="selectedPool!.name" :vDevName="selectedVDev!.name"/>
	</div>

	<div v-if="showAttachDiskModal">
		<AttachDiskModal @close="showAttachDiskModal = false" :idKey="'show-attach-disk-modal'" :pool="selectedPool!" :vDev="selectedVDev!"/>
	</div>

	<div v-if="showDetachDiskModal">
		<ConfirmDetachDisk @close="showDetachDiskModal = false" :idKey="'show-detach-disk-modal'" :confirmDetach="confirmThisDetach" :poolName="selectedPool!.name" :diskName="selectedDisk!.name"/>
	</div>
</template>

<script setup lang="ts">
import { ref, inject, Ref, provide, watch } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import CreatePool from '../wizard-components/CreatePool.vue';
import Accordion from '../common/Accordion.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue';
import { destroyPool, trimPool, scrubPool, resilverPool, clearErrors, exportPool, removeVDevFromPool } from "../../composables/pools";
import { labelClear, detachDisk, } from "../../composables/disks";
import { loadDatasets, loadDisksThenPools } from '../../composables/loadData';
import { getTimestampString } from "../../composables/helpers";
import PoolDetail from "./PoolDetail.vue";
import DiskDetail from "./DiskDetail.vue";
import ConfirmDeletePoolModal from "../common/confirmation/ConfirmDeletePoolModal.vue";
import ConfirmResilverModal from "../common/confirmation/ConfirmResilverModal.vue";
import ConfirmTrimModal from "../common/confirmation/ConfirmTrimModal.vue";
import ConfirmExportModal from "../common/confirmation/ConfirmExportModal.vue";
import ImportPool from "./ImportPool.vue";
import AddVDevModal from "../pools/AddVDevModal.vue";
import ConfirmRemoveVDev from "../common/confirmation/ConfirmRemoveVDev.vue";
import AttachDiskModal from "./AttachDiskModal.vue";
import ConfirmDetachDisk from "../common/confirmation/ConfirmDetachDisk.vue";

const notifications = inject<Ref<any>>('notifications')!;

const selectedPool = ref<PoolData>();
const selectedDisk = ref<DiskData>();
const selectedVDev = ref<vDevData>();

const message = ref('');
const loadingMessage = ref('');
const loading = ref(false);

const clearLabels = inject<Ref<boolean>>('clear-labels')!;

////////////// Show Pool/Disk Details ///////////////
/////////////////////////////////////////////////////
const showPoolDetails = ref(false);
const showDiskDetails = ref(false);

function showPoolModal(pool) {
	selectedPool.value = pool;
	console.log(selectedPool);
	showPoolDetails.value = true;
}

// function showDiskModal(disk) {
// 	selectedDisk.value = disk;
// 	console.log(selectedDisk);
// 	showDiskDetails.value = true;
// }

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
	message.value = '';
	//notifications.value.constructNotification('Data Refreshed', "Sucessfully refreshed pool, disk and filesystem data.", 'success');
}

////////////////// Destroy Pool /////////////////////
/////////////////////////////////////////////////////
const confirmDelete = ref(false);
const showDeletePoolConfirm = ref(false);
const deleting = ref(false);
const hasChildren = ref(false);
const forceDestroy = ref(false);

async function destroyPoolAndUpdate(pool) {
	selectedPool.value = pool;
	clearLabels.value = false;
	showDeletePoolConfirm.value = true;

	console.log('preparing to delete:', selectedPool.value);
}

const confirmThisDestroy : ConfirmationCallback = () => {
	confirmDelete.value = true;
}

watch(confirmDelete, async (newValue, oldValue) => {
	if (confirmDelete.value == true) {	
		deleting.value = true;
		console.log('now deleting:', selectedPool.value);

		if (clearLabels.value == true) {
			await destroyPool(selectedPool.value!);
			selectedPool.value!.vdevs.forEach(vDev => {
				vDev.disks.forEach(async disk => {
					selectedDisk.value = disk;
					await labelClear(selectedDisk.value!);
				});
			});
		} else {
			await destroyPool(selectedPool.value!);
		}

		refreshAllData();
		confirmDelete.value = false;
		showDeletePoolConfirm.value = false;
		deleting.value = false;
		message.value = "Destroyed " + selectedPool.value!.name + " at " + getTimestampString();
		notifications.value.constructNotification('Pool Destroyed', selectedPool.value!.name + " destroyed.", 'success');
	}
});

////////////////// Resilver Pool ////////////////////
/////////////////////////////////////////////////////
const confirmResilver = ref(false);
const showResilverModal = ref(false);
const resilvered = ref(false);
const resilvering = ref(false);

async function resilverThisPool(pool) {
	// scrubbed.value = false;
	// trimmed.value = false;
	// cleared.value = false;
	selectedPool.value = pool;
	showResilverModal.value = true;

	console.log('preparing to resilver:', selectedPool.value);
}

const confirmThisResilver : ConfirmationCallback = () => {
	confirmResilver.value = true;
}

watch(confirmResilver, async (newValue, oldValue) => {

	if (confirmResilver.value == true) {
		resilvering.value = true;
		resilvered.value = false;
		console.log('now resilvering:', selectedPool.value);

		loading.value = true;
		loadingMessage.value = `Resilvering ${selectedPool.value!.name}...`;

		showResilverModal.value = false;
		await resilverPool(selectedPool.value);
		confirmResilver.value = false;
		resilvered.value = true;
		resilvering.value = false;

		loading.value = false;
		loadingMessage.value = "";
		message.value = "Resilver on " + selectedPool.value!.name + " completed at " + getTimestampString();
		notifications.value.constructNotification('Resilver Completed', 'Resilver on ' + selectedPool.value!.name + " completed.", 'success');
	}
});

//////////////////// TRIM Pool //////////////////////
/////////////////////////////////////////////////////
const showTrimModal = ref(false);
const confirmTrim = ref(false);
const secureTRIM = ref(false);
const trimmed = ref(false);
const trimming = ref(false);

async function trimThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;
	showTrimModal.value = true;

	console.log("preparing to trim:", selectedPool.value);
}

const confirmThisTrim : ConfirmationCallback = () => {
	confirmTrim.value = true;
}

watch(confirmTrim, async (newValue, oldValue) => {
	if (confirmTrim.value == true) {
		trimming.value = true;
		trimmed.value = false;
		console.log('now trimming:', selectedPool.value);

		loading.value = true;
		loadingMessage.value = `Trimming ${selectedPool.value!.name}...`;

		if (secureTRIM.value) {
			confirmTrim.value = false;	
			showTrimModal.value = false;
			await trimPool(selectedPool.value, secureTRIM.value);
		} else {
			confirmTrim.value = false;
			showTrimModal.value = false;
			await trimPool(selectedPool.value);
		}
		trimming.value = false;
		trimmed.value = true;

		loading.value = false;
		loadingMessage.value = "";
		message.value = "Trim on " + selectedPool.value!.name + " completed at " + getTimestampString();
		notifications.value.constructNotification('Trim Completed', 'Trim on ' + selectedPool.value!.name + " completed.", 'success');
	}
});

/////////////////// Scrub Pool //////////////////////
/////////////////////////////////////////////////////
const scrubbed = ref(false);
const scrubbing = ref(false);

async function scrubThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;
	console.log('preparing to scrub:', selectedPool.value);
	scrubbed.value = false;
	scrubbing.value = true;
	console.log('now scrubbing:', selectedPool.value);

	loading.value = true;
	loadingMessage.value = `Scrubbing ${selectedPool.value!.name}...`;

	await scrubPool(pool);

	scrubbing.value = false;
	scrubbed.value = true;

	loading.value = false;
	loadingMessage.value = "";
	message.value = "Scrub on " + selectedPool.value!.name + " ended at " + getTimestampString();
	notifications.value.constructNotification('Scrub Completed', 'Scrub on ' + selectedPool.value!.name + " completed.", 'success');
}

/////////////////// Export Pool /////////////////////
/////////////////////////////////////////////////////
const showExportModal = ref(false);
const confirmExport = ref(false);
const forceUnmount = ref(false);
const exporting = ref(false);

async function exportThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;
	showExportModal.value = true;

	console.log('preparing to export:', selectedPool.value);
}

const confirmThisExport : ConfirmationCallback = () => {
	confirmExport.value = true;
}

watch(confirmExport, async (newVal, oldVal) => {
	if (confirmExport.value == true) {
		exporting.value = true;
		console.log('now exporting:', selectedPool.value);
		if (forceUnmount.value) {
			exportPool(selectedPool.value!, forceUnmount.value);
		} else {
			exportPool(selectedPool.value!);
		}
		message.value = "Exported " + selectedPool.value!.name + " at " + getTimestampString();
		notifications.value.constructNotification('Export Completed', 'Export of pool ' + selectedPool.value!.name + " completed.", 'success');
		refreshAllData();
		confirmExport.value = false;
		showExportModal.value = false;
		exporting.value = false;
	}
});

/////////////// Create/Import Pool //////////////////
/////////////////////////////////////////////////////
const showWizard = ref(false);
const showImportModal = ref(false);

function newPoolWizardBtn() {
	if (!showWizard.value) {
		showWizard.value = true;	
	} else {
		showWizard.value = false;
	}
}

function importNewPoolBtn() {
	showImportModal.value = true;
}

///////////////// Add/Remove VDev ///////////////////
/////////////////////////////////////////////////////
const showAddVDevModal = ref(false);

const showRemoveVDevConfirm = ref(false);
const confirmRemove = ref(false);
const removing = ref(false);

function showAddVDev(pool) {
	selectedPool.value = pool;
	console.log(selectedPool);
	showAddVDevModal.value = true;
}

async function removeVDev(pool : PoolData, vDev : vDevData) {
	selectedPool.value = pool;
	selectedVDev.value = vDev;
	showRemoveVDevConfirm.value = true;

	console.log('premaring to remove:', selectedVDev.value, 'from pool:', selectedPool.value);
}

const confirmThisRemove : ConfirmationCallback = () => {
	confirmRemove.value = true;
}

watch(confirmRemove, async (newValue, oldValue) => {
	if (confirmRemove.value == true) {
		removing.value = true;
		console.log('now removing:', selectedVDev.value, 'from pool:', selectedPool.value);
		await removeVDevFromPool(selectedVDev.value, selectedPool.value);
		refreshAllData();
		confirmRemove.value = false;
		showRemoveVDevConfirm.value = false;
		removing.value = false;
		message.value = "Removed " + selectedVDev.value!.name + " from " + selectedVDev.value!.name + " at " + getTimestampString();
		notifications.value.constructNotification('Remove Completed', 'Removal of VDev '+ selectedVDev.value!.name + " from " + selectedVDev.value!.name + " completed.", 'success');
	}
});

/////////////// Attach/Detach Disk //////////////////
/////////////////////////////////////////////////////
const showAttachDiskModal = ref(false);
const showDetachDiskModal = ref(false);
const confirmDetach = ref(false);
const detaching = ref(false);

function showAttachDisk(pool, vdev) {
	selectedPool.value = pool;
	selectedVDev.value = vdev;
	console.log('selectedPool:', selectedPool, 'selectedVDev:', selectedVDev)
	showAttachDiskModal.value = true;
}

async function detachThisDisk(pool : PoolData, disk: DiskData) {
	selectedPool.value = pool;
	selectedDisk.value = disk;
	clearLabels.value = false;
	showDetachDiskModal.value = true;

	console.log("Preparing to detach:", selectedDisk.value!.name, "from:", selectedPool.value!.name);
}

const confirmThisDetach : ConfirmationCallback = () => {
	confirmDetach.value = true;
}

watch(confirmDetach, async (newValue, oldValue) => {
	if (confirmDetach.value == true) {
		detaching.value = true;
		console.log("now detaching:", selectedDisk.value!.name, "from:", selectedPool.value!.name);

		if (clearLabels.value == true) {
			await detachDisk(selectedPool.value!.name, selectedDisk.value!.name);
			await labelClear(selectedDisk.value!);
		} else {
			await detachDisk(selectedPool.value!.name, selectedDisk.value!.name);
		}
		refreshAllData();
		confirmDetach.value = false;
		showDetachDiskModal.value = false;
		detaching.value = false;
		message.value = "Detached disk " + selectedDisk.value!.name + " from " + selectedPool.value!.name + " at " + getTimestampString();
		notifications.value.constructNotification('Detach Completed', selectedDisk.value!.name + " was detached from " + selectedPool.value!.name + ".", 'success');
	}
});

/////////////////// Clear Errors ////////////////////
/////////////////////////////////////////////////////
const cleared = ref(false);

async function clearPoolErrors(poolName) {
	cleared.value = false;
	await clearErrors(poolName);
	cleared.value = true;
}

async function clearVDevErrors(poolName, vDevName) {
	cleared.value = false;
	await clearErrors(poolName, vDevName);
	cleared.value = true;
}

async function clearDiskErrors(poolName, diskName) {
	cleared.value = false;
	await clearErrors(poolName, diskName);
	cleared.value = true;
}

provide('show-wizard', showWizard);
provide('show-pool-deets', showPoolDetails);

provide('show-delete-pool-confirm', showDeletePoolConfirm);
provide('confirm-delete-pool', confirmDelete);
provide('deleting', deleting);
provide('has-children', hasChildren);
provide('force-destroy', forceDestroy);

provide("show-resilver-modal", showResilverModal);
provide("confirm-resilver", confirmResilver);
provide('resilvering', resilvering);

provide("show-trim-modal", showTrimModal);
provide("secure-trim", secureTRIM);
provide("confirm-trim", confirmTrim);

provide("show-export-modal", showExportModal);
provide("confirm-export", confirmExport);
provide("force-unmount", forceUnmount);
provide('exporting', exporting);

provide('show-remove-modal', showRemoveVDevConfirm);
provide('confirm-remove', confirmRemove);
provide('removing', removing);

provide("show-import-modal", showImportModal);
provide("show-vdev-modal", showAddVDevModal);
provide('show-attach-modal', showAttachDiskModal);

provide('show-detach-modal', showDetachDiskModal);
provide('confirm-detach', confirmDetach);
provide('detaching', detaching);

// provide('clear-labels', clearLabels);
</script>