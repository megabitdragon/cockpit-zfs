<template>
    <Modal :isOpen="showSendDataset" @close="showSendDataset = false" :marginTop="'mt-28'" :width="'w-8/12'" :minWidth="'min-w-8/12'">
            <template v-slot:title>
                <legend class="flex justify-center">Send Dataset</legend>
            </template>
            <template v-slot:content>

            </template>
    </Modal>

</template>
<script setup lang="ts">
import Modal from '../common/Modal.vue';
import { ref, Ref, inject, watch } from 'vue';

interface SendDatasetProps {
    
}

const props = defineProps<SendDatasetProps>();

const showSendDataset = inject<Ref<boolean>>('show-send-dataset')!;
</script>