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
import { loadDisksThenPools, loadDatasets, loadScanObjectGroup, loadDiskStats } from '../composables/loadData';
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

const scanObjectGroup = ref<PoolScanObjectGroup>({});

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
	// trimScanNow(pools);
	disksLoaded.value = true;
	poolsLoaded.value = true;
	fileSystemsLoaded.value = true;
}

initialLoad(disks, pools, datasets);
scanNow();
loadDiskStats();
///////////////////////////////////////////////////

const intervalID = ref();
const scanning = ref(true);

async function scanNow() {
	await loadScanObjectGroup(scanObjectGroup);
}

function startInterval() {
	if (!intervalID.value) {
		intervalID.value = setInterval(scanNow, 5000);
	}
}

function stopInterval() {
	if (intervalID.value) {
		clearInterval(intervalID.value);
		intervalID.value = null;
	}
}

if (scanning.value) {
	startInterval();
} else {
	stopInterval();
}

// const trimIntervalID = ref();
// const trimScanning = ref(true);

// async function trimScanNow(pools) {
// 	await loadTRIMObjectGroup(trimObjectGroup, pools.value);
// 	//console.log('trim object:', trimObjectGroup);
// }

// function trimStartInterval() {
// 	if (!trimIntervalID.value) {
// 		trimIntervalID.value = setInterval(scanNow, 5000);
// 	}
// }

// function trimStopInterval() {
// 	if (trimIntervalID.value) {
// 		clearInterval(trimIntervalID.value);
// 		trimIntervalID.value = null;
// 	}
// }

// if (trimScanning.value) {
// 	trimStartInterval();
// } else {
// 	trimStopInterval();
// }


//provide data for other components to inject
provide("pools", pools);
provide("importable-pools", importablePools);
provide("importable-destroyed-pools", importableDestroyedPools);
provide("disks", disks);
provide("datasets", datasets);
provide('disks-loaded', disksLoaded);
provide('datasets-loaded', fileSystemsLoaded);
provide('pools-loaded', poolsLoaded);
provide('snapshots-loaded', snapshotsLoaded);
provide('clear-labels', clearLabels);
provide("snapshots", snapshots);
provide('scan-object-group', scanObjectGroup);
provide('interval', intervalID);
provide('scanning', scanning);
// provide('trim-interval', trimIntervalID);
// provide('trim-scanning', trimScanning);
</script>

