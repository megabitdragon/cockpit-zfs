<template>
	<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
		<div class="overflow-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg bg-gray-50">

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

			<div class="grid grid-cols-6 grid-flow-col">
				<div v-for="(pool, index) in pools" :key="index" class="p-2">
						<DashboardPoolCard :showDetails="showDetails" :name="pools[index].name" :status="pools[index].status" :capacity="pools[index].properties.capacity" :size="pools[index].properties.size" :free="pools[index].properties.free" :allocated="pools[index].properties.allocated"/>
				</div>
			</div>

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

			<div class="grid grid-cols-6 grid-flow-col">
				<div v-for="(disk, index) in disks" :key="index" class="p-2">
					<DashboardDiskCard :name="disk.name" :type="disk.type" :status="disk.status" :spaceUsed="0" :usable="disk.usable" :totalSize="disk.capacity!"/>
				</div>
			</div>

		</div>
	
		<div v-if="showPoolDetails">
			<PoolDetail :pool="selectedPool!" @close="showPoolDetails = false"/>
		</div>
		
		<!-- <div v-if="showDiskDetails">
			<DiskDetail :disk="selectedDisk" @close="showDiskDetails = false"/>
		</div> -->


	</div>
</template>

<script setup lang="ts">
import {computed, ref, Ref, inject, provide} from 'vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import PoolDetail from '../pool/PoolDetail.vue';
import DiskDetail from '../disk/DiskDetail.vue';
import DashboardPoolCard from "../pool/DashboardPoolCard.vue";
import DashboardDiskCard from '../disk/DashboardDiskCard.vue';

const pools = inject<Ref<PoolData[]>>("pools")!;
const disks = inject<Ref<DiskData[]>>("disks")!;

const totalEffectiveSpace = computed(() => {
	let totalCapacity = 0;
	pools.value.forEach(pool => {
		totalCapacity += pool.properties.rawsize;
	});
	const totalBytes = (totalCapacity / 1100000000000);
	const totalString = totalBytes.toFixed(2).toString();
	return totalString;
});

const disksSSD = computed(() => {
	return disks.value.filter(disk => disk.type == 'SSD');
});

const disksHDD = computed(() => {
	return disks.value.filter(disk => disk.type == 'HDD');
});

// const totalRawSpace = computed(() => {
//   return 
// })

const showPoolDetails = ref(false);

const selectedPool = ref<PoolData>();

function showDetails(poolName) {
	const selected = pools.value.find(pool => pool.name == poolName)!;
	selectedPool.value = selected;
	showPoolDetails.value = true;
}

defineExpose({
	showDetails
});
</script>