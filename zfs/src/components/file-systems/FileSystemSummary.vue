<template>
	<div class="px-4 sm:px-6 lg:px-8">
		<div class="button-group-row">
				<button id="createFS" class="btn btn-primary object-left justify-start" @click="">Create File System</button>
				<button id="refreshFS" class="btn btn-secondary object-right justify-end" @click="" disabled><ArrowPathIcon class="w-5 h-5"/></button>
		</div>

		<div class="mt-8">
			<div class="-mx-4 -my-2 overflow-auto sm:-mx-6 lg:-mx-8">
				<div class="inline-block min-w-full min-h-full py-2 align-middle">
					<div class="overflow-y-visible shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
						<table class="min-w-full divide-y divide-gray-300">
							<thead>
								<tr>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">Name</th>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Available</th>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Used by Dataset</th>
									<!-- <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Used by Refreservation</th> -->
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Compression</th>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Deduplication</th>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Encryption</th>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Snapshots</th>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Read Only</th>
									<th scope="col" class="relative px-3 py-3.5 sm:pr-6 lg:pr-8">
										<span class="sr-only"></span>
									</th>
								</tr>
							</thead>

							<tbody class="divide-y divide-x divide-gray-200 bg-white">

								<!-- FILE SYSTEMS BY POOLS -->
								<tr v-for="fileSystem, fsIdx in fileSystems" :key="fsIdx">
									<!-- <Accordion class="ml-4">
										<template v-slot:title>                  
										</template>

										<template v-slot:content>                  
										</template>
									</Accordion> -->

									<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"> 
										<a href="#" class="text-btn-primary hover:text-btn-primary">
											<!-- {{ fileSystem Name }} -->
											{{ fileSystem.name }}
										</a>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<!-- {{ fileSystem Available }} -->
										{{ fileSystem.properties.available }}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<!-- {{ fileSystem Used }} -->
										{{ fileSystem.properties.usedByDataset }}
									</td>
									<!-- <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										{{ fileSystem.properties.usedbyRefreservation }}
									</td> -->
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> 
										<!-- {{ fileSystem Compression(%) }} -->
										{{ fileSystem.properties.compression }}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<!-- {{ fileSystem Deduplication }} -->
										{{ fileSystem.properties.deduplication }}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<!-- {{ fileSystem Encryption }} -->
										{{ fileSystem.encrypted }}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<!-- {{ fileSystem Snapshots }} -->
										{{ fileSystem.properties.snapshotCount }}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<!-- {{ fileSystem ReadOnly }} -->
										{{ fileSystem.properties.readOnly }}
									</td>
									<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
										<Menu as="div" class="relative inline-block text-left">
											<div>
												<MenuButton class="flex items-center rounded-full bg-white-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
													<span class="sr-only">Open options</span>
													<EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
												</MenuButton>
											</div>
											<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
												<MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
													<div class="py-1">
														<MenuItem v-slot="{ active }">
															<a href="#" @onClick="" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Configure File System</a>
														</MenuItem>
														<MenuItem v-slot="{ active }">
															<a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Destroy File System</a>
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
		</div>
	</div>

</template>

<script setup lang="ts">
import { ref, inject, Ref } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import Accordion from '../common/Accordion.vue';

const poolData = inject<Ref<PoolData[]>>("pools")!;

const fileSystems = inject<Dataset[]>('datasets')!;


</script>