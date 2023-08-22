<template>
	<Modal :isOpen="showImportModal" :marginTop="'mt-28'" :width="'w-5/6'" :minWidth="'min-w-5/6'">

    </Modal>
</template>
<script setup lang="ts">
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
import { Switch } from '@headlessui/vue';
import Modal from '../common/Modal.vue';

interface ImportPoolProps {

}

const props = defineProps<ImportPoolProps>();

const showImportModal = inject<Ref<boolean>>('show-import-modal')!;
</script>