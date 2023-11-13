<template>
	<!-- first tab: name entry -->
	<div v-if="props.tag ==='name-entry'">
		<legend class="mb-1 text-base font-semibold leading-6 text-default">Name this Pool</legend>
		<input type="text" @keydown.enter="props.navCallback" v-model="poolConfig.name" name="pool-name" :id="getIdKey('pool-name')" class="mt-1 block w-full input-textlike bg-default" placeholder="Pool Name" />
	</div>

  	<!-- second tab: vDev + disk selection -->
  	<div v-if="props.tag ==='virtual-devices'">
		<fieldset>
			<legend class="mb-1 text-base font-semibold leading-6 text-default">Create a Virtual Device</legend>
			
			<div v-for="(vDev, vDevIdx) in poolConfig.vdevs" :key="vDevIdx" class="my-1 py-1">
				<!-- Virtual Device (Select) -->
				<div>
					<label :for="getIdKey('virtual-device')" class="block text-sm font-medium leading-6 text-default">Type</label>
					<!-- if first VDev, always either DISK, MIRROR, RAIDZ1-3 -->
					<!-- if NOT first VDev, always either CACHE, LOG, SPECIAL, SPARE, DEDUP, or TYPE OF FIRST VDEV -->
					<select :id="getIdKey('virtual-device')" v-model="poolConfig.vdevs[vDevIdx].type" name="virtual-device" class="text-default bg-default mt-1 block w-full input-textlike sm:text-sm sm:leading-6">
						<option v-if="vDevIdx === 0" value="disk">Disk</option>
						<option v-if="vDevIdx === 0" value="mirror">Mirror</option>
						<option v-if="vDevIdx === 0" value="raidz1">RaidZ1</option>
						<option v-if="vDevIdx === 0" value="raidz2">RaidZ2</option>
						<option v-if="vDevIdx === 0" value="raidz3">RaidZ3</option>
						<option v-if="vDevIdx !== 0" :value="poolConfig.vdevs[0].type">{{upperCaseWord(poolConfig.vdevs[vDevIdx].type)}}</option>
						<option v-if="vDevIdx !== 0" value="cache">Cache</option>
						<option v-if="vDevIdx !== 0" value="log">Log</option> 
						<option v-if="vDevIdx !== 0" value="special">Special</option>
						<option v-if="vDevIdx !== 0" value="spare">Spare</option>
						<option v-if="vDevIdx !== 0" value="dedup">Dedup</option>
					</select>
				</div>

				<!-- Disk ID (Select) -->
				<div>
					<label :for="getIdKey('disk-identifier')" class="block text-sm font-medium leading-6 text-default">Disk Identifier</label>
					<select :id="getIdKey('disk-identifier')" v-model="poolConfig.vdevs[vDevIdx].diskIdentifier" name="disk-identifier" class="text-default bg-default mt-1 block w-full input-textlike sm:text-sm sm:leading-6">
						<option value="sd_path">Block Device</option>
						<!-- <option value="">Disk/WWN</option> -->
						<option value="phy_path">Hardware Path</option>
						<option value="vdev_path">Device Alias</option>
					</select>
				</div>

				<!-- Disk selection, shows disks that are not in use and as they are selected it hides them from any additional VDevs so they cannot be selected twice -->
				<label :for="getIdKey('available-disk-list')" class="my-1 block text-sm font-medium leading-6 text-default">Select Disks</label>
				<ul :id="getIdKey('available-disk-list')" role="list" class="flex flex-row flex-wrap gap-2">
					<li v-for="(disk, diskIdx) in vDevAvailDisks[vDevIdx]" :key="diskIdx" class="my-2">
						<button class="flex min-w-fit w-full h-full border border-default rounded-lg"
						:class="diskCardClass(disk.name, vDevIdx)">
							<label :for="getIdKey(`vdev-${vDevIdx}-disk-${diskIdx}`)" class="flex flex-col w-full py-4 mx-2 text-sm gap-0.5">
								<input :id="getIdKey(`vdev-${vDevIdx}-disk-${diskIdx}`)" v-model="poolConfig.vdevs[vDevIdx].selectedDisks" type="checkbox" :value="`${disk.name}`" :name="`disk-${disk.name}`"
								class="w-4 h-4 text-success bg-well border-default rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2"/>	
								<p class="truncate text-sm font-medium text-default">{{ disk.name }}</p>
								<p class="mt-1 truncate text-sm text-default">{{ disk.type }}</p>
								<p class="mt-1 truncate text-sm text-default">{{ disk[poolConfig.vdevs[vDevIdx].diskIdentifier!] }}</p>
								<p class="mt-1 truncate text-sm text-default">Capacity: {{ disk.capacity }}</p>
							</label>
						</button>
					</li>
				</ul>

				<!-- buttons to add/remove vdevs -->
				<div class="button-group-row mt-2">
					<!-- <button :id="getIdKey('add-vdev')" class="btn btn-primary object-right justify-end" @click="addVDev()">Add VDev</button> -->
					<button v-if="poolConfig.vdevs.length > 0" :id="getIdKey('remove-vdev')" class="btn btn-primary object-right justify-start mt-0.5" @click="removeVDev(vDevIdx)">Remove VDev</button>
					
					<!-- If (Log, Special, Dedup) -->
					<!-- If secondary VDev is LOG or SPECIAL or DEDUP, have option for them to be MIRROR also -->
					<!-- If Primary VDev is MIRROR or RAIDZ(x) then SPECIAL, LOG and DEDUP must be MIRROR -->
					<div v-if="poolConfig.vdevs[vDevIdx].type == 'log' || poolConfig.vdevs[vDevIdx].type == 'special' || poolConfig.vdevs[vDevIdx].type == 'dedup'" class="flex flex-row">
						<label :for="getIdKey('mirror-enabled')" class="mt-2 mr-2 block text-sm font-medium leading-6 text-default">Mirror ({{ upperCaseWord(poolConfig.vdevs[vDevIdx].type) }})</label>

						<Switch v-model="poolConfig.vdevs[vDevIdx].isMirror" :class="[poolConfig.vdevs[vDevIdx].isMirror ? 'bg-primary' : 'bg-accent', 'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[poolConfig.vdevs[vDevIdx].isMirror ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[poolConfig.vdevs[vDevIdx].isMirror ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[poolConfig.vdevs[vDevIdx].isMirror ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>  
				</div>
			</div>
			
				<!-- if user accidentally removes all vdevs, shows add vdev button to add another (would like to change this so its impossible to remove 1st vDev and ensure there is always at least 1) -->
			<div v-if="poolConfig.vdevs.length < 1" class="button-group-row">
				<button :id="getIdKey('add-vdev')" class="btn btn-primary object-right justify-end" @click="initialVDev()">Add VDev</button>
			</div>
		</fieldset>
	</div>

	<!-- third tab: pool settings + advanced settings -->
	<div v-if="props.tag ==='pool-settings'">
		<fieldset>
			<legend class="mb-1 text-base font-semibold leading-6 text-default">Pool Settings</legend>

			<!-- Sector Size (Select) -->
			<div>
				<label :for="getIdKey('sector-size')" class="block text-sm font-medium leading-6 text-default">Sector Size</label>
				<select :id="getIdKey('sector-size')" v-model="poolConfig.properties.sector" name="sector-size" class="text-default bg-default mt-1 block w-full py-1.5 pl-3 pr-10 input-textlike sm:text-sm sm:leading-6">
					<option value="auto">Auto Detect</option>
					<option value="9">512 B</option>
					<option value="12">4 KiB</option>
					<option value="13">8 KiB</option>
					<option value="14">16 KiB</option>
					<option value="15">32 KiB</option>
					<option value="16">64 KiB</option>
				</select>
			</div>

			<!-- Record Size (Select) -->
			<div>
				<label :for="getIdKey('record-size')" class="block text-sm font-medium leading-6 text-default">Record Size</label>
				<select :id="getIdKey('record-size')" v-model="poolConfig.properties.record" name="record-size" class="text-default bg-default mt-1 block w-full py-1.5 pl-3 pr-10 input-textlike sm:text-sm sm:leading-6">
					<option value="512b">512 B</option>
					<option value="4kib">4 KiB</option>
					<option value="8kib">8 KiB</option>
					<option value="16kib">16 KiB</option>
					<option value="32kib">32 KiB</option>
					<option value="64kib">64 KiB</option>
					<option value="128kib">128 KiB</option>
					<option value="256kib">256 KiB</option>
					<option value="512kib">512 KiB</option>
					<option value="1mib">1 MiB</option>
				</select>
			</div>
			
			<!-- LZ4 Compression (Toggle) -->
			<div>
				<label :for="getIdKey('lz4-enabled')" class="mt-1 block text-sm font-medium leading-6 text-default">LZ4 Compression</label>
				<Switch :id="getIdKey('lz4-enabled')" v-model="poolConfig.properties.compression" :class="[poolConfig.properties.compression ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
					<span class="sr-only">Use setting</span>
					<span :class="[poolConfig.properties.compression ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
						<span :class="[poolConfig.properties.compression ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
							<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
								<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</span>
						<span :class="[poolConfig.properties.compression ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
							<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
								<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
							</svg>
						</span>
					</span>
				</Switch>
			</div>

			<!-- Advanced Settings (hidden under accordion for better UI/UX) -->
			<Accordion :wholeBtn="true" :btnColor="'bg-well'" :gridSize="'grid-cols-8'" :btnColSpan="'col-span-8'" :titleColSpan="'col-span-8'" :contentColSpan="'col-span-8'" :isOpen="false" class="mt-2 -ml-1 bg-well text-default">
				<template v-slot:title>
					<div class="mt-1">
						<span class="ml-3"><b>Advanced Settings</b></span>
					</div>
					</template>
				<template v-slot:content>
					<div class="bg-default rounded-md my-2 py-2 mx-2">

						<!-- Deduplication (Toggle) -->
						<div class="ml-3">
							<label :for="getIdKey('deduplication-enabled')" class="mt-1 block text-sm font-medium leading-6 text-default">Deduplication</label>
							<Switch :id="getIdKey('deduplication-enabled')" v-model="poolConfig.properties.deduplication" :class="[poolConfig.properties.deduplication ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
								<span class="sr-only">Use setting</span>
								<span :class="[poolConfig.properties.deduplication ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
									<span :class="[poolConfig.properties.deduplication ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
										<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
											<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
										</svg>
									</span>
									<span :class="[poolConfig.properties.deduplication ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
										<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
											<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
										</svg>
									</span>
								</span>
							</Switch>
						</div>

						<!-- Refreservation (Slider) -->
						<div class="ml-3">
							<label :for="getIdKey('steps-range')" class="mt-1 block text-sm font-medium text-default">Refreservation</label>
							<div class="flex flex-row">
								<input :id="getIdKey('steps-range')" v-model="poolConfig.properties.refreservationPercent" type="range" min="0" max="20" value="10" step="1" class="text-default mt-5 w-3/4 h-2 bg-accent rounded-lg appearance-none cursor-pointer ">
								<input :id="getIdKey('steps-range')" v-model="poolConfig.properties.refreservationPercent" type="number" min="0" max="20" value="10" class="text-default bg-default mt-1 w-fit block py-1.5 px-1.5 ml-2 text-default placeholder:text-muted input-textlike sm:text-sm sm:leading-6"/>
								<p class="mt-3">%</p>
							</div>
						</div>

						<!-- Auto-Expand Pool (Toggle) -->
						<div class="ml-3">
							<label :for="getIdKey('auto-expand-enabled')" class="mt-1 block text-sm font-medium leading-6 text-default">Auto-Expand Pool (When Larger Devices are Added)</label>
							<Switch v-model="poolConfig.properties.autoExpand" :class="[poolConfig.properties.autoExpand ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
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
						
						<!-- Auto-Replace Devices (Toggle) -->
						<div class="ml-3">
							<label :for="getIdKey('auto-replace-enabled')" class="mt-1 block text-sm font-medium leading-6 text-default">Auto-Replace Devices</label>
							<Switch v-model="poolConfig.properties.autoReplace" :class="[poolConfig.properties.autoReplace ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
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
						
						<!-- Auto-TRIM (Toggle) -->
						<div class="ml-3">
							<label :for="getIdKey('auto-trim-enabled')" class="mt-1 block text-sm font-medium leading-6 text-default">Automatic TRIM</label>
							<Switch v-model="poolConfig.properties.autoTrim" :class="[poolConfig.properties.autoTrim ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
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
					</div>	
				</template>
			</Accordion>

		</fieldset>
	</div>

	<!-- tab four: file system creation (so user does not have a naked pool) -->
	<!-- component has a toggle so user can choose if they want to create a file system at pool creation, or not if they do in fact want a naked pool -->
	<div v-show="props.tag ==='file-system'">
		<fieldset>
			<legend class="mb-1 text-base font-semibold leading-6 text-default">File System Settings</legend>

			<!-- Create a File System (Checkbox) -> Enables all fields underneath -->
			<button :class="createFileSystemCardClass(poolConfig.createFileSystem!)" 
			class="box-border rounded-lg shadow-md focus:outline-none focus:ring-0 w-full h-full bg-45d mb-2">
				<label :for="getIdKey('create-filesystem')" :class="createFileSystemCardClass(poolConfig.createFileSystem!)" 
				class="block py-3 w-full h-full font-medium text-default justify-center rounded">
					Create a File System?
					<input :id="getIdKey('create-filesystem')" v-model="poolConfig.createFileSystem" aria-describedby="create-filesystem" name="create-filesystem" type="checkbox" class="ml-2 h-4 w-4 rounded text-success"/>
				</label>
			</button>

			<FileSystem v-show="poolConfig.createFileSystem" ref="fsConfig" idKey="file-system" :isStandalone="false" />
			
		</fieldset>
	</div>

	<!-- tab five: final tab - review all data selected -->
	<div v-if="props.tag ==='review'">
		<fieldset>
			<ReviewTab/>
		</fieldset>
	</div>

