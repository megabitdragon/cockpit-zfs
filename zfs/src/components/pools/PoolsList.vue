<template>
	<div class="inline-block min-w-full py-4 align-middle sm:px-6 lg:px-8 overflow-visible sm:rounded-lg bg-accent rounded-md border border-default">
		<!-- buttons for creating/importing pools and refreshing list -->
		<div class="flex">
			<div class="button-group-row">
				<button id="createPool" class="btn btn-primary" @click="newPoolWizardBtn">Create Storage Pool</button>
				<button id="importPool" class="btn btn-secondary" @click="importNewPoolBtn">Import Storage Pool</button>
				<button id="refreshPools" class="btn btn-secondary" @click="refreshAllData"><ArrowPathIcon class="w-5 h-5"/></button>
			</div>
			<!-- <div class="ml-6">
				<div v-if="loading" class="text-muted mt-2 animate-pulse flex flex-row w-full h-max bg-accent justify-center">
					{{ loadingMessage }}
				</div>
				<div v-else class="text-success mt-2 flex flex-row w-full h-max bg-accent justify-center">
					{{ message }}
				</div>
			</div> -->
		</div>

		<div class="mt-8 overflow-visible rounded-md">
			<div class="inline-block min-w-full min-h-full shadow align-middle rounded-md border border-default">

				<div class="overflow-visible ring-1 ring-black ring-opacity-5 sm:rounded-lg">

					<table class="min-w-full divide-y divide-default rounded-md">
						<thead class="rounded-md">
							<tr class="bg-well rounded-t-md grid grid-cols-8">

								<th class="relative py-3.5 rounded-tl-md col-span-1">
									<span class="sr-only"></span>
								</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Name</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Status</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Used (%)</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Used</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Free</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Total</th>
								<th class="relative py-3.5 sm:pr-6 lg:pr-8 rounded-tr-md col-span-1">
									<span class="sr-only"></span>
								</th>
								
							</tr>
						</thead>
					</table>
					
					<div v-if="poolData.length > 0 && poolsLoaded == true">
						<Accordion :btnColor="'btn-primary'" :gridSize="'grid-cols-8'" :btnColSpan="'col-span-1'" :titleColSpan="'col-span-7'" :contentColSpan="'col-span-8'" :isOpen="false" class="bg-default rounded-b-md border border-solid border-default" v-for="pool, poolIdx in poolData" :key="poolIdx">
							<template v-slot:title>
								<!-- <button v-on:dblclick="showPoolModal(poolData[poolIdx])!" class="grid grid-cols-7 grid-flow-cols w-full justify-center text-center pt-1"> -->
								<div class="grid grid-cols-7 grid-flow-cols w-full justify-center text-center">
									<button @click="showPoolModal(poolData[poolIdx])!" class="grid grid-cols-6 col-span-6 hover:bg-accent pt-1 rounded-r-md">
										<div class="py-4">{{ poolData[poolIdx].name }}</div>
										<div class="py-4">{{ poolData[poolIdx].status }}</div>
										<div class="py-4">
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
										<div class="py-4">{{ poolData[poolIdx].properties.allocated }}</div>
										<div class="py-4">{{ poolData[poolIdx].properties.free }}</div>
										<div class="py-4">{{ poolData[poolIdx].properties.size }}</div>
									</button>
									<div class="relative py-4 pl-3 pr-4 text-right font-medium sm:pr-6 lg:pr-8">
										<Menu as="div" class="relative inline-block text-right -mt-1">
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
								<Accordion :btnColor="'btn-secondary'" :gridSize="'grid-cols-8'" :btnColSpan="'col-span-1'" :titleColSpan="'col-span-7'" :contentColSpan="'col-span-8'" :isOpen="false" class="btn-secondary rounded-md border border-solid border-default" v-for="vDev, vDevIdx in pool.vdevs" :key="vDevIdx">
									<template v-slot:title>
										<div class="grid grid-cols-7 grid-flow-cols justify-center text-center btn-secondary w-full rounded-md mt-1">
											<div class="col-span-6 text-center py-4 mt-1">
												{{ vDev.name }} ({{ vDev.type }})
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
															<td>{{ disk.health }}</td>
															<td>W</td>
															<td>X</td>
															<td>Y</td>
															<td>Z</td>
															<td>{{ disk.capacity }}</td>
															<td>
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
																						<a href="#" @click="clearDiskErrors(pool.name, disk.name)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Clear Disk Errors</a>
																					</MenuItem>
																					<MenuItem as="div" v-slot="{ active }">
																						<a v-if="pool.vdevs[vDevIdx].disks.length > 1" href="#" @click="detachThisDisk(pool, disk)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Detach Disk</a>
																					</MenuItem>
																					<MenuItem as="div" v-slot="{ active }">
																						<a href="#" @click="offlineThisDisk(pool, disk)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Offline Disk</a>
																					</MenuItem>
																					<MenuItem as="div" v-slot="{ active }">
																						<a href="#" @click="onlineThisDisk(pool, disk)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Online Disk</a>
																					</MenuItem>
																					<MenuItem as="div" v-slot="{ active }">
																						<a href="#" @click="replaceThisDisk(pool, vDev, disk)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Replace Disk</a>
																					</MenuItem>
																					<MenuItem as="div" v-slot="{ active }">
																						<a href="#" @click="trimThisDisk(pool, disk)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">TRIM Disk</a>
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

	<div v-if="showPoolDetails">
		<PoolDetail :pool="selectedPool!" @close="showPoolDetails = false"/>
	</div>

	<div v-if="showDeletePoolConfirm">
		<UniversalConfirmation :showFlag="showDeletePoolConfirm" @close="updateShowDestroyPool" :idKey="'confirm-destroy-pool'" :item="'pool'" :operation="'destroy'" :pool="selectedPool!" :confirmOperation="confirmThisDestroy" :firstOption="'force unmount'" :secondOption="'clear disk labels'" :hasChildren="false"/>
	</div>

	<div v-if="showResilverModal">
		<UniversalConfirmation :showFlag="showResilverModal" @close="updateShowResilverPool" :idKey="'confirm-resilver-pool'" :item="'pool'" :operation="'resilver'" :pool="selectedPool!" :confirmOperation="confirmThisResilver" :hasChildren="false"/>
	</div>

	<div v-if="showTrimModal">
		<UniversalConfirmation :showFlag="showTrimModal" @close="updateShowTrimPool" :idKey="'confirm-trim-pool'" :item="'pool'" :operation="'trim'" :pool="selectedPool!" :confirmOperation="confirmThisTrim" :firstOption="'secure TRIM'" :hasChildren="false"/>
	</div>

	<div v-if="showScrubModal">
		<UniversalConfirmation :showFlag="showScrubModal" @close="updateShowScrubPool" :idKey="'confirm-scrub-pool'" :item="'pool'" :operation="'scrub'" :pool="selectedPool!" :confirmOperation="confirmThisScrub" :hasChildren="false"/>
	</div>

	<div v-if="showExportModal">
		<UniversalConfirmation :showFlag="showExportModal" @close="updateShowExportPool" :idKey="'confirm-export-pool'" :item="'pool'" :operation="'export'" :pool="selectedPool!" :confirmOperation="confirmThisExport" :firstOption="'force unmount'" :hasChildren="false"/>
	</div>

	<div v-if="showImportModal">
		<ImportPool :idKey="'import-pool'"/>
	</div>

	<div v-if="showAddVDevModal">
		<AddVDevModal @close="showAddVDevModal = false" :idKey="'show-vdev-modal'" :pool="selectedPool!" :marginTop="'mt-28'"/>
	</div>

	<div v-if="showRemoveVDevConfirm">
		<UniversalConfirmation :showFlag="showRemoveVDevConfirm" @close="updateShowRemoveVDev" :idKey="'confirm-remove-vdev'" :item="'vdev'" :operation="'remove'" :pool="selectedPool!" :vdev="selectedVDev!" :confirmOperation="confirmThisRemove" :hasChildren="false"/>
	</div>

	<div v-if="showAttachDiskModal">
		<AttachDiskModal @close="showAttachDiskModal = false" :idKey="'show-attach-disk-modal'" :pool="selectedPool!" :vDev="selectedVDev!"/>
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
import { ref, inject, Ref, provide, watch } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { destroyPool, trimPool, scrubPool, resilverPool, clearErrors, exportPool, removeVDevFromPool } from "../../composables/pools";
import { labelClear, detachDisk, offlineDisk, onlineDisk, replaceDisk, trimDisk } from "../../composables/disks";
import { loadDatasets, loadDisksThenPools } from '../../composables/loadData';
import { getTimestampString } from "../../composables/helpers";
import CreatePool from '../wizard-components/CreatePool.vue';
import PoolDetail from "./PoolDetail.vue";
import ImportPool from "./ImportPool.vue";
import AddVDevModal from "../pools/AddVDevModal.vue";
import AttachDiskModal from "../disks/AttachDiskModal.vue";
import Accordion from '../common/Accordion.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue';
import UniversalConfirmation from "../common/UniversalConfirmation.vue";
import ReplaceDiskModal from "../disks/ReplaceDiskModal.vue";

