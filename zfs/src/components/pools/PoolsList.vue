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

					<div class="">
						<div v-for="pool, poolIdx in poolData" :key="poolIdx" class="flex flex-col">
							<div>{{ pool.name }}</div>
							<table class="table-auto min-w-full divide-y divide-default">
								<tr v-for="vDev, vDevIdx in pool.vdevs" :key="vDevIdx" >
									<td colspan="7" class="ml-4">{{ vDev.name }}</td>
								</tr>
								<tr v-for="vDev, vDevIdx in pool.vdevs" :key="vDevIdx" >
									<td colspan="7" class="ml-8">
										<table class="table-auto min-w-full divide-y divide-default">
											<tr v-for="disk, diskIdx in vDev.disks" :key="diskIdx">
												<td>{{ disk.name }}</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</div>
					</div>

					<!--  Basic Table Row (No children) -->

					<!-- <table class="min-w-full divide-y divide-default">
						<thead>
							<tr class="rounded-md">
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default sm:pl-6 lg:pl-8">Name</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Status</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Used (%)</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Used</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Free</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Total</th>
								<th scope="col" class="relative px-3 py-3.5 sm:pr-6 lg:pr-8">
									<span class="sr-only"></span>
								</th>
							</tr>
						</thead>
					<tbody>
						<tr v-for="pool, poolIdx in poolData" :key="poolIdx">
							<td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-default sm:pl-6 lg:pl-8">{{ poolData[poolIdx].name }}</td>
							<td class="whitespace-nowrap px-3 py-4 text-sm text-success">{{ poolData[poolIdx].status }}</td>
							<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">
								<div class="w-full bg-well rounded-full text-center">
									<div v-if="poolData[poolIdx].properties.capacity! < 1" class="text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div>
									<div v-if="poolData[poolIdx].properties.capacity! >=1 && poolData[poolIdx].properties.capacity! <= 85" class="bg-green-600 text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div>
									<div v-if="poolData[poolIdx].properties.capacity! > 85" class="bg-danger text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div>
								</div>
							</td>
							<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">{{ poolData[poolIdx].properties.allocated }}</td>
							<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">{{ poolData[poolIdx].properties.free }}</td>
							<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">{{ poolData[poolIdx].properties.size }}</td>
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
												<MenuItem v-slot="{ active }">
													<a href="#" @click="showDetails(poolData[poolIdx])!" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pool Details</a>
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
													<a href="#" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy Pool</a>
												</MenuItem>
											</div>
										</MenuItems>
									</transition>
								</Menu>
							</td>
						</tr>
					</tbody>-->

					<!-- OLD BROKEN TABLE WITH ACCORDIONS -->

					<!-- <table class="table-auto min-w-full divide-y divide-default">
						<thead>
							<tr>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default sm:pl-6 lg:pl-8">Name</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Status</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Used (%)</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Used</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Free</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Total</th>
								<th scope="col" class="relative px-3 py-3.5 sm:pr-6 lg:pr-8">
									<span class="sr-only"></span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-x divide-default bg-default">
							<tr v-for="pool, poolIdx in poolData" :key="poolIdx">
								<td colspan="7">
									<Accordion :isOpen="false" class="ml-4">
										<template v-slot:title>
											<table class="w-full">
												<tbody>
													<tr>
														<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-default"> 
															<a href="#" class="text-btn-primary hover:text-btn-primary">
																{{ poolData[poolIdx].name }}
															</a>
														</td>
														<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">{{ poolData[poolIdx].status }}</td>
														<td class="whitespace-nowrap px-3 py-4 text-sm text-muted"> 
															<div class="w-full bg-well rounded-full text-center">
																<div v-if="poolData[poolIdx].properties.capacity! < 1" class="text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div>
																<div v-if="poolData[poolIdx].properties.capacity! >=1 && poolData[poolIdx].properties.capacity! <= 85" class="bg-green-600 text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div>
																<div v-if="poolData[poolIdx].properties.capacity! > 85" class="bg-danger text-s font-medium text-default text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div>
															</div>
														</td>
														<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">{{ poolData[poolIdx].properties.allocated }}</td>
														<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">{{ poolData[poolIdx].properties.free }}</td>
														<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">{{ poolData[poolIdx].properties.size }}</td>
														<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
															<Menu as="div" class="relative inline-block text-left">
																<div>
																	<MenuButton class="flex items-center rounded-full bg-default text-muted hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
																		<span class="sr-only">Open options</span>
																		<EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
																	</MenuButton>
																</div>

																<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
																	<MenuItems class="absolute right-0 z-10 mt-2 w-max origin-top-left rounded-md bg-accent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
																		<div class="py-1">
																			<MenuItem v-slot="{ active }">
																				<a href="#" @click="showDetails(poolData[poolIdx])!" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pool Details</a>
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
																				<a href="#" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy Pool</a>
																			</MenuItem>
																		</div>
																	</MenuItems>
																</transition>
															</Menu>
														</td>
													</tr>
												</tbody>
											</table>
										</template>

										<template v-slot:content>
											<tr v-for="vDev, vDevIdx in poolData[poolIdx].vdevs" :key="vDevIdx">
												<Accordion :isOpen="false" class="ml-4">
													<template v-slot:title>
														<td>
														{{  poolData[poolIdx].vdevs[vDevIdx].name }}
														</td>
													</template>
													<template v-slot:content>
														<table class="min-w-full divide-y divide-default">
															<thead>
																<tr>
																	<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-default sm:pl-6 lg:pl-8">Name</th>
																	<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Status</th>
																	<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Used (%)</th>
																	<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Used</th>
																	<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Free</th>
																	<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Total</th>
																	<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
																		<span class="sr-only"></span>
																	</th>
																</tr>
															</thead>
															<tbody class="divide-y divide-default bg-default">
																<tr v-for="disk, diskIdx in poolData[poolIdx].vdevs[vDevIdx].disks" :key="diskIdx">
																	<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-default sm:pl-6 lg:pl-8"> 
																		<a href="#" class="text-btn-primary hover:text-btn-primary">
																		{{ disk.name }}
																		</a>
																	</td>
																	<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">{{ disk.status }}</td>
																	<td class="whitespace-nowrap px-3 py-4 text-sm text-muted"> 
																		<div class="w-full bg-well rounded-full">
																		
																		</div>
																	</td>
																	<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">used</td>
																	<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">free</td>
																	<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">total</td>
																	<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
																		
																	</td>
																</tr>
															</tbody>
														</table>
													</template>
												</Accordion>
											</tr>
										</template>
									</Accordion>
								</td>
							</tr>
						</tbody>	
					</table>  -->
				</div>
			</div>
		</div>
	</div>


	<div v-if="showConfig">
		<CreatePool @close="showConfig = false"/>
	</div>

	<!-- <div v-if="showDiskDetails">
		<DiskDetail @close="showDiskDetails = false"/>
	</div> -->

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
import DiskDetail from "./DiskDetail.vue";
import PoolDetail from "./PoolDetail.vue";

const poolData = inject<Ref<PoolData[]>>("pools")!;

const showConfig = ref(false);

const showPoolDetails = ref(false);

const selectedPool = ref<PoolData>();

//method to show pool details when button is clicked
function showDetails(pool) {
	selectedPool.value = pool;
	console.log(selectedPool);
	showPoolDetails.value = true;
}

</script>