<template>
<Card class="mt-2 mb-4">
  <template v-slot:title>
    <tr>
      <td>
        <img v-if="spaceUsed <= 85" src="../../../public/icons/success.svg">
        <img v-if="spaceUsed > 85" src="../../../public/icons/warning.svg">
      </td>
      <td><span>{{ props.name }}</span></td>
      <td><button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<DotsVerticalIcon class="h-3"/></button></td>
    </tr>
    <tr>
      <span>{{props.status}}</span>
      <span>&nbsp;&nbsp;{{props.type}}</span>
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
      Used&nbsp; &nbsp;&nbsp;X TB
    </tr>
    <tr>
      Free&nbsp; &nbsp;&nbsp;Y TB
    </tr>
    <tr>
      <b>Total&nbsp; &nbsp;&nbsp;Z TB</b>
    </tr>
  </template>
</Card>
</template>

<script setup lang="ts">
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
// import {CheckCircleIcon, DotsVerticalIcon, ExclamationCircleIcon, RefreshIcon, QuestionMarkCircleIcon} from '@heroicons/vue/outline';
import Card from '../common/Card.vue';

interface DiskCardProps {
  name: string,
  status: string,
  spaceUsed: number,
  type: string;
  member?: string;
}

const props = defineProps<DiskCardProps>();

 </script>