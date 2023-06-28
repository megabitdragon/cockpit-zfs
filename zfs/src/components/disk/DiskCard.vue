<template>
<Card class="mt-2 mb-4">
  <template v-slot:title>
    <tr>
      <td>
        <img v-if="spaceUsed <= 85" src="../../../public/icons/success.svg">
        <img v-if="spaceUsed > 85" src="../../../public/icons/warning.svg">
      </td>
      <td><div>{{ props.name }}</div></td>
      <td>
        <Menu as="div" class="static inline-block text-left">
          <div>
            <MenuButton class="flex items-center rounded-full bg-white-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
              <span class="sr-only">Open options</span>
              <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
            </MenuButton>
          </div>

          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems class="static right-0 z-10 mt-2 w-full origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <a href="#" @onClick="" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Disk Details</a>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </td>
    </tr>
    <tr>
      <div>{{props.status}}</div>
      <div>{{props.type}}</div>
    </tr>
  </template>
  <template v-slot:content>
    <tr>
      <div>
        <span>X° C&nbsp;&nbsp;&nbsp;</span><span>{{ props.member }}</span>
      </div>
      
      <div v-if="spaceUsed <= 85" class="flex justify">
          <span class="text-base font-medium text-green-700 dark:text-white">Space&nbsp;&nbsp;&nbsp;</span>
          <span class="text-sm font-medium text-green-700 dark:text-white">{{props.spaceUsed}}%</span>
      </div>
      <div v-if="spaceUsed > 85" class="flex justify">
          <span class="text-base font-medium text-red-700 dark:text-white">Space&nbsp;&nbsp;&nbsp;</span>
          <span class="text-sm font-medium text-red-700 dark:text-white">{{props.spaceUsed}}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div v-if="spaceUsed <= 85" class="bg-green-600 h-2.5 rounded-full" :style="{width: `${props.spaceUsed}%`}"></div>
          <div v-if="spaceUsed > 85" class="bg-red-600 h-2.5 rounded-full" :style="{width: `${props.spaceUsed}%`}"></div>
      </div>
    </tr>
  </template>
  <template v-slot:footer>
    <tr>
      <!-- Used:  {{ usedSpaceAmount.toFixed(2)}} TB -->
    </tr>
    <tr>
      <!-- Free:  {{ freeSpaceAmount.toFixed(2)}} TB -->
    </tr>
    <tr>
      <b>Total:  {{ props.totalSize }}</b>
    </tr>
  </template>
</Card>
</template>

<script setup lang="ts">
import { reactive, ref, computed, provide } from 'vue';
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import Card from '../common/Card.vue';

interface DiskCardProps {
  name: string,
  status: string,
  spaceUsed: number,
  type: string,
  member?: string,
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

const props = defineProps<DiskCardProps>();

 </script>