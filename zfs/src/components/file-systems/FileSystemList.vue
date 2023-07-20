<template>
	<div class="px-4 sm:px-6 lg:px-8">
		<div class="button-group-row">
			<button id="createFS" class="btn btn-primary object-left justify-start" @click="showFSWizard = true">Create File System</button>
			<button id="refreshFS" class="btn btn-secondary object-right justify-end" @click="" disabled><ArrowPathIcon class="w-5 h-5"/></button>
		</div>

		<div class="mt-8 overflow-visible">
			<div class="inline-block min-w-full min-h-full align-middle rounded-md border border-default">
				<div class="overflow-y-visible ring-1 ring-black ring-opacity-5 sm:rounded-lg">
					<table class="min-w-full divide-y divide-default bg-accent">
						<thead>
							<tr class="rounded-md">
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default sm:pl-6 lg:pl-8">Name</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Available</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Used by Dataset</th>
								<!-- <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Used by Refreservation</th> -->
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Compression</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Deduplication</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Encryption</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Snapshots</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-default">Read Only</th>
								<th scope="col" class="relative px-3 py-3.5 sm:pr-6 lg:pr-8">
									<span class="sr-only"></span>
								</th>
							</tr>
						</thead>

						<tbody class="divide-y divide-x divide-default bg-default">

							<!-- FILE SYSTEMS BY POOLS -->
							<tr v-for="fileSystem, fsIdx in fileSystems" :key="fsIdx">

								<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-default sm:pl-6 lg:pl-8"> 
									{{ fileSystem.name }}
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">
									{{ fileSystem.properties.available }}
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">
									{{ fileSystem.properties.usedByDataset }}
								</td>
								<!-- <td class="whitespace-nowrap px-3 py-4 text-sm text-muted">
									{{ fileSystem.properties.usedbyRefreservation }}
								</td> -->
								<td class="whitespace-nowrap px-3 py-4 text-sm text-muted"> 
									{{ fileSystem.properties.compression }}
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">
									{{ fileSystem.properties.deduplication }}
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">
									{{ fileSystem.encrypted }}
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">
									{{ fileSystem.properties.snapshotCount }}
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">
									{{ fileSystem.properties.readOnly }}
								</td>
								<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
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
													<MenuItem v-slot="{ active }">
														<a href="#" @onClick="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Configure File System</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" @onClick="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Edit Permissions</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" @onClick="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Rename File System</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" @onClick="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Unmount File System</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" @onClick="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Create Snapshot</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" @onClick="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Send File System</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy File System</a>
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

	<div v-if="showFSWizard">
		<NewFSWIzard idKey="fs-wizard" @close="showFSWizard = false"/>
	</div>

</template>

<script setup lang="ts">
import { ref, inject, Ref } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import Modal from '../common/Modal.vue';
import NewFSWIzard from "./NewFSWIzard.vue";

const poolData = inject<Ref<PoolData[]>>("pools")!;

const fileSystems = inject<Dataset[]>('datasets')!;

const showFSWizard = ref(false);

</script>