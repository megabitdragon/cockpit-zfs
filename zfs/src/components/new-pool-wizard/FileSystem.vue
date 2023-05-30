<template>
  <div>
    <!-- Create a File System (Checkbox) -> Enables all fields underneath -->
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Switch } from '@headlessui/vue';

import Accordion from '../../components/common/Accordion.vue';

const createFileSystem = ref(false);
const encryptionEnabled = ref(false);
const inheritEnabled = ref(true);
const readOnlyEnabled = ref(false);

</script>