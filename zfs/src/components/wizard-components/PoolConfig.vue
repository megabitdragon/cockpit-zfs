<template>
	<!-- first tab: name entry -->
	<div v-if="props.tag ==='name-entry'">
		<legend class="mb-1 text-base font-semibold leading-6 text-default">Name this Pool</legend>
		<input type="text" @change="nameCheck" v-model="poolConfig.name" name="pool-name" :id="getIdKey('pool-name')" class="mt-1 block w-full input-textlike bg-default" placeholder="Pool Name" />
		<p class="text-danger" v-if="nameFeedback">{{ nameFeedback }}</p>
	</div>

  	<!-- second tab: vDev + disk selection -->
  	<div v-if="props.tag ==='virtual-devices'">
		<fieldset>
			<legend class="mb-1 text-base font-semibold leading-6 text-default">Create a Virtual Device</legend>
			
			<div v-for="(vDev, vDevIdx) in poolConfig.vdevs" :key="vDevIdx">
				<!-- Virtual Device (Select) -->
				<div>
					<label :for="getIdKey('virtual-device')" class="block text-sm font-medium leading-6 text-default">Type</label>
					<!-- if first VDev, always either DISK, MIRROR, RAIDZ1-3 -->
					<!-- if NOT first VDev, always either CACHE, LOG, SPECIAL, SPARE, DEDUP, or TYPE OF FIRST VDEV -->
					<select id="virtual-device" v-model="poolConfig.vdevs[vDevIdx].type" name="virtual-device" class="text-default bg-default mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
						<option v-if="vDevIdx === 0" value="disk">Disk</option>
						<option v-if="vDevIdx === 0" value="mirror">Mirror</option>
						<option v-if="vDevIdx === 0" value="raidz1">RaidZ1</option>
						<option v-if="vDevIdx === 0" value="raidz2">RaidZ2</option>
						<option v-if="vDevIdx === 0" value="raidz3">RaidZ3</option>
						<option v-if="vDevIdx !== 0" :value="poolConfig.vdevs[0].type">{{poolConfig.vdevs[0].type}}</option>
						<option v-if="vDevIdx !== 0" value="cache">Cache</option>
						<option v-if="vDevIdx !== 0" value="log">Log</option> 
						<option v-if="vDevIdx !== 0" value="special">Special</option>
						<option v-if="vDevIdx !== 0" value="spare">Spare</option>
						<option v-if="vDevIdx !== 0" value="dedup">Dedup</option>
					</select>
				</div>

					<!-- If (Log, Special) -->
					<!-- If secondary VDev is LOG or SPECIAL, have option for them to be MIRROR also -->
				<!-- <div v-if="poolConfig.vdevs[vDevIdx].type == 'log' || poolConfig.vdevs[vDevIdx].type == 'special'">
					<label :for="getIdKey('mirror-enabled')" class="mt-1 block text-sm font-medium leading-6 text-default">{{ poolConfig.vdevs[vDevIdx].type }} (Mirror)</label>
					<Switch v-model="isMirror" :class="[isMirror ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
						<span class="sr-only">Use setting</span>
						<span :class="[isMirror ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
							<span :class="[isMirror ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
								<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
									<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>
							<span :class="[isMirror ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
								<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
									<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
								</svg>
							</span>
						</span>
					</Switch>
					</div> -->

					<!-- Disk ID (Select) -->
					<!-- Select option for sorting/displaying disks by BLOCK DEVICE, DISK NAME, HARDWARE PATH, or DEVICE ALIAS -->
				<!-- <div>
					<label :for="getIdKey('disk-identifier')" class="block text-sm font-medium leading-6 text-default">Disk Identifier</label>
						<select id="disk-identifier" name="disk-identifier" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
							<option>Block Device</option>
							<option>Disk</option>
							<option>Hardware Path</option>
							<option>Device Alias</option>
						</select>
					</div> -->

					<!-- Disk selection, shows disks that are not in use and as they are selected it hides them from any additional VDevs so they cannot be selected twice -->
					<label :for="getIdKey('available-disk-list')" class="block text-sm font-medium leading-6 text-default">Select Disks</label>
					<ul :id="getIdKey('available-disk-list')" role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<li v-for="(disk, diskIdx) in vDevAvailDisks[vDevIdx]" :key="diskIdx" class="col-span-1 divide-y divide-default rounded-lg bg-default shadow">
							<div class="flex w-full h-full border border-default rounded">
								<label :for="getIdKey(`vdev-${vDevIdx}-disk-${diskIdx}`)" class="w-full py-4 ml-2 text-sm font-medium text-default"> 
									<h3 class="truncate text-sm font-medium text-default">{{ disk.name }}</h3>
									<!-- <span class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ disk.status }}</span> -->
									<p class="mt-1 truncate text-sm text-muted">{{ disk.type }}</p>
									<p class="mt-1 truncate text-sm text-muted">Serial #: {{ disk.serial }}</p>
									<p class="mt-1 truncate text-sm text-muted">{{ disk.sd_path }}</p> 
									<input :id="getIdKey(`vdev-${vDevIdx}-disk-${diskIdx}`)" @change="diskCheck" v-model="poolConfig.vdevs[vDevIdx].selectedDisks" type="checkbox" :value="`${disk.name}`" :name="`disk-${disk.name}`" 
									class="w-4 h-4 text-success bg-well border-default rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2"/>
								</label>  
							</div>
						</li>
					</ul>
					<p class="text-danger" v-if="diskFeedback">{{ diskFeedback }}</p>

					<!-- <div><span><p>VDev Disks: {{ poolConfig.vdevs[vDevIdx].disks }}</p></span></div> -->

					<!-- Forcefully Add Virtual Device (Toggle) -->
					<div>
						<label :for="getIdKey('forcefully-add-vdev')" class="mt-1 block text-sm font-medium leading-6 text-default">Forcefully Add Virtual Device</label>
						<Switch :id="getIdKey('forcefully-add-vdev')" v-model="poolConfig.vdevs[vDevIdx].forceAdd" :class="[poolConfig.vdevs[vDevIdx].forceAdd ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.vdevs[vDevIdx].forceAdd ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.vdevs[vDevIdx].forceAdd ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.vdevs[vDevIdx].forceAdd ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>

					<!-- buttons to add/remove vdevs -->
					<div class="button-group-row mt-2">
						<button :id="getIdKey('add-vdev')" class="btn btn-primary object-right justify-end" @click="addVDev()">Add VDev</button>
						<button v-if="poolConfig.vdevs.length > 0" :id="getIdKey('remove-vdev')" class="btn btn-primary object-right justify-end" @click="removeVDev(vDevIdx)">Remove VDev</button>  
					</div>
				</div>
			<!-- if user accidentally removes all vdevs, shows add vdev button to add another (would like to change this so its impossible to remove 1st vDev and ensure there is always at least 1) -->
			<div v-if="poolConfig.vdevs.length < 1" class="button-group-row">
				<button :id="getIdKey('add-vdev')" class="btn btn-primary object-right justify-end" @click="initialVDev()">Add VDev</button>
			</div>
		</fieldset>
		<p class="text-danger" v-if="vDevFeedback">{{ vDevFeedback }}</p>
	</div>

	<!-- third tab: pool settings + advanced settings -->
	<div v-if=" props.tag ==='pool-settings'">
		<fieldset>
			<legend class="mb-1 text-base font-semibold leading-6 text-default">Pool Settings</legend>

			<!-- Sector Size (Select) -->
			<div>
				<label :for="getIdKey('sector-size')" class="block text-sm font-medium leading-6 text-default">Sector Size</label>
				<select :id="getIdKey('sector-size')" v-model="poolConfig.settings!.sector" name="sector-size" class="text-default bg-default mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
					<option value="auto">Auto Detect</option>
					<option value="512b">512 B</option>
					<option selected value="4kib">4 KiB</option>
					<option value="8kib">8 KiB</option>
					<option value="16kib">16 KiB</option>
					<option value="32kib">32 KiB</option>
					<option value="64kib">64 KiB</option>
				</select>
			</div>

			<!-- Record Size (Select) -->
			<div>
				<label :for="getIdKey('record-size')" class="block text-sm font-medium leading-6 text-default">Record Size</label>
				<select :id="getIdKey('record-size')" v-model="poolConfig.settings!.record" name="record-size" class="text-default bg-default mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
					<option value="512b">512 B</option>
					<option value="4kib">4 KiB</option>
					<option value="8kib">8 KiB</option>
					<option value="16kib">16 KiB</option>
					<option value="32kib">32 KiB</option>
					<option value="64kib">64 KiB</option>
					<option selected value="128kib">128 KiB</option>
					<option value="256kib">256 KiB</option>
					<option value="512kib">512 KiB</option>
					<option value="1mib">1 MiB</option>
				</select>
			</div>
			
			<!-- LZ4 Compression (Toggle) -->
			<div>
				<label :for="getIdKey('lz4-enabled')" class="mt-1 block text-sm font-medium leading-6 text-default">LZ4 Compression</label>
				<Switch :id="getIdKey('lz4-enabled')" v-model="poolConfig.settings!.compression" :class="[poolConfig.settings!.compression ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
					<span class="sr-only">Use setting</span>
					<span :class="[poolConfig.settings!.compression ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
						<span :class="[poolConfig.settings!.compression ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
							<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
								<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</span>
						<span :class="[poolConfig.settings!.compression ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
							<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
								<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
							</svg>
						</span>
					</span>
				</Switch>
			</div>

			<!-- Advanced Settings (hidden under accordion for better UI/UX) -->
			<Accordion :isOpen="false" class="mt-2 ml-2">
				<template v-slot:title>
					<span><b>Advanced Settings</b></span>
				</template>
				<template v-slot:content>
					<!-- Deduplication (Toggle) -->
					<div>
						<label :for="getIdKey('deduplication-enabled')" class="mt-1 block text-sm font-medium leading-6 text-default">Deduplication</label>
						<Switch :id="getIdKey('deduplication-enabled')" v-model="poolConfig.settings!.deduplication" :class="[poolConfig.settings!.deduplication ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.settings!.deduplication ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.settings!.deduplication ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.settings!.deduplication ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>

					<!-- Refreservation (Slider) -->
					<div>
						<label :for="getIdKey('steps-range')" class="mt-1 block mb-2 text-sm font-medium text-default">Refreservation</label>
						<input :id="getIdKey('steps-range')" v-model="poolConfig.settings!.refreservation" type="range" min="0" max="20" value="10" step="1" class="text-default bg-default mt-1 w-3/4 h-2 bg-accent rounded-lg appearance-none cursor-pointer ">
						<input :id="getIdKey('steps-range')" v-model="poolConfig.settings!.refreservation" type="number" value="10" class="text-default bg-default mt-1 w-1/4 block rounded-md border-0 py-1.5 px-1.5 text-default shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-muted focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6"/>
					</div>

					<!-- Auto-Expand Pool (Toggle) -->
					<div>
						<label :for="getIdKey('auto-expand-enabled')" class="mt-1 block text-sm font-medium leading-6 text-default">Auto-Expand Pool (When Larger Devices are Added)</label>
						<Switch v-model="poolConfig.settings!.autoExpand" :class="[poolConfig.settings!.autoExpand ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.settings!.autoExpand ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.settings!.autoExpand ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.settings!.autoExpand ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>
					
					<!-- Auto-Replace Devices (Toggle) -->
					<div>
						<label :for="getIdKey('auto-replace-enabled')" class="mt-1 block text-sm font-medium leading-6 text-default">Auto-Replace Devices</label>
						<Switch v-model="poolConfig.settings!.autoReplace" :class="[poolConfig.settings!.autoReplace ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.settings!.autoReplace ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.settings!.autoReplace ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.settings!.autoReplace ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>
					
					<!-- Auto-TRIM (Toggle) -->
					<div>
						<label :for="getIdKey('auto-trim-enabled')" class="mt-1 block text-sm font-medium leading-6 text-default">Automatic TRIM</label>
						<Switch v-model="poolConfig.settings!.autoTrim" :class="[poolConfig.settings!.autoTrim ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.settings!.autoTrim ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.settings!.autoTrim ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.settings!.autoTrim ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>
					
					<!-- Forcefully Create Pool (Toggle) -->
					<div>
						<label :for="getIdKey('forcefully-create-pool')" class="mt-1 block text-sm font-medium leading-6 text-default">Forcefully Create Storage Pool</label>
						<Switch v-model="poolConfig.settings!.forceCreate" :class="[poolConfig.settings!.forceCreate ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.settings!.forceCreate ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.settings!.forceCreate ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.settings!.forceCreate ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>
				</template>
			</Accordion>

		</fieldset>
	</div>

	<!-- tab four: file system creation (so user does not have a naked pool) -->
	<!-- component has a toggle at the start so user can choose if they want to create a file system at pool creation, or not if they do in fact want a naked pool -->
	<div v-if=" props.tag ==='file-system'">
		<fieldset>
			<legend class="mb-1 text-base font-semibold leading-6 text-default">File System Settings</legend>
			<!-- Create a File System (Checkbox) -> Enables all fields underneath -->
			<div class="relative flex items-start">
				<div class="text-sm mr-3">
					<label :for="getIdKey('create-filesystem')" class="font-medium text-default">Create a File System?</label>
				</div>
				<div class="flex h-6 items-center">
					<input :id="getIdKey('create-filesystem')" v-model="poolConfig.createFileSystem" aria-describedby="create-filesystem" name="create-filesystem" type="checkbox" class="h-4 w-4 rounded border-default text-primary focus:ring-slate-600" />
				</div>
			</div>
			<FileSystem v-if="poolConfig.createFileSystem" ref="fileSystemConfiguration" idKey="file-system"/>
		</fieldset>
	</div>

	<!-- tab five: final tab - review all data selected -->
	<div v-if=" props.tag ==='review'">
		<fieldset>
			<legend class="mb-1 text-base font-semibold leading-6 text-default">Review Pool Details</legend>
			<ReviewTab/>
		</fieldset>
	</div>

