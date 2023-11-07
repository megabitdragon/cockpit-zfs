<template>
	<div>
		<div class="ml-4">
			<!-- Pool Info -->
			
				<p class="text-default"><b>Pool Details</b></p>
			
				<p class="ml-10 text-default text-default">Name: {{ poolConfig.name }}</p>
				<p class="ml-10 text-default">{{poolConfig.vdevs.length}} Virtual Device(s)</p>
				<p class="ml-10 text-default">Sector Size: {{poolConfig.properties.sector}}</p>
				<p class="ml-10 text-default">Record Size: {{poolConfig.properties.record}}</p>
				<p class="ml-10 text-default">Compression: {{isBoolCompression(poolConfig.properties.compression)}}</p>
				<p class="ml-10 text-default">
					<div class="ml-4">
						
							<p><b>Advanced Settings</b></p>
						
		
							<p class="ml-10 text-default">Deduplication: {{isBoolOnOff(poolConfig.properties.deduplication)}}</p>
							<!-- <p class="ml-10 text-default">Refreservation Amount: {{(poolConfig.properties.refreservation)}}%</p> -->
							<p class="ml-10 text-default">Auto-Expand Pool: {{isBoolOnOff(poolConfig.properties.autoExpand)}}</p>
							<p class="ml-10 text-default">Auto-Replace Devices: {{isBoolOnOff(poolConfig.properties.autoReplace)}}</p>
							<p class="ml-10 text-default">Automatic TRIM: {{isBoolOnOff(poolConfig.properties.autoTrim)}}</p>
						
					</div>
				</p>
			
		</div>
		<br/>
		<div class="ml-4">
			<!-- Virtual Device Info -->
			
				<p class="text-default"><b>VDev Details</b></p>
			
				<p class="ml-8">
					<div v-for="(vDev, vDevIdx) in poolConfig.vdevs" :key="vDevIdx">
						<div class="ml-4">
							
								<p class="text-default">{{poolConfig.vdevs[vDevIdx].name}} - ({{poolConfig.vdevs[vDevIdx].type}})</p>
								<p class="text-default">({{ poolConfig.vdevs[vDevIdx].selectedDisks.length }} disks)</p>
								
				
									<p class="ml-10 text-default">Type: {{poolConfig.vdevs[vDevIdx].type}}</p>

								 <div v-for="(disk, diskIdx) in poolConfig.vdevs[vDevIdx].selectedDisks" :key="diskIdx">
										<p class="ml-10 text-default">{{ disk }} </p>

									</div>

									<br/>
								
						</div>
					</div>
				</p>
			
		</div>
		<br/>
		<div class="ml-4" v-if="poolConfig.createFileSystem">
		<!-- File System Info? -->
			
				<p class="text-default"><b>File System Details</b></p>
				

				<p class="ml-10 text-default">ParentFS: {{ fileSystemData.parentFS }}</p>
				<p class="ml-10 text-default">Name: {{ fileSystemData.name }}</p>
				<p class="ml-10 text-default">Access Time: {{ fileSystemData.properties.accessTime }}</p>
				<p class="ml-10 text-default">Deduplication: {{ fileSystemData.properties.deduplication }}</p>
				<p class="ml-10 text-default">Record Size: {{ fileSystemData.properties.recordSize }}</p>
				<p class="ml-10 text-default">Case Sensitivity: {{ fileSystemData.properties.caseSensitivity }}</p>
				<p class="ml-10 text-default">DNode Size: {{ fileSystemData.properties.dNodeSize }}</p>
				<p class="ml-10 text-default">Compression: {{ fileSystemData.properties.compression }}</p>
				<p class="ml-10 text-default">Extended Attributes: {{ fileSystemData.properties.extendedAttributes }}</p>
				<p class="ml-10 text-default">Quota: {{ fileSystemData.properties.quota.raw }} {{ fileSystemData.properties.quota.value }}</p>
				
		</div>
		<br/>
	</div>
</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
import { isBoolOnOff } from '../../composables/helpers';

const poolConfig = inject<PoolData>("pool-config-data")!;
const allDisks = inject<DiskData[]>("disks");
const fileSystemData = inject<Ref<FileSystemData>>('file-system-data')!;

function isBoolCompression(bool : boolean) {
	if (bool) {return 'lz4'} else {return 'off'}
}

// console.log(poolConfig.vdevs)
</script>