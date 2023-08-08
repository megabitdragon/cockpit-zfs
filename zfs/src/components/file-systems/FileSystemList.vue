<template>
	<div class="inline-block min-w-full py-4 align-middle sm:px-6 lg:px-8 overflow-visible sm:rounded-lg bg-accent rounded-md border border-default">
		<div class="button-group-row">
			<button id="createFS" class="btn btn-primary object-left justify-start" @click="showFSWizard = true">Create File System</button>
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
								<td class="py-4 pl-4 pr-3 text-sm font-medium text-default"> 
									<span class="sr-only"></span>
								</td>
								<td class="py-4 pl-4 pr-3 text-sm font-medium text-default"> {{ fileSystem.name }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ fileSystem.properties.available }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ fileSystem.properties.usedByDataset }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ fileSystem.properties.usedbyRefreservation }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ fileSystem.properties.compression }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ fileSystem.properties.deduplication }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ isBoolOnOff(fileSystem.encrypted) }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ fileSystem.properties.snapshotCount }}</td>
								<td class="px-3 py-4 text-sm text-muted">{{ fileSystem.properties.readOnly }}</td>
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
														<a href="#" @onClick="" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy File System</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" @onClick="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Configure Replication Task</a>
													</MenuItem>
													<MenuItem v-if="fileSystem.encrypted" v-slot="{ active }">
														<a href="#" @onClick="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Change Passphrase</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" @onClick="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Create Snapshot</a>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<a href="#" @onClick="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Send File System</a>
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
					<span class="font-semibold text-lg my-2">No Pools Found</span>
				</div>

			</div>
		</div>
	</div>

	<div v-if="showFSWizard">
		<FileSystem :isStandalone="true" idKey="fs-wizard" @close="showFSWizard = false"/>
	</div>

</template>

<script setup lang="ts">
import { ref, inject, Ref, provide } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { loadDatasets } from "../../composables/loadData";
import LoadingSpinner from "../common/LoadingSpinner.vue";
import FileSystem from "../wizard-components/FileSystem.vue";

const poolData = inject<Ref<PoolData[]>>("pools")!;

const fileSystems = inject<Ref<FileSystemData[]>>('datasets')!;
const fileSystemsLoaded = inject<Ref<boolean>>('datasets-loaded')!;

const showFSWizard = ref(false);

async function refreshDatasets() {
	fileSystemsLoaded.value = false;
	fileSystems.value = [];
	await loadDatasets(fileSystems);
	fileSystemsLoaded.value = true;
}

function isBoolOnOff(bool : boolean) {
	if (bool) {return 'on'} else {return 'off'}
}

provide('show-fs-wizard', showFSWizard);
</script>