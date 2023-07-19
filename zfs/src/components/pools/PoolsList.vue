<template>
	<div class="px-4 sm:px-6 lg:px-8">
		<!-- buttons for creating/importing pools and refreshing list -->
		<div class="button-group-row">
				<button id="createPool" class="btn btn-primary object-left justify-start" @click="showConfig = true">Create Storage Pool</button>
				<button id="importPool" class="btn btn-secondary object-left justify-start" @click="" disabled>Import Storage Pool</button>
				<button id="refreshPools" class="btn btn-secondary object-right justify-end" @click="" disabled><ArrowPathIcon class="w-5 h-5"/></button>
		</div>

		<div class="mt-8 overflow-visible">
			<div class="inline-block min-w-full min-h-full align-middle rounded-md border border-default">
				<div class="overflow-y-visible ring-1 ring-black ring-opacity-5 sm:rounded-lg">
					<table class="min-w-full divide-y divide-default bg-accent">
						<thead>
							<tr class="rounded-md">
								<th class="px-6 py-3.5 font-semibold text-default">Name</th>
								<th class="px-6 py-3.5 font-semibold text-default">Status</th>
								<th class="px-6 py-3.5 font-semibold text-default">Used (%)</th>
								<th class="px-6 py-3.5 font-semibold text-default">Used</th>
								<th class="px-6 py-3.5 font-semibold text-default">Free</th>
								<th class="px-6 py-3.5 font-semibold text-default">Total</th>
								<th class="relative px-3 py-3.5 sm:pr-6 lg:pr-8">
									<span class="sr-only"></span>
								</th>
							</tr>
						</thead>
					</table>
					<Accordion :isOpen="false" class="divide-y divide-default bg-default ring-1 ring-black ring-opacity-5" v-for="pool, poolIdx in poolData" key="poolIdx">
						<template v-slot:title>
							<div class="grid grid-cols-7 grid-flow-cols w-full">
								<div class="px-3 py-4">{{  poolData[poolIdx].name }}</div>
								<div class="px-3 py-4">{{  poolData[poolIdx].status }}</div>
								<div class="px-3 py-4">
									<div class="w-full bg-well rounded-full text-center">
										<div v-if="poolData[poolIdx].properties.capacity! < 1" class="text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div>
										<div v-if="poolData[poolIdx].properties.capacity! >=1 && poolData[poolIdx].properties.capacity! <= 85" class="bg-green-600 text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div>
										<div v-if="poolData[poolIdx].properties.capacity! > 85" class="bg-danger text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div>
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
													<MenuItem v-slot="{ active }">
														<a href="#" @click="showPoolModal(poolData[poolIdx])!" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pool Details</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Pool Errors</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resilver Pool</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Scrub Pool</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">TRIM Pool</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Add Virtual Device</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Export Pool</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" @click="destroyPool(poolData[poolIdx])!" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy Pool</a>
													</MenuItem>
												</div>
											</MenuItems>
										</transition>
									</Menu>
								</div>
							</div>
							
						</template>
						<template v-slot:content>
							<table class="table-auto min-w-full divide-y divide-default">
								<tr v-for="vDev, vDevIdx in pool.vdevs" :key="vDevIdx" class="indent-14 bg-well">
									<td colspan="7" class="ml-4">{{ vDev.name }}</td>
								</tr>
								<tr v-for="vDev, vDevIdx in pool.vdevs" :key="vDevIdx" >
									<td colspan="7" class="ml-7">
										<table class="table-auto min-w-full divide-y divide-default ring-1 ring-black ring-opacity-5 indent-12 bg-accent">
											<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-default">Name</th>
											<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Status</th>
											<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Used (%)</th>
											<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Used</th>
											<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Free</th>
											<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Total</th>
											<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
												<span class="sr-only"></span>
											</th>
											<tr v-for="disk, diskIdx in vDev.disks" :key="diskIdx" class="indent-16 bg-default">
												<td>{{ disk.name }}</td>
												<td>{{ disk.status }}</td>
												<td>
													0%
													<div class="px-3 py-4">
														<div class="w-full bg-well rounded-full text-center">
															<!-- <div v-if="poolData[poolIdx].properties.capacity! < 1" class="text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div>
															<div v-if="poolData[poolIdx].properties.capacity! >=1 && poolData[poolIdx].properties.capacity! <= 85" class="bg-green-600 text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div>
															<div v-if="poolData[poolIdx].properties.capacity! > 85" class="bg-danger text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div> -->
														</div>	
													</div>
												</td>
												<td>X TB</td>
												<td>Y TB</td>
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
																		<MenuItem v-slot="{ active }">
																			<a href="#" @click="showDiskModal(disk)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Disk Details</a>
																		</MenuItem>
																		<MenuItem v-slot="{ active }">
																			<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Clear Disk Errors</a>
																		</MenuItem>
																		<MenuItem v-slot="{ active }">
																			<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Detach Disk</a>
																		</MenuItem>
																		<MenuItem v-slot="{ active }">
																			<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Offline Disk</a>
																		</MenuItem>
																		<MenuItem v-slot="{ active }">
																			<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Replace Disk</a>
																		</MenuItem>
																		<MenuItem v-slot="{ active }">
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

				</div>
			</div>
		</div>
	</div>


	<div v-if="showConfig">
		<CreatePool @close="showConfig = false"/>
	</div>

	<div v-if="showDiskDetails">
		<DiskDetail :disk="selectedDisk!" @close="showDiskDetails = false"/>
	</div>

	<div v-if="showPoolDetails">
		<PoolDetail :pool="selectedPool!" @close="showPoolDetails = false"/>
	</div>
</template>

<script setup lang="ts">
import { ref, inject, Ref } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import CreatePool from '../wizard-components/CreatePool.vue';
import Accordion from '../common/Accordion.vue';
import { destroyPool } from "../../scripts/pools";
import PoolDetail from "./PoolDetail.vue";
import DiskDetail from "./DiskDetail.vue";

const poolData = inject<Ref<PoolData[]>>("pools")!;

const showConfig = ref(false);

const showPoolDetails = ref(false);
const showDiskDetails = ref(false);

const selectedPool = ref<PoolData>();
const selectedDisk = ref<DiskData>();

// // Reactive variable to force component re-render
// const updateTrigger = ref(0);

// // Method to re-render the component
// function forceUpdate() {
//   	updateTrigger.value += 1;
// }

// function destroyPoolAndUpdate(pool) {
// 	destroyPool(pool);
// 	forceUpdate();
// }

//method to show pool details when button is clicked
function showPoolModal(pool) {
	selectedPool.value = pool;
	console.log(selectedPool);
	showPoolDetails.value = true;
}

function showDiskModal(disk) {
	selectedDisk.value = disk;
	console.log(selectedDisk);
	showDiskDetails.value = true;
}

</script>