<template>
	<Modal :isOpen="showDeleteConfirmModal" @close="showDeleteConfirmModal = false" :marginTop="'mt-60'" :width="'w-96'" :minWidth="'min-w-96'">
        <template v-slot:title>
            <legend class="flex justify-center">Are you sure?</legend>
        </template>
        <template v-slot:content>
            <div class="grid grid-rows-2 mt-3 justify-center">
                <h3 class="text-default row-start-1">Destroy {{upperCaseWord(props.item)}} <span class="text-danger">{{ props.name }}</span>?</h3>
            </div>
        </template>
        <template v-slot:footer>
            <div class="w-full grid grid-rows-1">
                <div class="button-group-row mt-2 justify-between">
                    <button @click="showDeleteConfirmModal = false" :id="getIdKey('confirm-delete-no')" name="delete-button-no" class="mt-1 btn btn-secondary object-left justify-start h-fit">Cancel</button>
                    <button @click="confirmDelete = true;" :id="getIdKey('confirm-delete-yes')" name="delete-button-yes" class="mt-1 btn btn-danger object-right justify-end h-fit">Destroy</button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { Ref, inject,  } from 'vue';
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

const getIdKey = (name: string) => `${name}`;

</script>