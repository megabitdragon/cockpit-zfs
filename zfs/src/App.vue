<template>
    <div class="h-full flex flex-col overflow-hidden">
      <HoustonHeader moduleName="ZFS" sourceURL=""
        issuesURL="" :pluginVersion="pluginVersion"
        :infoNudgeScrollbar="true" />
  
      <div class="w-full px-8 bg-well text-default grow flex flex-col overflow-y-auto py-8">
        <div>
          <div class="sm:hidden">
            <label for="tabs" class="sr-only">Select a tab</label>
            <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
            <select id="tabs" name="tabs" class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-slate-500 focus:outline-none focus:ring-slate-500 sm:text-sm">
              <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">{{ tab.name }}</option>
            </select>
          </div>
          <!--^^^ Mobile or very small screen ^^^-->
  
          <!--vvv Desktop/Regular version vvv-->
          <div class="hidden sm:block">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <a v-for="tab in tabs" :key="tab.name" :href="tab.href" :class="[tab.current ? 'border-slate-500 text-slate-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium']" :aria-current="tab.current ? 'page' : undefined">{{ tab.name }}</a>
              </nav>
            </div>
          </div>
        </div>
        
        <div id="dashboard" class="p-4">
            <div class="button-group-row justify-end">
                <button id="createPool" class="btn btn-primary object-right" @click="">Create Storage Pool</button>
                <button id="importPool" class="btn btn-secondary object-right" @click="" disabled>Import Storage Pool</button>
            </div>

            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <PoolSummary/>
              </div>
            </div>

            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <DiskSummary/>
              </div>
            </div>
            
        </div>
        
      </div>
    </div>
</template>

<script setup>
  import "@45drives/cockpit-css/src/index.css";
  import "@45drives/cockpit-vue-components/dist/style.css";
  import { useSpawn, objectURLDownload } from "@45drives/cockpit-helpers";
  import { ref, computed, watch } from "vue";
  import { pluginVersion } from "./version";
  import { HoustonHeader } from "@45drives/cockpit-vue-components";
  import {CheckCircleIcon, DotsVerticalIcon, ExclamationCircleIcon, RefreshIcon, QuestionMarkCircleIcon} from '@heroicons/vue/outline';
  import DiskSummary from "./components/disk/DiskSummary.vue";
  import PoolSummary from "./components/pool/PoolSummary.vue";

  const tabs = [
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Pools', href: '#', current: false },
    { name: 'Disks', href: '#', current: false },
    { name: 'Stats', href: '#', current: false },
    { name: 'Settings', href:'#', current: false}
  ];


</script>

<style>

</style>
  