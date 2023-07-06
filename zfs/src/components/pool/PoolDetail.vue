<template>
	<Modal>
		<template v-slot:title>
			<Navigation :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
		</template>
		<template v-slot:content>
			<div v-if="navTag == 'stats'" class="mt-6 grid grid-cols-4">
				<div class="col-span-2">
					<div :id="getIdKey('pool-visual-capacity')" name="pool-visual-capacity" class="flex items-center flex-wrap max-w-md px-10 bg-white shadow rounded-2xl h-20">
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
					<p :id="getIdKey('pool-health')" name="pool-health" class="text-lg">Health: <span class="text-green-700">{{ props.pool.status }}</span></p>
					<p :id="getIdKey('pool-errors')" name="pool-errors" class="text-sm">Errors: None currently detected - {{ getTimestampString }}</p>
				</div>

				<div class="mt-2 col-span-1 col-start-3 row-start-2">
					<p :id="getIdKey('pool-size')" name="pool-size" class="text-base">Size: {{ props.pool.properties.size }}</p>
					<p :id="getIdKey('pool-allocated')" name="pool-allocated" class="text-base">Used: {{ props.pool.properties.allocated }}</p>
					<p :id="getIdKey('pool-free')" name="pool-free" class="text-base">Free: {{ props.pool.properties.free }}</p>
				</div>
				<div class="mt-2 col-span-1 col-start-4 row-start-2">
					<p :id="getIdKey('pool-devices')" name="pool-devices" class="text-base">Devices: {{ getNumDevices }}</p>
					<p :id="getIdKey('pool-disks')" name="pool-disks" class="text-base">Disks: {{  getNumDisks}}</p>
					<p :id="getIdKey('pool-datasets')" name="pool-datasets" class="text-base">Datasets: {{ getNumDatasets }}</p>
				</div>
			</div>

			<div v-if="navTag == 'topology'" class="mt-2 grid grid-cols-4 grid-flow-col">
				<div v-for="vDev, vDevIdx in props.pool.vdevs" :key="vDevIdx" class="p-2 m-2 rounded-md border border-slate-100">
					<legend class="mb-1 text-base font-semibold leading-6 text-gray-900">{{ vDev.name }}</legend>
					<div v-for="disk, diskIdx in vDev.disks" :key="diskIdx" class="m-1 col-span-1">
						<PoolDetailDiskCard :disk="vDev.disks[diskIdx]"/>
					</div>
				</div>
			
			</div>
			
			<div v-if="navTag == 'snapshots'">
				<!-- PoolName   
					(NO snapshots found if none found)

					Create Snapshot button
					Filesystems with snapshots + button for menu (menu should have - clone, rename, roll back, destroy)
					
				-->
			<p>COMING SOON TO A ZPOOL NEAR YOU</p>
			</div>

			<div v-if="navTag == 'settings'">
				<div class="grid grid-cols-2">
					<div class="mt-2 col-span-1 col-start-1 row-start-1">
						<p :id="getIdKey('settings-pool-name')" name="settings-pool-name" class="text-base text-gray-700">Pool</p><p>{{ props.pool.name }}</p>
					</div>
					<div class="mt-2 col-span-1 col-start-1 row-start-2">
						<p :id="getIdKey('settings-pool-readonly')" name="settings-pool-readonly" class="text-base text-gray-700">Read Only</p><p>No</p>
					</div>
					<div class="mt-2 col-span-1 col-start-2 row-start-1">
						<p :id="getIdKey('settings-pool-guid')" name="settings-pool-guid" class="text-base text-gray-700">GUID</p><p>{{ props.pool.guid }}</p>
					</div>
					<div class="mt-2 col-span-1 col-start-2 row-start-2">
						<button :id="getIdKey('settings-pool-guid-regen-btn')" name="settings-pool-guid-regen-btn" class="mt-1 col-start-3 row-start-1 btn btn-primary">Regenerate Pool GUID</button>
					</div>
					<div class="mt-2 col-span-1 col-start-1 row-start-3">
						<label :for="getIdKey('settings-pool-sector-size')" class="block text-base leading-6 text-gray-700">Sector Size</label>
						<select :id="getIdKey('settings-pool-sector-size')" name="pool-sector-size" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
							<option value="auto">Auto Detect</option>
							<option value="512b">512 B</option>
							<option selected value="4kib">4 KiB</option>
							<option value="8kib">8 KiB</option>
							<option value="16kib">16 KiB</option>
							<option value="32kib">32 KiB</option>
							<option value="64kib">64 KiB</option>
						</select>
					</div>
					<div class="mt-2 col-span-1 col-start-2 row-start-3">
						<label :for="getIdKey('settings-pool-fail-mode')" class="block text-base leading-6 text-gray-700">Fail Mode</label>
						<select :id="getIdKey('settings-pool-fail-mode')" name="pool-fail-mode" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
							<option value="wait">Wait</option>
							<option value="continue">Continue</option>
							<option value="panic">Panic</option>
						</select>
					</div>
					<div class="mt-2 col-span-2 col-start-1 row-start-4">
						<p :for="getIdKey('settings-pool-comment')" class="text-base text-gray-700">Comment</p>
						<input :id="getIdKey('settings-pool-comment')" name="setting-pool-comment" placeholder="Enter a comment here" type="text" class="mt-1 block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6"/>
					</div>
					
				</div>
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
import PoolDetailDiskCard from '../disk/PoolDetailDiskCard.vue';

interface PoolDetailsProps {
	pool: PoolData;
}

const props = defineProps<PoolDetailsProps>();

const visualCapacity = computed(() => {
	return 314 - (props.pool.properties.capacity * 100) / 314;
});

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
