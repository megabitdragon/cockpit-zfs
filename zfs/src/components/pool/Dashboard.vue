<template>
	<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
		<div class="overflow-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg bg-gray-50">

			<!-- showing # of pools with status indicator icon and total space between all pools -->
			<div class="grid grid-flow-col">
				<div class="p-2">
					<span class="font-semibold text-lg">Pools</span>
				</div>
				<div class="p-2">
					<img class="w-4 h-4" src="../../../public/icons/success.svg">
				</div>
				<div class="p-2">
					<h6> Total Effective Space: {{ totalEffectiveSpace }} T</h6>
				</div>
			</div>

			<!-- lists all pools in card format with a summary of details -->
			<div class="grid grid-cols-4 grid-flow-col">
				<div v-for="(pool, index) in pools" :key="index" class="p-5 m-2 rounded-md border border-slate-200">
						<DashboardPoolCard :pool="pools[index]!"/>
				</div>
			</div>

			<!-- showing # of SSDs, # of HDDS, with status indicator icons and maximum temp + total raw space between all disks -->
			<div class="grid grid-flow-col">
				<div class="p-2">
					<span class="font-semibold text-lg">Disks</span>
				</div>
				<div class="p-2">
					<img class="w-4 h-4" src="../../../public/icons/success.svg">
				</div>
				<div class="p-2">
					{{ disksSSD.length }} SSDs
				</div>
				<div class="p-2">
					<img class="w-4 h-4" src="../../../public/icons/success.svg">
				</div>
				<div class="p-2">
					{{ disksHDD.length }} HDDs
				</div>
				<div class="p-2">
					<h6> Maximum Temp. X° C</h6>
				</div>
				<div class="p-2">
					<h6> Total Raw Space: 0 T</h6>
				</div>
			</div>

			<!-- lists all disks in card format with a summary of details -->
			<div class="grid grid-cols-4 grid-flow-col">
				<div v-for="(disk, index) in disks" :key="index" class="p-5 m-2 rounded-md border border-slate-200">
					<DashboardDiskCard :disk="disks[index]!"/>
				</div>
			</div>

		</div>
	
	</div>
</template>

<script setup lang="ts">
import {computed, ref, Ref, inject, provide} from 'vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import DashboardPoolCard from "../pool/DashboardPoolCard.vue";
import DashboardDiskCard from '../disk/DashboardDiskCard.vue';

const pools = inject<Ref<PoolData[]>>("pools")!;
const disks = inject<Ref<DiskData[]>>("disks")!;

//determine total effective space of pools
const totalEffectiveSpace = computed(() => {
	let totalCapacity = 0;
	pools.value.forEach(pool => {
		totalCapacity += pool.properties.rawsize;
	});
	const totalBytes = (totalCapacity / 1100000000000);
	const totalString = totalBytes.toFixed(2).toString();
	return totalString;
});

//determine number of SSDs
const disksSSD = computed(() => {
	return disks.value.filter(disk => disk.type == 'SSD');
});

//determine number of HDDs
const disksHDD = computed(() => {
	return disks.value.filter(disk => disk.type == 'HDD');
});

</script>