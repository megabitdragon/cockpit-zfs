<template>
	<Modal :isOpen="showImportModal" @close="showImportModal = false" :marginTop="'mt-28'" :width="'w-4/6'" :minWidth="'min-w-4/6'">
        <template v-slot:title>
            <legend class="flex justify-center">Import Pool</legend>
        </template>
        <template v-slot:content>
            <div>
                <div class="grid grid-cols-3">

                     <!-- Pool selection box (select box or checkbox?) -->
                     <div class="mt-2 col-span-3">
                        <label :for="getIdKey('available-pool-list')" class="my-1 block text-sm font-medium leading-6 text-default">Select Pool</label>
                        <ul :id="getIdKey('available-pool-list')" role="list" class="grid gap-4 grid-cols-4">
                          
                                <!-- <li v-for="plan in plans" :key="plan.id" class="relative flex items-start">
                                    <div class="flex h-6 items-center">
                                        <input :id="plan.id" :aria-describedby="`${plan.id}-description`" name="plan" type="radio" :checked="plan.id === 'small'" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                    </div>
                                    <div class="ml-3 text-sm leading-6">
                                        <label :for="plan.id" class="font-medium text-gray-900">{{ plan.name }}</label>
                                        {{ ' ' }}
                                        <span :id="`${plan.id}-description`" class="text-gray-500">{{ plan.description }}</span>
                                    </div>
                                </li> -->

                            <li  v-for="pool, idx in importablePools" :key="idx" class="">
                                <button class="flex min-w-fit w-full h-full border border-default rounded-md">
                                    <label :for="getIdKey(`pool-`)" class="flex flex-col w-full py-4 mx-2 text-sm gap-0.5">
                                        <input v-model="selectedPool" :id="getIdKey(`pool-`)" type="checkbox" :value="`{}`" :name="`pool-`" 
                                        class="w-4 h-4 text-success bg-well border-default rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2"/>
                                        <h3>Pool</h3>
                                    </label>                          
                                </button>
                            </li>

                            <!-- <li v-for="(pool, poolIdx) in vDevAvailPools[vDevIdx]" :key="poolIdx" class="">
                                <button class="flex min-w-fit w-full h-full border border-default rounded-lg"
                                :class="poolCardClass(pool.name, vDevIdx)">
                                    <label :for="getIdKey(`vdev-${vDevIdx}-pool-${poolIdx}`)" class="flex flex-col w-full py-4 mx-2 text-sm gap-0.5">
                                        <input :id="getIdKey(`vdev-${vDevIdx}-pool-${poolIdx}`)" v-model="poolConfig.vdevs[vDevIdx].selectedpools" type="checkbox" :value="`${pool.name}`" :name="`pool-${pool.name}`"
                                        class="w-4 h-4 text-success bg-well border-default rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2"/>
                                        <h3 class="truncate text-sm font-medium text-default">{{ pool.name }}</h3>
                                        <p class="mt-1 truncate text-sm font-base text-default">{{ disk.sd_path }}</p>
                                        <p class="mt-1 truncate text-sm text-default">{{ disk.type }}</p>
                                        <p class="mt-1 truncate text-sm text-default">Capacity: {{ disk.capacity }}</p>
                                    </label>
                                </button>
                            </li> -->
                        </ul>
                    </div>

                    <!-- Switch for showing exported pools or showing deleted pools -->
                    <div class="mt-2 col-span-1">
                        <label for="show-destroyed-pools-switch" :id="getIdKey('show-destroyed-pools-label')" class="mt-1 block text-sm leading-6 text-default">Show Destroyed Pools</label>
                        <Switch v-model="showDeletedPools" :id="getIdKey('show-destroyed-pools-switch')" :class="[showDeletedPools! ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[showDeletedPools! ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[showDeletedPools! ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[showDeletedPools! ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>

                    <!-- Disk Identifier -->
                    <div class="mt-2">
                        <!-- <label :for="getIdKey('')" class="bg-default block text-base leading-6 text-default">Can Mount</label>
                        <select :id="getIdKey('')" v-model="fileSystemConfig.properties.canMount" name="" class="mt-1 block w-full input-textlike bg-default">
                            <option value="on">On</option>
                            <option value="off">Off</option>
                            <option value="noauto">No Auto</option>
                        </select> -->
                    </div>

                    <!-- Switch for renaming imported pool -->
                    <!-- If Switch is ON, show text input for new pool name -->
          

                    <!-- Alt Root -->


                


                    <!-- Switch for Recovery Mode -->


                    <!-- Switch for Read Only -->


                    <!-- Switch for Ignore Missing Log Devices -->


                    <!-- Switch for Mount Filesystems (ON by default, if OFF then execute command) -->


                    <!-- Switch for Force Import -->


                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="w-full grid grid-rows-2">
                <div class="w-full row-start-1">
                    <div class="mt-2">
                        <p class="text-danger" ></p>
                    </div>
                </div>
                <div class="button-group-row w-full row-start-2 justify-between mt-2">
                    <button @click="showImportModal = false" :id="getIdKey('cancel-import')" name="cancel-import" class="mt-1 btn btn-danger object-left justify-start h-fit">Cancel</button>
                    <button  @click="" :id="getIdKey('import-pool-btn')" name="import-pool-btn" class="mt-1 btn btn-primary object-right justify-end h-fit">Import</button>
                    <!-- <button disabled  :id="getIdKey('import-pool-spinner')" type="button" class="btn btn-danger object-right justify-end">
							<svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin text-default" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="text-success"/>
							</svg>
							Importing...
					</button> -->
                </div>
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
import { Switch } from '@headlessui/vue';
import Modal from '../common/Modal.vue';
import { loadImportablePools } from '../../composables/loadImportables';

interface ImportPoolProps {
    // importedPool: ImportedPool;
    idKey: string;
}

const props = defineProps<ImportPoolProps>();
const showDeletedPools = ref(false);
const showImportModal = inject<Ref<boolean>>('show-import-modal')!;

const selectedPool = ref<ImportablePoolData>();
const importablePools = inject<Ref<ImportablePoolData>>('importable-pools')!;

loadImportablePools(importablePools.value);

const importedPool = ref<ImportedPool>({
	pool: selectedPool.value,
	altRoot: '',
	renamePool: false,
	newPoolName: '',
	identifier: 'device alias',
	forceImport: false,
	recoveryMode: false,
	ignoreMissingLog: false,
	mountFileSystems: true,
	readOnly: false,
});


const getIdKey = (name: string) => `${name}`;
</script>