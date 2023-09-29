<template>
    <div>
        <div v-if="!isPoolList">
            <div class="grid grid-cols-4 gap-1 justify-items-center">

                <span class="col-span-4" :class="stateMessageClass()">
                    {{ stateMessage }}
                </span>
        
                <div class="col-span-4 min-w-max w-full bg-well rounded-full relative flex h-6 min-h-min max-h-max overflow-hidden">
                    <div :class="progressBarClass()" class="h-6 min-h-min max-h-max" :style="{ width: `${parseFloat(scanPercentage.toFixed(2))}%` }">
                        <div class="absolute inset-0 flex items-center justify-center text-s font-medium text-default text-center p-0.5 leading-none">
                            {{ parseFloat(scanPercentage.toFixed(2)) }}%
                        </div>
                    </div>
                </div>

                <span class="text-muted col-span-4">
                    {{ amountProcessed }} of {{ amountTotal }} processed. <br/>
                </span>

                <span v-if="isScanning && !isPaused" class="col-span-4">
                    Completes in {{ timeRemaining }}.
                </span>

            </div>
        </div>

        <div v-if="isPoolList">
            <div class="grid-grid-cols-2 gap-0.5 justify items-center">
                <span class="col-span-2" :class="stateMessageClass()">
                    {{ scanObject.function }} {{ scanObject.state }}
                </span>
                <span>
                    <span v-if="isScanning && !isPaused" class="col-span-2">
                        Completes in {{ timeRemaining }}.
                    </span>
                </span>
            </div>
        </div>
        
    </div>
</template>
<script setup lang="ts">
import { ref, inject, Ref, computed, provide, watch, watchEffect } from "vue";
import { convertBytesToSize, convertSecondsToString } from "../../composables/helpers";

interface StatusProps {
    isPoolList: boolean;
}

const props = defineProps<StatusProps>();
const notifications = inject<Ref<any>>('notifications')!;

const scanObject = inject<Ref<PoolScanObject>>('scan-object')!;
const isScanning = inject<Ref<boolean>>('is-scanning')!;
const isFinished = inject<Ref<boolean>>('is-finished')!;
const isCanceled = inject<Ref<boolean>>('is-canceled')!;
const isPaused = inject<Ref<boolean>>('is-paused')!;

const emit = defineEmits(['scan_now', 'scan_continuous']);

const scanContinuous = () => {
    emit('scan_continuous');
}

const scanNow = () => {
    emit('scan_now');
}

scanNow();

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
    if (scanObject.value.pause !== 'None') {
       return `${scanObject.value.function} paused at ${scanObject.value.pause}`;
    } else {
        switch (scanObject.value.state) {
            case 'SCANNING':
                return `${scanObject.value.function} started at ${scanObject.value.start_time}`;
            case 'FINISHED':
                return `${scanObject.value.function} finished at ${scanObject.value.end_time}`;
            case 'CANCELED':
                return `${scanObject.value.function} canceled at ${scanObject.value.end_time}`;
            case 'NONE':
                return 'None';
            default:
                return '';
        }
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

function stateMessageClass() {
    if (scanObject.value.pause === 'None') {
        switch (scanObject.value.state) {
            case 'SCANNING':
                return 'text-default';
            case 'FINISHED':
                return 'text-success'; 
            case 'CANCELED':
                return 'text-danger'; 
            case 'NONE':
                return 'text-muted';
            default:
                return 'text-default'; 
        } 
    } else {
        return 'text-orange-600'
    }
}

function progressBarClass() {
    if (scanObject.value.pause === 'None') {
        switch (scanObject.value.state) {
            case 'SCANNING':
                return 'bg-green-600';
            case 'FINISHED':
                return 'bg-green-600'; 
            case 'CANCELED':
                return 'bg-danger'; 
            case 'NONE':
                return 'text-muted';
            default:
                return 'text-default'; 
        }
    } else {
        return 'bg-orange-600';
    }
   
}

watch(scanObject, (newVal, oldVal) => {
    if (scanObject.value.state === 'SCANNING') {
        scanContinuous();
    }

    //notifications : 'info' | 'warning' | 'error' | 'success' | 'denied';
    if (scanObject.value.state === 'FINISHED') {
        notifications.value.constructNotification('Scrub Completed', stateMessage.value, 'success');
    } else if (scanObject.value.state === 'CANCELED') {
        notifications.value.constructNotification('Scrub Completed', stateMessage.value, 'denied');
    }
});

</script>