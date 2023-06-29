<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="button-group-row">
        <button id="createPool" class="btn btn-primary object-left justify-start" @click="showConfig = true">Create Storage Pool</button>
        <button id="importPool" class="btn btn-secondary object-left justify-start" @click="" disabled>Import Storage Pool</button>
        <button id="refreshPools" class="btn btn-secondary object-right justify-end" @click="" disabled><ArrowPathIcon class="w-5 h-5"/></button>
    </div>

    <div class="mt-8">
      <div class="-mx-4 -my-2 overflow-visible sm:-mx-6 lg:-mx-8">

        <div class="inline-block min-w-full min-h-full py-2 align-middle">
          <div class="overflow-y-visible shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Used (%)</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Used</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Free</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th scope="col" class="relative px-3 py-3.5 sm:pr-6 lg:pr-8">
                    <span class="sr-only"></span>
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-x divide-gray-200 bg-white grid grid-cols-7 grid-flow-col">
                <template v-for="pool, poolIdx in poolData" :key="poolIdx">
                  <Accordion class="ml-4">
                    <template v-slot:title>
                      <tr :key="poolIdx">
                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900"> 
                          <a href="#" class="text-btn-primary hover:text-btn-primary">
                            {{ poolData[poolIdx].name }}
                          </a>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ poolData[poolIdx].status }}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> 
                          <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                              <div v-if="poolData[poolIdx].properties.capacity! <= 85" class="bg-green-600 text-s font-medium text-white text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div>
                              <div v-if="poolData[poolIdx].properties.capacity! > 85" class="bg-red-600 text-s font-medium text-white text-center p-0.5 leading-none rounded-full" :style="{width: `${poolData[poolIdx].properties.capacity}%`}">{{ poolData[poolIdx].properties.capacity }}%</div>
                          </div>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ poolData[poolIdx].properties.allocated }}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ poolData[poolIdx].properties.free }}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ poolData[poolIdx].properties.size }}</td>
                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          <div id="menu-btn" class="">
                            <Menu as="div" class="relative inline-block text-left">
                              <div>
                                <MenuButton class="flex items-center rounded-full bg-white-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                  <span class="sr-only">Open options</span>
                                  <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                                </MenuButton>
                              </div>

                              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                                <MenuItems class="absolute right-0 z-10 mt-2 w-flex origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <div class="py-1">
                                    <MenuItem v-slot="{ active }">
                                      <a href="#" @onClick="showPoolDetails = true" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Pool Details</a>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                      <a href="#" @onClick="" :class="[active ? 'bg-red-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Destroy Pool</a>
                                    </MenuItem>
                                  </div>
                                </MenuItems>
                              </transition>
                            </Menu>
                          </div>
                        </td>
                      </tr>
                    </template>
                    <template v-slot:content>
                      <tr v-for="vDev, vDevIdx in poolData[poolIdx].vdevs" :key="vDevIdx">
                        <Accordion class="ml-4">
                          <template v-slot:title>
                            <td>
                              {{  poolData[poolIdx].vdevs[vDevIdx].name }}
                            </td>
                          </template>
                          <template v-slot:content>
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
                                <tr v-for="disk, diskIdx in poolData[poolIdx].vdevs[vDevIdx].disks" :key="diskIdx">
                                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"> 
                                    <a href="#" class="text-btn-primary hover:text-btn-primary">
                                      {{ disk.name }}
                                    </a>
                                  </td>
                                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ disk.status }}</td>
                                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> 
                                    <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                      
                                    </div>
                                  </td>
                                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">used</td>
                                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">free</td>
                                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">total</td>
                                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                                    
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </template>
                        </Accordion>
                      </tr>
                    </template>
                  </Accordion>
                </template>
              </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showConfig">
    <CreatePool @close="showConfig = false"/>
  </div>

  <div v-if="showDiskDetails">
    <DiskDetail @close="showDiskDetails = false"/>
  </div>

  <div v-if="showPoolDetails">
    <PoolDetail :pool="selectedPool" @close="showPoolDetails = false"/>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, Ref } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import CreatePool from '../new-pool-wizard/CreatePool.vue';
import Accordion from '../common/Accordion.vue';
import DiskDetail from "../disk/DiskDetail.vue";
import PoolDetail from "./PoolDetail.vue";

const poolData = inject<Ref<PoolData[]>>("pools")!;

// console.log(poolData.value);

const showConfig = ref(false);
const showDiskDetails = ref(false);
const showPoolDetails = inject('show-pool-deets')!;
const selectedPool = inject<Ref<PoolData>>('selected-pool')!;
</script>