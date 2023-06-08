<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="button-group-row">
        <button id="createPool" class="btn btn-primary object-left justify-start" @click="showConfig = true">Create Storage Pool</button>
        <button id="importPool" class="btn btn-secondary object-left justify-start" @click="" disabled>Import Storage Pool</button>
        <button id="refreshPools" class="btn btn-secondary object-right justify-end" @click="" disabled><ArrowPathIcon class="h-3 h-5"/></button>
    </div>

    <div class="mt-8">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">

        
        <div class="inline-block min-w-full min-h-full py-2 align-middle">
          <div class="overflow-y-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
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

              <tbody class="divide-y divide-x divide-gray-200 bg-white">
                <tr v-for="pool in pools" :key="pool.name">
                  
                  <Accordion class="ml-4">


                    <template v-slot:title>
                      <td scope="col" class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"> 
                        <a href="#" class="text-btn-primary hover:text-btn-primary">
                          {{ pool.name }}
                        </a>
                      </td>
                      <td scope="col" class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ pool.status }}</td>
                      <td cscope="col" lass="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> 
                        <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                            <div v-if="pool.usagePercent! <= 85" class="bg-green-600 text-s font-medium text-white text-center p-0.5 leading-none rounded-full" :style="{width: `${pool.usagePercent}%`}">{{ pool.usagePercent }}%</div>
                            <div v-if="pool.usagePercent! > 85" class="bg-red-600 text-s font-medium text-white text-center p-0.5 leading-none rounded-full" :style="{width: `${pool.usagePercent}%`}">{{ pool.usagePercent }}%</div>
                        </div>
                      </td>
                      <td scope="col" class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Y TB</td>
                      <td scope="col" class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">X TB</td>
                      <td scope="col" class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Z TB</td>
                      <td scope="col" class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <Menu as="div" class="relative inline-block text-left">
                          <div>
                            <MenuButton class="flex items-center rounded-full bg-white-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                              <span class="sr-only">Open options</span>
                              <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                            </MenuButton>
                          </div>

                          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                            <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div class="py-1">
                                <MenuItem v-slot="{ active }">
                                  <a href="#" @onClick="showDiskDetails = true" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Disk Details</a>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                  <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Configure Settings</a>
                                </MenuItem>
                              </div>
                            </MenuItems>
                          </transition>
                        </Menu>
                      </td>
                    </template>

                    <template v-slot:content>
                      <tr v-for="vDev in pool.vdevs">
                        <Accordion class="ml-4">
                          <template v-slot:title>
                            <td>
                              {{ vDev.name }}
                            </td>
                          </template>
                          
                          <template v-slot:content>
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
                                <tr v-for="disk in vDev.disks" :key="disk.name">
                                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"> 
                                    <a href="#" class="text-btn-primary hover:text-btn-primary">
                                      {{ disk.name }}
                                    </a>
                                  </td>
                                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ disk.status }}</td>
                                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ disk.pool || '~no pool~' }}</td>
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
                                    <Menu as="div" class="relative inline-block text-left">
                                      <div>
                                        <MenuButton class="flex items-center rounded-full bg-white-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                          <span class="sr-only">Open options</span>
                                          <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                                        </MenuButton>
                                      </div>

                                      <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                                        <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                          <div class="py-1">
                                            <MenuItem v-slot="{ active }">
                                              <a href="#" @onClick="showDiskDetails = true" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Disk Details</a>
                                            </MenuItem>
                                            <MenuItem v-slot="{ active }">
                                              <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Configure Settings</a>
                                            </MenuItem>
                                          </div>
                                        </MenuItems>
                                      </transition>
                                    </Menu>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </template>
                        </Accordion>
                      </tr>
                    </template>


                  </Accordion>
                  
                </tr>
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
</template>

<script setup lang="ts">
import { ref, inject, Ref } from "vue";
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import CreatePool from '../new-pool-wizard/CreatePool.vue';
import Accordion from '../common/Accordion.vue';
import DiskDetail from "../disk/DiskDetail.vue";

const pools = inject<Ref<Pool[]>>("pools")!;

console.log(pools.value);

const showConfig = ref(false);
const showDiskDetails = ref(false);

</script>