<template>
  <Modal>
	<template v-slot:title>
	  <Navigation :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
	</template>
	<template v-slot:content>
	  <div v-if="navTag == 'profile'">
		 <!-- DiskName               DiskCapacity Bar/Circle              Avg.Disk Temp per Disk in Disk? or another stat       Refresh Btn-->
		  <!-- Size: fullsize of Disk storage                               Health: STATUS (checkmark if good)
			  Used: allocated storage                                       Errors: if any errors show here, if none show 'None currently'
			  Free: remaining free space                                     @timestamp (to show current time page is accessed)
			  Fragmentation? 

			  # of Devices?                               # of Datasets?
			  # of Disks?
		  -->
	  </div>

	  <div v-if="navTag == 'topology'">
		<!-- 
		  DiskName    DiskCapacity      AvgTemp?

		  Virtual Devices (Cards)
		  with Disks contained underneath
			Disks have :
			  alias, name, model/serial, temp, status
		 -->
	  
	  </div>
	  
	  <div v-if="navTag == ''">
	  
	  
	  </div>

	  <div v-if="navTag == 'settings'">
		
	  </div>

	  <!-- testing a radial progressbar to show capacity of disk -->
	  <div class="flex items-center flex-wrap max-w-md px-10 bg-white shadow-xl rounded-2xl h-20">
		<div class="flex items-center justify-center -m-6 overflow-hidden bg-white rounded-full">
		  <svg class="w-32 h-32 transform translate-x-1 translate-y-1" aria-hidden="true">
			<circle class="text-gray-300" stroke-width="10" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
			<circle class="text-red-600" stroke-width="10" stroke-dasharray="314" stroke-dashoffset="94" stroke-linecap="round" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
		  </svg>
		  <span class="absolute text-2xl text-red-700">90%</span>
		</div>
		<p class="ml-10 font-medium text-gray-600 sm:text-xl">Storage</p>
		<span class="ml-auto text-xl font-medium text-red-600 hidden sm:block">20GB</span>
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
</script>
