<template>
	<div>
		<div class="grid grid-cols grid-cols-4 gap-1">
			<div class="col-start-1 row-start-1 col-span-2">
				<Card :bgColor="'bg-well'" :titleSection="true" :contentSection="true" :footerSection="true" class="mt-2 mb-4 min-w-fit overflow-visible rounded-md border border-default text-default">
					<template v-slot:title>
						<p>Pool Name: <b>{{ poolConfig.name }}</b></p>
					</template>
					<template v-slot:content>
						<p>Compression: <b>{{ isBoolCompression(poolConfig.properties.compression).toUpperCase() }}</b></p>
						<p>Sector Size: <b>{{ getValue('sector', poolConfig.properties.sector) }}</b></p>
						<p>Record Size: <b>{{ getValue('record', poolConfig.properties.record) }}</b></p>
						<p class="mt-1 border rounded-md border-default">
							<Accordion :wholeBtn="true" :btnColor="'bg-default'" :gridSize="'grid-cols-2'" :btnColSpan="'col-span-2'" :titleColSpan="'col-span-2'" :contentColSpan="'col-span-2'" :isOpen="false" class="bg-default text-default">
								<template v-slot:title>
									<p class="bg-default ml-2 mt-1">Advanced Settings</p>
								</template>
								<template v-slot:content>
									<div class="p-2">
										<p>Deduplication: <b>{{ upperCaseWord(isBoolOnOff(poolConfig.properties.deduplication)) }}</b></p>
										<p>Auto-Expand: <b>{{ upperCaseWord(isBoolOnOff(poolConfig.properties.autoExpand)) }}</b></p>
										<p>Auto-Replace: <b>{{ upperCaseWord(isBoolOnOff(poolConfig.properties.autoReplace)) }}</b></p>
										<p>Auto-TRIM: <b>{{ upperCaseWord(isBoolOnOff(poolConfig.properties.autoTrim)) }}</b></p>
									</div>
								</template>
							</Accordion>
						</p>
					</template>
					<template v-slot:footer>
						<Accordion :wholeBtn="true" :btnColor="'bg-default'" :gridSize="'grid-cols-2'" :btnColSpan="'col-span-2'" :titleColSpan="'col-span-2'" :contentColSpan="'col-span-2'" :isOpen="false" class="bg-default text-default">
							<template v-slot:title>
								<p class="bg-default ml-2 mt-1">Virtual Devices <b>({{ poolConfig.vdevs.length }})</b></p>
							</template>
							<template v-slot:content>
								<div v-for="vDev, vDevIdx in poolConfig.vdevs" :key="vDevIdx">
									<Card :bgColor="'bg-default'" :titleSection="false" :contentSection="true" :footerSection="true" class="text-default">
										<!-- <template v-slot:title>
											<p><b>{{ vDev.name }}</b></p>
										</template> -->
										<template v-slot:content>
											<p>Type: <b>{{ upperCaseWord(vDev.type) }}</b></p>
										</template>
										<template v-slot:footer>
											<p>Disks: <b>| </b>
												<b v-for="disk, diskIdx in vDev.selectedDisks" :key="diskIdx">
													{{ disk }} |
												</b>
											</p>
										</template>
									</Card>
								</div>
							</template>
						</Accordion>
					</template>
				</Card>
			</div>
			<div v-if="poolConfig.createFileSystem!" class="col-start-1 row-start-2 col-span-2">
				<Card :bgColor="'bg-well'" :titleSection="true" :contentSection="true" :footerSection="true" class="mt-2 mb-4 min-w-fit overflow-visible rounded-md border border-default text-default">
					<template v-slot:title>
						<p>File System Name: <b>{{ fileSystemData.name }}</b></p>
					</template>
					<template v-slot:content>
						<Accordion :wholeBtn="true" :btnColor="'bg-default'" :gridSize="'grid-cols-2'" :btnColSpan="'col-span-2'" :titleColSpan="'col-span-2'" :contentColSpan="'col-span-2'" :isOpen="false" class="bg-well text-default">					
							<template v-slot:title>
								<p class="ml-2 mt-1">Settings: <b v-if="fileSystemData.inherit">Inherited</b></p>
							</template>
							<template v-slot:content>
								<div v-if="fileSystemData.inherit">
									<p>Compression: <b>{{ upperCaseWord(fileSystemData.properties.compression) }} ({{ isBoolCompression(poolConfig.properties.compression).toUpperCase() }})</b></p>
									<p>Deduplication: <b>{{ upperCaseWord(fileSystemData.properties.deduplication) }} ({{ isBoolOnOff(poolConfig.properties.deduplication) }})</b></p>
									<p>Record Size: <b>{{ upperCaseWord(fileSystemData.properties.recordSize) }} ({{ getValue('record', poolConfig.properties.record) }})</b></p>
									<p>Access Time: <b>{{ upperCaseWord(fileSystemData.properties.accessTime) }} (On)</b></p>
									<p>Case Sensitivity: <b>{{ upperCaseWord(fileSystemData.properties.caseSensitivity) }} (Sensitive)</b></p>
									<p>DNode Size: <b>{{ upperCaseWord(fileSystemData.properties.dNodeSize) }} (Legacy)</b></p>
									<p>Extended Attributes: <b>{{ upperCaseWord(fileSystemData.properties.extendedAttributes) }} (System Attribute)</b></p>
								</div>
								<div v-else>
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
					</template>
					<template v-slot:footer>
						<p>Quota: <b>{{ convertBytesToSize(fileSystemData.properties.quota.raw) }}</b></p>
						<p>Read Only: <b>{{ isBoolOnOff(fileSystemData.properties.isReadOnly!) }}</b></p>
					</template>
				</Card>
			</div>
			<div class="col-start-3 row-start-1 col-span-2">
				<div class="ml-2">
					<!-- <FinalProgress/> -->
				</div>
			</div>
		</div>
		
	</div>


</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
import Card from '../common/Card.vue';
import Accordion from '../common/Accordion.vue';
import FinalProgress from './FinalProgress.vue';
import { isBoolOnOff, isBoolCompression, convertBytesToSize, upperCaseWord, getValue, checkInheritance } from '../../composables/helpers';

const poolConfig = inject<PoolData>("pool-config-data")!;
const allDisks = inject<DiskData[]>("disks");
const fileSystemData = inject<Ref<FileSystemData>>('file-system-data')!;


// console.log(poolConfig.vdevs)
</script>