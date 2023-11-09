<template>
	<div>
		<div class="grid grid-cols grid-cols-4">
			<div class="col-start-1 col-span-2">
				<Card :bgColor="'bg-well'" :titleSection="true" :contentSection="true" :footerSection="true" class="mt-2 mb-4 min-w-fit overflow-visible rounded-md border border-default text-default">
					<template v-slot:title>
						<p>Pool Name: <b>{{ poolConfig.name }}</b></p>
					</template>
					<template v-slot:content>
						<p>Compression: <b>{{ isBoolCompression(poolConfig.properties.compression) }}</b></p>
						<p>Sector Size: <b>{{ poolConfig.properties.sector }}</b></p>
						<p>Record Size: <b>{{ poolConfig.properties.record }}</b></p>
						<p>
							<Accordion :btnColor="'bg-well'" :gridSize="'grid-cols-8'" :btnColSpan="'col-span-1'" :titleColSpan="'col-span-7'" :contentColSpan="'col-span-8'" :isOpen="false" class="bg-well text-default">
								<template v-slot:title>
									<p class="ml-2 mt-1">Advanced Settings</p>
								</template>
								<template v-slot:content>
									<p>Deduplication: <b>{{ isBoolOnOff(poolConfig.properties.deduplication) }}</b></p>
									<p>Auto-Expand: <b>{{ isBoolOnOff(poolConfig.properties.autoExpand) }}</b></p>
									<p>Auto-Replace: <b>{{ isBoolOnOff(poolConfig.properties.autoReplace) }}</b></p>
									<p>Auto-TRIM: <b>{{ isBoolOnOff(poolConfig.properties.autoTrim) }}</b></p>
								</template>
							</Accordion>
						</p>
					</template>
					<template v-slot:footer>
						<Accordion :btnColor="'bg-well'" :gridSize="'grid-cols-8'" :btnColSpan="'col-span-1'" :titleColSpan="'col-span-7'" :contentColSpan="'col-span-8'" :isOpen="false" class="bg-well text-default">
							<template v-slot:title>
								<p class="ml-2 mt-1">Virtual Devices <b>({{ poolConfig.vdevs.length }})</b></p>
							</template>
							<template v-slot:content>
								<div v-for="vDev, vDevIdx in poolConfig.vdevs" :key="vDevIdx">
									<Card :bgColor="'bg-well'" :titleSection="true" :contentSection="true" :footerSection="true" class="text-default">
										<template v-slot:title>
											<p><b>{{ vDev.name }}</b></p>
										</template>
										<template v-slot:content>
											<p>Type: <b>{{ vDev.type }}</b></p>
										</template>
										<template v-slot:footer>
											<p>Disks: <br/>
												<b v-for="disk, diskIdx in vDev.selectedDisks" :key="diskIdx">
													{{ disk }} <br/>
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
			<div v-if="poolConfig.createFileSystem!" class="col-span-2 col-start-1">
				<Card :bgColor="'bg-well'" :titleSection="true" :contentSection="true" :footerSection="true" class="mt-2 mb-4 min-w-fit overflow-visible rounded-md border border-default text-default">
					<template v-slot:title>
						<p class="ml-2 mt-1">File System Name: <b>{{ fileSystemData.name }}</b></p>
					</template>
					<template v-slot:content>
						<Accordion :btnColor="'bg-well'" :gridSize="'grid-cols-8'" :btnColSpan="'col-span-1'" :titleColSpan="'col-span-7'" :contentColSpan="'col-span-8'" :isOpen="false" class="bg-well text-default">					
							<template v-slot:title>
								<p>Settings: <b v-if="fileSystemData.inherit">Inherited</b></p>
							</template>
							<template v-slot:content>
								<p>Compression: <b>{{ (fileSystemData.properties.compression) }}</b></p>
								<p>Deduplication: <b>{{ (fileSystemData.properties.deduplication) }}</b></p>
								<p>Record Size: <b>{{ (fileSystemData.properties.recordSize) }}</b></p>
								<p>Access Time: <b>{{ (fileSystemData.properties.accessTime) }}</b></p>
								<p>Case Sensitivity: <b>{{ (fileSystemData.properties.caseSensitivity) }}</b></p>
								<p>DNode Size: <b>{{ (fileSystemData.properties.dNodeSize) }}</b></p>
								<p>Extended Attributes: <b>{{ (fileSystemData.properties.extendedAttributes) }}</b></p>
							</template>
						</Accordion>
					</template>
					<template v-slot:footer>
						<p>Quota: <b>{{ convertBytesToSize(fileSystemData.properties.quota.raw) }}</b></p>
						<p>Read Only: <b>{{ (fileSystemData.properties.readOnly) }}</b></p>
					</template>
				</Card>
			</div>
		</div>
		
	</div>


</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
import Card from '../common/Card.vue';
import Accordion from '../common/Accordion.vue';
import { isBoolOnOff, isBoolCompression, convertBytesToSize } from '../../composables/helpers';

const poolConfig = inject<PoolData>("pool-config-data")!;
const allDisks = inject<DiskData[]>("disks");
const fileSystemData = inject<Ref<FileSystemData>>('file-system-data')!;


// console.log(poolConfig.vdevs)
</script>