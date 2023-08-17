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
					<!-- <p :id="getIdKey('pool-datasets')" name="pool-datasets" class="text-base">Datasets: X</p> -->
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
						<p :id="getIdKey('settings-pool-name')" name="settings-pool-name" class="text-base text-default">Pool</p><p>{{ poolConfig.name }}</p>
					</div>
					<div class="mt-2 col-span-1 col-start-2 row-start-1">
						<p :id="getIdKey('settings-pool-readonly')" name="settings-pool-readonly" class="text-base text-default">Read Only</p><p>{{ upperCaseWord(isBoolOnOff(poolConfig.properties.readOnly)) }}</p>
					</div>
					<div class="mt-2 col-span-1 col-start-3 row-start-1">
						<p :id="getIdKey('settings-pool-guid')" name="settings-pool-guid" class="text-base text-default">GUID</p><p>{{ poolConfig.guid }}</p>
					</div>
					<div class="mt-2 col-span-1 col-start-4 row-start-1 items-end justify-self-end">
						<button @click="" :id="getIdKey('settings-pool-guid-regen-btn')" name="settings-pool-guid-regen-btn" class="mt-1 btn btn-secondary">Regenerate Pool GUID</button>
					</div>
					<div class="mt-2 col-span-2 col-start-1 row-start-2">
						<label :for="getIdKey('settings-pool-sector-size')" class="bg-default block text-base leading-6 text-default">Sector Size</label>
						<select :id="getIdKey('settings-pool-sector-size')" v-model="poolConfig.properties.sector" name="pool-sector-size" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-default bg-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
							<option value="auto">Auto Detect</option>
							<option value="9">512 B</option>
							<option value="12">4 KiB</option>
							<option value="13">8 KiB</option>
							<option value="14">16 KiB</option>
							<option value="15">32 KiB</option>
							<option value="16">64 KiB</option>
						</select>
					</div>
					<div class="mt-2 col-span-2 col-start-3 row-start-2">
						<label :for="getIdKey('settings-pool-fail-mode')" class="bg-default block text-base leading-6 text-default">Fail Mode</label>
						<select :id="getIdKey('settings-pool-fail-mode')" v-model="poolConfig.failMode" name="pool-fail-mode" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-default bg-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
							<option value="wait">Wait</option>
							<option value="continue">Continue</option>
							<option value="panic">Panic</option>
						</select>
					</div>
					<div class="mt-2 col-span-4 col-start-1 row-start-3">
						<p :for="getIdKey('settings-pool-comment')" class="text-base text-default">Comment</p>
						<input :id="getIdKey('settings-pool-comment')" v-model="poolConfig.comment" name="setting-pool-comment" placeholder="Enter a comment here" type="text" class="input-textlike mt-1 block w-full rounded-md border-0 py-1.5 px-1.5 text-default shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-muted focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6"/>
					</div>

					<!-- auto-expand -->
					<div class="col-span-1 col-start-1 row-start-4">
						<label :for="getIdKey('settings-pool-auto-expand')" class="mt-1 block text-sm leading-6 text-default">Auto-Expand Pool</label>
						<Switch v-model="poolConfig.properties.autoExpand" :id="getIdKey('settings-pool-auto-expand')" :class="[poolConfig.properties.autoExpand ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.properties.autoExpand ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.properties.autoExpand ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.properties.autoExpand ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
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
						<Switch v-model="poolConfig.properties.autoReplace" :id="getIdKey('settings-pool-auto-replace')" :class="[poolConfig.properties.autoReplace ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.properties.autoReplace ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.properties.autoReplace ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.properties.autoReplace ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
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
						<Switch v-model="poolConfig.properties.autoTrim" :id="getIdKey('settings-pool-auto-trim')" :class="[poolConfig.properties.autoTrim ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.properties.autoTrim ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.properties.autoTrim ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.properties.autoTrim ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>

					<!-- multi-host -->
					<div class="col-span-1 col-start-4 row-start-4">
						<label :for="getIdKey('settings-pool-multi-host')" class="mt-1 block text-sm leading-6 text-default">Multi-Host (disabled)</label>
						<Switch disabled v-model="poolConfig.properties.multiHost" :id="getIdKey('settings-pool-multi-host')" :class="[poolConfig.properties.multiHost ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.properties.multiHost ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.properties.multiHost ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.properties.multiHost ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
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
						<Switch v-model="poolConfig.properties.delegation" :id="getIdKey('settings-pool-delegation')" :class="[poolConfig.properties.delegation ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.properties.delegation ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.properties.delegation ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.properties.delegation ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
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
						<Switch v-model="poolConfig.properties.displaySnapshots" :id="getIdKey('settings-pool-display-snapshots')" :class="[poolConfig.properties.displaySnapshots ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.properties.displaySnapshots ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.properties.displaySnapshots ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.properties.displaySnapshots ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
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
			<div class="button-group-row w-full justify-between">
				<div class="mt-2 justify-self-start">
					<button @click="showPoolDetails = false" :id="getIdKey('close-details-btn')" name="close-details-btn" class="mt-1 btn btn-danger">Close</button>
				</div>
				<div class="justofy-self-center">
					<div class="button-group-row mt-2 justify-self-center">
						<p class="text-danger" v-if="commentFeedback">{{ commentFeedback }}</p>
					</div>
				</div>
				<div class="justify-self-end">
					<div v-if="navTag == 'topology'" >
						<div class="mt-2">
							<button @click="showAddVDevModal = true" :id="getIdKey('add-vdev-btn')" name="add-vdev-btn" class="mt-1 btn btn-primary">Add Virtual Device</button>
						</div>
					</div>
					<div v-if="navTag == 'snapshots'" >
						<div class="mt-2">
							<button @click="showSnapshotModal = true" :id="getIdKey('create-snap-wizard-btn')" name="create-snap-wizard-btn" class="mt-1 btn btn-primary">Create Snapshot</button>
						</div>
					</div>
					<div v-if="navTag == 'settings'" >
						<div class="button-group-row mt-2">
							<button v-if="!saving" @click="poolConfigureBtn" :id="getIdKey('settings-save-btn')" name="settings-save-btn" class="mt-1 btn btn-primary">Save Changes</button>
							<button disabled v-if="saving" id="finish" type="button" class="btn btn-primary object-right justify-end">
								<svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin text-default" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
									<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="text-success"/>
								</svg>
								Saving...
							</button>
						</div>
						
					</div>
				</div>
			</div>
		</template>
	</Modal>

	<CreateSnapshotModal @close="showSnapshotModal = false"/>
	<AddVDevModal @close="showAddVDevModal = false" :idKey="'show-vdev-modal'" :pool="props.pool"/>
