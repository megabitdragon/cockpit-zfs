<template>
	<Modal @close="showPoolDetails = false" :isOpen="showPoolDetails" :marginTop="'mt-28'" :width="'w-8/12'" :minWidth="'min-w-8/12'">
		<template v-slot:title>
			<Navigation :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
		</template>
		<template v-slot:content>
			<div v-if="navTag == 'stats'" class="mt-6 grid grid-cols-4">
				<div class="col-span-2">
					<CircleProgress :id="getIdKey('pool-visual-capacity')" :fillColor="'text-success'" :name="props.pool.name" :totalSize="props.pool.properties.size" :capacity="props.pool.properties.capacity" :radius="50" :coordX="60" :coordY="60" :strokeWidth="10" :strokeDashArr="314"/>
				</div>
				
				<div class="mt-2 col-span-2 col-start-3 row-start-1">
					<p :id="getIdKey('pool-health')" name="pool-health" class="text-lg">Health: <span class="text-success">{{ props.pool.status }}</span></p>
					<p :id="getIdKey('pool-errors')" name="pool-errors" class="text-sm">Errors: None currently detected - {{ getTimestampString }}</p>
				</div>

				<div class="mt-2 col-span-1 col-start-3 row-start-2">
					<p :id="getIdKey('pool-size')" name="pool-size" class="text-base">Size: {{ props.pool.properties.size }}</p>
					<p :id="getIdKey('pool-allocated')" name="pool-allocated" class="text-base">Used: {{ props.pool.properties.allocated }}</p>
					<p :id="getIdKey('pool-free')" name="pool-free" class="text-base">Free: {{ props.pool.properties.free }}</p>
				</div>
				<div class="mt-2 col-span-1 col-start-4 row-start-2">
					<p :id="getIdKey('pool-devices')" name="pool-devices" class="text-base">Devices: {{ getNumDevices }}</p>
					<p :id="getIdKey('pool-disks')" name="pool-disks" class="text-base">Disks: {{  getNumDisks}}</p>
					<p :id="getIdKey('pool-datasets')" name="pool-datasets" class="text-base">Datasets: X</p>
				</div>
			</div>

			<div v-if="navTag == 'topology'" class="mt-2 grid grid-cols-4 grid-flow-row">
				<div v-for="vDev, vDevIdx in props.pool.vdevs" :key="vDevIdx" class="p-2 m-2 rounded-md border border-default col-span-2 bg-accent">
					<legend class="mb-1 text-base font-medium leading-6 text-default">{{ vDev.name }} ({{ vDev.type }})</legend>
					
					<div class="grid grid-cols-2">
						<div v-for="disk, diskIdx in vDev.disks" :key="diskIdx" class="m-1 col-span-1">
							<PoolDetailDiskCard :disk="vDev.disks[diskIdx]"/>
						</div>
					</div>
				</div>
			</div>
			
			<div v-if="navTag == 'snapshots'" class="overflow-y-visible">
				<div v-if="snapshots.length < 1" class="flex items-center justify-center">
					<p class="text-default">No snapshots found.</p>
				</div>
				<div v-else class="inline-block min-w-full min-h-full align-middle rounded-md border border-default overflow-y-visible">
					<div class="overflow-y-visible ring-1 ring-black ring-opacity-5 sm:rounded-lg">
						<table class="table-auto min-w-full min-h-full divide-y divide-default bg-well">
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
								<tr v-for="snapshot, snapshotIdx in snapshots" :key="snapshotIdx" class="text-default ml-4">
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
														<MenuItem v-slot="{ active }">
															<a href="#" @click="" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clone Snapshot</a>
														</MenuItem>
														<MenuItem v-slot="{ active }">
															<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Rename Snapshot</a>
														</MenuItem>
														<MenuItem v-slot="{ active }">
															<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Roll Back Snapshot</a>
														</MenuItem>
														<MenuItem v-slot="{ active }">
															<a href="#" @click="" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy Snapshot</a>
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

			<div v-if="navTag == 'settings'">
				<div class="grid grid-cols-4 gap-2">
					<div class="mt-2 col-span-1 col-start-1 row-start-1">
						<p :id="getIdKey('settings-pool-name')" name="settings-pool-name" class="text-base text-default">Pool</p><p>{{ props.pool.name }}</p>
					</div>
					<div class="mt-2 col-span-1 col-start-2 row-start-1">
						<p :id="getIdKey('settings-pool-readonly')" name="settings-pool-readonly" class="text-base text-default">Read Only</p><p>No</p>
					</div>
					<div class="mt-2 col-span-1 col-start-3 row-start-1">
						<p :id="getIdKey('settings-pool-guid')" name="settings-pool-guid" class="text-base text-default">GUID</p><p>{{ props.pool.guid }}</p>
					</div>
					<div class="mt-2 col-span-1 col-start-4 row-start-1 items-end justify-self-end">
						<button :id="getIdKey('settings-pool-guid-regen-btn')" name="settings-pool-guid-regen-btn" class="mt-1 btn btn-secondary">Regenerate Pool GUID</button>
					</div>
					<div class="mt-2 col-span-2 col-start-1 row-start-2">
						<label :for="getIdKey('settings-pool-sector-size')" class="bg-default block text-base leading-6 text-default">Sector Size</label>
						<select :id="getIdKey('settings-pool-sector-size')" name="pool-sector-size" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-default bg-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
							<option value="auto">Auto Detect</option>
							<option value="512b">512 B</option>
							<option selected value="4kib">4 KiB</option>
							<option value="8kib">8 KiB</option>
							<option value="16kib">16 KiB</option>
							<option value="32kib">32 KiB</option>
							<option value="64kib">64 KiB</option>
						</select>
					</div>
					<div class="mt-2 col-span-2 col-start-3 row-start-2">
						<label :for="getIdKey('settings-pool-fail-mode')" class="bg-default block text-base leading-6 text-default">Fail Mode</label>
						<select :id="getIdKey('settings-pool-fail-mode')" name="pool-fail-mode" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-default bg-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
							<option value="wait">Wait</option>
							<option value="continue">Continue</option>
							<option value="panic">Panic</option>
						</select>
					</div>
					<div class="mt-2 col-span-4 col-start-1 row-start-3">
						<p :for="getIdKey('settings-pool-comment')" class="text-base text-default">Comment</p>
						<input :id="getIdKey('settings-pool-comment')" name="setting-pool-comment" placeholder="Enter a comment here" type="text" class="input-textlike mt-1 block w-full rounded-md border-0 py-1.5 px-1.5 text-default shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-muted focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6"/>
					</div>

					<!-- auto-expand -->
					<div class="col-span-1 col-start-1 row-start-4">
						<label :for="getIdKey('settings-pool-auto-expand')" class="mt-1 block text-sm leading-6 text-default">Auto-Expand Pool</label>
						<Switch v-model="poolConfig.settings!.autoExpand" :id="getIdKey('settings-pool-auto-expand')" :class="[poolConfig.settings?.autoExpand ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.settings?.autoExpand ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.settings?.autoExpand ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.settings?.autoExpand ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>

					<!-- auto-replace -->
					<div class="col-span-1 col-start-2 row-start-4">
						<label :for="getIdKey('settings-pool-auto-replace')" class="mt-1 block text-sm leading-6 text-default">Auto-Replace Drives</label>
						<Switch v-model="poolConfig.settings!.autoReplace" :id="getIdKey('settings-pool-auto-replace')" :class="[poolConfig.settings?.autoReplace ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.settings?.autoReplace ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.settings?.autoReplace ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.settings?.autoReplace ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>


					<!-- auto-trim -->
					<div class="col-span-1 col-start-3 row-start-4">
						<label :for="getIdKey('settings-pool-auto-trim')" class="mt-1 block text-sm leading-6 text-default">Auto-TRIM Pool</label>
						<Switch v-model="poolConfig.settings!.autoTrim" :id="getIdKey('settings-pool-auto-trim')" :class="[poolConfig.settings?.autoTrim ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.settings?.autoTrim ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.settings?.autoTrim ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.settings?.autoTrim ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>

					<!-- multi-host -->
					<div class="col-span-1 col-start-4 row-start-4">
						<label :for="getIdKey('settings-pool-multi-host')" class="mt-1 block text-sm leading-6 text-default">Multi-Host</label>
						<Switch v-model="poolConfig.settings!.multiHost" :id="getIdKey('settings-pool-multi-host')" :class="[poolConfig.settings?.multiHost ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.settings?.multiHost ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.settings?.multiHost ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.settings?.multiHost ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>				
					</div>

					<!-- delegation (Allow non-priveleged user access based on the dataset permissions)-->
					<div class="col-span-2 col-start-1 row-start-5">
						<label :for="getIdKey('settings-pool-delegation')" class="mt-1 block text-sm leading-6 text-default">Delegation</label>
						<p class="text-xs">(non-privleged access based on dataset permissions)</p>
						<Switch v-model="poolConfig.settings!.delegation" :id="getIdKey('settings-pool-delegation')" :class="[poolConfig.settings?.delegation ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.settings?.delegation ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.settings?.delegation ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.settings?.delegation ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>

					<!-- display snapshots in filesystem list -->
					<div class="col-span-2 col-start-3 row-start-5">
						<label :for="getIdKey('settings-pool-display-snapshots')" class="mt-1 block text-sm leading-6 text-default">Display Snapshots in File System List</label>
						<Switch v-model="poolConfig.settings!.displaySnapshots" :id="getIdKey('settings-pool-display-snapshots')" :class="[poolConfig.settings?.displaySnapshots ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.settings?.displaySnapshots ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.settings?.displaySnapshots ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.settings?.displaySnapshots ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>
	
				</div>
			</div>
		</template>
		<template v-slot:footer>
			<div v-if="navTag == 'topology'" class="mt-2">
				<div class="mt-2">
					<button :id="getIdKey('add-vdev-btn')" name="add-vdev-btn" class="mt-1 btn btn-primary">Add Virtual Device</button>
				</div>
			</div>
			<div v-if="navTag == 'snapshots'" class="mt-2">
				<div class="mt-2">
					<button @click="showSnapshotModal = true" :id="getIdKey('create-snap-wizard-btn')" name="create-snap-wizard-btn" class="mt-1 btn btn-primary">Create Snapshot</button>
				</div>
			</div>
			<div v-if="navTag == 'settings'" class="mt-2">
				<div class="mt-2">
					<button :id="getIdKey('settings-save-btn')" name="settings-save-btn" class="mt-1 btn btn-primary">Save Changes</button>
				</div>
			</div>
		</template>
	</Modal>

	<CreateSnapshotModal @close="showSnapshotModal = false"/>
