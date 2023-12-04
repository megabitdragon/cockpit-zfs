<template>
    <Modal :isOpen="showSendDataset" @close="showSendDataset = false" :marginTop="'mt-28'" :width="'w-5/12'" :minWidth="'min-w-5/12'">
            <template v-slot:title>
                <legend class="flex justify-center">Send Dataset</legend>
            </template>
            <template v-slot:content>
                <div class="">
                    <div class="mt-2">
                        <!-- Sending Snapshot: (self) -->
                        <label :for="getIdKey('sending-dataset-name')" class="mt-1 block text-sm font-medium leading-6 text-default">Snapshot To Send:</label>
                        <label :id="getIdKey('sending-dataset-name')" class="mt-1 block text-sm font-base leading-6 text-default">{{sendName}}</label>
                    </div>
                    <div class="mt-2">
                        <!-- Receiving Dataset: [User Supplied] -->
                        <label :for="getIdKey('receiving-dataset-name')" class="mt-1 block text-sm font-medium leading-6 text-default">Receiving Dataset:</label>
                        <input @keydown.enter="" @change="doesRecvDatasetExist()" :id="getIdKey('receiving-dataset-name')" type="text" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default" name="receiving-dataset-name" v-model="destinationName" placeholder="Destination Name Here"/>
                        <p v-if="invalidConfig" class="mt-1 text-sm text-danger">{{ invalidConfigMsg }}</p>
                        <p v-if="invalidConfig" class="mt-1 text-sm text-muted"><i>{{ mostRecentDestSnapMsg }}</i></p>
                        <p v-if="invalidConfig" class="mt-1 text-sm text-danger">{{ useForceOverwriteMsg }}</p>
                    </div>
                    <div class="mt-2">
                        <!-- Receiving Host: (Add Tooltip (i): Optional-> If Empty, then Local) -->
                        <label :for="getIdKey('receiving-host-name')" class="mt-1 block text-sm font-medium leading-6 text-default">Receiving Host:</label>
                        <input @keydown.enter="" :id="getIdKey('receiving-host-name')" type="text" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default" name="receiving-host-name" v-model="destinationHost" placeholder="(Leave empty if sending locally.)"/>
                    </div>
                    <div class="mt-2">
                        <!-- Host User -->
                        <label :for="getIdKey('receiving-host-user')" class="mt-1 block text-sm font-medium leading-6 text-default">Receiving User:</label>
                        <input @keydown.enter="" :id="getIdKey('receiving-host-user')" type="text" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default" name="receiving-host-user" v-model="destinationHostUser" placeholder="Destination Host User"/>
                   </div>
                    <div class="mt-2">
                        <!-- Receiving Port: [Default -> 22, User Can Change]-->
                        <label :for="getIdKey('receiving-port')" class="mt-1 block text-sm font-medium leading-6 text-default">Receiving Port:</label>
                        <input @keydown.enter="" :id="getIdKey('receiving-port')" type="text" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default" name="receiving-port" v-model="destinationPort"/>
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
                        <!-- Force Overwrite: [Checkbox -> (-F) option] -->
                        <label v-if="invalidConfig" :for="getIdKey('force-overwrite-toggle')" class="mt-1 block text-sm font-medium leading-6 text-danger col-span-1">
                            Force Overwrite:
                            <input :id="getIdKey('force-overwrite-toggle')" v-model="forceOverwrite" type="checkbox" class="ml-2 w-5 h-5 text-success bg-well border-default rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2"/>	
                        </label>
                    </div>
                    <div class="mt-2">
                        <p v-if="invalidFlags" class="mt-1 text-sm text-danger">{{ invalidFlagMsg }}</p>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="button-group-row w-full row-start-2 justify-between mt-2">
                    <button id="cancel" class="mt-1 btn btn-danger object-left justify-start h-fit" @click="showSendDataset = false">Cancel</button>
                    <button v-if="!sending && !invalidConfig" @click="sendBtn()" :id="getIdKey('send-btn')" name="send-btn" class="mt-1 btn btn-primary object-right justify-end h-fit">Send</button>
                    <button v-if="!sending && invalidConfig && !forceOverwrite" disabled @click="sendBtn()" :id="getIdKey('send-btn')" name="send-btn" class="mt-1 btn btn-primary object-right justify-end h-fit">Send</button>
                    <button v-if="!sending && invalidConfig && forceOverwrite" @click="sendBtn()" :id="getIdKey('send-btn')" name="send-btn" class="mt-1 btn btn-primary object-right justify-end h-fit">Send</button>
                    <button disabled v-if="sending && !forceOverwrite" :id="getIdKey('sending-spinner')" type="button" class="btn btn-danger object-right justify-end">
                        <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin text-default" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="text-success"/>
                        </svg>
                        Sending...
                    </button>
                    <button disabled v-if="sending && forceOverwrite" :id="getIdKey('sending-spinner')" type="button" class="btn btn-danger object-right justify-end">
                        <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin text-default" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="text-success"/>
                        </svg>
                        Overwriting...
                    </button>
                </div>
            </template>
    </Modal>