</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch, onUpdated, onMounted } from 'vue';
import { Switch } from '@headlessui/vue';
import { isBoolOnOff, convertSizeToBytes, upperCaseWord, isBoolCompression } from '../../composables/helpers';
import Accordion from '../common/Accordion.vue';
import FileSystem from './FileSystem.vue';
import ReviewTab from './ReviewTab.vue';

interface PoolConfigProps {
	tag: string;
	idKey: string;
	navCallback: NavigationCallback;
}

const props = defineProps<PoolConfigProps>();

const poolConfig = inject<Ref<PoolData>>('pool-config-data')!;
const allPools = inject<Ref<PoolData[]>>('pools')!;
const fileSystemConfig = inject<Ref<FileSystemData>>('file-system-data')!;

const scanObjectGroup = inject<Ref<PoolScanObjectGroup>>('scan-object-group')!;
const poolDiskStats = inject<Ref<PoolDiskStats>>('pool-disk-stats')!;
	
const disks = inject<Ref<DiskData[]>>('disks')!;

const nameFeedback = inject<Ref<string>>('feedback-name')!;
const vDevFeedback = inject<Ref<string>>('feedback-vdev')!;
const diskFeedback = inject<Ref<string>>('feedback-disk')!;
const diskSizeFeedback = inject<Ref<string>>('feedback-disk-size')!;
const isProperReplicationFeedback = inject<Ref<string>>('feedback-replication-level')!;

