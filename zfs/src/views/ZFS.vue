<template>
  <div>
    <div class="w-full h-full px-8 bg-well text-default grow flex flex-col overflow-y-auto py-8">

      <div v-if="props.tag === 'dashboard'" class="p-4">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <PoolSummary/>
            </div>
          </div>

          <!-- <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <DiskSummary/>
            </div>
          </div> -->
      </div>

      <div v-if="props.tag === 'pools'" class="p-4">
        <PoolDiskList/>
      </div>

      <!-- <div v-if="props.tag === 'filesystems'" class="p-4"> -->
        <!-- <DiskList :disks="props.disks" /> -->
      <!-- </div> -->

      <!-- <div v-if="props.tag === 'stats'" class="p-4">
      
      </div>

      <div v-if="props.tag === 'settings'" class="p-4">
      
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import "@45drives/cockpit-css/src/index.css";
import "@45drives/cockpit-vue-components/dist/style.css";
import DiskSummary from "../components/disk/DiskSummary.vue";
import PoolSummary from "../components/pool/PoolSummary.vue";
import PoolDiskList from "../components/pool/PoolDiskList.vue";

interface ZFSProps {
  tag: string;
  next: any;
}

const props = defineProps<ZFSProps>();

</script>

