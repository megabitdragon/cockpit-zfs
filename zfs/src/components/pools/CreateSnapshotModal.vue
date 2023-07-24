<template>
    <Modal :isOpen="showSnapshotModal" :marginTop="'mt-48'">
        <template v-slot:title>
            <legend class="flex justify-center">Create Snapshot</legend>
        </template>
        <template v-slot:content></template>

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
import { loadSnapshots } from '../../scripts/loadData';
import { getSnapshots } from '../../scripts/snapshots';

const showSnapshotModal = inject<Ref<boolean>>('create-snap-modal')!;

function createSnapshotOK() {
	showSnapshotModal.value = false;
}


const getIdKey = (name: string) => `${name}`;
</script>