const diskIdentifier = ref<DiskIdentifier>('vdev_path');

//computed property to determine which disks are in use and which ones are not in use and therefore available for selection
const vDevAvailDisks = computed<DiskData[][]>(() => {
	return poolConfig.value.vdevs.map((vdev, vdevIdx) => {
		const claimed = poolConfig.value.vdevs
		.filter((_, idx) => idx !== vdevIdx)
		.flatMap(vdev => vdev.selectedDisks);
		return disks.value.filter(disk => !isDiskTaken.value(disk.name) && !claimed.includes(disk.name));
	});
});

const isDiskTaken = computed(() => (diskName) => {
	for (const poolName in poolDiskStats.value) {
		if (poolDiskStats.value.hasOwnProperty(poolName)) {
			const pool = poolDiskStats.value[poolName];
			if (Array.isArray(pool)) {
				for (const disk of pool) {
					if (disk.name === diskName) {
						//disk belongs to a pool
						return true;
					}
				}
			}
		}
	}
	//disk does not belong to a pool
	return false;
});

// //setting default values for file system object
// const fileSystemConfig = ref<FileSystemData>();

//change color of disk when selected
const diskCardClass = (diskName, vDevIdx) => {
  const isSelected = poolConfig.value.vdevs[vDevIdx].selectedDisks.includes(diskName);
  return isSelected ? 'bg-green-300 dark:bg-green-700' : '';
};

