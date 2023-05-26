<template>
  <div v-if="!showConfig" class="px-4 sm:px-6 lg:px-8">
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <div class="button-group-row">
          <button id="createPool" class="btn btn-primary object-left justify-start" @click="showConfig = true">Create Storage Pool</button>
          <button id="importPool" class="btn btn-secondary object-left justify-start" @click="" disabled>Import Storage Pool</button>
          <button id="refreshPools" class="btn btn-secondary object-right justify-end"><ArrowPathIcon class="h-3 h-5"/></button>
      </div>
    </div>

    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
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
                <tr v-for="pool in pools" :key="pool.name">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"> 
                    <a href="#" class="text-btn-primary hover:text-btn-primary">
                      {{ pool.name }}
                    </a>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ pool.status }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> 
                    <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                        <div v-if="pool.spaceUsedPercent <= 85" class="bg-green-600 text-s font-medium text-white text-center p-0.5 leading-none rounded-full" :style="{width: `${pool.spaceUsedPercent}%`}">{{ pool.spaceUsedPercent }}%</div>
                        <div v-if="pool.spaceUsedPercent > 85" class="bg-red-600 text-s font-medium text-white text-center p-0.5 leading-none rounded-full" :style="{width: `${pool.spaceUsedPercent}%`}">{{ pool.spaceUsedPercent }}%</div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ pool.spaceUsed }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ pool.spaceFree }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ pool.spaceTotal }}</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                    <a href="#" class="text-btn-primary hover:text-btn-primary">
                      <EllipsisVerticalIcon class="h-3 h-5"/><span class="sr-only">, {{ pool.name }}</span>
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
    <CreatePool/>
  </div>  
</template>

<script setup lang="ts">
import { ref } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import CreatePool from './CreatePool.vue';
import Modal from "../common/Modal.vue";

const pools = [
  { name: 'Pool1', status: 'ONLINE', spaceUsedPercent: 45,  spaceUsed: "X TB", spaceFree: "Y TB", spaceTotal: "Z TB"},
  { name: 'Pool2', status: 'ONLINE', spaceUsedPercent: 88,  spaceUsed: "X TB", spaceFree: "Y TB", spaceTotal: "Z TB"},
  { name: 'Pool3', status: 'ONLINE', spaceUsedPercent: 50,  spaceUsed: "X TB", spaceFree: "Y TB", spaceTotal: "Z TB"},
  { name: 'Pool4', status: 'ONLINE', spaceUsedPercent: 75,  spaceUsed: "X TB", spaceFree: "Y TB", spaceTotal: "Z TB"},
  { name: 'Pool5', status: 'ONLINE', spaceUsedPercent: 13,  spaceUsed: "X TB", spaceFree: "Y TB", spaceTotal: "Z TB"},
  { name: 'Pool6', status: 'ONLINE', spaceUsedPercent: 66,  spaceUsed: "X TB", spaceFree: "Y TB", spaceTotal: "Z TB"},
  { name: 'Pool7', status: 'ONLINE', spaceUsedPercent: 25,  spaceUsed: "X TB", spaceFree: "Y TB", spaceTotal: "Z TB"},
]

const showConfig = ref(false);

</script>