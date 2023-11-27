<template>
    <Modal :isOpen="showSendDataset" @close="showSendDataset = false" :marginTop="'mt-28'" :width="'w-5/12'" :minWidth="'min-w-5/12'">
            <template v-slot:title>
                <legend class="flex justify-center">Send Dataset</legend>
            </template>
            <template v-slot:content>
                <div class="">
                    <div class="mt-2">
                        <!-- Sending Dataset: (self -> also select?) -->
                        <label :for="getIdKey('sending-dataset-name')" class="mt-1 block text-sm font-medium leading-6 text-default">Snapshot To Send:</label>
                        <label :id="getIdKey('sending-dataset-name')" class="mt-1 block text-sm font-base leading-6 text-default">{{sendingData.sendName}}</label>
                    </div>
                    <div class="mt-2">
                        <!-- Receiving Dataset: [User Supplied] -->
                        <label :for="getIdKey('receiving-dataset-name')" class="mt-1 block text-sm font-medium leading-6 text-default">Receiving Dataset:</label>
                        <input @keydown.enter="" @change="doesRecvDatasetExist()" :id="getIdKey('receiving-dataset-name')" type="text" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default" name="receiving-dataset-name" v-model="sendingData.recvName" placeholder="Destination Name Here"/>
                        <p v-if="doesRecvDatasetExist()" class="mt-1 text-sm text-danger">Dataset already exists, toggle Force Overwrite to overwrite it (Must not have existing snapshots).</p>
                    </div>
                    <div class="mt-2">
                        <!-- Receiving Host: (Add Tooltip (i): Optional-> If Empty, then Local) -->
                        <label :for="getIdKey('receiving-host-name')" class="mt-1 block text-sm font-medium leading-6 text-default">Receiving Host:</label>
                        <input @keydown.enter="" :id="getIdKey('receiving-host-name')" type="text" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default" name="receiving-host-name" v-model="sendingData.recvHost" placeholder="(Leave empty if sending locally.)"/>
                    </div>
                    <div class="mt-2">
                        <!-- Receiving Port: [Default -> 22?, User Can Change]-->
                        <label :for="getIdKey('receiving-port')" class="mt-1 block text-sm font-medium leading-6 text-default">Receiving Port:</label>
                        <input @keydown.enter="" :id="getIdKey('receiving-port')" type="text" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default" name="receiving-port" v-model="sendingData.recvPort"/>
                    </div>
                    <div class="mt-2 grid grid-flow-col grid-cols-2">
                        <!-- Send Compressed: [Checkbox -> (-Lce) options] *** Cannot be used if Encrypted -->
                        <label :for="getIdKey('send-compressed-toggle')" class="mt-1 block text-sm font-medium leading-6 text-default col-span-1">
                            Send Compressed: 
                            <input :id="getIdKey('send-compressed-toggle')" v-model="sendCompressed" type="checkbox" class="ml-2 w-5 h-5 text-success bg-well border-default rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2"/>	
                        </label>
                        <!-- Send Raw: [Checkbox -> (-w) option] *** If Encrypted, force this mode -->
                        <label :for="getIdKey('send-raw-toggle')" class="mt-1 block text-sm font-medium leading-6 text-default col-span-1">
                            Send Raw:
                            <input :id="getIdKey('send-raw-toggle')" v-model="sendRaw" type="checkbox" class="ml-2 w-5 h-5 text-success bg-well border-default rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2"/>	
                        </label>

                        <!-- Use INCREMENTAL INSTEAD -->
                        <!-- Force Overwrite: [Checkbox -> (-F) option] -->
                        <label v-if="doesRecvDatasetExist()" :for="getIdKey('force-overwrite-toggle')" class="mt-1 block text-sm font-medium leading-6 text-default col-span-1">
                            Force Overwrite:
                            <input :id="getIdKey('force-overwrite-toggle')" v-model="forceOverwrite" type="checkbox" class="ml-2 w-5 h-5 text-success bg-well border-default rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2"/>	
                        </label>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="button-group-row w-full row-start-2 justify-between mt-2">
                    <button id="cancel" class="mt-1 btn btn-danger object-left justify-start h-fit" @click="showSendDataset = false">Cancel</button>
                    <button v-if="!sending" @click="sendBtn(sendingData)" :id="getIdKey('send-btn')" name="send-btn" class="mt-1 btn btn-primary object-right justify-end h-fit">Send</button>
                    <button disabled v-if="sending" :id="getIdKey('sending-spinner')" type="button" class="btn btn-danger object-right justify-end">
                        <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin text-default" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="text-success"/>
                        </svg>
                        Sending...
                    </button>
                </div>
            </template>
    </Modal>

</template>
<script setup lang="ts">
import Modal from '../common/Modal.vue';
import { ref, Ref, inject, watch, computed } from 'vue';
import { sendSnapshot } from '../../composables/snapshots';
import { upperCaseWord } from '../../composables/helpers';

interface SendSnapshotProps {
    idKey: string;
    // dataset?: FileSystemData;
    snapshot: Snapshot;
    // dataType: 'filesystem' | 'snapshot';
    name: string;
}

const props = defineProps<SendSnapshotProps>();
const datasets = inject<Ref<FileSystemData[]>>('datasets')!;
const snapshots = inject<Ref<Snapshot[]>>('snapshots')!;
const showSendDataset = inject<Ref<boolean>>('show-send-dataset')!;
const sending = inject<Ref<boolean>>('sending')!;
const confirmSend = inject<Ref<boolean>>('confirm-send')!;
const sendName = ref(props.name);
const destinationName = ref('');
const destinationHost = ref('');
const destinationPort = ref('22');
const sendCompressed = ref(false);
const sendRaw = ref(false);
const sendIncremental = ref(false);
const forceOverwrite = ref(false);


const sendingData = ref<SendingDataset>({
    sendName: props.name,
    recvName: '',
    recvHost: '',
    recvPort: '22',
    sendOpts: {
        compressed: sendCompressed.value,
        raw: sendRaw.value,
        incremental: sendIncremental.value,
        forceOverwrite: forceOverwrite.value,
    },
});

function doesRecvDatasetExist() {
    try {
        return datasets.value.some(dataset => dataset.name === sendingData.value.recvName);
    } catch (error) {
        console.error('Error checking dataset', error);
    }
}

function doesRecvSnapshotExist() {
    try {
        // return snapshots.value.find(snapshot => snapshot.guid === sendingData.value.)
    } catch (error) {
        console.error('Error checking snapshot', error);
    }
}

async function sendBtn(sendingData : SendingDataset) {
    sending.value = true;
    console.log(sendingData);
    await sendSnapshot(sendingData);
    sending.value = false;
    showSendDataset.value = false;
    confirmSend.value = true;
}

const getIdKey = (name: string) => `${props.idKey}-${name}`;
</script>