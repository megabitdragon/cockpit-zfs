<template>
	<div>
		<div class="w-full h-full min-h-max min-w-max overflow-visible px-8 bg-default text-default">

			<div v-if="props.tag === 'dashboard'" class="p-4">
			   <Dashboard />
			</div>

			<div v-if="props.tag === 'pools'" class="p-4">
			  	<PoolsList/>
			</div>

			<div v-if="props.tag === 'filesystems'" class="p-4">
			  	<FileSystemList/>
			</div>

			<!-- <div v-if="props.tag === 'settings'" class="p-4">
			
			</div> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, inject, computed, provide, watch } from 'vue';
import "@45drives/cockpit-css/src/index.css";
import "@45drives/cockpit-vue-components/dist/style.css";
import { loadDisksThenPools, loadDatasets, loadSnapshots, loadScanObject } from '../composables/loadData';
import PoolsList from "../components/pools/PoolsList.vue";
import Dashboard from '../components/dashboard/Dashboard.vue';
import FileSystemList from '../components/file-systems/FileSystemList.vue';

interface ZFSProps {
  	tag: string;
}

const props = defineProps<ZFSProps>();

const pools = ref<PoolData[]>([]);
const disks = ref<DiskData[]>([]);
const datasets = ref<FileSystemData[]>([]);
const importablePools = ref<ImportablePoolData[]>([]);
const importableDestroyedPools = ref<ImportablePoolData[]>([]);
const snapshots = ref<Snapshot[]>([]);
const scanObject = ref<PoolScanObject>({
	name: '',
	function: '',
	start_time: '',
	end_time: '',
	state: '',
	errors: 0,
	percentage: 0,
	pause: '',
	total_secs_left: 0,
	bytes_issued: 0,
	bytes_processed: 0,
	bytes_to_process: 0,
});

const disksLoaded = ref(false);
const poolsLoaded = ref(false);
const fileSystemsLoaded = ref(false);
const snapshotsLoaded = ref(true);

const clearLabels = ref(false);

async function initialLoad(disks, pools, datasets) {
	disksLoaded.value = false;
	poolsLoaded.value = false;
	fileSystemsLoaded.value = false;
	await loadDisksThenPools(disks, pools);
	await loadDatasets(datasets);
	disksLoaded.value = true;
	poolsLoaded.value = true;
	fileSystemsLoaded.value = true;
}

setInterval(() => {
    pools.value.forEach(pool => {
		loadScanObject(scanObject.value, pool.name);
	});
}, 5000);

initialLoad(disks, pools, datasets);

//get all disks in use by pools
// const disksInPools = computed<DiskData[]>(() => {
// 	return disks.value.filter(disk => disk.usable === false);
// });

//provide data for other components to inject
provide("pools", pools);
provide("importable-pools", importablePools);
provide("importable-destroyed-pools", importableDestroyedPools);
provide("disks", disks);
provide("datasets", datasets);
// provide("disks-in-pools", disksInPools);
provide('disks-loaded', disksLoaded);
provide('datasets-loaded', fileSystemsLoaded);
provide('pools-loaded', poolsLoaded);
provide('snapshots-loaded', snapshotsLoaded);
provide('clear-labels', clearLabels);
provide("snapshots", snapshots);
</script>

