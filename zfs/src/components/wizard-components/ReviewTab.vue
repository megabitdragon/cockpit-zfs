<template>
	<div>
		<legend v-if="!finishPressed && !creatingPool && !poolCreated" class="mb-1 text-base font-semibold leading-6 text-default">Review Pool Details</legend>
		
		<div class="grid grid-cols-1 gap-1">
			<div v-if="!finishPressed && !creatingPool && !poolCreated" class="">
				<Card :bgColor="'bg-well'" :titleSection="true" :contentSection="true" :footerSection="true" class="mt-2 mb-4 min-w-fit overflow-visible rounded-lg border border-default text-default">
					<template v-slot:title>
						<div>
							<p class="text-md">Pool Name: <b>{{ poolConfig.name }}</b></p>	
						</div>
					</template>
					<template v-slot:content>
						<div>
							<p>Compression: <b>{{ isBoolCompression(poolConfig.properties.compression).toUpperCase() }}</b></p>
							<p>Sector Size: <b>{{ getValue('sector', poolConfig.properties.sector) }}</b></p>
							<p>Record Size: <b>{{ getValue('record', poolConfig.properties.record) }}</b></p>
							<p class="mt-1 border rounded-lg border-default">
								<Accordion :wholeBtn="true" :btnColor="'bg-default'" :gridSize="'grid-cols-2'" :btnColSpan="'col-span-2'" :titleColSpan="'col-span-2'" :contentColSpan="'col-span-2'" :isOpen="false" class="bg-default text-default rounded-lg">
									<template v-slot:title>
										<p class="bg-default ml-2 mt-1 rounded-lg">Advanced Settings</p>
									</template>
									<template v-slot:content>
										<div class="p-2 rounded-lg">
											<p>Deduplication: <b>{{ upperCaseWord(isBoolOnOff(poolConfig.properties.deduplication)) }}</b></p>
											<p>Auto-Expand: <b>{{ upperCaseWord(isBoolOnOff(poolConfig.properties.autoExpand)) }}</b></p>
											<p>Auto-Replace: <b>{{ upperCaseWord(isBoolOnOff(poolConfig.properties.autoReplace)) }}</b></p>
											<p>Auto-TRIM: <b>{{ upperCaseWord(isBoolOnOff(poolConfig.properties.autoTrim)) }}</b></p>
										</div>
									</template>
								</Accordion>
							</p>
						</div>
					</template>
					<template v-slot:footer>
						<Accordion :wholeBtn="true" :btnColor="'bg-default'" :gridSize="'grid-cols-2'" :btnColSpan="'col-span-2'" :titleColSpan="'col-span-2'" :contentColSpan="'col-span-2'" :isOpen="false" class="bg-default text-default border rounded-lg border-default">
							<template v-slot:title>
								<div>
									<p class="bg-default ml-2 mt-1 rounded-lg">Virtual Devices <b>({{ poolConfig.vdevs.length }})</b></p>
								</div>
							</template>
							<template v-slot:content>							
								<Card v-for="vDev, vDevIdx in poolConfig.vdevs" :key="vDevIdx" :bgColor="'bg-default'" :titleSection="true" :contentSection="false" :footerSection="true" class="rounded-lg text-default">
									<template v-slot:title>
										<div class="rounded-lg">
											<p>Type: <b>{{ upperCaseWord(vDev.type) }}</b></p>
										</div>
									</template>
									<template v-slot:footer>
										<div class="rounded-lg">
											<p>
												Disks (<b>{{ vDev.selectedDisks.length }}</b>): <b>| </b>
												<b v-for="disk, diskIdx in vDev.selectedDisks" :key="diskIdx">
													{{ disk }} |
												</b>
											</p>
										</div>											
									</template>
								</Card>							
							</template>
						</Accordion>
					</template>
				</Card>
			</div>
			<div v-if="finishPressed && creatingPool && !poolCreated" class="">
				<div class="grid justify-center justify-items-center">
					<legend class="text-lg text-default">Creating Pool...</legend>
					<LoadingSpinner :width="'w-28'" :height="'h-28'" :baseColor="'text-gray-200'" :fillColor="'fill-green-500'" class="font-semibold text-lg my-0.5"/>
				</div>
			</div>
			<div v-if="finishPressed && !creatingPool && poolCreated" class="">
				<div class="grid justify-center justify-items-center">
					<legend class="text-lg text-success">Pool Created!</legend>
					<img class="aspect-square w-28 h-28 min-w-28 min-h-28" src="../../../public/icons/success.svg">
				</div>
			</div>
		</div>



		<div class="grid grid-cols-4 gap-1">
			<div class="col-start-1 row-start-1 col-span-2">
				
			</div>
			<div class="col-start-3 row-start-1 col-span-2">

				<div>
					<div>
					
					</div>
				</div>

				<div v-if="finishPressed && !creatingPool && poolCreated">

				</div>
			</div>

			<!--
			<div v-if="pools.length < 1 && poolsLoaded == false" class="grid grid-cols-4 gap-2 justify-items-center">
				<LoadingSpinner :width="'w-10'" :height="'h-10'" :baseColor="'text-gray-200'" :fillColor="'fill-slate-500'" class="col-span-4 my-2"/>
			</div>


			 -->

			<div v-if="poolConfig.createFileSystem!" class="col-start-1 row-start-2 col-span-2 rounded-lg">
				<Card :bgColor="'bg-well'" :titleSection="true" :contentSection="false" :footerSection="true" class="mt-2 mb-4 min-w-fit overflow-visible rounded-lg border border-default text-default">
					<template v-slot:title>
						<div class="rounded-lg">						
							<p>File System Name: <b>{{ fileSystemData.name }}</b></p>
						</div>
					</template>
					<template v-slot:footer>
						<div>
							<p>Quota: <b>{{ convertBytesToSize(fileSystemData.properties.quota.raw) }}</b></p>
							<p>Read Only: <b>{{ upperCaseWord(isBoolOnOff(fileSystemData.properties.isReadOnly!)) }}</b></p>	
							<p class="mt-1 border rounded-lg border-default">
								<Accordion :wholeBtn="true" :btnColor="'bg-default'" :gridSize="'grid-cols-2'" :btnColSpan="'col-span-2'" :titleColSpan="'col-span-2'" :contentColSpan="'col-span-2'" :isOpen="false" class="bg-default text-default">					
									<template v-slot:title>
										<p class="bg-default ml-2 mt-1">Settings: <b v-if="fileSystemData.inherit">Inherited</b></p>
									</template>
									<template v-slot:content>
										<div v-if="fileSystemData.inherit" class="p-2 rounded-lg">
											<p>Compression: <b>{{ upperCaseWord(fileSystemData.properties.compression) }} ({{ isBoolCompression(poolConfig.properties.compression).toUpperCase() }})</b></p>
											<p>Deduplication: <b>{{ upperCaseWord(fileSystemData.properties.deduplication) }} ({{ upperCaseWord(isBoolOnOff(poolConfig.properties.deduplication)) }})</b></p>
											<p>Record Size: <b>{{ upperCaseWord(fileSystemData.properties.recordSize) }} ({{ getValue('record', poolConfig.properties.record) }})</b></p>
											<p>Access Time: <b>{{ upperCaseWord(fileSystemData.properties.accessTime) }} (On)</b></p>
											<p>Case Sensitivity: <b>{{ upperCaseWord(fileSystemData.properties.caseSensitivity) }} (Sensitive)</b></p>
											<p>DNode Size: <b>{{ upperCaseWord(fileSystemData.properties.dNodeSize) }} (Legacy)</b></p>
											<p>Extended Attributes: <b>{{ upperCaseWord(fileSystemData.properties.extendedAttributes) }} (System Attribute)</b></p>
										</div>
										<div v-else class="p-2 rounded-lg">
											<p>Compression: <b>{{ checkInheritance('compression', fileSystemData.properties.compression, poolConfig) }}</b></p>
											<p>Deduplication: <b>{{ checkInheritance('dedup', fileSystemData.properties.deduplication, poolConfig) }}</b></p>
											<p>Record Size: <b>{{ checkInheritance('record', fileSystemData.properties.recordSize, poolConfig) }}</b></p>
											<p>Access Time: <b>{{ checkInheritance('atime', fileSystemData.properties.accessTime, poolConfig) }}</b></p>
											<p>Case Sensitivity: <b>{{ checkInheritance('case', fileSystemData.properties.caseSensitivity, poolConfig) }}</b></p>
											<p>DNode Size: <b>{{ checkInheritance('dnode', fileSystemData.properties.dNodeSize, poolConfig) }}</b></p>
											<p>Extended Attributes: <b>{{ checkInheritance('xattr', fileSystemData.properties.extendedAttributes, poolConfig) }}</b></p>
										</div>
									</template>
								</Accordion>
							</p>					
						</div>
					</template>
				</Card>
				
			</div>
			<div v-if="poolConfig.createFileSystem!" class="col-start-3 row-start-2 col-span-2">
				<!-- <div v-if="finishPressed && creatingFilesystem && !filesystemCreated" class="bg-well mt-2 mb-4 min-w-fit overflow-visible rounded-lg border border-default text-default">				
					<LoadingSpinner :width="'w-10'" :height="'h-10'" :baseColor="'text-default'" :fillColor="'bg-secondary'"/>			
				</div>
				<div v-if="finishPressed && !creatingFilesystem && filesystemCreated">

				</div> -->
			</div>
		</div>
		
	</div>


</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
import Card from '../common/Card.vue';
import Accordion from '../common/Accordion.vue';
import { isBoolOnOff, isBoolCompression, convertBytesToSize, upperCaseWord, getValue, checkInheritance } from '../../composables/helpers';
import LoadingSpinner from '../common/LoadingSpinner.vue';

const poolConfig = inject<PoolData>("pool-config-data")!;
const fileSystemData = inject<Ref<FileSystemData>>('file-system-data')!;

const finishPressed = inject<Ref<boolean>>('finish-pressed')!;
const creatingPool = inject<Ref<boolean>>('creating-pool')!;
const poolCreated = inject<Ref<boolean>>('pool-created')!;
const creatingFilesystem = inject<Ref<boolean>>('creating-filesystem')!;
const filesystemCreated = inject<Ref<boolean>>('filesystem-created')!;

</script>