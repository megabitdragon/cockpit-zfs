<template>
	<!-- shows loading animations but ONLY when the arrays are empty -->
	<!-- This works fine for updating the arrays as they are empty initially when loading data, but not when they are actually empty it appears to load endlessly but in reality there is no data to be loaded -->
	<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 overflow-auto sm:rounded-lg bg-accent rounded-md border border-default">

		<div v-if="isLoadingPools" class="grid grid-cols-4 gap-2 justify-items-center">
			<LoadingSpinner baseColor="text-gray-200" fillColor="fill-slate-500" class="col-span-4"/>
			<DashboardLoadingSkeleton color="bg-plugin-header" class="col-span-4"/>
		</div>

		<!-- showing # of pools with status indicator icon and total space between all pools -->
		<div v-if="pools.length > 0 && !isLoadingPools" class="grid grid-flow-col">
			<div class="p-2">
				<span class="font-semibold text-lg">Pools</span>
			</div>
			<div class="p-2">
				<img class="aspect-square w-4 h-4 min-w-4 min-h-4" src="../../../public/icons/success.svg">
			</div>
			<div class="p-2">
				<h6> {{ pools.length }} Pool(s) </h6>
			</div>
			<div class="p-2">
				<h6> Total Effective Space: {{ totalEffectivePoolSpace }} </h6>
			</div>
			<div class="p-2 flex justify-end">
				<button class="rounded-full bg-accent text-muted hover:text-gray-600" @click="refreshAllData">
					<ArrowPathIcon class="h-5 w-5" aria-hidden="true"/>
				</button>
			</div>
		</div>

		<!-- lists all pools in card format with a summary of details -->
		<div v-if="pools.length > 0 && !isLoadingPools" class="grid grid-cols-4 auto-rows-max gap-2">
			<div v-for="(pool, index) in pools" :key="index">
				<DashPoolCard :pool="pools[index]!"/>
			</div>
		</div>

		<!-- <div v-if="pools.length < 1 && !isLoadingPools">
			<div class="p-2 flex justify-center">
				<span class="font-semibold text-lg">No Pools Found</span>
			</div>
		</div> -->

		<div v-if="isLoadingDisks" class="grid grid-cols-4 gap-2 justify-items-center">
			<LoadingSpinner baseColor="text-gray-200" fillColor="fill-slate-500" class="col-span-4"/>
			<DashboardLoadingSkeleton color="bg-plugin-header" class="col-span-4"/>
		</div>

		<!-- showing # of SSDs, # of HDDS, with status indicator icons and maximum temp + total raw space between all disks -->
		<div v-if="disks.length > 0 && !isLoadingDisks" class="grid grid-flow-col">
			<div class="p-2">
				<span class="font-semibold text-lg">Disks</span>
			</div>
			<div class="p-2">
				<img class="aspect-square w-4 h-4 min-w-4 min-h-4" src="../../../public/icons/success.svg">
			</div>
			<div class="p-2">
				{{ disksSSD.length }} SSDs
			</div>
			<div class="p-2">
				<img class="aspect-square w-4 h-4 min-w-4 min-h-4" src="../../../public/icons/success.svg">
			</div>
			<div class="p-2">
				{{ disksHDD.length }} HDDs
			</div>
			<div class="p-2">
				<h6> Maximum Temperature: {{maxTemp}}° C</h6>
			</div>
			<div class="p-2">
				<h6> Total Raw Space: {{ totalRawDiskSpace }}</h6>
			</div>
			<div class="p-2 flex justify-end">
				<button class="rounded-full bg-accent text-muted hover:text-gray-600" @click="refreshDiskData">
					<ArrowPathIcon class="h-5 w-5" aria-hidden="true"/>
				</button>
			</div>
		</div>
	
		<!-- lists all disks in card format with a summary of details -->
		<div v-if="disks.length > 0 && !isLoadingDisks" class="grid grid-cols-4 auto-rows-max gap-2">
			<div v-for="(disk, index) in disks" :key="index">
				<DashDiskCard :disk="disks[index]!"/>
			</div>
		</div>

		<!-- <div v-if="disks.length < 1 && !isLoadingDisks">
			<div class="p-2 flex justify-center">
				<span class="font-semibold text-lg">No Disks Found</span>
			</div>
		</div> -->

	</div>
	
</template>

<script setup lang="ts">
import {computed, ref, Ref, inject, provide} from 'vue';
import { loadDisks, loadDisksAndPools } from '../../scripts/loadData';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import DashPoolCard from "./DashPoolCard.vue";
import DashDiskCard from './DashDiskCard.vue';
import DashboardLoadingSkeleton from './DashboardLoadingSkeleton.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue';

const pools = inject<Ref<PoolData[]>>("pools")!;
const disks = inject<Ref<DiskData[]>>("disks")!;

const isLoadingPools = ref(false);
const isLoadingDisks = ref(false);

//get all disks in use by pools
// const disksInPools = inject<Ref<DiskData[]>>("disks-in-pools")!;

// function refreshAllData() {
// 	disks.value = [];
// 	pools.value = [];
// 	loadDisksAndPools(disks, pools);
// }
async function refreshAllData() {
	isLoadingPools.value = true;
	isLoadingDisks.value = true;
	disks.value = [];
	pools.value = [];
	try {
		await loadDisksAndPools(disks, pools);
	} catch (error) {
		console.error("Error while loading pool/disk data:", error);
	}
	isLoadingPools.value = false;
	isLoadingDisks.value = false;
}

// function refreshDiskData() {
// 	disks.value = [];
// 	loadDisks(disks);
// }
async function refreshDiskData() {
  isLoadingDisks.value = true;
  disks.value = [];
  try {
    await loadDisks(disks);
  } catch (error) {
    console.error("Error while loading disk data:", error);
  }
  isLoadingDisks.value = false;
}

//determine total effective space of pools
const totalEffectivePoolSpace = computed(() => {
	let totalCapacity = 0;
	pools.value.forEach(pool => {
		totalCapacity += pool.properties.rawsize;
	});

	return(convertBytesToSize(totalCapacity));
});

//convert raw bytes to readable data size
const convertBytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const convertedSize = (bytes / Math.pow(1024, i)).toFixed(2);

  return `${convertedSize} ${sizes[i]}`;
};

//convert readable data size to raw bytes
const convertSizeToBytes = (size) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const [value, unit] = size.split(' ');

  const index = sizes.indexOf(unit);
  const bytes = parseFloat(value) * Math.pow(1024, index);
  
  return bytes;
};

//find highest disk temperature
const maxTemp = computed(() => {
  let maxTemperature = 0;

  disks.value.forEach((disk) => {
    const temperature = parseFloat(disk.temp.replace(/\D/g, ''));
    if (!isNaN(temperature) && temperature > maxTemperature) {
      maxTemperature = temperature;
    }
  });

  return maxTemperature.toString();
});

//get total raw space of disks
const totalRawDiskSpace = computed(() => {
	let totalRaw = 0;
	disks.value.forEach(disk => {
		totalRaw += convertSizeToBytes(disk.capacity);
	});
	return (convertBytesToSize(totalRaw));
})

//determine number of SSDs
const disksSSD = computed(() => {
	return disks.value.filter(disk => disk.type == 'SSD');
});

//determine number of HDDs
const disksHDD = computed(() => {
	return disks.value.filter(disk => disk.type == 'HDD');
});

</script>