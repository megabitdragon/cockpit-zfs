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
const poolDiskStats = ref<PoolDiskStats>({});
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
	disksLoaded.value = true;
	poolsLoaded.value = true;
	fileSystemsLoaded.value = true;
}

initialLoad(disks, pools, datasets);
scanNow();
checkDiskStats();
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

const scanIntervalID = ref();
const scanning = ref(true);

async function scanNow() {
	await loadScanObjectGroup(scanObjectGroup);
}

function startScanInterval() {
	if (!scanIntervalID.value) {
		scanIntervalID.value = setInterval(scanNow, 5000);
	}
}

function stopScanInterval() {
	if (scanIntervalID.value) {
		clearInterval(scanIntervalID.value);
		scanIntervalID.value = null;
	}
}

if (scanning.value) {
	startScanInterval();
} else {
	stopScanInterval();
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

const diskStatsIntervalID = ref();
const checkingDiskStats = ref(true);

async function checkDiskStats() {
	await loadDiskStats(poolDiskStats);
}

function startDiskStatsInterval() {
	if (!diskStatsIntervalID.value) {
		diskStatsIntervalID.value = setInterval(checkDiskStats, 5000);
	}
}

function stopDiskStatsInterval() {
	if (diskStatsIntervalID.value) {
		clearInterval(diskStatsIntervalID.value);
		diskStatsIntervalID.value = null;
	}
}

if (checkingDiskStats.value) {
	startDiskStatsInterval();
} else {
	stopDiskStatsInterval();
}

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
provide('pool-disk-stats', poolDiskStats);
provide('scan-interval', scanIntervalID);
provide('scanning', scanning);
provide('disk-stats-interval', diskStatsIntervalID);
provide('checking-disk-stats', checkingDiskStats)
</script>