</template>
<script setup lang="ts">
import Modal from '../common/Modal.vue';
import { ref, Ref, inject, watch, computed } from 'vue';
import { sendSnapshot, doesDatasetExist, getRecentSnaps, formatRecentSnaps, getSendProgress, loadSendProgress } from '../../composables/snapshots';
import { convertTimestampToLocal, getRawTimestampFromString, convertRawTimestampToString,  } from '../../composables/helpers';

interface SendSnapshotProps {
    idKey: string;
    snapshot: Snapshot;
    name: string;
}

const props = defineProps<SendSnapshotProps>();
const datasets = inject<Ref<FileSystemData[]>>('datasets')!;
const snapshots = inject<Ref<Snapshot[]>>('snapshots')!;
const showSendDataset = inject<Ref<boolean>>('show-send-dataset')!;
const sending = inject<Ref<boolean>>('sending')!;
const confirmSend = inject<Ref<boolean>>('confirm-send')!;
const sendName = ref(props.name);
const secondNameIncremental = ref('');
const destinationName = ref('');
const destinationHost = ref('');
const destinationPort = ref('22');
const sendCompressed = ref(false);
const sendRaw = ref(false);
const sendIncremental = ref(false);
const forceOverwrite = ref(false);
const lastCommonSnap = ref();
const mostRecentLocalDestSnap = ref<Snapshot>();
const mostRecentRemoteDestSnap = ref<SnapSnippet>();
const mostRecentDestSnapMsg = ref('');
const invalidConfig = ref(false);
const invalidConfigMsg = ref('');
const useForceOverwriteMsg = ref("Use 'Force Overwrite' to force a COMPLETE OVERWRITE of Destination File System.");
const invalidFlags = ref(false);
const invalidFlagMsg = ref('');
const destinationHostUser = ref('');
const datasetCheckResult = ref();
const snapSnips = ref<SnapSnippet[]>([]);

const sendingData = ref<SendingDataset>({
    sendName: sendName.value,
    sendIncName: secondNameIncremental.value,
    recvName: destinationName.value,
    recvHost: destinationHost.value,
    recvPort: destinationPort.value,
    sendOpts: {
        compressed: sendCompressed.value,
        raw: sendRaw.value,
        incremental: sendIncremental.value,
        forceOverwrite: forceOverwrite.value,
    },
    recvHostUser: destinationHostUser.value,
});

const isSendLocal = computed(() => {
    if (destinationHost.value == "") {
        return true;
    } else {
        return false;
    }
});

function doesRecvDatasetExist() {
    try {
        return datasets.value.some(dataset => dataset.name === sendingData.value.recvName);
    } catch (error) {
        console.error('Error checking dataset', error);
    }
}

async function doesRemoteDatasetExist() {
    try {
        return await doesDatasetExist(sendingData.value);
    } catch (error) {
        console.error('Error checking dataset', error);
    }
}

