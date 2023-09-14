<template>
    <Modal :isOpen="showModalFlag" @close="showModalFlag = false" :marginTop="'mt-60'" :width="'w-96'" :minWidth="'min-w-min'">
        <template v-slot:title>
            <legend class="flex justify-center">{{ upperCaseWord(props.operation) }} {{ upperCaseWord(props.item) }}</legend>
        </template>
        <template v-slot:content>
            <div class="grid grid-flow-row mt-3 justify-items-center gap-1">
                <p class="text-default row-start-1">Are you sure you wish to {{props.operation}} <b>{{ props[props.item].name }}</b>?</p>

                <div v-if="props.operation == 'destroy' && props.hasChildren!" >
                    <div v-if="props.item == 'pool'">
                        <div class="text-danger font-medium grid grid-rows-3 row-span-3 row-start-2 justify-items-center">
                            <p class="text-danger font-medium row-start-1">WARNING!!!</p>
                            <p class="text-danger row-start-2">{{ upperCaseWord(props.item) }} <b>{{ props[props.item]!.name }}</b> has children.</p>
                            <p class="text-default row-start-3">If you wish to {{ props.operation }}, use <span class="text-danger">{{upperCaseWord(option1)}}</span>.</p>
                        </div>
                    </div>

                    <div v-if="props.item == 'filesystem'">
                        <div class="text-danger font-medium grid grid-rows-3 row-span-3 row-start-2 justify-items-center">
                            <p class="text-danger font-medium row-start-1">WARNING!!!</p>
                            <p class="text-danger row-start-2">{{ upperCaseWord(props.item) }} <b>{{ props[props.item]!.name }}</b> has children.</p>
                            <p class="text-default row-start-3">If you wish to destroy, use <span class="text-danger">Destroy all children/dependents</span>.</p>            
                        </div>

                        <label :for="getIdKey('destroy-children')" class="mt-2 mr-2 block text-sm font-medium text-default">Destroy all children</label>
                        <Switch v-model="option3Toggle" :id="getIdKey('destroy-children')" :class="[option3Toggle ? 'bg-primary' : 'bg-accent', 'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[option3Toggle ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[option3Toggle ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[option3Toggle ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                        
                        <label :for="getIdKey('destroy-dependents')" class="mt-2 mr-2 block text-sm font-medium text-default">Destroy all dependents (children + clones)</label>
                        <Switch v-model="option4Toggle" :id="getIdKey('destroy-dependents')" :class="[option4Toggle ? 'bg-primary' : 'bg-accent', 'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[option4Toggle ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[option4Toggle ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[option4Toggle ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
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
            <div class="w-full grid grid-rows-1">
                <div class="button-group-row mt-2 justify-between">
                    <button @click="showModalFlag = false" :id="getIdKey('confirm-delete-no')" name="delete-button-no" class="mt-1 btn btn-secondary object-left justify-start h-fit">Cancel</button>
                   
                    <div v-if="props.firstOption" class="flex flex-row">
                        <label :for="getIdKey('forcefully-destroy')" class="mt-3 mr-2 block text-sm font-medium text-default">{{upperCaseWord(option1)}}</label>
                        <Switch v-model="option1Toggle" :id="getIdKey('forcefully-destroy')" :class="[option1Toggle ? 'bg-primary' : 'bg-accent', 'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[option1Toggle ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[option1Toggle ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[option1Toggle ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>

                    <div v-if="props.secondOption" class="flex flex-row">
                        <label :for="getIdKey('clear-disk-labels')" class="mt-2 mr-2 block text-sm font-medium leading-6 text-default">{{upperCaseWord(option2)}}</label>
                        <Switch v-model="option2Toggle" :id="getIdKey('clear-disk-labels')" :class="[option2Toggle! ? 'bg-primary' : 'bg-accent', 'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[option2Toggle! ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[option2Toggle! ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[option2Toggle! ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>

                    <!-- fix this to account for option 3 and 4 if filesystem destroy -->
                    <button v-if="!operationRunning && !hasChildren && !option1" @click="confirmOperation" :id="getIdKey('confirm-delete-yes-A')" name="delete-button-yes-A" class="mt-1 btn btn-danger object-right justify-end h-fit">{{upperCaseWord(props.operation)}}</button>
                    <button v-if="!operationRunning && hasChildren && !option1" disabled @click="confirmOperation" :id="getIdKey('confirm-delete-yes-A')" name="delete-button-yes-A" class="mt-1 btn btn-danger object-right justify-end h-fit">{{upperCaseWord(props.operation)}}</button>
                    <button v-if="!operationRunning && option1" @click="confirmOperation" :id="getIdKey('confirm-delete-yes-B')" name="delete-button-yes-B" class="mt-1 btn btn-danger object-right justify-end h-fit">{{upperCaseWord(props.operation)}}</button>
                    <button disabled v-if="operationRunning" :id="getIdKey('confirm-delete-spinner')" type="button" class="btn btn-danger object-right justify-end h-fit">
							<svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin text-default" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="text-success"/>
							</svg>
							{{upperCaseWord(operation)}}ing...
					</button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { Switch } from '@headlessui/vue';
import { Ref, inject, watch, ref } from 'vue';
import { upperCaseWord } from '../../../composables/helpers';
import Modal from '../Modal.vue';

interface UniversalConfirmationProps {
    idKey: string;
    item: string;
    operation: string;
    confirmOperation: ConfirmationCallback;

    pool?: PoolData;
    vDev?: vDevData;
    disk?: DiskData;
    filesystem?: FileSystemData;
    firstOption?: string;
    secondOption?: string;
    thirdOption?: string;
    fourthOption?: string;

    hasChildren: boolean;
}

const props = defineProps<UniversalConfirmationProps>();

const operationRunning = inject<Ref<boolean>>('modal-confirm-running')!;
const showModalFlag = inject<Ref<boolean>>('modal-confirm-show')!;
const confirmBool = ref(false);

//options: force (mount, unmount, destroy, replace, offline), secureTRIM, expand device
const option1 = props.firstOption;
const option1Toggle = inject<Ref<boolean>>('modal-option-one-toggle')!;

//options: labelclear, scrub after online, temporary offline
const option2 = props.secondOption;
const option2Toggle = inject<Ref<boolean>>('modal-option-two-toggle')!;

//option: destroy children
const option3 = props.thirdOption;
const option3Toggle = inject<Ref<boolean>>('modal-option-three-toggle')!;

//option: destroy children + dependents
const option4 = props.fourthOption;
const option4Toggle = inject<Ref<boolean>>('modal-option-four-toggle')!;

/*
///////// Values for Confirmation Modals ////////////
/////////////////////////////////////////////////////
const item = ref('');
const showModalFlag = ref(false);
const operation = ref('');
const operationConfirm = ref(false);
const operationRunning = ref(false);

const confirmOperation : ConfirmationCallback = () => {
	operationConfirm.value = !operationConfirm.value;
}

const hasExtraOptions = ref(false);
const firstOption = ref('');
const secondOption = ref('');
const thirdOption = ref('');
const fourthOption = ref('');
const poolHasChildren = ref(false);

provide('modal-confirm-show', showModalFlag);
provide('modal-confirm-running', operationRunning);
provide('modal-option-one-toggle', firstOptionToggle);
provide('modal-option-two-toggle', secondOptionToggle);
provide('modal-option-three-toggle', thirdOptionToggle);
provide('modal-option-four-toggle', fourthOptionToggle);
*/




const getIdKey = (name: string) => `${name}`;
</script>