</template>

<script setup lang="ts">
import { reactive, ref, inject, Ref, computed, provide } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems, Switch } from '@headlessui/vue';
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import Modal from '../common/Modal.vue';
import CircleProgress from '../common/CircleProgress.vue';
import { getSnapshots } from '../../composables/snapshots';
import { configurePool } from '../../composables/pools';
import { getTimestampString, upperCaseWord, isBoolOnOff } from '../../composables/helpers';
import Navigation from '../common/Navigation.vue';
import CreateSnapshotModal from './CreateSnapshotModal.vue';
import AddVDevModal from './AddVDevModal.vue';
import PoolDetailDiskCard from '../pools/PoolDetailDiskCard.vue';
import { loadDisksThenPools } from '../../composables/loadData';

interface PoolDetailsProps {
	pool: PoolData;
}

const props = defineProps<PoolDetailsProps>();

const poolConfig = ref<PoolData>({
	name: props.pool.name,
	status: props.pool.status,
	guid: props.pool.guid,
	properties: {
		rawsize: props.pool.properties.rawsize,
		size: props.pool.properties.size,
		allocated: props.pool.properties.allocated,
		capacity: props.pool.properties.capacity,
		free: props.pool.properties.free,
		sector: props.pool.properties.sector,
		record: props.pool.properties.record,
		compression: props.pool.properties.compression,
		deduplication: props.pool.properties.deduplication,
		refreservationPercent: props.pool.properties.refreservationPercent,
		autoExpand: props.pool.properties.autoExpand,
		autoReplace: props.pool.properties.autoReplace,
		autoTrim: props.pool.properties.autoTrim,
		forceCreate: props.pool.properties.forceCreate,
		delegation: props.pool.properties.delegation,
		displaySnapshots: props.pool.properties.displaySnapshots,
		multiHost: false,
		readOnly: props.pool.properties.readOnly,
	},
	vdevs: props.pool.vdevs,
	failMode: props.pool.failMode,
	comment: props.pool.comment,
});

