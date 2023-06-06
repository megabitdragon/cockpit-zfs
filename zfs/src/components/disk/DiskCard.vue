<template>
<Card class="mt-2 mb-4">
  <template v-slot:title>
    <tr>
      <td>
        <img v-if="spaceUsed <= 85" src="../../../public/icons/success.svg">
        <img v-if="spaceUsed > 85" src="../../../public/icons/warning.svg">
      </td>
      <td><div>{{ props.name }}</div></td>
      <td><div><button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<EllipsisVerticalIcon/></button></div></td>
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
      Used:  {{ usedSpaceAmount.toFixed(2)}} TB
    </tr>
    <tr>
      Free:  {{ freeSpaceAmount.toFixed(2)}} TB
    </tr>
    <tr>
      <b>Total:  {{ props.totalSize }} TB</b>
    </tr>
  </template>
</Card>
</template>

<script setup lang="ts">
import { reactive, ref, computed, provide } from 'vue';
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import Card from '../common/Card.vue';

interface DiskCardProps {
  name: string,
  status: string,
  spaceUsed: number,
  type: string,
  member?: string,
  totalSize: number,
}

const usedSpaceAmount = computed(() => {
  const total = props.totalSize * (props.spaceUsed / 100);
  return total;
});

const freeSpaceAmount = computed(() => {
  const total = props.totalSize - usedSpaceAmount.value;
  return total;
});

const props = defineProps<DiskCardProps>();

 </script>