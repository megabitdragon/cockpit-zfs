<template>
    <Modal :isOpen="showReceiveDataset" @close="showReceiveDataset = false" :marginTop="'mt-28'" :width="'w-8/12'" :minWidth="'min-w-8/12'">
            <template v-slot:title>
                <legend class="flex justify-center">Receive Dataset</legend>
            </template>
            <template v-slot:content>

            </template>
    </Modal>

</template>
<script setup lang="ts">
import Modal from '../common/Modal.vue';
import { ref, Ref, inject, watch } from 'vue';

interface ReceiveDatasetProps {
    
}

const props = defineProps<ReceiveDatasetProps>();

const showReceiveDataset = inject<Ref<boolean>>('show-receive-dataset')!;
</script>