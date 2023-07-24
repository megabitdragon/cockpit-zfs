<template>
	<div>
		<div class="w-full h-full px-8 bg-default text-default overflow-y-visible py-8">

			<div v-if="props.tag === 'dashboard'" class="p-4">
			   <Dashboard :key="refreshKey" />
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
import { loadData } from '../scripts/loadData';
import FileSystemList from '../components/file-systems/FileSystemList.vue';

interface ZFSProps {
  	tag: string;
}

const props = defineProps<ZFSProps>();

const pools = ref<PoolData[]>([]);
const vDevs = ref<vDevData[]>([]);
const disks = ref<DiskData[]>([]);
// const fileSystems = ref<FileSystemData[]>([]);
const datasets = ref<Dataset[]>([]);

const refreshKey = ref(0);

const loadingPools = ref(false);
const loadingDisks = ref(false);

async function initialLoad(disks, pools, datasets) {
	loadingDisks.value = true;
	loadingPools.value = true;
	await loadData(disks, pools, datasets);
	loadingDisks.value = false;
	loadingPools.value = false;
}

initialLoad(disks, pools, datasets);


//get all disks in use by pools
// const disksInPools = computed<DiskData[]>(() => {
// 	return disks.value.filter(disk => disk.usable === false);
// });

//provide data for other components to inject
provide("pools", pools);
provide("disks", disks);
provide("datasets", datasets);
provide('loading-disks', loadingDisks);
provide('loading-pools', loadingPools);
provide('refresh-key', refreshKey);
</script>

