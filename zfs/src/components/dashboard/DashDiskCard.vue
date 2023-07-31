<template>
	<Card class="overflow-visible bg-plugin-header rounded-md border border-default">
		<template v-slot:title>
			<div class="flex flex-row justify-between">
				<div class="pr-2 text-default">
					{{ props.disk.name }}
				</div>
				<div class="px-1">
					<img class="w-4 h-4 min-w-4 min-h-4" src="../../../public/icons/success.svg">
				</div>
				<Menu as="div" class="relative inline-block text-right">
					<div>
						<MenuButton class="rounded-full bg-accent text-muted hover:text-gray-600">
							<span class="sr-only">Open options</span>
							<EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
						</MenuButton>
					</div>

					<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
						<MenuItems class="absolute right-0 z-10 -mt-1 w-max origin-top-left rounded-md bg-accent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
							<div class="py-1">
								<MenuItem v-slot="{ active }">
									<a href="#" @click="showDetails(props.disk)" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Disk Details</a>
								</MenuItem>
								<!-- <MenuItem v-slot="{ active }">
									<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Clear Disk Errors</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Detach Disk</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Offline Disk</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">Replace Disk</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="#" :class="[active ? 'bg-default text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">TRIM Disk</a>
								</MenuItem> -->
								<MenuItem v-slot="{ active }">
									<a href="#" @click="clearPartAndRefreshDisks(props.disk)" :class="[active ? 'bg-danger text-default' : 'text-muted',, 'block px-4 py-2 text-sm']">wipefs -a</a>
								</MenuItem>
							</div>
						</MenuItems>
					</transition>
				</Menu>
			</div>
			<!-- <div>
				Member of {{ props.disk.vDevName }} in {{ props.disk.poolName }}
			</div> -->
			<div>
				<span class="text-success">{{ props.disk.status }}</span>
			</div>
			<div>
				<span>{{ props.disk.type }}</span>
			</div>
			</template>
			<template v-slot:content>
			<div>
				<span>{{props.disk.temp}}</span>
			</div>
			<div>
				<span class="text-base font-medium text-success">Space&nbsp;&nbsp;&nbsp;</span>
				<span class="text-sm font-medium text-success">0%</span>
			</div>
			<!-- <div class="w-full bg-well rounded-full h-2.5">
				<div v-if="capacity <= 85" class="bg-green-600 h-2.5 rounded-full" :style="{width: `${props.capacity}%`}"></div>
			</div> -->
		</template>
		<template v-slot:footer>
			<div>
				Used X TB
			</div>
			<div>
				Free Y TB
			</div>
			<div>
				<b>Total: {{ props.disk.capacity }}</b>
			</div>
		</template>
	</Card>

	<div v-if="showDiskDetails">
		<DiskDetail :disk="selectedDisk!" @close="showDiskDetails = false" :isModalChild="false"/>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, provide, inject, Ref } from 'vue';
import { EllipsisVerticalIcon} from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { loadDisks, loadDatasets, loadDisksThenPools } from '../../composables/loadData';
import { clearPartitions } from "../../composables/disks";
import DiskDetail from '../pools/DiskDetail.vue';
import Card from '../common/Card.vue';

interface DashDiskCardProps {
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

const props = defineProps<DashDiskCardProps>();

const showDiskDetails = ref(false);

const selectedDisk = ref<DiskData>();

const pools = inject<Ref<PoolData[]>>('pools')!;
const disks = inject<Ref<DiskData[]>>('disks')!; 
const disksLoaded = inject<Ref<boolean>>('disks-loaded')!;

// console.log("Props.Disk");
// console.log(props.disk);

//method to show Disk details when button is clicked
function showDetails(disk) {
	getDiskFromPool(disk);
	selectedDisk.value = disk;
	console.log(selectedDisk);
	showDiskDetails.value = true;
}

function getDiskFromPool(disk) {
  pools.value.some((pool) => {
    return pool.vdevs.some((vDev) => {
      return vDev.disks.some((vDisk) => {
        if (vDisk.name === disk.name) {
          disk.poolName = vDisk.poolName;
          disk.vDevName = vDisk.vDevName;
          return true; // To break the loop once a matching disk is found
        }
      });
    });
  });
}

async function clearPartAndRefreshDisks(disk) {
	disksLoaded.value = false;
	await clearPartitions(disk);
	disks.value = [];
	await loadDisks(disks);
	disksLoaded.value = true;
}

</script>