</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
import { Switch } from '@headlessui/vue';

import Accordion from '../common/Accordion.vue';
import FileSystem from './FileSystem.vue';
import ReviewTab from './ReviewTab.vue';
import { newPool } from '../../scripts/pools';

interface PoolConfigProps {
	tag: string;
	idKey: string;
}

const props = defineProps<PoolConfigProps>();

const poolConfig = inject<Ref<PoolData>>('pool-config-data')!;
const fileSystemConfig = inject<Ref<FileSystemData>>('file-system-data')!;
const fileSystemConfiguration = ref();

const disks = inject<Ref<DiskData[]>>('disks')!;

//const isMirror = ref(false);

const nameFeedback = ref('');
const vDevFeedback = ref('');
const diskFeedback = ref('');

//computed property to determine which disks are in use and which ones are not in use and therefore available for selection
//This currently ties in to the disk selection UI elements and shows/hides the disks based on whether they are in use or not
//would like to change this so instead of hiding the in-use disks completely, simply grey them out or disable them from selection for better UI/UX
const vDevAvailDisks = computed<DiskData[][]>(() => {
	return poolConfig.value.vdevs.map((vdev, vdevIdx) => {
		const claimed = poolConfig.value.vdevs
		.filter((_, idx) => idx !== vdevIdx)
		.flatMap(vdev => vdev.selectedDisks);
		return disks.value.filter(disk => disk.usable && !claimed.includes(disk.name));
	});
});

