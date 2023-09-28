<template>
    <div>
        <div class="grid grid-cols-4 gap-1 justify-items-center">
            <span v-if="!paused" class="text-muted col-span-4">
                {{ stateMessage }}
            </span>
       
            <span class="text-muted col-span-4">
                {{ amountProcessed }} of {{ amountTotal }} processed. <br/>
                <!-- {{ amountRemaining }} remaining. <br/> -->
                <!-- bytes processed: {{ scanObject.bytes_processed }} <br/>
                bytes issued: {{ scanObject.bytes_issued }} <br/>
                bytes to process: {{ scanObject.bytes_to_process }} <br/> -->
            </span>
            <span class="text-muted col-span-4">
                Completes in {{ timeRemaining }}
            </span>
            <span v-if="paused && !operationRunning && !operationCompleted" class="text-muted col-span-4">
                {{ scanFunction }} paused at {{ scanObject.pause }}
            </span>

            <div class="col-span-4 min-w-max w-full bg-well rounded-full relative flex h-6 min-h-min max-h-max overflow-hidden">
                <div class="bg-green-600 h-6 min-h-min max-h-max" :style="{ width: `${parseFloat(scanPercentage.toFixed(2))}%` }">
                    <div class="absolute inset-0 flex items-center justify-center text-s font-medium text-default text-center p-0.5 leading-none">
                        {{ parseFloat(scanPercentage.toFixed(2)) }}%
                    </div>
                </div>
            </div>

        </div>
        <!-- <span>{{ scanObject }}</span> -->
    </div>
</template>
<script setup lang="ts">
import { ref, inject, Ref, computed, provide, watch, watchEffect } from "vue";
import { convertBytesToSize, convertSecondsToString } from "../../composables/helpers";
import { loadScanObject } from '../../composables/loadData';
import CircleProgress from "./CircleProgress.vue";

interface StatusProps {
    poolName: string;
}

const props = defineProps<StatusProps>();
const operationRunning = ref(false);
const operationCompleted = ref(false);
const paused = ref(false);
const scanObject = inject<Ref<PoolScanObject>>('scan-object')!;

//method to repeatedly check scan object
async function continuousScanCheck() {
    if (!operationCompleted) {
        setInterval(async () => {
            await loadScanObject(scanObject, props.poolName);
            console.log('continuous scan object:', scanObject.value);
        }, 5000);
    }
}

//method to check scan object on first load, and if scanning, then repeatedly check
async function scanOnLoad() {
    await loadScanObject(scanObject, props.poolName);
    console.log('scan@load object:', scanObject.value);
    if (isScanning.value) {
        operationRunning.value = true;
        continuousScanCheck();
    } else {
        operationRunning.value = false;
    }
}

//method to check scan when user input is given (click on resilver, scrub, or refresh)
async function scanOnInput() {
    await loadScanObject(scanObject, props.poolName);
    console.log('scan@input object:', scanObject.value);
    if (isScanning.value) {
        operationRunning.value = true;
        continuousScanCheck();
    } else {
        operationRunning.value = false;
    }
}

scanOnLoad();

const isScanning = computed(() => {
    return scanObject.value.state === 'SCANNING';
});

const isPaused = computed(() => {
    return scanObject.value.pause !== 'None';
});

//scan function : NONE | SCRUB | RESILVER
const scanFunction = computed(() => {
    switch (scanObject.value.function) {
        case 'RESILVER':
            return 'Resilvering';
        case 'SCRUB':
            return 'Scrubbing';
        case 'NONE':
            return 'Nothing';
        default:
            return;
    }
});

//scan state: NONE | SCANNING | FINISHED | CANCELED
const stateMessage = computed(() => {
    switch (scanObject.value.state) {
        case 'SCANNING':
            return `${scanObject.value.function} in progress at ${scanObject.value.start_time}`;
        case 'FINISHED':
            return `${scanObject.value.function} finished at ${scanObject.value.end_time}`;
        case 'CANCELED':
            return `${scanObject.value.function} canceled at ${scanObject.value.end_time}`;
        case 'NONE':
            return 'None';
        default:
            return '';
    }
});

const scanPercentage = computed(() => {
    return scanObject.value.percentage;
});

const amountProcessed = computed(() => {
    return convertBytesToSize(scanObject.value.bytes_issued);
});

const amountTotal = computed(() => {
    return convertBytesToSize(scanObject.value.bytes_processed);
});

const timeRemaining = computed(() => {
    return convertSecondsToString(scanObject.value.total_secs_left);
});

watch(scanObject, (newVal, oldVal) => {
    operationRunning.value = isScanning.value;
    operationCompleted.value = newVal.state === 'FINISHED' || newVal.state === 'CANCELED';
    paused.value = isPaused.value;

});

</script>