const createFileSystemCardClass = (createFileSystem : boolean) => {
	const isCreateFS = createFileSystem;
	return isCreateFS ? 'bg-green-300 dark:bg-green-700' : '';
};

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
		diskIdentifier: 'vdev_path',
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
		diskIdentifier: 'vdev_path',
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
	} else if (nameExists()) {
		result = false;
		nameFeedback.value = 'A pool with that name already exists.';
	}
	return result;
}

function nameExists() {
  return allPools.value.some((pool) => {
    return poolConfig.value.name === pool.name;
  });
}

const replicationLevelCheck = () => {
	let result = true;
	isProperReplicationFeedback.value = '';

	poolConfig.value.vdevs.forEach(vDev => {
		if ((vDev.type == 'dedup' || vDev.type == 'special') && poolConfig.value.vdevs[0].type != 'disk' && !poolConfig.value.properties.forceCreate && !vDev.isMirror) {
			result = false;
			isProperReplicationFeedback.value = 'Mismatched replication level. Forcefully create to override.';
		} else if (vDev.isMirror && (vDev.type == 'special' || vDev.type == 'dedup' || vDev.type == 'log') && vDev.selectedDisks.length < 2) {
			result = false;
			isProperReplicationFeedback.value = `Two or more Disks are required for Mirror (${upperCaseWord(vDev.type)}).`;
		}
	});

	return result;
}

