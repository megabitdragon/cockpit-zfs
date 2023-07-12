<template>
	<div>
		<Accordion :isOpen="true" class="ml-4">
			<!-- Pool Info -->
			<template v-slot:title>
				<p class="text-default"><b>Pool Details</b></p>
			</template>
			<template v-slot:content>
				<p class="ml-10 text-default text-default">Name: {{ poolConfig.name }}</p>
				<p class="ml-10 text-default">{{poolConfig.vdevs.length}} Virtual Device(s)</p>
				<p class="ml-10 text-default">Sector Size: {{poolConfig.settings!.sector}}</p>
				<p class="ml-10 text-default">Record Size: {{poolConfig.settings!.record}}</p>
				<p class="ml-10 text-default">Compression: {{poolConfig.settings!.compression}}</p>
				<p class="ml-10 text-default">
					<Accordion :isOpen="false" class="ml-4">
						<template v-slot:title>
							<p><b>Advanced Settings</b></p>
						</template>
						<template v-slot:content>
							<p class="ml-10 text-default">Deduplication: {{poolConfig.settings!.deduplication}}</p>
							<p class="ml-10 text-default">Refreservation Amount: {{poolConfig.settings!.refreservation}}%</p>
							<p class="ml-10 text-default">Auto-Expand Pool: {{poolConfig.settings!.autoExpand}}</p>
							<p class="ml-10 text-default">Auto-Replace Devices: {{poolConfig.settings!.autoReplace}}</p>
							<p class="ml-10 text-default">Automatic TRIM: {{poolConfig.settings!.autoTrim}}</p>
						</template>
					</Accordion>
				</p>
			</template>
		</Accordion>
		<br/>
		<Accordion :isOpen="true" class="ml-4">
			<!-- Virtual Device Info -->
			<template v-slot:title>
				<p class="text-default"><b>VDev Details</b></p>
			</template>
			<template v-slot:content>
				<p class="ml-8">
					<div v-for="(vDev, vDevIdx) in poolConfig.vdevs" :key="vDevIdx">
						<Accordion :isOpen="true" class="ml-4">
							<template v-slot:title>
								<p class="text-default">{{poolConfig.vdevs[vDevIdx].type}}-{{ vDevIdx }} ({{ poolConfig.vdevs[vDevIdx].selectedDisks.length }} disks)</p>
								</template>
								<template v-slot:content>
									<p class="ml-10 text-default">Type: {{poolConfig.vdevs[vDevIdx].type}}</p>

								 <div v-for="(disk, diskIdx) in poolConfig.vdevs[vDevIdx].selectedDisks" :key="diskIdx">
										<p class="ml-10 text-default">Disk {{ disk }} </p>

									</div>

									<br/>
								</template>
						</Accordion>
					</div>
				</p>
			</template>
		</Accordion>
		<br/>
		<Accordion :isOpen="true" class="ml-4" v-if="poolConfig.createFileSystem">
		<!-- File System Info? -->
			<template v-slot:title>
				<p class="text-default"><b>File System Details</b></p>
				</template>
				<template v-slot:content>
					<p class="ml-10 text-default">{{ poolConfig.fileSystem?.name }}</p>
					<!-- <p class="ml-10 text-default">Encryption: {{poolConfig.fileSystem?.encryption}}</p>
					<p class="ml-10 text-default">Quota Amount: {{ poolConfig.fileSystem?.quota.amount }}{{ poolConfig.fileSystem?.quota.size }}</p>
					<p class="ml-10 text-default">Read Only: {{ poolConfig.fileSystem?.readOnly }}</p> -->
				</template>
		</Accordion>
		<br/>
	</div>
</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
import Accordion from '../../components/common/Accordion.vue';

const poolConfig = inject<PoolData>("pool-config-data")!;
const allDisks = inject<DiskData[]>("disks");

// console.log(poolConfig.vdevs)
</script>