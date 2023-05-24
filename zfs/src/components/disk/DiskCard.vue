<template>
  <Card class="mt-2 mb-4">
    <template v-slot:title>
      <tr>
        <td>
          <img src='../../../public/icons/success.svg'>
            <!-- <img :src='props.icon'> -->
            <!-- <img :src="props.spaceUsed <= 85 ? '../../../public/icons/success.svg' : '../../../public/icons/success.svg'"> -->
        </td>
        <td><span>{{ props.name }}</span></td><td><button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<DotsVerticalIcon class="h-3 h-5"/></button></td>
      </tr>
      <tr>
        <span>{{props.status}}</span>
      </tr>
    </template>
    <template v-slot:content>
      <tr>
        <div class="flex justify-between mb-1">
            <span class="text-base font-medium text-green-700 dark:text-white">Space&nbsp; &nbsp;&nbsp;</span>
            <span class="text-sm font-medium text-green-700 dark:text-white">{{props.spaceUsed}}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div class="bg-green-600 h-2.5 rounded-full" :style="{width: `${props.spaceUsed}%`}"></div>
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
 import Card from '../common/Card.vue';
 
 interface DiskCardProps {
   name: string,
   status: string,
   spaceUsed: number,
   icon: string,
 }
 
 const props = defineProps<DiskCardProps>();
 
 </script>