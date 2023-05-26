<template>
  <fieldset>
    <legend class="text-base font-semibold leading-6 text-gray-900">Select Disks</legend>
    <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="(disk, diskIdx) in disks" :key="diskIdx" class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
          <div class="flex w-full items-center justify-between space-x-6 p-6 border border-gray-200 rounded dark:border-gray-700">
            <div class="flex-1 truncate">
              <div class="flex items-center space-x-3">
                <h3 class="truncate text-sm font-medium text-gray-900">{{ disk.name }}</h3>
                <span class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ disk.status }}</span>
              </div>
              <p class="mt-1 truncate text-sm text-gray-500">{{ disk.description }}</p>
            </div>          
              <input :id="`disk-${disk.id}`" type="checkbox" value="" :name="`disk-${disk.id}`" 
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
          </div>
      </li>
    </ul>
  </fieldset>
</template>

<script setup lang="ts">
const disks = [
  { id: 1, name: 'SSD1', status: 'ONLINE', description: '480.1 GB Micron_5300_MTFD (500a075135044d40)'},
  { id: 2, name: 'SSD2' , status: 'ONLINE', description: '480.1 GB Micron_5300_MTFD (500a075135044e7a)'},
  { id: 3, name: 'SSD3' , status: 'ONLINE', description: '480.1 GB Micron_5300_MTFD (500a075135044ad0)'},
  { id: 4, name: 'SSD4' , status: 'ONLINE', description: '480.1 GB Micron_5300_MTFD (500a075135044a73)'},
  { id: 5, name: 'HDD1' , status: 'ONLINE', description: '10TB SPINNYBOY HARD DRIVE'},
]
</script>