<template>
	<Modal>
		<template v-slot:title>
			<Navigation :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
		</template>
		<template v-slot:content>
			<div v-if="navTag == 'stats'" class="mt-6 grid grid-cols-4">
				<!-- DiskName               DiskCapacity Bar/Circle              	Disk Temp       Refresh Btn-->
				<!-- Size: fullsize of Disk storage                               Health: STATUS (checkmark if good)
					Used: allocated storage                                       Errors: if any errors show here, if none show 'None currently'
					Free: remaining free space                                     @timestamp (to show current time page is accessed)

				-->
					<div class="col-span-2">
						<div :id="getIdKey('visual-capacity')" class="flex items-center flex-wrap max-w-md px-10 bg-white shadow rounded-2xl h-20">
							<div class="flex items-center justify-center -m-6 overflow-visible shadow bg-white rounded-full">
								<svg class="w-32 h-32 transform translate-x-1 translate-y-1" aria-hidden="true">
									<circle class="text-gray-300" stroke-width="10" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
									<circle class="text-green-600" stroke-width="10" stroke-dasharray="314" stroke-dashoffset="314" stroke-linecap="round" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
								</svg>
								<span class="absolute text-2xl text-green-700">0%</span>
							</div>
							<p class="ml-10 font-medium text-gray-600 sm:text-xl">{{ props.disk.name }}</p>
							<span class="ml-auto text-xl font-medium text-green-600 hidden sm:block">{{ props.disk.capacity }}</span>
						</div>
					</div>

					<div class="mt-2 col-span-2 col-start-3 row-start-1">
						<p class="text-lg">Health: <span class="text-green-700">{{ props.disk.status }}</span></p>
						<p class="text-sm">Errors: None currently detected - {{ getTimestampString }}</p>
					</div>
			</div>

			<div v-if="navTag == 'settings'">
				
			</div>

			</template>
			<template v-slot:footer>
			
			</template>
	</Modal>
</template>

<script setup lang="ts">
import { reactive, ref, computed, provide } from 'vue';
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import Modal from '../common/Modal.vue';
import Navigation from '../common/Navigation.vue';

interface DiskDetailsProps {
  disk: DiskData;
}

const props = defineProps<DiskDetailsProps>();

// const visualCapacity = computed(() => {
// 	return 314 - (props.pool.properties.capacity * 100) / 314;
// });

const getTimestampString = computed(() => {
	const currentDateTime = new Date();
	const timestampString = currentDateTime.toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});

	return timestampString;
});

const show = ref(true);
const navTag = ref('stats');

const currentNavigationItem = computed<NavigationItem | undefined>(() => navigation.find(item => item.current));

const navigationCallback: NavigationCallback = (item: NavigationItem) => {
	navTag.value = item.tag;
};

const navigation = reactive<NavigationItem[]>([
  	{ name: 'Stats', tag: 'stats', current: computed(() => navTag.value == 'stats') as unknown as boolean, show: true, },
  	{ name: 'Settings', tag: 'settings', current: computed(() => navTag.value == 'settings') as unknown as boolean, show: true, },
].filter(item => item.show));

const getIdKey = (name: string) => `${name}`;
</script>
