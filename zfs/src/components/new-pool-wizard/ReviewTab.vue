<template>
  <div>
    <!-- Recap all settings (Summary of main settings, More Details button for everything) -->
    <Accordion class="ml-4">
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
          <Accordion class="ml-4">
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
    <Accordion class="ml-4">
      <!-- Virtual Device Info -->
      <template v-slot:title>
        <p><b>VDev Details</b></p>
      </template>
      <template v-slot:content>
        <p class="ml-8">
          <Accordion class="ml-4">
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
          <Accordion class="ml-4">
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

import Accordion from '../../components/common/Accordion.vue';

</script>