const diskSizeMatch = () => {
	let result = true;
	diskSizeFeedback.value = '';

	if (poolConfig.value.properties.forceCreate) {
		return true;
	}

	poolConfig.value.vdevs.forEach(vDev => {
		let previousCapacity = 0;

		vDev.selectedDisks.forEach(selDisk => {
			const disk = disks.value.find(fullDisk => fullDisk.name == selDisk);
			
			if (disk) {
				const currentCapacity = convertSizeToBytes(disk.capacity);

				if (previousCapacity != 0 && currentCapacity != previousCapacity) {
					result = false;
					diskSizeFeedback.value = `Mirror contains devices of different sizes. Forcefully create to override.\n`;
				}

				previousCapacity = currentCapacity;
			}
		});
	});

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
		} else if (vdev.type == 'disk' && vdev.selectedDisks.length < 1) {
			result = false;
			diskFeedback.value = 'At least one Disk is required.';
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
		} else if (vdev.type == 'dedup' && vdev.selectedDisks.length < 1) {
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
				if (diskCheck() && diskSizeMatch()) {
					return replicationLevelCheck();
				}
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
					if (poolConfig.value.createFileSystem!) {
						if (fsConfig.value.nameCheck(fileSystemConfig.value)) {
							return true;
						}
					}
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

const newPoolData  = inject<Ref<newPoolData>>('new-pool-data')!;
const newVDevs = ref<newVDevData[]>([]);
const newVDevDisks = ref<string[]>([]);

// const phyPathRegex = `\/dev\/disk\/by-path\/[0-9a-zA-Z:.\-]+(?:-part[0-9]+)?$`;
// const sdPathRegex = `\/dev\/sd[a-z][0-9]+$`;
// const vDevPathRegex = `\/dev\/disk\/by-vdev\/[0-9\-]+(?:-part[0-9]+)?$`;
const phyPathPrefix = '/dev/disk/by-path/';
const sdPathPrefix = '/dev/';
const newDisk = ref();
const diskName = ref('');
const diskPath = ref('');

function fillNewPoolData() {
	newPoolData.value.name = poolConfig.value.name;
	poolConfig.value.vdevs.forEach(vDev => {
		const newVDev : newVDevData = {
			type: '',
			disks: [],
		}
		newVDev.type = vDev.type;
		newVDev.isMirror = vDev.isMirror;

		vDev.selectedDisks.forEach(selectedDisk => {
			newDisk.value = disks.value.find(disk => disk.name === selectedDisk);
			switch (vDev.diskIdentifier!) {
				case 'vdev_path':
					diskPath.value = newDisk.value!.vdev_path;
					diskName.value = selectedDisk;
					break;
				case 'phy_path':
					diskPath.value = newDisk.value!.phy_path;
					diskName.value = diskPath.value.replace(phyPathPrefix, '');
					break;
				case 'sd_path':
					diskPath.value = newDisk.value!.sd_path;
					diskName.value = diskPath.value.replace(sdPathPrefix, '');
					break;	
				default:
					console.log('error with selectedDisks/diskIdentifier'); 
					break;
			}
			//newVDevDisks.value.push(selectedDisk);
			newVDevDisks.value.push(diskName.value);
		});
		newVDev.disks = newVDevDisks.value;
		newVDevDisks.value = [];
		newVDevs.value.push(newVDev);
	});
	newPoolData.value.vdevs = newVDevs.value;
	newPoolData.value.autoexpand = isBoolOnOff(poolConfig.value.properties.autoTrim);
	newPoolData.value.autoreplace = isBoolOnOff(poolConfig.value.properties.autoReplace);
	newPoolData.value.autotrim = isBoolOnOff(poolConfig.value.properties.autoTrim);
	newPoolData.value.compression = isBoolCompression(poolConfig.value.properties.compression);
	newPoolData.value.recordsize = convertSizeToBytes(poolConfig.value.properties.record);
	newPoolData.value.dedup = isBoolOnOff(poolConfig.value.properties.deduplication);
	newPoolData.value.forceCreate = poolConfig.value.properties.forceCreate;
	newPoolData.value.refreservationPercent = poolConfig.value.properties.refreservationPercent!;
	newPoolData.value.sectorsize = Number(poolConfig.value.properties.sector!);

	console.log("newPoolData sent:", newPoolData);
}

const fsConfig = ref();

async function createNewFileSystem() {

	console.log('fsConfig', fsConfig.value);

	await fsConfig.value.newFileSystemInPoolWizard();
}

const getIdKey = (name: string) => `${props.idKey}-${name}`;

if (poolConfig.value.vdevs.length < 1) initialVDev();

defineExpose({
	validateAndProceed,
	fillNewPoolData,
	addVDev,
	createNewFileSystem,
});


onMounted(() => {
	console.log('fsConfig on PoolConfig mount', fsConfig.value);
});

onUpdated(() => {
	console.log('fsConfig on PoolConfig update', fsConfig.value);
});
</script>