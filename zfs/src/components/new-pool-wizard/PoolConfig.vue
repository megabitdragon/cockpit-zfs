<template>
  <div v-if=" props.tag ==='name-entry'">
    <legend class="mb-1 text-base font-semibold leading-6 text-gray-900">Name</legend>
    <input type="text" v-model="newPoolName" name="pool-name" id="pool-name" class="mt-1 block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6" placeholder="Pool Name" />
  </div>

  <div v-if=" props.tag ==='virtual-devices'">
    <div>
      <legend class="mb-1 text-base font-semibold leading-6 text-gray-900">Create a Virtual Device</legend>
      <VDevs/>
    </div>
  </div>

  <div v-if=" props.tag ==='pool-settings'">
    <fieldset>
      <legend class="mb-1 text-base font-semibold leading-6 text-gray-900">Pool Settings</legend>
      <PoolSettings/>
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
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';

import VDevs from './VDevs.vue';
import PoolSettings from './PoolSettings.vue';
import FileSystem from './FileSystem.vue';
import ReviewTab from './ReviewTab.vue';

interface PoolConfigProps {
  tag: string;
}

const props = defineProps<PoolConfigProps>();

const newPoolName = ref('');

const newVDevs = reactive<VirtualDevice[]>([]);

const vDevDisks = reactive<Disk[]>([]);

const newVDevConfig = reactive<VirtualDevice>({
  type: 'raidz2',
  disks: vDevDisks,
  forceAdd: false,
});

const poolConfig = reactive<Pool>({
  name: newPoolName.value,
    vdevs: newVDevs,
    settings: { 
      sector: '4kib',
      record: '128kib',
      compression: true,
      deduplication: false,
      refreservation: 0.10,
      autoExpand: true,
      autoReplace: false,
      autoTrim: false,
      forceCreate: false,
    },
    usagePercent: 0,
    status: 'ONLINE',
});

provide("new_pool_configuration", poolConfig);
provide("virtual_device_array", newVDevs);
provide("new_virtual_device", newVDevConfig);
</script>