async function setSendData() {
    sendingData.value.sendName = sendName.value;

    if (sendCompressed.value && sendRaw.value) {
        invalidFlags.value = true;
        invalidFlagMsg.value = "Cannot have Compressed and Raw selected at the same time.";
    } else {
        invalidConfig.value = false;
        invalidFlags.value = false;

        const sourceDataset = computed(() => {
            const sourceDatasetName = sendName.value.split("@").shift();
            return datasets.value.find(dataset => dataset.name == sourceDatasetName);
        });

        sendingData.value.recvName = destinationName.value;
        sendingData.value.recvHost = destinationHost.value;

        if (destinationPort.value != '22') {
            sendingData.value.recvPort = destinationPort.value;
        } else {
            sendingData.value.recvPort = '22';
        }
       
        if (sourceDataset.value!.encrypted) {
            sendRaw.value = true;
            sendCompressed.value = false;
            sendingData.value.sendOpts.raw = true;
            sendingData.value.sendOpts.compressed = false;
        } else {
            sendingData.value.sendOpts.raw = sendRaw.value;
            sendingData.value.sendOpts.compressed = sendCompressed.value;
        }

        sendingData.value.sendOpts.forceOverwrite = forceOverwrite.value;
        sendingData.value.recvHostUser = destinationHostUser.value;

        if (isSendLocal.value) {
            if (doesRecvDatasetExist()) {
                lastCommonSnap.value = await checkForLastCommonSnap();
                console.log('local lastCommonSnap:', lastCommonSnap.value);
                if (lastCommonSnap.value) {
                    sendIncremental.value = true;
                    sendingData.value.sendOpts.incremental = sendIncremental!.value;
                    sendingData.value.sendIncName! = lastCommonSnap.value.name;
                    invalidConfig.value = false;
                } else {
                    sendIncremental.value = false;
                    sendingData.value.sendIncName! = "";
                    invalidConfig.value = true;
                    invalidConfigMsg.value = "Destination already exists and has been modified since most recent snapshot.";
                    mostRecentDestSnapMsg.value = `Most recent snapshot: ${mostRecentLocalDestSnap.value!.name}`;
                }
            } else {
                sendIncremental.value = false;
                sendingData.value.sendIncName! = "";
            }
        } else {
            datasetCheckResult.value = await doesRemoteDatasetExist();
            if (datasetCheckResult.value) {
                lastCommonSnap.value = await checkForLastCommonSnap();
                console.log('remote lastCommonSnap:', lastCommonSnap.value);
                if (lastCommonSnap.value) {
                    sendIncremental.value = true;
                    sendingData.value.sendOpts.incremental = sendIncremental!.value;
                    sendingData.value.sendIncName! = lastCommonSnap.value.name;
                    invalidConfig.value = false;
                } else {
                    sendIncremental.value = false;
                    sendingData.value.sendIncName! = "";
                    invalidConfig.value = true;
                    invalidConfigMsg.value = "Remote destination already exists and has been modified since most recent snapshot.";
                    mostRecentDestSnapMsg.value = `Most recent remote snapshot: ${mostRecentRemoteDestSnap.value!.name}`;
                }
            } else {
                sendIncremental.value = false;
                sendingData.value.sendIncName! = "";
            }
        }
    }
}

async function checkForLastCommonSnap() {
    try {
        const sortedSnapshots = computed(() => {
            return snapshots.value.sort((a, b) => {
                return b.creationTimestamp.localeCompare(a.creationTimestamp);
            });
        });
        // console.log('sortedSnapshots:', sortedSnapshots.value);
        const sourceDataset = computed(() => {
            return sendName.value.split("@").shift();
        });
        // console.log(`sourceDataset: ${sourceDataset.value}`);
        const sourceDatasetSnaps = computed(() => {
            return sortedSnapshots.value.filter(snapshot => snapshot.dataset == sourceDataset.value);
        });
        // console.log('sourceDatasetSnaps:', sourceDatasetSnaps.value);
        // console.log(`destinationDataset: ${destinationName.value}`)
        const sourceSnap = computed(() => {
            return sourceDatasetSnaps.value.find(snap => snap.name == sendName.value);
        });
        // console.log('sourceSnap:', sourceSnap.value);

        if (isSendLocal.value) {
            const destinationDatasetSnaps = computed(() => {
                return sortedSnapshots.value.filter(snapshot => snapshot.dataset == destinationName.value);
            });
            // console.log('local destinationDatasetSnaps:', destinationDatasetSnaps.value);
            return compareLocalTimestamp(destinationDatasetSnaps.value, sourceDatasetSnaps.value, sourceSnap.value!); 

        } else {
            await formatRecentSnaps(sendingData.value, snapSnips.value);
            // console.log('remote destinationDatasetSnaps:', snapSnips.value);

            const result = await compareRemoteTimestamp(snapSnips.value, sourceDatasetSnaps.value, sourceSnap.value!);
            return result; 
        }
       
    } catch (error) {
        console.error('Error checking snapshot', error);
    }
}

