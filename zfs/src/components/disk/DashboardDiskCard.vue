<template>
	<Card class="mt-2 mb-4">
		<template v-slot:title>
			<div class="grid grid-cols-3 grid-flow-col gap-1">
				<div class="pr-2">
					{{ props.name }}
				</div>
				<div class="px-1">
					<img class="w-4 h-4" src="../../../public/icons/success.svg">
				</div>
				<div id="menu-btn" class="">
					<Menu as="div" class="relative inline-block text-left">
						<div>
							<MenuButton class="flex items-center rounded-full bg-white-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
								<span class="sr-only">Open options</span>
								<EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
							</MenuButton>
						</div>

						<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
							<MenuItems class="absolute right-0 z-10 mt-2 w-flex origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
								<div class="py-1">
									<MenuItem v-slot="{ active }">
										<a href="#" @onClick="" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Disk Details</a>
									</MenuItem>
								</div>
							</MenuItems>
						</transition>
					</Menu>
				</div>
			</div>
			<div>
				<span>{{props.status}}</span>
			</div>
			<div>
				<span>{{ props.type }}</span>
			</div>
			</template>
			<template v-slot:content>
			<div>
				<span>X° C&nbsp;</span>
			</div>
			<div>
				<span class="text-base font-medium text-green-700 dark:text-white">Space&nbsp;&nbsp;&nbsp;</span>
				<span class="text-sm font-medium text-green-700 dark:text-white">{{props.spaceUsed}}%</span>
			</div>
			<!-- <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
				<div v-if="capacity <= 85" class="bg-green-600 h-2.5 rounded-full" :style="{width: `${props.capacity}%`}"></div>
			</div> -->
		</template>
		<template v-slot:footer>
			<div>
				<b>Total: {{ props.totalSize }}</b>
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
import { reactive, ref, computed, provide } from 'vue';
import { EllipsisVerticalIcon} from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import Card from '../common/Card.vue';

interface DashboardDiskCardProps {
	name: string,
	status: string,
	spaceUsed: number,
	type: string,
	totalSize: string,
	usable: boolean,
}

// const usedSpaceAmount = computed(() => {
//   const total = props.totalSize * (props.spaceUsed / 100);
//   return total;
// });

// const freeSpaceAmount = computed(() => {
//   const total = props.totalSize - usedSpaceAmount.value;
//   return total;
// });

const props = defineProps<DashboardDiskCardProps>();

</script>