</template>

<script setup lang="ts">
import { reactive, ref, inject, Ref, computed, provide } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems, Switch } from '@headlessui/vue';
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import Modal from '../common/Modal.vue';
import CircleProgress from '../common/CircleProgress.vue';
import { getSnapshots } from '../../composables/snapshots';
import { getTimestampString } from '../../composables/helpers';
import Navigation from '../common/Navigation.vue';
import CreateSnapshotModal from './CreateSnapshotModal.vue';
import PoolDetailDiskCard from '../pools/PoolDetailDiskCard.vue';

interface PoolDetailsProps {
	pool: PoolData;
}

const poolConfig = ref<PoolData>({
	name: '',
	status: '',
	guid: '',
	properties: {
		rawsize: 0,
		size: '',
		allocated: '',
		capacity: 0,
		free: '',
	},
	vdevs: [],
	settings: {
		sector: '4kib',
		record: '128kib',
		compression: true,
		deduplication: false,
		refreservation: 10,
		autoExpand: true,
		autoReplace: false,
		autoTrim: false,
		forceCreate: false,
	},
});

const props = defineProps<PoolDetailsProps>();

const open = ref(true);
const showSnapshotModal = ref(false);
const showPoolDetails = inject<Ref<boolean>>("show-pool-deets")!;

