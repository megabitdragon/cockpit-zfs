<template>
	<div>
		<div class="w-full h-full overflow-visible px-8 bg-default text-default">

			<div v-if="props.tag === 'dashboard'" class="p-4">
			   <Dashboard />
			</div>

			<div v-if="props.tag === 'pools'" class="p-4">
			  	<PoolsList/>
			</div>

			<div v-if="props.tag === 'filesystems'" class="p-4">
			  	<FileSystemList/>
			</div>

			<!-- <div v-if="props.tag === 'stats'" class="p-4">
			
			</div>

			<div v-if="props.tag === 'settings'" class="p-4">
			
			</div> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, inject, computed, provide, watch } from 'vue';
import "@45drives/cockpit-css/src/index.css";
import "@45drives/cockpit-vue-components/dist/style.css";
import PoolsList from "../components/pools/PoolsList.vue";
import Dashboard from '../components/dashboard/Dashboard.vue';
import { loadDisksThenPools, loadDatasets } from '../composables/loadData';
import FileSystemList from '../components/file-systems/FileSystemList.vue';

interface ZFSProps {
  	tag: string;
}

const props = defineProps<ZFSProps>();

const pools = ref<PoolData[]>([]);
const vDevs = ref<vDevData[]>([]);
const disks = ref<DiskData[]>([]);
const datasets = ref<FileSystemData[]>([]);

const disksLoaded = ref(false);
const poolsLoaded = ref(false);
const fileSystemsLoaded = ref(false);

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

//get all disks in use by pools
const disksInPools = computed<DiskData[]>(() => {
	return disks.value.filter(disk => disk.usable === false);
});

//provide data for other components to inject
provide("pools", pools);
provide("disks", disks);
provide("datasets", datasets);
provide("disks-in-pools", disksInPools);
provide('disks-loaded', disksLoaded);
provide('datasets-loaded', fileSystemsLoaded);
provide('pools-loaded', poolsLoaded);
</script>

