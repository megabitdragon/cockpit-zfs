<template>
	<Modal :isOpen="showRemoveVDevConfirm" @close="showRemoveVDevConfirm = false" :marginTop="'mt-60'" :width="'w-96'" :minWidth="'min-w-96'">
        <template v-slot:title>
            <legend class="flex justify-center">Remove Virtual Device</legend>
        </template>
        <template v-slot:content>
            <div class="grid grid-flow-row mt-3 justify-items-center gap-1">
                <p class="text-default row-start-1">Are you sure you wish to remove <b>{{ props.vDevName }}</b> from <b>{{props.poolName}}</b>?</p>
            </div>
        </template>
        <template v-slot:footer>
            <div class="w-full grid grid-rows-1">
                <div class="button-group-row mt-2 justify-between">
                    <button @click="showRemoveVDevConfirm = false" :id="getIdKey('confirm-remove-no')" name="remove-button-no" class="mt-1 btn btn-danger object-left justify-start h-fit">Cancel</button>

                    <button v-if="!removing" @click="confirmRemove = true;" :id="getIdKey('confirm-remove-yes-B')" name="remove-button-yes-B" class="mt-1 btn btn-primary object-right justify-end h-fit">Remove</button>
                    <button disabled v-if="removing" :id="getIdKey('confirm-remove-spinner')" type="button" class="btn btn-primary object-right justify-end h-fit">
                        <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin text-default" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="text-success"/>
                        </svg>
                        Removing...
					</button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { Ref, inject } from 'vue';
import Modal from '../../common/Modal.vue';

interface ConfirmRemoveVDevModalProps {
    idKey: string;
    poolName: string;
    vDevName: string;
}

const props = defineProps<ConfirmRemoveVDevModalProps>();

const showRemoveVDevConfirm = inject<Ref<boolean>>('show-remove-modal')!;
const confirmRemove = inject<Ref<boolean>>('confirm-remove')!;
const removing = inject<Ref<boolean>>('removing')!;

const getIdKey = (name: string) => `${name}`;

</script>