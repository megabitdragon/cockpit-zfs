<template>
	<Modal>
		<template v-slot:title>
			<Navigation :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
		</template>
		<template v-slot:content>
			<div v-if="navTag == 'profile'">
				 <!-- PoolName               PoolCapacity Bar/Circle              Avg.Disk Temp per Disk in Pool? or another stat       Refresh Btn-->
					<!-- Size: fullsize of pool storage                               Health: STATUS (checkmark if good)
							Used: allocated storage                                       Errors: if any errors show here, if none show 'None currently'
							Free: remaining free space                                     @timestamp (to show current time page is accessed)
							Fragmentation? 

							# of Devices?                               # of Datasets?
							# of Disks?
					-->
					<div class="flex items-center flex-wrap max-w-md px-10 bg-white rounded-2xl h-20">
						<div class="flex items-center justify-center -m-6 overflow-visible bg-white rounded-full">
							<svg class="w-32 h-32 transform translate-x-1 translate-y-1" aria-hidden="true">
								<circle class="text-gray-300" stroke-width="10" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
								<circle class="text-green-600" stroke-width="10" stroke-dasharray="314" :stroke-dashoffset=visualCapacity stroke-linecap="round" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
							</svg>
							<span class="absolute text-2xl text-green-700">{{props.pool.properties.capacity}}%</span>
						</div>
						<p class="ml-10 font-medium text-gray-600 sm:text-xl">{{ props.pool.name }}</p>
						<span class="ml-auto text-xl font-medium text-green-600 hidden sm:block">{{ props.pool.properties.size }}</span>
					</div>
					<div class="mt-7">
						<p>Health: {{ props.pool.status }}</p>
						<p>Errors: None currently detected.</p>
						<p>@ time+date</p>
					</div>

					<div>
						<p>Size: {{ props.pool.properties.size }}</p>
						<p>Used: {{ props.pool.properties.allocated }}</p>
						<p>Free: {{ props.pool.properties.free }}</p>
					</div>
			</div>

			<div v-if="navTag == 'topology'">
				<!-- 
					PoolName    PoolCapacity      AvgTemp?

					Virtual Devices (Cards)
					with Disks contained underneath
						Disks have :
							alias, name, model/serial, temp, status
				 -->
				 <div>
					<ul :id="getIdKey('available-disk-list')" role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<li v-for="(vdev, vDevIdx) in props.pool.vdevs" :key="vDevIdx" class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow" >
							<li v-for="(disk, diskIdx) in props.pool.vdevs[vDevIdx].disks" :key="diskIdx" class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
								<div class="flex w-full h-full border border-gray-200 rounded dark:border-gray-700">
									<label :for="getIdKey(`vdev-${vDevIdx}-disk-${diskIdx}`)" class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> 
										<h3 class="truncate text-sm font-medium text-gray-900">{{ disk.name }}</h3>
										<!-- <span class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ disk.status }}</span> -->
										<p class="mt-1 truncate text-sm text-gray-500">{{ disk.type }}</p>
										<p class="mt-1 truncate text-sm text-gray-500">Serial #: {{ disk.serial }}</p>
										<p class="mt-1 truncate text-sm text-gray-500">{{ disk.sd_path }}</p>
									</label>  
								</div>
							</li>
						</li>
					</ul>
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
const navTag = ref('profile');

const currentNavigationItem = computed<NavigationItem | undefined>(() => navigation.find(item => item.current));

const navigationCallback: NavigationCallback = (item: NavigationItem) => {
	navTag.value = item.tag;
};

const navigation = reactive<NavigationItem[]>([
	{ name: 'Profile', tag: 'profile', current: computed(() => navTag.value == 'profile') as unknown as boolean, show: true, },
	{ name: 'Topology', tag: 'topology', current: computed(() => navTag.value == 'topology') as unknown as boolean, show: true, },
	{ name: 'Snapshots', tag: 'snapshots', current: computed(() => navTag.value == 'snapshots') as unknown as boolean, show: true, },
	{ name: 'Settings', tag: 'settings', current: computed(() => navTag.value == 'settings') as unknown as boolean, show: true, },
].filter(item => item.show));

const getIdKey = (name: string) => `${name}`;
</script>
