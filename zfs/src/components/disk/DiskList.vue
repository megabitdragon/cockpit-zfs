<template>
  <div class="px-4 sm:px-6 lg:px-8">

    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pool</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Used (%)</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Used</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Free</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                    <span class="sr-only"></span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="disk in disks" :key="disk.name">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"> 
                    <a href="#" class="text-btn-primary hover:text-btn-primary">
                      {{ disk.name }}
                    </a>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ disk.status }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ disk.member || '~no pool~' }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> 
                    <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                        <div v-if="disk.usagePercent! <= 85" class="bg-green-600 text-s font-medium text-white text-center p-0.5 leading-none rounded-full" :style="{width: `${disk.usagePercent}%`}">{{ disk.usagePercent }}%</div>
                        <div v-if="disk.usagePercent! > 85" class="bg-red-600 text-s font-medium text-white text-center p-0.5 leading-none rounded-full" :style="{width: `${disk.usagePercent}%`}">{{ disk.usagePercent }}%</div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ (disk.totalSize! * (disk.usagePercent! / 100)).toFixed(2) }} TB</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ (disk.totalSize! - (disk.totalSize! * (disk.usagePercent! / 100))).toFixed(2) }} TB</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ disk.totalSize }} TB</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                    <a href="#" class="text-btn-primary hover:text-btn-primary">
                      <EllipsisVerticalIcon class="h-3 h-5"/><span class="sr-only">, {{ disk.name }}</span>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showConfig">
    <CreateDisk @close="showConfig = false"/>
  </div>  
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

interface DiskListProps {
  disks: Disk[];
}

const props = defineProps<DiskListProps>();

// const usedSpaceAmount = computed(() => {
//   const total = props.totalSize * (props.spaceUsed / 100);
//   return total;
// });

// const freeSpaceAmount = computed(() => {
//   const total = props.totalSize - usedSpaceAmount.value;
//   return total;
// });

const disks = props.disks

const showConfig = ref(false);

</script>