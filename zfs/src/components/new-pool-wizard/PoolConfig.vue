<template>
  <div v-if="props.tag ==='name-entry'">
    <legend class="mb-1 text-base font-semibold leading-6 text-gray-900">Name this Pool</legend>
    <input type="text" v-model="poolConfig.name" name="pool-name" id="pool-name" class="mt-1 block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6" placeholder="Pool Name" />
  </div>

  <div v-if="props.tag ==='virtual-devices'">
    <fieldset>
      <legend class="mb-1 text-base font-semibold leading-6 text-gray-900">Create a Virtual Device</legend>
      
      <div v-for="(vDev, vDevIdx) in poolConfig.vdevs" :key="vDevIdx">
          <!-- Virtual Device (Select) -->
          <div>
            <label for="virtual-device" class="block text-sm font-medium leading-6 text-gray-900">Type</label>
            <select id="virtual-device" v-model="poolConfig.vdevs[vDevIdx].type" name="virtual-device" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
              <option v-if="vDevIdx === 0">Disk</option>
              <option v-if="vDevIdx === 0">Mirror</option>
              <option v-if="vDevIdx === 0">RaidZ1</option>
              <option v-if="vDevIdx === 0" selected>RaidZ2</option>
              <option v-if="vDevIdx === 0">RaidZ3</option>  
              <option v-if="vDevIdx !== 0">Cache</option>
              <option v-if="vDevIdx !== 0">Log</option> 
              <option v-if="vDevIdx !== 0">Special</option> 
            </select>
          </div>

          <!-- If (Log, Special) -->
          <!-- <div v-if="newVDev?.type == 'log' || newVDev?.type == 'special'">
            <label for="mirror-enabled" class="mt-1 block text-sm font-medium leading-6 text-gray-900">{{ newVDev!.type }} Mirror</label>
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
          <!-- <div>
            <label for="disk-identifier" class="block text-sm font-medium leading-6 text-gray-900">Disk Identifier</label>
            <select id="disk-identifier" name="disk-identifier" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
              <option>Block Device</option>
              <option>Disk</option>
              <option>Hardware Path</option>
              <option selected>Device Alias</option>
            </select>
          </div> -->

          <label for="available-disk-list" class="block text-sm font-medium leading-6 text-gray-900">Select Disks</label>
          <ul id="available-disk-list" role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="(disk, diskIdx) in availDisks" :key="diskIdx" class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
              <div class="flex w-full h-full border border-gray-200 rounded dark:border-gray-700">
                     
                <label :for="`disk-${disk.id}`" class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> 
                
                  <h3 class="truncate text-sm font-medium text-gray-900">{{ disk.name }}</h3>
                  <span class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ disk.status }}</span>
                   
                  <p class="mt-1 truncate text-sm text-gray-500">{{ disk.description }}</p> 
                  <input :id="`disk-${disk.id}`" v-model="checkedDisks" type="checkbox" :value="`${disk.name}`" :name="`disk-${disk.id}`"
                    class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                </label>  
                 
                  <!-- *^checkbox^* :checked="checkedDisks.includes(disk)" @change="handleDiskCheckboxChange(disk)" -->
              </div>
            </li>
            <!-- <li v-for="(disk, diskIdx) in unAvailDisks" :key="diskIdx" class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
              <div class="flex w-full items-center justify-between space-x-6 p-6 border border-gray-200 rounded dark:border-gray-700">
                <div class="flex-1 truncate">
                  <div class="flex items-center space-x-3">
                    <h3 class="truncate text-sm font-medium text-gray-900">{{ disk.name }}</h3>
                    <span class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ disk.status }}</span>
                  </div>
                  <p class="mt-1 truncate text-sm text-gray-500">{{ disk.description }}</p>
                </div>          
                  <input :id="`disk-${disk.id}`" v-model="poolConfig.vdevs[vDevIdx].disks" type="checkbox" :value="`${disk.name}`" :name="`disk-${disk.id}`"
                    class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
              </div>
            </li> -->
            
          </ul>

          <!-- <div><span><p>Available Disks: {{ availDisks }}</p></span></div> -->
          <div><span><p>Selected Disks: {{ checkedDisks }}</p></span></div>

          <!-- <div><span><p>Unavailable Disks: {{ unAvailDisks }}</p></span></div> -->
          <div><span><p>VDev Disks: {{ poolConfig.vdevs[vDevIdx].disks }}</p></span></div>

          <!-- Forcefully Add Virtual Device (Toggle) -->
          <div>
            <label for="forcefully-add-vdev" class="mt-1 block text-sm font-medium leading-6 text-gray-900">Forcefully Add Virtual Device</label>
            <Switch v-model="vDevConfig.forceAdd" :class="[vDevConfig.forceAdd ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
              <span class="sr-only">Use setting</span>
              <span :class="[vDevConfig.forceAdd ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                <span :class="[vDevConfig.forceAdd ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                    <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <span :class="[vDevConfig.forceAdd ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-slate-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </Switch>
          </div>

          <div class="button-group-row">
            <button id="add-vdev" class="btn btn-primary object-right justify-end" @click="addVDev()">Add VDev</button>
            <button id="remove-vdev" class="btn btn-primary object-right justify-end" @click="removeVDev(vDevIdx)">Remove VDev</button>  
          </div>

      </div>
    </fieldset>
  </div>

  <div v-if=" props.tag ==='pool-settings'">
    <fieldset>
      
      <legend class="mb-1 text-base font-semibold leading-6 text-gray-900">Pool Settings</legend>
      <!-- Sector Size (Select) -->
      <div>
        <label for="sector-size" class="block text-sm font-medium leading-6 text-gray-900">Sector Size</label>
        <select id="sector-size" v-model="poolConfig.settings.sector" name="sector-size" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
          <option>Auto Detect</option>
          <option>512 B</option>
          <option selected>4 KiB</option>
          <option>8 KiB</option>
          <option>16 KiB</option>
          <option>32 KiB</option>
          <option>64 KiB</option>
        </select>
      </div>

      <!-- Record Size (Select) -->
      <div>
        <label for="record-size" class="block text-sm font-medium leading-6 text-gray-900">Record Size</label>
        <select id="record-size" v-model="poolConfig.settings.record" name="record-size" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
          <option>512 B</option>
          <option>4 KiB</option>
          <option>8 KiB</option>
          <option>16 KiB</option>
          <option>32 KiB</option>
          <option>64 KiB</option>
          <option selected>128 KiB</option>
          <option>256 KiB</option>
          <option>512 KiB</option>
          <option>1 MiB</option>
        </select>
      </div>
      
      <!-- LZ4 Compression (Toggle) -->
      <div>
        <label for="lz4-enabled" class="mt-1 block text-sm font-medium leading-6 text-gray-900">LZ4 Compression</label>
        <Switch v-model="poolConfig.settings.compression" :class="[poolConfig.settings.compression ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
          <span class="sr-only">Use setting</span>
          <span :class="[poolConfig.settings.compression ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
            <span :class="[poolConfig.settings.compression ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
              <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span :class="[poolConfig.settings.compression ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
              <svg class="h-3 w-3 text-slate-600" fill="currentColor" viewBox="0 0 12 12">
                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
              </svg>
            </span>
          </span>
        </Switch>
      </div>

      <!-- Advanced Settings (Accordion) -->
      <Accordion>
        <template v-slot:title>
          <span><b>Advanced Settings</b></span>
        </template>
        <template v-slot:content>
          <!-- Deduplication (Toggle) -->
          <div>
            <label for="deduplication-enabled" class="mt-1 block text-sm font-medium leading-6 text-gray-900">Deduplication</label>
            <Switch v-model="poolConfig.settings.deduplication" :class="[poolConfig.settings.deduplication ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
              <span class="sr-only">Use setting</span>
              <span :class="[poolConfig.settings.deduplication ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                <span :class="[poolConfig.settings.deduplication ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                    <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <span :class="[poolConfig.settings.deduplication ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-slate-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </Switch>
          </div>

          <!-- Refreservation (Slider) -->
          <div>
            <label for="steps-range" class="mt-1 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Refreservation</label>
            <input id="steps-range" v-model="poolConfig.settings.refreservation" type="range" min="0" max="20" value="10" step="1" class="mt-1 w-3/4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
            <input id="steps-range" v-model="poolConfig.settings.refreservation" type="number" value="10" class="mt-1 w-3/4 block rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6"/>
          </div>

          <!-- Auto-Expand Pool (Toggle) -->
          <div>
            <label for="auto-expand-enabled" class="mt-1 block text-sm font-medium leading-6 text-gray-900">Auto-Expand Pool (When Larger Devices are Added)</label>
            <Switch v-model="poolConfig.settings.autoExpand" :class="[poolConfig.settings.autoExpand ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
              <span class="sr-only">Use setting</span>
              <span :class="[poolConfig.settings.autoExpand ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                <span :class="[poolConfig.settings.autoExpand ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                    <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <span :class="[poolConfig.settings.autoExpand ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-slate-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </Switch>
          </div>
          
          <!-- Auto-Replace Devices (Toggle) -->
          <div>
            <label for="auto-replace-enabled" class="mt-1 block text-sm font-medium leading-6 text-gray-900">Auto-Replace Devices</label>
            <Switch v-model="poolConfig.settings.autoReplace" :class="[poolConfig.settings.autoReplace ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
              <span class="sr-only">Use setting</span>
              <span :class="[poolConfig.settings.autoReplace ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                <span :class="[poolConfig.settings.autoReplace ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                    <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <span :class="[poolConfig.settings.autoReplace ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-slate-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </Switch>
          </div>
          
          <!-- Auto-TRIM (Toggle) -->
          <div>
            <label for="auto-trim-enabled" class="mt-1 block text-sm font-medium leading-6 text-gray-900">Automatic TRIM</label>
            <Switch v-model="poolConfig.settings.autoTrim" :class="[poolConfig.settings.autoTrim ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
              <span class="sr-only">Use setting</span>
              <span :class="[poolConfig.settings.autoTrim ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                <span :class="[poolConfig.settings.autoTrim ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                    <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <span :class="[poolConfig.settings.autoTrim ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-slate-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </Switch>
          </div>
          
          <!-- Forcefully Create Pool (Toggle) -->
          <div>
            <label for="forcefully-create-pool" class="mt-1 block text-sm font-medium leading-6 text-gray-900">Forcefully Create Storage Pool</label>
            <Switch v-model="poolConfig.settings.forceCreate" :class="[poolConfig.settings.forceCreate ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
              <span class="sr-only">Use setting</span>
              <span :class="[poolConfig.settings.forceCreate ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                <span :class="[poolConfig.settings.forceCreate ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                    <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <span :class="[poolConfig.settings.forceCreate ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-slate-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </Switch>
          </div>
        </template>
      </Accordion>

    </fieldset>
  </div>

  <div v-if=" props.tag ==='file-system'">
    <fieldset>
      <legend class="mb-1 text-base font-semibold leading-6 text-gray-900">File System Settings</legend>
      <FileSystem/>
    </fieldset>
  </div>

  <div v-if=" props.tag ==='review'">
    <fieldset>
      <legend class="mb-1 text-base font-semibold leading-6 text-gray-900">Review Pool Details</legend>
      <ReviewTab/>
    </fieldset>
  </div>

</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch, onMounted } from 'vue';
import { Switch } from '@headlessui/vue';
import Accordion from '../common/Accordion.vue';
import FileSystem from './FileSystem.vue';
import ReviewTab from './ReviewTab.vue';

interface PoolConfigProps {
  tag: string;
}

const props = defineProps<PoolConfigProps>();

const allDisks = inject<Disk[]>("all-disks")!;
const poolConfig = inject<Pool>("pool-config")!;

const checkedDisks = ref<Disk[]>([]);

const availDisks = computed<Disk[]>(() => {
  return allDisks.filter((disk) => disk.available && !checkedDisks.value.includes(disk));
});

const unAvailDisks = computed<Disk[]>(() => {
  return allDisks.filter((disk) => !availDisks.value.find(availDisk => availDisk.name == disk.name) && allDisks.find(disk => disk.member));
});

const vDevConfig = reactive<VirtualDevice>({
  type: 'disk',
  disks: [],
  forceAdd: false,
});

//const isMirror = ref(false);

function addVDev() {
  poolConfig.vdevs.push(vDevConfig);
}

// const handleDiskCheckboxChange = (disk: Disk) => {
//   const index = availDisks.value.findIndex((d) => d.id === disk.id);

//   if (index !== -1) {
//     availDisks.value.find
//     availDisks.value.splice(index, 1);
//   } else {
//     vDevConfig.disks.push(disk);
//   }
// };

watch(checkedDisks, () => {
  // const newVDevDisks = vDevConfig.disks.concat(checkedDisks.value);
  // vDevConfig.disks = newVDevDisks;
  checkedDisks.value.forEach(item => {
    vDevConfig.disks.push(item);
  });
},{deep: true});


function removeVDev(index: number) {
  poolConfig.vdevs = poolConfig.vdevs.filter((_, idx) => idx !== index) ?? [];
}

console.log(checkedDisks.value);
console.log(poolConfig);
//console.log(unAvailDisks);

if (poolConfig.vdevs.length < 1) addVDev();

provide("new_pool_configuration", poolConfig);
</script>