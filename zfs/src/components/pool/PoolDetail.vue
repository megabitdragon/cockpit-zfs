<template>
	<Modal>
		<template v-slot:title>
			<Navigation :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
		</template>
		<template v-slot:content>
			<div v-if="navTag == 'stats'" class="mt-6 grid grid-cols-4">
				 <!-- PoolName               PoolCapacity Bar/Circle              Avg.Disk Temp per Disk in Pool? or another stat       Refresh Btn-->
					<!-- Size: fullsize of pool storage                               Health: STATUS (checkmark if good)
							Used: allocated storage                                       Errors: if any errors show here, if none show 'None currently'
							Free: remaining free space                                     @timestamp (to show current time page is accessed)
							Fragmentation? 

							# of Devices?                               # of Datasets?
							# of Disks?
					-->
					<div class="col-span-2">
						<div :id="getIdKey('visual-capacity')" class="flex items-center flex-wrap max-w-md px-10 bg-white shadow rounded-2xl h-20">
							<div class="flex items-center justify-center -m-6 overflow-visible shadow bg-white rounded-full">
								<svg class="w-32 h-32 transform translate-x-1 translate-y-1" aria-hidden="true">
									<circle class="text-gray-300" stroke-width="10" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
									<circle class="text-green-600" stroke-width="10" stroke-dasharray="314" :stroke-dashoffset=visualCapacity stroke-linecap="round" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
								</svg>
								<span class="absolute text-2xl text-green-700">{{props.pool.properties.capacity}}%</span>
							</div>
							<p class="ml-10 font-medium text-gray-600 sm:text-xl">{{ props.pool.name }}</p>
							<span class="ml-auto text-xl font-medium text-green-600 hidden sm:block">{{ props.pool.properties.size }}</span>
						</div>
					</div>
					
					<div class="mt-2 col-span-2 col-start-3 row-start-1">
						<p class="text-lg">Health: <span class="text-green-700">{{ props.pool.status }}</span></p>
						<p class="text-sm">Errors: None currently detected - {{ getTimestampString }}</p>
					</div>

					<div class="mt-2 col-span-1 col-start-3 row-start-2">
						<p class="text-base">Size: {{ props.pool.properties.size }}</p>
						<p class="text-base">Used: {{ props.pool.properties.allocated }}</p>
						<p class="text-base">Free: {{ props.pool.properties.free }}</p>
					</div>
					<div class="mt-2 col-span-1 col-start-4 row-start-2">
						<p class="text-base">Devices: {{ getNumDevices }}</p>
						<p class="text-base">Disks: {{  getNumDisks}}</p>
						<p class="text-base">Datasets: {{ getNumDatasets }}</p>
					</div>

				
			</div>

			<div v-if="navTag == 'topology'" class="mt-2 grid grid-cols-4">
				<!-- 
					PoolName    PoolCapacity      AvgTemp?

					Virtual Devices (Cards)
					with Disks contained underneath
						Disks have :
							alias, name, model/serial, temp, status
				 -->
				 <div class="mt-2 col-span-4">
					<div class="grid grid-cols-4">
						<div v-for="(vdev, vDevIdx) in props.pool.vdevs" :key="vDevIdx" class=" divide-y divide-gray-200 rounded-lg shadow">
							<label :for="getIdKey(`vdev-${vDevIdx}`)">{{ props.pool.vdevs[vDevIdx].name }}</label>
							<div v-for="(disk, diskIdx) in props.pool.vdevs[vDevIdx].disks" :key="diskIdx" class="col-span-1 rounded-lg ">
								<label :for="getIdKey(`vdev-${vDevIdx}-disk-${diskIdx}`)">
									<h3 class="truncate text-sm font-medium text-gray-900">{{ disk.name }}</h3> 
									<p class="mt-1 truncate text-sm text-gray-500">Serial #: {{ disk.serial }}</p>
									<p class="mt-1 truncate text-sm text-gray-500">{{ disk.sd_path }}</p>
								</label>

							</div>
						</div>
					</div>
				 </div>
			
			</div>
			
			<div v-if="navTag == 'snapshots'">
				<!-- PoolName   
					(NO snapshots found if none found)

					Filesystems with snapshots + button for menu (menu should have - clone, rename, roll back, destroy)
					
				-->
			
			</div>

			<div v-if="navTag == 'settings'">
				<!-- not sure what to put here, probably fields so the user can change the configuration of the pool -->
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

interface PoolDetailsProps {
	pool: PoolData;
}

const props = defineProps<PoolDetailsProps>();

const visualCapacity = computed(() => {
	return 314 - (props.pool.properties.capacity * 100) / 314;
})

const show = ref(true);
const navTag = ref('stats');

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

const getNumDevices = props.pool.vdevs.length;

const getNumDisks = computed(() =>  {
	let disks = 0;
	props.pool.vdevs.forEach(vdev => {
		vdev.disks.forEach(disk => {
			disks++;
		});
	});
	return disks;
});

const getNumDatasets = computed(() => {
	let datasets = 0;
	//use recursion to check root_dataset for children and those children for children etc. 
	
	return datasets;
});

const currentNavigationItem = computed<NavigationItem | undefined>(() => navigation.find(item => item.current));

const navigationCallback: NavigationCallback = (item: NavigationItem) => {
	navTag.value = item.tag;
};

const navigation = reactive<NavigationItem[]>([
	{ name: 'Stats', tag: 'stats', current: computed(() => navTag.value == 'stats') as unknown as boolean, show: true, },
	{ name: 'Topology', tag: 'topology', current: computed(() => navTag.value == 'topology') as unknown as boolean, show: true, },
	{ name: 'Snapshots', tag: 'snapshots', current: computed(() => navTag.value == 'snapshots') as unknown as boolean, show: true, },
	{ name: 'Settings', tag: 'settings', current: computed(() => navTag.value == 'settings') as unknown as boolean, show: true, },
].filter(item => item.show));

const getIdKey = (name: string) => `${name}`;
</script>
