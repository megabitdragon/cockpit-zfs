<template>
    <Modal :isOpen="showFlag" @close="updateShowFlag" :marginTop="'mt-60'" :width="'w-96'" :minWidth="'min-w-min'">
        <template v-slot:title>
            <legend class="flex justify-center">{{ upperCaseWord(props.mode) }} File System</legend>
        </template>
        <template v-slot:content>
            <div class="grid grid-flow-row mt-3 justify-items-center gap-1">
                <div v-if="props.mode == 'unlock'">
                    <div>
                        <label :for="getIdKey('filesystem-name')" class="mt-1 text-sm font-medium leading-6 text-default">Name: <span class="font-normal">{{ props.filesystem.name }}</span></label>
                    </div>
                    <div class="grid grid-flow-row">
                        <label :for="getIdKey('passphrase')" class="mt-1 text-sm font-medium leading-6 text-default">Enter Passphrase</label>
                        <input :id="getIdKey('passphrase')" type="password" v-model="passphrase" name="passphrase" class="mt-1 w-full input-textlike bg-default" />
                    </div>
                    
                    <div>
                        <div class="flex flex-row">
                            <label :for="getIdKey('mount-switch')" class="mt-3 mr-2 block text-sm font-medium text-default">Mount File System</label>
                            <Switch v-model="mountFS" :id="getIdKey('mount-file-system')" :class="[mountFS ? 'bg-primary' : 'bg-accent', 'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                                <span class="sr-only">Use setting</span>
                                <span :class="[mountFS ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                    <span :class="[mountFS ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                        <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                            <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </span>
                                    <span :class="[mountFS ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                        <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                        </svg>
                                    </span>
                                </span>
                            </Switch>
                        </div>
                        <div class="flex flex-row">
                            <label :for="getIdKey('force-mount-switch')" class="mt-3 mr-2 block text-sm font-medium text-default">Forcefully Mount File System</label>
                            <Switch v-model="forceMountFS" :id="getIdKey('force-mount-file-system')" :class="[forceMountFS ? 'bg-primary' : 'bg-accent', 'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                                <span class="sr-only">Use setting</span>
                                <span :class="[forceMountFS ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                    <span :class="[forceMountFS ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                        <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                            <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </span>
                                    <span :class="[forceMountFS ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                        <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                        </svg>
                                    </span>
                                </span>
                            </Switch>
                        </div>


                    </div>
                </div>
                <div v-if="props.mode == 'lock'">
                    <div>
                        <legend>Lock filesystem {{ props.filesystem.name }}?</legend>
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="w-full grid grid-rows-1">
                <div class="button-group-row mt-2 justify-between">
                    <button @click="closeModal" :id="getIdKey('confirm-no')" name="button-no" class="mt-1 btn btn-secondary object-left justify-start h-fit">Cancel</button>
                    <button v-if="!doingThing" @click="confirmBtn()" :id="getIdKey('confirm-yes')" name="button-yes" class="mt-1 btn btn-danger object-right justify-end h-fit">{{upperCaseWord(props.mode)}}</button>
                    <button disabled v-if="doingThing" :id="getIdKey('confirm-spinner')" type="button" class="btn btn-danger object-right justify-end h-fit">
							<svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin text-default" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="text-success"/>
							</svg>
                            {{ upperCaseWord(props.mode) }}ing...
					</button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { Ref, inject, ref } from 'vue';
import { Switch } from '@headlessui/vue';
import { upperCaseWord } from '../../composables/helpers';
import { lockFileSystem, mountFileSystem, unlockFileSystem } from "../../composables/datasets";
import { loadDatasets, loadSnapshots } from "../../composables/loadData";
import Modal from '../common/Modal.vue';

interface LockUnlockFileSystemProps {
    idKey: string;
    mode: string;
    filesystem: FileSystemData;
    showFlag: boolean;
}

const props = defineProps<LockUnlockFileSystemProps>();
const emit = defineEmits(['close']);

const showFlag = ref(props.showFlag);
const doingThing = inject<Ref<boolean>>('locking-or-unlocking')!;
const showLockUnlockModal = inject<Ref<boolean>>('show-lock-unlock-modal')!;

const updateShowFlag = () => {
    if (props.showFlag !== showFlag.value) {
        showFlag.value = props.showFlag;
    } 
}

const closeModal = () => {
    emit('close');
}

const passphrase = ref('');
const mountFS = ref(true);
const forceMountFS = ref(false);

const fileSystemsLoaded = inject<Ref<boolean>>('datasets-loaded')!;
const fileSystems = inject<Ref<FileSystemData[]>>('datasets')!;
const snapshots = inject<Ref<Snapshot[]>>('snapshots')!;

async function confirmBtn() {
    if (props.mode == 'lock') {
        doingThing.value = true;
        await lockFileSystem(props.filesystem);
        doingThing.value = false;
        showLockUnlockModal.value = false;
        
    } else if (props.mode == 'unlock') {
        doingThing.value = true;
        await unlockFileSystem(props.filesystem, passphrase.value);
        if (mountFS.value) {
            await mountFileSystem(props.filesystem, forceMountFS.value);
        }
        doingThing.value = false;
        showLockUnlockModal.value = false;
    }
    await refreshDatasets();
}

async function refreshDatasets() {
	fileSystemsLoaded.value = false;
	fileSystems.value = [];
	snapshots.value = [];
	await loadDatasets(fileSystems);
	await loadSnapshots(snapshots);
	fileSystemsLoaded.value = true;
}

const getIdKey = (name: string) => `${name}`;
</script>