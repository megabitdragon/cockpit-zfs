<template>
  <div>
    <div class="w-full px-8 bg-well text-default grow flex flex-col overflow-y-auto py-8">

      <div v-if="props.tag === 'dashboard'" class="p-4">
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

      <div v-if="props.tag === 'pools'" class="p-4">
        <div class="button-group-row justify-end">
            <button id="createPool" class="btn btn-primary object-right" @click="">Create Storage Pool</button>
            <button id="importPool" class="btn btn-secondary object-right" @click="" disabled>Import Storage Pool</button>
        </div>

      </div>

      <div v-if="props.tag === 'disks'" class="p-4">
       
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import "@45drives/cockpit-css/src/index.css";
import "@45drives/cockpit-vue-components/dist/style.css";
import { useSpawn, objectURLDownload } from "@45drives/cockpit-helpers";
import { ref, computed, watch, reactive, provide } from "vue";
import { pluginVersion } from "../version";
import { HoustonHeader } from "@45drives/cockpit-vue-components";
import DiskSummary from "../components/disk/DiskSummary.vue";
import PoolSummary from "../components/pool/PoolSummary.vue";
import CreatePool from "../components/pool/CreatePool.vue";

interface ZFSProps {
  tag: string;
  next: any;
}

const props = defineProps<ZFSProps>();


</script>

