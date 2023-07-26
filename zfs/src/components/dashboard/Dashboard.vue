<template>
	<div class="min-w-full max-h-screen overflow-y-auto py-2 align-middle sm:px-6 lg:px-8 sm:rounded-lg bg-accent rounded-md border border-default">
		<!-- Pools summary -->
		<div v-if="pools.length > 0 && poolsLoaded == true" class="grid grid-flow-col">
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
				<button class="btn btn-secondary" @click="refreshAllData">
					<ArrowPathIcon class="h-5 w-5" aria-hidden="true"/>
				</button>
			</div>
		</div>

		<!-- pools summary loading spinner -->
		<div v-if="pools.length < 1 && poolsLoaded == false" class="grid grid-cols-4 gap-2 justify-items-center">
			<LoadingSpinner baseColor="text-gray-200" fillColor="fill-slate-500" class="col-span-4 my-2"/>
		</div>

		<!-- no pools found -->
		<div v-if="pools.length < 1 && poolsLoaded == true" class="grid grid-flow-col grid-cols-3">
			<!-- <div class="p-2 -ml-1 flex justify-start">
				<button id="createPool" class="btn btn-primary" @click="newPoolWizardBtn">Create Storage Pool</button>
			</div> -->
			<div class="p-2 flex justify-center col-start-2">
				<span class="font-semibold text-lg">No Pools Found</span>
			</div>
			<div class="p-2 flex justify-end col-start-3">
				<button class="btn btn-secondary" @click="refreshAllData">
					<ArrowPathIcon class="h-5 w-5" aria-hidden="true"/>
				</button>
			</div>
		</div>

		<!-- pools card layout -->
		<div v-if="pools.length > 0 && poolsLoaded == true" class="grid grid-cols-4 auto-rows-max gap-2">
			<div v-for="(pool, index) in pools" :key="index">
				<DashPoolCard :pool="pools[index]!"/>
			</div>
		</div>

		<!-- pools card loading skeleton -->
		<div v-if="pools.length < 1 && poolsLoaded == false" class="grid grid-cols-4 gap-2 justify-items-center">
			<DashboardLoadingSkeleton color="bg-plugin-header" class="col-span-4"/>
		</div>

		<!-- disks summary -->
		<div v-if="disks.length > 0 && disksLoaded == true" class="grid grid-flow-col">
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
				<button class="btn btn-secondary" @click="refreshDiskData">
					<ArrowPathIcon class="h-5 w-5" aria-hidden="true"/>
				</button>
			</div>
		</div>

		<!-- disks summary loading spinner -->
		<div v-if="disks.length < 1 && disksLoaded == false" class="grid grid-cols-4 gap-2 justify-items-center">
			<LoadingSpinner baseColor="text-gray-200" fillColor="fill-slate-500" class="col-span-4 my-2"/>
		</div>

		<!-- no disks found -->
		<div v-if="disks.length < 1 && disksLoaded == true" class="flex justify-between">
			<div class="p-2 flex justify-center">
				<span class="font-semibold text-lg">No Disks Found</span>
			</div>
			<div class="p-2 flex justify-end">
				<button class="btn btn-secondary" @click="refreshDiskData">
					<ArrowPathIcon class="h-5 w-5" aria-hidden="true"/>
				</button>
			</div>
		</div>

		<!-- disk card layout -->
		<div v-if="disks.length > 0 && disksLoaded == true" class="grid grid-cols-4 auto-rows-max gap-2">
			<div v-for="(disk, index) in disks" :key="index">
				<DashDiskCard :disk="disks[index]!"/>
			</div>
		</div>

		<!-- disk card loading skeleton -->
		<div v-if="disks.length < 1 && disksLoaded == false" class="grid grid-cols-4 gap-2 justify-items-center">
			<DashboardLoadingSkeleton color="bg-plugin-header" class="col-span-4"/>
		</div>
	</div>

	<!-- <div v-if="showWizard">
		<CreatePool @close="showWizard = false"/>
	</div> -->

</template>

<script setup lang="ts">
import {computed, ref, Ref, inject, provide} from 'vue';
import { loadDisks, loadDisksThenPools } from '../../scripts/loadData';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
// import CreatePool from '../wizard-components/CreatePool.vue';
import DashPoolCard from "./DashPoolCard.vue";
import DashDiskCard from './DashDiskCard.vue';
import DashboardLoadingSkeleton from './DashboardLoadingSkeleton.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue';

const pools = inject<Ref<PoolData[]>>("pools")!;
const disks = inject<Ref<DiskData[]>>("disks")!;

const disksLoaded = inject<Ref<boolean>>('disks-loaded')!;
const poolsLoaded = inject<Ref<boolean>>('pools-loaded')!;

//get all disks in use by pools
// const disksInPools = inject<Ref<DiskData[]>>("disks-in-pools")!;

async function refreshAllData() {
	disksLoaded.value = false;
	poolsLoaded.value = false;
	disks.value = [];
	pools.value = [];
	await loadDisksThenPools(disks, pools);
	disksLoaded.value = true;
	poolsLoaded.value = true;
}

async function refreshDiskData() {
	disksLoaded.value = false;
	disks.value = [];
	await loadDisks(disks);
	disksLoaded.value = true;
}

// const showWizard = ref(false);

// //create new pool button
// function newPoolWizardBtn() {
// 	if (!showWizard.value) {
// 		showWizard.value = true;	
// 	} else {
// 		showWizard.value = false;
// 	}
// }

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