const snapshots = ref<Snapshot[]>([]);

const show = ref(true);
const navTag = ref('stats');

getSnapshots().then(rawJSON => {
	const parsedJSON = (JSON.parse(rawJSON));
	console.log('Snapshots JSON:');
	console.log(parsedJSON);

	parsedJSON[props.pool.name].forEach(snapshot => {
		const snap : Snapshot = {
			name: snapshot.name,
			id: snapshot.id,
			snapName: snapshot.snapshot_name,
			dataset: snapshot.dataset,
			pool: snapshot.pool,
			mountpoint: snapshot.mountpoint,
			type: snapshot.type,
			properties: {
				clones: snapshot.properties.clones.parsed,
				creation: {
					rawTimestamp: snapshot.properties.creation.rawvalue,
					parsed: snapshot.properties.creation.parsed,
					value: snapshot.properties.creation.value,
				},
				referenced: {
					value: snapshot.properties.referenced.value,
					rawNum: snapshot.properties.referenced.parsed,
				},
				used: {
					value: snapshot.properties.used.value,
					rawNum: snapshot.properties.used.parsed,
				},
			},
  			holds: snapshot.holds
		}

		//const snap : Snapshot = snapshot;
		
		//console.log(snap);
		snapshots.value.push(snap);
	})
});

const getNumDevices = props.pool.vdevs.length;

const getNumDisks = computed(() =>  {
	let disks = 0;
	props.pool.vdevs.forEach(vdev => {
		vdev.disks.forEach(disk => {
			disks++;
		});
	});
	return disks;
});

const getNumDatasets = computed(() => {
	let datasets = 0;
	//use recursion to check root_dataset for children and those children for children etc.
	
	return datasets;
});

const currentNavigationItem = computed<NavigationItem | undefined>(() => navigation.find(item => item.current));

const navigationCallback: NavigationCallback = (item: NavigationItem) => {
	navTag.value = item.tag;
};

const navigation = reactive<NavigationItem[]>([
	{ name: 'Stats', tag: 'stats', current: computed(() => navTag.value == 'stats') as unknown as boolean, show: true, },
	{ name: 'Topology', tag: 'topology', current: computed(() => navTag.value == 'topology') as unknown as boolean, show: true, },
	{ name: 'Snapshots', tag: 'snapshots', current: computed(() => navTag.value == 'snapshots') as unknown as boolean, show: true, },
	{ name: 'Settings', tag: 'settings', current: computed(() => navTag.value == 'settings') as unknown as boolean, show: true, },
].filter(item => item.show));

const getIdKey = (name: string) => `${name}`;

provide('create-snap-modal', showSnapshotModal);
</script>