const notifications = inject<Ref<any>>('notifications')!;

const selectedPool = ref<PoolData>();
const selectedDisk = ref<DiskData>();
const selectedVDev = ref<vDevData>();

const message = ref('');
const loadingMessage = ref('');
const loading = ref(false);

const clearLabels = inject<Ref<boolean>>('clear-labels')!;

///////// Values for Confirmation Modals ////////////
/////////////////////////////////////////////////////
const operationRunning = ref(false);
const firstOptionToggle = ref(false);
const secondOptionToggle = ref(false);
const thirdOptionToggle = ref(false);
const fourthOptionToggle = ref(false);

////////////// Show Pool/Disk Details ///////////////
/////////////////////////////////////////////////////
const showPoolDetails = ref(false);
//const showDiskDetails = ref(false);

function showPoolModal(pool) {
	selectedPool.value = pool;
	console.log(selectedPool);
	showPoolDetails.value = true;
}

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
const hasChildren = ref(false);
const forceDestroy = ref(false);

async function destroyPoolAndUpdate(pool) {
	operationRunning.value = false;
	selectedPool.value = pool;
	clearLabels.value = false;
	showDeletePoolConfirm.value = true;
	
	console.log('preparing to delete:', selectedPool.value);
}

const confirmThisDestroy : ConfirmationCallback = () => {
	confirmDelete.value = true;
}

