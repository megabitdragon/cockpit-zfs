<template>
    <Modal :isOpen="showRenameModal" @close="showRenameModal = false" :marginTop="'mt-28'" :width="'w-8/12'" :minWidth="'min-w-8/12'">
        <template v-slot:title>
            <legend class="flex justify-center">Rename File System</legend>
        </template>
        <template v-slot:content>
            <div>
                <div class="grid grid-cols-4 gap-2">
                    <!-- Parent File System -->
                    <div class="mt-2">
                        <label :for="getIdKey('parent-filesystem')" class="block text-sm font-medium leading-6 text-default">Parent File System</label>
                        <select v-model="newFileSystemData.oldPath" :id="getIdKey('parent-filesystem')">
                            <option v-for="dataset, datasetIdx in datasets" :key="datasetIdx">{{ dataset.name }}</option>
                        </select>
                    </div>

                    <!-- New Name -->
                    <div class="mt-2">
                        <label :for="getIdKey('new-name')" class="mt-1 block text-sm font-medium leading-6 text-default">New Name</label>
                        <input :id="getIdKey('new-name')" type="name" name="pool-name" v-model="newFileSystemData.newPath" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6" placeholder="New Name" />
                    </div>
                    <!-- Force Unmount -->
                    <div class="mt-2">
                         <div class="flex flex-row">
                            <label :for="getIdKey('force-unmount-filesystem')" class="mt-2 mr-2 block text-sm font-medium leading-6 text-default">Forcefully Unmount File System</label>
                            <Switch v-model="newFileSystemData.forceUnmount" :id="getIdKey('force-unmount-filesystem')" :class="[newFileSystemData.forceUnmount! ? 'bg-primary' : 'bg-accent', 'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                                <span class="sr-only">Use setting</span>
                                <span :class="[newFileSystemData.forceUnmount! ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                    <span :class="[newFileSystemData.forceUnmount! ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                        <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                            <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </span>
                                    <span :class="[newFileSystemData.forceUnmount! ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                        <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                        </svg>
                                    </span>
                                </span>
                            </Switch>
                        </div>
                    </div>
                    <!-- Create non-existent parent file systems -->
                    <div class="mt-2">
                         <div class="flex flex-row">
                            <label :for="getIdKey('create-parent-filesystems')" class="mt-2 mr-2 block text-sm font-medium leading-6 text-default">Create Non-Existent Parent File Systems</label>
                            <Switch v-model="newFileSystemData.createParent" :id="getIdKey('create-parent-filesystems')" :class="[newFileSystemData.createParent! ? 'bg-primary' : 'bg-accent', 'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                                <span class="sr-only">Use setting</span>
                                <span :class="[newFileSystemData.createParent! ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                    <span :class="[newFileSystemData.createParent! ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                        <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                            <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </span>
                                    <span :class="[newFileSystemData.createParent! ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                        <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
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
        <template v-slot:footer>

        </template>
    </Modal>
</template>
<script setup lang="ts">
import { ref, Ref, inject, watch } from 'vue';
// import { onOffToBool, isBoolOnOff, upperCaseWord, convertBytesToSize, convertSizeToBytes, getSizeNumberFromString, getSizeUnitFromString, getQuotaRefreservUnit } from '../../composables/helpers';
import {  } from '../../composables/datasets';
import { Switch } from '@headlessui/vue';
import Modal from '../common/Modal.vue';

interface RenameFileSystemProps {
    idKey: string;
    filesystem: FileSystemData;
}

const props = defineProps<RenameFileSystemProps>();
const showRenameModal = inject<Ref<boolean>>('show-rename-modal')!;
const datasets = inject<Ref<FileSystemData[]>>('datasets')!;

const newName = ref('');
const forceUnmount = ref(false);
const createNonExistParent = ref(false);

const newFileSystemData = ref({
    oldPath: props.filesystem.parentFS,
    newPath: props.filesystem.name,
    forceUnmount: false,
    createParent: false,
});

const getIdKey = (name: string) => `${name}`;
</script>