//method for adding initial vdev with default values 
function initialVDev() {
	const vDevConfig: vDevData = {
		name: '',
		type: 'mirror',
		status: '',
		guid: '',
		stats: {},
		disks: [],
		selectedDisks: [],
	}

	poolConfig.value.vdevs.push(vDevConfig);
}

//method for adding additional vdev
function addVDev() {
	const vDevConfig: vDevData = {
		name: '',
		type: poolConfig.value.vdevs[0].type,
		status: '',
		guid: '',
		stats: {},
		disks: [],
		selectedDisks: [],
	}

  	poolConfig.value.vdevs.push(vDevConfig);
}

//method for validating pool name fits the criteria
const nameCheck = () => {
	let result = true;
	nameFeedback.value = '';
	
	if (poolConfig.value.name == '') {
		result = false;
		nameFeedback.value = 'Name cannot be empty.';
	} else if (poolConfig.value.name.match(/^[0-9]/) ) {
		result = false;
		nameFeedback.value = 'Name cannot begin with numbers.';
	} else if (poolConfig.value.name.match(/^[.]/ )) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a period (.).';
	} else if (poolConfig.value.name.match(/^[_]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with an underscore (_).';
	} else if (poolConfig.value.name.match(/^[-]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a hyphen (-).';
	} else if (poolConfig.value.name.match(/^[:]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a colon (:).';
	} else if (poolConfig.value.name.match(/^[ ]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with whitespace.';
	} else if (poolConfig.value.name.match(/[ ]$/)) {
		result = false;
		nameFeedback.value = 'Name cannot end with whitespace.';
	} else if (poolConfig.value.name.match(/^c[0-9]|^log|^mirror|^raidz|^raidz1|^raidz2|^raidz3|^spare/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a reserved name.';
	} else if (!poolConfig.value.name.match(/^[a-zA-Z0-9_.:-]*$/)) {
		result = false;
		nameFeedback.value = 'Name contains invalid characters.';
	} 
	return result;
}

//method for validating disk selection per vdev type
const diskCheck = () => {
	let result = true;
	diskFeedback.value = '';
	
	poolConfig.value.vdevs.forEach(vdev => {
		if (vdev.type == 'mirror' && vdev.selectedDisks.length < 2) {
		result = false;
		diskFeedback.value = 'Two or more Disks are required for Mirror.';
		} else if (vdev.type == 'raidz1' && vdev.selectedDisks.length < 2) {
		result = false;
		diskFeedback.value = 'Two or more Disks are required for RaidZ1.';
		} else if (vdev.type == 'raidz2' && vdev.selectedDisks.length < 3) {
		result = false;
		diskFeedback.value = 'Three or more Disks are required for RaidZ2.';
		} else if (vdev.type == 'raidz3' && vdev.selectedDisks.length < 4) {
		result = false;
		diskFeedback.value = 'Four or more Disks are required for RaidZ3.';
		// } else if (vdev.type == 'disk' && vdev.selectedDisks.length != 1) {
		// result = false;
		// diskFeedback.value = 'One Disk per Virtual Device.';
		} else if (vdev.type == 'log' && vdev.selectedDisks.length < 1) {
		result = false;
		diskFeedback.value = 'At least one Disk is required for Log.';
		} else if (vdev.type == 'cache' && vdev.selectedDisks.length < 1) {
		result = false;
		diskFeedback.value = 'At least one Disk is required for Cache.';
		} else if (vdev.type == 'special' && vdev.selectedDisks.length < 1) {
		result = false;
		diskFeedback.value = 'At least one Disk is required for Special.';
		} else if (vdev.type == 'spare' && vdev.selectedDisks.length < 1) {
		result = false;
		diskFeedback.value = 'At least one Disk is required for Spare.';
		} 
		else if (vdev.type == 'dedup' && vdev.selectedDisks.length < 1) {
		result = false;
		diskFeedback.value = 'At least one Disk is required for Dedup.';
		} 
	});
	return result;
}

//method for checking that there is at least 1 vdev selected
const vDevCheck = () => {
	let result = true;
	vDevFeedback.value = '';
	
	if (poolConfig.value.vdevs.length < 1) {
		result = false;
		vDevFeedback.value = 'At least one Virtual Device is required.';
	}
	return result;
}

//method for validating all tabs and allowing user to proceed if valid
const validateAndProceed = (tabTag: string): boolean => {
  if (tabTag === 'name-entry') {
	return nameCheck();
  } else if (tabTag == 'virtual-devices') {
	if (nameCheck()) {
		if (vDevCheck()) {
			return diskCheck();
		}
	}
  } else if (tabTag == 'pool-settings') {
	if (nameCheck()) {
		if (vDevCheck()) {
			if (diskCheck()) {
			return true;
			}
		}
	}
  } else if (tabTag == 'file-system') {
	if (nameCheck()) {
		if (vDevCheck()) {
			if (diskCheck()) {
			//fileSystemConfiguration.value.nameCheck();
			}
		}
	}
  } else if (tabTag == 'review') {
	if (nameCheck()) {
		if (vDevCheck()) {
			if (diskCheck()) {
				return true;
			}
		}
	}
  }
  return false;
}

//method for removing vdev
function removeVDev(index: number) {
  	poolConfig.value.vdevs = poolConfig.value.vdevs.filter((_, idx) => idx !== index) ?? [];
}


//convert readable data size to raw bytes
const convertSizeToBytes = (size) => {
	const sizes = ['B', 'KiB', 'MiB'];
	const [value, unit] = size.match(/(\d+\.?\d*)\s?(\w+)/i).slice(1);

	const index = sizes.findIndex((sizeUnit) => sizeUnit.toLowerCase() === unit.toLowerCase());
	const bytes = parseFloat(value) * Math.pow(1024, index);
	
	return bytes;
};

function isBoolOnOff(bool : boolean) {
	if (bool) {return 'on'} else {return 'off'}
}

function isBoolCompression(bool : boolean) {
	if (bool) {return 'lz4'} else {return 'off'}
}

const newPoolData  = inject<Ref<newPoolData>>('new-pool-data')!;
const newVDevDisks = ref<string[]>([]);

function fillNewPoolData() {
	newPoolData.value.name = poolConfig.value.name;
	newPoolData.value.vdevtype = poolConfig.value.vdevs[0].type;
	// poolConfig.value.vdevs[0].disks.forEach(disk => {
	// 	console.log("disk sd_path:");
	// 	console.log(disk.sd_path);
	// 	newVDevDisks.value.push(disk.sd_path);
	// });
	// newPoolData.value.disks = newVDevDisks.value;
	console.log(poolConfig.value.vdevs[0].disks);
	poolConfig.value.vdevs[0].selectedDisks.forEach(disk => 
		newPoolData.value.disks.push(disk)
	);
	newPoolData.value.autoexpand = isBoolOnOff(poolConfig.value.settings!.autoTrim);
	newPoolData.value.autoreplace = isBoolOnOff(poolConfig.value.settings!.autoReplace)
	newPoolData.value.autotrim = isBoolOnOff(poolConfig.value.settings!.autoTrim)
	newPoolData.value.compression = isBoolCompression(poolConfig.value.settings!.compression);
	newPoolData.value.recordsize = convertSizeToBytes(poolConfig.value.settings!.record);
	newPoolData.value.dedup = isBoolOnOff(poolConfig.value.settings!.deduplication)
}

const getIdKey = (name: string) => `${props.idKey}-${name}`;

if (poolConfig.value.vdevs.length < 1) initialVDev();

defineExpose({
	validateAndProceed,
	fillNewPoolData
});
</script>