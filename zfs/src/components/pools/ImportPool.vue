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
                        <ul :id="getIdKey('available-pool-list')" role="list" class="grid gap-1 grid-cols-1 p-1 border border-default rounded-md bg-accent overflow-y-auto h-56 min-h-min">                                             
                            <li v-for="pool, idx in importablePools" :key="idx" class="col-span-1">
                                <button class="flex min-w-fit w-full h-fit min-h-fit border border-default bg-well rounded-md"
                                :class="poolSelectedClass(pool.guid)">
                                    <label :for="getIdKey(`pool-${idx}`)" class="flex flex-col w-full py-2 mb-1 mx-2 text-default">
                                        <input v-model="selectedPool" :id="getIdKey(`pool-${idx}`)" type="radio" :value="`${pool.guid}`" :name="`pool-${pool.name}-${pool.guid}`" 
                                        class="w-4 h-4 text-success bg-well border-default rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-1"/>
                                        <p>Name: {{pool.name}}</p>
                                        <p>GUID: {{ pool.guid }}</p>
                                        <p>Status: {{ pool.status }}</p>
                                    </label>                          
                                </button>
                            </li>
                        </ul>
                    </div>

                    <!-- Switch for showing exported pools or showing deleted pools -->
                    <div class="mt-2 col-span-1">
                        <label for="show-destroyed-pools-switch" class="mt-1 block text-sm leading-6 text-default">Show Destroyed Pools</label>
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
                    <div class="mt-2 col-span-2">
                        <label :for="getIdKey('disk-identifier')" class="bg-default block text-sm leading-6 text-default">Disk Identifier</label>
                        <select :id="getIdKey('disk-identifier')" v-model="importedPool.identifier" name="" class="mt-1 block w-full input-textlike bg-default">
                            <option value="device alias">Device Alias</option>
                            <option value="block device">Block Device</option>
                            <option value="disk/wwn">Disk/WWN</option>
                            <option value="hardware path">Hardware Path</option>
                        </select>
                    </div>

                    <!-- Switch for renaming imported pool -->
                    <div class="mt-2 col-span-1">
                        <label for="rename-pool-switch" class="mt-1 block text-sm leading-6 text-default">Rename Pool</label>
                        <Switch v-model="importedPool.renamePool" :id="getIdKey('rename-pool-switch')" :class="[importedPool.renamePool! ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[importedPool.renamePool! ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[importedPool.renamePool! ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[importedPool.renamePool! ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>
                    <!-- If Switch is ON, show text input for new pool name -->
                    <div v-if="importedPool.renamePool" class="mt-2 col-span-2">
                        <label :for="getIdKey('new-pool-name')" class="bg-default block text-sm leading-6 text-default">New Name</label>
                        <input type="text" v-model="importedPool.newPoolName" name="pool-name" :id="getIdKey('new-pool-name')" class="mt-1 block w-full input-textlike bg-default" placeholder="New Pool Name" />
                    </div>

                    <!-- Alt Root -->
                    <div class="mt-2 col-span-3">
                        <label :for="getIdKey('alt-root')" class="bg-default block text-sm leading-6 text-default">Alt Root</label>
                        <input type="text" v-model="importedPool.altRoot" name="pool-name" :id="getIdKey('alt-root')" class="mt-1 block w-full input-textlike bg-default" placeholder="Alt Root" />
                    </div>

                    <!-- Switch for Read Only -->
                    <div class="mt-2 col-span-1">
                        <label for="read-only" class="mt-1 block text-sm leading-6 text-default">Read Only</label>
                        <Switch v-model="importedPool.readOnly" :id="getIdKey('read-only')" :class="[importedPool.readOnly! ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[importedPool.readOnly! ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[importedPool.readOnly! ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[importedPool.readOnly! ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>

                    <!-- Switch for Recovery Mode -->
                    <div class="mt-2 col-span-1">
                        <label for="recovery-mode" class="mt-1 block text-sm leading-6 text-default">Recovery Mode</label>
                        <Switch v-model="importedPool.recoveryMode" :id="getIdKey('recovery-mode')" :class="[importedPool.recoveryMode! ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[importedPool.recoveryMode! ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[importedPool.recoveryMode! ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[importedPool.recoveryMode! ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>

                    <!-- Switch for Ignore Missing Log Devices -->
                    <div class="mt-2 col-span-1">
                        <label for="ignore-missing-logs" class="mt-1 block text-sm leading-6 text-default">Ignore Missing Log Devices</label>
                        <Switch v-model="importedPool.ignoreMissingLog" :id="getIdKey('ignore-missing-logs')" :class="[importedPool.ignoreMissingLog! ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[importedPool.ignoreMissingLog! ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[importedPool.ignoreMissingLog! ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[importedPool.ignoreMissingLog! ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>

                    <!-- Switch for Mount Filesystems (ON by default, if OFF then execute command) -->
                    <div class="mt-2 col-span-1">
                        <label for="mount-filesystems" class="mt-1 block text-sm leading-6 text-default">Mount File Systems</label>
                        <Switch v-model="importedPool.mountFileSystems" :id="getIdKey('mount-filesystems')" :class="[importedPool.mountFileSystems! ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[importedPool.mountFileSystems! ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[importedPool.mountFileSystems! ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[importedPool.mountFileSystems! ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>

                    <!-- Switch for Force Import -->
                    <div class="mt-2 col-span-1">
                        <label for="force-import" class="mt-1 block text-sm leading-6 text-default">Forcefully Import</label>
                        <Switch v-model="importedPool.forceImport" :id="getIdKey('force-import')" :class="[importedPool.forceImport! ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[importedPool.forceImport! ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[importedPool.forceImport! ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[importedPool.forceImport! ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>

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
    idKey: string;
}

const props = defineProps<ImportPoolProps>();
const showDeletedPools = ref(false);
const showImportModal = inject<Ref<boolean>>('show-import-modal')!;

const selectedPool = ref<ImportablePoolData>();
const importablePools = inject<Ref<ImportablePoolData[]>>('importable-pools')!;

const poolSelectedClass = (poolGUID) => {
   return poolGUID === selectedPool.value ? 'bg-green-300 dark:bg-green-700' : '';
}

function loadImports() {
    importablePools.value = [];
    loadImportablePools(importablePools.value);    
}

loadImports();

const importedPool = ref<ImportedPool>({
	pool: '',
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