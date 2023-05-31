<template>
  <fieldset>
    <!-- Virtual Device (Select) -->
    <div v-if="props.isPrimary">
      <label for="virtual-device" class="block text-sm font-medium leading-6 text-gray-900">Type</label>
      <select id="virtual-device" name="virtual-device" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
        <option>Disk</option>
        <option>Mirror</option>
        <option>RaidZ1</option>
        <option selected>RaidZ2</option>
        <option>RaidZ3</option>  
      </select>
    </div>
    <div v-if="!props.isPrimary">
      <label for="virtual-device" class="block text-sm font-medium leading-6 text-gray-900">Type</label>
      <select id="virtual-device" name="virtual-device" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
        <option selected>Cache</option>
        <option>Log</option> 
        <option>Special</option> 
      </select>
    </div>

    <!-- If (Log, Special) -->
    <!-- <div>
      <label for="mirror-enabled" class="mt-1 block text-sm font-medium leading-6 text-gray-900">X (Mirror)</label>
      <Switch v-model="isMirror" :class="[isMirror ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
        <span class="sr-only">Use setting</span>
        <span :class="[isMirror ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
          <span :class="[isMirror ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
            <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
              <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span :class="[isMirror ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
            <svg class="h-3 w-3 text-slate-600" fill="currentColor" viewBox="0 0 12 12">
              <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
            </svg>
          </span>
        </span>
      </Switch>
    </div> -->

    <!-- Disk ID (Select) -->
    <div>
      <label for="disk-identifier" class="block text-sm font-medium leading-6 text-gray-900">Disk Identifier</label>
      <select id="disk-identifier" name="disk-identifier" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
        <option>Block Device</option>
        <option>Disk</option>
        <option>Hardware Path</option>
        <option selected>Device Alias</option>
      </select>
    </div>

    <label for="disk-list" class="block text-sm font-medium leading-6 text-gray-900">Select Disks</label>
    <ul id="disk-list" role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="(disk, diskIdx) in availDisks" :key="diskIdx" class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
          <div class="flex w-full items-center justify-between space-x-6 p-6 border border-gray-200 rounded dark:border-gray-700">
            <div class="flex-1 truncate">
              <div class="flex items-center space-x-3">
                <h3 class="truncate text-sm font-medium text-gray-900">{{ disk.name }}</h3>
                <span class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ disk.status }}</span>
              </div>
              <p class="mt-1 truncate text-sm text-gray-500">{{ disk.description }}</p>
            </div>          
              <input :id="`disk-${disk.id}`" type="checkbox" value="" :name="`disk-${disk.id}`" 
                class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
          </div>
      </li>
    </ul>

    <!-- Forcefully Add Virtual Device (Toggle) -->
    <div>
      <label for="forcefully-add-vdev" class="mt-1 block text-sm font-medium leading-6 text-gray-900">Forcefully Add Virtual Device</label>
      <Switch v-model="forcefulAddVDevEnabled" :class="[forcefulAddVDevEnabled ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
        <span class="sr-only">Use setting</span>
        <span :class="[forcefulAddVDevEnabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
          <span :class="[forcefulAddVDevEnabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
            <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
              <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span :class="[forcefulAddVDevEnabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
            <svg class="h-3 w-3 text-slate-600" fill="currentColor" viewBox="0 0 12 12">
              <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
            </svg>
          </span>
        </span>
      </Switch>
    </div>

  </fieldset>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';

interface VDevsProps {
  // idKey: string;
  // dataKey: string;
  isPrimary: boolean;
}

const props = defineProps<VDevsProps>();

const availDisks = inject<Disk[]>("available_disks");

const isMirror = ref(false);

const forcefulAddVDevEnabled = ref(false);
</script>