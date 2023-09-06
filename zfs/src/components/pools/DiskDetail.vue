<template>
	<Modal v-if="props.isModalChild" :isOpen="open" :marginTop="'mt-48'" :width="'w-8/12'" :minWidth="'min-w-8/12'">
		<template v-slot:title>
			<legend class="flex justify-center">Disk {{ disk.name }} Details</legend>
		</template>
		<template v-slot:content>
			<div class="mt-6 grid grid-cols-4">

				<div class="col-span-2">
					<CircleProgress :id="getIdKey('pool-visual-capacity')" :fillColor="'text-green-600'" :numColor="'text-green-700'" :name="props.disk.name" :totalSize="props.disk.capacity" :capacity="0" :radius="50" :coordX="60" :coordY="60" :strokeWidth="10" :strokeDashArr="314"/>
				</div>

				<div class="mt-2 col-span-2 col-start-3 row-start-1">
					<p class="text-lg">Member of pool: '{{props.disk.poolName}}'</p>
					<p class="text-lg">Health: <span class="text-green-700">{{ props.disk.status }}</span></p>
					<p class="text-sm">Errors: None currently detected - {{ getTimestampString() }}</p>
				</div>

				<div class="mt-2 col-span-1 col-start-3 row-start-2">
					<p class="text-base">Temperature: {{ props.disk.temp }} </p>
					<p class="text-base">Type: {{ props.disk.type }}</p>
				</div>

				<div class="mt-2 col-span-1 col-start-4 row-start-2">
					<p class="text-base">Power Cycles: {{ props.disk.powerOnCount }}</p>
					<p class="text-base">Power-On Hrs: {{ props.disk.powerOnHours }}</p>
				</div>
			<!-- 
				<div class="mt-2 col-span-2 col-start-1 row-start-3">
					<p class="text-base">Used: *space used*</p>
					<p class="text-base">Free: *space free*</p>
				</div> -->

				<!-- <div class="mt-2 col-span-1 col-start-3 row-start-3">
					<p class="text-base">Rotation Rate: <span v-if="props.disk.type == 'HDD'">{{ props.disk.rotationRate }}</span><span v-else>N/A</span></p>
					<p class="text-base">Interface: </p>
				</div> -->

				<!-- <div class="mt-2 col-span-1 col-start-4 row-start-3">
					<p class="text-base">Reads: X</p>
					<p class="text-base">Writes: Y</p>
				</div> -->

			</div>

		</template>
		<template v-slot:footer>
		
		</template>
	</Modal>
	<Modal v-else :isOpen="open" :marginTop="'mt-28'" :width="'w-8/12'" :minWidth="'min-w-8/12'">
		<template v-slot:title>
			<legend class="flex justify-center">Disk {{ disk.name }} Details</legend>
		</template>
		<template v-slot:content>
			<div class="mt-6 grid grid-cols-4">

				<div class="col-span-2">
					<CircleProgress :id="getIdKey('pool-visual-capacity')" :fillColor="'text-green-600'" :numColor="'text-green-700'" :name="props.disk.name" :totalSize="props.disk.capacity" :capacity="0" :radius="50" :coordX="60" :coordY="60" :strokeWidth="10" :strokeDashArr="314"/>
				</div>

				<div class="mt-2 col-span-2 col-start-3 row-start-1">
					<p class="text-lg">Member of pool: {{props.disk.poolName}}</p>
					<p class="text-lg">Health: <span class="text-green-700">{{ props.disk.status }}</span></p>
					<p class="text-sm">Errors: None currently detected - {{ getTimestampString() }}</p>
				</div>

				<div class="mt-2 col-span-1 col-start-3 row-start-2">
					<p class="text-base">Temperature: {{ props.disk.temp }} </p>
					<p class="text-base">Type: {{ props.disk.type }}</p>
				</div>

				<div class="mt-2 col-span-1 col-start-4 row-start-2">
					<p class="text-base">Power Cycles: {{ props.disk.powerOnCount }}</p>
					<p class="text-base">Power-On Hrs: {{ props.disk.powerOnHours }}</p>
				</div>

				<!-- <div class="mt-2 col-span-2 col-start-1 row-start-3">
					<p class="text-base">Used: *space used*</p>
					<p class="text-base">Free: *space free*</p>
				</div> -->

				<!-- <div class="mt-2 col-span-1 col-start-3 row-start-3">
					<p class="text-base">Rotation Rate: <span v-if="props.disk.type == 'HDD'">{{ props.disk.rotationRate }}</span><span v-else>N/A</span></p>
					<p class="text-base">Interface: </p>
				</div> -->

				<!-- <div class="mt-2 col-span-1 col-start-4 row-start-3">
					<p class="text-base">Reads: X</p>
					<p class="text-base">Writes: Y</p>
				</div> -->

			</div>

		</template>
		<template v-slot:footer>
		
		</template>
	</Modal>
</template>

<script setup lang="ts">
import { reactive, ref, computed, provide } from 'vue';
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { getTimestampString } from '../../composables/helpers';
import Modal from '../common/Modal.vue';
import CircleProgress from '../common/CircleProgress.vue';

interface DiskDetailsProps {
  disk: DiskData;
  isModalChild: boolean;
}

const props = defineProps<DiskDetailsProps>();

const open = ref(true);

const getIdKey = (name: string) => `${name}`;
</script>
