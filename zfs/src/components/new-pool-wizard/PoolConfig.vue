<template>
   <div v-if=" props.tag ==='name-entry'">
    <legend class="mb-1 text-base font-semibold leading-6 text-gray-900">Name</legend>
    <input type="text" name="pool-name" id="pool-name" class="mt-1 block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6" placeholder="Pool Name" />
  </div>

    <div v-if=" props.tag ==='virtual-devices'">
      <div>
        <VDevs/>
      </div>
      <div>
        <button id="add-vdev" class="btn btn-primary object-right justify-end" @click="anotherVDev = true">Add Another VDev</button>
      </div>
      <div v-if="anotherVDev">
        <VDevs/>
      </div>
    </div>

    <div v-if=" props.tag ==='pool-settings'">
      <fieldset>
        <legend class="mb-1 text-base font-semibold leading-6 text-gray-900">Pool Settings</legend>

        <!-- Sector Size (Select) -->
        <div>
          <label for="sector-size" class="block text-sm font-medium leading-6 text-gray-900">Sector Size</label>
          <select id="sector-size" name="sector-size" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
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
          <select id="record-size" name="record-size" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
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
          <Switch v-model="lz4Enabled" :class="[lz4Enabled ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
            <span class="sr-only">Use setting</span>
            <span :class="[lz4Enabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
              <span :class="[lz4Enabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                  <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span :class="[lz4Enabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
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
            <span>Advanced Settings</span>
          </template>
          <template v-slot:content>
            <!-- Deduplication (Toggle) -->
            <div>
              <label for="deduplication-enabled" class="mt-1 block text-sm font-medium leading-6 text-gray-900">Deduplication</label>
              <Switch v-model="dedupEnabled" :class="[dedupEnabled ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                <span class="sr-only">Use setting</span>
                <span :class="[dedupEnabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                  <span :class="[dedupEnabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                    <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <span :class="[dedupEnabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
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
              <input id="steps-range" type="range" min="0" max="20" value="10" step="1" class="mt-1 w-3/4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
              <input id="steps-range" type="number" value="10" class="mt-1 w-3/4 block rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6"/>
            </div>

            <!-- Auto-Expand Pool (Toggle) -->
            <div>
              <label for="auto-expand-enabled" class="mt-1 block text-sm font-medium leading-6 text-gray-900">Auto-Expand Pool (When Larger Devices are Added)</label>
              <Switch v-model="autoExpandEnabled" :class="[autoExpandEnabled ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                <span class="sr-only">Use setting</span>
                <span :class="[autoExpandEnabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                  <span :class="[autoExpandEnabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                    <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <span :class="[autoExpandEnabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
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
              <Switch v-model="autoReplaceEnabled" :class="[autoReplaceEnabled ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                <span class="sr-only">Use setting</span>
                <span :class="[autoReplaceEnabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                  <span :class="[autoReplaceEnabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                    <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <span :class="[autoReplaceEnabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
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
              <Switch v-model="autoTrimEnabled" :class="[autoTrimEnabled ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                <span class="sr-only">Use setting</span>
                <span :class="[autoTrimEnabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                  <span :class="[autoTrimEnabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                    <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <span :class="[autoTrimEnabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
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
              <Switch v-model="forcefulCreateEnabled" :class="[forcefulCreateEnabled ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                <span class="sr-only">Use setting</span>
                <span :class="[forcefulCreateEnabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                  <span :class="[forcefulCreateEnabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                    <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <span :class="[forcefulCreateEnabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
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
      <div>
        <!-- Create a File System (Checkbox) -> Enables all fields underneath -->
        <legend class="mb-1 text-base font-semibold leading-6 text-gray-900">File System Settings</legend>
        <div class="relative flex items-start">
          <div class="text-sm mr-3">
            <label for="create-filesystem" class="font-medium text-gray-900">Create a File System?</label>
          </div>
          <div class="flex h-6 items-center">
            <input id="create-filesystem" v-model="createFileSystem" aria-describedby="create-filesystem" name="create-filesystem" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-600" />
          </div>
        </div>

        <div v-if="createFileSystem">
          <!-- Name of File System (Text) -->
          <div>
            <label class="mt-1 block text-sm font-medium text-gray-900">Name</label>
            <input type="name" name="pool-name" id="name" class="mt-1 block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6" placeholder="File System Name" />
          </div>

          <!-- Encryption (Toggle) -> Reveals extra fields-->
          <div>
            <label for="encryption" class="mt-1 block text-sm font-medium leading-6 text-gray-900">Encryption</label>
            <Switch v-model="encryptionEnabled" :class="[encryptionEnabled ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
              <span class="sr-only">Use setting</span>
              <span :class="[encryptionEnabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                <span :class="[encryptionEnabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                    <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <span :class="[encryptionEnabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-slate-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </Switch>
          </div>

          <div v-if="encryptionEnabled">
            <!-- Passphrase (Text) -->
              <div>
                <label class="mt-1 block text-sm font-medium leading-6 text-gray-900">Passphrase</label>
                <input type="text" name="passphrase" id="passphrase" class="mt-1 block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6" placeholder="Passphrase" />
              </div>
            <!-- Confirm Passphrase (Text) -->
            <div>
              <label class="mt-1 block text-sm font-medium leading-6 text-gray-900">Confirm Passphrase</label>
              <input type="text" name="passphrase-confirm" id="passphrase-confirm" class="mt-1 block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6" placeholder="Confirm Passphrase" />
            </div>
            <!-- Cipher (Select) -->
            <div>
              <label for="cipher" class="block text-sm font-medium leading-6 text-gray-900">Cipher</label>
              <select id="cipher" name="cipher" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
                <option>AES-128-CCM</option>
                <option>AES-192-CCM</option>
                <option>AES-256-CCM</option>
                <option>AES-128-GCM</option>
                <option>AES-192-GCM</option>
                <option selected>AES-256-GCM</option>
              </select>
            </div>
          </div>

          <!-- Inherit Pool Settings (Toggle) -> On by Default, if Off then reveals all fields to set -->
          <div>
            <label for="inherit" class="mt-1 block text-sm font-medium leading-6 text-gray-900">Inherit Pool Settings</label>
            <Switch v-model="inheritEnabled" :class="[inheritEnabled ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
              <span class="sr-only">Use setting</span>
              <span :class="[inheritEnabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                <span :class="[inheritEnabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                    <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <span :class="[inheritEnabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                  <svg class="h-3 w-3 text-slate-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </Switch>
          </div>
          
          <div v-if="!inheritEnabled">
            <!-- Access Time (Select) -->
            <div>
              <label for="fs-access-time" class="block text-sm font-medium leading-6 text-gray-900">Access Time</label>
              <select id="fs-access-time" name="fs-access-time" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
                <option selected>Inherited (On)</option>
                <option>On</option>
                <option>Off</option>
              </select>
            </div>
            <!-- Case Sensitivity (Select) -->
            <div>
              <label for="fs-case-sensitivity" class="block text-sm font-medium leading-6 text-gray-900">Case Sensitivity</label>
              <select id="fs-case-sensitivity" name="fs-case-sensitivity" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
                <option selected>Inherited (Sensitive)</option>
                <option>Insensitive</option>
                <option>Mixed</option>
                <option>Sensitive</option>
              </select>
            </div>
            <!-- Compression (Select) -->
            <div>
              <label for="fs-compression" class="block text-sm font-medium leading-6 text-gray-900">Compression</label>
              <select id="fs-compression" name="fs-compression" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
                <option selected>Inherited (LZ4)</option>
                <option>On</option>
                <option>Off</option>
                <option>GZIP</option>
                <option>LZ4</option>
                <option>LZJB</option>
                <option>ZLE</option>
              </select>
            </div>
            <!-- Deduplication (Select) -->
            <div>
              <label for="fs-deduplication" class="block text-sm font-medium leading-6 text-gray-900">Deduplication</label>
              <select id="fs-deduplication" name="fs-deduplication" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
                <option selected>Inherited (Off)</option>
                <option>On</option>
                <option>Off</option>
                <option>Edon-R + Verify</option>
                <option>SHA-256</option>
                <option>SHA-256 + Verify</option>
                <option>SHA-512</option>
                <option>SHA-512 + Verify</option>
                <option>Skein</option>
                <option>Skein + Verify</option>
                <option>Verify</option>
              </select>
            </div>
            <!-- DNode Size (Select) -->
            <div>
              <label for="fs-dnode-size" class="block text-sm font-medium leading-6 text-gray-900">DNode Size</label>
              <select id="fs-dnode-size" name="fs-dnode-size" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
                <option selected>Inherited (Legacy)</option>
                <option>1 KiB</option>
                <option>2 KiB</option>
                <option>4 KiB</option>
                <option>8 KiB</option>
                <option>16 KiB</option>
                <option>Auto</option>
                <option>Legacy</option>
              </select>
            </div>
            <!-- Extended Attributes (Select) -->
            <div>
              <label for="fs-extended-attributes" class="block text-sm font-medium leading-6 text-gray-900">Extended Attributes</label>
              <select id="fs-extended-attributes" name="fs-extended-attributes" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
                <option selected>Inherited (System Attribute)</option>
                <option>On</option>
                <option>Off</option>
                <option>System Attribute</option>
              </select>
            </div>
            <!-- Record Size (Select) -->
            <div>
              <label for="fs-record-size" class="block text-sm font-medium leading-6 text-gray-900">Record Size</label>
              <select id="fs-record-size" name="fs-record-size" class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
                <option selected>Inherited (128 KiB)</option>
                <option>512 B</option>
                <option>4 KiB</option>
                <option>8 KiB</option>
                <option>16 KiB</option>
                <option>32 KiB</option>
                <option>64 KiB</option>
                <option>256 KiB</option>
                <option>512 KiB</option>
                <option>1 MiB</option>
              </select>
            </div>
          </div>

          <div>
            <!-- Quota (Slider + Select) -->
            <div>
              <label for="fs-quota" class="mb-1 block text-sm font-medium leading-6 text-gray-900">Quota</label>
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <input id="steps-range" type="range" min="0" max="1000" value="0" step="1" class="block sm:col-span-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
                <input type="number" name="fs-quota-num" id="fs-quota" value="0" class="block sm:col-span-1 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6"/>          
                <select id="fs-quota" name="fs-quota-slider" class="block sm:col-span-1 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
                  <option selected>KiB</option>
                  <option>MiB</option>
                  <option>GiB</option>
                </select>
              </div>
            </div>

            <!-- Read Only (Toggle) -->
            <div>
              <label for="fs-read-only" class="mt-1 block text-sm font-medium leading-6 text-gray-900">Read Only</label>
              <Switch v-model="readOnlyEnabled" :class="[readOnlyEnabled ? 'bg-slate-600' : 'bg-gray-200', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                <span class="sr-only">Use setting</span>
                <span :class="[readOnlyEnabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                  <span :class="[readOnlyEnabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                    <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <span :class="[readOnlyEnabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                    <svg class="h-3 w-3 text-slate-600" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if=" props.tag ==='review'">
      <div>
        <!-- Recap all settings (Summary of main settings, More Details button for everything) -->
        <Accordion>
          <!-- Pool Info -->
          <template v-slot:title>
            <p><b>Pool Details</b></p>
          </template>
          <template v-slot:content>
            <p class="ml-10">Pool Name</p>
            <p class="ml-10">TOTAL SPACE in # Virtual Devices</p>
            <p class="ml-10">Sector Size</p>
            <p class="ml-10">Record Size</p>
            <p class="ml-10">Compression On/Off</p>
            <p class="ml-10">
              <Accordion>
                <template v-slot:title>
                  <p><b>Advanced Settings</b></p>
                </template>
                <template v-slot:content>
                  <p class="ml-10">Deduplication On/Off</p>
                  <p class="ml-10">Refreservation Amount</p>
                  <p class="ml-10">Auto-Expand Pool On/Off</p>
                  <p class="ml-10">Auto-Replace Devices On/Off</p>
                  <p class="ml-10">Automatic TRIM On/Off</p>
                </template>
              </Accordion>
            </p>
          </template>
        </Accordion>
        <br/>
        <Accordion>
          <!-- Virtual Device Info -->
          <template v-slot:title>
            <p><b>VDev Details</b></p>
          </template>
          <template v-slot:content>
            <p class="ml-8">
              <Accordion>
              <template v-slot:title>
                  <p>mirror-0 (2 disks)</p>
                </template>
                <template v-slot:content>
                  <p class="ml-10">Type: Mirror</p>
                  <p class="ml-10">Disk 1: 1-11 (480.1 GB)</p>
                  <p class="ml-10">Disk 2: 1-12 (480.1 GB)</p>
                  <br/>
                </template>
            </Accordion>
           
            </p>
            <p class="ml-8">
              <Accordion>
                <template v-slot:title>
                    <p>mirror-1 (2 disks)</p>
                  </template>
                  <template v-slot:content>
                    <p class="ml-10">Type: Mirror</p>
                    <p class="ml-10">Disk 1: 1-13 (480.1 GB)</p>
                    <p class="ml-10">Disk 2: 1-14 (480.1 GB)</p>
                  </template>
              </Accordion>
            </p>
          </template>
        </Accordion>
        <br/>
        <Accordion>
        <!-- File System Info? -->
          <template v-slot:title>
              <p><b>File System Details</b></p>
            </template>
            <template v-slot:content>
              <p class="ml-10">Name of File System</p>
              <p class="ml-10">Encryption On/Off</p>
              <p class="ml-10">Quota Amount</p>
              <p class="ml-10">Read Only On/Off</p>
            </template>
        </Accordion>
        <br/>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Switch } from '@headlessui/vue';

import Accordion from '../../components/common/Accordion.vue';
import VDevs from './VDevs.vue';

interface PoolConfigProps {
  tag: string;
}

const props = defineProps<PoolConfigProps>();

const anotherVDev = ref(false);

const lz4Enabled = ref(false);
const dedupEnabled = ref(false);
const autoExpandEnabled = ref(false);
const autoReplaceEnabled = ref(false);
const autoTrimEnabled = ref(false);
const forcefulCreateEnabled = ref(false);
const createFileSystem = ref(false);
const encryptionEnabled = ref(false);
const inheritEnabled = ref(true);
const readOnlyEnabled = ref(false);

</script>