const updateShowDestroyPool = (newVal) => {
	showDeletePoolConfirm.value = newVal;
}

watch(confirmDelete, async (newValue, oldValue) => {
	if (confirmDelete.value == true) {	
		operationRunning.value = true;
		console.log('now deleting:', selectedPool.value);

		if (secondOptionToggle.value == true) {
			await destroyPool(selectedPool.value!, firstOptionToggle.value);
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
		operationRunning.value = false;
		message.value = "Destroyed " + selectedPool.value!.name + " at " + getTimestampString();
		notifications.value.constructNotification('Pool Destroyed', selectedPool.value!.name + " destroyed.", 'success');
	}
});

////////////////// Resilver Pool ////////////////////
/////////////////////////////////////////////////////
const confirmResilver = ref(false);
const showResilverModal = ref(false);
const resilvered = ref(false);

async function resilverThisPool(pool) {
	selectedPool.value = pool;
	showResilverModal.value = true;

	console.log('preparing to resilver:', selectedPool.value);
}

const confirmThisResilver : ConfirmationCallback = () => {
	confirmResilver.value = true;
}

const updateShowResilverPool = (newVal) => {
	showResilverModal.value = newVal;
}

watch(confirmResilver, async (newValue, oldValue) => {
	if (confirmResilver.value == true) {
		operationRunning.value = true;
		resilvered.value = false;
		console.log('now resilvering:', selectedPool.value);

		loading.value = true;
		loadingMessage.value = `Resilvering ${selectedPool.value!.name}...`;

		showResilverModal.value = false;
		await resilverPool(selectedPool.value);

		confirmResilver.value = false;
		resilvered.value = true;
		operationRunning.value = false;
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

async function trimThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;
	showTrimModal.value = true;

	console.log("preparing to trim:", selectedPool.value);
}

const confirmThisTrim : ConfirmationCallback = () => {
	confirmTrim.value = true;
}

const updateShowTrimPool = (newVal) => {
	showTrimModal.value = newVal;
}

watch(confirmTrim, async (newValue, oldValue) => {
	if (confirmTrim.value == true) {
		operationRunning.value = true;
		trimmed.value = false;
		console.log('now trimming:', selectedPool.value);

		loading.value = true;
		loadingMessage.value = `Trimming ${selectedPool.value!.name}...`;

		if (firstOptionToggle.value) {
			confirmTrim.value = false;	
			showTrimModal.value = false;
			await trimPool(selectedPool.value, firstOptionToggle.value);
		} else {
			confirmTrim.value = false;
			showTrimModal.value = false;
			await trimPool(selectedPool.value);
		}
		operationRunning.value = false;
		trimmed.value = true;

		loading.value = false;
		loadingMessage.value = "";
		message.value = "Trim on " + selectedPool.value!.name + " completed at " + getTimestampString();
		notifications.value.constructNotification('Trim Completed', 'Trim on ' + selectedPool.value!.name + " completed.", 'success');
	}
});

/////////////////// Scrub Pool //////////////////////
/////////////////////////////////////////////////////
const showScrubModal = ref(false);
const confirmScrub = ref(false);
const scrubbed = ref(false);

async function scrubThisPool(pool) {
	cleared.value = false;
	selectedPool.value = pool;
	showScrubModal.value = true;

	console.log('preparing to scrub:', selectedPool.value);
}

const confirmThisScrub : ConfirmationCallback = () => {
	confirmScrub.value = true;
}

const updateShowScrubPool = (newVal) => {
	showScrubModal.value = newVal;
}

watch(confirmScrub, async (newVal, oldVal) => {
	if (confirmScrub.value == true) {
		scrubbed.value = false;
		operationRunning.value = true;
		console.log('now scrubbing:', selectedPool.value);

		loading.value = true;
		loadingMessage.value = `Scrubbing ${selectedPool.value!.name}...`;

		await scrubPool(selectedPool.value!);

		operationRunning.value = false;
		scrubbed.value = true;
		showScrubModal.value = false;
		loading.value = false;
		loadingMessage.value = "";
		message.value = "Scrub on " + selectedPool.value!.name + " ended at " + getTimestampString();
		notifications.value.constructNotification('Scrub Completed', 'Scrub on ' + selectedPool.value!.name + " completed.", 'success');
	}
});

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

const updateShowExportPool = (newVal) => {
	showExportModal.value = newVal;
}

watch(confirmExport, async (newVal, oldVal) => {
	if (confirmExport.value == true) {
		exporting.value = true;
		operationRunning.value = true;
		console.log('now exporting:', selectedPool.value);
		if (firstOptionToggle.value) {
			exportPool(selectedPool.value!, firstOptionToggle.value);
		} else {
			exportPool(selectedPool.value!);
		}
		message.value = "Exported " + selectedPool.value!.name + " at " + getTimestampString();
		notifications.value.constructNotification('Export Completed', 'Export of pool ' + selectedPool.value!.name + " completed.", 'success');
		refreshAllData();
		confirmExport.value = false;
		showExportModal.value = false;
		exporting.value = false;
		operationRunning.value = false;
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

function showAttachDisk(pool: PoolData, vdev: vDevData) {
	selectedPool.value = pool;
	selectedVDev.value = vdev;
	console.log('selectedPool:', selectedPool, 'selectedVDev:', selectedVDev)
	showAttachDiskModal.value = true;
}

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
		message.value = "Detached disk " + selectedDisk.value!.name + " from " + selectedPool.value!.name + " at " + getTimestampString();
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
		message.value = "Offlined " + selectedDisk.value!.name + " at " + getTimestampString();
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
			await scrubPool(selectedPool.value);
			notifications.value.constructNotification('Scrub Completed', 'Scrub on ' + selectedPool.value!.name + " completed.", 'success');
		} else {
			await onlineDisk(selectedPool.value!.name, selectedDisk.value!.name, firstOptionToggle.value);
		}
		refreshAllData();

		confirmOnline.value = false;
		showOnlineDiskModal.value = false;
		onlining.value = false;
		operationRunning.value = false;
		message.value = "Offlined " + selectedDisk.value!.name + " at " + getTimestampString();
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
		
		message.value = "Trimmed " + selectedDisk.value!.name + " at " + getTimestampString();
		notifications.value.constructNotification('Online Completed', 'Trimming of disk ' + selectedDisk.value!.name + " completed.", 'success');
		refreshAllData();
		confirmTrimDisk.value = false;
		showTrimDiskModal.value = false;
		trimmingDisk.value = false;
		operationRunning.value = false;
	}
});

/////////////////// Replace Disk ////////////////////
/////////////////////////////////////////////////////
const showReplaceDiskModal = ref(false);
const confirmReplace = ref(false);
const replacing = ref(false);

function replaceThisDisk(pool: PoolData,  vdev: vDevData, disk: DiskData) {
	selectedPool.value = pool;
	selectedDisk.value = disk;
	selectedVDev.value = vdev;
	console.log('selected pool:', selectedPool.value, 'selectedVDev:', selectedVDev, 'selected disk:', selectedDisk.value);
	showReplaceDiskModal.value = true;
}

provide('show-wizard', showWizard);
provide('show-pool-deets', showPoolDetails);

provide('show-delete-pool-confirm', showDeletePoolConfirm);
provide('confirm-delete-pool', confirmDelete);
provide('has-children', hasChildren);
provide('force-destroy', forceDestroy);

provide("show-resilver-modal", showResilverModal);
provide("confirm-resilver", confirmResilver);

provide("show-trim-modal", showTrimModal);
provide("secure-trim", secureTRIM);
provide("confirm-trim", confirmTrim);

provide("show-export-modal", showExportModal);
provide("confirm-export", confirmExport);
provide("force-unmount", forceUnmount);

provide('show-remove-modal', showRemoveVDevConfirm);
provide('confirm-remove', confirmRemove);

provide("show-import-modal", showImportModal);
provide("show-vdev-modal", showAddVDevModal);
provide('show-attach-modal', showAttachDiskModal);
provide('show-detach-modal', showDetachDiskModal);
provide('confirm-detach', confirmDetach);
provide('show-replace-modal', showReplaceDiskModal);
provide('modal-confirm-running', operationRunning);
provide('modal-option-one-toggle', firstOptionToggle);
provide('modal-option-two-toggle', secondOptionToggle);
provide('modal-option-three-toggle', thirdOptionToggle);
provide('modal-option-four-toggle', fourthOptionToggle);
</script>