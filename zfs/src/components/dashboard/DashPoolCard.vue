<template>
	<Card class="mt-2 mb-4 overflow-visible bg-accent rounded-md border border-default">
		<template v-slot:title>
			<div class="grid grid-cols-3 grid-flow-col gap-1">
				<div class="pr-2 text-default">
					{{ props.pool.name }}
				</div>
				<div class="px-1">
					<img class="w-4 h-4" src="../../../public/icons/success.svg">
				</div>
				<div id="menu-btn" class="ml-10">
					<Menu as="div" class="relative inline-block text-right">
						<div>
							<MenuButton class="flex items-center rounded-full bg-accent text-muted hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
								<span class="sr-only">Open options</span>
								<EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
							</MenuButton>
						</div>

						<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
							<MenuItems class="absolute right-0 z-10 mt-2 w-max origin-top-left rounded-md bg-accent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
								<div class="py-1">
									<MenuItem v-slot="{ active }">
										<a href="#" @click="showDetails(props.pool)" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Pool Details</a>
									</MenuItem>
									<MenuItem v-slot="{ active }">
										<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Clear Pool Errors</a>
									</MenuItem>
									<MenuItem v-slot="{ active }">
										<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Resilver Pool</a>
									</MenuItem>
									<MenuItem v-slot="{ active }">
										<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Scrub Pool</a>
									</MenuItem>
									<MenuItem v-slot="{ active }">
										<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">TRIM Pool</a>
									</MenuItem>
									<MenuItem v-slot="{ active }">
										<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Add Virtual Device</a>
									</MenuItem>
									<MenuItem v-slot="{ active }">
										<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Export Pool</a>
									</MenuItem>
									<MenuItem v-slot="{ active }">
										<a href="#" :class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">Destroy Pool</a>
									</MenuItem>
								</div>
							</MenuItems>
						</transition>
					</Menu>
				</div>
			</div>
	
		<div>
			<span class="text-success">{{props.pool.status}}</span>
		</div>
		</template>
		<template v-slot:content>
			<div class="flex justify-between mb-1">
				<span class="text-base font-medium text-success ">Space&nbsp;</span>
				<span class="text-sm font-medium text-success ">{{props.pool.properties.capacity}}%</span>
			</div>
			<div class="w-full bg-well rounded-full h-2.5 ">
					<div v-if="props.pool.properties.capacity <= 85" class="bg-green-600 h-2.5 rounded-full" :style="{width: `${props.pool.properties.capacity}%`}"></div>
			</div>
		</template>
		<template v-slot:footer>
			<div>
				Used {{ props.pool.properties.allocated }}
			</div>
			<div>
				Free {{ props.pool.properties.free }}
			</div>
			<div>
				<b>Total {{ props.pool.properties.size }}</b>
			</div>
		</template>
	</Card>

	<div v-if="showPoolDetails">
		<PoolDetail :pool="selectedPool!" @close="showPoolDetails = false"/>
	</div>
</template>

<script setup lang="ts">
import { ref, inject, Ref, computed, provide } from "vue";
import { EllipsisVerticalIcon} from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import Card from '../common/Card.vue';
import PoolDetail from "../pools/PoolDetail.vue";

interface DashPoolCardProps {
	pool: PoolData;
}

const props = defineProps<DashPoolCardProps>();

const showPoolDetails = ref(false);

const selectedPool = ref<PoolData>();

//method to show pool details when button is clicked
function showDetails(pool) {
	selectedPool.value = pool;
	console.log(selectedPool);
	showPoolDetails.value = true;
}

</script>