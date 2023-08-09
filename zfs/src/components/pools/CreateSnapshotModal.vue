<template>
    <Modal :isOpen="showSnapshotModal" :marginTop="'mt-48'" :width="'w-8/12'" :minWidth="'min-w-8/12'">
        <template v-slot:title>
            <legend class="flex justify-center">Create Snapshot</legend>
        </template>
        <template v-slot:content>
            <div>
                <div>
					<label :for="getIdKey('file-system')" class="block text-sm font-medium leading-6 text-default">File System</label>
					<select id="file-system" v-model="newSnapshot.filesystem" name="file-system" class="text-default bg-default mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
						<option v-for="dataset in datasets" :value="dataset.name">{{ dataset.name }}</option>
					</select>
				</div>
                <div>
                    <label :for="getIdKey('custom-name')" class="mt-1 block text-sm font-medium leading-6 text-default">Custom Name</label>
                    <Switch :id="getIdKey('custom-name')" v-model="newSnapshot.isCustomName" :class="[newSnapshot.isCustomName ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                        <span class="sr-only">Use setting</span>
                        <span :class="[newSnapshot.isCustomName ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                            <span :class="[newSnapshot.isCustomName ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                    <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                            <span :class="[newSnapshot.isCustomName ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                </svg>
                            </span>
                        </span>
                    </Switch>
                </div>
                <div>
					<label :for="getIdKey('snapshot-name')" class="block text-sm font-medium leading-6 text-default">Snapshot Name</label>
                    <input type="text" @change="nameCheck" v-model="newSnapshot.name" name="snapshot-name" :id="getIdKey('snapshot-name')" class="mt-1 block w-full input-textlike bg-default" placeholder="YYYY.MM.DD-HH.MM.SS" />
                    <p class="text-danger" v-if="nameFeedback">{{ nameFeedback }}</p>
                </div>
                <div>
                    <label :for="getIdKey('snap-children')" class="mt-1 block text-sm font-medium leading-6 text-default">Create snapshots of child file systems</label>
                    <Switch :id="getIdKey('snap-children')" v-model="newSnapshot.options.snapFileSystems" :class="[newSnapshot.options.snapFileSystems ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                        <span class="sr-only">Use setting</span>
                        <span :class="[newSnapshot.options.snapFileSystems ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                            <span :class="[newSnapshot.options.snapFileSystems ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                    <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                            <span :class="[newSnapshot.options.snapFileSystems ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                </svg>
                            </span>
                        </span>
                    </Switch>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="mt-2">
                <button @click="createSnapshotOK" :id="getIdKey('create-snapshot-btn')" name="create-snapshot-btn" class="mt-1 btn btn-primary">OK</button>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { reactive, ref, inject, Ref, computed, provide } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems, Switch } from '@headlessui/vue';
import Modal from '../common/Modal.vue';
import { loadSnapshots, loadDatasets } from '../../composables/loadData';
import { getSnapshots } from '../../composables/snapshots';

const datasets = inject<Ref<FileSystemData[]>>('datasets')!;

const newSnapshot : NewSnapshot = {
    name: '',
    filesystem: '',
    isCustomName: false,
    options: {
        snapFileSystems: false,
    }
}

const nameFeedback = ref('');

const nameCheck = () => {
	let result = true;
	nameFeedback.value = '';
	
	if (newSnapshot.name == '') {
		result = false;
		nameFeedback.value = 'Name cannot be empty.';
	} else if (newSnapshot.name.match(/^[0-9]/) ) {
		result = false;
		nameFeedback.value = 'Name cannot begin with numbers.';
	} else if (newSnapshot.name.match(/^[.]/ )) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a period (.).';
	} else if (newSnapshot.name.match(/^[_]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with an underscore (_).';
	} else if (newSnapshot.name.match(/^[-]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a hyphen (-).';
	} else if (newSnapshot.name.match(/^[:]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a colon (:).';
	} else if (newSnapshot.name.match(/^[ ]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with whitespace.';
	} else if (newSnapshot.name.match(/[ ]$/)) {
		result = false;
		nameFeedback.value = 'Name cannot end with whitespace.';
	} else if (newSnapshot.name.match(/^c[0-9]|^log|^mirror|^raidz|^raidz1|^raidz2|^raidz3|^spare/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a reserved name.';
	} else if (!newSnapshot.name.match(/^[a-zA-Z0-9_.:-]*$/)) {
		result = false;
		nameFeedback.value = 'Name contains invalid characters.';
	} else if (nameExists()) {
		result = false;
		nameFeedback.value = 'A pool with that name already exists.';
	}
	return result;
}

function nameExists() {
//   return snapshots.value.some((pool) => {
//     return poolConfig.value.name === pool.name;
//   });
    return false;
}


// YYYY.MM.DD-HH.MM.SS

const showSnapshotModal = inject<Ref<boolean>>('create-snap-modal')!;

function createSnapshotOK() {
	showSnapshotModal.value = false;
}


const getIdKey = (name: string) => `${name}`;
</script>