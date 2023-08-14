<template>
	<Modal :isOpen="showDeleteConfirm" @close="showDeleteConfirm = false" :marginTop="'mt-60'" :width="'w-96'" :minWidth="'min-w-96'">
        <template v-slot:title>
            <legend class="flex justify-center">Delete?</legend>
        </template>
        <template v-slot:content>
            <div class="flex justify-center">
                <h3 class="text-default">Are you sure you want to delete this {{upperCaseWord(props.item)}}?</h3>
            </div>
        </template>
        <template v-slot:footer>
            <!-- <div class="flex justify-center">
                <div class="button-group-row justify-between">
                    <button @click="showDeleteConfirm = false" :id="getIdKey('confirm-delete-no')" name="delete-button-no" class="mt-1 btn btn-secondary object-left justify-start h-fit">Cancel</button>
                    <button @click="confirmDelete = true;" :id="getIdKey('confirm-delete-yes')" name="delete-button-yes" class="mt-1 btn btn-danger object-right justify-end h-fit">Yes</button>
                </div>
            </div> -->
            <div class="w-full grid grid-rows-1">
                <div class="button-group-row mt-2 justify-between">
                    <button @click="showDeleteConfirm = false" :id="getIdKey('confirm-delete-no')" name="delete-button-no" class="mt-1 btn btn-secondary object-left justify-start h-fit">Cancel</button>
                    <button @click="confirmDelete = true;" :id="getIdKey('confirm-delete-yes')" name="delete-button-yes" class="mt-1 btn btn-danger object-right justify-end h-fit">Yes</button>
                </div>
            </div>
            <!-- <div class="w-full grid grid-rows-2">
                <div class="w-full row-start-1">
                    <div class="button-group-row mt-2 justify-self-center">
                        <p class="text-danger" v-if="sizeFeedback">{{ sizeFeedback }}</p>
                    </div>
                </div>
                <div class="button-group-row w-full row-start-2 justify-between mt-2">
                    <button @click="showFSConfig = false" :id="getIdKey('cancel-configure-btn')" name="cancel-configure-btn" class="mt-1 btn btn-danger object-left justify-start h-fit">Cancel</button>
                    <button @click="fsConfigureBtn(fileSystemConfig)" :id="getIdKey('create-fs-btn')" name="create-fs-btn" class="mt-1 btn btn-primary object-right justify-end h-fit">Configure</button>
                </div>
            </div> -->
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
    fileSystem?: FileSystemData;
    pool?: PoolData;
    snapshot?: Snapshot;
}

const props = defineProps<ConfirmDeleteModalProps>();

const showDeleteConfirm = inject<Ref<boolean>>('show-delete-confirm')!;
const confirmDelete = inject<Ref<boolean>>('confirm-delete')!;

const getIdKey = (name: string) => `${name}`;

</script>