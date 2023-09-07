<template>
    <Modal :isOpen="showConfirmSector" @close="showConfirmSector = false" :marginTop="'mt-60'" :width="'w-96'" :minWidth="'min-w-96'">
        <template v-slot:title>
            <legend class="flex justify-center">Remove Virtual Device</legend>
        </template>
        <template v-slot:content>
            <div class="grid grid-flow-row mt-3 justify-items-center gap-1">
                <p class="text-default row-start-1">Are you sure you wish to change sector size from {{props.sector}}?</p>
                <p class="text-default row-start-2">This sets sector size for future VDevs but does not alter existing VDevs.</p>
                <p class="text-danger row-start-3">This can cause issues, namely with removing VDevs.</p>
            </div>
        </template>
        <template v-slot:footer>
            <div class="w-full grid grid-rows-1">
                <div class="button-group-row mt-2 justify-between">
                    <button @click="showConfirmSector = false" :id="getIdKey('confirm-change-no')" name="change-button-no" class="mt-1 btn btn-danger object-left justify-start h-fit">Cancel</button>
                    <button @click="confirmChangeSector = true;" :id="getIdKey('confirm-change-yes-B')" name="change-button-yes-B" class="mt-1 btn btn-primary object-right justify-end h-fit">Change</button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import {Ref, inject} from 'vue';
import Modal from '../../common/Modal.vue';

interface ConfirmSectorSizeProps {
    idKey: string;
    sector: string;
}

const props = defineProps<ConfirmSectorSizeProps>();

const showConfirmSector = inject<Ref<boolean>>('show-confirm-sector')!;
const confirmChangeSector = inject<Ref<boolean>>('confirm-sector')!;

const getIdKey = (name: string) => `${name}`;
</script>