const showSnapshotModal = ref(false);
const showAddVDevModal = ref(false);
const showPoolDetails = inject<Ref<boolean>>("show-pool-deets")!;

const snapshots = ref<Snapshot[]>([]);

const pools = inject<Ref<PoolData[]>>('pools')!;
const disks = inject<Ref<DiskData[]>>('disks')!;

const show = ref(true);
const navTag = ref('stats');

const saving = inject<Ref<boolean>>('saving')!;
const disksLoaded = inject<Ref<boolean>>('disks-loaded')!;
const poolsLoaded = inject<Ref<boolean>>('pools-loaded')!;

const commentFeedback = ref('');

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

const newChangesToPool = ref<PoolEditConfig>({
	name: poolConfig.value.name,
	guid: poolConfig.value.guid,
	readonly: isBoolOnOff(poolConfig.value.properties.readOnly),
});

const updatedProperties: Partial<PoolEditConfig> = ({
	name: poolConfig.value.name,
	guid: poolConfig.value.guid,
	readonly: isBoolOnOff(poolConfig.value.properties.readOnly),
});

async function checkForChanges(poolDataCheck) {
	//sector
	if (poolDataCheck.properties.sector != props.pool.properties.sector) {
		updatedProperties.ashift = poolDataCheck.properties.sector;
	}
	//failmode
	console.log('poolDataCheck.failmode\n', poolDataCheck.failmode);
	console.log('props.pool.failMode\n', props.pool.failMode);
	if (poolDataCheck.failMode != props.pool.failMode) {
		updatedProperties.failmode = poolDataCheck.failMode;
	}
	//comment
	if (poolDataCheck.comment != props.pool.comment) {
		updatedProperties.comment = poolDataCheck.comment;
	}
	//autoexpand
	if (poolDataCheck.properties.autoExpand != props.pool.properties.autoExpand) {
		updatedProperties.autoexpand = isBoolOnOff(poolDataCheck.properties.autoExpand);
	}
	//autoreplace
	if (poolDataCheck.properties.autoReplace != props.pool.properties.autoReplace) {
		updatedProperties.autoreplace = isBoolOnOff(poolDataCheck.properties.autoReplace);
	}
	//autotrim
	if (poolDataCheck.properties.autoTrim != props.pool.properties.autoTrim) {
		updatedProperties.autotrim = isBoolOnOff(poolDataCheck.properties.autoTrim);
	}
	//multihost
	// if (poolDataCheck.properties.multiHost != props.pool.properties.multiHost) {
	// 	updatedProperties.multihost = isBoolOnOff(poolDataCheck.properties.multiHost);
	// }
	//delegation
	if (poolDataCheck.properties.delegation != props.pool.properties.delegation) {
		updatedProperties.delegation = isBoolOnOff(poolDataCheck.properties.delegation);
	}
	//listsnapshots
	if (poolDataCheck.properties.displaySnapshots != props.pool.properties.displaySnapshots) {
		updatedProperties.listsnapshots = isBoolOnOff(poolDataCheck.properties.displaySnapshots);
	}

	const newChanges = {
        ...newChangesToPool.value,
        ...updatedProperties,
    }

    newChangesToPool.value = newChanges;
}

async function poolConfigureBtn() {
	if (commentLengthCheck(poolConfig.value)) {
		console.log('pool:', poolConfig.value);
		await checkForChanges(poolConfig.value);
		console.log('newChanges:', newChangesToPool.value);
		saving.value = true;
		await configurePool(newChangesToPool.value);
		disksLoaded.value = false;
		poolsLoaded.value = false;
		pools.value = [];
		disks.value = [];
		await loadDisksThenPools(disks, pools);
		disksLoaded.value = true;
		poolsLoaded.value = true;
		saving.value = false;
		showPoolDetails.value = false;
	}
}

const commentLengthCheck = (poolData) => {
	let result = true;
	commentFeedback.value = '';	

	if (poolData.comment.length > 32) {
		result = false;
		commentFeedback.value = 'Comment cannot exceed 32 characters.';
	}

	return result;
}

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
provide('add-vdev-modal', showAddVDevModal);
provide('current-pool-config', poolConfig);
</script>
