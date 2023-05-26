<template>
   <div v-if=" props.tag ==='name-entry'">
      <div>
        <legend class="text-base font-semibold leading-6 text-gray-900">Name</legend>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <input type="name" name="pool-name" id="name" class="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6" placeholder="Pool Name" />
        </div>
      </div>
    </div>

    <div v-if=" props.tag ==='disk-selection'">
      <div>
        <fieldset>
          <legend class="text-base font-semibold leading-6 text-gray-900">Select Disks</legend>
          <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="(disk, diskIdx) in disks" :key="diskIdx" class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                <div class="flex w-full items-center justify-between space-x-6 p-6 border border-gray-200 rounded dark:border-gray-700">
                  <div class="flex-1 truncate">
                    <div class="flex items-center space-x-3">
                      <h3 class="truncate text-sm font-medium text-gray-900">{{ disk.name }}</h3>
                      <span class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ disk.status }}</span>
                    </div>
                    <p class="mt-1 truncate text-sm text-gray-500">{{ disk.description }}</p>
                  </div>          
                    <input :id="`disk-${disk.id}`" type="checkbox" value="" :name="`disk-${disk.id}`" 
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
            </li>
          </ul>
        </fieldset>

         <!-- TODO -->
         <!-- Add a button for Add Disk Group -->

         <!-- Move Virtual Device to here? -->
      </div>
    </div>

    <div v-if=" props.tag ==='pool-settings'">
      <div>
         <!-- TODO -->
        <!-- Virtual Device (Select) -->
        <!-- Sector Size (Select) -->
        <!-- Record Size (Select) -->
        <!-- LZ4 Compression (Toggle) -->
        <!-- Advanced Settings (Modal) -->
              <!-- Deduplication (Toggle) -->
              <!-- Refreservation (Slider) -->
              <!-- Auto-Expand Pool (Toggle) -->
              <!-- Auto-Replace Devices (Toggle) -->
              <!-- Auto-TRIM (Toggle) -->
              <!-- Forcefully Create Pool (Toggle) -->
              <!-- Save Advanced Settings (Button) -->
      </div>
    </div>

    <div v-if=" props.tag ==='file-system'">
      <div>
         <!-- TODO -->
        <!-- Create a File System (Checkbox) -> Enables all fields underneath -->
          <!-- Name of File System (Text) -->
          <!-- Encryption (Toggle) -> Reveals extra fields-->
              <!-- Passphrase (Text) -->
              <!-- Confirm Passphrase (Text) -->
              <!-- Cipher (Select) -->
          <!-- Inherit Pool Settings (Toggle) -> On by Default, if Off then reveals all fields to set -->
              <!-- Access Time (Select) -->
              <!-- Case Sensitivity (Select) -->
              <!-- Compression (Select) -->
              <!-- Deduplication (Select) -->
              <!-- DNode Size (Select) -->
              <!-- Extended Attributes (Select) -->
              <!-- Record Size (Select) -->
          <!-- Quota (Slider + Select) -->
          <!-- Read Only (Toggle) -->
      </div>
    </div>

    <div v-if=" props.tag ==='review'">
      <div>
        <!-- Recap all settings (Summary of main settings, More Details button for everything) -->
      </div>
    </div>
</template>

<script setup lang="ts">

interface PoolConfigProps {
  tag: string;
}

const props = defineProps<PoolConfigProps>();

const disks = [
  { id: 1, name: 'SSD1', status: 'ONLINE', description: '480.1 GB Micron_5300_MTFD (500a075135044d40)'},
  { id: 2, name: 'SSD2' , status: 'ONLINE', description: '480.1 GB Micron_5300_MTFD (500a075135044e7a)'},
  { id: 3, name: 'SSD3' , status: 'ONLINE', description: '480.1 GB Micron_5300_MTFD (500a075135044ad0)'},
  { id: 4, name: 'SSD4' , status: 'ONLINE', description: '480.1 GB Micron_5300_MTFD (500a075135044a73)'},
  { id: 5, name: 'HDD1' , status: 'ONLINE', description: '10TB SPINNYBOY HARD DRIVE'},
]

</script>