function compareLocalTimestamp(destinationDatasetSnaps : Snapshot[], sourceDatasetSnaps : Snapshot[], sourceSendSnap : Snapshot) {
    mostRecentLocalDestSnap.value = destinationDatasetSnaps[0];
    // console.log('local mostRecentLocalDestSnap:', mostRecentLocalDestSnap.value);

    if (Number(mostRecentLocalDestSnap.value.creationTimestamp) < Number(sourceSendSnap.creationTimestamp)) {
        const sourceSnapMatch = computed(() => {
            return sourceDatasetSnaps.find(snap => snap.guid == mostRecentLocalDestSnap.value!.guid);
        });
        // console.log('local sourceSnapMatch:', sourceSnapMatch.value);
        return sourceSnapMatch.value;
        
    } else if (mostRecentLocalDestSnap.value.guid == sourceSendSnap.guid) {
        console.log('sendSnap is the same as mostRecentDestSnap');
        return null;
    } else {
        console.log('invalid local lastCommonSnap match');
        return null;
    }
}

async function compareRemoteTimestamp(snapSnips : SnapSnippet[], sourceDatasetSnaps : Snapshot[], sourceSendSnap : Snapshot) {
    console.log('snapSnips', snapSnips);
    // console.log('snapSnips length', snapSnips.length);
    mostRecentRemoteDestSnap.value = snapSnips[0];
    console.log('remote mostRecentRemoteDestSnap:', mostRecentRemoteDestSnap.value);

    console.log('mostRecentRemoteDestSnap.value.creation', Number(getRawTimestampFromString(mostRecentRemoteDestSnap.value.creation)));
    console.log('sourceSendSnap.creationTimestamp', Number(getRawTimestampFromString(convertTimestampToLocal(convertRawTimestampToString(sourceSendSnap.creationTimestamp)))));

    if (mostRecentRemoteDestSnap.value.guid == sourceSendSnap.guid) {
        console.log('sendSnap is the same as mostRecentDestSnap');
        return null;
    } else {
        if (Number(getRawTimestampFromString(mostRecentRemoteDestSnap.value.creation)) < Number(getRawTimestampFromString(convertTimestampToLocal(convertRawTimestampToString(sourceSendSnap.creationTimestamp))))) {
            const sourceSnapMatch = computed(() => {
                const source = sourceDatasetSnaps.find(snap => snap.guid == mostRecentRemoteDestSnap.value!.guid);
                console.log('source', source);
                return source; 
            });
            console.log('remote sourceSnapMatch:', sourceSnapMatch.value);
            return sourceSnapMatch.value;
        } else {
            console.log('invalid remote lastCommonSnap match');
            return null;
        }
    }

}

   

async function sendBtn() {
    await setSendData();
    console.log('Sending data:', sendingData.value);
    
    if (!invalidConfig.value && !invalidFlags.value) {
        sending.value = true;
        await sendSnapshot(sendingData.value);
        // await loadSendProgress(sendingData.value);
        sending.value = false;
        showSendDataset.value = false;
        confirmSend.value = true;
    } else if (invalidConfig.value) {
        if (forceOverwrite.value) {
            sending.value = true;
            // await loadSendProgress(sendingData.value);
            invalidConfig.value = false;
            await sendSnapshot(sendingData.value);
            sending.value = false;
            showSendDataset.value = false;
            confirmSend.value = true;
        }
    } 
}

const getIdKey = (name: string) => `${props.idKey}-${name}`;
</script>