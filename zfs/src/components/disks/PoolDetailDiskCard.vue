<template>
	<Card :bgColor="'bg-default'" :titleSection="true" :contentSection="true" :footerSection="true" class="mt-2 mb-4 overflow-visible card bg-default">
		<template v-slot:title>
			<div class="flex flex-row justify-between gap-1">
				<div class="pr-2 text-default text-medium">
					{{ props.disk.name }} ({{ props.disk.type }})
				</div>
				<div class="px-1">
					<CheckCircleIcon class="aspect-square w-5 h-5 text-green-400"/>
				</div>
				<!-- <div id="menu-btn" class="ml-5">
					<Menu as="div" class="relative inline-block text-right ">
						<div>
							<MenuButton class="flex items-center rounded-full bg-accent text-muted hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
								<span class="sr-only">Open options</span>
								<EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
							</MenuButton>
						</div>

						<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
							<MenuItems class="absolute right-0 z-10 mt-1 w-max origin-top-left rounded-md bg-accent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
								<div class="py-1">
									<MenuItem as="div" v-slot="{ active }">
										<a href="#" @click.stop="showDetails(props.disk)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Disk Details</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Disk Errors</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Detach Disk</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Offline Disk</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Replace Disk</a>
									</MenuItem>
									<MenuItem as="div" v-slot="{ active }">
										<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">TRIM Disk</a>
									</MenuItem>
								</div>
							</MenuItems>
						</transition>
					</Menu>
				</div> -->
			</div>

		</template>
					<!-- alias, name, model/serial, temp, status -->	
		<template v-slot:content>
		<div>
			<span class="text-success">{{ props.disk.health }}</span>
		</div>
		<div>
			<span class="text-default">{{ props.disk.temp }}&nbsp;</span>
		</div>
		
		<!-- <div>
			<span class="text-base font-medium text-success">Space&nbsp;&nbsp;&nbsp;</span>
			<span class="text-sm font-medium text-success">0%</span>
		</div> -->
		<!-- <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
			<div v-if="capacity <= 85" class="bg-green-600 h-2.5 rounded-full" :style="{width: `${props.capacity}%`}"></div>
			<div v-if="capacity > 85" class="bg-red-600 h-2.5 rounded-full" :style="{width: `${props.capacity}%`}"></div>
		</div> -->
		</template>
		<template v-slot:footer>
			<div class="text-default">
				<b>Total: {{ props.disk.capacity }}</b>
			</div>
		</template>
	</Card>

</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline';
import Card from '../common/Card.vue';

interface PoolDetailDiskCardProps {
	disk: DiskData;
}

// const usedSpaceAmount = computed(() => {
//   const total = props.totalSize * (props.spaceUsed / 100);
//   return total;
// });

// const freeSpaceAmount = computed(() => {
//   const total = props.totalSize - usedSpaceAmount.value;
//   return total;
// });

const props = defineProps<PoolDetailDiskCardProps>();

</script>