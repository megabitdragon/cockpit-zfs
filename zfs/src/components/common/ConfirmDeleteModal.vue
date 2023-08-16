<template>
	<Modal :isOpen="showDeleteConfirmModal" @close="showDeleteConfirmModal = false" :marginTop="'mt-60'" :width="'w-96'" :minWidth="'min-w-96'">
        <template v-slot:title>
            <legend class="flex justify-center">Are you sure?</legend>
        </template>
        <template v-slot:content>
            <div class="grid grid-flow-row mt-3 justify-items-center gap-1">
                <p class="text-default row-start-1">Destroy {{upperCaseWord(props.item)}} <span class="text-danger">{{ props.name }}</span>?</p>
                <div v-if="hasChildren" class="text-danger font-medium grid grid-rows-3 row-span-3 row-start-2 justify-items-center">
                    <p class="text-danger font-medium row-start-1">WARNING!!!</p>
                    <p class="text-danger row-start-2">{{ upperCaseWord(props.item) }} {{ props.name }} has children.</p>
                    <p class="text-default row-start-3">If you wish to destroy, use <span class="text-danger">Force Destroy</span>.</p>
                </div>

               
            </div>
        </template>
        <template v-slot:footer>
            <div class="w-full grid grid-rows-1">
                <div class="button-group-row mt-2 justify-between">
                    <button @click="showDeleteConfirmModal = false" :id="getIdKey('confirm-delete-no')" name="delete-button-no" class="mt-1 btn btn-secondary object-left justify-start h-fit">Cancel</button>
                    <!-- <button @click="confirmDelete = true;" :id="getIdKey('confirm-delete-yes')" name="delete-button-yes" class="mt-1 btn btn-danger object-right justify-end h-fit">Destroy</button> -->
                   
                    <div class="flex flex-row">
                        <label :for="'forcefully-destroy'" class="mt-2 mr-2 block text-sm font-medium text-default">Force Destroy</label>
                        <Switch v-model="forceDestroy" :class="[forceDestroy ? 'bg-primary' : 'bg-accent', 'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[forceDestroy ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[forceDestroy ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[forceDestroy ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>

                    <button v-if="!deleting && !hasChildren && !forceDestroy" @click="confirmDelete = true;" :id="getIdKey('confirm-delete-yes-A')" name="delete-button-yes-A" class="mt-1 btn btn-danger object-right justify-end h-fit">Destroy</button>
                    <button v-if="!deleting && hasChildren && !forceDestroy" disabled @click="confirmDelete = true;" :id="getIdKey('confirm-delete-yes-A')" name="delete-button-yes-A" class="mt-1 btn btn-danger object-right justify-end h-fit">Destroy</button>
                    <button v-if="!deleting && forceDestroy" @click="confirmDelete = true;" :id="getIdKey('confirm-delete-yes-B')" name="delete-button-yes-B" class="mt-1 btn btn-danger object-right justify-end h-fit">Destroy</button>
                    <button disabled v-if="deleting" :id="getIdKey('confirm-delete-spinner')" type="button" class="btn btn-danger object-right justify-end">
							<svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin text-default" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="text-success"/>
							</svg>
							Destroying...
					</button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { Switch } from '@headlessui/vue';
import { Ref, inject, ref, watch, provide  } from 'vue';
import { upperCaseWord } from '../../composables/helpers';
import Modal from '../common/Modal.vue';

interface ConfirmDeleteModalProps {
    idKey: string;
    item: string;
    name: string;
}

const props = defineProps<ConfirmDeleteModalProps>();

const showDeleteConfirmModal = inject<Ref<boolean>>('show-delete-modal')!;
const confirmDelete = inject<Ref<boolean>>('confirm-delete')!;
const deleting = inject<Ref<boolean>>('deleting')!;

const hasChildren = inject<Ref<boolean>>('has-children')!;

const forceDestroy = inject<Ref<boolean>>('force-destroy')!;
//const forceDestroy = ref(false);


// if (confirmDelete.value = true) {
//     deleting.value = true;
// } else {
//     deleting.value = false;
// }
// watch(confirmDelete, (newValue, oldValue) => {
	
//     if () {

//     }
//     // console.log('confirmDelete.value changed:', newValue);

//     // if (confirmDelete.value == true) {
//     //     deleting.value = true;
//     //     destroyDataset(selectedDataset.value!);
//     //     showDeleteConfirm.value = false;
//     //     refreshDatasets();
//     //     confirmDelete.value = false;
//     //     deleting.value = false;
//     // }
// });

const getIdKey = (name: string) => `${name}`;

//provide('force-destroy', forceDestroy);
</script>