<template>
  <div>
    <!-- Recap all settings (Summary of main settings, More Details button for everything) -->
    <Accordion class="ml-4">
      <!-- Pool Info -->
      <template v-slot:title>
        <p><b>Pool Details</b></p>
      </template>
      <template v-slot:content>
        <p class="ml-10">Name: {{ poolConfig!.name }}</p>
        <p class="ml-10">TOTAL SPACE in # Virtual Devices</p>
        <p class="ml-10">Sector Size: {{poolConfig!.settings.sector}}</p>
        <p class="ml-10">Record Size: {{poolConfig!.settings.record}}</p>
        <p class="ml-10">Compression: {{poolConfig!.settings.compression}}</p>
        <p class="ml-10">
          <Accordion class="ml-4">
            <template v-slot:title>
              <p><b>Advanced Settings</b></p>
            </template>
            <template v-slot:content>
              <p class="ml-10">Deduplication: {{poolConfig!.settings.deduplication}}</p>
              <p class="ml-10">Refreservation Amount: {{poolConfig!.settings.refreservation}}%</p>
              <p class="ml-10">Auto-Expand Pool: {{poolConfig!.settings.autoExpand}}</p>
              <p class="ml-10">Auto-Replace Devices: {{poolConfig!.settings.autoReplace}}</p>
              <p class="ml-10">Automatic TRIM: {{poolConfig!.settings.autoTrim}}</p>
            </template>
          </Accordion>
        </p>
      </template>
    </Accordion>
    <br/>
    <Accordion class="ml-4">
      <!-- Virtual Device Info -->
      <template v-slot:title>
        <p><b>VDev Details</b></p>
      </template>
      <template v-slot:content>
        <p class="ml-8">
          <div v-for="(vDev, vDevIdx) in poolConfig!.vdevs" :key="vDevIdx">
            <Accordion class="ml-4">
              <template v-slot:title>
                  <p>{{vDev.type}} ({{ vDev.disks.length }} disks)</p>
                </template>
                <template v-slot:content>
                  <p class="ml-10">Type: {{vDev.type}}</p>
                  <div v-for="(disk, diskIdx) in vDev.disks" :key="diskIdx">
                    <p class="ml-10">Disk {{ diskIdx }}: {{disk.name}} (480.1 GB)</p>
                  </div>
                  <br/>
                </template>
            </Accordion>
          </div>
        </p>
      </template>
    </Accordion>
    <br/>
    <Accordion class="ml-4">
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
</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
import Accordion from '../../components/common/Accordion.vue';

const poolConfig = inject<Pool>("new_pool_configuration");
</script>